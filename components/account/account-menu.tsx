import Link from "next/link";
import {
  ChevronDown,
  Heart,
  LogOut,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { displayNameFor, getCurrentUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/constants";

export async function AccountMenu() {
  const current = await getCurrentUser();

  if (!current) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">
          <UserRound aria-hidden="true" className="size-4" strokeWidth={1.8} />
          <span className="hidden sm:inline">Sign in</span>
          <span className="sr-only sm:hidden">Sign in</span>
        </Link>
      </Button>
    );
  }

  const name = displayNameFor(current);
  const firstName = name.split(/\s+/)[0] ?? name;
  const initial = name.charAt(0).toUpperCase();
  const role = current.profile?.role ?? "customer";

  return (
    <details className="group relative">
      <summary
        aria-label="Open account menu"
        className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-2.5 transition-colors hover:border-primary/40 [&::-webkit-details-marker]:hidden"
      >
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
          {initial}
        </span>
        <span className="hidden max-w-24 truncate text-sm font-medium sm:inline">
          {firstName}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          strokeWidth={1.8}
        />
      </summary>

      <div className="absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-[0_20px_60px_-30px_rgba(43,33,25,0.5)]">
        <div className="border-b border-border px-3 pb-3 pt-2">
          <p className="truncate text-sm font-medium">{name}</p>
          {current.user.email ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {current.user.email}
            </p>
          ) : null}
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {ROLE_LABELS[role]}
          </p>
        </div>

        <Link
          href="/account"
          className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <UserRound aria-hidden="true" className="size-4" strokeWidth={1.7} />
          Your account
        </Link>

        <Link
          href="/account/orders"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Package aria-hidden="true" className="size-4" strokeWidth={1.7} />
          Orders
        </Link>

        <Link
          href="/account/wishlist"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Heart aria-hidden="true" className="size-4" strokeWidth={1.7} />
          Wishlist
        </Link>

        <Link
          href="/cart"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ShoppingBag aria-hidden="true" className="size-4" strokeWidth={1.7} />
          Cart
        </Link>

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut aria-hidden="true" className="size-4" strokeWidth={1.7} />
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}

export function AccountMenuSkeleton() {
  return (
    <span className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-2.5">
      <span className="size-6 animate-pulse rounded-full bg-muted" />
      <span className="hidden h-3 w-14 animate-pulse rounded bg-muted sm:block" />
    </span>
  );
}
