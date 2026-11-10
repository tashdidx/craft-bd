import { BadgeCheck, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  initials: string;
  location: string;
  piece: string;
}

const FEATURED: Testimonial = {
  quote:
    "The weaving is so fine that the lotus motifs seem to float. It arrived folded in muslin with the maker's name, her district, and the story of the loom — and my mother recognised the pattern from her own wedding saree.",
  name: "Nusrat Jahan",
  initials: "NJ",
  location: "Dhanmondi, Dhaka",
  piece: "Midnight Lotus Jamdani Saree",
};

const NOTES: readonly Testimonial[] = [
  {
    quote:
      "I bought the kalash as a housewarming gift. The certificate code checked out in seconds, and the finish is warmer than the photographs suggested.",
    name: "Farhan Ahmed",
    initials: "FA",
    location: "Agrabad, Chattogram",
    piece: "Dhamrai Brass Kalash",
  },
  {
    quote:
      "The colours are quieter in person, in the best way. You can feel that it was woven by hand, and it was wrapped carefully enough to keep it that way.",
    name: "Shirin Akter",
    initials: "SA",
    location: "Zindabazar, Sylhet",
    piece: "Shital Pati Cushion Cover",
  },
];

function Stars({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label="Rated 5 out of 5"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            tone === "light"
              ? "fill-amber-300 text-amber-300"
              : "fill-amber-500 text-amber-500",
          )}
          strokeWidth={1.4}
        />
      ))}
    </span>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pt-20 sm:px-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            In their words
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            Pieces that arrive with their story intact.
          </h2>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
          <Stars />
          <span className="text-sm font-semibold">4.9</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            average from 128 delivered orders
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <figure className="relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[2rem] bg-accent px-7 py-8 text-accent-foreground sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-[radial-gradient(circle,rgba(246,239,228,0.18),transparent_66%)]"
          />
          <Quote
            aria-hidden="true"
            className="absolute top-7 right-8 size-14 rotate-180 text-accent-foreground/10"
            strokeWidth={1}
          />

          <div className="relative">
            <Stars tone="light" />
            <blockquote className="mt-6 text-balance font-display text-[1.45rem] leading-[1.45] sm:text-[1.7rem] sm:leading-[1.4]">
              “{FEATURED.quote}”
            </blockquote>
          </div>

          <figcaption className="relative mt-8 flex items-center gap-4 border-t border-accent-foreground/15 pt-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-accent-foreground/25 bg-accent-foreground/10 font-display text-lg">
              {FEATURED.initials}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{FEATURED.name}</p>
              <p className="mt-0.5 text-xs leading-5 text-accent-foreground/65">
                {FEATURED.location} · {FEATURED.piece}
              </p>
            </div>
            <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full border border-accent-foreground/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground/70 sm:inline-flex">
              <BadgeCheck
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={1.8}
              />
              Verified
            </span>
          </figcaption>
        </figure>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {NOTES.map((note) => (
            <figure
              key={note.name}
              className="flex h-full min-w-0 flex-col justify-between rounded-[2rem] border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <Stars />
                  <Quote
                    aria-hidden="true"
                    className="size-6 text-primary/25"
                    strokeWidth={1.2}
                  />
                </div>
                <blockquote className="mt-4 text-sm leading-6 text-foreground/90">
                  “{note.quote}”
                </blockquote>
              </div>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
                  {note.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{note.name}</p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {note.location} · {note.piece}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
