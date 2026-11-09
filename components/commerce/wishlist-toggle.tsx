"use client";

import { Heart } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toggleWishlistAction } from "@/lib/actions/wishlist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistToggleProps {
  productId: string;
  active: boolean;
  nextPath: string;
  showLabel?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

function WishlistButton({
  active,
  showLabel,
  size,
  className,
}: Pick<WishlistToggleProps, "active" | "showLabel" | "size" | "className">) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      size={size}
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(active && "border-primary/40 text-primary", className)}
    >
      <Heart
        aria-hidden="true"
        className="size-4"
        strokeWidth={1.8}
        fill={active ? "currentColor" : "none"}
      />
      {showLabel === false ? null : active ? "Saved" : "Save to wishlist"}
    </Button>
  );
}

export function WishlistToggle({
  productId,
  active,
  nextPath,
  showLabel = true,
  size = "default",
  className,
}: WishlistToggleProps) {
  return (
    <form action={toggleWishlistAction} className={cn(className)}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="next" value={nextPath} />
      <WishlistButton
        active={active}
        showLabel={showLabel}
        size={size}
        className={showLabel === false ? "bg-card/90 backdrop-blur" : "w-full"}
      />
    </form>
  );
}
