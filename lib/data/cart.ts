import "server-only";

import { cache } from "react";
import { getCurrentUser } from "@/lib/auth";
import { calculateCartTotals } from "@/lib/commerce";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { CartData, CartLine } from "@/types/domain";

interface RawCartProduct {
  id: string;
  slug: string;
  title: string;
  price_bdt: number;
  stock_quantity: number;
  gift_wrap_available: boolean;
  status: string;
  product_images: Array<
    Pick<
      Tables<"product_images">,
      "url" | "alt_text" | "is_primary" | "sort_order"
    >
  >;
  artisans: Pick<Tables<"artisans">, "id" | "display_name"> | null;
}

interface RawCartItem {
  id: string;
  product_id: string;
  quantity: number;
  gift_wrap: boolean;
  products: RawCartProduct | RawCartProduct[] | null;
}

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function emptyCart(): CartData {
  return {
    id: null,
    items: [],
    itemCount: 0,
    wrappedUnits: 0,
    subtotalBdt: 0,
    shippingBdt: 0,
    giftWrapBdt: 0,
    totalBdt: 0,
  };
}

/**
 * Request-scoped cart read. RLS guarantees the rows belong to the signed-in
 * customer, so no explicit profile filter is needed on `cart_items`.
 */
export const getCart = cache(async (): Promise<CartData> => {
  const current = await getCurrentUser();
  if (!current) return emptyCart();

  const supabase = await createClient();
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("profile_id", current.user.id)
    .maybeSingle();

  if (cartError) {
    throw new Error(`Could not load your cart: ${cartError.message}`);
  }
  if (!cart) return emptyCart();

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
        id,
        product_id,
        quantity,
        gift_wrap,
        products (
          id,
          slug,
          title,
          price_bdt,
          stock_quantity,
          gift_wrap_available,
          status,
          product_images ( url, alt_text, is_primary, sort_order ),
          artisans ( id, display_name )
        )
      `,
    )
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Could not load your cart: ${error.message}`);
  }

  const items = ((data ?? []) as unknown as RawCartItem[]).flatMap<CartLine>(
    (row) => {
      const product = firstOrNull(row.products);
      if (!product || product.status !== "published") return [];

      const images = [...product.product_images].sort(
        (a, b) =>
          Number(b.is_primary) - Number(a.is_primary) ||
          a.sort_order - b.sort_order,
      );
      const primary = images[0] ?? null;

      return [
        {
          id: row.id,
          productId: product.id,
          slug: product.slug,
          title: product.title,
          priceBdt: product.price_bdt,
          quantity: row.quantity,
          stockQuantity: product.stock_quantity,
          giftWrap: row.gift_wrap,
          giftWrapAvailable: product.gift_wrap_available,
          artisanId: product.artisans?.id ?? null,
          artisanName: product.artisans?.display_name ?? null,
          imageUrl: primary?.url ?? null,
          imageAlt: primary?.alt_text ?? product.title,
          lineTotalBdt: product.price_bdt * row.quantity,
        },
      ];
    },
  );

  const totals = calculateCartTotals(
    items.map((item) => ({
      priceBdt: item.priceBdt,
      quantity: item.quantity,
      giftWrap: item.giftWrap,
    })),
  );

  return {
    id: cart.id,
    items,
    ...totals,
  };
});

/** Lightweight unit count for the header badge. */
export const getCartCount = cache(async (): Promise<number> => {
  const current = await getCurrentUser();
  if (!current) return 0;

  const supabase = await createClient();
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("profile_id", current.user.id)
    .maybeSingle();

  if (!cart) return 0;

  const { data, error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("cart_id", cart.id);

  if (error) return 0;

  return (data ?? []).reduce((total, item) => total + item.quantity, 0);
});
