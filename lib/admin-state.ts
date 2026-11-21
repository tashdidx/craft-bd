/** Client-safe state shared by admin forms and their Server Actions. */
export interface AdminActionState {
  status: "idle" | "error" | "success";
  message?: string;
}

export const INITIAL_ADMIN_ACTION_STATE: AdminActionState = { status: "idle" };

export const ADMIN_NOTICE_MESSAGES: Record<string, string> = {
  "order-status":
    "Order status saved. Cancelling an order returns its pieces to stock exactly once.",
  "order-payment": "Payment status saved.",
  "custom-quote": "Estimate saved and sent to the customer.",
  "custom-status": "Custom order status saved and added to the timeline.",
  review: "Review moderation saved.",
  product: "Catalogue piece saved.",
  artisan: "Artisan studio saved.",
};

export function adminNoticeMessage(
  value: string | string[] | undefined,
): string | null {
  const code = Array.isArray(value) ? value[0] : value;

  if (!code) return null;

  return ADMIN_NOTICE_MESSAGES[code] ?? null;
}
