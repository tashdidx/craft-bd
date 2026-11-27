"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import type { ProductCardData } from "@/types/domain";

interface FeaturedProductsCarouselProps {
  products: ProductCardData[];
}

export function FeaturedProductsCarousel({
  products,
}: FeaturedProductsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSlideRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideStep, setSlideStep] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const slides = [
    ...products,
    ...(products.length > 1
      ? Array.from({ length: 3 }, (_, index) => products[index % products.length])
      : []),
  ];

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(
        window.matchMedia("(min-width: 1024px)").matches
          ? 3
          : window.matchMedia("(min-width: 640px)").matches
            ? 2
            : 1,
      );
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const firstSlide = firstSlideRef.current;
    if (!track || !firstSlide) return;

    const measureSlideStep = () => {
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap);
      setSlideStep(firstSlide.getBoundingClientRect().width + (gap || 0));
    };

    measureSlideStep();
    const observer = new ResizeObserver(measureSlideStep);
    observer.observe(track);
    return () => observer.disconnect();
  }, [products.length]);

  useEffect(() => {
    if (isPaused || products.length < 2 || slideStep === 0) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) =>
        current >= products.length ? current : current + 1,
      );
    }, 2_000);

    return () => window.clearInterval(timer);
  }, [isPaused, products.length, slideStep]);

  useEffect(() => {
    if (activeIndex !== products.length) return;

    const timer = window.setTimeout(() => {
      setTransitionEnabled(false);
      setActiveIndex(0);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [activeIndex, products.length]);

  useEffect(() => {
    if (transitionEnabled) return;

    const frame = window.requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [transitionEnabled]);

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Featured pieces
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl">
            A first look at the catalogue.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products?sort=newest"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            See new arrivals
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          {products.length > 1 ? (
            <button
              type="button"
              onClick={() => setIsPaused((paused) => !paused)}
              aria-label={
                isPaused
                  ? "Resume featured products rotation"
                  : "Pause featured products rotation"
              }
              aria-controls="featured-products-track"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isPaused ? (
                <Play aria-hidden="true" className="size-4" />
              ) : (
                <Pause aria-hidden="true" className="size-4" />
              )}
            </button>
          ) : null}
        </div>
      </div>

      <div
        className="mt-8 overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured products"
        aria-live="off"
        onFocusCapture={() => setIsPaused(true)}
      >
        <div
          id="featured-products-track"
          ref={trackRef}
          className={`flex gap-5 ${
            transitionEnabled
              ? "transition-transform duration-500 ease-out motion-reduce:transition-none"
              : "transition-none"
          }`}
          style={{
            transform: `translate3d(-${activeIndex * slideStep}px, 0, 0)`,
          }}
        >
          {slides.map((product, slideIndex) => {
            const isVisible =
              slideIndex >= activeIndex &&
              slideIndex < activeIndex + visibleCount;

            return (
              <div
                key={`${product.id}-${slideIndex}`}
                ref={slideIndex === 0 ? firstSlideRef : undefined}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(slideIndex % products.length) + 1} of ${products.length}`}
                aria-hidden={!isVisible}
                inert={!isVisible}
                className="min-w-0 shrink-0 basis-full sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)]"
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
