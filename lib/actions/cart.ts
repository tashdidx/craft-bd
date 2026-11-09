"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CART_MAX_QUANTITY } from "@/lib/commerce";
import { safeNextPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import {
  addToCartSchema,
  removeCartItemSchema,
  updateCartItemSchema,
} from "@/lib/validation/commerce";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

type RawCartItemProduct = Pick<
  Tables<"products">,
  "stock_quantity" | "gift_wrap_available" | "status"
>;

interface RawCartItemRow {
  id: string;
  cart_id: string;
  quantity: number;
  gift_wrap: boolean;
  products: RawCartItemProduct | RawCartItemProduct[] | null;
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : null;
}

function fail(code: string): never {
  redirect(`/cart?error=${code}`);
}

function revalidateCommerce() {
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/");
}

async function getOrCreateCartId(
  supabase: ServerSupabase,
  profileId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("carts")
    .select("id")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) throw new Error(`Could not open your cart: ${error.message}`);
  if (data) return data.id;

  const { data: created, error: insertError } = await supabase
    .from("carts")
    .insert({ profile_id: profileId })
    .select("id")
    .single();

  if (!insertError && created) return created.id;

  // A concurrent first add may have created the row between the read and insert.
  if (insertError?.code === "23505") {
    const { data: existing } = await supabase
      .from("carts")
      .select("id")
      .eq("profile_id", profileId)
      .maybeSingle();

    if (existing) return existing.id;
  }

  throw new Error(
    `Could not open your cart: ${insertError?.message ?? "unknown error"}`,
  );
}

export async function addToCartAction(formData: FormData) {
  const nextPath = safeNextPath(formData.get("next"), "/cart");
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const parsed = addToCartSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    giftWrap: formData.get("giftWrap") ?? undefined,
  });

  if (!parsed.success) fail("invalid-quantity");

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("id, stock_quantity, gift_wrap_available")
    .eq("id", parsed.data.productId)
    .eq("status", "published")
    .maybeSingle();

  if (error || !product) fail("unavailable");
  if (product.stock_quantity <= 0) fail("sold-out");
  if (parsed.data.giftWrap && !product.gift_wrap_available) {
    fail("gift-wrap-unavailable");
  }

  const cartId = await getOrCreateCartId(supabase, current.user.id);
  const { data: existing } = await supabase
    .from("cart_items")
    .select("quantity, gift_wrap")
    .eq("cart_id", cartId)
    .eq("product_id", product.id)
    .maybeSingle();

  const quantity = Math.min(
    (existing?.quantity ?? 0) + parsed.data.quantity,
    product.stock_quantity,
    CART_MAX_QUANTITY,
  );
  const giftWrap = Boolean(existing?.gift_wrap || parsed.data.giftWrap);

  const { error: upsertError } = await supabase.from("cart_items").upsert(
    {
      cart_id: cartId,
      product_id: product.id,
      quantity,
      gift_wrap: giftWrap,
    },
    { onConflict: "cart_id,product_id" },
  );

  if (upsertError) fail("cart-error");

  revalidateCommerce();
  redirect("/cart?added=1");
}

export async function updateCartItemAction(formData: FormData) {
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent("/cart")}`);
  }

  const hasGiftWrap = formData.has("giftWrap");
  const parsed = updateCartItemSchema.safeParse({
    itemId: formString(formData, "itemId"),
    quantity: formString(formData, "quantity"),
    ...(hasGiftWrap ? { giftWrap: formData.get("giftWrap") } : {}),
  });

  if (!parsed.success) fail("invalid-update");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
        id,
        cart_id,
        quantity,
        gift_wrap,
        products ( stock_quantity, gift_wrap_available, status )
      `,
    )
    .eq("id", parsed.data.itemId)
    .maybeSingle();

  if (error || !data) fail("missing-item");

  const row = data as unknown as RawCartItemRow;
  const product = Array.isArray(row.products)
    ? (row.products[0] ?? null)
    : row.products;

  if (!product || product.status !== "published") {
    await supabase.from("cart_items").delete().eq("id", row.id);
    revalidateCommerce();
    redirect("/cart?error=unavailable");
  }

  if (parsed.data.quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", row.id);
    revalidateCommerce();
    redirect("/cart");
  }

  const quantity = Math.min(
    parsed.data.quantity,
    product.stock_quantity,
    CART_MAX_QUANTITY,
  );
  const patch: { quantity: number; gift_wrap?: boolean } = { quantity };

  if (parsed.data.giftWrap !== undefined) {
    patch.gift_wrap = parsed.data.giftWrap && product.gift_wrap_available;
  }

  const { error: updateError } = await supabase
    .from("cart_items")
    .update(patch)
    .eq("id", row.id);

  if (updateError) fail("cart-error");

  revalidateCommerce();
  redirect("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent("/cart")}`);
  }

  const parsed = removeCartItemSchema.safeParse({
    itemId: formString(formData, "itemId"),
  });

  if (!parsed.success) fail("missing-item");

  const supabase = await createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", parsed.data.itemId);

  if (error) fail("cart-error");

  revalidateCommerce();
  redirect("/cart");
}
