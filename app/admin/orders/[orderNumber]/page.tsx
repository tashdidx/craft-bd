import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  CreditCard,
  Gift,
  ImageOff,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  UserRound,
} from "lucide-react";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { OrderStatusBadge, OrderStatusTracker } from "@/components/commerce/order-status-tracker";
import { SubmitButton } from "@/components/commerce/submit-button";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { ORDER_NEXT_STATUSES, PAYMENT_NEXT_STATUSES } from "@/lib/admin";
import {
  DIVISION_LABELS,
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import {
  updateOrderPaymentAction,
  updateOrderStatusAction,
} from "@/lib/actions/admin";
import { getAdminOrderByNumber } from "@/lib/data/admin";
import { formatBdt, formatDate } from "@/lib/format";
import type { PaymentStatus } from "@/lib/supabase/enums";
import type { ShippingAddressSnapshot } from "@/types/domain";

export const metadata: Metadata = {
  title: "Order operations",
  description: "Manage a Craft BD order.",
  robots: { index: false, follow: false },
};

const SELECT_CLASS =
  "mt-1.5 block h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminOrderDetailPage(props: OrderDetailPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={3} />}>
      <AdminOrderDetailContent {...props} />
    </Suspense>
  );
}

function paymentVariant(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "success" as const;
    case "refunded":
      return "outline" as const;
    case "unpaid":
    default:
      return "warning" as const;
  }
}

async function AdminOrderDetailContent({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const search = await searchParams;
  await requireAdmin(`/admin/orders/${orderNumber}`);
  const detail = await getAdminOrderByNumber(orderNumber);

  if (!detail) notFound();

  const { order, customer, items } = detail;
  const address = order.shipping_address as unknown as ShippingAddressSnapshot;
  const total =
    order.total_bdt ??
    order.subtotal_bdt + order.shipping_bdt + order.gift_wrap_bdt;
  const nextStatuses = ORDER_NEXT_STATUSES[order.status];
  const nextPayments = PAYMENT_NEXT_STATUSES[order.payment_status];
  const returnTo = `/admin/orders/${order.order_number}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        All orders
      </Link>

      <AdminNotice notice={search.notice} />

      <header className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Order operations
          </p>
          <h1 className="mt-3 font-mono text-3xl leading-tight sm:text-4xl">
            {order.order_number}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Placed {formatDate(order.placed_at)} ·{" "}
            {ORDER_STATUS_DESCRIPTIONS[order.status]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} />
          <Badge variant={paymentVariant(order.payment_status)}>
            {PAYMENT_STATUS_LABELS[order.payment_status]}
          </Badge>
        </div>
      </header>

      <section className="mt-8" aria-label="Order status">
        <h2 className="text-xl leading-tight">Delivery progress</h2>
        <div className="mt-4">
          <OrderStatusTracker status={order.status} />
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-xl leading-tight">Pieces</h2>
            <ul className="mt-4 divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex gap-4">
                    <span className="relative block size-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary">
                      {item.product_image_url ? (
                        <Image
                          src={item.product_image_url}
                          alt=""
                          fill
                          sizes="64px"
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
                      {formatBdt(
                        item.line_total_bdt ??
                          item.unit_price_bdt * item.quantity,
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-3xl border border-border bg-card p-5">
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

            <section className="rounded-3xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-xl leading-tight">
                <MapPin
                  aria-hidden="true"
                  className="size-4 text-primary"
                  strokeWidth={1.7}
                />
                Delivery
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
          </div>

          {order.gift_message ? (
            <section className="rounded-3xl border border-border bg-accent p-5 text-accent-foreground">
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
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-xl leading-tight">
              <UserRound
                aria-hidden="true"
                className="size-4 text-primary"
                strokeWidth={1.7}
              />
              Customer
            </h2>
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-medium">
                {customer?.fullName ?? "Customer record unavailable"}
              </p>
              {customer?.email ? (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.7}
                  />
                  <a
                    href={`mailto:${customer.email}`}
                    className="break-all underline-offset-4 hover:underline"
                  >
                    {customer.email}
                  </a>
                </p>
              ) : null}
              {customer?.phone ? (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.7}
                  />
                  {customer.phone}
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-xl leading-tight">
              <PackageCheck
                aria-hidden="true"
                className="size-4 text-primary"
                strokeWidth={1.7}
              />
              Delivery status
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Move the order one step forward. Cancelling before dispatch returns
              every piece to stock exactly once and cannot be undone.
            </p>

            {nextStatuses.length > 0 ? (
              <AdminActionForm
                action={updateOrderStatusAction}
                className="mt-4"
              >
                <input type="hidden" name="orderId" value={order.id} />
                <input
                  type="hidden"
                  name="orderNumber"
                  value={order.order_number}
                />
                <input type="hidden" name="returnTo" value={returnTo} />
                <label className="block text-sm">
                  <span className="font-medium">Next status</span>
                  <select
                    name="status"
                    required
                    defaultValue=""
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Choose a status
                    </option>
                    {nextStatuses.map((status) => (
                      <option key={status} value={status}>
                        {ORDER_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <SubmitButton
                  className="mt-3 w-full"
                  size="sm"
                  pendingLabel="Saving status…"
                >
                  Save status
                </SubmitButton>
              </AdminActionForm>
            ) : (
              <p className="mt-4 rounded-2xl bg-secondary/60 px-3 py-3 text-xs leading-5 text-muted-foreground">
                {order.status === "cancelled"
                  ? "This order is cancelled. Its stock has been returned and the status is terminal."
                  : "This order is delivered. No further delivery steps remain."}
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-xl leading-tight">
              <CreditCard
                aria-hidden="true"
                className="size-4 text-primary"
                strokeWidth={1.7}
              />
              Payment
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Cash on delivery only. Mark the payment when the courier collects
              it, then record a refund if one is issued.
            </p>

            {nextPayments.length > 0 ? (
              <AdminActionForm
                action={updateOrderPaymentAction}
                className="mt-4"
              >
                <input type="hidden" name="orderId" value={order.id} />
                <input
                  type="hidden"
                  name="orderNumber"
                  value={order.order_number}
                />
                <input type="hidden" name="returnTo" value={returnTo} />
                <label className="block text-sm">
                  <span className="font-medium">Payment status</span>
                  <select
                    name="paymentStatus"
                    required
                    defaultValue=""
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Choose a payment status
                    </option>
                    {nextPayments.map((status) => (
                      <option key={status} value={status}>
                        {PAYMENT_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <SubmitButton
                  className="mt-3 w-full"
                  size="sm"
                  pendingLabel="Saving payment…"
                >
                  Save payment
                </SubmitButton>
              </AdminActionForm>
            ) : (
              <p className="mt-4 rounded-2xl bg-secondary/60 px-3 py-3 text-xs leading-5 text-muted-foreground">
                {order.payment_status === "refunded"
                  ? "This payment has been refunded. No further payment steps remain."
                  : "This payment is already marked paid. A refund is the only remaining step."}
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-xl leading-tight">
              <ReceiptText
                aria-hidden="true"
                className="size-4 text-primary"
                strokeWidth={1.7}
              />
              Order facts
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Placed</dt>
                <dd>{formatDate(order.placed_at, { dateStyle: "medium" })}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Updated</dt>
                <dd>{formatDate(order.updated_at, { dateStyle: "medium" })}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Gift wrap</dt>
                <dd>{order.gift_wrap ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
