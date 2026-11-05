import Link from "next/link";
import { X } from "lucide-react";
import {
  getActiveCatalogueFilters,
  type CatalogueFilters,
} from "@/lib/catalogue";

export function ActiveFilters({ filters }: { filters: CatalogueFilters }) {
  const active = getActiveCatalogueFilters(filters);

  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Active
      </span>
      {active.map((filter) => (
        <Link
          key={filter.key}
          href={filter.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
        >
          {filter.label}
          <X aria-hidden="true" className="size-3" strokeWidth={2} />
          <span className="sr-only">Remove filter</span>
        </Link>
      ))}
      <Link
        href="/products"
        className="ml-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        Clear all
      </Link>
    </div>
  );
}
