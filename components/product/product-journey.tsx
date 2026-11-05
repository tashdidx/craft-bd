import Image from "next/image";
import { Clock } from "lucide-react";
import { JOURNEY_STAGES } from "@/lib/constants";
import type { CraftJourney } from "@/types/domain";

export function ProductJourney({ journey }: { journey: CraftJourney[] }) {
  if (journey.length === 0) return null;

  return (
    <ol className="mt-10">
      {journey.map((step, index) => {
        const stage = JOURNEY_STAGES.find((item) => item.stage === step.stage);

        return (
          <li
            key={step.id}
            className="relative grid gap-5 border-l border-border pb-10 pl-9 last:border-transparent last:pb-0 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-start"
          >
            <span
              aria-hidden="true"
              className="absolute -left-4 top-0 grid size-8 place-items-center rounded-full bg-primary text-[11px] font-semibold tabular-nums text-primary-foreground"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {stage?.label ?? step.stage.replace(/_/g, " ")}
              </p>
              <h4 className="mt-1.5 text-xl leading-snug">{step.title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
              {step.duration_label ? (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  <Clock
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.8}
                  />
                  {step.duration_label}
                </p>
              ) : null}
            </div>

            {step.image_url ? (
              <div className="relative h-36 overflow-hidden rounded-2xl border border-border bg-secondary sm:h-28">
                <Image
                  src={step.image_url}
                  alt={`${step.title} — ${stage?.label ?? "craft stage"}`}
                  fill
                  sizes="(min-width: 640px) 220px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
