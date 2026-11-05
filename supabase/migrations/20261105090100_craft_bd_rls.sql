-- =============================================================================
-- Craft BD — Row-level security and API grants
-- =============================================================================
-- Public catalogue data is readable anonymously. Everything else is scoped to
-- the authenticated owner, the artisan studio, or an administrator.
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.artisans enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.craft_stories enable row level security;
alter table public.craft_journeys enable row level security;
alter table public.certificates enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.custom_orders enable row level security;
alter table public.custom_order_events enable row level security;
alter table public.reviews enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.admin_actions enable row level security;

-- -----------------------------------------------------------------------------
-- Profiles
-- -----------------------------------------------------------------------------
create policy profiles_select_own_or_admin
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy profiles_update_own_or_admin
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()) or public.is_admin())
  with check (id = (select auth.uid()) or public.is_admin());

create policy profiles_admin_delete
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Categories
-- -----------------------------------------------------------------------------
create policy categories_public_read_active
  on public.categories for select
  to anon, authenticated
  using (is_active or public.is_admin());

create policy categories_admin_manage
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Artisans
-- -----------------------------------------------------------------------------
create policy artisans_public_read
  on public.artisans for select
  to anon, authenticated
  using (
    status = 'approved'
    or profile_id = (select auth.uid())
    or public.is_admin()
  );

create policy artisans_self_register
  on public.artisans for insert
  to authenticated
  with check (
    profile_id = (select auth.uid())
    and status = 'pending'
    and not is_featured
  );

create policy artisans_update_own
  on public.artisans for update
  to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy artisans_admin_manage
  on public.artisans for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Products
-- -----------------------------------------------------------------------------
create policy products_public_read
  on public.products for select
  to anon, authenticated
  using (
    status = 'published'
    or public.owns_artisan(artisan_id)
    or public.is_admin()
  );

create policy products_artisan_insert
  on public.products for insert
  to authenticated
  with check (
    public.owns_artisan(artisan_id)
    and not is_featured
    and status in ('draft', 'published')
  );

create policy products_artisan_update
  on public.products for update
  to authenticated
  using (public.owns_artisan(artisan_id))
  with check (public.owns_artisan(artisan_id));

create policy products_artisan_delete
  on public.products for delete
  to authenticated
  using (public.owns_artisan(artisan_id));

create policy products_admin_manage
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Product media & storytelling
-- -----------------------------------------------------------------------------
create policy product_images_public_read
  on public.product_images for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p where p.id = product_images.product_id
    )
  );

create policy product_images_manage
  on public.product_images for all
  to authenticated
  using (public.can_manage_product(product_id))
  with check (public.can_manage_product(product_id));

create policy craft_stories_public_read
  on public.craft_stories for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p where p.id = craft_stories.product_id
    )
  );

create policy craft_stories_manage
  on public.craft_stories for all
  to authenticated
  using (public.can_manage_product(product_id))
  with check (public.can_manage_product(product_id));

create policy craft_journeys_public_read
  on public.craft_journeys for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p where p.id = craft_journeys.product_id
    )
  );

create policy craft_journeys_manage
  on public.craft_journeys for all
  to authenticated
  using (public.can_manage_product(product_id))
  with check (public.can_manage_product(product_id));

-- -----------------------------------------------------------------------------
-- Certificates
-- -----------------------------------------------------------------------------
-- Verification must work for signed-out visitors, including revoked records.
create policy certificates_public_read
  on public.certificates for select
  to anon, authenticated
  using (true);

create policy certificates_admin_manage
  on public.certificates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Addresses
-- -----------------------------------------------------------------------------
create policy addresses_own
  on public.addresses for all
  to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy addresses_admin_manage
  on public.addresses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Orders
-- -----------------------------------------------------------------------------
create policy orders_customer_read
  on public.orders for select
  to authenticated
  using (customer_id = (select auth.uid()) or public.is_admin());

create policy orders_customer_insert
  on public.orders for insert
  to authenticated
  with check (customer_id = (select auth.uid()));

create policy orders_admin_manage
  on public.orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy order_items_read
  on public.order_items for select
  to authenticated
  using (
    public.is_admin()
    or public.owns_artisan(artisan_id)
    or exists (
      select 1 from public.orders o where o.id = order_items.order_id
    )
  );

create policy order_items_customer_insert
  on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.customer_id = (select auth.uid())
    )
  );

create policy order_items_admin_manage
  on public.order_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Custom orders
-- -----------------------------------------------------------------------------
create policy custom_orders_participant_read
  on public.custom_orders for select
  to authenticated
  using (
    customer_id = (select auth.uid())
    or public.owns_artisan(artisan_id)
    or public.is_admin()
  );

create policy custom_orders_customer_insert
  on public.custom_orders for insert
  to authenticated
  with check (
    customer_id = (select auth.uid())
    and status = 'submitted'
  );

create policy custom_orders_participant_update
  on public.custom_orders for update
  to authenticated
  using (
    customer_id = (select auth.uid())
    or public.owns_artisan(artisan_id)
    or public.is_admin()
  )
  with check (
    customer_id = (select auth.uid())
    or public.owns_artisan(artisan_id)
    or public.is_admin()
  );

create policy custom_orders_admin_manage
  on public.custom_orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy custom_order_events_participant_read
  on public.custom_order_events for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.custom_orders co
      where co.id = custom_order_events.custom_order_id
    )
  );

create policy custom_order_events_participant_insert
  on public.custom_order_events for insert
  to authenticated
  with check (
    actor_id = (select auth.uid())
    and exists (
      select 1 from public.custom_orders co
      where co.id = custom_order_events.custom_order_id
    )
  );

create policy custom_order_events_admin_manage
  on public.custom_order_events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Reviews
-- -----------------------------------------------------------------------------
create policy reviews_public_read
  on public.reviews for select
  to anon, authenticated
  using (
    status = 'published'
    or customer_id = (select auth.uid())
    or public.is_admin()
  );

create policy reviews_verified_customer_insert
  on public.reviews for insert
  to authenticated
  with check (
    customer_id = (select auth.uid())
    and order_item_id is not null
    and exists (
      select 1
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where oi.id = reviews.order_item_id
        and o.customer_id = (select auth.uid())
        and o.status = 'delivered'
    )
  );

create policy reviews_customer_update_pending
  on public.reviews for update
  to authenticated
  using (
    customer_id = (select auth.uid())
    and status = 'pending'
  )
  with check (
    customer_id = (select auth.uid())
    and status = 'pending'
  );

create policy reviews_customer_delete_pending
  on public.reviews for delete
  to authenticated
  using (
    customer_id = (select auth.uid())
    and status = 'pending'
  );

create policy reviews_admin_manage
  on public.reviews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Cart & wishlist
-- -----------------------------------------------------------------------------
create policy carts_own
  on public.carts for all
  to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy carts_admin_manage
  on public.carts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy cart_items_own
  on public.cart_items for all
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.carts c where c.id = cart_items.cart_id
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.carts c where c.id = cart_items.cart_id
    )
  );

create policy wishlists_own
  on public.wishlists for all
  to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy wishlists_admin_manage
  on public.wishlists for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Admin audit trail
-- -----------------------------------------------------------------------------
create policy admin_actions_admin_only
  on public.admin_actions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- API role grants (RLS still applies to anon and authenticated)
-- -----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant select on
  public.categories,
  public.artisans,
  public.products,
  public.product_images,
  public.craft_stories,
  public.craft_journeys,
  public.certificates,
  public.reviews
to anon;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;

grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.owns_artisan(uuid) to anon, authenticated, service_role;
grant execute on function public.can_manage_product(uuid) to anon, authenticated, service_role;
