import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Hammer, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DIVISION_LABELS } from "@/lib/constants";
import type { ArtisanDirectoryEntry } from "@/types/domain";

export function ArtisanDirectoryCard({
  artisan,
}: {
  artisan: ArtisanDirectoryEntry;
}) {
  const initial = artisan.displayName.charAt(0).toUpperCase();

  return (
    <Link
      href={`/artisans/${artisan.slug}`}
      className="group block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors group-hover:border-primary/40">
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
          {artisan.coverImageUrl ? (
            <Image
              src={artisan.coverImageUrl}
              alt={`${artisan.craftSpecialization} work from ${artisan.displayName}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full place-items-center text-muted-foreground">
              <Hammer aria-hidden="true" className="size-8" strokeWidth={1.4} />
            </div>
          )}

          {artisan.isFeatured ? (
            <Badge className="absolute top-3 left-3 shadow-sm">
              Featured studio
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5">
          <div className="relative">
            {artisan.avatarUrl ? (
              <Image
                src={artisan.avatarUrl}
                alt={`Portrait of ${artisan.displayName}`}
                width={72}
                height={72}
                className="absolute -top-10 left-0 z-10 size-16 rounded-full border-4 border-card object-cover"
              />
            ) : (
              <span className="absolute -top-10 left-0 z-10 grid size-16 place-items-center rounded-full border-4 border-card bg-secondary font-display text-xl text-secondary-foreground">
                {initial}
              </span>
            )}

            <div className="min-w-0 pt-1 pl-20">
              <h3 className="truncate text-lg leading-snug transition-colors group-hover:text-primary">
                {artisan.displayName}
              </h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {artisan.workshopName ?? artisan.craftSpecialization}
              </p>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {artisan.biography || artisan.craftSpecialization}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
            <div>
              <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Hammer aria-hidden="true" className="size-3" strokeWidth={1.8} />
                Craft
              </dt>
              <dd className="mt-1 truncate">{artisan.craftSpecialization}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <MapPin aria-hidden="true" className="size-3" strokeWidth={1.8} />
                Based in
              </dt>
              <dd className="mt-1 truncate">
                {artisan.district}, {DIVISION_LABELS[artisan.region]}
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Package aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
              {artisan.productCount}{" "}
              {artisan.productCount === 1 ? "piece" : "pieces"}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-primary">
              Visit studio
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
