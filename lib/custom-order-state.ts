export const CUSTOM_ORDER_FIELD_NAMES = [
  "artisanSlug",
  "productType",
  "designDescription",
  "color",
  "size",
  "material",
  "quantity",
  "budgetMin",
  "budgetMax",
  "customNotes",
  "referenceImageUrl",
] as const;

export type CustomOrderFieldName = (typeof CUSTOM_ORDER_FIELD_NAMES)[number];

export interface CustomOrderActionState {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<CustomOrderFieldName, string[]>>;
  values?: Partial<Record<CustomOrderFieldName, string>>;
}

export const INITIAL_CUSTOM_ORDER_STATE: CustomOrderActionState = {
  status: "idle",
};

export interface QuoteResponseState {
  status: "idle" | "error";
  message?: string;
}

export const INITIAL_QUOTE_RESPONSE_STATE: QuoteResponseState = {
  status: "idle",
};
