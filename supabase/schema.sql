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
