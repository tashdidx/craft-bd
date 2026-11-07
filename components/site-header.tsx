import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import {
  AccountMenu,
  AccountMenuSkeleton,
} from "@/components/account/account-menu";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

const navigation = [
  { href: "/products", label: "Catalogue" },
  { href: "/verify", label: "Verify" },
  { href: "/#craft-traditions", label: "Craft traditions" },
  { href: "/#our-promise", label: "Our promise" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur print:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">
            C
          </span>
          <span>
            <span className="block font-display text-lg leading-none">
              {SITE.name}
            </span>
            <span className="mt-1 hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
              Bangladeshi handicrafts
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-sm sm:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.href === "/products" || item.href === "/verify"
                  ? "font-medium text-foreground transition-colors hover:text-primary"
                  : "hidden font-medium text-muted-foreground transition-colors hover:text-foreground md:inline"
              }
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/products">
              Browse pieces
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <Suspense fallback={<AccountMenuSkeleton />}>
            <AccountMenu />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
