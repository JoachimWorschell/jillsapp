-- ============================================================
-- Jill's App — Supabase Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Photos
create table public.photos (
  id           uuid        default gen_random_uuid() primary key,
  storage_path text        not null,
  url          text        not null,
  created_at   timestamptz default now() not null
);

-- Posts (her updates)
create table public.posts (
  id         uuid        default gen_random_uuid() primary key,
  text       text        not null,
  created_at timestamptz default now() not null
);

-- About her (key-value store)
create table public.about (
  key        text        primary key,
  value      text,
  updated_at timestamptz default now() not null
);

-- Wishlist
create table public.wishlist (
  id         uuid        default gen_random_uuid() primary key,
  text       text        not null,
  url        text,
  purchased  boolean     default false not null,
  created_at timestamptz default now() not null
);

-- Disable RLS — the app is private and all DB access
-- goes through the service role key server-side only.
alter table public.photos   disable row level security;
alter table public.posts    disable row level security;
alter table public.about    disable row level security;
alter table public.wishlist disable row level security;

-- ============================================================
-- Storage bucket
-- Run this separately in the Supabase SQL editor
-- OR create it manually in Storage → New bucket
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('jills-photos', 'jills-photos', true)
-- on conflict do nothing;
