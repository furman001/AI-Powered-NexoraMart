-- NexoraMart initial schema
-- Core commerce tables only. No demo products or admin user are inserted.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- ENUMS
-- =========================================================

create type public.account_status as enum (
  'active', 'inactive', 'blocked'
);

create type public.product_status as enum (
  'draft', 'published', 'hidden', 'archived'
);

create type public.order_status as enum (
  'pending', 'confirmed', 'processing', 'shipped',
  'delivered', 'cancelled', 'refunded'
);

create type public.payment_status as enum (
  'unpaid', 'pending', 'paid', 'failed', 'refunded'
);

create type public.payment_method as enum (
  'cash_on_delivery', 'bank_transfer', 'card', 'wallet'
);

create type public.discount_kind as enum (
  'percentage', 'fixed_amount'
);

create type public.stock_movement_kind as enum (
  'restock', 'sale', 'return', 'adjustment', 'damage'
);

-- =========================================================
-- PROFILES AND ROLES
-- Supabase Auth owns credentials. This table stores app profile data.
-- =========================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.app_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'shop_manager', 'customer')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- =========================================================
-- ADDRESS BOOK
-- =========================================================

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  recipient_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  region text,
  postal_code text,
  country text not null default 'Pakistan',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses(user_id);

-- =========================================================
-- CATALOG
-- =========================================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_parent_id_idx on public.categories(parent_id);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  logo_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  slug text not null unique,
  sku text unique,
  short_description text,
  description text,
  status public.product_status not null default 'draft',
  regular_price numeric(12,2) not null check (regular_price >= 0),
  sale_price numeric(12,2) check (sale_price >= 0),
  cost_price numeric(12,2) check (cost_price >= 0),
  tax_rate numeric(5,2) not null default 0 check (tax_rate >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  is_featured boolean not null default false,
  track_inventory boolean not null default true,
  weight_kg numeric(10,3) check (weight_kg is null or weight_kg >= 0),
  specifications jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (sale_price is null or sale_price <= regular_price)
);

create index products_category_id_idx on public.products(category_id);
create index products_brand_id_idx on public.products(brand_id);
create index products_status_idx on public.products(status);
create index products_created_at_idx on public.products(created_at desc);
create index products_search_idx
  on public.products using gin (
    to_tsvector(
      'simple',
      coalesce(name, '') || ' ' ||
      coalesce(short_description, '') || ' ' ||
      coalesce(description, '')
    )
  );

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, storage_path)
);

create index product_images_product_id_idx on public.product_images(product_id);

create table public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  created_at timestamptz not null default now(),
  unique (product_id, name)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text unique,
  regular_price numeric(12,2) not null check (regular_price >= 0),
  sale_price numeric(12,2) check (sale_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (sale_price is null or sale_price <= regular_price),
  unique (product_id, name)
);

create index product_variants_product_id_idx
  on public.product_variants(product_id);

-- Each change to stock is recorded for an audit trail.
create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete restrict,
  movement_type public.stock_movement_kind not null,
  quantity_change integer not null check (quantity_change <> 0),
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index stock_movements_product_id_idx
  on public.stock_movements(product_id, created_at desc);

-- =========================================================
-- CART AND WISHLIST
-- =========================================================

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  session_token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or session_token is not null)
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cart_items_cart_id_idx on public.cart_items(cart_id);

create table public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- =========================================================
-- COUPONS
-- =========================================================

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type public.discount_kind not null,
  discount_value numeric(12,2) not null check (discount_value > 0),
  minimum_order_amount numeric(12,2) not null default 0
    check (minimum_order_amount >= 0),
  maximum_discount_amount numeric(12,2)
    check (maximum_discount_amount is null or maximum_discount_amount >= 0),
  usage_limit integer check (usage_limit is null or usage_limit >= 0),
  used_count integer not null default 0 check (used_count >= 0),
  per_user_limit integer check (per_user_limit is null or per_user_limit > 0),
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    discount_type <> 'percentage'
    or discount_value <= 100
  ),
  check (
    expires_at is null or starts_at is null or expires_at > starts_at
  )
);

-- =========================================================
-- ORDERS AND PAYMENTS
-- Store address and item details as snapshots so old orders
-- remain accurate if customer/product data later changes.
-- =========================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  user_id uuid references auth.users(id) on delete set null,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  payment_method public.payment_method not null default 'cash_on_delivery',
  coupon_id uuid references public.coupons(id) on delete set null,

  customer_name text not null,
  customer_email text,
  customer_phone text not null,

  shipping_address jsonb not null,
  billing_address jsonb,

  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount_amount numeric(12,2) not null default 0
    check (discount_amount >= 0),
  tax_amount numeric(12,2) not null default 0 check (tax_amount >= 0),
  shipping_amount numeric(12,2) not null default 0
    check (shipping_amount >= 0),
  total_amount numeric(12,2) not null check (total_amount >= 0),

  customer_note text,
  admin_note text,
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);
create index orders_placed_at_idx on public.orders(placed_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items(order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  old_status public.order_status,
  new_status public.order_status not null,
  changed_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index order_status_history_order_id_idx
  on public.order_status_history(order_id, created_at);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  method public.payment_method not null,
  status public.payment_status not null default 'pending',
  amount numeric(12,2) not null check (amount >= 0),
  provider_reference text,
  note text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_order_id_idx on public.payments(order_id);

-- =========================================================
-- REVIEWS
-- =========================================================

create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  review_text text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, user_id, order_id)
);

create index product_reviews_product_id_idx
  on public.product_reviews(product_id);

-- =========================================================
-- BANNERS, DELIVERY AND STORE SETTINGS
-- =========================================================

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  storage_path text not null,
  mobile_storage_path text,
  button_text text,
  button_url text,
  placement text not null default 'homepage',
  sort_order integer not null default 0,
  is_active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  city text,
  area text,
  minimum_order_amount numeric(12,2) not null default 0
    check (minimum_order_amount >= 0),
  shipping_charge numeric(12,2) not null default 0
    check (shipping_charge >= 0),
  estimated_delivery_days integer
    check (estimated_delivery_days is null or estimated_delivery_days >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.store_settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null default 'NexoraMart',
  store_email text,
  store_phone text,
  store_address text,
  logo_storage_path text,
  currency char(3) not null default 'PKR',
  tax_rate numeric(5,2) not null default 0 check (tax_rate >= 0),
  free_shipping_threshold numeric(12,2)
    check (free_shipping_threshold is null or free_shipping_threshold >= 0),
  whatsapp_number text,
  is_store_open boolean not null default true,
  maintenance_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id, store_name)
values (1, 'NexoraMart')
on conflict (id) do nothing;

-- =========================================================
-- ADMIN AUDIT LOG
-- Do not store secrets or passwords in this table.
-- =========================================================

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx
  on public.audit_logs(entity_table, entity_id);
create index audit_logs_created_at_idx
  on public.audit_logs(created_at desc);

-- =========================================================
-- updated_at trigger function and triggers
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger addresses_set_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger brands_set_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger product_variants_set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

create trigger carts_set_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

create trigger cart_items_set_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

create trigger coupons_set_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create trigger store_settings_set_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

commit;