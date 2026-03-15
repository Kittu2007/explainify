-- Enable vector extension
create extension if not exists vector with schema extensions;

-- Documents table
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  file_size integer,
  page_count integer,
  uploaded_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

-- Chunks table with vector embeddings
create table if not exists public.chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  content text not null,
  chunk_index integer not null,
  embedding vector(2048),  -- NVIDIA NeMoRetriever 300M outputs 2048 dimensions
  created_at timestamptz default now()
);

-- Note: vector index skipped — pgvector IVFFlat/HNSW max 2000 dims.
-- Sequential scan is performant at this project scale.

-- Index for document lookup
create index if not exists chunks_document_id_idx
  on public.chunks(document_id);

-- Row Level Security
alter table public.documents enable row level security;
alter table public.chunks enable row level security;

-- Allow service role full access
create policy "Service role full access on documents"
  on public.documents for all
  using (true)
  with check (true);

create policy "Service role full access on chunks"
  on public.chunks for all
  using (true)
  with check (true);
