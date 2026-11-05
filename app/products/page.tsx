import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch, SearchX } from "lucide-react";
import { ActiveFilters } from "@/components/catalogue/active-filters";
import { FilterPanel } from "@/components/catalogue/filter-panel";
import { Pagination } from "@/components/catalogue/pagination";
import { CatalogueResultsSkeleton } from "@/components/catalogue/results-skeleton";
import { SortMenu } from "@/components/catalogue/sort-menu";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  catalogueHref,
  parseCatalogueSearchParams,
} from "@/lib/catalogue";
import { getCatalogueFacets, getCatalogueProducts } from "@/lib/data/catalogue";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Browse handmade Bangladeshi craft — filter by craft tradition, region, material, occasion, and price.",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6">
      <section className="border-b border-border py-12 sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          The catalogue
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">
          Pieces with a place, a maker, and a process.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Every listing is tied to an artisan studio and a craft tradition.
          Filter by where it was made, what it is made from, and what you are
          celebrating.
        </p>
      </section>

      <Suspense fallback={<CataloguePageSkeleton />}>
        <CatalogueContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CatalogueContent({ searchParams }: ProductsPageProps) {
  const filters = parseCatalogueSearchParams(await searchParams);
  const [facets, result] = await Promise.all([
    getCatalogueFacets(),
    getCatalogueProducts(filters),
  ]);

  return (
    <div className="grid gap-10 pt-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <FilterPanel facets={facets} filters={filters} />
      </aside>

      <section aria-label="Catalogue results">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatNumber(result.total)}
            </span>{" "}
            {result.total === 1 ? "piece" : "pieces"}
            {result.total > 0 ? (
              <span className="hidden sm:inline">
                {" "}
                · page {result.page} of {result.pageCount}
              </span>
            ) : null}
          </p>
          <SortMenu filters={filters} />
        </div>

        <div className="mt-5">
          <ActiveFilters filters={filters} />
        </div>

        {result.total === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <SearchX aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </span>
            <h2 className="mt-5 text-2xl">No pieces match those filters</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try removing a material or widening the price range. The catalogue
              is small by design — every piece is made by a named studio.
            </p>
            <Button asChild className="mt-6">
              <Link href="/products">View the full catalogue</Link>
            </Button>
          </div>
        ) : result.items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <PackageSearch
                aria-hidden="true"
                className="size-6"
                strokeWidth={1.5}
              />
            </span>
            <h2 className="mt-5 text-2xl">That page is past the end</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              These filters return {result.pageCount} page
              {result.pageCount === 1 ? "" : "s"} of results.
            </p>
            <Button asChild className="mt-6">
              <Link href={catalogueHref(filters, { page: 1 })}>
                Go to the first page
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-7 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {result.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <Pagination
          filters={filters}
          page={result.page}
          pageCount={result.pageCount}
        />
      </section>
    </div>
  );
}

function CataloguePageSkeleton() {
  return (
    <div className="grid gap-10 pt-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
      <Skeleton className="h-[680px] rounded-3xl" />
      <CatalogueResultsSkeleton />
    </div>
  );
}
