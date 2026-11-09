import "server-only";

import { z } from "zod";
import { CART_MAX_QUANTITY } from "@/lib/commerce";
import { DIVISIONS } from "@/lib/constants";
import type { BdDivision } from "@/lib/supabase/enums";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const uuidField = z
  .string()
  .trim()
  .regex(UUID_PATTERN, "Choose a valid product.");

const checkboxField = z.preprocess(
  (value) =>
    value === true || value === "true" || value === "on" || value === "1",
  z.boolean(),
);

const divisionValues = DIVISIONS.map((division) => division.value);

export const addToCartSchema = z.object({
  productId: uuidField,
  quantity: z.coerce
    .number()
    .int("Choose a whole number.")
    .min(1, "Choose at least one piece.")
    .max(CART_MAX_QUANTITY, `Choose ${CART_MAX_QUANTITY} pieces or fewer.`),
  giftWrap: checkboxField.optional(),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().trim().regex(UUID_PATTERN, "Unknown cart item."),
  quantity: z.coerce
    .number()
    .int("Choose a whole number.")
    .min(0, "Quantity cannot be negative.")
    .max(CART_MAX_QUANTITY, `Choose ${CART_MAX_QUANTITY} pieces or fewer.`),
  giftWrap: checkboxField.optional(),
});

export const removeCartItemSchema = z.object({
  itemId: z.string().trim().regex(UUID_PATTERN, "Unknown cart item."),
});

const optionalLine = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().default("");

export const checkoutSchema = z.object({
  recipientName: z
    .string()
    .trim()
    .min(2, "Enter the recipient's name.")
    .max(80, "Use 80 characters or fewer."),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a phone number.")
    .max(30, "Use 30 characters or fewer.")
    .regex(/^[0-9+()\-\s]+$/, "Use digits, spaces, +, - or parentheses."),
  addressLine1: z
    .string()
    .trim()
    .min(6, "Enter a street address.")
    .max(120, "Use 120 characters or fewer."),
  addressLine2: optionalLine(120, "Use 120 characters or fewer."),
  city: z
    .string()
    .trim()
    .min(2, "Enter a city or town.")
    .max(60, "Use 60 characters or fewer."),
  district: z
    .string()
    .trim()
    .min(2, "Enter a district.")
    .max(60, "Use 60 characters or fewer."),
  division: z
    .string()
    .trim()
    .refine(
      (value) => divisionValues.includes(value as BdDivision),
      "Choose a division.",
    ),
  postalCode: z
    .string()
    .trim()
    .max(12, "Use 12 characters or fewer.")
    .regex(/^[0-9]*$/, "Use digits only.")
    .optional()
    .default(""),
  giftMessage: z
    .string()
    .trim()
    .max(280, "Use 280 characters or fewer.")
    .optional()
    .default(""),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
