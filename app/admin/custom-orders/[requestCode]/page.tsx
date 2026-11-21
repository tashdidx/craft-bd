import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Palette,
  Phone,
  Ruler,
  Scissors,
  UserRound,
  Wallet,
} from "lucide-react";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { SubmitButton } from "@/components/commerce/submit-button";
import { CustomOrderStatusBadge } from "@/components/custom-orders/custom-order-status";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import {
  CUSTOM_ORDER_NEXT_STATUSES,
} from "@/lib/admin";
import {
  CUSTOM_ORDER_STATUS_LABELS,
  DIVISION_LABELS,
} from "@/lib/constants";
import {
  sendCustomOrderQuoteAction,
  updateCustomOrderStatusAction,
} from "@/lib/actions/admin";
import { getAdminCustomOrderByCode } from "@/lib/data/admin";
import { formatBdt, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Custom order operations",
  description: "Manage a Craft BD bespoke request.",
  robots: { index: false, follow: false },
};

const INPUT_CLASS =
  "mt-1.5 block h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

const TEXTAREA_CLASS =
  "mt-1.5 block w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

const SELECT_CLASS =
  "mt-1.5 block h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

interface CustomOrderDetailPageProps {
  params: Promise<{ requestCode: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminCustomOrderDetailPage(
  props: CustomOrderDetailPageProps,
) {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={3} />}>
      <AdminCustomOrderDetailContent {...props} />
    </Suspense>
  );
}

async function AdminCustomOrderDetailContent({
  params,
  searchParams,
}: CustomOrderDetailPageProps) {
  const { requestCode } = await params;
  const search = await searchParams;
  await requireAdmin(`/admin/custom-orders/${requestCode}`);
  const detail = await getAdminCustomOrderByCode(requestCode);

  if (!detail) notFound();

  const { order, customer, artisan, category, events } = detail;
  const returnTo = `/admin/custom-orders/${order.request_code}`;
  const quoteOpen = order.status === "submitted" || order.status === "quoted";
  const nextStatuses = CUSTOM_ORDER_NEXT_STATUSES[order.status];
  const budget =
    order.budget_min_bdt !== null && order.budget_max_bdt !== null
      ? `${formatBdt(order.budget_min_bdt)} – ${formatBdt(order.budget_max_bdt)}`
      : order.budget_max_bdt !== null
        ? `Up to ${formatBdt(order.budget_max_bdt)}`
        : order.budget_min_bdt !== null
          ? `From ${formatBdt(order.budget_min_bdt)}`
          : "Open";

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
      <Link
        href="/admin/custom-orders"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        All custom orders
      </Link>

      <AdminNotice notice={search.notice} />

      <header className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Custom order operations
          </p>
          <h1 className="mt-3 font-mono text-3xl leading-tight sm:text-4xl">
            {order.request_code}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {order.product_type} · {customer?.fullName ?? "Customer"} · Requested{" "}
            {formatDate(order.created_at)}
          </p>
        </div>
        <CustomOrderStatusBadge status={order.status} />
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <Palette
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.6}
                />
              </span>
              <div>
                <h2 className="text-2xl leading-tight">The brief</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  What the customer asked the studio to make.
                </p>
              </div>
            </div>

            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-foreground/85">
              {order.design_description}
            </p>

            <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
              <Fact icon={Palette} label="Colour" value={order.color} />
              <Fact icon={Ruler} label="Size" value={order.size} />
              <Fact icon={Scissors} label="Material" value={order.material} />
              <Fact
                icon={Wallet}
                label="Quantity"
                value={`${order.quantity} ${
                  order.quantity === 1 ? "piece" : "pieces"
                }`}
              />
            </dl>

            {order.custom_notes ? (
              <div className="mt-5 rounded-2xl bg-secondary/60 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <MessageSquare
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.7}
                  />
                  Customer notes
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6">
                  {order.custom_notes}
                </p>
              </div>
            ) : null}

            {order.reference_image_url ? (
              <a
                href={order.reference_image_url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Open the customer&apos;s reference
                <ExternalLink
                  aria-hidden="true"
                  className="size-3.5 shrink-0"
                  strokeWidth={1.8}
                />
              </a>
            ) : null}
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <CircleDollarSign
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.6}
                />
              </span>
              <div>
                <h2 className="text-2xl leading-tight">Studio estimate</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  The customer approves or declines this price in their account.
                </p>
              </div>
            </div>

            {order.price_estimate_bdt !== null ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Price
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {formatBdt(order.price_estimate_bdt)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <CalendarClock
                      aria-hidden="true"
                      className="size-3.5"
                      strokeWidth={1.7}
                    />
                    Lead time
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {order.estimated_days !== null
                      ? `${order.estimated_days} days`
                      : "Not set"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl bg-secondary/50 px-4 py-4 text-sm text-muted-foreground">
                No estimate has been sent yet.
              </p>
            )}

            {order.artisan_note ? (
              <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Note on the estimate
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6">
                  {order.artisan_note}
                </p>
              </div>
            ) : null}

            {order.customer_response_note ? (
              <div className="mt-4 rounded-2xl bg-secondary/60 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Customer response
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6">
                  {order.customer_response_note}
                </p>
              </div>
            ) : null}

            {quoteOpen ? (
              <div className="mt-6 border-t border-border pt-5">
                <h3 className="text-sm font-semibold">
                  {order.status === "quoted"
                    ? "Revise the estimate"
                    : "Reply with an estimate"}
                </h3>
                <AdminActionForm
                  action={sendCustomOrderQuoteAction}
                  className="mt-3"
                >
                  <input type="hidden" name="requestId" value={order.id} />
                  <input
                    type="hidden"
                    name="requestCode"
                    value={order.request_code}
                  />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="font-medium">Price (BDT)</span>
                      <input
                        type="number"
                        name="priceEstimateBdt"
                        required
                        min={1}
                        step="1"
                        defaultValue={order.price_estimate_bdt ?? ""}
                        placeholder="22000"
                        className={INPUT_CLASS}
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="font-medium">Lead time (days)</span>
                      <input
                        type="number"
                        name="estimatedDays"
                        required
                        min={1}
                        max={365}
                        step="1"
                        defaultValue={order.estimated_days ?? ""}
                        placeholder="35"
                        className={INPUT_CLASS}
                      />
                    </label>
                  </div>
                  <label className="mt-4 block text-sm">
                    <span className="font-medium">
                      Note to the customer{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </span>
                    <textarea
                      name="note"
                      rows={4}
                      maxLength={1_000}
                      defaultValue={order.artisan_note ?? ""}
                      placeholder="Explain the material, work, and any assumptions behind the estimate."
                      className={TEXTAREA_CLASS}
                    />
                  </label>
                  <SubmitButton
                    className="mt-4 w-full"
                    size="sm"
                    pendingLabel="Sending estimate…"
                  >
                    {order.status === "quoted"
                      ? "Save revised estimate"
                      : "Send estimate"}
                  </SubmitButton>
                </AdminActionForm>
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <Clock3
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.6}
                />
              </span>
              <div>
                <h2 className="text-2xl leading-tight">Timeline</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Every status change, including the customer&apos;s reply.
                </p>
              </div>
            </div>

            <ol className="mt-6 space-y-5 border-l border-border pl-5">
              {events.map((event) => (
                <li key={event.id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-card"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <CustomOrderStatusBadge status={event.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(event.created_at, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  {event.note ? (
                    <p className="mt-2 text-sm leading-6 text-foreground/85">
                      {event.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
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
            <h2 className="text-xl leading-tight">The studio</h2>
            {artisan ? (
              <>
                <div className="mt-4 flex items-center gap-3">
                  {artisan.avatarUrl ? (
                    <Image
                      src={artisan.avatarUrl}
                      alt={`Portrait of ${artisan.displayName}`}
                      width={48}
                      height={48}
                      className="size-12 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-full bg-secondary font-display text-lg text-secondary-foreground">
                      {artisan.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {artisan.displayName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {artisan.workshopName ?? artisan.craftSpecialization}
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                    strokeWidth={1.7}
                  />
                  {artisan.district}, {DIVISION_LABELS[artisan.region]}
                </p>
                {category ? (
                  <Badge variant="secondary" className="mt-3">
                    {category.name}
                  </Badge>
                ) : null}
                <Link
                  href={`/artisans/${artisan.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View public profile
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                This studio is no longer listed.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="text-xl leading-tight">Request facts</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Budget</dt>
                <dd className="text-right font-medium">{budget}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Requested</dt>
                <dd className="text-right">
                  {formatDate(order.created_at, { dateStyle: "medium" })}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Customer reply</dt>
                <dd className="text-right">
                  {order.status === "submitted" || order.status === "quoted"
                    ? "Awaiting customer"
                    : order.responded_at
                      ? formatDate(order.responded_at, { dateStyle: "medium" })
                      : "Not recorded"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="text-xl leading-tight">Production status</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Moving the request writes a timeline event the customer can see.
            </p>

            {nextStatuses.length > 0 ? (
              <AdminActionForm
                action={updateCustomOrderStatusAction}
                className="mt-4"
              >
                <input type="hidden" name="requestId" value={order.id} />
                <input
                  type="hidden"
                  name="requestCode"
                  value={order.request_code}
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
                        {CUSTOM_ORDER_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="mt-4 block text-sm">
                  <span className="font-medium">
                    Timeline note{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </span>
                  <textarea
                    name="note"
                    rows={3}
                    maxLength={500}
                    placeholder="Add a short update for the customer."
                    className={TEXTAREA_CLASS}
                  />
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
                  ? "This request is cancelled. The status is terminal."
                  : order.status === "completed"
                    ? "This commission is completed. The status is terminal."
                    : "This request is closed. No production steps remain."}
              </p>
            )}

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Current: {CUSTOM_ORDER_STATUS_LABELS[order.status]}. Every save is
              recorded in the administrator audit log.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Palette;
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5 text-primary" strokeWidth={1.7} />
        {label}
      </dt>
      <dd className="mt-1 text-sm">{value ?? "Not specified"}</dd>
    </div>
  );
}
