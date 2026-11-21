import type {
  ArtisanStatus,
  CustomOrderStatus,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  ReviewStatus,
} from "@/lib/supabase/enums";

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/custom-orders", label: "Custom orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/artisans", label: "Artisans" },
  { href: "/admin/activity", label: "Activity" },
] as const;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const satisfies ReadonlyArray<OrderStatus>;

export const PAYMENT_STATUSES = [
  "unpaid",
  "paid",
  "refunded",
] as const satisfies ReadonlyArray<PaymentStatus>;

export const CUSTOM_ORDER_STATUSES = [
  "submitted",
  "quoted",
  "approved",
  "declined",
  "in_production",
  "quality_check",
  "dispatched",
  "completed",
  "cancelled",
] as const satisfies ReadonlyArray<CustomOrderStatus>;

export const PRODUCT_STATUSES = [
  "draft",
  "published",
  "archived",
] as const satisfies ReadonlyArray<ProductStatus>;

export const ARTISAN_STATUSES = [
  "pending",
  "approved",
  "suspended",
] as const satisfies ReadonlyArray<ArtisanStatus>;

export const REVIEW_STATUSES = [
  "pending",
  "published",
  "flagged",
  "removed",
] as const satisfies ReadonlyArray<ReviewStatus>;

export const ADMIN_ENTITY_TYPES = [
  "order",
  "custom_order",
  "review",
  "product",
  "artisan",
] as const;

/** Order transitions the back office may make, including cancellation. */
export const ORDER_NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const PAYMENT_NEXT_STATUSES: Record<PaymentStatus, PaymentStatus[]> = {
  unpaid: ["paid"],
  paid: ["refunded"],
  refunded: [],
};

/** Custom-order transitions the back office may make once an estimate exists. */
export const CUSTOM_ORDER_NEXT_STATUSES: Record<
  CustomOrderStatus,
  CustomOrderStatus[]
> = {
  submitted: ["cancelled"],
  quoted: ["cancelled"],
  approved: ["in_production", "cancelled"],
  in_production: ["quality_check", "cancelled"],
  quality_check: ["dispatched", "cancelled"],
  dispatched: ["completed"],
  completed: [],
  declined: [],
  cancelled: [],
};

export function textParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

/** Limit free-text filters to harmless characters for PostgREST `ilike`. */
export function searchParam(value: string | string[] | undefined) {
  return textParam(value)
    .replace(/[%_,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function oneOf<TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | "all" {
  return values.includes(value as TValue) ? (value as TValue) : "all";
}

export const parseOrderStatusFilter = (value: string | string[] | undefined) =>
  oneOf(ORDER_STATUSES, textParam(value));

export const parseCustomOrderStatusFilter = (
  value: string | string[] | undefined,
) => oneOf(CUSTOM_ORDER_STATUSES, textParam(value));

export const parseProductStatusFilter = (value: string | string[] | undefined) =>
  oneOf(PRODUCT_STATUSES, textParam(value));

export const parseArtisanStatusFilter = (value: string | string[] | undefined) =>
  oneOf(ARTISAN_STATUSES, textParam(value));

export const parseReviewStatusFilter = (value: string | string[] | undefined) =>
  oneOf(REVIEW_STATUSES, textParam(value));

export const parseEntityTypeFilter = (value: string | string[] | undefined) =>
  oneOf(ADMIN_ENTITY_TYPES, textParam(value));

export function productStatusBadgeVariant(status: ProductStatus) {
  switch (status) {
    case "published":
      return "success" as const;
    case "archived":
      return "secondary" as const;
    case "draft":
    default:
      return "outline" as const;
  }
}

export function artisanStatusBadgeVariant(status: ArtisanStatus) {
  switch (status) {
    case "approved":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "suspended":
    default:
      return "outline" as const;
  }
}

export function reviewStatusBadgeVariant(status: ReviewStatus) {
  switch (status) {
    case "published":
      return "success" as const;
    case "pending":
    case "flagged":
      return "warning" as const;
    case "removed":
    default:
      return "outline" as const;
  }
}
