"use client";

import { useEffect, useRef, useState } from "react";
import { Gem, Hammer, Users } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CatalogueStat {
  label: string;
  value: number;
}

const STAT_ICONS = [Gem, Users, Hammer] as const;

export function CatalogueStats({ stats }: { stats: readonly CatalogueStat[] }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [displayValues, setDisplayValues] = useState(() =>
    stats.map(() => 0),
  );
  const statsRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const element = statsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = performance.now();
    const duration = 3_200;
    let frame = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayValues(
        stats.map((stat) => Math.round(stat.value * easedProgress)),
      );

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, stats]);

  return (
    <dl
      ref={statsRef}
      className="grid max-w-5xl grid-cols-3 gap-3 py-6 sm:gap-4 sm:py-8 mx-auto"
    >
      {stats.map((stat, index) => {
        const Icon = STAT_ICONS[index % STAT_ICONS.length];

        return (
          <div
            key={stat.label}
            className={cn(
              "group rounded-2xl border border-border/80 bg-card/85 px-3 py-4 shadow-[0_12px_35px_-28px_rgba(43,33,25,0.65)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_40px_-28px_rgba(154,63,36,0.6)] sm:px-5 sm:py-5",
              hasStarted &&
                "animate-[stats-card-in_550ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none",
            )}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <dt className="flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
              </span>
              <span className="leading-4">{stat.label}</span>
            </dt>
            <dd
              className="mt-3 font-display text-4xl leading-none text-foreground sm:text-4xl"
              aria-label={`${formatNumber(stat.value)} ${stat.label}`}
            >
              {formatNumber(displayValues[index])}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
