import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { ArtisanStatus, OrderStatus, ProductStatus, ReviewStatus } from "@/lib/supabase/enums";
import type {
  AdminActivityListItem,
  AdminArtisanListItem,
  AdminCustomer,
  AdminCustomOrderDetailData,
  AdminCustomOrderListItem,
  AdminOrderDetailData,
  AdminOrderListItem,
  AdminOverview,
  AdminProductListItem,
  AdminReviewListItem,
  Artisan,
  Category,
  CustomOrder,
  CustomOrderArtisanSummary,
  CustomOrderEvent,
  Order,
  OrderItem,
  Product,
  ProductImage,
  Profile,
  Review,
} from "@/types/domain";

type CustomerRow = Pick<Profile, "id" | "full_name" | "email" | "phone">;
type CategoryRow = Pick<Category, "id" | "name" | "slug">;
type ArtisanCardRow = Pick<
  Artisan,
  | "id"
  | "slug"
  | "display_name"
  | "workshop_name"
  | "craft_specialization"
  | "district"
  | "region"
  | "avatar_url"
>;
type ProductSummaryRow = Pick<Product, "id" | "title" | "slug">;
type OrderItemSummaryRow = Pick<
  OrderItem,
  "id" | "quantity" | "product_title" | "created_at"
>;

interface RawOrderListRow extends Order {
  profiles: CustomerRow | CustomerRow[] | null;
  order_items: OrderItemSummaryRow[] | null;
}

interface RawOrderDetailRow extends Order {
  profiles: CustomerRow | CustomerRow[] | null;
  order_items: OrderItem[] | null;
}

interface RawCustomOrderRow extends CustomOrder {
  profiles: CustomerRow | CustomerRow[] | null;
  artisans: ArtisanCardRow | ArtisanCardRow[] | null;
  categories: CategoryRow | CategoryRow[] | null;
  custom_order_events: Array<Pick<CustomOrderEvent, "id">> | null;
}

interface RawCustomOrderDetailRow extends CustomOrder {
  profiles: CustomerRow | CustomerRow[] | null;
  artisans: ArtisanCardRow | ArtisanCardRow[] | null;
  categories: CategoryRow | CategoryRow[] | null;
  custom_order_events: CustomOrderEvent[] | null;
}

interface RawReviewRow extends Review {
  products: ProductSummaryRow | ProductSummaryRow[] | null;
  profiles: CustomerRow | CustomerRow[] | null;
}

interface RawProductRow extends Product {
  categories: CategoryRow | CategoryRow[] | null;
  artisans: Pick<Artisan, "id" | "display_name" | "slug"> | null;
  product_images: Array<Pick<ProductImage, "id" | "url" | "alt_text" | "is_primary" | "sort_order">> | null;
}

interface RawArtisanRow extends Artisan {
  categories: CategoryRow | CategoryRow[] | null;
  products: Array<{ id: string }> | null;
}

interface RawActivityRow extends Tables<"admin_actions"> {
  profiles: CustomerRow | CustomerRow[] | null;
}

const ORDER_LIST_COLUMNS = `
  *,
  profiles!orders_customer_id_fkey ( id, full_name, email, phone ),
  order_items ( id, quantity, product_title, created_at )
`;

const ORDER_DETAIL_COLUMNS = `
  *,
  profiles!orders_customer_id_fkey ( id, full_name, email, phone ),
  order_items ( * )
`;

const CUSTOM_ORDER_LIST_COLUMNS = `
  *,
  profiles!custom_orders_customer_id_fkey ( id, full_name, email, phone ),
  artisans ( id, slug, display_name, workshop_name, craft_specialization, district, region, avatar_url ),
  categories ( id, name, slug ),
  custom_order_events ( id )
`;

const CUSTOM_ORDER_DETAIL_COLUMNS = `
  *,
  profiles!custom_orders_customer_id_fkey ( id, full_name, email, phone ),
  artisans ( id, slug, display_name, workshop_name, craft_specialization, district, region, avatar_url ),
  categories ( id, name, slug ),
  custom_order_events ( * )
`;

const REVIEW_COLUMNS = `
  *,
  products ( id, title, slug ),
  profiles!reviews_customer_id_fkey ( id, full_name, email, phone )
`;

const PRODUCT_COLUMNS = `
  *,
  categories ( id, name, slug ),
  artisans ( id, display_name, slug ),
  product_images ( id, url, alt_text, is_primary, sort_order )
`;

const ARTISAN_COLUMNS = `
  *,
  categories!artisans_primary_category_id_fkey ( id, name, slug ),
  products ( id )
`;

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function mapCustomer(row: CustomerRow | null): AdminCustomer | null {
  if (!row) return null;

  return {
    id: row.id,
    fullName: row.full_name?.trim() || row.email?.split("@")[0] || "Craft BD member",
    email: row.email,
    phone: row.phone,
  };
}

function mapArtisan(row: ArtisanCardRow | null): CustomOrderArtisanSummary | null {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    workshopName: row.workshop_name,
    craftSpecialization: row.craft_specialization,
    district: row.district,
    region: row.region,
    avatarUrl: row.avatar_url,
  };
}

function mapCustomOrderListItem(row: RawCustomOrderRow): AdminCustomOrderListItem {
  const { profiles, artisans, categories, custom_order_events, ...order } = row;

  return {
    order,
    customer: mapCustomer(firstOrNull(profiles)),
    artisan: mapArtisan(firstOrNull(artisans)),
    category: firstOrNull(categories),
    eventCount: custom_order_events?.length ?? 0,
  };
}

function mapReview(row: RawReviewRow): AdminReviewListItem {
  const { products, profiles, ...review } = row;

  return {
    review,
    product: firstOrNull(products),
    customer: mapCustomer(firstOrNull(profiles)),
  };
}

function mapProduct(row: RawProductRow): AdminProductListItem {
  const { categories, artisans, product_images, ...product } = row;
  const images = [...(product_images ?? [])].sort(
    (a, b) =>
      Number(b.is_primary) - Number(a.is_primary) ||
      a.sort_order - b.sort_order,
  );

  return {
    product,
    category: firstOrNull(categories),
    artisan: firstOrNull(artisans),
    primaryImage: images[0]
      ? { url: images[0].url, alt_text: images[0].alt_text }
      : null,
  };
}

function mapActivity(row: RawActivityRow): AdminActivityListItem {
  const { profiles, ...action } = row;

  return {
    action,
    admin: mapCustomer(firstOrNull(profiles)),
  };
}

export interface AdminOrderFilters {
  status: OrderStatus | "all";
  q: string;
}

export async function getAdminOrders(
  filters: AdminOrderFilters,
): Promise<AdminOrderListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(ORDER_LIST_COLUMNS)
    .order("placed_at", { ascending: false });

  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.q) query = query.ilike("order_number", `%${filters.q}%`);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Could not load orders: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawOrderListRow[]).map((row) => {
    const { profiles, order_items: items, ...order } = row;
    const sorted = [...(items ?? [])].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    return {
      order,
      customer: mapCustomer(firstOrNull(profiles)),
      itemCount: sorted.reduce((total, item) => total + item.quantity, 0),
      itemTitles: sorted.map((item) => item.product_title),
    };
  });
}

export async function getAdminOrderByNumber(
  orderNumber: string,
): Promise<AdminOrderDetailData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_DETAIL_COLUMNS)
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load this order: ${error.message}`);
  }
  if (!data) return null;

  const row = data as unknown as RawOrderDetailRow;
  const { profiles, order_items: items, ...order } = row;

  return {
    order,
    customer: mapCustomer(firstOrNull(profiles)),
    items: [...(items ?? [])].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    ),
  };
}

export async function getAdminCustomOrders(filters: {
  status: CustomOrder["status"] | "all";
  q: string;
}): Promise<AdminCustomOrderListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("custom_orders")
    .select(CUSTOM_ORDER_LIST_COLUMNS)
    .order("created_at", { ascending: false });

  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.q) query = query.ilike("request_code", `%${filters.q}%`);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Could not load custom orders: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawCustomOrderRow[]).map(
    mapCustomOrderListItem,
  );
}

export async function getAdminCustomOrderByCode(
  requestCode: string,
): Promise<AdminCustomOrderDetailData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("custom_orders")
    .select(CUSTOM_ORDER_DETAIL_COLUMNS)
    .eq("request_code", requestCode)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load this custom order: ${error.message}`);
  }
  if (!data) return null;

  const row = data as unknown as RawCustomOrderDetailRow;
  const { custom_order_events: events, ...listRow } = row;

  return {
    ...mapCustomOrderListItem(listRow as RawCustomOrderRow),
    events: [...(events ?? [])].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    ),
  };
}

export async function getAdminReviews(filters: {
  status: ReviewStatus | "all";
}): Promise<AdminReviewListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("reviews")
    .select(REVIEW_COLUMNS)
    .order("created_at", { ascending: false });

  if (filters.status !== "all") query = query.eq("status", filters.status);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Could not load reviews: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawReviewRow[]).map(mapReview);
}

export async function getAdminProducts(filters: {
  status: ProductStatus | "all";
  q: string;
}): Promise<AdminProductListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("updated_at", { ascending: false });

  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.q) query = query.ilike("title", `%${filters.q}%`);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Could not load products: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawProductRow[]).map(mapProduct);
}

export async function getAdminArtisans(filters: {
  status: ArtisanStatus | "all";
  q: string;
}): Promise<AdminArtisanListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("artisans")
    .select(ARTISAN_COLUMNS)
    .order("display_name", { ascending: true });

  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.q) query = query.ilike("display_name", `%${filters.q}%`);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Could not load artisans: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawArtisanRow[]).map((row) => {
    const { categories, products, ...artisan } = row;

    return {
      artisan,
      primaryCategory: firstOrNull(categories),
      productCount: products?.length ?? 0,
    };
  });
}

export async function getAdminActivity(filters: {
  entityType: string;
}): Promise<AdminActivityListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("admin_actions")
    .select("*, profiles!admin_actions_admin_id_fkey ( id, full_name, email, phone )")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.entityType !== "all") {
    query = query.eq("entity_type", filters.entityType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Could not load the admin activity log: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawActivityRow[]).map(mapActivity);
}

function countBy<TValue extends string>(values: TValue[], value: TValue) {
  return values.filter((entry) => entry === value).length;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = await createClient();

  const [
    orderResult,
    customResult,
    reviewResult,
    productResult,
    artisanResult,
    recentActivity,
    pendingOrders,
    submittedCustomOrders,
    quotedCustomOrders,
    pendingReviews,
    flaggedReviews,
  ] = await Promise.all([
    supabase.from("orders").select("status"),
    supabase.from("custom_orders").select("status"),
    supabase.from("reviews").select("status"),
    supabase.from("products").select("status, stock_quantity"),
    supabase.from("artisans").select("status"),
    getAdminActivity({ entityType: "all" }),
    getAdminOrders({ status: "pending", q: "" }),
    getAdminCustomOrders({ status: "submitted", q: "" }),
    getAdminCustomOrders({ status: "quoted", q: "" }),
    getAdminReviews({ status: "pending" }),
    getAdminReviews({ status: "flagged" }),
  ]);

  for (const result of [
    orderResult,
    customResult,
    reviewResult,
    productResult,
    artisanResult,
  ]) {
    if (result.error) {
      throw new Error(`Could not load the admin overview: ${result.error.message}`);
    }
  }

  const orderStatuses = (orderResult.data ?? []).map((row) => row.status);
  const customStatuses = (customResult.data ?? []).map((row) => row.status);
  const reviewStatuses = (reviewResult.data ?? []).map((row) => row.status);
  const productRows = productResult.data ?? [];
  const artisanStatuses = (artisanResult.data ?? []).map((row) => row.status);

  const orders = {
    total: orderStatuses.length,
    pending: countBy(orderStatuses, "pending"),
    processing: countBy(orderStatuses, "processing"),
    shipped: countBy(orderStatuses, "shipped"),
    delivered: countBy(orderStatuses, "delivered"),
    cancelled: countBy(orderStatuses, "cancelled"),
    awaitingAction: 0,
  };
  orders.awaitingAction = orders.pending + orders.processing;

  const customOrders = {
    submitted: countBy(customStatuses, "submitted"),
    quoted: countBy(customStatuses, "quoted"),
    active:
      countBy(customStatuses, "approved") +
      countBy(customStatuses, "in_production") +
      countBy(customStatuses, "quality_check") +
      countBy(customStatuses, "dispatched"),
    completed: countBy(customStatuses, "completed"),
    open: 0,
  };
  customOrders.open = customOrders.submitted + customOrders.quoted;

  const reviews = {
    pending: countBy(reviewStatuses, "pending"),
    published: countBy(reviewStatuses, "published"),
    flagged: countBy(reviewStatuses, "flagged"),
    removed: countBy(reviewStatuses, "removed"),
    awaitingModeration: 0,
  };
  reviews.awaitingModeration = reviews.pending + reviews.flagged;

  const products = {
    published: countBy(
      productRows.map((row) => row.status),
      "published",
    ),
    draft: countBy(
      productRows.map((row) => row.status),
      "draft",
    ),
    archived: countBy(
      productRows.map((row) => row.status),
      "archived",
    ),
    lowStock: productRows.filter(
      (row) => row.status === "published" && row.stock_quantity <= 3,
    ).length,
  };

  const artisans = {
    pending: countBy(artisanStatuses, "pending"),
    approved: countBy(artisanStatuses, "approved"),
    suspended: countBy(artisanStatuses, "suspended"),
  };

  const customQueue = [...submittedCustomOrders, ...quotedCustomOrders]
    .sort(
      (a, b) =>
        new Date(b.order.created_at).getTime() -
        new Date(a.order.created_at).getTime(),
    )
    .slice(0, 5);

  const reviewQueue = [...pendingReviews, ...flaggedReviews]
    .sort(
      (a, b) =>
        new Date(b.review.created_at).getTime() -
        new Date(a.review.created_at).getTime(),
    )
    .slice(0, 5);

  return {
    counts: { orders, customOrders, reviews, products, artisans },
    queues: {
      orders: pendingOrders.slice(0, 5),
      customOrders: customQueue,
      reviews: reviewQueue,
    },
    recentActivity: recentActivity.slice(0, 6),
  };
}
