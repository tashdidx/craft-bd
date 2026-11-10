/**
 * Offline SQL verifier for the Craft BD Supabase schema and seed.
 *
 * This does not replace Supabase. It starts a throwaway in-process Postgres
 * (PGlite), stubs the Supabase auth schema/functions, runs every migration and
 * the seed, then asserts the relational invariants the app relies on.
 *
 * Usage: npm run db:verify
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";

const root = resolve(process.cwd(), "supabase");
const migrationsDir = join(root, "migrations");
const seedPath = join(root, "seed.sql");

const db = new PGlite();

type Row = Record<string, unknown>;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function count(table: string): Promise<number> {
  const result = await db.query<{ n: number }>(
    `select count(*)::int as n from public.${table}`,
  );
  return result.rows[0]?.n ?? 0;
}

async function scalar<T extends Row>(sql: string): Promise<T> {
  const result = await db.query<T>(sql);
  assert(result.rows[0], `Query returned no rows: ${sql}`);
  return result.rows[0];
}

async function main() {
  console.log("→ Creating Supabase auth stub for the offline harness…");
  await db.exec(`
    create schema if not exists auth;

    create table auth.users (
      id uuid primary key,
      instance_id uuid,
      aud text,
      role text,
      email text unique,
      encrypted_password text,
      email_confirmed_at timestamptz,
      recovery_sent_at timestamptz,
      last_sign_in_at timestamptz,
      raw_app_meta_data jsonb,
      raw_user_meta_data jsonb,
      created_at timestamptz,
      updated_at timestamptz,
      confirmation_token text,
      email_change text,
      email_change_token_new text,
      recovery_token text
    );

    create table auth.identities (
      id uuid primary key,
      user_id uuid not null references auth.users (id) on delete cascade,
      provider_id text,
      identity_data jsonb,
      provider text,
      last_sign_in_at timestamptz,
      created_at timestamptz,
      updated_at timestamptz
    );

    create or replace function auth.uid()
    returns uuid language sql stable as $$ select null::uuid $$;

    create or replace function auth.jwt()
    returns jsonb language sql stable as $$ select '{}'::jsonb $$;

    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin;
  `);

  const migrations = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrations) {
    process.stdout.write(`→ Applying ${file}… `);
    await db.exec(readFileSync(join(migrationsDir, file), "utf8"));
    console.log("ok");
  }

  if (!existsSync(seedPath)) {
    console.log("→ No seed.sql found; skipping seed checks.");
    return;
  }

  process.stdout.write("→ Applying seed.sql… ");
  await db.exec(readFileSync(seedPath, "utf8"));
  console.log("ok");

  const expected = {
    profiles: 14,
    categories: 8,
    artisans: 9,
    products: 16,
    product_images: 32,
    craft_stories: 16,
    craft_journeys: 96,
    certificates: 16,
    addresses: 4,
    orders: 4,
    order_items: 5,
    custom_orders: 3,
    custom_order_events: 7,
    reviews: 4,
    carts: 1,
    cart_items: 1,
    wishlists: 3,
    admin_actions: 1,
  } as const;

  console.log("\nRow counts");
  for (const [table, min] of Object.entries(expected)) {
    const actual = await count(table);
    console.log(`  ${table.padEnd(22)} ${String(actual).padStart(3)}`);
    assert(
      actual === min,
      `${table}: expected ${min} rows, found ${actual}`,
    );
  }

  console.log("\nInvariant checks");

  const journeyCheck = await scalar<{ products: number }>(`
    select count(*)::int as products
    from (
      select product_id
      from public.craft_journeys
      group by product_id
      having count(*) = 6
         and count(distinct stage) = 6
         and min(sort_order) = 1
         and max(sort_order) = 6
    ) complete
  `);
  assert(
    journeyCheck.products === expected.products,
    `every product needs six ordered journey stages (found ${journeyCheck.products})`,
  );
  console.log("  ✓ every product has all 6 journey stages");

  const imageCheck = await scalar<{ products: number }>(`
    select count(*)::int as products
    from public.products p
    where exists (
      select 1 from public.product_images i
      where i.product_id = p.id and i.is_primary
    )
  `);
  assert(
    imageCheck.products === expected.products,
    `every product needs a primary image (found ${imageCheck.products})`,
  );
  console.log("  ✓ every product has a primary image");

  const storyCheck = await scalar<{ products: number }>(`
    select count(distinct product_id)::int as products from public.craft_stories
  `);
  assert(
    storyCheck.products === expected.products,
    `every product needs a craft story (found ${storyCheck.products})`,
  );
  console.log("  ✓ every product has a craft story");

  const certificateCheck = await scalar<{ certificates: number }>(`
    select count(*)::int as certificates
    from public.certificates
    where certificate_hash =
      encode(sha256(convert_to(certificate_payload::text, 'UTF8')), 'hex')
  `);
  assert(
    certificateCheck.certificates === expected.certificates,
    `every certificate hash must match its payload (found ${certificateCheck.certificates})`,
  );
  console.log("  ✓ every certificate hash matches its payload");

  const orphanCheck = await scalar<{ orphans: number }>(`
    select count(*)::int as orphans
    from public.certificates c
    join public.products p on p.id = c.product_id
    join public.artisans a on a.id = c.artisan_id
    where p.artisan_id <> a.id
  `);
  assert(
    orphanCheck.orphans === 0,
    "certificates must reference the product's own artisan",
  );
  console.log("  ✓ certificates reference the correct artisan");

  const publishedCheck = await scalar<{ missing: number }>(`
    select count(*)::int as missing
    from public.products
    where status = 'published'
      and (published_at is null or stock_quantity <= 0)
  `);
  assert(
    publishedCheck.missing === 0,
    "published seed products must have stock and a publish date",
  );
  console.log("  ✓ published products have stock and publish dates");

  const reviewCheck = await scalar<{ invalid: number }>(`
    select count(*)::int as invalid
    from public.reviews r
    join public.products p on p.id = r.product_id
    join public.profiles c on c.id = r.customer_id
    where r.rating not between 1 and 5
  `);
  assert(reviewCheck.invalid === 0, "review ratings must be between 1 and 5");
  console.log("  ✓ review ratings are in range");

  const rlsCheck = await scalar<{ missing: number }>(`
    select count(*)::int as missing
    from pg_tables t
    where t.schemaname = 'public'
      and not exists (
        select 1 from pg_class c
        where c.oid = format('%I.%I', t.schemaname, t.tablename)::regclass
          and c.relrowsecurity
      )
  `);
  assert(rlsCheck.missing === 0, "RLS must be enabled on every public table");
  console.log("  ✓ RLS is enabled on every public table");

  const orderRpcCheck = await scalar<{ present: boolean }>(`
    select exists (
      select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and p.proname = 'place_order'
    ) as present
  `);
  assert(orderRpcCheck.present, "the atomic place_order RPC must exist");
  console.log("  ✓ the atomic place_order RPC exists");

  // Exercise the checkout transaction offline with the seeded customer's cart.
  const testCustomer = "33333333-3333-4333-8333-333333333304";
  const testProduct = "b1000000-0000-4000-8000-000000000013";
  const testCart = "a4000000-0000-4000-8000-000000000001";
  const testAddress = `'{
    "recipient_name": "Offline Test",
    "phone": "+8801700000000",
    "address_line1": "12 Test Lane",
    "address_line2": null,
    "city": "Dhaka",
    "district": "Dhaka",
    "division": "dhaka",
    "postal_code": "1207"
  }'::jsonb`;

  await db.exec(`
    create or replace function auth.uid()
    returns uuid language sql stable
    as $$ select '${testCustomer}'::uuid $$;
  `);

  const stockBefore = await scalar<{ stock: number }>(`
    select stock_quantity::int as stock
    from public.products
    where id = '${testProduct}'
  `);

  const placed = await scalar<{
    order_id: string;
    order_number: string;
  }>(`
    select order_id, order_number
    from public.place_order('CBD-2026-9001', ${testAddress}, 'Offline test')
  `);

  assert(
    placed.order_number === "CBD-2026-9001",
    "place_order must return the generated order number",
  );

  const placedOrder = await scalar<{
    subtotal: number;
    shipping: number;
    gift_wrap: number;
    total: number;
    gift_wrap_flag: boolean;
  }>(`
    select
      subtotal_bdt::int as subtotal,
      shipping_bdt::int as shipping,
      gift_wrap_bdt::int as gift_wrap,
      total_bdt::int as total,
      gift_wrap as gift_wrap_flag
    from public.orders
    where id = '${placed.order_id}'
  `);

  assert(placedOrder.subtotal === 1_750, "order subtotal must come from the product price");
  assert(placedOrder.shipping === 120, "orders below BDT 10,000 pay BDT 120 shipping");
  assert(placedOrder.gift_wrap === 150, "gift wrap must be charged per wrapped unit");
  assert(placedOrder.total === 2_020, "order total must add subtotal, shipping, and gift wrap");
  assert(placedOrder.gift_wrap_flag, "orders with wrapped units must set gift_wrap");

  const placedItem = await scalar<{
    quantity: number;
    unit_price: number;
    gift_wrap: boolean;
  }>(`
    select quantity, unit_price_bdt::int as unit_price, gift_wrap
    from public.order_items
    where order_id = '${placed.order_id}'
  `);

  assert(placedItem.quantity === 1, "order item quantity must match the cart");
  assert(placedItem.unit_price === 1_750, "order item price must be snapshotted");
  assert(placedItem.gift_wrap, "order item gift wrap must be snapshotted");

  const stockAfter = await scalar<{ stock: number }>(`
    select stock_quantity::int as stock
    from public.products
    where id = '${testProduct}'
  `);

  assert(
    stockAfter.stock === stockBefore.stock - 1,
    "place_order must decrement product stock",
  );

  const cartAfter = await scalar<{ items: number }>(`
    select count(*)::int as items
    from public.cart_items
    where cart_id = '${testCart}'
  `);

  assert(cartAfter.items === 0, "place_order must clear the customer's cart");
  console.log("  ✓ place_order writes snapshots, decrements stock, and clears the cart");

  async function expectPlaceOrderError(orderNumber: string, marker: string) {
    let caught: unknown = null;
    try {
      await db.query(
        `select * from public.place_order('${orderNumber}', ${testAddress}, null)`,
      );
    } catch (error) {
      caught = error;
    }

    assert(
      String((caught as Error | null)?.message ?? "").includes(marker),
      `place_order must raise ${marker}`,
    );
  }

  // The per-line quantity cap is validated before stock.
  await db.exec(`
    insert into public.cart_items (cart_id, product_id, quantity, gift_wrap)
    values ('${testCart}', '${testProduct}', 99, false)
  `);
  await expectPlaceOrderError("CBD-2026-9002", "CRAFT_BD_INVALID_ITEMS");

  // Over-ordering must raise and leave both stock and order history untouched.
  await db.exec(`
    update public.cart_items
    set quantity = 5
    where cart_id = '${testCart}' and product_id = '${testProduct}';

    update public.products
    set stock_quantity = 3
    where id = '${testProduct}';
  `);
  await expectPlaceOrderError("CBD-2026-9003", "CRAFT_BD_INSUFFICIENT_STOCK");

  const stockAfterFailures = await scalar<{ stock: number }>(`
    select stock_quantity::int as stock
    from public.products
    where id = '${testProduct}'
  `);
  const failedOrders = await scalar<{ orders: number }>(`
    select count(*)::int as orders
    from public.orders
    where order_number in ('CBD-2026-9002', 'CBD-2026-9003')
  `);

  assert(
    stockAfterFailures.stock === 3,
    "a failed checkout must not move stock",
  );
  assert(failedOrders.orders === 0, "a failed checkout must not write an order");
  console.log("  ✓ invalid and over-stock checkouts roll back atomically");

  await db.exec(`
    delete from public.cart_items
    where cart_id = '${testCart}' and product_id = '${testProduct}';

    update public.products
    set stock_quantity = ${stockBefore.stock}
    where id = '${testProduct}';
  `);

  const adminCheck = await scalar<{ admins: number }>(`
    select count(*)::int as admins from public.profiles where role = 'admin'
  `);
  assert(adminCheck.admins >= 1, "at least one admin seed account is required");
  console.log("  ✓ an admin account is seeded");

  console.log("\nDatabase verification passed.");
}

main()
  .catch((error) => {
    console.error("\nDatabase verification failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });
