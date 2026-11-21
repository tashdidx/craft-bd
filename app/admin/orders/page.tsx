import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Package } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFilterPills } from "@/components/admin/admin-filter-pills";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { AdminSearchForm } from "@/components/admin/admin-search-form";
import { OrderStatusBadge } from "@/components/commerce/order-status-tracker";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, parseOrderStatusFilter, searchParam, textParam } from "@/lib/admin";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";
import { getAdminOrders } from "@/lib/data/admin";
import { formatBdt, formatDate } from "@/lib/format";
import type { PaymentStatus } from "@/lib/supabase/enums";

export const metadata: Metadata = {
  title: "Orders",
  description: "Craft BD order operations.",
  robots: { index: false, follow: false },
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...ORDER_STATUSES.map((status) => ({
    value: status,
    label: ORDER_STATUS_LABELS[status],
  })),
];

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

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminOrdersPage(props: OrdersPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={5} />}>
      <AdminOrdersContent {...props} />
    </Suspense>
  );
}

async function AdminOrdersContent({ searchParams }: OrdersPageProps) {
  await requireAdmin("/admin/orders");
  const search = await searchParams;
  const status = parseOrderStatusFilter(search.status);
  const q = searchParam(search.q);
  const orders = await getAdminOrders({ status, q });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        title="Orders"
        description={`${orders.length} ${orders.length === 1 ? "order" : "orders"}${
          q ? ` matching “${q}”` : ""
        }. Advance the delivery status, settle cash-on-delivery payment, or cancel before dispatch.`}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <AdminFilterPills
          basePath="/admin/orders"
          current={status}
          options={FILTER_OPTIONS}
          q={q}
        />
        <AdminSearchForm
          basePath="/admin/orders"
          status={status}
          q={q}
          placeholder="Search order number"
        />
      </div>

      {orders.length === 0 ? (
        <div className="mt-8">
          <AdminEmptyState
            icon={Package}
            title={q ? "No orders match that search" : "No orders in this queue"}
            description={
              q
                ? "Order numbers follow CBD-YYYY-NNNN. Clear the search or choose another status."
                : "Orders appear here as soon as a customer checks out."
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-card">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Order
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Customer
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Pieces
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Total
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Payment
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(({ order, customer, itemCount, itemTitles }) => (
                <tr key={order.id} className="align-top hover:bg-secondary/20">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.order_number}`}
                      className="font-mono text-xs font-semibold transition-colors hover:text-primary"
                    >
                      {order.order_number}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(order.placed_at)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">
                      {customer?.fullName ?? "Customer"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {customer?.email ?? "No email on file"}
                    </p>
                  </td>
                  <td className="max-w-56 px-4 py-4">
                    <p className="text-xs text-muted-foreground">
                      {itemCount} {itemCount === 1 ? "piece" : "pieces"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {itemTitles.slice(0, 2).join(" · ")}
                      {itemTitles.length > 2
                        ? ` +${itemTitles.length - 2} more`
                        : ""}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-medium">
                    {formatBdt(
                      order.total_bdt ??
                        order.subtotal_bdt +
                          order.shipping_bdt +
                          order.gift_wrap_bdt,
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={paymentVariant(order.payment_status)}>
                      {PAYMENT_STATUS_LABELS[order.payment_status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.order_number}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Manage
                      <ArrowRight
                        aria-hidden="true"
                        className="size-3.5"
                        strokeWidth={1.8}
                      />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {textParam(search.q) ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Search covers order numbers only.
        </p>
      ) : null}
    </div>
  );
}
