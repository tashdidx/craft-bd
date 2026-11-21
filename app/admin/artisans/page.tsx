import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, Star, Users } from "lucide-react";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFilterPills } from "@/components/admin/admin-filter-pills";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { AdminSearchForm } from "@/components/admin/admin-search-form";
import { ArtisanStatusBadge } from "@/components/admin/admin-badges";
import { SubmitButton } from "@/components/commerce/submit-button";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import {
  ARTISAN_STATUSES,
  parseArtisanStatusFilter,
  searchParam,
} from "@/lib/admin";
import { ARTISAN_STATUS_LABELS, DIVISION_LABELS } from "@/lib/constants";
import { updateArtisanAction } from "@/lib/actions/admin";
import { getAdminArtisans } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Artisans",
  description: "Craft BD artisan operations.",
  robots: { index: false, follow: false },
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...ARTISAN_STATUSES.map((status) => ({
    value: status,
    label: ARTISAN_STATUS_LABELS[status],
  })),
];

const SELECT_CLASS =
  "mt-1.5 block h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

interface ArtisansPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminArtisansPage(props: ArtisansPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={5} />}>
      <AdminArtisansContent {...props} />
    </Suspense>
  );
}

async function AdminArtisansContent({ searchParams }: ArtisansPageProps) {
  await requireAdmin("/admin/artisans");
  const search = await searchParams;
  const status = parseArtisanStatusFilter(search.status);
  const q = searchParam(search.q);
  const artisans = await getAdminArtisans({ status, q });

  const returnParams = new URLSearchParams();
  if (status !== "all") returnParams.set("status", status);
  if (q) returnParams.set("q", q);
  const returnTo =
    returnParams.size > 0
      ? `/admin/artisans?${returnParams.toString()}`
      : "/admin/artisans";

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        title="Artisan studios"
        description={`${artisans.length} ${
          artisans.length === 1 ? "studio" : "studios"
        }${q ? ` matching “${q}”` : ""}. Approve applications, suspend a studio, or choose featured makers for the home page.`}
      />

      <AdminNotice notice={search.notice} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <AdminFilterPills
          basePath="/admin/artisans"
          current={status}
          options={FILTER_OPTIONS}
          q={q}
        />
        <AdminSearchForm
          basePath="/admin/artisans"
          status={status}
          q={q}
          placeholder="Search studio name"
        />
      </div>

      {artisans.length === 0 ? (
        <div className="mt-8">
          <AdminEmptyState
            icon={Users}
            title={q ? "No studios match that search" : "No studios in this view"}
            description={
              q
                ? "Search matches the studio display name. Clear the search or choose another status."
                : "New artisan applications appear here as pending."
            }
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {artisans.map(({ artisan, primaryCategory, productCount }) => (
            <li
              key={artisan.id}
              className="rounded-3xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {artisan.avatar_url ? (
                  <Image
                    src={artisan.avatar_url}
                    alt={`Portrait of ${artisan.display_name}`}
                    width={64}
                    height={64}
                    className="size-16 shrink-0 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span className="grid size-16 shrink-0 place-items-center rounded-full bg-secondary font-display text-xl text-secondary-foreground">
                    {artisan.display_name.charAt(0).toUpperCase()}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/artisans/${artisan.slug}`}
                      className="text-sm font-semibold underline-offset-4 hover:text-primary hover:underline"
                    >
                      {artisan.display_name}
                    </Link>
                    <ArtisanStatusBadge status={artisan.status} />
                    {artisan.is_featured ? (
                      <Badge variant="accent">
                        <Star
                          aria-hidden="true"
                          className="size-3 fill-current"
                          strokeWidth={1.6}
                        />
                        Featured
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {artisan.workshop_name ?? "Independent studio"} ·{" "}
                    {primaryCategory?.name ?? artisan.craft_specialization}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {artisan.district}, {DIVISION_LABELS[artisan.region]} ·{" "}
                    {productCount}{" "}
                    {productCount === 1 ? "listed piece" : "listed pieces"} ·{" "}
                    {artisan.years_of_experience} years of practice
                  </p>
                  <Link
                    href={`/artisans/${artisan.slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View public profile
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5"
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>

                <details className="w-full shrink-0 sm:w-64">
                  <summary className="cursor-pointer list-none rounded-full border border-border bg-background px-4 py-2 text-center text-xs font-medium transition-colors hover:border-primary/40 [&::-webkit-details-marker]:hidden">
                    Edit approval &amp; featuring
                  </summary>
                  <AdminActionForm
                    action={updateArtisanAction}
                    className="mt-3 rounded-2xl border border-border bg-background/60 p-4"
                  >
                    <input type="hidden" name="artisanId" value={artisan.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <label className="block text-xs">
                      <span className="font-medium">Studio status</span>
                      <select
                        name="status"
                        defaultValue={artisan.status}
                        className={SELECT_CLASS}
                      >
                        {ARTISAN_STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {ARTISAN_STATUS_LABELS[value]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mt-3 flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        defaultChecked={artisan.is_featured}
                        className="size-4 rounded border-border"
                      />
                      <span className="font-medium">Feature on the home page</span>
                    </label>
                    <SubmitButton
                      className="mt-4 w-full"
                      size="sm"
                      pendingLabel="Saving studio…"
                    >
                      Save studio
                    </SubmitButton>
                  </AdminActionForm>
                </details>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
