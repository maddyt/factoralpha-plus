create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz default now()
);

create table earnings_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  project_id uuid not null references projects(id),
  ticker text not null,
  quarter text,
  question text,
  brief jsonb,
  created_at timestamptz default now()
);
