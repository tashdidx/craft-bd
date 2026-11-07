import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Hammer, Languages, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DIVISION_LABELS } from "@/lib/constants";
import type { Artisan } from "@/types/domain";

export function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const initial = artisan.display_name.charAt(0).toUpperCase();

  return (
    <article className="group rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
      <div className="flex flex-wrap items-start gap-4">
        {artisan.avatar_url ? (
          <Image
            src={artisan.avatar_url}
            alt={`Portrait of ${artisan.display_name}`}
            width={88}
            height={88}
            className="size-20 rounded-full border border-border object-cover"
          />
        ) : (
          <span className="grid size-20 place-items-center rounded-full bg-secondary font-display text-2xl text-secondary-foreground">
            {initial}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            The maker
          </p>
          <h3 className="mt-1 text-2xl leading-tight">{artisan.display_name}</h3>
          {artisan.workshop_name ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {artisan.workshop_name}
            </p>
          ) : null}
          {artisan.status === "approved" ? (
            <Badge variant="success" className="mt-3">
              Verified studio
            </Badge>
          ) : null}
        </div>
      </div>

      <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Craft
          </dt>
          <dd className="mt-1 inline-flex items-start gap-2 text-sm">
            <Hammer
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
              strokeWidth={1.6}
            />
            {artisan.craft_specialization}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Studio
          </dt>
          <dd className="mt-1 inline-flex items-start gap-2 text-sm">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
              strokeWidth={1.6}
            />
            {artisan.district}, {DIVISION_LABELS[artisan.region]}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Experience
          </dt>
          <dd className="mt-1 inline-flex items-start gap-2 text-sm">
            <Sparkles
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
              strokeWidth={1.6}
            />
            {artisan.years_of_experience} years at the craft
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Speaks
          </dt>
          <dd className="mt-1 inline-flex items-start gap-2 text-sm">
            <Languages
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
              strokeWidth={1.6}
            />
            {artisan.languages.join(", ")}
          </dd>
        </div>
      </dl>

      <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
        {artisan.biography}
      </p>

      <Link
        href={`/artisans/${artisan.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        Visit {artisan.display_name.split(" ")[0]}&rsquo;s studio profile
        <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.8} />
      </Link>
    </article>
  );
}
