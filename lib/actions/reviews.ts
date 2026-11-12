"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  REVIEW_FIELD_NAMES,
  type ReviewActionState,
} from "@/lib/review-state";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/supabase/enums";
import { reviewSchema } from "@/lib/validation/reviews";

interface RawOrderItemOrder {
  order_number: string;
  customer_id: string;
  status: OrderStatus;
}

interface RawOrderItemProduct {
  slug: string;
}

interface RawOrderItem {
  id: string;
  product_id: string | null;
  orders: RawOrderItemOrder | RawOrderItemOrder[] | null;
  products: RawOrderItemProduct | RawOrderItemProduct[] | null;
}

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function formValues(formData: FormData) {
  const values: Record<string, string> = {};

  for (const field of REVIEW_FIELD_NAMES) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }

  return values;
}

function fieldErrors(error: {
  flatten(): { fieldErrors: Record<string, string[] | undefined> };
}): ReviewActionState["errors"] {
  const flattened = error.flatten().fieldErrors;
  const errors: NonNullable<ReviewActionState["errors"]> = {};

  for (const field of REVIEW_FIELD_NAMES) {
    const messages = flattened[field];
    if (messages && messages.length > 0) {
      errors[field] = messages;
    }
  }

  return errors;
}

function reviewErrorMessage(error: { code?: string; message: string }) {
  const { message } = error;

  if (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /could not find the table|does not exist|schema cache/i.test(message)
  ) {
    return "Reviews are not set up on this database yet. Apply the latest migration with `npm run db:push` and try again.";
  }

  if (error.code === "23505") {
    return "You have already reviewed this piece. Only one review is allowed per piece, so edit your existing review instead.";
  }

  if (
    error.code === "42501" ||
    /row-level security|violates row-level security/i.test(message)
  ) {
    return "Reviews can only be written for a delivered order from your own account.";
  }

  return "We could not save the review. Try again in a moment.";
}

/**
 * Writes a review for a delivered order item. The database policy re-checks
 * that the item belongs to this customer and that the order is delivered; the
 * review starts as `pending` until an administrator publishes it.
 */
export async function submitReviewAction(
  _previousState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent("/account/orders")}`);
  }

  const values = formValues(formData);
  const parsed = reviewSchema.safeParse({
    orderItemId: formData.get("orderItemId"),
    ...values,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted review details and try again.",
      errors: fieldErrors(parsed.error),
      values,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_items")
    .select(
      "id, product_id, orders ( order_number, customer_id, status ), products ( slug )",
    )
    .eq("id", parsed.data.orderItemId)
    .maybeSingle();

  if (error) {
    console.error("review order item lookup failed", {
      code: error.code,
      message: error.message,
    });
    return {
      status: "error",
      message: reviewErrorMessage(error),
      values,
    };
  }

  if (!data) {
    return {
      status: "error",
      message: "That order item could not be found in your account.",
      values,
    };
  }

  const row = data as unknown as RawOrderItem;
  const order = firstOrNull(row.orders);
  const product = firstOrNull(row.products);

  if (!order || order.customer_id !== current.user.id) {
    return {
      status: "error",
      message: "That order item does not belong to your account.",
      values,
    };
  }

  if (order.status !== "delivered") {
    return {
      status: "error",
      message: "Reviews open once the order is marked delivered.",
      values,
    };
  }

  if (!row.product_id) {
    return {
      status: "error",
      message: "This piece is no longer in the catalogue, so it cannot be reviewed.",
      values,
    };
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    product_id: row.product_id,
    customer_id: current.user.id,
    order_item_id: row.id,
    rating: parsed.data.rating,
    title: parsed.data.title || null,
    comment: parsed.data.comment,
    status: "pending",
    is_verified_purchase: true,
  });

  if (insertError) {
    console.error("review insert failed", {
      code: insertError.code,
      message: insertError.message,
    });
    return {
      status: "error",
      message: reviewErrorMessage(insertError),
      values,
    };
  }

  revalidatePath(`/account/orders/${order.order_number}`);
  revalidatePath("/account/orders");
  revalidatePath("/account");
  revalidatePath("/products");
  revalidatePath("/");
  if (product?.slug) revalidatePath(`/products/${product.slug}`);

  return {
    status: "success",
    message:
      "Review submitted. It will appear on the product page once the Craft BD team publishes it.",
    values,
  };
}
