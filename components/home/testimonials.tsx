 "use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Quote, Star } from "lucide-react";
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

const FEATURED_STORIES: readonly Testimonial[] = [
  FEATURED,
  {
    quote:
      "The embroidery is delicate, but the story card made it feel even more special. I loved being able to see the artisan's district and the different stages of making before giving it as a wedding gift.",
    name: "Maliha Chowdhury",
    initials: "MC",
    location: "Gulshan, Dhaka",
    piece: "Nakshi Kantha Wedding Panel",
  },
  {
    quote:
      "It feels like a piece of Bangladesh that belongs in our home. The brass has a beautiful hand-finished texture, and the verification record gave me confidence that I was buying from the right source.",
    name: "Tanvir Rahman",
    initials: "TR",
    location: "Uttara, Dhaka",
    piece: "Hand-hammered Brass Bowl",
  },
];

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
  {
    quote:
      "The parcel was thoughtful from the first layer to the last. The pottery has tiny variations that make it feel alive, not mass-produced.",
    name: "Rafiq Hasan",
    initials: "RH",
    location: "Khulna Sadar, Khulna",
    piece: "Dhamrai Terracotta Vase",
  },
  {
    quote:
      "I found a gift with meaning instead of something generic. The maker profile and provenance trail made the purchase feel personal.",
    name: "Samia Karim",
    initials: "SK",
    location: "Nasirabad, Chattogram",
    piece: "Jamdani Table Runner",
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
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [notesOffset, setNotesOffset] = useState(0);
  const featured = FEATURED_STORIES[featuredIndex];
  const visibleNotes = [
    NOTES[notesOffset],
    NOTES[(notesOffset + 1) % NOTES.length],
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % FEATURED_STORIES.length);
      setNotesOffset((current) => (current + 1) % NOTES.length);
    }, 5_000);

    return () => window.clearInterval(timer);
  }, []);

  const previousFeatured = () => {
    setFeaturedIndex(
      (current) =>
        (current - 1 + FEATURED_STORIES.length) % FEATURED_STORIES.length,
    );
  };

  const nextFeatured = () => {
    setFeaturedIndex((current) => (current + 1) % FEATURED_STORIES.length);
  };

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

      <div className="mt-8 grid h-[980px] min-h-0 gap-4 overflow-hidden sm:h-[760px] lg:h-[520px] lg:grid-cols-[1.08fr_0.92fr]">
        <figure
          key={featured.name}
          className="relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[2rem] bg-accent px-7 py-8 text-accent-foreground animate-[testimonial-slide-in_550ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none sm:px-10 sm:py-10"
        >
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
              “{featured.quote}”
            </blockquote>
          </div>

          <figcaption className="relative mt-8 flex items-center gap-4 border-t border-accent-foreground/15 pt-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-accent-foreground/25 bg-accent-foreground/10 font-display text-lg">
              {featured.initials}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{featured.name}</p>
              <p className="mt-0.5 text-xs leading-5 text-accent-foreground/65">
                {featured.location} · {featured.piece}
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
          <div className="relative mt-6 flex items-center justify-between border-t border-accent-foreground/15 pt-4">
            <div className="flex items-center gap-1.5" aria-label="Featured testimonial">
              {FEATURED_STORIES.map((story, index) => (
                <button
                  key={story.name}
                  type="button"
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-current={index === featuredIndex ? "true" : undefined}
                  onClick={() => setFeaturedIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === featuredIndex
                      ? "w-7 bg-accent-foreground"
                      : "w-1.5 bg-accent-foreground/35 hover:bg-accent-foreground/60",
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={previousFeatured}
                aria-label="Previous testimonial"
                className="grid size-8 place-items-center rounded-full border border-accent-foreground/20 text-accent-foreground/75 transition-colors hover:bg-accent-foreground/10 hover:text-accent-foreground"
              >
                <ArrowLeft aria-hidden="true" className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={nextFeatured}
                aria-label="Next testimonial"
                className="grid size-8 place-items-center rounded-full border border-accent-foreground/20 text-accent-foreground/75 transition-colors hover:bg-accent-foreground/10 hover:text-accent-foreground"
              >
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </button>
            </div>
          </div>
        </figure>

        <div className="grid min-h-0 min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {visibleNotes.map((note) => (
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
