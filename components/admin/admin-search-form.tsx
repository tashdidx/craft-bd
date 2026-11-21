import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSearchForm({
  basePath,
  status,
  q,
  placeholder,
}: {
  basePath: string;
  status: string;
  q: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={basePath} method="get" className="flex items-center gap-2">
        {status !== "all" ? (
          <input type="hidden" name="status" value={status} />
        ) : null}
        <label className="relative block">
          <span className="sr-only">Search</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.8}
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            maxLength={80}
            placeholder={placeholder}
            className="h-10 w-64 rounded-full border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <Button type="submit" variant="outline" size="sm" className="h-10">
          Search
        </Button>
      </form>
      {q ? (
        <Link
          href={status === "all" ? basePath : `${basePath}?status=${status}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          Clear
        </Link>
      ) : null}
    </div>
  );
}
