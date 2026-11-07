import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  certificateFieldChecks,
  parseCertificatePayload,
  type CertificateFieldCheck,
  type CertificatePayload,
} from "@/lib/provenance";
import { getPublicSupabaseClient } from "@/lib/supabase/public";
import type {
  Artisan,
  Category,
  Certificate,
  CraftJourney,
  Product,
  ProductImage,
} from "@/types/domain";

interface RawProductRow extends Product {
  categories: Category | Category[] | null;
  product_images: ProductImage[];
  craft_journeys: CraftJourney[];
}

interface RawCertificateRow extends Certificate {
  products: RawProductRow | RawProductRow[] | null;
  artisans: Artisan | Artisan[] | null;
}

export interface CertificateVerificationData {
  certificate: Certificate;
  product: Product | null;
  artisan: Artisan | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
  images: ProductImage[];
  journey: CraftJourney[];
  payload: CertificatePayload;
  checks: CertificateFieldCheck[];
  consistent: boolean;
}

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/**
 * Public certificate lookup. Verification is deliberately available to
 * signed-out visitors, including records that have been revoked.
 */
export async function getCertificateForVerification(
  code: string,
): Promise<CertificateVerificationData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("certificates", `certificate-${code}`);

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("certificates")
    .select(
      `
        *,
        products (
          *,
          categories ( id, name, slug ),
          product_images ( * ),
          craft_journeys ( * )
        ),
        artisans ( * )
      `,
    )
    .eq("certificate_code", code)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not look up this certificate: ${error.message}`);
  }
  if (!data) return null;

  const row = data as unknown as RawCertificateRow;
  const productRow = firstOrNull(row.products);
  const product = productRow ? (productRow as Product) : null;
  const artisan = firstOrNull(row.artisans);
  const category = firstOrNull(productRow?.categories ?? null);
  const images = [...(productRow?.product_images ?? [])].sort(
    (a, b) =>
      Number(b.is_primary) - Number(a.is_primary) ||
      a.sort_order - b.sort_order,
  );
  const journey = [...(productRow?.craft_journeys ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const payload = parseCertificatePayload(row.certificate_payload);
  const checks = certificateFieldChecks({
    payload,
    certificate: row,
    product,
    artisan,
    category,
  });

  return {
    certificate: row,
    product,
    artisan,
    category,
    images,
    journey,
    payload,
    checks,
    consistent: checks.every((check) => check.matches),
  };
}
