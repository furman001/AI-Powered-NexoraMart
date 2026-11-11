-- NexoraMart stock-control functions
-- These functions update stock and create a stock-movement record
-- in the same transaction.

begin;

-- =========================================================
-- Increase stock: restock, customer return, or correction
-- =========================================================

create or replace function public.adjust_product_stock(
  p_product_id uuid,
  p_variant_id uuid,
  p_quantity_change integer,
  p_movement_type public.stock_movement_kind,
  p_note text default null,
  p_actor_user_id uuid default null
)
returns table (
  product_id uuid,
  variant_id uuid,
  new_stock_quantity integer
)
language plpgsql
set search_path = ''
as $$
declare
  current_stock integer;
  new_stock integer;
begin
  if p_quantity_change = 0 then
    raise exception 'Stock change cannot be zero';
  end if;

  if p_variant_id is null then
    select stock_quantity
    into current_stock
    from public.products
    where id = p_product_id
    for update;

    if current_stock is null then
      raise exception 'Product not found: %', p_product_id;
    end if;

    if current_stock + p_quantity_change < 0 then
      raise exception 'Insufficient stock. Current: %, Change: %',
        current_stock, p_quantity_change;
    end if;

    update public.products
    set stock_quantity = stock_quantity + p_quantity_change
    where id = p_product_id;

    insert into public.stock_movements (
      product_id,
      variant_id,
      movement_type,
      quantity_change,
      note,
      created_by
    )
    values (
      p_product_id,
      null,
      p_movement_type,
      p_quantity_change,
      p_note,
      p_actor_user_id
    );

    return query
    select
      p_product_id,
      null::uuid,
      current_stock + p_quantity_change;
  else
    select stock_quantity
    into current_stock
    from public.product_variants
    where id = p_variant_id
      and product_id = p_product_id
    for update;

    if current_stock is null then
      raise exception 'Variant not found for product: %', p_variant_id;
    end if;

    if current_stock + p_quantity_change < 0 then
      raise exception 'Insufficient variant stock. Current: %, Change: %',
        current_stock, p_quantity_change;
    end if;

    update public.product_variants
    set stock_quantity = stock_quantity + p_quantity_change
    where id = p_variant_id;

    insert into public.stock_movements (
      product_id,
      variant_id,
      movement_type,
      quantity_change,
      note,
      created_by
    )
    values (
      p_product_id,
      p_variant_id,
      p_movement_type,
      p_quantity_change,
      p_note,
      p_actor_user_id
    );

    return query
    select
      p_product_id,
      p_variant_id,
      current_stock + p_quantity_change;
  end if;
end;
$$;

-- =========================================================
-- Reduce stock for a customer sale
-- =========================================================

create or replace function public.sell_product_stock(
  p_product_id uuid,
  p_variant_id uuid,
  p_sale_quantity integer,
  p_note text default null,
  p_actor_user_id uuid default null
)
returns table (
  product_id uuid,
  variant_id uuid,
  new_stock_quantity integer
)
language plpgsql
set search_path = ''
as $$
begin
  if p_sale_quantity <= 0 then
    raise exception 'Sale quantity must be greater than zero';
  end if;

  return query
  select *
  from public.adjust_product_stock(
    p_product_id,
    p_variant_id,
    -p_sale_quantity,
    'sale',
    p_note,
    p_actor_user_id
  );
end;
$$;

-- =========================================================
-- Restore stock for a cancelled order or return
-- =========================================================

create or replace function public.restore_product_stock(
  p_product_id uuid,
  p_variant_id uuid,
  p_return_quantity integer,
  p_note text default null,
  p_actor_user_id uuid default null
)
returns table (
  product_id uuid,
  variant_id uuid,
  new_stock_quantity integer
)
language plpgsql
set search_path = ''
as $$
begin
  if p_return_quantity <= 0 then
    raise exception 'Return quantity must be greater than zero';
  end if;

  return query
  select *
  from public.adjust_product_stock(
    p_product_id,
    p_variant_id,
    p_return_quantity,
    'return',
    p_note,
    p_actor_user_id
  );
end;
$$;

commit;