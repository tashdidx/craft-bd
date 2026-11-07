import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ARTISAN_SORT_OPTIONS,
  countActiveArtisanFilters,
  type ArtisanDirectoryFilters,
} from "@/lib/artisans";
import type { ArtisanDirectoryFacets } from "@/types/domain";

interface ArtisanFiltersProps {
  filters: ArtisanDirectoryFilters;
  facets: ArtisanDirectoryFacets;
}

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground";

export function ArtisanFilters({ filters, facets }: ArtisanFiltersProps) {
  const activeCount = countActiveArtisanFilters(filters);

  return (
    <form
      method="get"
      action="/artisans"
      className="rounded-3xl border border-border bg-card p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg">
            <SlidersHorizontal
              aria-hidden="true"
              className="size-4 text-primary"
              strokeWidth={1.8}
            />
            Find a studio
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {activeCount > 0
              ? `${activeCount} active filter${activeCount === 1 ? "" : "s"}`
              : "Search by name, craft, or place"}
          </p>
        </div>
        {activeCount > 0 ? (
          <Link
            href="/artisans"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Clear all
          </Link>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_auto] md:items-end">
        <label className="block">
          <span className={labelClass}>Search</span>
          <span className="relative mt-1.5 block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.8}
            />
            <input
              type="search"
              name="q"
              defaultValue={filters.q}
              maxLength={80}
              placeholder="Name, studio, craft, district"
              className={`${fieldClass} pl-9`}
            />
          </span>
        </label>

        <label className="block">
          <span className={labelClass}>Craft tradition</span>
          <select
            name="craft"
            defaultValue={filters.craft ?? ""}
            className={`${fieldClass} mt-1.5`}
          >
            <option value="">All crafts</option>
            {facets.crafts.map((craft) => (
              <option key={craft.slug} value={craft.slug}>
                {craft.name} ({craft.count})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Region</span>
          <select
            name="region"
            defaultValue={filters.region ?? ""}
            className={`${fieldClass} mt-1.5`}
          >
            <option value="">All regions</option>
            {facets.regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label} ({region.count})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Sort</span>
          <select
            name="sort"
            defaultValue={filters.sort}
            className={`${fieldClass} mt-1.5`}
          >
            {ARTISAN_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" className="h-11">
          Show studios
        </Button>
      </div>
    </form>
  );
}
