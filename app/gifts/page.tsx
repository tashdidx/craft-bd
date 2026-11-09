import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Gift, SearchX, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { AddToCartForm } from "@/components/commerce/add-to-cart-form";
import { GiftFinderForm } from "@/components/commerce/gift-finder-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createEmptyCatalogueFilters,
  type CatalogueFilters,
} from "@/lib/catalogue";
import { findGiftBudget, giftBudgetLabel } from "@/lib/commerce";
import { OCCASION_LABELS, OCCASIONS } from "@/lib/constants";
import { getCatalogueProducts } from "@/lib/data/catalogue";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Gift finder",
  description:
    "Find handmade Bangladeshi gifts by occasion and budget, with optional gift wrapping and a handwritten message.",
};

interface GiftsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function GiftsPage({ searchParams }: GiftsPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6">
      <section className="border-b border-border py-12 sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          Gift finder
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">
          A handmade gift, matched to the moment.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Choose an occasion and a budget. The catalogue filters by recorded
          craft metadata — no algorithms, just the pieces that fit.
        </p>
      </section>

      <Suspense fallback={<GiftsSkeleton />}>
        <GiftsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function parseOccasion(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;

  return (OCCASIONS as readonly string[]).includes(raw) ? raw : undefined;
}

async function GiftsContent({ searchParams }: GiftsPageProps) {
  const params = await searchParams;
  const occasion = parseOccasion(params.occasion);
  const budget = findGiftBudget(params.budget);

  const filters: CatalogueFilters = {
    ...createEmptyCatalogueFilters(),
    occasions: occasion ? [occasion] : [],
    minPrice: budget?.minPrice,
    maxPrice: budget?.maxPrice,
  };

  const result = await getCatalogueProducts(filters);

  return (
    <>
      <section className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Gift aria-hidden="true" className="size-5" strokeWidth={1.6} />
          </span>
          <div>
            <h2 className="text-2xl leading-tight">Who is it for?</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Gift wrapping is charged per piece and can be added to the cart
              below. A gift message is written at checkout.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <GiftFinderForm
            occasion={occasion}
            budget={budget?.value ?? undefined}
          />
        </div>
      </section>

      <section className="mt-10" aria-label="Gift results">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-5">
          <div>
            <h2 className="text-2xl leading-tight">
              {occasion
                ? `${OCCASION_LABELS[occasion] ?? occasion} gifts`
                : "Gift-ready pieces"}
              <span className="text-muted-foreground">
                {" "}
                · {giftBudgetLabel(budget)}
              </span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatNumber(result.total)}{" "}
              {result.total === 1 ? "piece matches" : "pieces match"}.
            </p>
          </div>
          {occasion || budget ? (
            <Link
              href="/gifts"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Clear gift filters
            </Link>
          ) : null}
        </div>

        {result.items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <SearchX aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </span>
            <h3 className="mt-5 text-2xl">No pieces fit that pairing</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try a wider budget or another occasion. The catalogue is small by
              design — every piece is made by a named studio.
            </p>
            <Button asChild className="mt-6">
              <Link href="/gifts">Reset the gift finder</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {result.items.map((product) => (
              <div key={product.id} className="flex flex-col">
                <ProductCard product={product} />
                <div className="mt-3">
                  <AddToCartForm
                    productId={product.id}
                    stockQuantity={product.stockQuantity}
                    giftWrapAvailable
                    nextPath="/gifts"
                    defaultGiftWrap
                    className="rounded-2xl border border-border bg-card p-3"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-3 sm:p-8">
        <GiftStep
          title="Pick by moment"
          body="Occasion tags are recorded on each piece by the studio, so the filter is deterministic."
        />
        <GiftStep
          title="Wrap it"
          body="Add gift wrapping per piece in the cart. The packing slip carries your message."
        />
        <GiftStep
          title="Pay on delivery"
          body="Cash on delivery only. The studio confirms the order before dispatch."
        />
      </section>
    </>
  );
}

function GiftStep({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-medium">
        <Sparkles
          aria-hidden="true"
          className="size-4 text-primary"
          strokeWidth={1.7}
        />
        {title}
      </p>
      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}

function GiftsSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-44 rounded-3xl" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[430px] rounded-3xl" />
        <Skeleton className="h-[430px] rounded-3xl" />
        <Skeleton className="h-[430px] rounded-3xl" />
      </div>
    </div>
  );
}
