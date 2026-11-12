import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Hammer,
  ImageOff,
  MessageSquare,
  Scissors,
  Wallet,
} from "lucide-react";
import { CustomOrderStatusBadge } from "@/components/custom-orders/custom-order-status";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";
import { getCustomOrders } from "@/lib/data/custom-orders";
import { formatBdt, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Your custom orders",
  description:
    "Track bespoke Craft BD requests, studio estimates, and production.",
  robots: { index: false, follow: false },
};

export default function CustomOrdersPage() {
  return (
    <Suspense fallback={<CustomOrdersSkeleton />}>
      <CustomOrdersContent />
    </Suspense>
  );
}

async function CustomOrdersContent() {
  await requireUser("/custom-orders");
  const orders = await getCustomOrders();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Your account
          </p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">
            Custom orders
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Bespoke requests, studio estimates, and production updates — kept
            together with the brief you sent.
          </p>
        </div>
        <Button asChild>
          <Link href="/custom-orders/new">
            <Scissors aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Start a request
          </Link>
        </Button>
      </header>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Hammer aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 text-2xl">No custom orders yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Commission a piece from one of the studios. You describe the design,
            the studio replies with an estimate, and every stage is tracked here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/custom-orders/new">
              Start a custom order
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map(({ order, artisan, category }) => {
            const budget =
              order.budget_min_bdt !== null && order.budget_max_bdt !== null
                ? `${formatBdt(order.budget_min_bdt)} – ${formatBdt(
                    order.budget_max_bdt,
                  )}`
                : order.budget_max_bdt !== null
                  ? `Up to ${formatBdt(order.budget_max_bdt)}`
                  : order.budget_min_bdt !== null
                    ? `From ${formatBdt(order.budget_min_bdt)}`
                    : "Budget open";

            return (
              <li
                key={order.id}
                className="rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    {artisan?.avatarUrl ? (
                      <Image
                        src={artisan.avatarUrl}
                        alt={`Portrait of ${artisan.displayName}`}
                        width={48}
                        height={48}
                        className="size-12 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg text-secondary-foreground">
                        {artisan?.displayName.charAt(0).toUpperCase() ?? "C"}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/custom-orders/${order.request_code}`}
                          className="font-mono text-sm font-semibold transition-colors hover:text-primary"
                        >
                          {order.request_code}
                        </Link>
                        <CustomOrderStatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 truncate text-sm font-medium">
                        {order.product_type}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {artisan?.displayName ?? "Studio"} ·{" "}
                        {artisan?.craftSpecialization ??
                          category?.name ??
                          "Handcrafted"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {order.price_estimate_bdt !== null
                        ? formatBdt(order.price_estimate_bdt)
                        : budget}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {order.price_estimate_bdt !== null
                        ? "Studio estimate"
                        : "Your budget"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {order.design_description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet
                      aria-hidden="true"
                      className="size-3.5"
                      strokeWidth={1.7}
                    />
                    {order.quantity}{" "}
                    {order.quantity === 1 ? "piece" : "pieces"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquare
                      aria-hidden="true"
                      className="size-3.5"
                      strokeWidth={1.7}
                    />
                    Requested {formatDate(order.created_at)}
                  </span>
                  <Link
                    href={`/custom-orders/${order.request_code}`}
                    className="ml-auto inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View request
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5"
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-secondary/40 px-5 py-4 text-sm text-muted-foreground">
        <p className="inline-flex items-center gap-2">
          <ImageOff
            aria-hidden="true"
            className="size-4 text-primary"
            strokeWidth={1.7}
          />
          Request codes, estimates, and notes stay in your account.
        </p>
        <Link
          href="/artisans"
          className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
        >
          Browse studios
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

function CustomOrdersSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-11 w-56" />
      <Skeleton className="mt-3 h-4 w-full max-w-md" />
      <div className="mt-10 space-y-4">
        <Skeleton className="h-44 rounded-3xl" />
        <Skeleton className="h-44 rounded-3xl" />
      </div>
    </div>
  );
}
