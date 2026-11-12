"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  CUSTOM_ORDER_FIELD_NAMES,
  type CustomOrderActionState,
  type QuoteResponseState,
} from "@/lib/custom-order-state";
import { createClient } from "@/lib/supabase/server";
import {
  customOrderRequestSchema,
  quoteResponseSchema,
} from "@/lib/validation/custom-orders";

function formValues(formData: FormData) {
  const values: Record<string, string> = {};

  for (const field of CUSTOM_ORDER_FIELD_NAMES) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }

  return values;
}

function fieldErrors(error: {
  flatten(): { fieldErrors: Record<string, string[] | undefined> };
}): CustomOrderActionState["errors"] {
  const flattened = error.flatten().fieldErrors;
  const errors: NonNullable<CustomOrderActionState["errors"]> = {};

  for (const field of CUSTOM_ORDER_FIELD_NAMES) {
    const messages = flattened[field];
    if (messages && messages.length > 0) {
      errors[field] = messages;
    }
  }

  return errors;
}

function newRequestCode() {
  return `CUS-${new Date().getFullYear()}-${randomInt(1000, 10_000)}`;
}

function customOrderErrorMessage(error: { code?: string; message: string }) {
  const { message } = error;

  if (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /could not find the table|does not exist|schema cache/i.test(message)
  ) {
    return "Custom orders are not set up on this database yet. Apply the latest migration with `npm run db:push` and try again.";
  }

  if (message.includes("CRAFT_BD_INVALID_STATUS_TRANSITION")) {
    return "This estimate can no longer be answered. Refresh the page to see the latest status.";
  }

  if (message.includes("CRAFT_BD_FIELDS_LOCKED")) {
    return "Only the studio can change the brief once a request is sent. Refresh the page and try again.";
  }

  if (message.includes("CRAFT_BD_NOT_ORDER_PARTICIPANT")) {
    return "This request does not belong to your account.";
  }

  if (error.code === "23503") {
    return "That studio is not available for commissions right now. Choose another studio and try again.";
  }

  return "We could not send the request. Try again in a moment.";
}

/**
 * Creates a bespoke request and its first timeline event. The request code is
 * generated here and retried on the rare unique collision; the database keeps
 * the `CUS-YYYY-NNNN` format constraint.
 */
export async function createCustomOrderAction(
  _previousState: CustomOrderActionState,
  formData: FormData,
): Promise<CustomOrderActionState> {
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent("/custom-orders/new")}`);
  }

  const values = formValues(formData);
  const parsed = customOrderRequestSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted details and try again.",
      errors: fieldErrors(parsed.error),
      values,
    };
  }

  const supabase = await createClient();
  const { data: artisan, error: artisanError } = await supabase
    .from("artisans")
    .select("id, primary_category_id")
    .eq("slug", parsed.data.artisanSlug)
    .eq("status", "approved")
    .maybeSingle();

  if (artisanError) {
    console.error("custom order artisan lookup failed", {
      code: artisanError.code,
      message: artisanError.message,
    });
    return {
      status: "error",
      message: customOrderErrorMessage(artisanError),
      values,
    };
  }

  if (!artisan) {
    return {
      status: "error",
      message: "That studio is not available for commissions right now.",
      errors: { artisanSlug: ["Choose a studio from the list."] },
      values,
    };
  }

  let inserted: { id: string; request_code: string } | null = null;
  let lastError: { code?: string; message: string } | null = null;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const { data, error } = await supabase
      .from("custom_orders")
      .insert({
        request_code: newRequestCode(),
        customer_id: current.user.id,
        artisan_id: artisan.id,
        category_id: artisan.primary_category_id,
        product_type: parsed.data.productType,
        design_description: parsed.data.designDescription,
        color: parsed.data.color || null,
        size: parsed.data.size || null,
        material: parsed.data.material || null,
        quantity: parsed.data.quantity,
        reference_image_url: parsed.data.referenceImageUrl || null,
        custom_notes: parsed.data.customNotes || null,
        budget_min_bdt: parsed.data.budgetMin ?? null,
        budget_max_bdt: parsed.data.budgetMax ?? null,
        status: "submitted",
      })
      .select("id, request_code")
      .single();

    if (!error) {
      inserted = data;
      break;
    }

    lastError = error;

    if (error.code !== "23505") break;
  }

  if (!inserted) {
    console.error("custom order insert failed", {
      code: lastError?.code,
      message: lastError?.message,
    });

    return {
      status: "error",
      message: lastError
        ? customOrderErrorMessage(lastError)
        : "We could not send the request. Try again in a moment.",
      values,
    };
  }

  const { error: eventError } = await supabase
    .from("custom_order_events")
    .insert({
      custom_order_id: inserted.id,
      status: "submitted",
      actor_id: current.user.id,
      note: `Customer submitted a ${parsed.data.productType.toLowerCase()} request.`,
    });

  if (eventError) {
    // The request itself is safely recorded; the detail page falls back to the
    // request timestamp when an event is missing.
    console.error("custom order initial event failed", {
      code: eventError.code,
      message: eventError.message,
    });
  }

  revalidatePath("/custom-orders");
  revalidatePath("/account");
  revalidatePath("/account/orders");

  redirect(`/custom-orders/${inserted.request_code}?created=1`);
}

/**
 * Records the customer's answer to a studio estimate. The update is guarded by
 * the current `quoted` status and customer ownership, then the matching event is
 * appended. A database trigger in the latest migration locks every brief field
 * the customer is not allowed to rewrite.
 */
export async function respondToQuoteAction(
  _previousState: QuoteResponseState,
  formData: FormData,
): Promise<QuoteResponseState> {
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent("/custom-orders")}`);
  }

  const parsed = quoteResponseSchema.safeParse({
    requestCode: formData.get("requestCode"),
    decision: formData.get("decision"),
    note: formData.get("note") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Choose whether to approve or decline the estimate.",
    };
  }

  const supabase = await createClient();
  const { data: order, error: readError } = await supabase
    .from("custom_orders")
    .select("id, status, customer_id")
    .eq("request_code", parsed.data.requestCode)
    .eq("customer_id", current.user.id)
    .maybeSingle();

  if (readError) {
    console.error("custom order quote lookup failed", {
      code: readError.code,
      message: readError.message,
    });
    return {
      status: "error",
      message: customOrderErrorMessage(readError),
    };
  }

  if (!order) {
    return {
      status: "error",
      message: "This request does not belong to your account.",
    };
  }

  if (order.status !== "quoted") {
    return {
      status: "error",
      message:
        "This estimate can no longer be answered. Refresh the page to see the latest status.",
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from("custom_orders")
    .update({
      status: parsed.data.decision,
      customer_response_note: parsed.data.note || null,
      responded_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("customer_id", current.user.id)
    .eq("status", "quoted")
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("custom order quote update failed", {
      code: updateError.code,
      message: updateError.message,
    });
    return {
      status: "error",
      message: customOrderErrorMessage(updateError),
    };
  }

  if (!updated) {
    return {
      status: "error",
      message:
        "This estimate was already answered. Refresh the page to see the latest status.",
    };
  }

  const { error: eventError } = await supabase
    .from("custom_order_events")
    .insert({
      custom_order_id: order.id,
      status: parsed.data.decision,
      actor_id: current.user.id,
      note:
        parsed.data.note ||
        (parsed.data.decision === "approved"
          ? "Customer approved the estimate."
          : "Customer declined the estimate."),
    });

  if (eventError) {
    console.error("custom order response event failed", {
      code: eventError.code,
      message: eventError.message,
    });
  }

  revalidatePath("/custom-orders");
  revalidatePath(`/custom-orders/${parsed.data.requestCode}`);
  revalidatePath("/account");

  redirect(
    `/custom-orders/${parsed.data.requestCode}?responded=${parsed.data.decision}`,
  );
}
