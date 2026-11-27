import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import {
  AccountMenu,
  AccountMenuSkeleton,
} from "@/components/account/account-menu";
import {
  CartButton,
  CartButtonSkeleton,
} from "@/components/commerce/cart-button";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

const navigation = [
  { href: "/artisans", label: "Artisans", primary: true, compact: false },
  { href: "/gifts", label: "Gifts", primary: true, compact: true },
  { href: "/verify", label: "Verify", primary: true, compact: true },
  {
    href: "/custom-orders",
    label: "Custom orders",
    primary: false,
    compact: false,
  },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header z-40 px-3 pt-3 pb-2 sm:px-5 sm:pt-4 print:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-border/80 bg-background/80 px-3 py-2.5 shadow-[0_18px_50px_-32px_rgba(43,33,25,0.55)] ring-1 ring-white/60 ring-inset backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3 ">
          <Image
            src="/brand/craft-bd-logo2.jpeg"
            alt=""
            width={98}
            height={98}
            priority
            className="size-16 shrink-0 rounded-full object-cover ring-1 ring-border/70 sm:size-12"
          />
          <span className="hidden sm:block">
            <span className="block font-display text-lg leading-none">
              {SITE.name}
            </span>
            <span className="mt-1 hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
              Bangladeshi handicrafts
            </span>
          </span>
          <span className="sr-only sm:hidden">
            {SITE.name} — Bangladeshi handicrafts
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm sm:gap-4 lg:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.primary
                  ? item.compact
                    ? "hidden font-medium text-foreground transition-colors hover:text-primary md:inline"
                    : "font-medium text-foreground transition-colors hover:text-primary"
                  : "hidden font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline"
              }
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/products">
              Browse pieces
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <Suspense fallback={<CartButtonSkeleton />}>
            <CartButton />
          </Suspense>
          <Suspense fallback={<AccountMenuSkeleton />}>
            <AccountMenu />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
