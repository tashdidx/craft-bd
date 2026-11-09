import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, ImageOff, Package } from "lucide-react";
import { OrderStatusBadge } from "@/components/commerce/order-status-tracker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";
import { getOrders } from "@/lib/data/orders";
import { formatBdt, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Your orders",
  description: "Track the Craft BD orders placed from your account.",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  await requireUser("/account/orders");
  const orders = await getOrders();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
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
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Orders</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Every order keeps its piece names and studio snapshot, even if the
            catalogue changes later.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Package aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 text-2xl">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            When you place an order, its status tracker and delivery details
            live here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">
              Browse the catalogue
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map(({ order, items }) => {
            const total =
              order.total_bdt ??
              order.subtotal_bdt + order.shipping_bdt + order.gift_wrap_bdt;
            const itemCount = items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            const titles = items
              .map((item) => item.product_title)
              .slice(0, 2)
              .join(" · ");
            const images = items
              .map((item) => item.product_image_url)
              .filter((url): url is string => Boolean(url))
              .slice(0, 3);

            return (
              <li
                key={order.id}
                className="rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/account/orders/${order.order_number}`}
                        className="font-mono text-sm font-semibold transition-colors hover:text-primary"
                      >
                        {order.order_number}
                      </Link>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Placed {formatDate(order.placed_at)} · {itemCount}{" "}
                      {itemCount === 1 ? "piece" : "pieces"}
                    </p>
                  </div>
                  <p className="text-base font-semibold">{formatBdt(total)}</p>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {images.length > 0 ? (
                      images.map((url, index) => (
                        <span
                          key={`${url}-${index}`}
                          className="relative block size-12 overflow-hidden rounded-xl border-2 border-card bg-secondary"
                        >
                          <Image
                            src={url}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                      ))
                    ) : (
                      <span className="grid size-12 place-items-center rounded-xl border border-border bg-secondary text-muted-foreground">
                        <ImageOff
                          aria-hidden="true"
                          className="size-4"
                          strokeWidth={1.5}
                        />
                      </span>
                    )}
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                    {titles || "Order items"}
                    {items.length > 2 ? ` +${items.length - 2} more` : ""}
                  </p>
                  <Link
                    href={`/account/orders/${order.order_number}`}
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View order
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-11 w-52" />
      <div className="mt-10 space-y-4">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    </div>
  );
}
