import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MessageSquare, Star } from "lucide-react";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFilterPills } from "@/components/admin/admin-filter-pills";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { ReviewStatusBadge } from "@/components/admin/admin-badges";
import { SubmitButton } from "@/components/commerce/submit-button";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { REVIEW_STATUSES, parseReviewStatusFilter } from "@/lib/admin";
import { REVIEW_STATUS_LABELS } from "@/lib/constants";
import { moderateReviewAction } from "@/lib/actions/admin";
import { getAdminReviews } from "@/lib/data/admin";
import { formatDate } from "@/lib/format";
import type { ReviewStatus } from "@/lib/supabase/enums";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Review moderation",
  description: "Craft BD review moderation.",
  robots: { index: false, follow: false },
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...REVIEW_STATUSES.map((status) => ({
    value: status,
    label: REVIEW_STATUS_LABELS[status],
  })),
];

const SELECT_CLASS =
  "mt-1.5 block h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

const TEXTAREA_CLASS =
  "mt-1.5 block w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            star <= rating ? "fill-amber-500 text-amber-500" : "text-border",
          )}
          strokeWidth={1.4}
        />
      ))}
    </span>
  );
}

function decisionOptions(status: ReviewStatus) {
  return [
    { value: "publish", label: "Publish" },
    { value: "flag", label: "Flag" },
    { value: "remove", label: "Remove" },
    ...(status === "pending"
      ? []
      : [{ value: "restore", label: "Return to pending" }]),
  ].filter((option) => !(option.value === "publish" && status === "published"));
}

interface ReviewsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminReviewsPage(props: ReviewsPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={4} />}>
      <AdminReviewsContent {...props} />
    </Suspense>
  );
}

async function AdminReviewsContent({ searchParams }: ReviewsPageProps) {
  await requireAdmin("/admin/reviews");
  const search = await searchParams;
  const status = parseReviewStatusFilter(search.status);
  const reviews = await getAdminReviews({ status });
  const returnTo =
    status === "all" ? "/admin/reviews" : `/admin/reviews?status=${status}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        title="Review moderation"
        description={`${reviews.length} ${
          reviews.length === 1 ? "review" : "reviews"
        } in this view. Published reviews are the only ones that appear on product pages and in rating averages.`}
      />

      <AdminNotice notice={search.notice} />

      <div className="mt-6">
        <AdminFilterPills
          basePath="/admin/reviews"
          current={status}
          options={FILTER_OPTIONS}
        />
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8">
          <AdminEmptyState
            icon={MessageSquare}
            title="Nothing to moderate here"
            description="New reviews start pending. Flagged reviews stay visible here until a decision is made."
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {reviews.map(({ review, product, customer }) => (
            <li
              key={review.id}
              className="rounded-3xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {product ? (
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm font-semibold underline-offset-4 hover:text-primary hover:underline"
                      >
                        {product.title}
                      </Link>
                    ) : (
                      <span className="text-sm font-semibold">
                        Deleted catalogue piece
                      </span>
                    )}
                    <ReviewStatusBadge status={review.status} />
                    {review.is_verified_purchase ? (
                      <Badge variant="secondary">Verified purchase</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {customer?.fullName ?? "Customer"}
                    {customer?.email ? ` · ${customer.email}` : ""} ·{" "}
                    {formatDate(review.created_at, { dateStyle: "medium" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={review.rating} />
                  <span className="text-xs font-medium">{review.rating}/5</span>
                </div>
              </div>

              {review.title ? (
                <p className="mt-4 text-sm font-medium">{review.title}</p>
              ) : null}
              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground/85">
                {review.comment}
              </p>

              {review.flagged_reason ? (
                <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                  <span className="font-semibold">Flag reason: </span>
                  {review.flagged_reason}
                </p>
              ) : null}

              {review.admin_note ? (
                <p className="mt-2 rounded-2xl bg-secondary/60 px-3 py-2 text-xs leading-5 text-muted-foreground">
                  <span className="font-semibold">Admin note: </span>
                  {review.admin_note}
                </p>
              ) : null}

              <AdminActionForm
                action={moderateReviewAction}
                className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-[180px_1fr_auto] sm:items-end"
              >
                <input type="hidden" name="reviewId" value={review.id} />
                <input type="hidden" name="returnTo" value={returnTo} />
                <label className="block text-sm">
                  <span className="font-medium">Decision</span>
                  <select
                    name="decision"
                    required
                    defaultValue=""
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Choose
                    </option>
                    {decisionOptions(review.status).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-medium">
                    Note or reason{" "}
                    <span className="font-normal text-muted-foreground">
                      (required to flag or remove)
                    </span>
                  </span>
                  <textarea
                    name="note"
                    rows={2}
                    maxLength={1_000}
                    placeholder="Explain the decision for the audit trail."
                    className={TEXTAREA_CLASS}
                  />
                </label>
                <SubmitButton
                  size="sm"
                  pendingLabel="Saving…"
                  className="h-11"
                >
                  Save decision
                </SubmitButton>
              </AdminActionForm>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
