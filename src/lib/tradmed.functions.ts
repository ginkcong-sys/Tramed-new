import { createServerFn } from "@tanstack/react-start";
import { llmChat } from "./llm.server";
import { vertexChat, hasVertex } from "./vertex.server";
import { MODEL_PRO, MODEL_FLASH, MODEL_LITE } from "./llm-config.server";

export type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

async function callAI(model: string, messages: ChatMsg[]): Promise<string> {
  const errors: string[] = [];

  // 1) Vertex AI (primary)
  if (hasVertex()) {
    try {
      return await vertexChat(messages);
    } catch (e) {
      const msg = (e as Error).message;
      console.warn("[callAI] Vertex lỗi, thử fallback LLM:", msg);
      errors.push("Vertex: " + msg);
    }
  }

  // 2) LLM nội bộ (fallback)
  if (process.env.LLM_API_KEY) {
    try {
      return await llmChat({ model, messages });
    } catch (e) {
      const llmError = e as Error;
      const quotaLike = /RESOURCE_EXHAUSTED|quota|rate limit|HẾT QUOTA|vượt giới hạn/i.test(llmError.message);
      if (quotaLike && model !== MODEL_LITE) {
        try {
          return await llmChat({ model: MODEL_LITE, messages });
        } catch (liteError) {
          errors.push("LLM lite: " + (liteError as Error).message);
        }
      } else {
        errors.push("LLM: " + llmError.message);
      }
    }
  }

  throw new Error(
    errors.length
      ? "Tất cả backend AI đều lỗi. Chi tiết:\n• " + errors.join("\n• ")
      : "Chưa cấu hình backend AI khả dụng.",
  );
}

export type KnowledgeRef = {
  source: string;
  page: number | null;
  content: string;
  similarity: number;
};

const SYSTEM_PROMPT = `Bạn là TRAMED – trợ lý y khoa lâm sàng kết hợp Y học cổ truyền (YHCT) và Y học hiện đại (YHHĐ) Việt Nam, hỗ trợ thầy thuốc trong biện chứng, kê đơn, châm cứu và cảnh báo tương tác Đông – Tây y.

NGUYÊN TẮC:
1. Lý luận theo Bát cương, Tạng phủ, Khí huyết – Tân dịch, Lục dâm, Tứ chẩn.
2. Kê đơn YHCT theo Quân – Thần – Tá – Sứ; ghi rõ tính – vị – quy kinh, liều (g), cách sắc/uống.
3. Châm cứu: ghi rõ huyệt chủ – huyệt phối, thủ pháp bổ/tả, lưu kim, liệu trình, kỹ thuật (hào châm/điện châm/cứu/nhĩ châm).
4. Đơn YHHĐ: chẩn đoán theo ICD nếu có, mỗi thuốc có tên gốc + hoạt chất + liều + đường dùng + số ngày + ghi chú; đề xuất cận lâm sàng cần thiết.
5. CẢNH BÁO BẮT BUỘC (in đậm, riêng 1 khối): (a) dị ứng thuốc của bệnh nhân, (b) Thập bát phản – Thập cửu úy, (c) tương tác Đông–Tây y (vd Warfarin × Đan sâm/Đương quy), (d) chống chỉ định thai sản – suy gan – suy thận – bệnh nền.
6. KHI ĐƯỢC CUNG CẤP "Trích giáo trình", PHẢI ưu tiên đối chiếu và dẫn nguồn dạng [Sách · trang]. Không bịa nguồn.
7. Trả lời tiếng Việt, Markdown có cấu trúc rõ; kết bằng dòng: "⚠️ Đề xuất tham khảo – quyết định cuối cùng thuộc về thầy thuốc lâm sàng."`;

async function sha256Hex(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const h = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function cacheGet(key: string): Promise<{ embedding?: number[]; payload?: unknown } | null> {
  try {
    const url = process.env.SUPABASE_URL!;
    const srv = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!srv) return null;
    const res = await fetch(`${url}/rest/v1/ai_cache?key=eq.${encodeURIComponent(key)}&select=embedding,payload`, {
      headers: { apikey: srv, Authorization: `Bearer ${srv}` },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || !rows.length) return null;
    fetch(`${url}/rest/v1/ai_cache?key=eq.${encodeURIComponent(key)}`, {
      method: "PATCH",
      headers: { apikey: srv, Authorization: `Bearer ${srv}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ last_used_at: new Date().toISOString() }),
    }).catch(() => {});
    const row = rows[0];
    let emb: number[] | undefined;
    if (typeof row.embedding === "string") {
      try { emb = JSON.parse(row.embedding); } catch { /* */ }
    } else if (Array.isArray(row.embedding)) emb = row.embedding;
    return { embedding: emb, payload: row.payload };
  } catch { return null; }
}

async function cachePut(key: string, kind: string, fields: { embedding?: number[]; payload?: unknown }): Promise<void> {
  try {
    const url = process.env.SUPABASE_URL!;
    const srv = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!srv) return;
    const body: Record<string, unknown> = { key, kind };
    if (fields.embedding) body.embedding = `[${fields.embedding.join(",")}]`;
    if (fields.payload !== undefined) body.payload = fields.payload;
    await fetch(`${url}/rest/v1/ai_cache`, {
      method: "POST",
      headers: {
        apikey: srv, Authorization: `Bearer ${srv}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(body),
    });
  } catch { /* cache write failure không quan trọng */ }
}

async function embed(query: string): Promise<number[] | null> {
  // Vector embedding đã bị disable – dùng localSearch (keyword) làm đường chính.
  // Để bật lại sau, cấu hình một embedding backend tương thích chiều vector hiện có trong DB.
  void query;
  return null;
}

async function fetchKnowledge(query: string, k = 6): Promise<KnowledgeRef[]> {
  const vec = await embed(query);
  if (!vec) return [];
  try {
    const url = process.env.SUPABASE_URL!;
    const anon = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const res = await fetch(`${url}/rest/v1/rpc/match_knowledge`, {
      method: "POST",
      headers: { apikey: anon, Authorization: `Bearer ${anon}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query_embedding: vec, match_count: k, source_filter: null }),
    });
    if (!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  } catch { return []; }
}

// ============================================================
// LOCAL KEYWORD SEARCH – Không tốn credit AI
// Phân tích từ khoá, dò trực tiếp DB knowledge_chunks (ILIKE),
// gom các đoạn trích đủ điểm → trả lời dạng "trích sách".
// ============================================================
const VI_STOP = new Set([
  "của","cho","khi","như","với","trong","trên","dưới","và","là","một","các","những","này","đó","rất","không","được","phải","cần","hay","thì","mà","để","có","sẽ","đã","đang","bị","vì","do","nếu","nên","sau","trước","ngoài","người","bệnh","nhân","bác","sĩ","xin","vui","lòng","hãy","muốn","tôi","bạn","mình","gì","sao","thế","này","kia","ạ","ơi","nhé","và","hoặc","cả","mọi","từ","đến","theo","về","ra","vào","lại","nữa","thêm","cũng","còn","chỉ","chưa","mới","hơn","quá","lắm","ít","nhiều","như","bằng","tại","ở","bài","viết","câu","hỏi","trả","lời","giúp","làm","ơn",
]);

function viTokens(q: string): string[] {
  const toks = q.toLowerCase().split(/[^\p{L}0-9]+/u).filter(t => t.length >= 2 && !VI_STOP.has(t));
  return Array.from(new Set(toks)).slice(0, 14);
}

// Phân loại danh mục từ knowledgeQuery prefix hoặc nội dung
function detectCategory(query: string, userText: string): string {
  const blob = (query + " " + userText).toLowerCase();
  if (/châm cứu|huyệt|điện châm|hào châm|nhĩ châm|cứu ngải/.test(blob)) return "cham";
  if (/món ăn|bài thuốc ăn|dưỡng sinh|dinh dưỡng|thực đơn|kcal|calo|bữa /.test(blob)) return "dinhduong";
  if (/kê đơn|đơn thuốc|quân thần tá sứ|bài thuốc|vị thuốc|liều|sắc|tễ|hoàn|tán/.test(blob)) return "kedon";
  if (/thiệt chẩn|lưỡi|mạch|tứ chẩn|bát cương|tạng phủ|biện chứng|hội chứng|hư thực|hàn nhiệt/.test(blob)) return "luyluan";
  if (/nhi khoa|trẻ em|sơ sinh|trẻ nhỏ/.test(blob)) return "nhi";
  return "all";
}

const CATEGORY_SOURCES: Record<string, string[]> = {
  cham: ["Châm cứu – Huyệt thường dùng", "Nguyên tắc phối huyệt", "Châm cứu theo bệnh YHHĐ"],
  dinhduong: ["70 món ăn bài thuốc – Quỳnh Hương", "Âm dương và bữa ăn – Võ Thanh Phong"],
  kedon: ["Dược học cổ truyền", "Dược Lí Học – Y Hà Nội", "Bệnh học & Điều trị Nội khoa"],
  luyluan: ["Lý luận YHCT cơ bản", "Thiệt chẩn YHCT", "Bệnh học & Điều trị Nội khoa"],
  nhi: ["Nhi khoa YHCT", "Bệnh học & Điều trị Nội khoa"],
  all: [],
};

type RawChunk = { source: string; page: number | null; content: string };

async function localSearch(query: string, userText: string): Promise<{ chunks: Array<RawChunk & { score: number; hits: string[] }>; category: string; keywords: string[] }> {
  const keywords = viTokens(query + " " + userText);
  if (keywords.length < 2) return { chunks: [], category: "all", keywords };

  const category = detectCategory(query, userText);
  const sources = CATEGORY_SOURCES[category] ?? [];

  const url = process.env.SUPABASE_URL!;
  const anon = process.env.SUPABASE_PUBLISHABLE_KEY!;

  // Top 6 từ khoá dài nhất (đặc trưng nhất) làm OR ILIKE
  const probes = [...keywords].sort((a, b) => b.length - a.length).slice(0, 6);
  const orExpr = probes.map(k => `content.ilike.*${encodeURIComponent(k)}*`).join(",");
  const srcExpr = sources.length ? `&source=in.(${sources.map(s => `"${encodeURIComponent(s)}"`).join(",")})` : "";
  const u = `${url}/rest/v1/knowledge_chunks?select=source,page,content&or=(${orExpr})${srcExpr}&limit=400`;

  try {
    const res = await fetch(u, { headers: { apikey: anon, Authorization: `Bearer ${anon}` } });
    if (!res.ok) return { chunks: [], category, keywords };
    const rows = (await res.json()) as RawChunk[];
    if (!Array.isArray(rows) || !rows.length) return { chunks: [], category, keywords };

    // Chấm điểm: số keyword phân biệt khớp + log tần suất
    const scored = rows.map(r => {
      const text = r.content.toLowerCase();
      const hits: string[] = [];
      let freq = 0;
      for (const k of keywords) {
        const re = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        const m = text.match(re);
        if (m && m.length) { hits.push(k); freq += Math.log2(1 + m.length); }
      }
      return { ...r, hits, score: hits.length * 2 + freq };
    }).filter(r => r.hits.length >= 2);

    scored.sort((a, b) => b.score - a.score);

    // Khử trùng: không lấy >2 chunk cùng trang cùng nguồn
    const seen = new Map<string, number>();
    const top: typeof scored = [];
    for (const r of scored) {
      const key = `${r.source}#${r.page ?? 0}`;
      const n = seen.get(key) ?? 0;
      if (n >= 2) continue;
      seen.set(key, n + 1);
      top.push(r);
      if (top.length >= 6) break;
    }
    return { chunks: top, category, keywords };
  } catch {
    return { chunks: [], category, keywords };
  }
}

function buildLocalAnswer(
  chunks: Array<RawChunk & { score: number; hits: string[] }>,
  category: string,
  keywords: string[],
): string {
  const catLabel: Record<string, string> = {
    cham: "Châm cứu – Huyệt vị",
    dinhduong: "Dinh dưỡng – Món ăn bài thuốc",
    kedon: "Kê đơn – Bài thuốc",
    luyluan: "Lý luận YHCT – Biện chứng",
    nhi: "Nhi khoa YHCT",
    all: "Tham chiếu giáo trình",
  };

  const header = `## 📖 ${catLabel[category] ?? "Tham chiếu"} – Trích giáo trình\n\n` +
    `> Trả lời tổng hợp **trực tiếp từ kho dữ liệu giáo trình đã huấn luyện** (không gọi AI). ` +
    `Từ khoá nhận diện: \`${keywords.slice(0, 8).join("` · `")}\`.\n\n`;

  const body = chunks.map((c, i) => {
    const src = `**[${i + 1}] ${c.source}${c.page ? ` · tr.${c.page}` : ""}**`;
    const hit = c.hits.length ? `  \n*Khớp:* ${c.hits.map(h => `\`${h}\``).join(" · ")}` : "";
    return `### Trích đoạn ${i + 1}\n${src}${hit}\n\n${c.content.trim()}\n`;
  }).join("\n---\n\n");

  const footer = `\n\n---\n\n⚠️ *Nội dung trên là trích nguyên văn từ giáo trình theo từ khoá; ` +
    `thầy thuốc cần đối chiếu lâm sàng, biện chứng cá thể hoá trước khi áp dụng. ` +
    `Quyết định cuối cùng thuộc về thầy thuốc lâm sàng.*`;

  return header + body + footer;
}

export const tradmedChat = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: ChatMsg[]; knowledgeQuery?: string; forceAI?: boolean }) => d)
  .handler(async ({ data }): Promise<{ content: string; citations: KnowledgeRef[]; cached?: boolean; localOnly?: boolean }> => {

    const userText = data.messages.filter(m => m.role === "user").map(m => m.content).join(" ");

    // ===== BƯỚC 1: thử trả lời cục bộ bằng keyword search (KHÔNG tốn credit) =====
    // ===== Phát hiện độ phức tạp câu hỏi =====
    // Câu phức tạp = dài, nhiều dấu ?, đa chủ đề, yêu cầu tổng hợp/so sánh/cá thể hoá,
    // hoặc yêu cầu kê đơn cụ thể có nhiều ràng buộc bệnh nền/dị ứng/đa thuốc.
    const COMPLEX_RX = /(so sánh|phân tích|tổng hợp|đánh giá|tương tác|biện luận|cá thể hoá|cá thể hóa|phối hợp|kết hợp|vì sao|tại sao|giải thích|đề xuất|hiệu chỉnh|chống chỉ định|liều|warfarin|suy gan|suy thận|thai|cho con bú|đa bệnh)/i;
    const wordCount = userText.split(/\s+/).filter(Boolean).length;
    const questionMarks = (userText.match(/\?/g) || []).length;
    const isComplex = wordCount > 80 || questionMarks >= 2 || COMPLEX_RX.test(userText);

    if (!data.forceAI && (data.knowledgeQuery || userText)) {
      const { chunks, category, keywords } = await localSearch(data.knowledgeQuery || "", userText);

      // Câu ĐƠN GIẢN → ngưỡng dễ (≥2 đoạn, đoạn đầu ≥2 keyword, điểm ≥4)
      // Câu PHỨC TẠP → vẫn ưu tiên local nếu khớp RẤT mạnh (≥4 đoạn, ≥4 keyword, ≥10đ);
      //                ngược lại nhường AI để biện luận/tổng hợp.
      const okSimple  = chunks.length >= 2 && chunks[0]?.hits.length >= 2 && chunks[0]?.score >= 4;
      const okComplex = chunks.length >= 4 && chunks[0]?.hits.length >= 4 && chunks[0]?.score >= 10;
      const useLocal = isComplex ? okComplex : okSimple;

      if (useLocal) {
        const content = buildLocalAnswer(chunks, category, keywords);
        const citations: KnowledgeRef[] = chunks.map(c => ({
          source: c.source,
          page: c.page,
          content: c.content,
          similarity: Math.min(1, c.score / 20),
        }));
        return { content, citations, cached: false, localOnly: true };
      }
    }


    // ===== BƯỚC 2: fallback → RAG bằng embedding + AI =====
    const citations: KnowledgeRef[] = data.knowledgeQuery
      ? await fetchKnowledge(data.knowledgeQuery, 8)
      : [];

    const answerKey = "ans:" + await sha256Hex(
      JSON.stringify(data.messages) + "|" + citations.map(c => `${c.source}#${c.page}`).join(","),
    );
    const cachedAns = await cacheGet(answerKey);
    if (cachedAns?.payload && typeof (cachedAns.payload as { content?: string }).content === "string") {
      return { content: (cachedAns.payload as { content: string }).content, citations, cached: true };
    }

    const messages: ChatMsg[] = [{ role: "system", content: SYSTEM_PROMPT }];
    if (citations.length) {
      const block = citations
        .map((c, i) => `[${i + 1}] ${c.source}${c.page ? ` · tr.${c.page}` : ""} (sim=${c.similarity.toFixed(2)})\n${c.content}`)
        .join("\n\n---\n\n");
      messages.push({
        role: "system",
        content: `# Trích giáo trình (tham chiếu BẮT BUỘC – đối chiếu khi sinh toa, dẫn nguồn dạng [n]):\n\n${block}`,
      });
    }
    messages.push(...data.messages);

    const content = await callAI(MODEL_FLASH, messages);
    cachePut(answerKey, "answer", { payload: { content } });
    return { content, citations, cached: false };
  });


// ============================================================
// AI PHÂN TÍCH ĐƠN THUỐC TÂN DƯỢC
// → Phân tích liều · tương tác thuốc-thuốc · tương tác thuốc-bệnh
// ============================================================
export const analyzeDrugRx = createServerFn({ method: "POST" })
  .inputValidator((d: {
    drugs: string;           // danh sách thuốc (mỗi dòng 1 thuốc)
    chanDoan?: string;       // chẩn đoán YHHĐ
    tienSu?: string;         // bệnh nền
    diUng?: string;          // dị ứng
    age?: string;            // tuổi/năm sinh
    gender?: string;
  }) => d)
  .handler(async ({ data }): Promise<{ content: string }> => {

    const prompt = `Bạn là DƯỢC SĨ LÂM SÀNG. Phân tích đơn thuốc tân dược sau cho thầy thuốc, trình bày Markdown ngắn gọn nhưng đầy đủ.

## BỐI CẢNH BỆNH NHÂN
- Tuổi/năm sinh: ${data.age || "?"}  · Giới: ${data.gender || "?"}
- Chẩn đoán YHHĐ: ${data.chanDoan || "(chưa có)"}
- Bệnh nền / Tiền sử: ${data.tienSu || "(không)"}
- Dị ứng đã ghi nhận: ${data.diUng || "(không)"}

## ĐƠN THUỐC ĐANG KÊ
${data.drugs || "(trống)"}

## YÊU CẦU TRẢ LỜI – đúng cấu trúc 3 phần:

### 1. ⚖️ PHÂN TÍCH LIỀU
Với MỖI thuốc: ghi liều đã kê → so sánh khoảng liều khuyến cáo cho người lớn (mg/24h) → kết luận: **HỢP LÝ / THẤP / QUÁ LIỀU**. Nếu có suy thận/suy gan/cao tuổi → đề xuất hiệu chỉnh liều cụ thể.

### 2. 🔁 TƯƠNG TÁC THUỐC – THUỐC
Liệt kê TỪNG CẶP có tương tác (kể cả nhẹ). Mỗi cặp ghi:
- **Cặp**: Thuốc A × Thuốc B
- **Mức độ**: 🔴 NẶNG / 🟡 TRUNG BÌNH / 🟢 NHẸ
- **Cơ chế**: giải thích ngắn (CYP450, dược lực học, hiệp đồng…)
- **Hậu quả lâm sàng**: triệu chứng/biến chứng cụ thể
- **Xử trí**: theo dõi gì, đổi thuốc nào, giãn giờ ra sao
Nếu KHÔNG có tương tác → ghi rõ "✓ Không phát hiện tương tác đáng kể."

### 3. 🧬 TƯƠNG TÁC THUỐC – BỆNH NỀN
Đối chiếu mỗi thuốc với bệnh nền & dị ứng của bệnh nhân. Cảnh báo:
- Chống chỉ định (CCĐ tuyệt đối/tương đối)
- Thận trọng cần theo dõi xét nghiệm gì
- Đề xuất thay thế nếu cần

Kết bằng dòng: "⚠️ Đề xuất tham khảo – quyết định cuối cùng thuộc về thầy thuốc lâm sàng."`;

    const content = await callAI(MODEL_FLASH, [
      { role: "system", content: "Bạn là dược sĩ lâm sàng Việt Nam, phân tích đơn thuốc chính xác, có dẫn cơ chế." },
      { role: "user", content: prompt },
    ]);
    return { content };
  });

// ============================================================
// AI ĐỊNH LƯỢNG NGUYÊN LIỆU & TÍNH DINH DƯỠNG THỰC ĐƠN
// ============================================================
export type MealIngredient = {
  name: string; qty: string;
  kcal: number; p: number; l: number; g: number;
  fiber: number; na: number; k: number; ca: number; fe: number;
  vitamins: string; note: string;
};
export type MealSection = {
  name: string; emoji: string; description: string;
  ingredients: MealIngredient[];
  total: { kcal: number; p: number; l: number; g: number; fiber: number; na: number; k: number; ca: number; fe: number; vitamins: string };
};
export type MealPlan = {
  tdee: {
    bmr: number; tdee: number; kcalTarget: number;
    protein: { g: number; gPerKg: number };
    lipid: { g: number; pctKcal: number };
    glucid: { g: number; pctKcal: number };
    notes: string;
  };
  meals: MealSection[];
  dayTotal: { kcal: number; p: number; l: number; g: number; fiber: number; na: number; k: number; ca: number; fe: number; vitC: number; vitA: number; evaluation: string };
  recommendations: { kcal: string; p: string; l: string; g: string; fiber: string; na: string; k: string; ca: string; fe: string; vitC: string; vitA: string };
  warnings: string[];
  yhctNote: string;
  disclaimer: string;
};

function stripJsonFences(s: string): string {
  return s.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
}

export const analyzeMealPlan = createServerFn({ method: "POST" })
  .inputValidator((d: {
    sang: string; trua: string; toi: string;
    canNang?: string; chieuCao?: string; age?: string; gender?: string;
    activity?: string;
    goal?: string;
    chanDoan?: string; tienSu?: string; diUng?: string;
    monAn?: string;
    nguyenTac?: string;
  }) => d)
  .handler(async ({ data }): Promise<{ plan: MealPlan | null; content: string }> => {

    const goalLabel: Record<string, string> = {
      duy_tri: "Duy trì cân nặng (TDEE cân bằng)",
      giam_can: "Giảm cân (thâm hụt 15–20% kcal, ưu tiên Protein ≥1.6 g/kg, giảm tinh bột tinh)",
      tang_can: "Tăng cân (thặng dư 10–15% kcal, đủ chất béo lành mạnh + Protein 1.5 g/kg)",
      tang_co: "Tăng cơ – giữ mỡ (thặng dư nhẹ 5–10% kcal, Protein 1.8–2.2 g/kg)",
    };
    const goal = goalLabel[data.goal || "duy_tri"] || goalLabel.duy_tri;
    const pal = data.activity || "1.3";

    const prompt = `Bạn là CHUYÊN GIA DINH DƯỠNG LÂM SÀNG (YHCT + YHHĐ). Định lượng nguyên liệu CỤ THỂ và tính năng lượng – đa lượng – vi chất cho thực đơn dưới đây.

## BỆNH NHÂN
- Cân nặng: ${data.canNang || "?"} kg · Cao: ${data.chieuCao || "?"} cm · Tuổi: ${data.age || "?"} · Giới: ${data.gender || "?"}
- Hệ số hoạt động (PAL): ${pal}
- Mục tiêu: ${goal}
- Chẩn đoán: ${data.chanDoan || "(chưa có)"}
- Bệnh nền: ${data.tienSu || "(không)"} · Dị ứng: ${data.diUng || "(không)"}
- Nguyên tắc YHCT: ${data.nguyenTac || "(không)"}
- Món bài thuốc gợi ý: ${data.monAn || "(không)"}

## THỰC ĐƠN 3 CỮ
- Sáng: ${data.sang || "(trống)"}
- Trưa: ${data.trua || "(trống)"}
- Tối:  ${data.toi || "(trống)"}

## YÊU CẦU
Tính TDEE Mifflin-St Jeor × PAL ${pal}, điều chỉnh theo mục tiêu & bệnh nền. Định lượng CỤ THỂ (g/ml) từng nguyên liệu (KHÔNG "vừa đủ"). Số liệu theo bảng thành phần thực phẩm Việt Nam (Viện Dinh Dưỡng).

## ĐỊNH DẠNG TRẢ VỀ – BẮT BUỘC
Trả về DUY NHẤT một JSON object hợp lệ. KHÔNG markdown, KHÔNG codefence, KHÔNG bất kỳ chữ nào ngoài JSON. Schema:

{
  "tdee": {
    "bmr": <number>, "tdee": <number>, "kcalTarget": <number>,
    "protein": { "g": <number>, "gPerKg": <number> },
    "lipid":   { "g": <number>, "pctKcal": <number> },
    "glucid":  { "g": <number>, "pctKcal": <number> },
    "notes": "<điều chỉnh theo bệnh nền nếu có>"
  },
  "meals": [
    {
      "name": "BỮA SÁNG", "emoji": "🍳",
      "description": "<mô tả ngắn>",
      "ingredients": [
        { "name": "<tên>", "qty": "<vd: 60 g>",
          "kcal": <num>, "p": <num>, "l": <num>, "g": <num>,
          "fiber": <num>, "na": <num>, "k": <num>, "ca": <num>, "fe": <num>,
          "vitamins": "<vd: B1, B3>", "note": "<cách dùng>" }
      ],
      "total": { "kcal": <num>, "p": <num>, "l": <num>, "g": <num>,
                 "fiber": <num>, "na": <num>, "k": <num>, "ca": <num>, "fe": <num>,
                 "vitamins": "<Vit C 98mg, Vit A 852μg>" }
    },
    { "name": "BỮA TRƯA", "emoji": "🍱", ... },
    { "name": "BỮA TỐI",  "emoji": "🍵", ... }
  ],
  "dayTotal": {
    "kcal": <num>, "p": <num>, "l": <num>, "g": <num>,
    "fiber": <num>, "na": <num>, "k": <num>, "ca": <num>, "fe": <num>,
    "vitC": <num>, "vitA": <num>,
    "evaluation": "<đạt/thiếu/thừa % so mục tiêu>"
  },
  "recommendations": {
    "kcal": "<mục tiêu>", "p": "<g>", "l": "<g>", "g": "<g>",
    "fiber": "25–30 g", "na": "<2000 mg (THA <1500)>",
    "k": "3500–4700 mg", "ca": "800–1000 mg",
    "fe": "Nam 10 / Nữ 18 mg", "vitC": "75–90 mg", "vitA": "700–900 μg RAE"
  },
  "warnings": ["<cảnh báo 1>", "<cảnh báo 2>"],
  "yhctNote": "<đối chiếu hàn-nhiệt, hư-thực>",
  "disclaimer": "Đề xuất tham khảo – quyết định cuối cùng thuộc về thầy thuốc lâm sàng."
}

QUY TẮC SỐ:
- kcal: số nguyên. Đa lượng & xơ: 1 chữ số thập phân. Vi chất: số nguyên.
- Thiếu cân/cao/tuổi → dùng giả định trung bình người Việt + ghi vào tdee.notes.
- Mỗi bữa tối thiểu 3 nguyên liệu.`;

    try {
      const raw = await callAI(MODEL_PRO, [
        { role: "system", content: "Bạn là chuyên gia dinh dưỡng lâm sàng Việt Nam. Chỉ trả về JSON hợp lệ, không thêm chữ nào ngoài JSON." },
        { role: "user", content: prompt },
      ]);

      const cleaned = stripJsonFences(raw);
      try {
        const plan = JSON.parse(cleaned) as MealPlan;
        return { plan, content: "" };
      } catch {
        const m = cleaned.match(/\{[\s\S]*\}/);
        if (m) {
          try { return { plan: JSON.parse(m[0]) as MealPlan, content: "" }; } catch { /* fall through */ }
        }
        console.warn("[analyzeMealPlan] JSON parse fail, fallback markdown");
        return { plan: null, content: raw };
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      console.error("[analyzeMealPlan] AI fail:", msg);
      return {
        plan: null,
        content: `## ⚠️ AI tạm thời không khả dụng\n\n**Chi tiết:** ${msg}\n\nVui lòng thử lại sau vài phút.`,
      };
    }
  });

