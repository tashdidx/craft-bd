"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  CHECKOUT_FIELD_NAMES,
  type CheckoutActionState,
} from "@/lib/checkout-state";
import { calculateCartTotals } from "@/lib/commerce";
import { getCart } from "@/lib/data/cart";
import { createClient } from "@/lib/supabase/server";
import type { BdDivision } from "@/lib/supabase/enums";
import { checkoutSchema } from "@/lib/validation/commerce";
import type { Json } from "@/lib/supabase/database.types";
import type { ShippingAddressSnapshot } from "@/types/domain";

function formValues(formData: FormData) {
  const values: Record<string, string> = {};

  for (const field of CHECKOUT_FIELD_NAMES) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }

  return values;
}

function fieldErrors(error: {
  flatten(): { fieldErrors: Record<string, string[] | undefined> };
}): CheckoutActionState["errors"] {
  const flattened = error.flatten().fieldErrors;
  const errors: NonNullable<CheckoutActionState["errors"]> = {};

  for (const field of CHECKOUT_FIELD_NAMES) {
    const messages = flattened[field];
    if (messages && messages.length > 0) {
      errors[field] = messages;
    }
  }

  return errors;
}

function newOrderNumber() {
  return `CBD-${new Date().getFullYear()}-${randomInt(1000, 10_000)}`;
}

/**
 * Places a cash-on-delivery order from the customer's saved cart. Prices,
 * totals, and stock are recalculated from the database; the form never sets an
 * amount. No payment gateway is involved (varsity project scope).
 */
export async function placeOrderAction(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent("/checkout")}`);
  }

  const values = formValues(formData);
  const parsed = checkoutSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted delivery details and try again.",
      errors: fieldErrors(parsed.error),
      values,
    };
  }

  const cart = await getCart();

  if (!cart.id || cart.items.length === 0) {
    return {
      status: "error",
      message: "Your cart is empty. Add a piece before checking out.",
      values,
    };
  }

  const unavailable = cart.items.find(
    (item) => item.stockQuantity <= 0 || item.quantity > item.stockQuantity,
  );

  if (unavailable) {
    return {
      status: "error",
      message: `${unavailable.title} no longer has enough stock. Adjust your cart to continue.`,
      values,
    };
  }

  const totals = calculateCartTotals(
    cart.items.map((item) => ({
      priceBdt: item.priceBdt,
      quantity: item.quantity,
      giftWrap: item.giftWrap,
    })),
  );

  const shippingAddress: ShippingAddressSnapshot = {
    recipient_name: parsed.data.recipientName,
    phone: parsed.data.phone,
    address_line1: parsed.data.addressLine1,
    address_line2: parsed.data.addressLine2 || null,
    city: parsed.data.city,
    district: parsed.data.district,
    division: parsed.data.division as BdDivision,
    postal_code: parsed.data.postalCode || null,
  };

  const supabase = await createClient();
  let order: { id: string; order_number: string } | null = null;
  let lastMessage = "We could not place the order. Try again in a moment.";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: newOrderNumber(),
        customer_id: current.user.id,
        status: "pending",
        payment_status: "unpaid",
        subtotal_bdt: totals.subtotalBdt,
        shipping_bdt: totals.shippingBdt,
        gift_wrap_bdt: totals.giftWrapBdt,
        shipping_address: shippingAddress as unknown as Json,
        gift_message: parsed.data.giftMessage || null,
        gift_wrap: totals.wrappedUnits > 0,
      })
      .select("id, order_number")
      .single();

    if (!error) {
      order = data;
      break;
    }

    if (error.code !== "23505") {
      lastMessage = error.message;
      break;
    }
  }

  if (!order) {
    return { status: "error", message: lastMessage, values };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    cart.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      artisan_id: item.artisanId,
      product_title: item.title,
      product_image_url: item.imageUrl,
      unit_price_bdt: item.priceBdt,
      quantity: item.quantity,
      gift_wrap: item.giftWrap,
    })),
  );

  if (itemsError) {
    return {
      status: "error",
      message:
        "The order record was created but its items could not be saved. Please contact us with your order number.",
      values,
    };
  }

  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/account");
  revalidatePath("/account/orders");

  redirect(`/account/orders/${order.order_number}?placed=1`);
}
