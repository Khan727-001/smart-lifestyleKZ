-- Выполнить в Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/yexyyvttcazqmqhzjrcd/sql

-- Таблица отзывов
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialist text not null default 'S.M.A.R.T. Lifestyle',
  text text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Таблица условий консультаций
create table if not exists public.pricing_conditions (
  id uuid primary key default gen_random_uuid(),
  plan_id text not null,       -- 'individual' | 'family'
  text text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

-- Row Level Security
alter table public.reviews enable row level security;
alter table public.pricing_conditions enable row level security;

-- Публичное чтение активных записей (для посетителей сайта)
create policy "public_read_reviews"
  on public.reviews for select
  using (is_active = true);

create policy "public_read_pricing"
  on public.pricing_conditions for select
  using (is_active = true);

-- Полный доступ для авторизованного администратора
create policy "auth_all_reviews"
  on public.reviews for all
  using (auth.uid() is not null);

create policy "auth_all_pricing"
  on public.pricing_conditions for all
  using (auth.uid() is not null);
