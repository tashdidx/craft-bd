import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  LogIn,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { CartLine } from "@/components/commerce/cart-line";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/data/cart";
import { FREE_SHIPPING_THRESHOLD_BDT } from "@/lib/constants";
import { formatBdt } from "@/lib/format";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the pieces reserved in your Craft BD cart.",
  robots: { index: false, follow: false },
};

interface CartPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function CartPage({ searchParams }: CartPageProps) {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent searchParams={searchParams} />
    </Suspense>
  );
}

const ERROR_MESSAGES: Record<string, string> = {
  unavailable: "A piece in your cart is no longer available.",
  "sold-out": "That piece has just sold out.",
  "invalid-quantity": "Choose a quantity between 1 and 10.",
  "gift-wrap-unavailable": "Gift wrapping is not available for that piece.",
  "invalid-update": "That cart update was not valid.",
  "missing-item": "That cart item could not be found.",
  "cart-error": "We could not update the cart. Try again in a moment.",
};

async function CartContent({ searchParams }: CartPageProps) {
  const params = await searchParams;
  const [current, cart] = await Promise.all([getCurrentUser(), getCart()]);
  const added = params.added === "1";
  const errorCode = typeof params.error === "string" ? params.error : null;
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD_BDT - cart.subtotalBdt,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          Your selection
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl leading-tight sm:text-5xl">Your cart</h1>
          {cart.itemCount > 0 ? (
            <p className="text-sm text-muted-foreground">
              {cart.itemCount} {cart.itemCount === 1 ? "piece" : "pieces"} ·{" "}
              {formatBdt(cart.subtotalBdt)}
            </p>
          ) : null}
        </div>
      </header>

      {added ? (
        <p
          role="status"
          className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <Sparkles aria-hidden="true" className="size-4" strokeWidth={1.8} />
          Added to your cart.
        </p>
      ) : null}

      {errorMessage ? (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </p>
      ) : null}

      {!current ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <LogIn aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 text-2xl">Sign in to keep a cart</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Craft BD carts are tied to your account so a studio can see who
            reserved a piece. Browse freely without signing in.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login?next=%2Fcart">Sign in to continue</Link>
          </Button>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <ShoppingBag
              aria-hidden="true"
              className="size-6"
              strokeWidth={1.5}
            />
          </span>
          <h2 className="mt-5 text-2xl">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Every piece in the catalogue is made by a named studio. Add
            something that carries its maker with it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/products">
                Browse the catalogue
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/gifts">Try the gift finder</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <section aria-label="Cart items" className="rounded-3xl border border-border bg-card px-5 py-2 sm:px-7">
            {cart.items.map((item) => (
              <CartLine key={item.id} item={item} />
            ))}
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl leading-tight">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatBdt(cart.subtotalBdt)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>
                    {cart.shippingBdt === 0 ? (
                      <span className="text-primary">Free</span>
                    ) : (
                      formatBdt(cart.shippingBdt)
                    )}
                  </dd>
                </div>
                {cart.giftWrapBdt > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">
                      Gift wrapping ({cart.wrappedUnits}{" "}
                      {cart.wrappedUnits === 1 ? "piece" : "pieces"})
                    </dt>
                    <dd>{formatBdt(cart.giftWrapBdt)}</dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatBdt(cart.totalBdt)}</dd>
                </div>
              </dl>

              {remainingForFreeShipping > 0 ? (
                <p className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary px-4 py-3 text-xs leading-5 text-secondary-foreground">
                  <Truck
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0"
                    strokeWidth={1.7}
                  />
                  Add {formatBdt(remainingForFreeShipping)} more for free
                  shipping.
                </p>
              ) : (
                <p className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary px-4 py-3 text-xs leading-5 text-secondary-foreground">
                  <Truck
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0"
                    strokeWidth={1.7}
                  />
                  Free shipping applied.
                </p>
              )}

              <Button asChild className="mt-5 w-full" size="lg">
                <Link href="/checkout">
                  Continue to checkout
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>

              <Link
                href="/products"
                className="mt-4 block text-center text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Continue browsing
              </Link>
            </div>

            <p className="mt-4 px-2 text-xs leading-5 text-muted-foreground">
              Cash on delivery only. Orders are confirmed by the studio before
              dispatch.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-11 w-64 max-w-full" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <Skeleton className="h-[420px] rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}
