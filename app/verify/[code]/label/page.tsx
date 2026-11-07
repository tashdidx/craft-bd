import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { PrintButton } from "@/components/provenance/print-button";
import { VerificationQr } from "@/components/provenance/verification-qr";
import { Button } from "@/components/ui/button";
import { getCertificateForVerification } from "@/lib/data/provenance";
import {
  isValidCertificateCode,
  normalizeCertificateCode,
} from "@/lib/provenance";
import { getRequestOrigin } from "@/lib/request-origin";

interface LabelPageProps {
  params: Promise<{ code: string }>;
}

export const metadata: Metadata = {
  title: "Product QR label",
  robots: { index: false, follow: false },
};

export default function ProductLabelPage({ params }: LabelPageProps) {
  return (
    <Suspense fallback={<LabelSkeleton />}>
      <LabelContent params={params} />
    </Suspense>
  );
}

async function LabelContent({ params }: LabelPageProps) {
  const { code: rawCode } = await params;
  const code = normalizeCertificateCode(rawCode);

  if (!isValidCertificateCode(code)) notFound();

  const record = await getCertificateForVerification(code);

  if (!record) notFound();

  const origin = await getRequestOrigin();
  const verifyUrl = `${origin}/verify/${encodeURIComponent(code)}`;
  const qrBase = `/api/qr/${encodeURIComponent(code)}`;
  const { certificate, product } = record;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6">
      <div className="print:hidden">
        <Link
          href={`/verify/${encodeURIComponent(code)}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to the product record
        </Link>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
          Product QR label
        </p>
        <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
          Print a label for this product.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Attach this label to the piece or its packaging. The QR opens{" "}
          <span className="break-all font-mono text-xs text-foreground">
            {verifyUrl}
          </span>
          . Generate printed labels from the live domain, not from localhost.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <a href={`${qrBase}?format=svg&download=1`} download>
              <Download aria-hidden="true" className="size-4" />
              Download SVG
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={`${qrBase}?format=png&download=1`} download>
              <Download aria-hidden="true" className="size-4" />
              Download PNG
            </a>
          </Button>
          <PrintButton
            label="Print label"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-transparent px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary print:hidden"
          />
        </div>
      </div>

      <div className="mt-8 grid place-items-center print:mt-0">
        <article className="qr-label w-full max-w-sm rounded-3xl border border-border bg-white px-6 py-7 text-center text-[#2b2119] shadow-[0_30px_90px_-70px_rgba(43,33,25,0.65)] print:w-[85mm] print:max-w-[85mm] print:break-inside-avoid print:rounded-none print:border-[#2b2119] print:shadow-none">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#9a3f24]">
            Craft BD · Product verification
          </p>
          <p className="mt-2 font-display text-xl leading-tight">
            {product?.title ?? "Craft BD piece"}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[#756557]">
            {certificate.certificate_code}
          </p>

          <div className="mx-auto mt-5 w-48 rounded-xl border border-[#e3d5c2] bg-white p-2">
            <VerificationQr
              value={verifyUrl}
              label={`QR code for ${certificate.certificate_code}`}
            />
          </div>

          <p className="mt-4 text-[11px] font-semibold">
            Scan to verify the product record
          </p>
          <p className="mt-1 break-all font-mono text-[9px] text-[#756557]">
            {verifyUrl.replace(/^https?:\/\//, "")}
          </p>

          <p className="mt-4 border-t border-[#e3d5c2] pt-3 text-[9px] leading-4 text-[#756557]">
            Verifies the Craft BD catalogue record, not the physical item. Inspect
            the piece and its label separately.
          </p>
        </article>
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground print:hidden">
        <Printer aria-hidden="true" className="size-3.5" />
        Print on adhesive paper or card, then attach it to the piece.
      </p>
    </div>
  );
}

function LabelSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse px-5 py-10 sm:px-6">
      <div className="h-3 w-32 rounded bg-muted" />
      <div className="mt-6 h-10 w-80 max-w-full rounded bg-muted" />
      <div className="mt-8 mx-auto h-80 w-full max-w-sm rounded-3xl bg-muted" />
    </div>
  );
}
