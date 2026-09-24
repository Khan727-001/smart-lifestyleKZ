-- Фиксируем согласие пользователя с политикой конфиденциальности.
alter table public.leads
  add column if not exists consent_accepted boolean not null default false;

alter table public.leads
  add column if not exists consent_version text;

alter table public.leads
  add column if not exists consent_at timestamptz;

create index if not exists leads_consent_at_idx
  on public.leads (consent_at desc)
  where consent_at is not null;
