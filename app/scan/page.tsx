import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Fingerprint,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { QrScanner } from "@/components/provenance/qr-scanner";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Scan a product QR",
  description:
    "Scan a Craft BD product label with your camera to open its provenance record.",
};

const checks = [
  {
    icon: BadgeCheck,
    title: "Product record",
    detail: "The piece, product ID, maker, craft, origin, and materials.",
  },
  {
    icon: ScanLine,
    title: "Production record",
    detail: "The recorded stages from raw material to the finished piece.",
  },
  {
    icon: Fingerprint,
    title: "Certificate record",
    detail: "The certificate code, issue date, hash, and integrity result.",
  },
] as const;

export default function ScanPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          Product verification
        </p>
        <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl">
          Scan the label on the piece.
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Point your camera at the QR code on a Craft BD product label. The
          scanner opens the same public record you would see by entering the
          certificate code, including the maker, origin, materials, production
          stages, and certificate details.
        </p>
      </div>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <QrScanner />

        <aside className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl leading-tight">What the scan opens</h2>
            <ul className="mt-5 space-y-5">
              {checks.map(({ icon: Icon, title, detail }) => (
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
            <ShieldCheck
              aria-hidden="true"
              className="size-5 text-accent-foreground/70"
              strokeWidth={1.7}
            />
            <h2 className="mt-3 text-xl leading-tight">
              What verification means.
            </h2>
            <p className="mt-2 text-sm leading-6 text-accent-foreground/70">
              A scan confirms that the certificate record matches the live Craft
              BD catalogue. It confirms the record, not the physical item; inspect
              the piece and its label separately.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/verify">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Enter a code instead
            </Link>
          </Button>

          <p className="text-xs leading-5 text-muted-foreground">
            Camera access requires HTTPS in production. On a development machine
            it works on <span className="font-mono">localhost</span>.
          </p>
        </aside>
      </div>
    </div>
  );
}
