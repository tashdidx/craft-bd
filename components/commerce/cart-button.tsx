import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCartCount } from "@/lib/data/cart";

export async function CartButton() {
  const count = await getCartCount();

  return (
    <Link
      href="/cart"
      aria-label={
        count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"
      }
      className="relative grid size-10 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ShoppingBag aria-hidden="true" className="size-4" strokeWidth={1.8} />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-5 text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

export function CartButtonSkeleton() {
  return (
    <span className="grid size-10 place-items-center rounded-full border border-border bg-card">
      <span className="size-4 animate-pulse rounded bg-muted" />
    </span>
  );
}
