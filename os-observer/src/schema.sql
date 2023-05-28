create table
  public.projects (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default current_timestamp,
    name text not null,
    github_org text not null,
    description text not null,
    constraint projects_pkey primary key (id)
  ) tablespace pg_default;


  create table
  public.events (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default current_timestamp,
    project_id uuid not null,
    event_time timestamp with time zone null,
    event_type text null,
    contributor text null,
    amount double precision null,
    details jsonb null,
    constraint events_pkey primary key (id)
  ) tablespace pg_default;


  create table
  public.wallets (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default current_timestamp,
    address text null,
    project_id uuid not null,
    type text null,
    ens text null,
    constraint wallets_pkey primary key (id),
    constraint wallets_project_id_fkey foreign key (project_id) references projects (id) on update cascade on delete restrict
  ) tablespace pg_default;