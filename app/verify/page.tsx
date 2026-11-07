import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Fingerprint,
  ScanLine,
} from "lucide-react";
import { VerifyLookupForm } from "@/components/provenance/verify-lookup-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Verify a product",
  description:
    "Scan a Craft BD product label or enter its certificate code to check the provenance record.",
};

const steps = [
  {
    icon: ScanLine,
    title: "Scan the label",
    detail:
      "Point your camera at the QR code on a Craft BD product label, or type the code printed on the certificate card.",
  },
  {
    icon: Fingerprint,
    title: "Compare the record",
    detail:
      "The page matches the stored payload against the piece, maker, origin, materials, production stages, and issue date.",
  },
  {
    icon: BadgeCheck,
    title: "See the provenance",
    detail:
      "Product ID, artisan, location, craft type, materials, production information, and certificate details on one public page.",
  },
] as const;

export default function VerifyPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(154,63,36,0.10),transparent_42%),radial-gradient(circle_at_88%_20%,rgba(39,64,96,0.10),transparent_38%)]" />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Product verification
            </p>
            <h1 className="mt-4 max-w-xl text-4xl leading-[1.05] sm:text-5xl">
              Verify the piece in your hands.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              Scan the QR label on a Craft BD product or enter its certificate
              code to see the maker, craft, origin, materials, production stages,
              and issue date recorded at certification — and whether that
              payload still matches the live catalogue.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/scan">
                  <ScanLine
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.8}
                  />
                  Scan a product QR
                </Link>
              </Button>
            </div>

            <div className="mt-8 max-w-lg rounded-[2rem] border border-border bg-card p-6 shadow-[0_30px_90px_-60px_rgba(43,33,25,0.55)] sm:p-8">
              <div className="flex items-center gap-2 text-primary">
                <BadgeCheck
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.7}
                />
                <p className="text-sm font-medium">Public, no account needed</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                No camera? Enter the code printed on the certificate card.
              </p>
              <div className="mt-5">
                <VerifyLookupForm />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl leading-tight">How verification works</h2>
              <ul className="mt-5 space-y-5">
                {steps.map(({ icon: Icon, title, detail }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                      <Icon
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={1.7}
                      />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                        {detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-accent p-6 text-accent-foreground">
              <h2 className="text-xl leading-tight">
                Every published piece has one.
              </h2>
              <p className="mt-2 text-sm leading-6 text-accent-foreground/70">
                A certificate is issued once per product, with a SHA-256 hash of
                the recorded payload. Labels are generated from the live domain,
                so scan links open the correct site.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                Browse the catalogue
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
