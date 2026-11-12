import { BadgeCheck, MessageSquare, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { ProductReview } from "@/types/domain";
import { cn } from "@/lib/utils";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
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
            size === "md" ? "size-4" : "size-3.5",
            star <= rating
              ? "fill-amber-500 text-amber-500"
              : "text-border",
          )}
          strokeWidth={1.4}
        />
      ))}
    </span>
  );
}

export function ProductReviews({
  reviews,
  ratingAverage,
  reviewCount,
  productTitle,
}: {
  reviews: ProductReview[];
  ratingAverage: number | null;
  reviewCount: number;
  productTitle: string;
}) {
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;
    return {
      rating,
      count,
      percent: reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0,
    };
  });

  return (
    <section id="reviews" className="mt-16 scroll-mt-24">
      <div className="grid gap-8 border-t border-border pt-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Buyer reviews
          </p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
            What arrived, in their words.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Reviews on {productTitle} come from verified purchases only. Each one
            is written after delivery and published after moderation.
          </p>

          <div className="mt-6 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-end gap-4">
              <p className="font-display text-5xl leading-none">
                {ratingAverage === null ? "—" : ratingAverage.toFixed(1)}
              </p>
              <div className="pb-1">
                <Stars rating={Math.round(ratingAverage ?? 0)} size="md" />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {reviewCount} published{" "}
                  {reviewCount === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-2">
              {distribution.map((row) => (
                <div key={row.rating} className="flex items-center gap-3">
                  <dt className="flex w-8 shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    {row.rating}
                    <Star
                      aria-hidden="true"
                      className="size-3 fill-amber-500 text-amber-500"
                      strokeWidth={1.2}
                    />
                  </dt>
                  <dd className="flex flex-1 items-center gap-2">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full bg-amber-500"
                        style={{ width: `${row.percent}%` }}
                      />
                    </span>
                    <span className="w-6 text-right text-xs tabular-nums text-muted-foreground">
                      {row.count}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div>
          {reviews.length === 0 ? (
            <div className="grid h-full place-items-center rounded-[2rem] border border-dashed border-border bg-card/60 px-6 py-16 text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <MessageSquare
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.5}
                  />
                </span>
                <p className="mt-4 text-lg font-medium">No reviews yet</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Buyers can review this piece after their order is delivered.
                  Published reviews will appear here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Stars rating={review.rating} />
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {review.title ? (
                    <p className="mt-3 text-sm font-semibold leading-snug">
                      {review.title}
                    </p>
                  ) : null}
                  <p className="mt-2 flex-1 text-sm leading-6 text-foreground/85">
                    {review.comment}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    {review.isVerifiedPurchase ? (
                      <Badge variant="success">
                        <BadgeCheck
                          aria-hidden="true"
                          className="size-3"
                          strokeWidth={2}
                        />
                        Verified purchase
                      </Badge>
                    ) : (
                      <Badge variant="outline">Customer review</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Verified buyer
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
