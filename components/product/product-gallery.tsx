"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
  alt_text: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  title: string;
  isFeatured: boolean;
}

export function ProductGallery({
  images,
  title,
  isFeatured,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return (
      <div className="grid aspect-square place-items-center rounded-[2rem] border border-border bg-secondary text-muted-foreground">
        <div className="grid place-items-center gap-2">
          <ImageOff aria-hidden="true" className="size-10" strokeWidth={1.3} />
          <span className="text-sm">Photographs coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-secondary">
        <Image
          src={active.url}
          alt={active.alt_text}
          fill
          preload={activeIndex === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {isFeatured ? (
          <Badge className="absolute left-4 top-4 shadow-sm">Featured piece</Badge>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${image.alt_text || title}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border bg-secondary transition-all",
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border opacity-80 hover:opacity-100",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="(min-width: 1024px) 12vw, 25vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
