import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Scissors } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFilterPills } from "@/components/admin/admin-filter-pills";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { AdminSearchForm } from "@/components/admin/admin-search-form";
import { CustomOrderStatusBadge } from "@/components/custom-orders/custom-order-status";
import { requireAdmin } from "@/lib/auth";
import {
  CUSTOM_ORDER_STATUSES,
  parseCustomOrderStatusFilter,
  searchParam,
} from "@/lib/admin";
import { CUSTOM_ORDER_STATUS_LABELS } from "@/lib/constants";
import { getAdminCustomOrders } from "@/lib/data/admin";
import { formatBdt, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Custom orders",
  description: "Craft BD bespoke request operations.",
  robots: { index: false, follow: false },
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...CUSTOM_ORDER_STATUSES.map((status) => ({
    value: status,
    label: CUSTOM_ORDER_STATUS_LABELS[status],
  })),
];

interface CustomOrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminCustomOrdersPage(props: CustomOrdersPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={5} />}>
      <AdminCustomOrdersContent {...props} />
    </Suspense>
  );
}

async function AdminCustomOrdersContent({
  searchParams,
}: CustomOrdersPageProps) {
  await requireAdmin("/admin/custom-orders");
  const search = await searchParams;
  const status = parseCustomOrderStatusFilter(search.status);
  const q = searchParam(search.q);
  const orders = await getAdminCustomOrders({ status, q });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        title="Custom orders"
        description={`${orders.length} ${
          orders.length === 1 ? "request" : "requests"
        }${q ? ` matching “${q}”` : ""}. Reply with a price and lead time, then move accepted commissions through production.`}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <AdminFilterPills
          basePath="/admin/custom-orders"
          current={status}
          options={FILTER_OPTIONS}
          q={q}
        />
        <AdminSearchForm
          basePath="/admin/custom-orders"
          status={status}
          q={q}
          placeholder="Search request code"
        />
      </div>

      {orders.length === 0 ? (
        <div className="mt-8">
          <AdminEmptyState
            icon={Scissors}
            title={q ? "No requests match that search" : "No custom orders here"}
            description={
              q
                ? "Request codes follow CUS-YYYY-NNNN. Clear the search or choose another status."
                : "Bespoke requests appear here as soon as a customer submits one."
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-card">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Request
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Customer
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Studio
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Piece
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Value
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(({ order, customer, artisan, category, eventCount }) => {
                const budget =
                  order.budget_min_bdt !== null && order.budget_max_bdt !== null
                    ? `${formatBdt(order.budget_min_bdt)} – ${formatBdt(
                        order.budget_max_bdt,
                      )}`
                    : order.budget_max_bdt !== null
                      ? `Up to ${formatBdt(order.budget_max_bdt)}`
                      : order.budget_min_bdt !== null
                        ? `From ${formatBdt(order.budget_min_bdt)}`
                        : "Open budget";

                return (
                  <tr key={order.id} className="align-top hover:bg-secondary/20">
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/custom-orders/${order.request_code}`}
                        className="font-mono text-xs font-semibold transition-colors hover:text-primary"
                      >
                        {order.request_code}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(order.created_at)}
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
                    <td className="px-4 py-4">
                      <p className="text-sm">
                        {artisan?.displayName ?? "Studio unavailable"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {artisan?.district ?? category?.name ?? "Handcrafted"}
                      </p>
                    </td>
                    <td className="max-w-56 px-4 py-4">
                      <p className="truncate text-sm">{order.product_type}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {order.quantity}{" "}
                        {order.quantity === 1 ? "piece" : "pieces"} ·{" "}
                        {eventCount} timeline{" "}
                        {eventCount === 1 ? "event" : "events"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {order.price_estimate_bdt !== null
                          ? formatBdt(order.price_estimate_bdt)
                          : budget}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {order.price_estimate_bdt !== null
                          ? "Estimate"
                          : "Customer budget"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <CustomOrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/custom-orders/${order.request_code}`}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
