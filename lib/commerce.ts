import {
  DEFAULT_SHIPPING_BDT,
  FREE_SHIPPING_THRESHOLD_BDT,
  GIFT_WRAP_BDT,
  ORDER_STATUS_FLOW,
} from "@/lib/constants";
import type { OrderStatus } from "@/lib/supabase/enums";

/** A single cart line may not hold more than this many units. */
export const CART_MAX_QUANTITY = 10;

export interface GiftBudget {
  value: string;
  label: string;
  description: string;
  minPrice?: number;
  maxPrice?: number;
}

/** Deterministic occasion + budget presets for the gift finder (FR-14). */
export const GIFT_BUDGETS: ReadonlyArray<GiftBudget> = [
  {
    value: "under-2000",
    label: "Under ৳2,000",
    description: "Small handmade tokens",
    maxPrice: 1_999,
  },
  {
    value: "2000-5000",
    label: "৳2,000 – ৳5,000",
    description: "A considered everyday gift",
    minPrice: 2_000,
    maxPrice: 5_000,
  },
  {
    value: "5000-10000",
    label: "৳5,000 – ৳10,000",
    description: "Statement pieces",
    minPrice: 5_001,
    maxPrice: 10_000,
  },
  {
    value: "over-10000",
    label: "Over ৳10,000",
    description: "Heirloom commissions",
    minPrice: 10_001,
  },
];

export function findGiftBudget(
  value: string | string[] | undefined,
): GiftBudget | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;

  return GIFT_BUDGETS.find((budget) => budget.value === raw) ?? null;
}

export interface CartTotalsInput {
  priceBdt: number;
  quantity: number;
  giftWrap: boolean;
}

export interface CartTotals {
  itemCount: number;
  wrappedUnits: number;
  subtotalBdt: number;
  shippingBdt: number;
  giftWrapBdt: number;
  totalBdt: number;
}

/**
 * Shipping is free over the threshold. Gift wrap is charged once per wrapped
 * unit, matching the "+৳150 per piece" label in the cart.
 */
export function shippingForSubtotal(subtotalBdt: number) {
  if (subtotalBdt <= 0) return 0;
  return subtotalBdt >= FREE_SHIPPING_THRESHOLD_BDT ? 0 : DEFAULT_SHIPPING_BDT;
}

export function calculateCartTotals(items: CartTotalsInput[]): CartTotals {
  const subtotalBdt = items.reduce(
    (total, item) => total + item.priceBdt * item.quantity,
    0,
  );
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const wrappedUnits = items.reduce(
    (total, item) => total + (item.giftWrap ? item.quantity : 0),
    0,
  );
  const shippingBdt = shippingForSubtotal(subtotalBdt);
  const giftWrapBdt = wrappedUnits * GIFT_WRAP_BDT;

  return {
    itemCount,
    wrappedUnits,
    subtotalBdt,
    shippingBdt,
    giftWrapBdt,
    totalBdt: subtotalBdt + shippingBdt + giftWrapBdt,
  };
}

export function orderStatusIndex(status: OrderStatus) {
  return ORDER_STATUS_FLOW.indexOf(status);
}

export function orderStatusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "success" as const;
    case "shipped":
      return "accent" as const;
    case "processing":
      return "secondary" as const;
    case "cancelled":
      return "outline" as const;
    case "pending":
    default:
      return "warning" as const;
  }
}

/** Human-facing gift budget label for headings and empty states. */
export function giftBudgetLabel(budget: GiftBudget | null) {
  return budget?.label ?? "Any budget";
}
