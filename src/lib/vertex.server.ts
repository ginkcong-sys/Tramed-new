// Vertex AI client (Cloudflare Worker compatible)
// - Tự sign JWT RS256 bằng Web Crypto (crypto.subtle) để lấy OAuth2 access_token
// - Gọi Vertex AI generateContent
// - Cache access_token trong memory ~50 phút

import type { ChatMessage } from "./llm.server";

type ServiceAccount = {
  client_email: string;
  private_key: string;
  project_id: string;
  token_uri: string;
};

let cachedToken: { token: string; exp: number } | null = null;
let cachedSA: ServiceAccount | null = null;

function loadSA(): ServiceAccount {
  if (cachedSA) return cachedSA;
  const raw = process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Thiếu GCP_SERVICE_ACCOUNT_JSON");
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) {
    const err = new Error(
      `GCP_SERVICE_ACCOUNT_JSON không phải JSON (bắt đầu bằng "${trimmed.slice(0, 20)}..."). Hãy paste TOÀN BỘ file JSON service account (gồm cả dấu { và }), không chỉ riêng phần private key.`,
    );
    (err as Error & { configError?: boolean }).configError = true;
    throw err;
  }
  let sa: ServiceAccount;
  try {
    sa = JSON.parse(trimmed) as ServiceAccount;
  } catch (e) {
    const err = new Error(`GCP_SERVICE_ACCOUNT_JSON JSON không hợp lệ: ${(e as Error).message}`);
    (err as Error & { configError?: boolean }).configError = true;
    throw err;
  }
  if (!sa.client_email || !sa.private_key || !sa.project_id) {
    const err = new Error("GCP_SERVICE_ACCOUNT_JSON thiếu trường client_email/private_key/project_id");
    (err as Error & { configError?: boolean }).configError = true;
    throw err;
  }
  cachedSA = sa;
  return sa;
}

function b64urlEncode(data: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof data === "string") bytes = new TextEncoder().encode(data);
  else if (data instanceof Uint8Array) bytes = data;
  else bytes = new Uint8Array(data);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token;

  const sa = loadSA();
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: sa.token_uri || "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const signingInput = `${b64urlEncode(JSON.stringify(header))}.${b64urlEncode(JSON.stringify(claim))}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput));
  const jwt = `${signingInput}.${b64urlEncode(sig)}`;

  const res = await fetch(claim.aud, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Vertex OAuth lỗi ${res.status}: ${t.slice(0, 400)}`);
  }
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: j.access_token, exp: now + (j.expires_in || 3600) };
  return j.access_token;
}

function toVertexBody(messages: ChatMessage[]) {
  const systemTexts: string[] = [];
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
  for (const m of messages) {
    if (m.role === "system") systemTexts.push(m.content);
    else
      contents.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      });
  }
  const body: Record<string, unknown> = {
    contents,
    // Tắt "thinking" để giảm latency mạnh (đây là nguyên nhân chính gây 504 upstream timeout)
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      thinkingConfig: { thinkingBudget: 0 },
    },
  };
  if (systemTexts.length) body.systemInstruction = { parts: [{ text: systemTexts.join("\n\n") }] };
  return body;
}

// Vertex AI publisher models nội bộ (06/2026).
import { PROVIDER_PRO, PROVIDER_FLASH, PROVIDER_LITE } from "./llm-config.server";
const PRIMARY_MODEL = PROVIDER_FLASH;
const FALLBACK_MODEL = PROVIDER_LITE;

async function callVertexOnce(model: string, messages: ChatMessage[]): Promise<string> {
  const sa = loadSA();
  const location = process.env.GCP_VERTEX_LOCATION || "us-central1";
  const token = await getAccessToken();

  const host = location === "global" ? "aiplatform.googleapis.com" : `${location}-aiplatform.googleapis.com`;
  const url = `https://${host}/v1/projects/${sa.project_id}/locations/${location}/publishers/google/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(toVertexBody(messages)),
  });

  if (!res.ok) {
    const t = await res.text();
    let detail = t.slice(0, 500);
    try {
      const j = JSON.parse(t);
      const m = j?.error?.message;
      const status = j?.error?.status;
      if (m) detail = status ? `[${status}] ${m}` : m;
    } catch { /* keep raw */ }
    const err = new Error(`Vertex (${model}) lỗi ${res.status}: ${detail}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ?? "";
  return text;
}

export async function vertexChat(messages: ChatMessage[]): Promise<string> {
  try {
    return await callVertexOnce(PRIMARY_MODEL, messages);
  } catch (e) {
    const status = (e as Error & { status?: number }).status;
    const retriable = status === 429 || status === 503 || status === 502 || status === 500 || status === 404;
    if (!retriable) throw e;
    console.warn(`[vertex] ${PRIMARY_MODEL} fail (${status}), fallback ${FALLBACK_MODEL}:`, (e as Error).message);
    return await callVertexOnce(FALLBACK_MODEL, messages);
  }
}

/** Gọi Vertex với input là ảnh + text (dùng cho vọng chẩn lưỡi). */
export async function vertexImageChat(opts: {
  system: string;
  userText: string;
  imageBase64: string;
  mimeType: string;
}): Promise<string> {
  const sa = loadSA();
  const location = process.env.GCP_VERTEX_LOCATION || "us-central1";
  const token = await getAccessToken();
  const host = location === "global" ? "aiplatform.googleapis.com" : `${location}-aiplatform.googleapis.com`;

  const body = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: [{
      role: "user",
      parts: [
        { text: opts.userText },
        { inlineData: { mimeType: opts.mimeType, data: opts.imageBase64 } },
      ],
    }],
  };

  const tryModel = async (model: string) => {
    const url = `https://${host}/v1/projects/${sa.project_id}/locations/${location}/publishers/google/models/${model}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      let detail = t.slice(0, 400);
      try { detail = JSON.parse(t)?.error?.message || detail; } catch { /* ignore */ }
      const err = new Error(`Vertex (${model}) lỗi ${res.status}: ${detail}`);
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }
    const json = await res.json();
    return json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ?? "";
  };

  try {
    return await tryModel(PROVIDER_PRO);
  } catch (e) {
    const status = (e as Error & { status?: number }).status;
    if (status && [429, 503, 502, 500, 404].includes(status)) {
      console.warn(`[vertex-image] pro fail (${status}), fallback flash:`, (e as Error).message);
      return await tryModel(PROVIDER_FLASH);
    }
    throw e;
  }
}

export function hasVertex(): boolean {
  try {
    loadSA();
    return true;
  } catch {
    return false;
  }
}
