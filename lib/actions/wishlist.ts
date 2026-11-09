"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { safeNextPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function toggleWishlistAction(formData: FormData) {
  const nextPath = safeNextPath(formData.get("next"), "/products");
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const productId = formData.get("productId");

  if (typeof productId !== "string" || !UUID_PATTERN.test(productId.trim())) {
    redirect(nextPath);
  }

  const normalizedId = productId.trim();
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("profile_id", current.user.id)
    .eq("product_id", normalizedId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("wishlists")
      .delete()
      .eq("profile_id", current.user.id)
      .eq("product_id", normalizedId);
  } else {
    await supabase.from("wishlists").insert({
      profile_id: current.user.id,
      product_id: normalizedId,
    });
  }

  revalidatePath(nextPath);
  revalidatePath("/account");
  revalidatePath("/account/wishlist");
  redirect(nextPath);
}
