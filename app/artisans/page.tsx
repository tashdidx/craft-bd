import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, SearchX } from "lucide-react";
import { ArtisanDirectoryCard } from "@/components/artisan/artisan-directory-card";
import { ArtisanFilters } from "@/components/artisan/artisan-filters";
import { ArtisanDirectorySkeleton } from "@/components/artisan/artisan-skeletons";
import { Button } from "@/components/ui/button";
import { parseArtisanSearchParams } from "@/lib/artisans";
import { getArtisanDirectory } from "@/lib/data/artisans";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Artisan studios",
  description:
    "Meet the Bangladeshi artisans behind Craft BD — search by craft tradition, district, and region, then explore each studio's pieces.",
};

interface ArtisansPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ArtisansPage({ searchParams }: ArtisansPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6">
      <section className="border-b border-border py-12 sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          The makers
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">
          The hands behind the catalogue.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Every piece on Craft BD belongs to a named studio. Meet the weavers,
          potters, metalworkers, and makers who carry these craft traditions —
          then follow the link from a studio to its pieces.
        </p>
      </section>

      <Suspense fallback={<ArtisanDirectorySkeleton />}>
        <ArtisanDirectoryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ArtisanDirectoryContent({ searchParams }: ArtisansPageProps) {
  const filters = parseArtisanSearchParams(await searchParams);
  const result = await getArtisanDirectory(filters);

  return (
    <>
      <section className="pt-10">
        <ArtisanFilters filters={filters} facets={result.facets} />
      </section>

      <section aria-label="Artisan studios" className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatNumber(result.total)}
            </span>{" "}
            {result.total === 1 ? "studio" : "studios"}
            {result.total > 0 ? (
              <span className="hidden sm:inline">
                {" "}
                · {formatNumber(result.facets.crafts.length)} craft
                {result.facets.crafts.length === 1 ? "" : "s"} ·{" "}
                {formatNumber(result.facets.regions.length)} region
                {result.facets.regions.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Browse every piece
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {result.total === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <SearchX aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </span>
            <h2 className="mt-5 text-2xl">No studios match that search</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try a broader place name, a different craft tradition, or clear
              the filters to see every approved studio.
            </p>
            <Button asChild className="mt-6">
              <Link href="/artisans">View all studios</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((artisan) => (
              <ArtisanDirectoryCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 rounded-[2rem] border border-border bg-card px-7 py-8 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Provenance
            </p>
            <h2 className="mt-3 max-w-xl text-2xl leading-tight sm:text-3xl">
              A studio&rsquo;s name travels with every piece.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Product pages link back to the maker, the recorded origin, and the
              certificate record behind the work.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/verify">
              Verify a product
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
