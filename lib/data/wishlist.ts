import "server-only";

import { cache } from "react";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { mapCard, PRODUCT_CARD_COLUMNS, type RawCardRow } from "@/lib/data/catalogue";
import type { WishlistEntry } from "@/types/domain";

interface RawWishlistRow {
  created_at: string;
  products: RawCardRow | RawCardRow[] | null;
}

export const getWishlistProductIds = cache(async (): Promise<Set<string>> => {
  const current = await getCurrentUser();
  if (!current) return new Set();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("profile_id", current.user.id);

  if (error) return new Set();

  return new Set((data ?? []).map((row) => row.product_id));
});

export const getWishlist = cache(async (): Promise<WishlistEntry[]> => {
  const current = await getCurrentUser();
  if (!current) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlists")
    .select(`created_at, products!inner ( ${PRODUCT_CARD_COLUMNS} )`)
    .eq("profile_id", current.user.id)
    .eq("products.status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load your wishlist: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawWishlistRow[]).flatMap((row) => {
    const product = Array.isArray(row.products)
      ? row.products[0]
      : row.products;

    if (!product) return [];

    return [{ addedAt: row.created_at, product: mapCard(product) }];
  });
});

export const getWishlistCount = cache(async (): Promise<number> => {
  const current = await getCurrentUser();
  if (!current) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("wishlists")
    .select("product_id", { count: "exact", head: true })
    .eq("profile_id", current.user.id);

  return count ?? 0;
});
