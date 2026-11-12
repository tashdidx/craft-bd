import "server-only";

import { z } from "zod";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const reviewSchema = z.object({
  orderItemId: z
    .string()
    .trim()
    .regex(UUID_PATTERN, "Unknown order item."),
  rating: z.coerce
    .number({ message: "Choose a rating from 1 to 5." })
    .int("Choose a whole-star rating.")
    .min(1, "Choose a rating from 1 to 5.")
    .max(5, "Choose a rating from 1 to 5."),
  title: z
    .string()
    .trim()
    .max(120, "Use 120 characters or fewer.")
    .optional()
    .default(""),
  comment: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters.")
    .max(1_200, "Use 1,200 characters or fewer."),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
