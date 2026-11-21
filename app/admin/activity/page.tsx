import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Activity, ArrowUpRight, ClipboardList } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFilterPills } from "@/components/admin/admin-filter-pills";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_ENTITY_TYPES, parseEntityTypeFilter } from "@/lib/admin";
import { getAdminActivity } from "@/lib/data/admin";
import { formatDate } from "@/lib/format";
import type { Json } from "@/lib/supabase/database.types";
import type { AdminActivityListItem } from "@/types/domain";

export const metadata: Metadata = {
  title: "Audit log",
  description: "Craft BD administrator activity.",
  robots: { index: false, follow: false },
};

const ENTITY_LABELS: Record<string, string> = {
  order: "Orders",
  custom_order: "Custom orders",
  review: "Reviews",
  product: "Products",
  artisan: "Artisans",
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...ADMIN_ENTITY_TYPES.map((entityType) => ({
    value: entityType,
    label: ENTITY_LABELS[entityType] ?? entityType,
  })),
];

function asRecord(value: Json): Record<string, Json | undefined> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return null;
}

function displayValue(value: Json | undefined) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return JSON.stringify(value);
}

function entityHref(entry: AdminActivityListItem) {
  const details = asRecord(entry.action.details);

  switch (entry.action.entity_type) {
    case "order":
      return typeof details?.order_number === "string"
        ? `/admin/orders/${details.order_number}`
        : "/admin/orders";
    case "custom_order":
      return typeof details?.request_code === "string"
        ? `/admin/custom-orders/${details.request_code}`
        : "/admin/custom-orders";
    case "review":
      return "/admin/reviews";
    case "product":
      return "/admin/products";
    case "artisan":
      return "/admin/artisans";
    default:
      return null;
  }
}

interface ActivityPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminActivityPage(props: ActivityPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={6} />}>
      <AdminActivityContent {...props} />
    </Suspense>
  );
}

async function AdminActivityContent({ searchParams }: ActivityPageProps) {
  await requireAdmin("/admin/activity");
  const search = await searchParams;
  const entityType = parseEntityTypeFilter(search.entityType);
  const activity = await getAdminActivity({ entityType });

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        title="Audit log"
        description="A chronological record of every back-office change. Recent entries are shown first, with the administrator, entity, and stored details."
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <AdminFilterPills
          basePath="/admin/activity"
          param="entityType"
          current={entityType}
          options={FILTER_OPTIONS}
        />
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ClipboardList
            aria-hidden="true"
            className="size-3.5 text-primary"
            strokeWidth={1.7}
          />
          {activity.length} {activity.length === 1 ? "entry" : "entries"}
        </p>
      </div>

      {activity.length === 0 ? (
        <div className="mt-8">
          <AdminEmptyState
            icon={Activity}
            title="No audit entries in this view"
            description="Order changes, estimate replies, review decisions, and catalogue edits are recorded here."
          />
        </div>
      ) : (
        <ol className="mt-6 space-y-3">
          {activity.map((entry) => {
            const details = asRecord(entry.action.details);
            const detailEntries = Object.entries(details ?? {}).filter(
              ([, value]) =>
                value !== null && value !== undefined && value !== "",
            );
            const href = entityHref(entry);

            return (
              <li
                key={entry.action.id}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold">
                        {entry.action.action}
                      </span>
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary-foreground">
                        {entry.action.entity_type.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.admin?.fullName ?? "Administrator"}
                      {entry.admin?.email ? ` · ${entry.admin.email}` : ""} ·{" "}
                      {formatDate(entry.action.created_at, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  {href ? (
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Open record
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5"
                        strokeWidth={1.8}
                      />
                    </Link>
                  ) : null}
                </div>

                {detailEntries.length > 0 ? (
                  <dl className="mt-3 grid gap-x-6 gap-y-1 border-t border-border pt-3 text-xs sm:grid-cols-2">
                    {detailEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <dt className="text-muted-foreground">
                          {key.replaceAll("_", " ")}
                        </dt>
                        <dd className="break-all text-right font-medium">
                          {displayValue(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    No additional details were recorded.
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
