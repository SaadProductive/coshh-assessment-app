-- COSHH Assessment Generator — Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- =========================================
-- SUBSTANCES TABLE (the core product library)
-- =========================================
create table substances (
  id uuid primary key default gen_random_uuid(),
  substance_name text not null,
  common_names text[] not null default '{}',
  industry_tags text[] not null default '{}',
  cas_number text,
  ghs_classification text not null,
  exposure_routes text[] not null default '{}',
  physical_form text,
  health_effects text not null,
  default_controls text[] not null default '{}',
  recommended_ppe text[] not null default '{}',
  emergency_procedure jsonb not null default '{}', -- { skin: "", eyes: "", inhalation: "", ingestion: "" }
  risk_baseline text not null check (risk_baseline in ('Low', 'Low-Medium', 'Medium', 'Medium-High', 'High')),
  sources text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_substances_industry_tags on substances using gin (industry_tags);
create index idx_substances_common_names on substances using gin (common_names);
create index idx_substances_name_search on substances using gin (to_tsvector('english', substance_name || ' ' || array_to_string(common_names, ' ')));

-- =========================================
-- USERS / PROFILES (extends Supabase auth.users)
-- =========================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  company_logo_url text,
  assessor_name text,
  trade_type text, -- salon, cleaning, garage, catering, construction, other
  created_at timestamptz default now()
);

-- =========================================
-- ASSESSMENTS (the user's completed COSHH assessments)
-- =========================================
create table assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  substance_id uuid references substances(id),
  -- Snapshot of substance data at time of assessment (in case substance library updates later)
  substance_name_snapshot text not null,
  -- Workplace-specific answers
  how_used text not null,
  frequency text not null, -- daily, weekly, occasional
  quantity_used text,
  who_is_exposed text not null,
  duration_of_exposure text,
  existing_controls text,
  current_ppe_available text,
  -- Calculated/editable outputs
  risk_rating text not null check (risk_rating in ('Low', 'Medium', 'High')),
  control_measures text not null, -- editable, pre-filled from substance.default_controls
  ppe_required text not null, -- editable, pre-filled from substance.recommended_ppe
  emergency_procedure_snapshot jsonb not null,
  -- Metadata
  assessor_name text not null,
  company_name text not null,
  assessment_date date not null default current_date,
  review_date date not null, -- auto-calculated as assessment_date + 1 year
  status text not null default 'active' check (status in ('active', 'overdue', 'archived')),
  pdf_url text, -- Supabase Storage URL once generated
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_assessments_user_id on assessments(user_id);
create index idx_assessments_review_date on assessments(review_date);

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================
alter table profiles enable row level security;
alter table assessments enable row level security;
alter table substances enable row level security;

-- Substances: readable by everyone (it's the product library, not user data)
create policy "Substances are viewable by everyone"
  on substances for select
  using (true);

-- Profiles: users can only see/edit their own
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Assessments: users can only see/edit their own
create policy "Users can view own assessments"
  on assessments for select
  using (auth.uid() = user_id);

create policy "Users can insert own assessments"
  on assessments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own assessments"
  on assessments for update
  using (auth.uid() = user_id);

create policy "Users can delete own assessments"
  on assessments for delete
  using (auth.uid() = user_id);

-- =========================================
-- FUNCTION: Auto-create profile on signup
-- =========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- FUNCTION: Auto-update review status (run daily via cron/edge function)
-- =========================================
create or replace function update_overdue_assessments()
returns void as $$
begin
  update assessments
  set status = 'overdue'
  where review_date < current_date
  and status = 'active';
end;
$$ language plpgsql;
