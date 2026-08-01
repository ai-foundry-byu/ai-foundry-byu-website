-- Quote form fields for the new site (byu marriott ai foundry website).
-- The /quote form asks for phone and website; the original table did not
-- carry either. Applied to the live project (gsrnizkjnwhnsgjobloy) on
-- 2026-08-01 via the management API. Safe to re-run.

alter table public.project_proposals add column if not exists phone text;
alter table public.project_proposals add column if not exists website text;
