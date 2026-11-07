import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Hammer,
  MapPin,
  ScanLine,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JOURNEY_STAGES, SITE } from "@/lib/constants";
import { getCatalogueFacets, getFeaturedProducts } from "@/lib/data/catalogue";
import { formatNumber } from "@/lib/format";

const promises = [
  {
    icon: Hammer,
    title: "A named maker",
    detail:
      "Every listing belongs to an artisan studio with a district, a craft specialisation, and years at the work.",
  },
  {
    icon: BookOpen,
    title: "The story held",
    detail:
      "Origin, history, traditional use, materials, and cultural meaning are recorded alongside the product.",
  },
  {
    icon: ScrollText,
    title: "The process shown",
    detail:
      "Six stages — from raw material to final piece — with the maker's own duration estimates.",
  },
  {
    icon: ShieldCheck,
    title: "Provenance recorded",
    detail:
      "A certificate is issued with the piece, carrying a hash computed from its recorded payload.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(154,63,36,0.10),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(39,64,96,0.10),transparent_40%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              A marketplace with memory
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl leading-[1.03] sm:text-6xl lg:text-7xl">
              Handmade in Bangladesh, carried with its story.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
              {SITE.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  Browse the catalogue
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#our-promise">How provenance works</Link>
              </Button>
            </div>

            <Suspense fallback={<CatalogueStatsSkeleton />}>
              <CatalogueStats />
            </Suspense>
          </div>

          <aside className="relative hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-secondary">
              <Image
                src="/crafts/jamdani.svg"
                alt="Lotus and river motifs from the jamdani weaving tradition"
                fill
                preload
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-8 w-64 rounded-2xl border border-border bg-card p-5 shadow-[0_24px_80px_-40px_rgba(43,33,25,0.5)]">
              <div className="flex items-center gap-2 text-primary">
                <BadgeCheck
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.7}
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Provenance trail
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Maker, origin, material story, six-stage journey, and a
                certificate code — attached to every published piece.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Suspense fallback={<FeaturedPiecesSkeleton />}>
        <FeaturedPieces />
      </Suspense>

      <section
        id="craft-traditions"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pt-20 sm:px-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Living craft traditions
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
              Start with a craft, not a category.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Jamdani weaving, clay pottery, jute, nakshi kantha, brass, bamboo,
            woodcraft, and shital pati — each with its own geography and
            vocabulary.
          </p>
        </div>

        <Suspense fallback={<TraditionsSkeleton />}>
          <CraftTraditions />
        </Suspense>
      </section>

      <section
        id="our-promise"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pt-20 sm:px-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Our promise
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
              Context is part of the product.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            The catalogue is modelled so that a piece cannot lose its maker,
            origin, or process when it changes hands.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, detail }) => (
            <article
              key={title}
              className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-lg leading-snug">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card px-6 py-5">
          <div>
            <p className="text-sm font-medium">Bought a Craft BD piece?</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Scan its QR label or enter the certificate code to check the live
              record.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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
            <Button asChild variant="outline">
              <Link href="/verify">
                Enter a code
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="craft-journey"
        className="mx-auto mt-20 w-full max-w-6xl scroll-mt-24 px-5 sm:px-6"
      >
        <div className="overflow-hidden rounded-[2rem] bg-accent px-7 py-10 text-accent-foreground sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-foreground/60">
                The craft journey
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
                Six stages, recorded for every piece.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-accent-foreground/70">
              Material sourcing, design, making, finishing, quality check, and
              the final product. Each stage carries its own note and duration.
            </p>
          </div>

          <ol className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {JOURNEY_STAGES.map((stage, index) => (
              <li
                key={stage.stage}
                className="rounded-2xl border border-accent-foreground/15 p-4"
              >
                <span className="font-mono text-[11px] text-accent-foreground/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm font-semibold leading-snug">
                  {stage.label}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-accent-foreground/60">
                  {stage.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl px-5 pb-20 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-border bg-card px-7 py-8 sm:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              The full catalogue
            </p>
            <h2 className="mt-3 max-w-xl text-2xl leading-tight sm:text-3xl">
              Find a piece by place, material, or the occasion you are marking.
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href="/products">
              Explore every piece
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

async function CatalogueStats() {
  const facets = await getCatalogueFacets();
  const stats = [
    { label: "published pieces", value: facets.total },
    { label: "artisan studios", value: facets.artisanCount },
    {
      label: "craft traditions",
      value: facets.categories.filter((category) => category.count > 0).length,
    },
  ];

  return (
    <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {stat.label}
          </dt>
          <dd className="mt-1 font-display text-3xl leading-none">
            {formatNumber(stat.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

async function FeaturedPieces() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Featured pieces
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            A first look at the catalogue.
          </h2>
        </div>
        <Link
          href="/products?sort=newest"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          See new arrivals
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

async function CraftTraditions() {
  const facets = await getCatalogueFacets();
  const categories = facets.categories.filter((category) => category.count > 0);

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
        >
          <div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-lg leading-snug transition-colors group-hover:text-primary">
              {category.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {category.count} {category.count === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <MapPin
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            strokeWidth={1.6}
          />
        </Link>
      ))}
    </div>
  );
}

function CatalogueStatsSkeleton() {
  return (
    <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index}>
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="mt-2 h-8 w-12" />
        </div>
      ))}
    </div>
  );
}

function FeaturedPiecesSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-6">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-9 w-80 max-w-full" />
      <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
            <Skeleton className="mt-4 h-3 w-24" />
            <Skeleton className="mt-3 h-5 w-4/5" />
            <Skeleton className="mt-2 h-3 w-1/2" />
            <Skeleton className="mt-4 h-4 w-28" />
          </div>
        ))}
      </div>
    </section>
  );
}

function TraditionsSkeleton() {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <Skeleton key={index} className="h-[118px] rounded-2xl" />
      ))}
    </div>
  );
}
