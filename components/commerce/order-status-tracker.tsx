import { Check, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
} from "@/lib/constants";
import { orderStatusBadgeVariant, orderStatusIndex } from "@/lib/commerce";
import type { OrderStatus } from "@/lib/supabase/enums";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={orderStatusBadgeVariant(status)}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = orderStatusIndex(status);
  const cancelled = status === "cancelled";

  return (
    <div>
      <ol className="grid gap-3 sm:grid-cols-4">
        {ORDER_STATUS_FLOW.map((step, index) => {
          const complete = !cancelled && index < currentIndex;
          const current = !cancelled && index === currentIndex;

          return (
            <li
              key={step}
              aria-current={current ? "step" : undefined}
              className={cn(
                "rounded-2xl border p-4",
                current
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card",
                cancelled && "opacity-60",
              )}
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-xs font-semibold",
                  complete
                    ? "bg-primary text-primary-foreground"
                    : current
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {complete ? (
                  <Check aria-hidden="true" className="size-4" strokeWidth={2} />
                ) : current ? (
                  <CircleDot
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={2}
                  />
                ) : (
                  index + 1
                )}
              </span>
              <p className="mt-3 text-sm font-medium">
                {ORDER_STATUS_LABELS[step]}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {ORDER_STATUS_DESCRIPTIONS[step]}
              </p>
            </li>
          );
        })}
      </ol>

      {cancelled ? (
        <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {ORDER_STATUS_DESCRIPTIONS.cancelled}
        </p>
      ) : null}
    </div>
  );
}
