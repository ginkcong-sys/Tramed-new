
create extension if not exists vector;

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  page int,
  chunk_idx int not null,
  content text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_chunks_embedding_idx
  on public.knowledge_chunks using hnsw (embedding vector_cosine_ops);

create index if not exists knowledge_chunks_source_idx on public.knowledge_chunks(source);

grant select on public.knowledge_chunks to anon, authenticated;
grant all on public.knowledge_chunks to service_role;

alter table public.knowledge_chunks enable row level security;

create policy "public read knowledge"
  on public.knowledge_chunks for select
  to anon, authenticated
  using (true);

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
as $$
  select k.id, k.source, k.page, k.content,
         1 - (k.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks k
  where source_filter is null or k.source = source_filter
  order by k.embedding <=> query_embedding
  limit match_count
$$;
