-- AI Foundry Project Ingestion Portal — project_proposals
-- Project: ai-foundry-project-portal. Apply in the Supabase SQL editor (project vgdyrswcuxcjmpwebytv).
-- Safe to re-run.

create table if not exists public.project_proposals (
  id                  uuid primary key default gen_random_uuid(),
  contact_name        text,
  email               text not null,
  organization        text,
  project_title       text not null,
  project_description text not null,
  desired_timeline    text,
  budget_ack          boolean not null default false,  -- acknowledged $5k flat fee (subject to scope)
  fee_usd             integer not null default 5000,   -- snapshot of quoted flat fee
  status              text not null default 'pending', -- 'pending' | 'approved' | 'declined'
  admin_notes         text,
  source              text not null default 'web',
  created_at          timestamptz not null default now(),
  reviewed_at         timestamptz
);

create index if not exists project_proposals_status_idx on public.project_proposals (status);
create index if not exists project_proposals_created_at_idx on public.project_proposals (created_at desc);

alter table public.project_proposals enable row level security;
