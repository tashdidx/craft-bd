import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Hammer,
  MapPin,
  MessageSquare,
  Palette,
  Ruler,
  Scissors,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  CustomOrderStatusBadge,
  CustomOrderTimeline,
} from "@/components/custom-orders/custom-order-status";
import { QuoteResponseForm } from "@/components/custom-orders/quote-response-form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";
import { DIVISION_LABELS } from "@/lib/constants";
import { getCustomOrderByCode } from "@/lib/data/custom-orders";
import { formatBdt, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Custom order",
  description: "A bespoke Craft BD request and its studio timeline.",
  robots: { index: false, follow: false },
};

interface CustomOrderPageProps {
  params: Promise<{ requestCode: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function CustomOrderPage(props: CustomOrderPageProps) {
  return (
    <Suspense fallback={<CustomOrderSkeleton />}>
      <CustomOrderContent {...props} />
    </Suspense>
  );
}

async function CustomOrderContent({
  params,
  searchParams,
}: CustomOrderPageProps) {
  const { requestCode } = await params;
  const search = await searchParams;
  const current = await requireUser(`/custom-orders/${requestCode}`);
  const detail = await getCustomOrderByCode(requestCode);

  if (!detail) notFound();

  const { order, artisan, category, events } = detail;
  const created = search.created === "1";
  const responded =
    search.responded === "approved" || search.responded === "declined"
      ? search.responded
      : null;
  const budget =
    order.budget_min_bdt !== null && order.budget_max_bdt !== null
      ? `${formatBdt(order.budget_min_bdt)} – ${formatBdt(order.budget_max_bdt)}`
      : order.budget_max_bdt !== null
        ? `Up to ${formatBdt(order.budget_max_bdt)}`
        : order.budget_min_bdt !== null
          ? `From ${formatBdt(order.budget_min_bdt)}`
          : "Open";

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/custom-orders"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        All custom orders
      </Link>

      {created ? (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0"
            strokeWidth={1.8}
          />
          <div>
            <p className="font-medium">Request sent to the studio.</p>
            <p className="mt-0.5 leading-6">
              Keep this page. The studio&apos;s estimate and every later stage
              will appear on the timeline.
            </p>
          </div>
        </div>
      ) : null}

      {responded ? (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0"
            strokeWidth={1.8}
          />
          <div>
            <p className="font-medium">
              {responded === "approved"
                ? "Estimate approved."
                : "Estimate declined."}
            </p>
            <p className="mt-0.5 leading-6">
              {responded === "approved"
                ? "The studio can now begin production. Follow the timeline here for each stage."
                : "The request is closed without any payment. The brief and timeline stay in your account."}
            </p>
          </div>
        </div>
      ) : null}

      <header className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Custom order
          </p>
          <h1 className="mt-3 font-mono text-3xl leading-tight sm:text-4xl">
            {order.request_code}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {order.product_type}
            {artisan ? ` · ${artisan.displayName}` : ""} · Requested{" "}
            {formatDate(order.created_at)}
          </p>
        </div>
        <CustomOrderStatusBadge status={order.status} />
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
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
                  What you asked the studio to make.
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
                  Your notes
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6">
                  {order.custom_notes}
                </p>
              </div>
            ) : null}
          </section>

          <QuotePanel
            status={order.status}
            priceEstimate={order.price_estimate_bdt}
            estimatedDays={order.estimated_days}
            artisanNote={order.artisan_note}
            customerNote={order.customer_response_note}
            requestCode={order.request_code}
          />

          <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
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
                  Every update from the request to the finished piece.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <CustomOrderTimeline
                events={events}
                status={order.status}
                customerId={current.user.id}
                createdAt={order.created_at}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl leading-tight">The studio</h2>
            {artisan ? (
              <>
                <div className="mt-4 flex items-center gap-3">
                  {artisan.avatarUrl ? (
                    <Image
                      src={artisan.avatarUrl}
                      alt={`Portrait of ${artisan.displayName}`}
                      width={56}
                      height={56}
                      className="size-14 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span className="grid size-14 place-items-center rounded-full bg-secondary font-display text-lg text-secondary-foreground">
                      {artisan.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium">{artisan.displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {artisan.workshopName ?? artisan.craftSpecialization}
                    </p>
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin
                    aria-hidden="true"
                    className="size-4 text-primary"
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
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Visit the studio
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This studio is not listed right now.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl leading-tight">Request facts</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Budget</dt>
                <dd className="text-right font-medium">{budget}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Estimate</dt>
                <dd className="text-right font-medium">
                  {order.price_estimate_bdt !== null
                    ? formatBdt(order.price_estimate_bdt)
                    : "Not sent yet"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Lead time</dt>
                <dd className="text-right font-medium">
                  {order.estimated_days !== null
                    ? `${order.estimated_days} days`
                    : "Not set"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Your response</dt>
                <dd className="text-right font-medium">
                  {order.status === "submitted" || order.status === "quoted"
                    ? "Awaiting you"
                    : order.responded_at
                      ? formatDate(order.responded_at)
                      : "Not recorded"}
                </dd>
              </div>
            </dl>
          </section>

          {order.reference_image_url ? (
            <section className="rounded-3xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-xl leading-tight">
                <Scissors
                  aria-hidden="true"
                  className="size-4 text-primary"
                  strokeWidth={1.7}
                />
                Reference
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The link shared with the studio.
              </p>
              <a
                href={order.reference_image_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Open reference
                <ExternalLink
                  aria-hidden="true"
                  className="size-3.5 shrink-0"
                  strokeWidth={1.8}
                />
              </a>
            </section>
          ) : null}

          <section className="rounded-3xl bg-accent p-6 text-accent-foreground">
            <Hammer
              aria-hidden="true"
              className="size-5 text-accent-foreground/70"
              strokeWidth={1.7}
            />
            <h2 className="mt-3 text-xl leading-tight">
              Estimates are not orders.
            </h2>
            <p className="mt-2 text-sm leading-6 text-accent-foreground/70">
              No payment is collected for a custom order here. The studio
              confirms the final amount directly once you approve an estimate.
            </p>
            <Link
              href="/account/orders"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Ready-made orders
              <ArrowUpRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.8}
              />
            </Link>
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

function QuotePanel({
  status,
  priceEstimate,
  estimatedDays,
  artisanNote,
  customerNote,
  requestCode,
}: {
  status: string;
  priceEstimate: number | null;
  estimatedDays: number | null;
  artisanNote: string | null;
  customerNote: string | null;
  requestCode: string;
}) {
  if (status === "quoted") {
    return (
      <section className="rounded-3xl border border-amber-300/60 bg-amber-50/70 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-800">
            <CircleDollarSign
              aria-hidden="true"
              className="size-5"
              strokeWidth={1.6}
            />
          </span>
          <div>
            <h2 className="text-2xl leading-tight text-amber-950">
              The studio&apos;s estimate
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900/70">
              Approve to begin production, or decline to close the request
              without any payment.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-card/80 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Price
            </p>
            <p className="mt-1 text-2xl font-semibold text-amber-950">
              {priceEstimate !== null ? formatBdt(priceEstimate) : "To confirm"}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-card/80 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <CalendarClock
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={1.7}
              />
              Lead time
            </p>
            <p className="mt-1 text-2xl font-semibold text-amber-950">
              {estimatedDays !== null ? `${estimatedDays} days` : "To confirm"}
            </p>
          </div>
        </div>

        {artisanNote ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-card/80 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Note from the studio
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6">
              {artisanNote}
            </p>
          </div>
        ) : null}

        <QuoteResponseForm requestCode={requestCode} />
      </section>
    );
  }

  if (status === "submitted") {
    return (
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Clock3 aria-hidden="true" className="size-5" strokeWidth={1.6} />
          </span>
          <div>
            <h2 className="text-2xl leading-tight">Waiting for the estimate</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              The studio has your brief. When it replies, the price, lead time,
              and note appear here for you to approve or decline.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (status === "declined" || status === "cancelled") {
    return (
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <XCircle aria-hidden="true" className="size-5" strokeWidth={1.6} />
          </span>
          <div>
            <h2 className="text-2xl leading-tight">
              {status === "declined"
                ? "Estimate declined"
                : "Request cancelled"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              This request is closed and no payment is due. The brief and
              timeline remain in your account for reference.
            </p>
            {customerNote ? (
              <p className="mt-3 rounded-2xl bg-secondary/60 px-3 py-2 text-sm leading-6">
                {customerNote}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle2
            aria-hidden="true"
            className="size-5"
            strokeWidth={1.6}
          />
        </span>
        <div className="min-w-0">
          <h2 className="text-2xl leading-tight">Estimate accepted</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            The studio is working to the approved estimate. Follow the timeline
            below for production and dispatch updates.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {priceEstimate !== null
                ? formatBdt(priceEstimate)
                : "Price confirmed"}
            </Badge>
            {estimatedDays !== null ? (
              <Badge variant="outline">{estimatedDays} days</Badge>
            ) : null}
          </div>
          {customerNote ? (
            <p className="mt-3 rounded-2xl bg-secondary/60 px-3 py-2 text-sm leading-6">
              <span className="font-medium">Your note: </span>
              {customerNote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CustomOrderSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-5 h-10 w-64" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
