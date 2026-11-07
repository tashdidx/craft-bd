import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Hammer,
  Languages,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ArtisanDirectoryCard } from "@/components/artisan/artisan-directory-card";
import { ArtisanProfileSkeleton } from "@/components/artisan/artisan-skeletons";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DIVISION_LABELS } from "@/lib/constants";
import { getArtisanDetail, getRelatedArtisans } from "@/lib/data/artisans";
import { formatNumber } from "@/lib/format";

interface ArtisanPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArtisanPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getArtisanDetail(slug);

  if (!detail) {
    return {
      title: "Studio not found",
      robots: { index: false, follow: false },
    };
  }

  const { artisan } = detail;
  const description =
    artisan.biography.length > 158
      ? `${artisan.biography.slice(0, 155).trimEnd()}…`
      : artisan.biography;

  return {
    title: `${artisan.display_name} — ${artisan.craft_specialization}`,
    description,
    openGraph: {
      title: artisan.display_name,
      description,
      type: "website",
      images: artisan.cover_image_url
        ? [{ url: artisan.cover_image_url, alt: `${artisan.craft_specialization} studio` }]
        : artisan.avatar_url
          ? [{ url: artisan.avatar_url, alt: `Portrait of ${artisan.display_name}` }]
          : undefined,
    },
  };
}

export default function ArtisanPage({ params }: ArtisanPageProps) {
  return (
    <Suspense fallback={<ArtisanProfileSkeleton />}>
      <ArtisanContent params={params} />
    </Suspense>
  );
}

async function ArtisanContent({ params }: ArtisanPageProps) {
  const { slug } = await params;
  const detail = await getArtisanDetail(slug);

  if (!detail) notFound();

  const { artisan, primaryCategory, products, ratingAverage, reviewCount } =
    detail;
  const related = await getRelatedArtisans({
    slug: artisan.slug,
    primaryCategory,
    region: artisan.region,
  });
  const initial = artisan.display_name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 py-6 text-xs text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/artisans"
          className="transition-colors hover:text-foreground"
        >
          Artisan studios
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{artisan.display_name}</span>
      </nav>

      <header className="overflow-hidden rounded-[2rem] border border-border bg-card">
        <div className="relative h-52 bg-accent sm:h-72">
          {artisan.cover_image_url ? (
            <Image
              src={artisan.cover_image_url}
              alt={`${artisan.craft_specialization} work from ${artisan.display_name}`}
              fill
              priority
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-cover"
            />
          ) : null}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#171310]/75 via-[#171310]/20 to-transparent"
          />
          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
            {artisan.is_featured ? <Badge>Featured studio</Badge> : null}
            <Badge variant="success" className="bg-emerald-50/95 text-emerald-900">
              <BadgeCheck aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
              Verified studio
            </Badge>
          </div>
        </div>

        <div className="relative px-6 pb-7 sm:px-9">
          <div className="-mt-12 flex flex-wrap items-end gap-5">
            {artisan.avatar_url ? (
              <Image
                src={artisan.avatar_url}
                alt={`Portrait of ${artisan.display_name}`}
                width={112}
                height={112}
                className="size-24 shrink-0 rounded-full border-4 border-card object-cover sm:size-28"
              />
            ) : (
              <span className="grid size-24 shrink-0 place-items-center rounded-full border-4 border-card bg-secondary font-display text-3xl text-secondary-foreground sm:size-28">
                {initial}
              </span>
            )}

            <div className="min-w-0 pb-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {primaryCategory?.name ?? "Artisan studio"}
              </p>
              <h1 className="mt-1 text-3xl leading-tight sm:text-4xl">
                {artisan.display_name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {artisan.workshop_name ?? artisan.craft_specialization}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">
            {artisan.craft_specialization} in {artisan.district},{" "}
            {DIVISION_LABELS[artisan.region]}.{" "}
            {artisan.years_of_experience} years at the craft, and{" "}
            {detail.productCount}{" "}
            {detail.productCount === 1 ? "piece" : "pieces"} currently in the
            catalogue.
          </p>

          <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Hammer aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
                Craft
              </dt>
              <dd className="mt-1 text-sm">
                {primaryCategory ? (
                  <Link
                    href={`/artisans?craft=${primaryCategory.slug}`}
                    className="underline-offset-4 hover:text-primary hover:underline"
                  >
                    {primaryCategory.name}
                  </Link>
                ) : (
                  artisan.craft_specialization
                )}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
                Location
              </dt>
              <dd className="mt-1 text-sm">
                <Link
                  href={`/artisans?region=${artisan.region}`}
                  className="underline-offset-4 hover:text-primary hover:underline"
                >
                  {artisan.district}, {DIVISION_LABELS[artisan.region]}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Sparkles aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
                Experience
              </dt>
              <dd className="mt-1 text-sm">
                {artisan.years_of_experience} years
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Languages aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
                Speaks
              </dt>
              <dd className="mt-1 text-sm">{artisan.languages.join(", ")}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-3xl border border-border bg-card p-7 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            The studio
          </p>
          <h2 className="mt-3 text-2xl leading-tight sm:text-3xl">
            Working with {artisan.craft_specialization.toLowerCase()} in{" "}
            {artisan.district}.
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {artisan.biography}
          </p>
        </article>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl leading-tight">Studio facts</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Workshop</dt>
                <dd className="text-right font-medium">
                  {artisan.workshop_name ?? "Independent studio"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Based in</dt>
                <dd className="text-right font-medium">
                  {artisan.district}, {DIVISION_LABELS[artisan.region]}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Pieces</dt>
                <dd className="text-right font-medium">
                  {formatNumber(detail.productCount)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Reviews</dt>
                <dd className="text-right">
                  <StarRating value={ratingAverage} count={reviewCount} />
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-accent p-6 text-accent-foreground">
            <ShieldCheck
              aria-hidden="true"
              className="size-5 text-accent-foreground/70"
              strokeWidth={1.7}
            />
            <h2 className="mt-3 text-xl leading-tight">
              Every piece carries its record.
            </h2>
            <p className="mt-2 text-sm leading-6 text-accent-foreground/70">
              Maker, origin, materials, production stages, and a certificate
              code are attached to every published product.
            </p>
            <Link
              href="/verify"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              How verification works
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </aside>
      </section>

      <section id="pieces" className="mt-14 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              From this studio
            </p>
            <h2 className="mt-2 text-3xl leading-tight sm:text-4xl">
              Pieces by {artisan.display_name}.
            </h2>
          </div>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Package aria-hidden="true" className="size-4" strokeWidth={1.8} />
            {formatNumber(detail.productCount)}{" "}
            {detail.productCount === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-7 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
            <p className="text-lg font-medium">No published pieces yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              This studio does not have a published piece in the catalogue right
              now. Browse the full catalogue for work from other makers.
            </p>
            <Button asChild className="mt-6">
              <Link href="/products">Browse the catalogue</Link>
            </Button>
          </div>
        )}
      </section>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-border pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                More makers
              </p>
              <h2 className="mt-2 text-3xl leading-tight sm:text-4xl">
                Other studios to follow.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/artisans">
                All artisan studios
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((artisan) => (
              <ArtisanDirectoryCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-12">
          <Button asChild variant="outline">
            <Link href="/artisans">
              <ArrowLeft aria-hidden="true" className="size-4" />
              All artisan studios
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
