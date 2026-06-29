-- ============================================================
-- LeadPilot — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- LEADS TABLE
-- ============================================================
create table if not exists leads (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  email         text,
  phone         text,
  company       text,
  source        text not null default 'website'
                  check (source in ('website','facebook','referral','instagram','linkedin','other')),
  service       text,
  status        text not null default 'new'
                  check (status in ('new','contacted','qualified','proposal_sent','won','lost')),
  priority      text not null default 'medium'
                  check (priority in ('low','medium','high')),
  notes         text,
  follow_up_date timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- LEAD NOTES TABLE
-- ============================================================
create table if not exists lead_notes (
  id         uuid primary key default uuid_generate_v4(),
  lead_id    uuid not null references leads(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- LEAD ACTIVITY TABLE
-- ============================================================
create table if not exists lead_activity (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid not null references leads(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null,
  description text not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists leads_user_id_idx      on leads(user_id);
create index if not exists leads_status_idx       on leads(status);
create index if not exists leads_follow_up_idx    on leads(follow_up_date);
create index if not exists lead_notes_lead_idx    on lead_notes(lead_id);
create index if not exists lead_activity_lead_idx on lead_activity(lead_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can only access their own data
-- ============================================================
alter table leads         enable row level security;
alter table lead_notes    enable row level security;
alter table lead_activity enable row level security;

-- Leads policies
create policy "Users can view own leads"
  on leads for select using (auth.uid() = user_id);

create policy "Users can insert own leads"
  on leads for insert with check (auth.uid() = user_id);

create policy "Users can update own leads"
  on leads for update using (auth.uid() = user_id);

create policy "Users can delete own leads"
  on leads for delete using (auth.uid() = user_id);

-- Lead notes policies
create policy "Users can view own lead notes"
  on lead_notes for select using (auth.uid() = user_id);

create policy "Users can insert own lead notes"
  on lead_notes for insert with check (auth.uid() = user_id);

create policy "Users can delete own lead notes"
  on lead_notes for delete using (auth.uid() = user_id);

-- Lead activity policies
create policy "Users can view own lead activity"
  on lead_activity for select using (auth.uid() = user_id);

create policy "Users can insert own lead activity"
  on lead_activity for insert with check (auth.uid() = user_id);

-- ============================================================
-- AUTO-UPDATE updated_at ON LEADS
-- ============================================================
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row execute procedure handle_updated_at();
