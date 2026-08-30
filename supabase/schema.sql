-- ============================================================
--  メニュー表アプリ  データベース定義
--  Supabase の「SQL Editor」にこの内容をすべて貼り付けて実行してください。
--  （2回目以降に実行しても壊れないように作ってあります）
-- ============================================================

-- ---------- 拡張 ----------
create extension if not exists "pgcrypto";

-- ============================================================
--  profiles : 管理者アカウント（auth.users と1対1）
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  shop_name   text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- 新規ユーザー登録時に profiles を自動作成
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, shop_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'shop_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  menus : 1つの「メニュー表サイト」
-- ============================================================
create table if not exists public.menus (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles (id) on delete cascade,
  slug          text not null unique,
  title         text not null default '新しいメニュー',
  tagline       text,
  description   text,
  cover_url     text,
  logo_url      text,
  template      text not null default 'restaurant',
  theme         jsonb not null default '{}'::jsonb,
  currency      text not null default 'JPY',
  show_price    boolean not null default true,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists menus_owner_idx on public.menus (owner_id);
create index if not exists menus_slug_idx  on public.menus (slug);

alter table public.menus enable row level security;

-- 公開中のメニューは誰でも閲覧可能
drop policy if exists "menus_public_read" on public.menus;
create policy "menus_public_read" on public.menus
  for select using (is_published = true);

-- 自分のメニューは常に閲覧・編集可能
drop policy if exists "menus_owner_all" on public.menus;
create policy "menus_owner_all" on public.menus
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ============================================================
--  categories : 分類（カテゴリー）
-- ============================================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  menu_id     uuid not null references public.menus (id) on delete cascade,
  name        text not null default 'カテゴリー',
  note        text,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists categories_menu_idx on public.categories (menu_id);

alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (
    exists (select 1 from public.menus m
            where m.id = menu_id and m.is_published = true)
  );

drop policy if exists "categories_owner_all" on public.categories;
create policy "categories_owner_all" on public.categories
  for all using (
    exists (select 1 from public.menus m
            where m.id = menu_id and m.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.menus m
            where m.id = menu_id and m.owner_id = auth.uid())
  );

-- ============================================================
--  menu_items : 商品・料理・サービスの1項目
-- ============================================================
create table if not exists public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  menu_id      uuid not null references public.menus (id) on delete cascade,
  category_id  uuid references public.categories (id) on delete set null,
  name         text not null default '新しい項目',
  description  text,
  price        numeric,
  price_note   text,
  image_url    text,
  badge        text,
  is_available boolean not null default true,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists menu_items_menu_idx     on public.menu_items (menu_id);
create index if not exists menu_items_category_idx on public.menu_items (category_id);

alter table public.menu_items enable row level security;

drop policy if exists "menu_items_public_read" on public.menu_items;
create policy "menu_items_public_read" on public.menu_items
  for select using (
    exists (select 1 from public.menus m
            where m.id = menu_id and m.is_published = true)
  );

drop policy if exists "menu_items_owner_all" on public.menu_items;
create policy "menu_items_owner_all" on public.menu_items
  for all using (
    exists (select 1 from public.menus m
            where m.id = menu_id and m.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.menus m
            where m.id = menu_id and m.owner_id = auth.uid())
  );

-- ============================================================
--  updated_at 自動更新
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists menus_touch_updated_at on public.menus;
create trigger menus_touch_updated_at
  before update on public.menus
  for each row execute function public.touch_updated_at();

-- ============================================================
--  画像アップロード用ストレージ（バケット: menu-images）
-- ============================================================
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = true;

drop policy if exists "menu_images_public_read" on storage.objects;
create policy "menu_images_public_read" on storage.objects
  for select using (bucket_id = 'menu-images');

drop policy if exists "menu_images_owner_write" on storage.objects;
create policy "menu_images_owner_write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'menu-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "menu_images_owner_update" on storage.objects;
create policy "menu_images_owner_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'menu-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "menu_images_owner_delete" on storage.objects;
create policy "menu_images_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'menu-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
