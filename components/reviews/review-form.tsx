"use client";

import { useActionState } from "react";
import { MessageSquarePlus, Star } from "lucide-react";
import { SubmitButton } from "@/components/commerce/submit-button";
import { Badge } from "@/components/ui/badge";
import {
  INITIAL_REVIEW_STATE,
  type ReviewFieldName,
} from "@/lib/review-state";
import { submitReviewAction } from "@/lib/actions/reviews";
import { REVIEW_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types/domain";
import { cn } from "@/lib/utils";

const INPUT_CLASS =
  "mt-1.5 block h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

const TEXTAREA_CLASS =
  "mt-1.5 block w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

function FieldError({
  name,
  errors,
}: {
  name: ReviewFieldName;
  errors: Partial<Record<ReviewFieldName, string[]>> | undefined;
}) {
  const message = errors?.[name]?.[0];
  if (!message) return null;

  return (
    <p id={`${name}-error`} className="mt-1.5 text-xs leading-5 text-red-700">
      {message}
    </p>
  );
}

function ReviewStars({ rating }: { rating: number }) {
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

export function ReviewForm({
  orderItemId,
  productTitle,
  existingReview,
}: {
  orderItemId: string;
  productTitle: string;
  existingReview: Review | null;
}) {
  const [state, formAction] = useActionState(
    submitReviewAction,
    INITIAL_REVIEW_STATE,
  );

  if (existingReview) {
    return (
      <div className="rounded-2xl border border-border bg-secondary/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ReviewStars rating={existingReview.rating} />
            <Badge
              variant={
                existingReview.status === "published" ? "success" : "warning"
              }
            >
              {REVIEW_STATUS_LABELS[existingReview.status]}
            </Badge>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {formatDate(existingReview.created_at)}
          </span>
        </div>

        {existingReview.title ? (
          <p className="mt-3 text-sm font-medium">{existingReview.title}</p>
        ) : null}
        <p className="mt-1 text-sm leading-6 text-foreground/85">
          {existingReview.comment}
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {existingReview.status === "published"
            ? "Published on the product page."
            : "Waiting for the Craft BD team to publish it. You can write one review per piece."}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-dashed border-border bg-card p-4"
    >
      <input type="hidden" name="orderItemId" value={orderItemId} />

      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <MessageSquarePlus
            aria-hidden="true"
            className="size-4"
            strokeWidth={1.7}
          />
        </span>
        <div>
          <p className="text-sm font-medium">Review {productTitle}</p>
          <p className="text-xs text-muted-foreground">
            Verified purchase · published after moderation
          </p>
        </div>
      </div>

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800"
        >
          {state.message}
        </p>
      ) : null}

      {state.status === "success" && state.message ? (
        <p
          role="status"
          className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-800"
        >
          {state.message}
        </p>
      ) : null}

      <fieldset className="mt-4">
        <legend className="text-sm font-medium">Your rating</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                required
                defaultChecked={
                  (state.values?.rating ?? "5") === String(rating)
                }
                className="peer sr-only"
              />
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors peer-checked:border-amber-400 peer-checked:bg-amber-50 peer-checked:text-amber-900 peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                <Star
                  aria-hidden="true"
                  className="size-3.5 fill-current"
                  strokeWidth={1.4}
                />
                {rating}
              </span>
            </label>
          ))}
        </div>
        <FieldError name="rating" errors={state.errors} />
      </fieldset>

      <label className="mt-4 block text-sm">
        <span className="font-medium">
          Headline{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </span>
        <input
          type="text"
          name="title"
          maxLength={120}
          placeholder="Worth the wait"
          defaultValue={state.values?.title ?? ""}
          className={INPUT_CLASS}
        />
        <FieldError name="title" errors={state.errors} />
      </label>

      <label className="mt-4 block text-sm">
        <span className="font-medium">Your review</span>
        <textarea
          name="comment"
          required
          rows={4}
          minLength={10}
          maxLength={1_200}
          placeholder="What is the weave, finish, weight, or detail like in person? How does it feel to use or wear?"
          defaultValue={state.values?.comment ?? ""}
          aria-invalid={Boolean(state.errors?.comment)}
          className={TEXTAREA_CLASS}
        />
        <FieldError name="comment" errors={state.errors} />
      </label>

      <SubmitButton
        className="mt-4 w-full"
        size="sm"
        pendingLabel="Submitting review…"
      >
        Submit review
      </SubmitButton>
    </form>
  );
}
