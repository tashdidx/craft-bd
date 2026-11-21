import "server-only";

import { z } from "zod";
import {
  ARTISAN_STATUSES,
  CUSTOM_ORDER_STATUSES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PRODUCT_STATUSES,
} from "@/lib/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const uuid = z
  .string()
  .trim()
  .regex(UUID_PATTERN, "That record could not be identified.");

const returnTo = z.string().trim().max(240).optional().default("");

export const adminOrderStatusSchema = z.object({
  orderId: uuid,
  orderNumber: z
    .string()
    .trim()
    .regex(/^CBD-[0-9]{4}-[0-9]{4}$/, "Unknown order number."),
  status: z.enum(ORDER_STATUSES),
  returnTo,
});

export const adminPaymentStatusSchema = z.object({
  orderId: uuid,
  orderNumber: z
    .string()
    .trim()
    .regex(/^CBD-[0-9]{4}-[0-9]{4}$/, "Unknown order number."),
  paymentStatus: z.enum(PAYMENT_STATUSES),
  returnTo,
});

export const adminQuoteSchema = z.object({
  requestId: uuid,
  requestCode: z
    .string()
    .trim()
    .regex(/^CUS-[0-9]{4}-[0-9]{4}$/, "Unknown request code."),
  priceEstimateBdt: z.coerce
    .number({ message: "Enter the estimate in BDT." })
    .positive("The estimate must be greater than zero.")
    .max(99_999_999, "That estimate is too large."),
  estimatedDays: z.coerce
    .number({ message: "Enter the lead time in days." })
    .int("Use a whole number of days.")
    .min(1, "The lead time must be at least one day.")
    .max(365, "Keep the lead time within one year."),
  note: z
    .string()
    .trim()
    .max(1_000, "Use 1,000 characters or fewer.")
    .optional()
    .default(""),
  returnTo,
});

export const adminCustomOrderStatusSchema = z.object({
  requestId: uuid,
  requestCode: z
    .string()
    .trim()
    .regex(/^CUS-[0-9]{4}-[0-9]{4}$/, "Unknown request code."),
  status: z.enum(CUSTOM_ORDER_STATUSES),
  note: z
    .string()
    .trim()
    .max(500, "Use 500 characters or fewer.")
    .optional()
    .default(""),
  returnTo,
});

export const adminReviewDecisionSchema = z
  .object({
    reviewId: uuid,
    decision: z.enum(["publish", "flag", "remove", "restore"]),
    note: z
      .string()
      .trim()
      .max(1_000, "Use 1,000 characters or fewer.")
      .optional()
      .default(""),
    returnTo,
  })
  .superRefine((value, context) => {
    if (
      (value.decision === "flag" || value.decision === "remove") &&
      value.note.length < 5
    ) {
      context.addIssue({
        code: "custom",
        path: ["note"],
        message:
          value.decision === "flag"
            ? "Give a moderation reason of at least 5 characters."
            : "Explain why this review is being removed.",
      });
    }
  });

const checkbox = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean(),
);

export const adminProductUpdateSchema = z.object({
  productId: uuid,
  priceBdt: z.coerce
    .number({ message: "Enter a price in BDT." })
    .positive("The price must be greater than zero.")
    .max(99_999_999, "That price is too large."),
  stockQuantity: z.coerce
    .number({ message: "Enter the stock quantity." })
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative.")
    .max(100_000, "That stock quantity is too large."),
  status: z.enum(PRODUCT_STATUSES),
  isFeatured: checkbox,
  returnTo,
});

export const adminArtisanUpdateSchema = z.object({
  artisanId: uuid,
  status: z.enum(ARTISAN_STATUSES),
  isFeatured: checkbox,
  returnTo,
});
