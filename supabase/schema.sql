-- ELMA Supabase schema (production path)
-- Run in Supabase SQL editor when connecting live data.

create extension if not exists "pgcrypto";

create type mitigation_status as enum ('complete', 'in_progress', 'not_started', 'delayed');
create type field_verification as enum ('confirmed', 'partial', 'not_done', 'unverified');
create type alert_verification as enum ('verified', 'pending', 'disputed', 'rumor');
create type alert_severity as enum ('info', 'watch', 'warning', 'critical');
create type report_category as enum (
  'trapped', 'flooding', 'landslide', 'medical', 'infrastructure', 'other'
);
create type report_status as enum ('open', 'dispatched', 'resolved');

create table mitigation_projects (
  id text primary key,
  county text not null,
  sub_county text,
  ward text not null,
  title text not null,
  description text not null,
  budget_kes bigint not null,
  disbursed_kes bigint,
  contractor text not null,
  procurement_ref text,
  procurement_status text,
  completion_percentage int,
  paper_status mitigation_status not null,
  field_status field_verification not null,
  start_date date,
  deadline date not null,
  source_url text,
  data_source text not null default 'ppip',
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create index mitigation_projects_county_ward_idx on mitigation_projects (county, ward);

create table community_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_id text,
  title text not null,
  body text not null,
  county text not null,
  ward text not null,
  risk_level text,
  severity alert_severity not null,
  verification alert_verification not null default 'pending',
  source text,
  data_source text,
  issued_at timestamptz,
  evacuation_centers jsonb,
  created_at timestamptz not null default now()
);

create index community_alerts_created_idx on community_alerts (created_at desc);

create table shelters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  county text not null,
  ward text not null,
  address text not null,
  capacity int not null,
  occupancy int not null default 0,
  lat double precision not null,
  lng double precision not null,
  open boolean not null default true,
  contact_person text,
  hotline text,
  data_source text,
  updated_at timestamptz not null default now()
);

create table emergency_reports (
  id uuid primary key default gen_random_uuid(),
  category report_category not null,
  description text not null,
  ward text not null,
  county text not null,
  contact text,
  lat double precision,
  lng double precision,
  status report_status not null default 'open',
  created_at timestamptz not null default now()
);

create index emergency_reports_created_idx on emergency_reports (created_at desc);

alter table mitigation_projects enable row level security;
alter table community_alerts enable row level security;
alter table shelters enable row level security;
alter table emergency_reports enable row level security;

create policy "Public read mitigation" on mitigation_projects for select using (true);
create policy "Public read alerts" on community_alerts for select using (true);
create policy "Public read shelters" on shelters for select using (true);
create policy "Anyone insert reports" on emergency_reports for insert with check (true);
create policy "Public read reports" on emergency_reports for select using (true);

-- Dual-portal extensions (profiles, disbursals, proofs, shelter logs)

create type user_role as enum ('ADMIN', 'RESPONDER');
create type shelter_ops_status as enum ('OPEN', 'NEAR_CAPACITY', 'FULL', 'CLOSED');
create type fund_category as enum (
  'drainage', 'shelter_aid', 'emergency_supplies', 'drought_relief', 'other'
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role user_role not null,
  county text not null,
  ward text,
  organization text not null,
  created_at timestamptz not null default now()
);

create table fund_disbursals (
  id text primary key,
  title text not null,
  county text not null,
  ward text not null,
  category fund_category not null,
  total_allocated_kes bigint not null,
  total_disbursed_kes bigint not null,
  project_id text references mitigation_projects(id),
  created_at timestamptz not null default now()
);

create table project_proofs (
  id text primary key,
  disbursal_id text not null references fund_disbursals(id),
  project_id text references mitigation_projects(id),
  contractor_name text not null,
  tender_id text not null,
  gazette_notice_url text,
  bank_receipt_url text,
  media_proof_urls jsonb not null default '[]',
  verified_at timestamptz,
  verified_by text,
  caption text,
  lat double precision,
  lng double precision
);

create table shelter_status_logs (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid not null references shelters(id),
  current_occupancy int not null,
  max_capacity int not null,
  status shelter_ops_status not null,
  resource_needs jsonb not null default '[]',
  updated_by text not null,
  updated_at timestamptz not null default now()
);

create index shelter_status_logs_shelter_idx on shelter_status_logs (shelter_id, updated_at desc);

alter table profiles enable row level security;
alter table fund_disbursals enable row level security;
alter table project_proofs enable row level security;
alter table shelter_status_logs enable row level security;

create policy "Public read disbursals" on fund_disbursals for select using (true);
create policy "Public read proofs" on project_proofs for select using (true);
create policy "Public read shelter logs" on shelter_status_logs for select using (true);

create type citizen_flag_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type citizen_flag_target as enum ('disbursal', 'shelter', 'proof');
create type audit_event_kind as enum (
  'shelter_update', 'disbursal_verified', 'citizen_flag', 'report_created', 'field_media', 'sms_received'
);

create table audit_events (
  id text primary key,
  kind audit_event_kind not null,
  summary text not null,
  actor text not null,
  county text,
  ward text,
  related_id text,
  metadata jsonb,
  content_hash text not null,
  created_at timestamptz not null default now()
);

create index audit_events_created_idx on audit_events (created_at desc);

create table citizen_flags (
  id text primary key,
  target_type citizen_flag_target not null,
  target_id text not null,
  reason text not null,
  description text not null,
  county text,
  ward text,
  status citizen_flag_status not null default 'open',
  reporter_label text,
  created_at timestamptz not null default now()
);

alter table audit_events enable row level security;
alter table citizen_flags enable row level security;
create policy "Public read audit events" on audit_events for select using (true);
create policy "Anyone insert flags" on citizen_flags for insert with check (true);
create policy "Public read flags" on citizen_flags for select using (true);
