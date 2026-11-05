import Link from "next/link";
import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PRICE_BANDS,
  catalogueHref,
  countActiveCatalogueFilters,
  type CatalogueFilters,
} from "@/lib/catalogue";
import { formatBdt } from "@/lib/format";
import type { CatalogueFacets } from "@/types/domain";

interface FilterPanelProps {
  facets: CatalogueFacets;
  filters: CatalogueFilters;
}

function FacetGroup({
  legend,
  children,
  className,
}: {
  legend: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {legend}
      </legend>
      <div className="mt-3 space-y-0.5">{children}</div>
    </fieldset>
  );
}

function FacetCheckbox({
  name,
  value,
  label,
  count,
  checked,
}: {
  name: string;
  value: string;
  label: string;
  count: number;
  checked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-secondary/70">
      <span className="flex min-w-0 items-center gap-2">
        <input
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={checked}
          className="size-4 shrink-0 rounded border-border accent-primary"
        />
        <span className="truncate">{label}</span>
      </span>
      <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
    </label>
  );
}

export function FilterPanel({ facets, filters }: FilterPanelProps) {
  const activeCount = countActiveCatalogueFilters(filters);

  return (
    <form
      method="get"
      action="/products"
      className="rounded-3xl border border-border bg-card p-5"
    >
      {filters.sort !== "featured" ? (
        <input type="hidden" name="sort" value={filters.sort} />
      ) : null}

      <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg">
            <SlidersHorizontal
              aria-hidden="true"
              className="size-4 text-primary"
              strokeWidth={1.8}
            />
            Filters
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {activeCount > 0
              ? `${activeCount} active filter${activeCount === 1 ? "" : "s"}`
              : "Narrow by place, material, and price"}
          </p>
        </div>
        {activeCount > 0 ? (
          <Link
            href="/products"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Clear all
          </Link>
        ) : null}
      </div>

      <div className="mt-5 space-y-7">
        <fieldset>
          <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Price
          </legend>
          <div className="mt-3 flex items-center gap-2">
            <label className="flex-1">
              <span className="sr-only">Minimum price</span>
              <input
                type="number"
                name="min"
                min={0}
                inputMode="numeric"
                placeholder={String(facets.price.min)}
                defaultValue={filters.minPrice}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <span className="text-muted-foreground">–</span>
            <label className="flex-1">
              <span className="sr-only">Maximum price</span>
              <input
                type="number"
                name="max"
                min={0}
                inputMode="numeric"
                placeholder={String(facets.price.max)}
                defaultValue={filters.maxPrice}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Catalogue range: {formatBdt(facets.price.min)} –{" "}
            {formatBdt(facets.price.max)}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PRICE_BANDS.map((band) => {
              const isActive =
                filters.minPrice === band.minPrice &&
                filters.maxPrice === band.maxPrice;

              return (
                <Link
                  key={band.label}
                  href={catalogueHref(filters, {
                    minPrice: band.minPrice,
                    maxPrice: band.maxPrice,
                  })}
                  className={
                    isActive
                      ? "rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground"
                      : "rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  }
                >
                  {band.label}
                </Link>
              );
            })}
          </div>
        </fieldset>

        <FacetGroup legend="Craft tradition">
          {facets.categories.map((category) => (
            <FacetCheckbox
              key={category.id}
              name="category"
              value={category.slug}
              label={category.name}
              count={category.count}
              checked={filters.categories.includes(category.slug)}
            />
          ))}
        </FacetGroup>

        <FacetGroup legend="Region">
          {facets.regions.map((region) => (
            <FacetCheckbox
              key={region.value}
              name="region"
              value={region.value}
              label={region.label}
              count={region.count}
              checked={filters.regions.includes(region.value)}
            />
          ))}
        </FacetGroup>

        <FacetGroup legend="Material">
          <div className="max-h-56 space-y-0.5 overflow-y-auto pr-1">
            {facets.materials.map((material) => (
              <FacetCheckbox
                key={material.value}
                name="material"
                value={material.value}
                label={material.label}
                count={material.count}
                checked={filters.materials.includes(material.value)}
              />
            ))}
          </div>
        </FacetGroup>

        <FacetGroup legend="Occasion">
          {facets.occasions.slice(0, 8).map((occasion) => (
            <FacetCheckbox
              key={occasion.value}
              name="occasion"
              value={occasion.value}
              label={occasion.label}
              count={occasion.count}
              checked={filters.occasions.includes(occasion.value)}
            />
          ))}
        </FacetGroup>
      </div>

      <Button type="submit" className="mt-6 w-full">
        Apply filters
      </Button>
    </form>
  );
}
