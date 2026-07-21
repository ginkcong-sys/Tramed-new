
-- Cache bảng cho embedding + câu trả lời AI để giảm gọi AI Gateway
CREATE TABLE public.ai_cache (
  key TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  embedding vector(1536),
  payload JSONB,
  hits INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ai_cache TO anon;
GRANT SELECT, INSERT, UPDATE ON public.ai_cache TO authenticated;
GRANT ALL ON public.ai_cache TO service_role;

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

-- Public read (cache là dữ liệu chia sẻ, không nhạy cảm)
CREATE POLICY "ai_cache public read" ON public.ai_cache FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ai_cache service write" ON public.ai_cache FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX ai_cache_kind_idx ON public.ai_cache(kind);
