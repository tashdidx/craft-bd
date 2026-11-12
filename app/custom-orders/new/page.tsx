import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Hammer } from "lucide-react";
import { CustomOrderForm } from "@/components/custom-orders/custom-order-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";
import { getApprovedArtisanOptions } from "@/lib/data/artisans";

export const metadata: Metadata = {
  title: "Start a custom order",
  description:
    "Commission a bespoke piece from a verified Bangladeshi artisan studio.",
  robots: { index: false, follow: false },
};

interface NewCustomOrderPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function NewCustomOrderPage(props: NewCustomOrderPageProps) {
  return (
    <Suspense fallback={<NewCustomOrderSkeleton />}>
      <NewCustomOrderContent {...props} />
    </Suspense>
  );
}

async function NewCustomOrderContent({
  searchParams,
}: NewCustomOrderPageProps) {
  await requireUser("/custom-orders/new");
  const search = await searchParams;
  const artisans = await getApprovedArtisanOptions();
  const requested = Array.isArray(search.artisan)
    ? search.artisan[0]
    : search.artisan;
  const selected = artisans.some((artisan) => artisan.slug === requested)
    ? requested
    : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/custom-orders"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        All custom orders
      </Link>

      <header className="mt-5 border-b border-border pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          Commission
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">
          Start a custom order.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Tell a studio what you would like made. Your brief is sent with a
          request code, and the studio replies with a price and timeline before
          any work begins.
        </p>
      </header>

      {artisans.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Hammer aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 text-2xl">No studios are open for commissions</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Approved studios will appear here. In the meantime, the catalogue is
            open for ready-made pieces.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse the catalogue</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <CustomOrderForm artisans={artisans} selectedSlug={selected} />
        </div>
      )}
    </div>
  );
}

function NewCustomOrderSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-5 h-11 w-72" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <Skeleton className="h-[42rem] rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
}
