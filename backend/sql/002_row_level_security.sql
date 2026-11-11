-- NexoraMart Row Level Security policies
-- This allows FastAPI to safely use Supabase Auth and the Data API.

begin;

-- =========================================================
-- Enable RLS on user-facing tables
-- =========================================================

alter table public.profiles enable row level security;
alter table public.app_roles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_attributes enable row level security;
alter table public.product_variants enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.product_reviews enable row level security;
alter table public.banners enable row level security;
alter table public.shipping_rates enable row level security;
alter table public.store_settings enable row level security;

-- =========================================================
-- Helper function: identify an admin
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.app_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

-- =========================================================
-- PROFILES
-- A user can read/update only their own profile.
-- =========================================================

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================================================
-- APP ROLES
-- Users can read their own roles. Admins can read all roles.
-- Role creation/updating is handled by FastAPI using a privileged server connection.
-- =========================================================

create policy app_roles_select_own_or_admin
on public.app_roles
for select
to authenticated
using (
  auth.uid() = user_id
  or public.is_admin()
);

-- =========================================================
-- ADDRESSES
-- Customers manage only their own addresses.
-- =========================================================

create policy addresses_select_own
on public.addresses
for select
to authenticated
using (auth.uid() = user_id);

create policy addresses_insert_own
on public.addresses
for insert
to authenticated
with check (auth.uid() = user_id);

create policy addresses_update_own
on public.addresses
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy addresses_delete_own
on public.addresses
for delete
to authenticated
using (auth.uid() = user_id);

-- =========================================================
-- PUBLIC CATALOG
-- Guests can read active categories, brands, published products,
-- product images, attributes, and variants.
-- =========================================================

create policy categories_public_read
on public.categories
for select
to anon, authenticated
using (is_active = true);

create policy categories_admin_write
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy brands_public_read
on public.brands
for select
to anon, authenticated
using (is_active = true);

create policy brands_admin_write
on public.brands
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy products_public_read
on public.products
for select
to anon, authenticated
using (status = 'published');

create policy products_admin_write
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy product_images_public_read
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_id
      and p.status = 'published'
  )
);

create policy product_images_admin_write
on public.product_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy product_attributes_public_read
on public.product_attributes
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_id
      and p.status = 'published'
  )
);

create policy product_attributes_admin_write
on public.product_attributes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy product_variants_public_read
on public.product_variants
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.products p
    where p.id = product_id
      and p.status = 'published'
  )
);

create policy product_variants_admin_write
on public.product_variants
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- CARTS AND WISHLIST
-- =========================================================

create policy carts_select_own
on public.carts
for select
to authenticated
using (auth.uid() = user_id);

create policy carts_insert_own
on public.carts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy carts_update_own
on public.carts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy carts_delete_own
on public.carts
for delete
to authenticated
using (auth.uid() = user_id);

create policy cart_items_select_own
on public.cart_items
for select
to authenticated
using (
  exists (
    select 1
    from public.carts c
    where c.id = cart_id
      and c.user_id = auth.uid()
  )
);

create policy cart_items_insert_own
on public.cart_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.carts c
    where c.id = cart_id
      and c.user_id = auth.uid()
  )
);

create policy cart_items_update_own
on public.cart_items
for update
to authenticated
using (
  exists (
    select 1
    from public.carts c
    where c.id = cart_id
      and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.carts c
    where c.id = cart_id
      and c.user_id = auth.uid()
  )
);

create policy cart_items_delete_own
on public.cart_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.carts c
    where c.id = cart_id
      and c.user_id = auth.uid()
  )
);

create policy wishlist_select_own
on public.wishlist_items
for select
to authenticated
using (auth.uid() = user_id);

create policy wishlist_insert_own
on public.wishlist_items
for insert
to authenticated
with check (auth.uid() = user_id);

create policy wishlist_delete_own
on public.wishlist_items
for delete
to authenticated
using (auth.uid() = user_id);

-- =========================================================
-- COUPONS
-- Customers can validate/read active coupons.
-- Admins manage coupons.
-- =========================================================

create policy coupons_public_read
on public.coupons
for select
to anon, authenticated
using (is_active = true);

create policy coupons_admin_write
on public.coupons
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- ORDERS
-- Customers see only their own orders.
-- Admins can see all orders.
-- Order creation and stock reduction are handled by FastAPI.
-- =========================================================

create policy orders_select_own_or_admin
on public.orders
for select
to authenticated
using (
  auth.uid() = user_id
  or public.is_admin()
);

create policy orders_admin_update
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy order_items_select_own_or_admin
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and (o.user_id = auth.uid() or public.is_admin())
  )
);

create policy order_status_history_select_own_or_admin
on public.order_status_history
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and (o.user_id = auth.uid() or public.is_admin())
  )
);

create policy payments_select_own_or_admin
on public.payments
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and (o.user_id = auth.uid() or public.is_admin())
  )
);

-- =========================================================
-- REVIEWS
-- =========================================================

create policy reviews_public_read
on public.product_reviews
for select
to anon, authenticated
using (
  is_approved = true
  and exists (
    select 1
    from public.products p
    where p.id = product_id
      and p.status = 'published'
  )
);

create policy reviews_insert_own
on public.product_reviews
for insert
to authenticated
with check (auth.uid() = user_id);

create policy reviews_update_own
on public.product_reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy reviews_delete_own
on public.product_reviews
for delete
to authenticated
using (auth.uid() = user_id);

create policy reviews_admin_manage
on public.product_reviews
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- BANNERS, SHIPPING AND STORE SETTINGS
-- Public read; admin write.
-- =========================================================

create policy banners_public_read
on public.banners
for select
to anon, authenticated
using (is_active = true);

create policy banners_admin_write
on public.banners
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy shipping_rates_public_read
on public.shipping_rates
for select
to anon, authenticated
using (is_active = true);

create policy shipping_rates_admin_write
on public.shipping_rates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy store_settings_public_read
on public.store_settings
for select
to anon, authenticated
using (true);

create policy store_settings_admin_write
on public.store_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

commit;