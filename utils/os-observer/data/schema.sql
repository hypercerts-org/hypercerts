create table
  public.projects (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default now(),
    name text not null,
    github_org text not null,
    description text null,
    constraint projects_pkey primary key (id)
  ) tablespace pg_default;


create table
  public.wallets (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default now(),
    address text null,
    project_id bigint null,
    type text null,
    ens text null,
    constraint wallets_pkey primary key (id),
    constraint wallets_project_id_fkey foreign key (project_id) references projects (id)
  ) tablespace pg_default;


create table
  public.events (
    id bigint generated by default as identity not null,
    project_id bigint not null,
    timestamp timestamp without time zone null,
    data_source text null,
    event_type text null,
    contributor text null,
    amount double precision null,
    details json null,
    constraint events_pkey1 primary key (id),
    constraint events_project_id_fkey foreign key (project_id) references projects (id)
  ) tablespace pg_default;


  create table
  public.funding (
    id bigint not null,
    ecosystem text null,
    name text null,
    address text null,
    token text null,
    amount bigint null,
    start_date timestamp with time zone null,
    end_date timestamp with time zone null,
    details json null,
    constraint funding_id_key unique (id)
  ) tablespace pg_default;