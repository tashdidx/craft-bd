-- -----------------------------------------------------------------------------
-- Order cancellation is a stock movement
--
-- Checkout decrements stock inside `place_order`. Cancelling an order must put
-- those units back, exactly once:
--
--   * only a pending or processing order may be cancelled (before dispatch)
--   * the transition into `cancelled` returns every linked order-item quantity
--     to its product
--   * a cancelled order can never leave `cancelled`, so stock cannot be
--     restored twice
--
-- The trigger is security definer because the stock update happens on the
-- products table while the caller is updating an order. Only administrators can
-- update orders under RLS, so this does not widen customer permissions.
-- -----------------------------------------------------------------------------
create or replace function public.restock_order_on_cancel()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status = 'cancelled' and new.status is distinct from old.status then
    raise exception 'CRAFT_BD_ORDER_CANCELLED_TERMINAL';
  end if;

  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    if old.status not in ('pending', 'processing') then
      raise exception 'CRAFT_BD_ORDER_NOT_CANCELLABLE';
    end if;

    update public.products p
    set stock_quantity = p.stock_quantity + movement.quantity
    from (
      select product_id, sum(quantity)::integer as quantity
      from public.order_items
      where order_id = new.id
        and product_id is not null
      group by product_id
    ) as movement
    where p.id = movement.product_id;
  end if;

  return new;
end;
$$;

drop trigger if exists orders_restock_on_cancel on public.orders;

create trigger orders_restock_on_cancel
  before update of status on public.orders
  for each row execute function public.restock_order_on_cancel();

comment on function public.restock_order_on_cancel() is
  'Returns cancelled order quantities to stock once and keeps cancellation terminal.';
