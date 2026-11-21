import Link from "next/link";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

export function AdminFilterPills({
  basePath,
  param = "status",
  current,
  options,
  q,
}: {
  basePath: string;
  param?: string;
  current: string;
  options: ReadonlyArray<FilterOption>;
  q?: string;
}) {
  return (
    <nav
      aria-label="Filter records"
      className="flex flex-wrap items-center gap-1.5"
    >
      {options.map((option) => {
        const active = current === option.value;
        const params = new URLSearchParams();

        if (option.value !== "all") params.set(param, option.value);
        if (q) params.set("q", q);
        const href = params.size > 0 ? `${basePath}?${params.toString()}` : basePath;

        return (
          <Link
            key={option.value}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
