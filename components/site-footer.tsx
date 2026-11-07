import Link from "next/link";
import { SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/60 print:hidden">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">
              C
            </span>
            <div>
              <p className="font-display text-lg leading-none">{SITE.name}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Bangladeshi handicrafts
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
            {SITE.tagline} A marketplace for pieces that carry their maker,
            origin, and process with them.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/products" className="transition-colors hover:text-primary">
                All pieces
              </Link>
            </li>
            <li>
              <Link
                href="/products?sort=newest"
                className="transition-colors hover:text-primary"
              >
                New arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/#craft-traditions"
                className="transition-colors hover:text-primary"
              >
                Craft traditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Our promise
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href="/#our-promise"
                className="transition-colors hover:text-primary"
              >
                Story and provenance
              </Link>
            </li>
            <li>
              <Link
                href="/#craft-journey"
                className="transition-colors hover:text-primary"
              >
                Six-stage craft journey
              </Link>
            </li>
            <li>
              <Link
                href="/verify"
                className="transition-colors hover:text-primary"
              >
                Verify a product
              </Link>
            </li>
            <li>
              <Link
                href="/scan"
                className="transition-colors hover:text-primary"
              >
                Scan a product QR
              </Link>
            </li>
            <li>
              <Link
                href="/#craft-traditions"
                className="transition-colors hover:text-primary"
              >
                Meet the traditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{SITE.name} · Dhaka, Bangladesh</p>
          <p>
            Seed names and reviews are fictional; the craft traditions are real.
          </p>
        </div>
      </div>
    </footer>
  );
}
