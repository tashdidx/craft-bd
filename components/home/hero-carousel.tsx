"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  note: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}

const SLIDES: readonly HeroSlide[] = [
  {
    id: "jamdani",
    eyebrow: "A marketplace with memory",
    title: "Handmade in Bangladesh, carried with its story.",
    description: SITE.description,
    image: "/crafts/jamdani.svg",
    tag: "Jamdani · Rupganj",
    note: "Maker, origin, material story, six-stage journey, and a certificate code — attached to every published piece.",
    primary: { href: "/products", label: "Browse the catalogue" },
    secondary: { href: "/#our-promise", label: "How provenance works" },
  },
  {
    id: "clay",
    eyebrow: "Living craft traditions",
    title: "Clay remembers the hand that shaped it.",
    description:
      "Wheel-thrown vessels and hand-modelled terracotta from Dhamrai, fired in small batches and finished without hiding the maker's touch.",
    image: "/crafts/clay-pottery.svg",
    tag: "Terracotta · Dhamrai",
    note: "Each studio carries its district, its firing tradition, and the years its makers have spent at the wheel.",
    primary: {
      href: "/products?category=clay-pottery",
      label: "Explore clay & terracotta",
    },
    secondary: { href: "/artisans", label: "Meet the makers" },
  },
  {
    id: "kantha",
    eyebrow: "The story held",
    title: "Every stitch carries a story.",
    description:
      "Nakshi kantha turns worn cloth into a record of family memory — thousands of running stitches, each one placed by hand.",
    image: "/crafts/nakshi-kantha.svg",
    tag: "Nakshi kantha · Jamalpur",
    note: "Origin, history, traditional use, materials, and cultural meaning are recorded alongside the piece.",
    primary: {
      href: "/products?category=nakshi-kantha",
      label: "Discover nakshi kantha",
    },
    secondary: { href: "/gifts", label: "Find a meaningful gift" },
  },
  {
    id: "provenance",
    eyebrow: "Provenance recorded",
    title: "Know the maker. Keep the record.",
    description:
      "Every piece arrives with its studio, origin, six-stage making journey, and a certificate code you can check against the live record.",
    image: "/crafts/brass-ware.svg",
    tag: "Brass · Dhamrai",
    note: "A SHA-256 certificate hash ties the printed code to the recorded payload. Scan it or enter the code to verify.",
    primary: { href: "/verify", label: "Verify a certificate" },
    secondary: { href: "/artisans", label: "Meet the makers" },
  },
];

const AUTOPLAY_MS = 7_000;
const SWIPE_THRESHOLD = 48;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const activeSlide = SLIDES[active];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!autoplay || paused || reduceMotion) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);

    return () => window.clearTimeout(timer);
  }, [active, autoplay, paused, reduceMotion]);

  const goTo = useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length);
  }, []);

  const previous = useCallback(() => {
    setActive((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % SLIDES.length);
  }, []);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setPaused(false);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) < Math.abs(deltaY) * 1.4
    ) {
      return;
    }

    if (deltaX < 0) next();
    else previous();
  };

  const trackStyle = { transform: `translate3d(-${active * 100}%, 0, 0)` };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured craft traditions"
      className="relative isolate flex min-h-[560px] w-full touch-pan-y flex-col overflow-hidden bg-[#110c09] sm:min-h-[620px] lg:min-h-[680px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={handleBlur}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragStart.current = null;
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="flex h-full w-full will-change-transform transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={trackStyle}
        >
          {SLIDES.map((slide, index) => {
            const isActive = index === active;

            return (
              <div key={slide.id} className="relative h-full w-full shrink-0">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  preload={index === 0}
                  sizes="100vw"
                  draggable={false}
                  className={cn(
                    "select-none object-cover object-center transition-transform duration-[1400ms] ease-out motion-reduce:transition-none",
                    isActive ? "scale-100" : "scale-105",
                  )}
                />
              </div>
            );
          })}
        </div>

        <div className="hero-overlay absolute inset-0" />
        <div className="hero-bottom-fade absolute inset-x-0 bottom-0 h-52" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-5 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
        <div className="max-w-2xl overflow-hidden">
          <div
            className="flex will-change-transform transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={trackStyle}
          >
            {SLIDES.map((slide, index) => {
              const isActive = index === active;
              const Heading = isActive ? "h1" : "div";

              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${SLIDES.length}`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  className="w-full shrink-0 self-stretch"
                >
                  <div className="flex min-h-[350px] flex-col justify-center sm:min-h-[380px] lg:min-h-[400px]">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                      <Sparkles
                        aria-hidden="true"
                        className="size-3"
                        strokeWidth={1.8}
                      />
                      {slide.tag}
                    </div>

                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#e7b985]">
                      {slide.eyebrow}
                    </p>
                    <Heading className="mt-4 max-w-2xl text-5xl leading-[1.02] text-[#fbf7f0] sm:text-6xl lg:text-[4.15rem]">
                      {slide.title}
                    </Heading>
                    <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                      {slide.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="bg-[#f6efe4] text-[#2b2119] hover:bg-white"
                      >
                        <Link href={slide.primary.href}>
                          {slide.primary.label}
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                      >
                        <Link href={slide.secondary.href}>
                          {slide.secondary.label}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/15 pt-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              className="flex items-center gap-1.5"
              role="group"
              aria-label="Choose a slide"
            >
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
                  aria-current={index === active ? "true" : undefined}
                  className="group flex h-8 items-center rounded-full px-1"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-500",
                      index === active
                        ? "w-9 bg-[#f6efe4]"
                        : "w-2.5 bg-white/30 group-hover:bg-white/60",
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-1 hidden font-mono text-[11px] tracking-[0.2em] text-white/50 sm:inline">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(SLIDES.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => {
                  const nextValue = !autoplay;
                  setAutoplay(nextValue);
                  if (nextValue) setPaused(false);
                }}
                aria-label={autoplay ? "Pause slideshow" : "Play slideshow"}
                className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/15 hover:text-white"
              >
                {autoplay ? (
                  <Pause aria-hidden="true" className="size-3.5" />
                ) : (
                  <Play aria-hidden="true" className="size-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous slide"
                className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/15 hover:text-white"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/15 hover:text-white"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          <div className="hidden max-w-sm rounded-2xl border border-white/15 bg-black/25 p-4 backdrop-blur-md lg:block">
            <div className="flex items-center gap-2 text-[#e7b985]">
              <BadgeCheck
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.7}
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                Provenance trail
              </p>
            </div>
            <p
              key={active}
              className="mt-2 animate-[hero-note-in_450ms_cubic-bezier(0.22,1,0.36,1)] text-xs leading-5 text-white/70 motion-reduce:animate-none"
            >
              {activeSlide.note}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
