
create or replace function public.match_knowledge(
  query_embedding vector(1536),
  match_count int default 6,
  source_filter text default null
)
returns table (
  id uuid,
  source text,
  page int,
  content text,
  similarity float
)
language sql stable
security invoker
set search_path = public
as $$
  select k.id, k.source, k.page, k.content,
         1 - (k.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks k
  where source_filter is null or k.source = source_filter
  order by k.embedding <=> query_embedding
  limit match_count
$$;
