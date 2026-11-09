import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  Gift,
  ImageOff,
  MapPin,
  PackageCheck,
  ReceiptText,
} from "lucide-react";
import {
  OrderStatusBadge,
  OrderStatusTracker,
} from "@/components/commerce/order-status-tracker";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";
import {
  DIVISION_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import { getOrderByNumber } from "@/lib/data/orders";
import { formatBdt, formatDate } from "@/lib/format";
import type { ShippingAddressSnapshot } from "@/types/domain";

export const metadata: Metadata = {
  title: "Order details",
  description: "Follow a Craft BD order from confirmation to delivery.",
  robots: { index: false, follow: false },
};

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function OrderPage(props: OrderPageProps) {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderContent {...props} />
    </Suspense>
  );
}

async function OrderContent({ params, searchParams }: OrderPageProps) {
  const { orderNumber } = await params;
  const search = await searchParams;

  await requireUser(`/account/orders/${orderNumber}`);
  const detail = await getOrderByNumber(orderNumber);

  if (!detail) notFound();

  const { order, items } = detail;
  const address = order.shipping_address as unknown as ShippingAddressSnapshot;
  const total =
    order.total_bdt ??
    order.subtotal_bdt + order.shipping_bdt + order.gift_wrap_bdt;
  const placed = search.placed === "1";

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        All orders
      </Link>

      {placed ? (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <PackageCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0"
            strokeWidth={1.8}
          />
          <div>
            <p className="font-medium">Order placed.</p>
            <p className="mt-0.5 leading-6">
              The studio has received it. Keep this page for the status
              tracker.
            </p>
          </div>
        </div>
      ) : null}

      <header className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Order
          </p>
          <h1 className="mt-3 font-mono text-3xl leading-tight sm:text-4xl">
            {order.order_number}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Placed {formatDate(order.placed_at)} ·{" "}
            {PAYMENT_STATUS_LABELS[order.payment_status]}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <section className="mt-8" aria-label="Order status">
        <h2 className="text-xl leading-tight">Status</h2>
        <div className="mt-4">
          <OrderStatusTracker status={order.status} />
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section
          aria-label="Order items"
          className="rounded-3xl border border-border bg-card p-5 sm:p-6"
        >
          <h2 className="text-xl leading-tight">Pieces</h2>
          <ul className="mt-4 divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="relative block size-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary">
                  {item.product_image_url ? (
                    <Image
                      src={item.product_image_url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-muted-foreground">
                      <ImageOff
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={1.5}
                      />
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.product_title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatBdt(item.unit_price_bdt)} × {item.quantity}
                  </p>
                  {item.gift_wrap ? (
                    <Badge variant="secondary" className="mt-2">
                      <Gift
                        aria-hidden="true"
                        className="size-3"
                        strokeWidth={1.8}
                      />
                      Gift wrapped
                    </Badge>
                  ) : null}
                </div>
                <p className="shrink-0 text-sm font-semibold">
                  {formatBdt(item.line_total_bdt ?? item.unit_price_bdt * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl leading-tight">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatBdt(order.subtotal_bdt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>
                  {Number(order.shipping_bdt) === 0 ? (
                    <span className="text-primary">Free</span>
                  ) : (
                    formatBdt(order.shipping_bdt)
                  )}
                </dd>
              </div>
              {Number(order.gift_wrap_bdt) > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Gift wrapping</dt>
                  <dd>{formatBdt(order.gift_wrap_bdt)}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatBdt(total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-xl leading-tight">
              <MapPin
                aria-hidden="true"
                className="size-4 text-primary"
                strokeWidth={1.7}
              />
              Delivery address
            </h2>
            <address className="mt-3 text-sm not-italic leading-6 text-muted-foreground">
              <span className="block font-medium text-foreground">
                {address.recipient_name}
              </span>
              <span className="block">{address.phone}</span>
              <span className="block">{address.address_line1}</span>
              {address.address_line2 ? (
                <span className="block">{address.address_line2}</span>
              ) : null}
              <span className="block">
                {address.city}, {address.district}
              </span>
              <span className="block">
                {DIVISION_LABELS[address.division] ?? address.division}
                {address.postal_code ? ` ${address.postal_code}` : ""}
              </span>
            </address>
          </section>

          {order.gift_message ? (
            <section className="rounded-3xl border border-border bg-accent p-6 text-accent-foreground">
              <h2 className="flex items-center gap-2 text-xl leading-tight">
                <Gift
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.7}
                />
                Gift message
              </h2>
              <p className="mt-3 text-sm leading-6 text-accent-foreground/80">
                “{order.gift_message}”
              </p>
            </section>
          ) : null}

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-xl leading-tight">
              <ReceiptText
                aria-hidden="true"
                className="size-4 text-primary"
                strokeWidth={1.7}
              />
              Payment
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {PAYMENT_STATUS_LABELS[order.payment_status]}. Cash on delivery
              only — no online payment is collected.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-10 w-64" />
      <Skeleton className="mt-8 h-40 rounded-3xl" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
}
