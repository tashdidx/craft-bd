import Link from "next/link";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import {
  CATALOGUE_SORT_OPTIONS,
  catalogueHref,
  type CatalogueFilters,
} from "@/lib/catalogue";
import { cn } from "@/lib/utils";

export function SortMenu({ filters }: { filters: CatalogueFilters }) {
  const current =
    CATALOGUE_SORT_OPTIONS.find((option) => option.value === filters.sort) ??
    CATALOGUE_SORT_OPTIONS[0];

  return (
    <details className="group relative">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-4 text-sm transition-colors hover:border-primary/40 [&::-webkit-details-marker]:hidden">
        <ArrowUpDown
          aria-hidden="true"
          className="size-3.5 text-muted-foreground"
          strokeWidth={1.8}
        />
        <span className="text-muted-foreground">Sort:</span>
        <span className="font-medium">{current.label}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 text-muted-foreground transition-transform group-open:rotate-180"
          strokeWidth={1.8}
        />
      </summary>

      <div className="absolute right-0 z-30 mt-2 w-60 rounded-2xl border border-border bg-card p-2 shadow-[0_20px_60px_-30px_rgba(43,33,25,0.5)]">
        <ul className="space-y-0.5">
          {CATALOGUE_SORT_OPTIONS.map((option) => {
            const isActive = option.value === filters.sort;

            return (
              <li key={option.value}>
                <Link
                  href={catalogueHref(filters, { sort: option.value })}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary",
                    isActive
                      ? "bg-secondary/70 font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {option.label}
                  {isActive ? (
                    <Check
                      aria-hidden="true"
                      className="size-4 text-primary"
                      strokeWidth={2}
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
