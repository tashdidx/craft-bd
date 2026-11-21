import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

export function AdminStatCard({
  label,
  value,
  detail,
  href,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.7} />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
          strokeWidth={1.8}
        />
      </div>
      <p className="mt-4 text-3xl font-semibold leading-none">{value}</p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </Link>
  );
}
