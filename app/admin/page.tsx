import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Activity,
  ArrowRight,
  Boxes,
  ClipboardCheck,
  ClipboardList,
  MessageSquare,
  Package,
  Scissors,
  Star,
  Users,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { OrderStatusBadge } from "@/components/commerce/order-status-tracker";
import { CustomOrderStatusBadge } from "@/components/custom-orders/custom-order-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getAdminOverview } from "@/lib/data/admin";
import { formatBdt, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Back office",
  description: "Craft BD administration overview.",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={4} />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  await requireAdmin("/admin");
  const overview = await getAdminOverview();
  const { counts, queues, recentActivity } = overview;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        title="Studio operations"
        description="Orders, bespoke requests, review moderation, and the catalogue in one place."
      >
        <Button asChild variant="outline">
          <Link href="/admin/orders">
            <Package aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Orders
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/activity">
            <Activity aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Audit log
          </Link>
        </Button>
      </AdminPageHeader>

      <section
        aria-label="Operations at a glance"
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        <AdminStatCard
          href="/admin/orders"
          icon={Package}
          label="Orders needing action"
          value={counts.orders.awaitingAction}
          detail={`${counts.orders.total} total · ${counts.orders.shipped} shipped`}
        />
        <AdminStatCard
          href="/admin/custom-orders"
          icon={Scissors}
          label="Requests awaiting reply"
          value={counts.customOrders.open}
          detail={`${counts.customOrders.active} in progress · ${counts.customOrders.completed} completed`}
        />
        <AdminStatCard
          href="/admin/reviews"
          icon={MessageSquare}
          label="Reviews to moderate"
          value={counts.reviews.awaitingModeration}
          detail={`${counts.reviews.published} published · ${counts.reviews.flagged} flagged`}
        />
        <AdminStatCard
          href="/admin/products"
          icon={Boxes}
          label="Published pieces"
          value={counts.products.published}
          detail={`${counts.products.draft} drafts · ${counts.products.lowStock} low stock`}
        />
        <AdminStatCard
          href="/admin/artisans"
          icon={Users}
          label="Approved studios"
          value={counts.artisans.approved}
          detail={`${counts.artisans.pending} pending · ${counts.artisans.suspended} suspended`}
        />
      </section>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <section
          aria-label="Orders needing action"
          className="rounded-3xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl leading-tight">Orders</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Pending or processing
              </p>
            </div>
            <ClipboardList
              aria-hidden="true"
              className="size-4 text-primary"
              strokeWidth={1.7}
            />
          </div>

          {queues.orders.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-secondary/50 px-3 py-6 text-center text-sm text-muted-foreground">
              Every order has moved forward.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {queues.orders.map(({ order, customer, itemCount }) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.order_number}`}
                    className="block py-3 transition-colors hover:text-primary"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold">
                        {order.order_number}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {customer?.fullName ?? "Customer"} · {itemCount}{" "}
                      {itemCount === 1 ? "piece" : "pieces"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatBdt(
                        order.total_bdt ??
                          order.subtotal_bdt +
                            order.shipping_bdt +
                            order.gift_wrap_bdt,
                      )}{" "}
                      · {formatDate(order.placed_at)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/admin/orders"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Open the order queue
            <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          </Link>
        </section>

        <section
          aria-label="Custom orders awaiting a reply"
          className="rounded-3xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl leading-tight">Custom orders</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Submitted or quoted
              </p>
            </div>
            <Scissors
              aria-hidden="true"
              className="size-4 text-primary"
              strokeWidth={1.7}
            />
          </div>

          {queues.customOrders.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-secondary/50 px-3 py-6 text-center text-sm text-muted-foreground">
              No bespoke request is waiting on the studio.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {queues.customOrders.map(({ order, customer, artisan }) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/custom-orders/${order.request_code}`}
                    className="block py-3 transition-colors hover:text-primary"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold">
                        {order.request_code}
                      </span>
                      <CustomOrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {order.product_type} ·{" "}
                      {artisan?.displayName ?? customer?.fullName ?? "Customer"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {customer?.fullName ?? "Customer"} ·{" "}
                      {formatDate(order.created_at)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/admin/custom-orders"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Open custom orders
            <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          </Link>
        </section>

        <section
          aria-label="Reviews awaiting moderation"
          className="rounded-3xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl leading-tight">Reviews</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Pending or flagged
              </p>
            </div>
            <Star
              aria-hidden="true"
              className="size-4 text-primary"
              strokeWidth={1.7}
            />
          </div>

          {queues.reviews.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-secondary/50 px-3 py-6 text-center text-sm text-muted-foreground">
              The moderation queue is clear.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {queues.reviews.map(({ review, product, customer }) => (
                <li key={review.id}>
                  <Link
                    href={`/admin/reviews?status=${review.status}`}
                    className="block py-3 transition-colors hover:text-primary"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold">
                        {product?.title ?? "Catalogue piece"}
                      </span>
                      <Badge
                        variant={review.status === "flagged" ? "warning" : "secondary"}
                      >
                        {review.status}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {review.comment}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {review.rating}/5 · {customer?.fullName ?? "Customer"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/admin/reviews"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Open review moderation
            <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          </Link>
        </section>
      </div>

      <section
        aria-label="Recent administrator activity"
        className="mt-4 rounded-3xl border border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl leading-tight">
              <ClipboardCheck
                aria-hidden="true"
                className="size-4 text-primary"
                strokeWidth={1.7}
              />
              Recent administrator activity
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Every back-office change is written to the audit trail.
            </p>
          </div>
          <Link
            href="/admin/activity"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Full audit log
            <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="mt-4">
            <AdminEmptyState
              icon={Activity}
              title="No administrator activity yet"
              description="Status changes, quote replies, moderation, and catalogue edits appear here as soon as they are made."
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {recentActivity.map(({ action, admin }) => (
              <li
                key={action.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    <span className="font-mono text-xs">{action.action}</span>{" "}
                    <span className="text-muted-foreground">
                      on {action.entity_type.replaceAll("_", " ")}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {admin?.fullName ?? "Administrator"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(action.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
