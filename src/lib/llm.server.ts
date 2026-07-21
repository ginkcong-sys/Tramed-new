// LLM client nội bộ (fallback khi Gateway hết credit).
import { PROVIDER_PRO, PROVIDER_FLASH, PROVIDER_LITE, llmEndpoint, llmApiKey } from "./llm-config.server";

export type ChatRole = "system" | "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

const LLM_MODEL_MAP: Record<string, string> = {
  [`google/${PROVIDER_PRO}`]: PROVIDER_PRO,
  [`google/${PROVIDER_FLASH}`]: PROVIDER_FLASH,
  [`google/${PROVIDER_LITE}`]: PROVIDER_LITE,
};

function toProviderModel(m: string): string {
  return LLM_MODEL_MAP[m] || m.replace(/^google\//, "");
}


export async function llmChat(opts: {
  model: string;
  messages: ChatMessage[];
}): Promise<string> {
  const key = llmApiKey();
  if (!key) throw new Error("Thiếu LLM_API_KEY");

  const model = toProviderModel(opts.model);
  const systemTexts: string[] = [];
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  for (const m of opts.messages) {
    if (m.role === "system") {
      systemTexts.push(m.content);
    } else {
      contents.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      });
    }
  }

  const body: Record<string, unknown> = { contents };
  if (systemTexts.length) {
    body.systemInstruction = { parts: [{ text: systemTexts.join("\n\n") }] };
  }

  const url = llmEndpoint(model);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    let detail = t.slice(0, 500);
    try {
      const j = JSON.parse(t);
      const m = j?.error?.message;
      const status = j?.error?.status;
      if (m) detail = status ? `[${status}] ${m}` : m;
    } catch { /* raw */ }

    if (res.status === 429) {
      throw new Error(`LLM nội bộ HẾT QUOTA (model ${model}) hoặc vượt rate-limit. Chi tiết: ${detail}`);
    }
    if (res.status === 403) {
      throw new Error(`LLM nội bộ từ chối key (403). Kiểm tra LLM_API_KEY. Chi tiết: ${detail}`);
    }
    if (res.status === 400) {
      throw new Error(`LLM nội bộ báo request sai (400) – model "${model}" không tồn tại/không hỗ trợ. Chi tiết: ${detail}`);
    }
    if (res.status === 503 || res.status === 502) {
      throw new Error(`LLM server đang quá tải (${res.status}). Thử lại sau. Chi tiết: ${detail}`);
    }
    throw new Error(`LLM nội bộ lỗi ${res.status}: ${detail}`);
  }

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ?? "";
  return text;
}
