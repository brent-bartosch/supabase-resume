-- Resume Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Resume basics (single row)
create table if not exists resume_profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  headline text not null,
  location text,
  email text,
  phone text,
  linkedin_url text,
  github_url text,
  updated_at timestamptz not null default now()
);

-- Sections (Summary, Core Skills, Experience, etc.)
create table if not exists resume_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  sort_order int not null default 0
);

-- Items within sections (bullets/entries)
create table if not exists resume_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references resume_sections(id) on delete cascade,
  sort_order int not null default 0,
  item_type text not null default 'bullet',   -- 'bullet' | 'role' | 'line'
  org text,                                    -- company
  role text,
  dates text,
  location text,
  body text not null                           -- bullet text or paragraph
);

-- Stats table for the footer (real numbers from your projects)
create table if not exists resume_stats (
  id uuid primary key default gen_random_uuid(),
  stat_key text not null unique,
  stat_value text not null,
  stat_label text not null,
  sort_order int not null default 0
);

-- Enable RLS
alter table resume_profile enable row level security;
alter table resume_sections enable row level security;
alter table resume_items enable row level security;
alter table resume_stats enable row level security;

-- Public read-only policies
create policy "public read profile" on resume_profile for select using (true);
create policy "public read sections" on resume_sections for select using (true);
create policy "public read items" on resume_items for select using (true);
create policy "public read stats" on resume_stats for select using (true);

-- No insert/update/delete policies = no public writes
