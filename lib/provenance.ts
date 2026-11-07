import { DIVISION_LABELS } from "@/lib/constants";
import type { Artisan, Category, Certificate, Product } from "@/types/domain";

/** Certificate codes are issued in the form CBD-JAM-2026-0001. */
export const CERTIFICATE_CODE_PATTERN = /^CBD-[A-Z]{3}-\d{4}-\d{4}$/;

export function normalizeCertificateCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function isValidCertificateCode(value: string) {
  return CERTIFICATE_CODE_PATTERN.test(value);
}

export function certificateVerifyPath(code: string) {
  return `/verify/${encodeURIComponent(normalizeCertificateCode(code))}`;
}

export function certificateLabelPath(code: string) {
  return `${certificateVerifyPath(code)}/label`;
}

/**
 * Accepts either a raw certificate code or a same-origin verification URL from
 * a scanned QR. Anything else is rejected so the scanner cannot be used to
 * redirect visitors to an external site.
 */
export function certificateCodeFromScan(
  value: string,
  origin: string,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const directCode = normalizeCertificateCode(trimmed);
  if (isValidCertificateCode(directCode)) return directCode;

  let url: URL;

  try {
    url = new URL(trimmed, origin);
  } catch {
    return null;
  }

  if (url.origin !== origin) return null;

  const match = url.pathname.match(/^\/verify\/([^/]+)\/?$/);
  if (!match) return null;

  let code: string;

  try {
    code = normalizeCertificateCode(decodeURIComponent(match[1]));
  } catch {
    return null;
  }

  return isValidCertificateCode(code) ? code : null;
}

/** The tamper-evident payload recorded when a certificate is issued. */
export interface CertificatePayload {
  certificateCode: string | null;
  productId: string | null;
  productTitle: string | null;
  artisanId: string | null;
  artisanName: string | null;
  craft: string | null;
  origin: string | null;
  materials: string[] | null;
  issuedAt: string | null;
}

const EMPTY_PAYLOAD: CertificatePayload = {
  certificateCode: null,
  productId: null,
  productTitle: null,
  artisanId: null,
  artisanName: null,
  craft: null,
  origin: null,
  materials: null,
  issuedAt: null,
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

export function parseCertificatePayload(value: unknown): CertificatePayload {
  const record = asRecord(value);

  if (!record) return EMPTY_PAYLOAD;

  return {
    certificateCode: asString(record.certificate_code),
    productId: asString(record.product_id),
    productTitle: asString(record.product_title),
    artisanId: asString(record.artisan_id),
    artisanName: asString(record.artisan_name),
    craft: asString(record.craft),
    origin: asString(record.origin),
    materials: Array.isArray(record.materials)
      ? record.materials.filter(
          (material): material is string => typeof material === "string",
        )
      : null,
    issuedAt: asString(record.issued_at),
  };
}

export interface CertificateFieldCheck {
  key: string;
  label: string;
  matches: boolean;
}

interface IntegrityInput {
  payload: CertificatePayload;
  certificate: Pick<
    Certificate,
    "certificate_code" | "product_id" | "artisan_id" | "issued_at"
  >;
  product: Pick<Product, "title" | "materials" | "region"> | null;
  artisan: Pick<Artisan, "display_name" | "district" | "region"> | null;
  category: Pick<Category, "name"> | null;
}

function normalizeText(value: string | null) {
  const trimmed = value?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

function sameText(left: string | null, right: string | null) {
  return normalizeText(left) !== null && normalizeText(left) === normalizeText(right);
}

function sameMaterials(left: string[] | null, right: string[] | null) {
  if (!left || !right || left.length !== right.length) return false;

  const normalizedLeft = left
    .map((material) => normalizeText(material))
    .filter((material): material is string => material !== null)
    .sort();
  const normalizedRight = right
    .map((material) => normalizeText(material))
    .filter((material): material is string => material !== null)
    .sort();

  return normalizedLeft.every(
    (material, index) => material === normalizedRight[index],
  );
}

/**
 * Compares the stored payload with the live catalogue rows. A mismatch means
 * the certificate and the current product record no longer tell the same story.
 */
export function certificateFieldChecks({
  payload,
  certificate,
  product,
  artisan,
  category,
}: IntegrityInput): CertificateFieldCheck[] {
  const expectedOrigin =
    product && artisan
      ? `${artisan.district}, ${DIVISION_LABELS[product.region]}, Bangladesh`
      : null;

  return [
    {
      key: "certificate_code",
      label: "Certificate code",
      matches: sameText(payload.certificateCode, certificate.certificate_code),
    },
    {
      key: "product_id",
      label: "Product record",
      matches: sameText(payload.productId, certificate.product_id),
    },
    {
      key: "product_title",
      label: "Product name",
      matches: sameText(payload.productTitle, product?.title ?? null),
    },
    {
      key: "artisan_id",
      label: "Artisan record",
      matches: sameText(payload.artisanId, certificate.artisan_id),
    },
    {
      key: "artisan_name",
      label: "Artisan name",
      matches: sameText(payload.artisanName, artisan?.display_name ?? null),
    },
    {
      key: "craft",
      label: "Craft tradition",
      matches: sameText(payload.craft, category?.name ?? null),
    },
    {
      key: "origin",
      label: "Origin",
      matches: sameText(payload.origin, expectedOrigin),
    },
    {
      key: "materials",
      label: "Materials",
      matches: sameMaterials(payload.materials, product?.materials ?? null),
    },
    {
      key: "issued_at",
      label: "Issue date",
      matches: sameText(payload.issuedAt, certificate.issued_at),
    },
  ];
}
