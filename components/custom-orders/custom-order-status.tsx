import { Check, CircleDot, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  CUSTOM_ORDER_STATUS_LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { CustomOrderEvent, CustomOrderStatus } from "@/types/domain";
import { cn } from "@/lib/utils";

export function customOrderStatusVariant(status: CustomOrderStatus) {
  switch (status) {
    case "completed":
    case "approved":
      return "success" as const;
    case "in_production":
    case "quality_check":
    case "dispatched":
      return "accent" as const;
    case "quoted":
      return "warning" as const;
    case "declined":
    case "cancelled":
      return "outline" as const;
    case "submitted":
    default:
      return "secondary" as const;
  }
}

export function CustomOrderStatusBadge({
  status,
}: {
  status: CustomOrderStatus;
}) {
  return (
    <Badge variant={customOrderStatusVariant(status)}>
      {CUSTOM_ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

interface CustomOrderTimelineProps {
  events: CustomOrderEvent[];
  status: CustomOrderStatus;
  customerId: string;
  createdAt: string;
}

function actorLabel(
  actorId: string | null,
  customerId: string,
): string {
  if (!actorId) return "Craft BD";
  return actorId === customerId ? "You" : "Studio";
}

export function CustomOrderTimeline({
  events,
  status,
  customerId,
  createdAt,
}: CustomOrderTimelineProps) {
  const entries =
    events.length > 0
      ? events
      : [
          {
            id: "fallback-submitted",
            custom_order_id: "",
            status: "submitted" as const,
            note: "Request submitted.",
            actor_id: customerId,
            created_at: createdAt,
          },
        ];
  const closed = status === "declined" || status === "cancelled";

  return (
    <ol className="relative">
      {entries.map((event, index) => {
        const isLast = index === entries.length - 1;
        const isClosedStep =
          closed &&
          isLast &&
          (event.status === "declined" || event.status === "cancelled");

        return (
          <li
            key={event.id}
            className="relative flex gap-4 pb-7 last:pb-0"
            aria-current={isLast ? "step" : undefined}
          >
            {!isLast ? (
              <span
                aria-hidden="true"
                className="absolute top-8 left-[15px] h-[calc(100%-1.25rem)] w-px bg-border"
              />
            ) : null}

            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border",
                isLast
                  ? isClosedStep
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-primary/40 bg-primary text-primary-foreground"
                  : "border-border bg-card text-primary",
              )}
            >
              {isClosedStep ? (
                <X aria-hidden="true" className="size-4" strokeWidth={2} />
              ) : isLast ? (
                <CircleDot
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={2}
                />
              ) : (
                <Check aria-hidden="true" className="size-4" strokeWidth={2} />
              )}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-sm font-medium">
                  {CUSTOM_ORDER_STATUS_LABELS[event.status]}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {actorLabel(event.actor_id, customerId)} ·{" "}
                  {formatDate(event.created_at, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {event.note ? (
                <p className="mt-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm leading-6 text-foreground/85">
                  {event.note}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
