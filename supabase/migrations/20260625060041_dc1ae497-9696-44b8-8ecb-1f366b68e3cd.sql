
GRANT INSERT, UPDATE ON public.ai_cache TO anon;
CREATE POLICY "ai_cache anon write" ON public.ai_cache FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "ai_cache anon update" ON public.ai_cache FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
