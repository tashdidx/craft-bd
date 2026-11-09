import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  BadgeCheck,
  Gift,
  HeartHandshake,
  Leaf,
  MapPin,
  Package,
  Ruler,
  Truck,
  Weight,
  type LucideIcon,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { AddToCartForm } from "@/components/commerce/add-to-cart-form";
import { WishlistToggle } from "@/components/commerce/wishlist-toggle";
import { ArtisanCard } from "@/components/product/artisan-card";
import { CertificateCard } from "@/components/product/certificate-card";
import { ProductDetailSkeleton } from "@/components/product/product-detail-skeleton";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductJourney } from "@/components/product/product-journey";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DIVISION_LABELS } from "@/lib/constants";
import { getProductDetail, getRelatedProducts } from "@/lib/data/catalogue";
import { getWishlistProductIds } from "@/lib/data/wishlist";
import { formatBdt, formatWeight } from "@/lib/format";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProductDetail(slug);

  if (!detail) {
    return { title: "Piece not found" };
  }

  const image = detail.images[0];

  return {
    title: detail.product.title,
    description: detail.product.short_description,
    openGraph: {
      title: detail.product.title,
      description: detail.product.short_description,
      type: "website",
      images: image ? [{ url: image.url, alt: image.alt_text }] : undefined,
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: ProductPageProps) {
  const { slug } = await params;
  const detail = await getProductDetail(slug);

  if (!detail) notFound();

  const { product, category, artisan, images, story, journey, certificate } =
    detail;
  const related = category
    ? await getRelatedProducts(category.id, product.id)
    : [];
  const wishlisted = (await getWishlistProductIds()).has(product.id);
  const discount =
    product.compare_at_price_bdt &&
    product.compare_at_price_bdt > product.price_bdt
      ? Math.round(
          ((product.compare_at_price_bdt - product.price_bdt) /
            product.compare_at_price_bdt) *
            100,
        )
      : null;

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
          href="/products"
          className="transition-colors hover:text-foreground"
        >
          Catalogue
        </Link>
        <span aria-hidden="true">/</span>
        <span className="max-w-[220px] truncate text-foreground sm:max-w-none">
          {product.title}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <ProductGallery
          images={images.map((image) => ({
            id: image.id,
            url: image.url,
            alt_text: image.alt_text,
          }))}
          title={product.title}
          isFeatured={product.is_featured}
        />

        <div>
          <div className="flex flex-wrap gap-2">
            {category ? (
              <Badge variant="secondary">{category.name}</Badge>
            ) : null}
            <Badge variant="outline">
              <MapPin aria-hidden="true" className="size-3" strokeWidth={1.8} />
              {DIVISION_LABELS[product.region]}
            </Badge>
            {product.stock_quantity === 0 ? (
              <Badge variant="warning">Sold out</Badge>
            ) : null}
          </div>

          <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl">
            {product.title}
          </h1>

          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            {product.short_description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StarRating
              value={detail.ratingAverage}
              count={detail.reviewCount}
              size="md"
            />
            {detail.reviewCount > 0 ? (
              <span className="text-xs text-muted-foreground">
                Verified customer ratings only
              </span>
            ) : null}
          </div>

          <div className="mt-7 rounded-3xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-semibold">
                {formatBdt(product.price_bdt)}
              </span>
              {product.compare_at_price_bdt &&
              product.compare_at_price_bdt > product.price_bdt ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatBdt(product.compare_at_price_bdt)}
                </span>
              ) : null}
              {discount !== null ? (
                <Badge variant="secondary">{discount}% below studio price</Badge>
              ) : null}
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Price is set by the artisan studio. Every piece ships with its
              provenance record and care notes.
            </p>

            <div className="mt-5 border-t border-border pt-5">
              <AddToCartForm
                productId={product.id}
                stockQuantity={product.stock_quantity}
                giftWrapAvailable={product.gift_wrap_available}
                nextPath={`/products/${product.slug}`}
              />
              <div className="mt-3">
                <WishlistToggle
                  productId={product.id}
                  active={wishlisted}
                  nextPath={`/products/${product.slug}`}
                />
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-7 grid gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-2">
            <DetailRow
              icon={Leaf}
              label="Materials"
              value={product.materials.join(", ")}
            />
            <DetailRow
              icon={Ruler}
              label="Dimensions"
              value={product.dimensions ?? "Not listed"}
            />
            <DetailRow
              icon={Weight}
              label="Weight"
              value={formatWeight(product.weight_grams) ?? "Not listed"}
            />
            <DetailRow
              icon={HeartHandshake}
              label="Care"
              value={product.care_instructions ?? "Handle with care"}
            />
          </dl>

          <div className="mt-7 flex flex-wrap gap-2">
            <StockPill stock={product.stock_quantity} />
            {product.gift_wrap_available ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                <Gift aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
                Gift wrapping available
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
              <Truck aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
              Ships from {artisan?.district ?? DIVISION_LABELS[product.region]}
            </span>
          </div>

          {artisan ? (
            <Link
              href={`/artisans/${artisan.slug}`}
              className="group mt-7 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              {artisan.avatar_url ? (
                <Image
                  src={artisan.avatar_url}
                  alt={`Portrait of ${artisan.display_name}`}
                  width={56}
                  height={56}
                  className="size-14 rounded-full border border-border object-cover"
                />
              ) : (
                <span className="grid size-14 place-items-center rounded-full bg-secondary font-display text-lg text-secondary-foreground">
                  {artisan.display_name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Made by
                </p>
                <p className="mt-0.5 truncate font-medium transition-colors group-hover:text-primary">
                  {artisan.display_name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {artisan.workshop_name ?? artisan.craft_specialization}
                </p>
              </div>
              <BadgeCheck
                aria-label="Verified artisan studio"
                className="size-5 shrink-0 text-primary"
                strokeWidth={1.8}
              />
            </Link>
          ) : null}
        </div>
      </div>

      {story ? (
        <section className="mt-16 grid gap-8 rounded-[2rem] border border-border bg-card p-7 sm:p-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              The story
            </p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
              {story.title}
            </h2>
            <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
                strokeWidth={1.6}
              />
              {story.origin}
            </p>

            {story.did_you_know ? (
              <div className="mt-6 rounded-2xl bg-secondary p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
                  Did you know?
                </p>
                <p className="mt-2 text-sm leading-6 text-secondary-foreground">
                  {story.did_you_know}
                </p>
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            <StoryBlock title="History" body={story.history} />
            <StoryBlock
              title="Traditional uses"
              body={story.traditional_uses}
            />
            <StoryBlock
              title="Materials and making"
              body={story.materials_description}
            />
            <StoryBlock title="Cultural meaning" body={story.cultural_meaning} />
          </div>
        </section>
      ) : null}

      {journey.length > 0 ? (
        <section className="mt-16" id="craft-journey">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                The craft journey
              </p>
              <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
                From raw material to certified piece.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Six recorded stages, in the order this studio works. Duration
              labels are the maker&apos;s own estimate.
            </p>
          </div>
          <ProductJourney journey={journey} />
        </section>
      ) : null}

      <section className="mt-16">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {artisan ? <ArtisanCard artisan={artisan} /> : null}
          {certificate ? <CertificateCard certificate={certificate} /> : null}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-border pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                More to explore
              </p>
              <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
                More from {category?.name ?? "the catalogue"}.
              </h2>
            </div>
            {category ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/products?category=${category.slug}`}>
                  See the tradition
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5 text-primary" strokeWidth={1.7} />
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-6">{value}</dd>
    </div>
  );
}

function StockPill({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
        <Package aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
        Currently unavailable
      </span>
    );
  }

  if (stock <= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
        <Package aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
        Only {stock} left in the studio
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
      <Package aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
      {stock} available
    </span>
  );
}

function StoryBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-foreground/85">{body}</p>
    </div>
  );
}
