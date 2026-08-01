-- AI Foundry Network — network_members
-- Project: ai-foundry-network. Apply in the Supabase SQL editor (project vgdyrswcuxcjmpwebytv).
-- Safe to re-run.

create table if not exists public.network_members (
  id               uuid primary key default gen_random_uuid(),
  full_name        text,
  email            text not null,
  organization     text,
  role             text,
  linkedin         text,
  interest_events  boolean not null default false,  -- live BYU-sponsored AI events
  interest_digest  boolean not null default false,  -- weekly BYU-flavored AI digest
  interest_talent  boolean not null default false,  -- connect to cohort for talent
  interest_project boolean not null default false,  -- wants to submit a project proposal
  source           text not null default 'web',     -- 'web' | 'admin'
  notes            text,
  created_at       timestamptz not null default now()
);

-- one row per email; re-joins update interests instead of duplicating.
-- API normalizes email to lowercase before insert, so a plain unique works as case-insensitive.
create unique index if not exists network_members_email_key on public.network_members (email);
create index if not exists network_members_created_at_idx on public.network_members (created_at desc);

-- Server talks to this table with the service_role key only (RLS-exempt).
-- Enable RLS with no public policies so the anon key cannot read PII.
alter table public.network_members enable row level security;
