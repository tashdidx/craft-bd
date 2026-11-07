import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  CircleX,
  Fingerprint,
  Hammer,
  MapPin,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { PrintButton } from "@/components/provenance/print-button";
import { VerificationQr } from "@/components/provenance/verification-qr";
import { VerificationSkeleton } from "@/components/provenance/verification-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DIVISION_LABELS, JOURNEY_STAGES } from "@/lib/constants";
import { getCertificateForVerification } from "@/lib/data/provenance";
import { formatBdt, formatDate } from "@/lib/format";
import {
  certificateLabelPath,
  isValidCertificateCode,
  normalizeCertificateCode,
  type CertificateFieldCheck,
} from "@/lib/provenance";
import { getRequestOrigin } from "@/lib/request-origin";

interface VerifyPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({
  params,
}: VerifyPageProps): Promise<Metadata> {
  const { code: rawCode } = await params;
  const code = normalizeCertificateCode(rawCode);

  if (!isValidCertificateCode(code)) {
    return {
      title: "Certificate not found",
      robots: { index: false, follow: false },
    };
  }

  const record = await getCertificateForVerification(code);

  return {
    title: record?.product
      ? `${code} · ${record.product.title}`
      : `Verify ${code}`,
    description: record
      ? `Provenance record for ${record.product?.title ?? "a Craft BD piece"} from ${record.artisan?.district ?? "Bangladesh"}.`
      : "Check a Craft BD provenance certificate.",
    robots: { index: false, follow: false },
  };
}

export default function VerifyCertificatePage({ params }: VerifyPageProps) {
  return (
    <Suspense fallback={<VerificationSkeleton />}>
      <VerifyContent params={params} />
    </Suspense>
  );
}

async function VerifyContent({ params }: VerifyPageProps) {
  const { code: rawCode } = await params;
  const code = normalizeCertificateCode(rawCode);

  if (!isValidCertificateCode(code)) notFound();

  const record = await getCertificateForVerification(code);

  if (!record) notFound();

  const origin = await getRequestOrigin();
  const verifyUrl = `${origin}/verify/${encodeURIComponent(code)}`;
  const { certificate, product, artisan, category, images, journey } = record;
  const image = images[0] ?? null;
  const active = certificate.status === "active";
  const authentic = active && record.consistent;
  const state = !active ? "revoked" : record.consistent ? "authentic" : "mismatch";
  const failedChecks = record.checks.filter((check) => !check.matches);
  const matchedCount = record.checks.length - failedChecks.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 py-6 text-xs text-muted-foreground print:hidden"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/verify" className="transition-colors hover:text-foreground">
          Verify
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-mono text-foreground">{code}</span>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-7">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Product verification
          </p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
            {product?.title ?? "Product record"}
          </h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">{code}</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Issued {formatDate(certificate.issued_at)} for a piece recorded by{" "}
            {artisan?.display_name ?? "a Craft BD studio"}.
          </p>
        </div>
        <StatusBadge state={state} />
      </header>

      <VerificationBanner
        state={state}
        revocationReason={certificate.revocation_reason}
        revokedAt={certificate.revoked_at}
        failedChecks={failedChecks}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_90px_-70px_rgba(43,33,25,0.6)]">
          <div className="relative overflow-hidden bg-accent px-6 py-7 text-accent-foreground sm:px-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.14),transparent_45%)]"
            />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-foreground/60">
                  Craft BD · Certificate of provenance
                </p>
                <p className="mt-2 max-w-md font-display text-2xl leading-tight">
                  {product?.title ?? "Linked piece unavailable"}
                </p>
                <p className="mt-2 font-mono text-xs text-accent-foreground/70">
                  {certificate.certificate_code}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground/60">
                  Issued
                </p>
                <p className="mt-1 text-sm">
                  {formatDate(certificate.issued_at)}
                </p>
                <Badge
                  variant={authentic ? "success" : "warning"}
                  className="mt-3 border-accent-foreground/25 bg-accent-foreground/10 text-accent-foreground"
                >
                  {authentic
                    ? "Verified record"
                    : active
                      ? "Needs review"
                      : "Revoked"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-6 py-7 sm:px-8">
            <section className="grid gap-6 sm:grid-cols-[0.7fr_1.3fr]">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary">
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.alt_text || product?.title || "Certified piece"}
                    fill
                    sizes="(min-width: 640px) 220px, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center px-4 text-center text-xs text-muted-foreground">
                    Image not available for this record
                  </div>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  The piece
                </p>
                <h2 className="mt-1 text-2xl leading-tight">
                  {product?.title ?? "Recorded piece"}
                </h2>
                {product ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {product.short_description}
                  </p>
                ) : null}

                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <CertificateFact
                    icon={Hammer}
                    label="Craft tradition"
                    value={category?.name ?? "Not recorded"}
                  />
                  <CertificateFact
                    icon={MapPin}
                    label="Origin"
                    value={
                      product && artisan
                        ? `${artisan.district}, ${DIVISION_LABELS[product.region]}`
                        : "Not recorded"
                    }
                  />
                  <CertificateFact
                    icon={Sparkles}
                    label="Materials"
                    value={
                      product?.materials.length
                        ? product.materials.join(", ")
                        : "Not recorded"
                    }
                  />
                  <CertificateFact
                    icon={CalendarDays}
                    label="Listed price"
                    value={product ? formatBdt(product.price_bdt) : "Not listed"}
                  />
                </dl>

                {product ? (
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View the piece in the catalogue
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                ) : null}
              </div>
            </section>

            <section className="grid gap-6 border-t border-border pt-7 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  The maker
                </p>
                <div className="mt-3 flex items-start gap-3">
                  {artisan?.avatar_url ? (
                    <Image
                      src={artisan.avatar_url}
                      alt={`Portrait of ${artisan.display_name}`}
                      width={56}
                      height={56}
                      className="size-14 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                      <UserRound
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.7}
                      />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium">
                      {artisan?.display_name ?? "Studio record unavailable"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {artisan?.workshop_name ??
                        artisan?.craft_specialization ??
                        "Craft BD artisan"}
                    </p>
                    {artisan ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {artisan.years_of_experience} years at the craft
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  The record
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">Certificate</dt>
                    <dd className="font-mono text-xs">
                      {certificate.certificate_code}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="shrink-0 text-muted-foreground">Product ID</dt>
                    <dd className="break-all text-right font-mono text-[10px] leading-4">
                      {certificate.product_id}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">Issued</dt>
                    <dd>{formatDate(certificate.issued_at)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="capitalize">{certificate.status}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">Payload fields</dt>
                    <dd>
                      {matchedCount} of {record.checks.length} match
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="border-t border-border pt-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Production information
                  </p>
                  <h3 className="mt-1 text-xl leading-tight">
                    How this piece was recorded as made.
                  </h3>
                </div>
                {journey.length ? (
                  <Badge variant="outline">
                    {journey.length} recorded stages
                  </Badge>
                ) : null}
              </div>

              {journey.length ? (
                <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                  {journey.map((step, index) => {
                    const stage = JOURNEY_STAGES.find(
                      (item) => item.stage === step.stage,
                    );

                    return (
                      <li
                        key={step.id}
                        className="rounded-xl border border-border bg-background px-3.5 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                              {String(index + 1).padStart(2, "0")} ·{" "}
                              {stage?.label ??
                                step.stage.replace(/_/g, " ")}
                            </p>
                            <p className="mt-1 text-sm font-medium leading-snug">
                              {step.title}
                            </p>
                          </div>
                          {step.duration_label ? (
                            <span className="shrink-0 text-[10px] text-muted-foreground">
                              {step.duration_label}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {step.description}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Production stages are not recorded for this piece.
                </p>
              )}
            </section>

            <section className="border-t border-border pt-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Record integrity
                  </p>
                  <h3 className="mt-1 text-xl leading-tight">
                    Payload against the live catalogue.
                  </h3>
                </div>
                <Badge variant={record.consistent ? "success" : "warning"}>
                  {record.consistent ? "All fields match" : "Mismatch found"}
                </Badge>
              </div>

              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {record.checks.map((check) => (
                  <IntegrityRow key={check.key} check={check} />
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <Fingerprint
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                    strokeWidth={1.7}
                  />
                  SHA-256 payload hash
                </p>
                <p className="mt-1.5 break-all font-mono text-[10px] leading-5 text-muted-foreground">
                  {certificate.certificate_hash}
                </p>
              </div>
            </section>
          </div>

          <footer className="border-t border-border bg-secondary/30 px-6 py-4 text-xs leading-5 text-muted-foreground sm:px-8">
            <p>
              The hash is computed from the payload recorded at issuance. Any
              later change to the payload would produce a different hash, so
              this record is tamper-evident even though it remains publicly
              readable.
            </p>
            <p className="mt-2">
              Verification confirms that this certificate record matches the
              Craft BD catalogue. It does not by itself prove that a physical
              item is genuine; inspect the piece and its printed certificate
              card separately.
            </p>
          </footer>
        </article>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <ScanLine
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.8}
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Scan to verify
              </p>
            </div>
            <div className="mx-auto mt-4 max-w-56 rounded-2xl border border-border bg-white p-3">
              <VerificationQr
                value={verifyUrl}
                label={`QR code for certificate ${certificate.certificate_code}`}
              />
            </div>
            <p className="mt-3 break-all font-mono text-[10px] leading-5 text-muted-foreground">
              {verifyUrl}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Print this page or scan the code to open the same record on a
              phone.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-4 w-full print:hidden"
            >
              <Link href={certificateLabelPath(code)}>
                Print a product QR label
              </Link>
            </Button>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 print:hidden">
            <h2 className="text-xl leading-tight">Keep checking</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Every published piece has its own certificate. The verification
              page is public and needs no account.
            </p>
            <div className="mt-4 space-y-2">
              {product ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/products/${product.slug}`}>
                    Open the product page
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" className="w-full">
                <Link href="/verify">Check another code</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/scan">Scan another product</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={certificateLabelPath(code)}>
                  Product QR label
                </Link>
              </Button>
              <PrintButton label="Print certificate" />
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-accent p-6 text-accent-foreground print:hidden">
            <ShieldCheck
              aria-hidden="true"
              className="size-5 text-accent-foreground/70"
              strokeWidth={1.7}
            />
            <h2 className="mt-3 text-xl leading-tight">Why this matters.</h2>
            <p className="mt-2 text-sm leading-6 text-accent-foreground/70">
              A certificate ties a piece to a named studio, a recorded origin,
              and a fixed issue date. Verification keeps that record honest when
              the piece changes hands — it confirms the record, not the physical
              item.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

type VerificationState = "authentic" | "revoked" | "mismatch";

function StatusBadge({ state }: { state: VerificationState }) {
  if (state === "authentic") {
    return <Badge variant="success">Record verified</Badge>;
  }

  if (state === "revoked") {
    return <Badge variant="warning">Certificate revoked</Badge>;
  }

  return <Badge variant="warning">Record needs review</Badge>;
}

function VerificationBanner({
  state,
  revocationReason,
  revokedAt,
  failedChecks,
}: {
  state: VerificationState;
  revocationReason: string | null;
  revokedAt: string | null;
  failedChecks: CertificateFieldCheck[];
}) {
  if (state === "authentic") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900">
        <ShieldCheck
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0"
          strokeWidth={1.7}
        />
        <div>
          <p className="text-sm font-semibold">
            This certificate record is verified.
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            The payload recorded at issuance matches the live Craft BD catalogue
            for this piece, maker, craft, origin, materials, production stages,
            and issue date. This confirms the record, not the physical item.
          </p>
        </div>
      </div>
    );
  }

  if (state === "revoked") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-900">
        <ShieldAlert
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0"
          strokeWidth={1.7}
        />
        <div>
          <p className="text-sm font-semibold">
            This certificate has been revoked.
          </p>
          <p className="mt-1 text-sm leading-6 text-red-800">
            {revocationReason ??
              "The studio or Craft BD withdrew this record. Do not rely on it as proof of provenance."}
          </p>
          {revokedAt ? (
            <p className="mt-1 text-xs text-red-700">
              Revoked {formatDate(revokedAt)}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
      <ShieldAlert
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0"
        strokeWidth={1.7}
      />
      <div>
        <p className="text-sm font-semibold">
          This record no longer matches the catalogue.
        </p>
        <p className="mt-1 text-sm leading-6 text-amber-800">
          {failedChecks.length} of the recorded fields differ from the live
          record{failedChecks.length ? `: ${failedChecks.map((check) => check.label).join(", ")}` : ""}.
          Treat the certificate as unverified until the studio or Craft BD
          corrects it.
        </p>
      </div>
    </div>
  );
}

function CertificateFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hammer;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5 text-primary" strokeWidth={1.7} />
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-6">{value}</dd>
    </div>
  );
}

function IntegrityRow({ check }: { check: CertificateFieldCheck }) {
  return (
    <li className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
      {check.matches ? (
        <CircleCheck
          aria-hidden="true"
          className="size-4 shrink-0 text-emerald-600"
          strokeWidth={1.8}
        />
      ) : (
        <CircleX
          aria-hidden="true"
          className="size-4 shrink-0 text-red-600"
          strokeWidth={1.8}
        />
      )}
      <span className="flex-1">{check.label}</span>
      <span className="text-[11px] text-muted-foreground">
        {check.matches ? "Match" : "Mismatch"}
      </span>
    </li>
  );
}
