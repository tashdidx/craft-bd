import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { CheckoutForm } from "@/components/commerce/checkout-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { displayNameFor, requireUser } from "@/lib/auth";
import { getCart } from "@/lib/data/cart";
import { getDefaultAddress } from "@/lib/data/orders";
import { formatBdt } from "@/lib/format";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm the delivery details for your Craft BD order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}

async function CheckoutContent() {
  const current = await requireUser("/checkout");
  const cart = await getCart();

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-6">
        <div className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <ShoppingBag
              aria-hidden="true"
              className="size-6"
              strokeWidth={1.5}
            />
          </span>
          <h1 className="mt-5 text-3xl">Nothing to check out yet</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Add a piece to your cart first. Cart items are held against your
            account.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse the catalogue</Link>
          </Button>
        </div>
      </div>
    );
  }

  const defaults = await getDefaultAddress(current.user.id, {
    name: displayNameFor(current),
    phone: current.profile?.phone ?? "",
  });
  const stockWarning = cart.items.some(
    (item) => item.stockQuantity <= 0 || item.quantity > item.stockQuantity,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        Back to cart
      </Link>

      <header className="mt-5 border-b border-border pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          Checkout
        </p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">
          Where should it travel?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Review the cart below, add the delivery details, and place the order.
          Payment is collected on delivery.
        </p>
      </header>

      {stockWarning ? (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          One or more cart pieces are out of stock.{" "}
          <Link href="/cart" className="font-medium underline underline-offset-4">
            Review your cart
          </Link>{" "}
          before placing the order.
        </p>
      ) : null}

      <div className="mt-8">
        <CheckoutForm
          defaults={defaults}
          summary={{
            itemCount: cart.itemCount,
            subtotalBdt: cart.subtotalBdt,
            shippingBdt: cart.shippingBdt,
            giftWrapBdt: cart.giftWrapBdt,
            totalBdt: cart.totalBdt,
          }}
        />
      </div>

      <p className="mt-6 text-xs leading-5 text-muted-foreground">
        Items total {formatBdt(cart.subtotalBdt)} across{" "}
        {cart.itemCount} {cart.itemCount === 1 ? "piece" : "pieces"}. Cash on
        delivery only — no card details are collected.
      </p>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-11 w-80 max-w-full" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="h-[640px] rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}
