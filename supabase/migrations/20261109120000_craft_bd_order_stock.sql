-- -----------------------------------------------------------------------------
-- Atomic order placement and stock decrement
--
-- Order creation previously happened in two separate PostgREST calls (order
-- header, then item snapshots). Customers cannot update products under RLS, so
-- stock could not be decremented from the browser client. This security-definer
-- function performs the whole checkout in one transaction:
--
--   1. reads the signed-in customer's cart (client item data is never trusted)
--   2. locks the referenced products FOR UPDATE in a stable order
--   3. validates stock and gift-wrap availability
--   4. recalculates subtotal, shipping, and gift-wrap fees from the database
--   5. inserts the order and its item snapshots
--   6. decrements stock and clears the cart
--
-- Any failure raises and rolls the entire checkout back, so an order can never
-- be recorded without its stock movement.
-- -----------------------------------------------------------------------------
create or replace function public.place_order(
  p_order_number text,
  p_shipping_address jsonb,
  p_gift_message text
)
returns table (
  order_id uuid,
  order_number text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_customer_id uuid;
  v_cart_lines integer;
  v_available_lines integer;
  v_problem_title text;
  v_subtotal numeric(12, 2);
  v_shipping numeric(12, 2);
  v_gift_wrap numeric(12, 2);
  v_wrapped_units integer;
  v_created_order_id uuid;
begin
  v_customer_id := (select auth.uid());

  if v_customer_id is null
     or not exists (
       select 1 from public.profiles p where p.id = v_customer_id
     ) then
    raise exception 'CRAFT_BD_NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  if p_order_number is null
     or p_order_number !~ '^CBD-[0-9]{4}-[0-9]{4}$' then
    raise exception 'CRAFT_BD_INVALID_ORDER_NUMBER' using errcode = 'P0001';
  end if;

  -- Delivery snapshot. Mirrors the checkout Zod schema so the function is safe
  -- even when called directly through PostgREST.
  if p_shipping_address is null
     or jsonb_typeof(p_shipping_address) is distinct from 'object'
     or coalesce(btrim(p_shipping_address ->> 'recipient_name'), '') = ''
     or char_length(p_shipping_address ->> 'recipient_name') not between 2 and 80
     or coalesce(btrim(p_shipping_address ->> 'phone'), '') = ''
     or char_length(p_shipping_address ->> 'phone') not between 6 and 30
     or (p_shipping_address ->> 'phone') !~ '^[0-9+() -]+$'
     or coalesce(btrim(p_shipping_address ->> 'address_line1'), '') = ''
     or char_length(p_shipping_address ->> 'address_line1') not between 6 and 120
     or coalesce(btrim(p_shipping_address ->> 'city'), '') = ''
     or char_length(p_shipping_address ->> 'city') not between 2 and 60
     or coalesce(btrim(p_shipping_address ->> 'district'), '') = ''
     or char_length(p_shipping_address ->> 'district') not between 2 and 60
     or coalesce(p_shipping_address ->> 'division', '') not in (
       'barishal', 'chattogram', 'dhaka', 'khulna',
       'mymensingh', 'rajshahi', 'rangpur', 'sylhet'
     )
     or (
       p_shipping_address ? 'address_line2'
       and jsonb_typeof(p_shipping_address -> 'address_line2') <> 'null'
       and char_length(p_shipping_address ->> 'address_line2') > 120
     )
     or (
       p_shipping_address ? 'postal_code'
       and jsonb_typeof(p_shipping_address -> 'postal_code') <> 'null'
       and (
         (p_shipping_address ->> 'postal_code') !~ '^[0-9]*$'
         or char_length(p_shipping_address ->> 'postal_code') > 12
       )
     ) then
    raise exception 'CRAFT_BD_INVALID_ADDRESS' using errcode = 'P0001';
  end if;

  if p_gift_message is not null
     and char_length(btrim(p_gift_message)) > 280 then
    raise exception 'CRAFT_BD_INVALID_GIFT_MESSAGE' using errcode = 'P0001';
  end if;

  select count(*)::integer
    into v_cart_lines
  from public.cart_items ci
  join public.carts c on c.id = ci.cart_id
  where c.profile_id = v_customer_id;

  if v_cart_lines = 0 then
    raise exception 'CRAFT_BD_EMPTY_CART' using errcode = 'P0001';
  end if;

  -- Lock every published product in a deterministic order so concurrent
  -- checkouts cannot oversell the same piece or deadlock each other.
  perform p.id
  from public.products p
  join public.cart_items ci on ci.product_id = p.id
  join public.carts c on c.id = ci.cart_id
  where c.profile_id = v_customer_id
    and p.status = 'published'
  order by p.id
  for update of p;

  select count(*)::integer
    into v_available_lines
  from public.cart_items ci
  join public.carts c on c.id = ci.cart_id
  join public.products p
    on p.id = ci.product_id
   and p.status = 'published'
  where c.profile_id = v_customer_id;

  if v_available_lines <> v_cart_lines then
    raise exception 'CRAFT_BD_PRODUCT_UNAVAILABLE' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from public.cart_items ci
    join public.carts c on c.id = ci.cart_id
    where c.profile_id = v_customer_id
      and (ci.quantity < 1 or ci.quantity > 10)
  ) then
    raise exception 'CRAFT_BD_INVALID_ITEMS' using errcode = 'P0001';
  end if;

  select p.title
    into v_problem_title
  from public.cart_items ci
  join public.carts c on c.id = ci.cart_id
  join public.products p on p.id = ci.product_id
  where c.profile_id = v_customer_id
    and ci.quantity > p.stock_quantity
  order by p.id
  limit 1;

  if found then
    raise exception 'CRAFT_BD_INSUFFICIENT_STOCK:%', v_problem_title
      using errcode = 'P0001';
  end if;

  select p.title
    into v_problem_title
  from public.cart_items ci
  join public.carts c on c.id = ci.cart_id
  join public.products p on p.id = ci.product_id
  where c.profile_id = v_customer_id
    and ci.gift_wrap
    and not p.gift_wrap_available
  order by p.id
  limit 1;

  if found then
    raise exception 'CRAFT_BD_GIFT_WRAP_UNAVAILABLE:%', v_problem_title
      using errcode = 'P0001';
  end if;

  -- Server-side totals. These constants mirror lib/constants.ts:
  -- free shipping at BDT 10,000, otherwise BDT 120; gift wrap BDT 150/unit.
  select
    coalesce(sum(p.price_bdt * ci.quantity), 0)::numeric(12, 2),
    coalesce(
      sum(case when ci.gift_wrap then ci.quantity else 0 end),
      0
    )::integer
  into v_subtotal, v_wrapped_units
  from public.cart_items ci
  join public.carts c on c.id = ci.cart_id
  join public.products p on p.id = ci.product_id
  where c.profile_id = v_customer_id;

  v_shipping := case when v_subtotal >= 10000 then 0 else 120 end;
  v_gift_wrap := v_wrapped_units * 150;

  insert into public.orders (
    order_number,
    customer_id,
    status,
    payment_status,
    subtotal_bdt,
    shipping_bdt,
    gift_wrap_bdt,
    shipping_address,
    gift_message,
    gift_wrap
  )
  values (
    p_order_number,
    v_customer_id,
    'pending',
    'unpaid',
    v_subtotal,
    v_shipping,
    v_gift_wrap,
    p_shipping_address,
    nullif(btrim(p_gift_message), ''),
    v_wrapped_units > 0
  )
  returning id into v_created_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    artisan_id,
    product_title,
    product_image_url,
    unit_price_bdt,
    quantity,
    gift_wrap
  )
  select
    v_created_order_id,
    p.id,
    p.artisan_id,
    p.title,
    (
      select pi.url
      from public.product_images pi
      where pi.product_id = p.id
      order by pi.is_primary desc, pi.sort_order asc, pi.created_at asc
      limit 1
    ),
    p.price_bdt,
    ci.quantity,
    ci.gift_wrap
  from public.cart_items ci
  join public.carts c on c.id = ci.cart_id
  join public.products p on p.id = ci.product_id
  where c.profile_id = v_customer_id
  order by p.id;

  update public.products p
  set stock_quantity = p.stock_quantity - ci.quantity
  from public.cart_items ci
  join public.carts c on c.id = ci.cart_id
  where ci.product_id = p.id
    and c.profile_id = v_customer_id;

  delete from public.cart_items ci
  using public.carts c
  where ci.cart_id = c.id
    and c.profile_id = v_customer_id;

  return query select v_created_order_id, p_order_number;
end;
$$;

comment on function public.place_order(text, jsonb, text) is
  'Atomically places a cash-on-delivery order from the caller''s cart, snapshots prices, decrements stock, and clears the cart.';

revoke all on function public.place_order(text, jsonb, text) from public;
revoke all on function public.place_order(text, jsonb, text) from anon;
grant execute on function public.place_order(text, jsonb, text)
  to authenticated, service_role;
