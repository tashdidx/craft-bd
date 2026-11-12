import "server-only";

import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/types/domain";

/**
 * Every review this customer has already written for the given products.
 * The database allows one review per customer and product, so this drives the
 * "you already reviewed this piece" state on delivered order items.
 */
export async function getCustomerReviewsForProducts(
  productIds: string[],
): Promise<Review[]> {
  if (productIds.length === 0) return [];

  const current = await getCurrentUser();
  if (!current) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("customer_id", current.user.id)
    .in("product_id", productIds);

  if (error) {
    throw new Error(`Could not load your reviews: ${error.message}`);
  }

  return data ?? [];
}
