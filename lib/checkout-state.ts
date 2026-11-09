export const CHECKOUT_FIELD_NAMES = [
  "recipientName",
  "phone",
  "addressLine1",
  "addressLine2",
  "city",
  "district",
  "division",
  "postalCode",
  "giftMessage",
] as const;

export type CheckoutFieldName = (typeof CHECKOUT_FIELD_NAMES)[number];

export interface CheckoutActionState {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<CheckoutFieldName, string[]>>;
  values?: Partial<Record<CheckoutFieldName, string>>;
}

export const INITIAL_CHECKOUT_STATE: CheckoutActionState = { status: "idle" };
