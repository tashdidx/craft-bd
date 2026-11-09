import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { WishlistToggle } from "@/components/commerce/wishlist-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";
import { getWishlist } from "@/lib/data/wishlist";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "Pieces saved to your Craft BD account.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistSkeleton />}>
      <WishlistContent />
    </Suspense>
  );
}

async function WishlistContent() {
  await requireUser("/account/wishlist");
  const entries = await getWishlist();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        Back to account
      </Link>

      <header className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Your account
          </p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Wishlist</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Saved pieces stay here while they are published. Remove one with the
            heart, or open it to add it to the cart.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {entries.length} {entries.length === 1 ? "piece" : "pieces"}
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Heart aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 text-2xl">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Use “Save to wishlist” on a piece to keep it here for later.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">
              Browse the catalogue
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map(({ product }) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="absolute bottom-3 right-3 z-10">
                <WishlistToggle
                  productId={product.id}
                  active
                  nextPath="/account/wishlist"
                  showLabel={false}
                  size="icon"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-11 w-52" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[420px] rounded-3xl" />
        <Skeleton className="h-[420px] rounded-3xl" />
        <Skeleton className="h-[420px] rounded-3xl" />
      </div>
    </div>
  );
}
