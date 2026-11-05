import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  catalogueHref,
  getPageWindow,
  type CatalogueFilters,
} from "@/lib/catalogue";
import { cn } from "@/lib/utils";

interface PaginationProps {
  filters: CatalogueFilters;
  page: number;
  pageCount: number;
}

const baseLink =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors";

export function Pagination({ filters, page, pageCount }: PaginationProps) {
  if (pageCount <= 1) return null;

  const window = getPageWindow(page, pageCount);

  return (
    <nav
      aria-label="Catalogue pages"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={catalogueHref(filters, { page: page - 1 })}
          className={cn(baseLink, "border-border bg-card hover:border-primary/40")}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span
          className={cn(baseLink, "border-border/60 text-muted-foreground/40")}
          aria-hidden="true"
        >
          <ChevronLeft className="size-4" />
        </span>
      )}

      {window.map((value, index) =>
        value === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={value}
            href={catalogueHref(filters, { page: value })}
            aria-current={value === page ? "page" : undefined}
            className={cn(
              baseLink,
              value === page
                ? "border-primary bg-primary font-semibold text-primary-foreground"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            {value}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link
          href={catalogueHref(filters, { page: page + 1 })}
          className={cn(baseLink, "border-border bg-card hover:border-primary/40")}
          aria-label="Next page"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span
          className={cn(baseLink, "border-border/60 text-muted-foreground/40")}
          aria-hidden="true"
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
