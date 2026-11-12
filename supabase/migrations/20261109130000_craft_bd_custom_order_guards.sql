-- =============================================================================
-- Craft BD — custom order participant guards
-- =============================================================================
-- The participant RLS policies let a customer update their own custom order.
-- These triggers narrow that permission to the actions the customer-facing
-- flow actually needs: answering a studio estimate and withdrawing a request.
-- Artisans and administrators keep their full update rights.
--
-- The same file keeps reviews customer-safe: a new review must start pending
-- and verified, and only its written content may be edited before moderation.
-- =============================================================================

create or replace function public.guard_customer_custom_order_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
begin
  if actor is null
     or public.is_admin()
     or public.owns_artisan(old.artisan_id) then
    return new;
  end if;

  if actor <> old.customer_id then
    raise exception 'CRAFT_BD_NOT_ORDER_PARTICIPANT';
  end if;

  if new.status is distinct from old.status then
    if not (
      (old.status = 'quoted' and new.status in ('approved', 'declined'))
      or (old.status in ('submitted', 'quoted') and new.status = 'cancelled')
    ) then
      raise exception 'CRAFT_BD_INVALID_STATUS_TRANSITION';
    end if;
  end if;

  if new.request_code is distinct from old.request_code
     or new.customer_id is distinct from old.customer_id
     or new.artisan_id is distinct from old.artisan_id
     or new.category_id is distinct from old.category_id
     or new.product_type is distinct from old.product_type
     or new.design_description is distinct from old.design_description
     or new.color is distinct from old.color
     or new.size is distinct from old.size
     or new.material is distinct from old.material
     or new.quantity is distinct from old.quantity
     or new.reference_image_url is distinct from old.reference_image_url
     or new.custom_notes is distinct from old.custom_notes
     or new.budget_min_bdt is distinct from old.budget_min_bdt
     or new.budget_max_bdt is distinct from old.budget_max_bdt
     or new.price_estimate_bdt is distinct from old.price_estimate_bdt
     or new.estimated_days is distinct from old.estimated_days
     or new.artisan_note is distinct from old.artisan_note
  then
    raise exception 'CRAFT_BD_FIELDS_LOCKED';
  end if;

  return new;
end;
$$;

drop trigger if exists custom_orders_guard_customer_update
  on public.custom_orders;

create trigger custom_orders_guard_customer_update
  before update on public.custom_orders
  for each row execute function public.guard_customer_custom_order_update();

create or replace function public.guard_customer_custom_order_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  order_customer uuid;
  order_artisan uuid;
begin
  if actor is null or public.is_admin() then
    return new;
  end if;

  select co.customer_id, co.artisan_id
    into order_customer, order_artisan
  from public.custom_orders co
  where co.id = new.custom_order_id;

  if order_customer is null then
    raise exception 'CRAFT_BD_UNKNOWN_CUSTOM_ORDER';
  end if;

  if public.owns_artisan(order_artisan) then
    return new;
  end if;

  if actor <> order_customer then
    raise exception 'CRAFT_BD_NOT_ORDER_PARTICIPANT';
  end if;

  if new.status not in ('submitted', 'approved', 'declined', 'cancelled') then
    raise exception 'CRAFT_BD_INVALID_EVENT_STATUS';
  end if;

  return new;
end;
$$;

drop trigger if exists custom_order_events_guard_customer_insert
  on public.custom_order_events;

create trigger custom_order_events_guard_customer_insert
  before insert on public.custom_order_events
  for each row execute function public.guard_customer_custom_order_event();

-- -----------------------------------------------------------------------------
-- Customer review guards
-- -----------------------------------------------------------------------------
-- The insert policy proves a delivered order item belongs to the customer. These
-- triggers make sure a customer can never skip moderation: new reviews must be
-- pending and verified, and only the written content may be edited afterwards.
-- -----------------------------------------------------------------------------

create or replace function public.guard_customer_review_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
begin
  if actor is null or public.is_admin() then
    return new;
  end if;

  if new.customer_id is distinct from actor then
    raise exception 'CRAFT_BD_NOT_REVIEW_AUTHOR';
  end if;

  if new.status <> 'pending' then
    raise exception 'CRAFT_BD_REVIEW_NOT_PENDING';
  end if;

  if new.is_verified_purchase is distinct from true then
    raise exception 'CRAFT_BD_REVIEW_NOT_VERIFIED';
  end if;

  if new.admin_note is not null or new.flagged_reason is not null then
    raise exception 'CRAFT_BD_REVIEW_FIELDS_LOCKED';
  end if;

  return new;
end;
$$;

drop trigger if exists reviews_guard_customer_insert on public.reviews;

create trigger reviews_guard_customer_insert
  before insert on public.reviews
  for each row execute function public.guard_customer_review_insert();

create or replace function public.guard_customer_review_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
begin
  if actor is null or public.is_admin() then
    return new;
  end if;

  if old.customer_id is distinct from actor then
    raise exception 'CRAFT_BD_NOT_REVIEW_AUTHOR';
  end if;

  if new.customer_id is distinct from old.customer_id
     or new.product_id is distinct from old.product_id
     or new.order_item_id is distinct from old.order_item_id
     or new.status is distinct from old.status
     or new.is_verified_purchase is distinct from old.is_verified_purchase
     or new.admin_note is distinct from old.admin_note
     or new.flagged_reason is distinct from old.flagged_reason
  then
    raise exception 'CRAFT_BD_REVIEW_FIELDS_LOCKED';
  end if;

  return new;
end;
$$;

drop trigger if exists reviews_guard_customer_update on public.reviews;

create trigger reviews_guard_customer_update
  before update on public.reviews
  for each row execute function public.guard_customer_review_update();
