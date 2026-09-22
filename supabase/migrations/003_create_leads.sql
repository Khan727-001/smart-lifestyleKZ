-- Лиды с формы сайта. Публичный доступ к таблице не выдаем:
-- запись выполняется только Edge Function через service role.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  request_id text,
  name text not null,
  phone text not null,
  message text,
  source text not null default 'website',
  page_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  telegram_sent boolean not null default false,
  telegram_message_id bigint,
  created_at timestamptz not null default now()
);

alter table public.leads add column if not exists request_id text;
alter table public.leads enable row level security;

create unique index if not exists leads_request_id_uidx on public.leads (request_id) where request_id is not null;
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_phone_idx on public.leads (phone);
create index if not exists leads_gclid_idx on public.leads (gclid) where gclid is not null;
