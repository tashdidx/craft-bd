import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number | null;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({
  value,
  count = 0,
  showCount = true,
  size = "sm",
  className,
}: StarRatingProps) {
  if (value === null) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        No reviews yet
      </span>
    );
  }

  const rounded = Math.round(value);
  const starSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rated ${value.toFixed(1)} out of 5 from ${count} review${
        count === 1 ? "" : "s"
      }`}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rounded
                ? "fill-amber-500 text-amber-500"
                : "fill-transparent text-border",
            )}
            strokeWidth={1.5}
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-foreground">
        {value.toFixed(1)}
      </span>
      {showCount && count > 0 ? (
        <span className="text-xs text-muted-foreground">({count})</span>
      ) : null}
    </span>
  );
}
