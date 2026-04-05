-- Wikipedia project Supabase schema
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor > New Query)

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table if not exists wiki_articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  content      text,
  excerpt      text,
  article_type text not null default 'article',
  infobox      jsonb,
  image_url    text,
  categories   text[],
  author_name  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists wiki_submissions (
  id           uuid primary key default gen_random_uuid(),
  slug         text,
  title        text not null,
  content      text,
  excerpt      text,
  article_type text not null default 'article',
  infobox      jsonb,
  image_url    text,
  categories   text[],
  author_name  text,
  status       text not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz
);

create table if not exists wiki_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text unique not null,
  created_at timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists wiki_articles_slug_idx         on wiki_articles (slug);
create index if not exists wiki_articles_article_type_idx on wiki_articles (article_type);
create index if not exists wiki_articles_categories_idx   on wiki_articles using gin (categories);

-- ─── Row-Level Security ───────────────────────────────────────────────────────

alter table wiki_articles    enable row level security;
alter table wiki_submissions enable row level security;
alter table wiki_categories  enable row level security;

-- Permissive policies for service role (the app uses the service role key)
create policy "service role full access on wiki_articles"
  on wiki_articles for all
  using (true)
  with check (true);

create policy "service role full access on wiki_submissions"
  on wiki_submissions for all
  using (true)
  with check (true);

create policy "service role full access on wiki_categories"
  on wiki_categories for all
  using (true)
  with check (true);

-- ─── Updated-at trigger ───────────────────────────────────────────────────────

create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_wiki_articles_updated_at
  before update on wiki_articles
  for each row execute function update_updated_at_column();

-- ─── Feature 2: Mosque article type ──────────────────────────────────────────

ALTER TABLE wiki_articles    ADD COLUMN IF NOT EXISTS mosque_data jsonb;
ALTER TABLE wiki_submissions ADD COLUMN IF NOT EXISTS mosque_data jsonb;

-- ─── Feature 3: Edit suggestions ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS wiki_edit_suggestions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug     text NOT NULL,
  article_title    text NOT NULL,
  suggested_content text NOT NULL,
  reason           text,
  suggester_name   text,
  status           text NOT NULL DEFAULT 'pending',
  submitted_at     timestamptz NOT NULL DEFAULT now(),
  reviewed_at      timestamptz
);

alter table wiki_edit_suggestions enable row level security;

create policy "service role full access on wiki_edit_suggestions"
  on wiki_edit_suggestions for all
  using (true)
  with check (true);

-- ─── Feature 3b: Extended edit suggestions (title, excerpt, categories) ─────

ALTER TABLE wiki_edit_suggestions ADD COLUMN IF NOT EXISTS suggested_title text;
ALTER TABLE wiki_edit_suggestions ADD COLUMN IF NOT EXISTS suggested_excerpt text;
ALTER TABLE wiki_edit_suggestions ADD COLUMN IF NOT EXISTS suggested_categories text[];

-- ─── Feature: Imam data column ──────────────────────────────────────────────

ALTER TABLE wiki_articles    ADD COLUMN IF NOT EXISTS imam_data jsonb;
ALTER TABLE wiki_submissions ADD COLUMN IF NOT EXISTS imam_data jsonb;

-- ─── Feature: Burial data column ────────────────────────────────────────────

ALTER TABLE wiki_articles    ADD COLUMN IF NOT EXISTS burial_data jsonb;
ALTER TABLE wiki_submissions ADD COLUMN IF NOT EXISTS burial_data jsonb;

-- ─── Feature 10: Full-text search ────────────────────────────────────────────

ALTER TABLE wiki_articles ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('french', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS wiki_articles_search_idx ON wiki_articles USING GIN(search_vector);

-- ─── Feature: References / Citations ────────────────────────────────────────

ALTER TABLE wiki_articles    ADD COLUMN IF NOT EXISTS "references" jsonb;
ALTER TABLE wiki_submissions ADD COLUMN IF NOT EXISTS "references" jsonb;

-- ─── Feature: Site settings (footer links, etc.) ─────────────────────────────

CREATE TABLE IF NOT EXISTS wiki_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wiki_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access on wiki_settings"
  ON wiki_settings FOR ALL
  USING (true)
  WITH CHECK (true);
