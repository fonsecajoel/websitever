-- Santo Salto Store — schema inicial
-- Executar no SQL Editor do Supabase (ou `supabase db push`).

create extension if not exists "pgcrypto";

-- ───────────── Perfis & papéis ─────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────── Catálogo ─────────────
create table if not exists public.collections (
  slug text primary key,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  cover_url text not null default '',
  sort_order int not null default 0,
  active boolean not null default true
);

create table if not exists public.categories (
  slug text primary key,
  label text not null,
  sort_order int not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null references public.categories(slug) on update cascade,
  collection text references public.collections(slug) on update cascade on delete set null,
  price numeric(10,2) not null check (price >= 0),
  old_price numeric(10,2) check (old_price is null or old_price >= 0),
  short_description text not null default '',
  description text not null default '',
  details text[] not null default '{}',
  materials text not null default '',
  origin text not null default '',
  heel_height text,
  colors jsonb not null default '[]'::jsonb,   -- [{name, hex}]
  sizes jsonb not null default '[]'::jsonb,    -- [{label, stock}]
  images jsonb not null default '[]'::jsonb,   -- [{src, alt}]
  badges text[] not null default '{}',
  is_new boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_collection_idx on public.products(collection);

-- ───────────── Clientes, encomendas ─────────────
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null unique,
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  cpf text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  code text primary key,
  description text not null default '',
  kind text not null check (kind in ('percent','fixed')),
  value numeric(10,2) not null check (value > 0),
  min_subtotal numeric(10,2) not null default 0,
  max_uses int,
  uses int not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint not null unique default nextval('public.order_number_seq'),
  customer_id uuid references public.customers(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending','paid','preparing','shipped','delivered','cancelled','refunded')),
  payment_method text not null check (payment_method in ('pix','stripe')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','failed','refunded')),
  stripe_session_id text unique,
  stripe_payment_intent text,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  coupon_code text references public.coupons(code) on delete set null,
  shipping_method text not null,
  shipping_address jsonb not null,  -- {zip,state,city,neighborhood,address,number,complement}
  customer_snapshot jsonb not null, -- {firstName,lastName,phone,cpf}
  tracking_code text,
  admin_notes text not null default '',
  access_token uuid not null default gen_random_uuid(), -- link seguro de acompanhamento
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_email_idx on public.orders(email);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  slug text not null,
  image text not null default '',
  size text not null,
  color text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0)
);

create table if not exists public.order_events (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

-- ───────────── Marketing & contacto ─────────────
create table if not exists public.newsletter_subscribers (
  email text primary key,
  source text not null default 'site',
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values
  ('store', jsonb_build_object(
    'announcement', 'Frete grátis acima de R$ 499 · Até 6x sem juros · Troca grátis em 30 dias',
    'freeShippingThreshold', 499,
    'pixDiscountPercent', 5,
    'pixKey', '56.159.388/0001-22',
    'pixKeyRaw', '56159388000122',
    'whatsapp', '5511910828374',
    'email', 'santosaltovendas@gmail.com',
    'instagram', 'https://www.instagram.com/santosaltostore'
  ))
on conflict (key) do nothing;

-- ───────────── updated_at ─────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- ───────────── Stock: abate atómico ─────────────
create or replace function public.decrement_stock(p_product uuid, p_size text, p_qty int)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.products
     set sizes = (
       select coalesce(jsonb_agg(
         case when s->>'label' = p_size
              then jsonb_set(s, '{stock}', to_jsonb(greatest(0, coalesce((s->>'stock')::int,0) - p_qty)))
              else s end), '[]'::jsonb)
       from jsonb_array_elements(sizes) s)
   where id = p_product;
end;
$$;
revoke execute on function public.decrement_stock(uuid, text, int) from public, anon, authenticated;

-- ───────────── RLS ─────────────
alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.settings enable row level security;

-- Leitura pública do catálogo
create policy "catalog read collections" on public.collections for select using (active or public.is_admin());
create policy "catalog read categories" on public.categories for select using (true);
create policy "catalog read products" on public.products for select using (active or public.is_admin());
create policy "settings read" on public.settings for select using (true);

-- Admin gere tudo
create policy "admin all collections" on public.collections for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all order_items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all order_events" on public.order_events for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all newsletter" on public.newsletter_subscribers for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all messages" on public.contact_messages for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Perfis: o próprio utilizador
create policy "own profile read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "admin profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Clientes autenticados veem as suas encomendas
create policy "own orders read" on public.orders for select using (user_id = auth.uid());
create policy "own order items read" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "own order events read" on public.order_events for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- Escritas públicas (newsletter / contacto / encomendas) passam SEMPRE pelos
-- endpoints do servidor com a service role — não há policies de insert para anon.

-- ───────────── Storage (imagens de produtos) ─────────────
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects for select using (bucket_id = 'products');
create policy "admin write product images" on storage.objects for insert with check (bucket_id = 'products' and public.is_admin());
create policy "admin update product images" on storage.objects for update using (bucket_id = 'products' and public.is_admin());
create policy "admin delete product images" on storage.objects for delete using (bucket_id = 'products' and public.is_admin());

-- ───────────── Dashboard ─────────────
create or replace view public.admin_daily_revenue with (security_invoker = true) as
  select date_trunc('day', created_at)::date as day,
         count(*) as orders,
         sum(total) filter (where payment_status = 'paid') as revenue
    from public.orders
   where created_at > now() - interval '90 days'
   group by 1 order by 1;

-- Para tornar um utilizador admin (depois de criar a conta em Authentication):
--   update public.profiles set role = 'admin' where email = 'o-teu-email@exemplo.com';
