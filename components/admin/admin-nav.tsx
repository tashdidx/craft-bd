"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Back office"
      className="flex flex-wrap items-center gap-1 rounded-3xl border border-border bg-card p-2"
    >
      <span className="mr-1 inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
        <ShieldCheck aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
        Back office
      </span>
      {ADMIN_NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-2 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
