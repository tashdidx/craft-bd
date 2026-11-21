"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  CUSTOM_ORDER_NEXT_STATUSES,
  ORDER_NEXT_STATUSES,
  PAYMENT_NEXT_STATUSES,
} from "@/lib/admin";
import type { AdminActionState } from "@/lib/admin-state";
import { CUSTOM_ORDER_STATUS_LABELS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import {
  adminArtisanUpdateSchema,
  adminCustomOrderStatusSchema,
  adminOrderStatusSchema,
  adminPaymentStatusSchema,
  adminProductUpdateSchema,
  adminQuoteSchema,
  adminReviewDecisionSchema,
} from "@/lib/validation/admin";
import { formatBdt } from "@/lib/format";
import type { CustomOrderStatus, ReviewStatus } from "@/lib/supabase/enums";

type DbError = { code?: string; message: string };

function fail(message: string): AdminActionState {
  return { status: "error", message };
}

function firstIssue(error: { issues: Array<{ message: string }> }) {
  return error.issues[0]?.message ?? "Check the submitted values and try again.";
}

function adminErrorMessage(error: DbError) {
  if (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    error.code === "PGRST202" ||
    /could not find the table|does not exist|schema cache/i.test(error.message)
  ) {
    return "The back office is not fully set up on this database yet. Apply the latest migrations with `npm run db:push` and try again.";
  }

  if (error.code === "42501") {
    return "Your session does not have administrator rights. Sign in again with the admin account.";
  }

  if (error.message.includes("CRAFT_BD_ORDER_CANCELLED_TERMINAL")) {
    return "A cancelled order cannot be reopened. Create a new order instead.";
  }

  if (error.message.includes("CRAFT_BD_ORDER_NOT_CANCELLABLE")) {
    return "This order can no longer be cancelled because it has already left the studio.";
  }

  return "The change could not be saved. Refresh the page and try again.";
}

function safeReturnPath(
  value: FormDataEntryValue | null,
  fallback: string,
): string {
  if (typeof value !== "string") return fallback;

  const path = value.trim();

  if (
    path.length > 240 ||
    !/^\/admin(?:\/[a-z0-9-]+)*(?:\?[a-z0-9=&_%.-]*)?$/i.test(path)
  ) {
    return fallback;
  }

  return path;
}

function noticePath(path: string, notice: string) {
  const [base, search = ""] = path.split("?");
  const params = new URLSearchParams(search);
  params.set("notice", notice);
  return `${base}?${params.toString()}`;
}

async function recordAdminAction(
  supabase: Awaited<ReturnType<typeof createClient>>,
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: Json,
) {
  const { error } = await supabase.from("admin_actions").insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });

  if (error) {
    // The audited change already succeeded. Keep the console trail rather than
    // showing a misleading failure to the administrator.
    console.error("admin audit insert failed", {
      code: error.code,
      message: error.message,
      action,
      entityType,
      entityId,
    });
  }
}

function revalidateOrder(orderNumber: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/products");
  revalidatePath("/admin/activity");
  revalidatePath("/account");
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${orderNumber}`);
  revalidatePath("/products");
  revalidatePath("/");
}

function revalidateCustomOrder(requestCode: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/custom-orders");
  revalidatePath(`/admin/custom-orders/${requestCode}`);
  revalidatePath("/admin/activity");
  revalidatePath("/custom-orders");
  revalidatePath(`/custom-orders/${requestCode}`);
  revalidatePath("/account");
}

function revalidateReview(productSlug: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin/activity");
  revalidatePath("/products");
  revalidatePath("/");
  if (productSlug) revalidatePath(`/products/${productSlug}`);
}

function revalidateProduct(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/activity");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/");
  revalidatePath("/gifts");
}

function revalidateArtisan(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/artisans");
  revalidatePath("/admin/activity");
  revalidatePath("/artisans");
  revalidatePath(`/artisans/${slug}`);
  revalidatePath("/");
}

export async function updateOrderStatusAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const current = await requireAdmin("/admin/orders");
  const parsed = adminOrderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    orderNumber: formData.get("orderNumber"),
    status: formData.get("status"),
    returnTo: formData.get("returnTo") ?? "",
  });

  if (!parsed.success) return fail(firstIssue(parsed.error));

  const supabase = await createClient();
  const { data: order, error: readError } = await supabase
    .from("orders")
    .select("id, order_number, status")
    .eq("id", parsed.data.orderId)
    .maybeSingle();

  if (readError) return fail(adminErrorMessage(readError));
  if (!order) return fail("This order no longer exists.");

  const allowed = ORDER_NEXT_STATUSES[order.status];

  if (!allowed.includes(parsed.data.status)) {
    return fail(
      `An order that is ${order.status} cannot move to ${parsed.data.status}.`,
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", order.id)
    .eq("status", order.status)
    .select("id")
    .maybeSingle();

  if (updateError) return fail(adminErrorMessage(updateError));
  if (!updated) {
    return fail("Another administrator changed this order. Refresh and try again.");
  }

  await recordAdminAction(
    supabase,
    current.user.id,
    "order.status",
    "order",
    order.id,
    {
      order_number: order.order_number,
      from: order.status,
      to: parsed.data.status,
      restocked: parsed.data.status === "cancelled",
    },
  );

  revalidateOrder(order.order_number);

  redirect(
    noticePath(
      safeReturnPath(formData.get("returnTo"), `/admin/orders/${order.order_number}`),
      "order-status",
    ),
  );
}

export async function updateOrderPaymentAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const current = await requireAdmin("/admin/orders");
  const parsed = adminPaymentStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    orderNumber: formData.get("orderNumber"),
    paymentStatus: formData.get("paymentStatus"),
    returnTo: formData.get("returnTo") ?? "",
  });

  if (!parsed.success) return fail(firstIssue(parsed.error));

  const supabase = await createClient();
  const { data: order, error: readError } = await supabase
    .from("orders")
    .select("id, order_number, payment_status")
    .eq("id", parsed.data.orderId)
    .maybeSingle();

  if (readError) return fail(adminErrorMessage(readError));
  if (!order) return fail("This order no longer exists.");

  const allowed = PAYMENT_NEXT_STATUSES[order.payment_status];

  if (!allowed.includes(parsed.data.paymentStatus)) {
    return fail(
      `A payment that is ${order.payment_status} cannot move to ${parsed.data.paymentStatus}.`,
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({ payment_status: parsed.data.paymentStatus })
    .eq("id", order.id)
    .eq("payment_status", order.payment_status)
    .select("id")
    .maybeSingle();

  if (updateError) return fail(adminErrorMessage(updateError));
  if (!updated) {
    return fail("Another administrator changed this payment. Refresh and try again.");
  }

  await recordAdminAction(
    supabase,
    current.user.id,
    "order.payment",
    "order",
    order.id,
    {
      order_number: order.order_number,
      from: order.payment_status,
      to: parsed.data.paymentStatus,
    },
  );

  revalidateOrder(order.order_number);

  redirect(
    noticePath(
      safeReturnPath(formData.get("returnTo"), `/admin/orders/${order.order_number}`),
      "order-payment",
    ),
  );
}

export async function sendCustomOrderQuoteAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const current = await requireAdmin("/admin/custom-orders");
  const parsed = adminQuoteSchema.safeParse({
    requestId: formData.get("requestId"),
    requestCode: formData.get("requestCode"),
    priceEstimateBdt: formData.get("priceEstimateBdt"),
    estimatedDays: formData.get("estimatedDays"),
    note: formData.get("note") ?? "",
    returnTo: formData.get("returnTo") ?? "",
  });

  if (!parsed.success) return fail(firstIssue(parsed.error));

  const supabase = await createClient();
  const { data: order, error: readError } = await supabase
    .from("custom_orders")
    .select("id, request_code, status")
    .eq("id", parsed.data.requestId)
    .maybeSingle();

  if (readError) return fail(adminErrorMessage(readError));
  if (!order) return fail("This custom order no longer exists.");

  if (order.status !== "submitted" && order.status !== "quoted") {
    return fail(
      "An estimate can only be sent before the customer responds to the request.",
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("custom_orders")
    .update({
      status: "quoted",
      price_estimate_bdt: parsed.data.priceEstimateBdt,
      estimated_days: parsed.data.estimatedDays,
      artisan_note: parsed.data.note || null,
    })
    .eq("id", order.id)
    .eq("status", order.status)
    .select("id")
    .maybeSingle();

  if (updateError) return fail(adminErrorMessage(updateError));
  if (!updated) {
    return fail("Another administrator changed this request. Refresh and try again.");
  }

  const eventNote = `Estimate: ${formatBdt(parsed.data.priceEstimateBdt)} · ${
    parsed.data.estimatedDays
  } days.${parsed.data.note ? ` ${parsed.data.note}` : ""}`;

  const { error: eventError } = await supabase
    .from("custom_order_events")
    .insert({
      custom_order_id: order.id,
      status: "quoted",
      actor_id: current.user.id,
      note: eventNote,
    });

  if (eventError) {
    console.error("custom order quote event failed", {
      code: eventError.code,
      message: eventError.message,
    });
  }

  await recordAdminAction(
    supabase,
    current.user.id,
    "custom_order.quoted",
    "custom_order",
    order.id,
    {
      request_code: order.request_code,
      price_estimate_bdt: parsed.data.priceEstimateBdt,
      estimated_days: parsed.data.estimatedDays,
      revised: order.status === "quoted",
    },
  );

  revalidateCustomOrder(order.request_code);

  redirect(
    noticePath(
      safeReturnPath(
        formData.get("returnTo"),
        `/admin/custom-orders/${order.request_code}`,
      ),
      "custom-quote",
    ),
  );
}

export async function updateCustomOrderStatusAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const current = await requireAdmin("/admin/custom-orders");
  const parsed = adminCustomOrderStatusSchema.safeParse({
    requestId: formData.get("requestId"),
    requestCode: formData.get("requestCode"),
    status: formData.get("status"),
    note: formData.get("note") ?? "",
    returnTo: formData.get("returnTo") ?? "",
  });

  if (!parsed.success) return fail(firstIssue(parsed.error));

  const supabase = await createClient();
  const { data: order, error: readError } = await supabase
    .from("custom_orders")
    .select("id, request_code, status")
    .eq("id", parsed.data.requestId)
    .maybeSingle();

  if (readError) return fail(adminErrorMessage(readError));
  if (!order) return fail("This custom order no longer exists.");

  const allowed = CUSTOM_ORDER_NEXT_STATUSES[order.status];

  if (!allowed.includes(parsed.data.status)) {
    return fail(
      `A request that is ${order.status} cannot move to ${parsed.data.status}.`,
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("custom_orders")
    .update({ status: parsed.data.status })
    .eq("id", order.id)
    .eq("status", order.status)
    .select("id")
    .maybeSingle();

  if (updateError) return fail(adminErrorMessage(updateError));
  if (!updated) {
    return fail("Another administrator changed this request. Refresh and try again.");
  }

  const statusLabel =
    CUSTOM_ORDER_STATUS_LABELS[parsed.data.status as CustomOrderStatus];

  const { error: eventError } = await supabase
    .from("custom_order_events")
    .insert({
      custom_order_id: order.id,
      status: parsed.data.status,
      actor_id: current.user.id,
      note: parsed.data.note || `Status moved to ${statusLabel}.`,
    });

  if (eventError) {
    console.error("custom order status event failed", {
      code: eventError.code,
      message: eventError.message,
    });
  }

  await recordAdminAction(
    supabase,
    current.user.id,
    "custom_order.status",
    "custom_order",
    order.id,
    {
      request_code: order.request_code,
      from: order.status,
      to: parsed.data.status,
      note: parsed.data.note || null,
    },
  );

  revalidateCustomOrder(order.request_code);

  redirect(
    noticePath(
      safeReturnPath(
        formData.get("returnTo"),
        `/admin/custom-orders/${order.request_code}`,
      ),
      "custom-status",
    ),
  );
}

interface RawReviewRow {
  id: string;
  status: ReviewStatus;
  product_id: string;
  products: { slug: string } | Array<{ slug: string }> | null;
}

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function moderateReviewAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const current = await requireAdmin("/admin/reviews");
  const parsed = adminReviewDecisionSchema.safeParse({
    reviewId: formData.get("reviewId"),
    decision: formData.get("decision"),
    note: formData.get("note") ?? "",
    returnTo: formData.get("returnTo") ?? "",
  });

  if (!parsed.success) return fail(firstIssue(parsed.error));

  const supabase = await createClient();
  const { data, error: readError } = await supabase
    .from("reviews")
    .select("id, status, product_id, products ( slug )")
    .eq("id", parsed.data.reviewId)
    .maybeSingle();

  if (readError) return fail(adminErrorMessage(readError));
  if (!data) return fail("This review no longer exists.");

  const review = data as unknown as RawReviewRow;
  const productSlug = firstOrNull(review.products)?.slug ?? null;
  const note = parsed.data.note || null;

  const updates =
    parsed.data.decision === "publish"
      ? { status: "published" as const, flagged_reason: null, admin_note: note }
      : parsed.data.decision === "flag"
        ? {
            status: "flagged" as const,
            flagged_reason: parsed.data.note,
            admin_note: note,
          }
        : parsed.data.decision === "remove"
          ? { status: "removed" as const, flagged_reason: null, admin_note: note }
          : { status: "pending" as const, flagged_reason: null, admin_note: note };

  const { data: updated, error: updateError } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", review.id)
    .eq("status", review.status)
    .select("id")
    .maybeSingle();

  if (updateError) return fail(adminErrorMessage(updateError));
  if (!updated) {
    return fail("Another administrator changed this review. Refresh and try again.");
  }

  await recordAdminAction(
    supabase,
    current.user.id,
    `review.${parsed.data.decision}`,
    "review",
    review.id,
    {
      product_id: review.product_id,
      from: review.status,
      to: updates.status,
      note,
    },
  );

  revalidateReview(productSlug);

  redirect(
    noticePath(safeReturnPath(formData.get("returnTo"), "/admin/reviews"), "review"),
  );
}

export async function updateProductAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const current = await requireAdmin("/admin/products");
  const parsed = adminProductUpdateSchema.safeParse({
    productId: formData.get("productId"),
    priceBdt: formData.get("priceBdt"),
    stockQuantity: formData.get("stockQuantity"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured"),
    returnTo: formData.get("returnTo") ?? "",
  });

  if (!parsed.success) return fail(firstIssue(parsed.error));

  const supabase = await createClient();
  const { data: product, error: readError } = await supabase
    .from("products")
    .select(
      "id, title, slug, status, price_bdt, stock_quantity, is_featured, published_at",
    )
    .eq("id", parsed.data.productId)
    .maybeSingle();

  if (readError) return fail(adminErrorMessage(readError));
  if (!product) return fail("This product no longer exists.");

  const publishedAt =
    parsed.data.status === "published" && !product.published_at
      ? new Date().toISOString()
      : product.published_at;

  const { data: updated, error: updateError } = await supabase
    .from("products")
    .update({
      price_bdt: parsed.data.priceBdt,
      stock_quantity: parsed.data.stockQuantity,
      status: parsed.data.status,
      is_featured: parsed.data.isFeatured,
      published_at: publishedAt,
    })
    .eq("id", product.id)
    .select("id")
    .maybeSingle();

  if (updateError) return fail(adminErrorMessage(updateError));
  if (!updated) return fail("This product could not be saved. Refresh and try again.");

  await recordAdminAction(
    supabase,
    current.user.id,
    "product.updated",
    "product",
    product.id,
    {
      slug: product.slug,
      title: product.title,
      from_status: product.status,
      to_status: parsed.data.status,
      price_bdt: parsed.data.priceBdt,
      stock_quantity: parsed.data.stockQuantity,
      is_featured: parsed.data.isFeatured,
    },
  );

  revalidateProduct(product.slug);

  redirect(
    noticePath(safeReturnPath(formData.get("returnTo"), "/admin/products"), "product"),
  );
}

export async function updateArtisanAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const current = await requireAdmin("/admin/artisans");
  const parsed = adminArtisanUpdateSchema.safeParse({
    artisanId: formData.get("artisanId"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured"),
    returnTo: formData.get("returnTo") ?? "",
  });

  if (!parsed.success) return fail(firstIssue(parsed.error));

  const supabase = await createClient();
  const { data: artisan, error: readError } = await supabase
    .from("artisans")
    .select("id, display_name, slug, status, is_featured")
    .eq("id", parsed.data.artisanId)
    .maybeSingle();

  if (readError) return fail(adminErrorMessage(readError));
  if (!artisan) return fail("This artisan studio no longer exists.");

  const { data: updated, error: updateError } = await supabase
    .from("artisans")
    .update({
      status: parsed.data.status,
      is_featured: parsed.data.isFeatured,
    })
    .eq("id", artisan.id)
    .select("id")
    .maybeSingle();

  if (updateError) return fail(adminErrorMessage(updateError));
  if (!updated) {
    return fail("This artisan studio could not be saved. Refresh and try again.");
  }

  await recordAdminAction(
    supabase,
    current.user.id,
    "artisan.updated",
    "artisan",
    artisan.id,
    {
      slug: artisan.slug,
      display_name: artisan.display_name,
      from_status: artisan.status,
      to_status: parsed.data.status,
      is_featured: parsed.data.isFeatured,
    },
  );

  revalidateArtisan(artisan.slug);

  redirect(
    noticePath(safeReturnPath(formData.get("returnTo"), "/admin/artisans"), "artisan"),
  );
}
