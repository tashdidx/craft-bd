/**
 * Stable aliases for the public Postgres enum types.
 *
 * `lib/supabase/database.types.ts` is overwritten by `npm run db:types`, so
 * hand-written aliases live here instead of depending on the generated
 * `Database["public"]["Enums"]` path throughout the app.
 */
import type { Database } from "./database.types";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type ArtisanStatus = Database["public"]["Enums"]["artisan_status"];
export type ProductStatus = Database["public"]["Enums"]["product_status"];
export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type CustomOrderStatus =
  Database["public"]["Enums"]["custom_order_status"];
export type CertificateStatus =
  Database["public"]["Enums"]["certificate_status"];
export type ReviewStatus = Database["public"]["Enums"]["review_status"];
export type JourneyStage = Database["public"]["Enums"]["journey_stage"];
export type BdDivision = Database["public"]["Enums"]["bd_division"];
