import { createServerFn } from "@tanstack/react-start";

export type KnowledgeHit = {
  id: string;
  source: string;
  page: number | null;
  content: string;
  similarity: number;
};

async function embed(_query: string): Promise<number[]> {
  // Embedding backend đã gỡ – searchKnowledge sẽ trả về [] và UI degrade về tìm kiếm từ khoá.
  throw new Error("embedding-disabled");
}

/** Tra cứu giáo trình theo nội dung biện chứng/toa hiện tại. */
export const searchKnowledge = createServerFn({ method: "POST" })
  .inputValidator((d: { query: string; k?: number; source?: string }) => d)
  .handler(async ({ data }): Promise<{ hits: KnowledgeHit[] }> => {
    const q = (data.query || "").trim();
    if (!q) return { hits: [] };
    try {
      const vec = await embed(q.slice(0, 2000));
      const url = process.env.SUPABASE_URL!;
      const anon = process.env.SUPABASE_PUBLISHABLE_KEY!;
      const res = await fetch(`${url}/rest/v1/rpc/match_knowledge`, {
        method: "POST",
        headers: {
          apikey: anon,
          Authorization: `Bearer ${anon}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_embedding: vec,
          match_count: data.k ?? 6,
          source_filter: data.source ?? null,
        }),
      });
      if (!res.ok) {
        console.error("match_knowledge lỗi", res.status, await res.text());
        return { hits: [] };
      }
      const rows = (await res.json()) as KnowledgeHit[];
      return { hits: Array.isArray(rows) ? rows : [] };
    } catch (e) {
      console.error("searchKnowledge fail:", e);
      return { hits: [] };
    }
  });
