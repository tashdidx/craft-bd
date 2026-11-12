import "server-only";

import { z } from "zod";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUEST_CODE_PATTERN = /^CUS-[0-9]{4}-[0-9]{4}$/;

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().default("");

const optionalBudget = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? undefined : value,
  z.coerce
    .number({ message: "Use a number for the budget." })
    .min(0, "The budget cannot be negative.")
    .max(50_000_000, "Keep the budget under BDT 50,000,000.")
    .optional(),
);

export const customOrderRequestSchema = z
  .object({
    artisanSlug: z
      .string()
      .trim()
      .min(1, "Choose a studio for this request.")
      .max(120, "Choose a valid studio.")
      .regex(SLUG_PATTERN, "Choose a valid studio."),
    productType: z
      .string()
      .trim()
      .min(3, "Describe the kind of piece you want.")
      .max(120, "Use 120 characters or fewer."),
    designDescription: z
      .string()
      .trim()
      .min(20, "Describe the design in at least 20 characters.")
      .max(2_000, "Use 2,000 characters or fewer."),
    color: optionalText(80, "Use 80 characters or fewer."),
    size: optionalText(80, "Use 80 characters or fewer."),
    material: optionalText(120, "Use 120 characters or fewer."),
    quantity: z.coerce
      .number({ message: "Use a whole number of pieces." })
      .int("Use a whole number of pieces.")
      .min(1, "Request at least one piece.")
      .max(20, "Request 20 pieces or fewer."),
    budgetMin: optionalBudget,
    budgetMax: optionalBudget,
    customNotes: optionalText(1_000, "Use 1,000 characters or fewer."),
    referenceImageUrl: z.preprocess(
      (value) =>
        value === "" || value === null || value === undefined ? undefined : value,
      z
        .string()
        .trim()
        .url("Enter a full link beginning with https://.")
        .max(500, "Use 500 characters or fewer.")
        .optional(),
    ),
  })
  .refine(
    (data) =>
      data.budgetMin === undefined ||
      data.budgetMax === undefined ||
      data.budgetMax >= data.budgetMin,
    {
      message: "The maximum budget must be at least the minimum.",
      path: ["budgetMax"],
    },
  );

export const quoteResponseSchema = z.object({
  requestCode: z
    .string()
    .trim()
    .regex(REQUEST_CODE_PATTERN, "Unknown custom order."),
  decision: z.enum(["approved", "declined"], {
    message: "Choose whether to approve or decline the estimate.",
  }),
  note: optionalText(500, "Use 500 characters or fewer."),
});

export type CustomOrderRequestInput = z.infer<typeof customOrderRequestSchema>;
export type QuoteResponseInput = z.infer<typeof quoteResponseSchema>;
