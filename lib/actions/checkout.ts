"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  CHECKOUT_FIELD_NAMES,
  type CheckoutActionState,
} from "@/lib/checkout-state";
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

function errorDetail(message: string, marker: string) {
  const index = message.indexOf(marker);
  if (index === -1) return null;

  const detail = message.slice(index + marker.length).trim();
  return detail || null;
}

/**
 * Maps the guarded messages raised by `public.place_order` to customer-facing
 * copy. Unexpected database details never reach the form.
 */
function placeOrderErrorMessage(error: { code?: string; message: string }) {
  const { message } = error;

  if (
    error.code === "PGRST202" ||
    error.code === "42883" ||
    (message.includes("place_order") &&
      /could not find|schema cache|does not exist/i.test(message))
  ) {
    return "Checkout is not fully set up on this database yet. Apply the latest migration with `npm run db:push` and try again.";
  }

  if (message.includes("CRAFT_BD_NOT_AUTHENTICATED")) {
    return "Your session expired. Sign in again to place the order.";
  }

  if (message.includes("CRAFT_BD_INVALID_ADDRESS")) {
    return "Check the highlighted delivery details and try again.";
  }

  if (message.includes("CRAFT_BD_INVALID_GIFT_MESSAGE")) {
    return "Shorten the gift message to 280 characters and try again.";
  }

  if (message.includes("CRAFT_BD_EMPTY_CART")) {
    return "Your cart is empty. Add a piece before checking out.";
  }

  if (message.includes("CRAFT_BD_PRODUCT_UNAVAILABLE")) {
    return "One of the pieces in your cart is no longer available. Remove it and try again.";
  }

  if (message.includes("CRAFT_BD_INVALID_ITEMS")) {
    return "One of the cart lines is no longer valid. Adjust your cart and try again.";
  }

  if (message.includes("CRAFT_BD_INSUFFICIENT_STOCK:")) {
    const title = errorDetail(message, "CRAFT_BD_INSUFFICIENT_STOCK:");
    return title
      ? `${title} no longer has enough stock. Adjust your cart and try again.`
      : "One of your pieces no longer has enough stock. Adjust your cart and try again.";
  }

  if (message.includes("CRAFT_BD_GIFT_WRAP_UNAVAILABLE:")) {
    const title = errorDetail(message, "CRAFT_BD_GIFT_WRAP_UNAVAILABLE:");
    return title
      ? `${title} cannot be gift wrapped right now. Turn off gift wrap for it and try again.`
      : "One of your pieces cannot be gift wrapped right now. Turn off gift wrap and try again.";
  }

  return "We could not place the order. Try again in a moment.";
}

/**
 * Places a cash-on-delivery order from the customer's saved cart. The
 * `place_order` database function recalculates prices, totals, and stock,
 * writes the order and item snapshots, decrements stock, and clears the cart in
 * one transaction. The form never sets an amount, and no payment gateway is
 * involved (varsity project scope).
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
  let placed: { order_id: string; order_number: string } | null = null;
  let lastMessage = "We could not place the order. Try again in a moment.";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabase.rpc("place_order", {
      p_order_number: newOrderNumber(),
      p_shipping_address: shippingAddress as unknown as Json,
      p_gift_message: parsed.data.giftMessage || null,
    });

    if (!error) {
      placed = data?.[0] ?? null;
      break;
    }

    if (error.code === "23505") {
      // A rare order-number collision: try another number.
      continue;
    }

    console.error("place_order RPC failed", {
      code: error.code,
      message: error.message,
    });
    lastMessage = placeOrderErrorMessage(error);
    break;
  }

  if (!placed) {
    return { status: "error", message: lastMessage, values };
  }

  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/account");
  revalidatePath("/account/orders");

  redirect(`/account/orders/${placed.order_number}?placed=1`);
}
