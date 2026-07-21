
DROP POLICY IF EXISTS "ai_cache anon update" ON public.ai_cache;
DROP POLICY IF EXISTS "ai_cache anon write" ON public.ai_cache;
DROP POLICY IF EXISTS "ai_cache public read" ON public.ai_cache;
DROP POLICY IF EXISTS "ai_cache service write" ON public.ai_cache;

REVOKE ALL ON public.ai_cache FROM anon, authenticated;
GRANT ALL ON public.ai_cache TO service_role;

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_cache service only" ON public.ai_cache
FOR ALL TO service_role USING (true) WITH CHECK (true);
