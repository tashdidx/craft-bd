import Image from "next/image";
import Link from "next/link";
import { ImageOff, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { formatBdt } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/types/domain";

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discount =
    product.compareAtPriceBdt && product.compareAtPriceBdt > product.priceBdt
      ? Math.round(
          ((product.compareAtPriceBdt - product.priceBdt) /
            product.compareAtPriceBdt) *
            100,
        )
      : null;

  return (
    <article className={cn("group", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-secondary">
          {product.primaryImage ? (
            <Image
              src={product.primaryImage.url}
              alt={product.primaryImage.alt_text}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full place-items-center gap-2 text-muted-foreground">
              <ImageOff aria-hidden="true" className="size-8" strokeWidth={1.4} />
              <span className="text-xs">Image coming soon</span>
            </div>
          )}

          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            {product.isFeatured ? (
              <Badge className="shadow-sm">Featured</Badge>
            ) : (
              <span />
            )}
            {product.stockQuantity === 0 ? (
              <Badge variant="warning">Sold out</Badge>
            ) : product.stockQuantity <= 3 ? (
              <Badge variant="warning">Only {product.stockQuantity} left</Badge>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span>{product.category?.name ?? "Handcrafted"}</span>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal">
              <MapPin aria-hidden="true" className="size-3" strokeWidth={1.6} />
              {product.artisan?.district ?? product.region}
            </span>
          </div>

          <h3 className="mt-2 text-lg leading-snug transition-colors group-hover:text-primary">
            {product.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {product.artisan?.display_name ?? "Craft BD artisan"}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold">
                {formatBdt(product.priceBdt)}
              </span>
              {product.compareAtPriceBdt &&
              product.compareAtPriceBdt > product.priceBdt ? (
                <span className="text-xs text-muted-foreground line-through">
                  {formatBdt(product.compareAtPriceBdt)}
                </span>
              ) : null}
            </div>
            <StarRating
              value={product.ratingAverage}
              count={product.reviewCount}
            />
          </div>

          {discount !== null ? (
            <p className="mt-1 text-xs font-medium text-primary">
              {discount}% below the studio price
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
