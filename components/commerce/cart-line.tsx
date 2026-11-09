import Image from "next/image";
import Link from "next/link";
import { Gift, ImageOff, Trash2 } from "lucide-react";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/lib/actions/cart";
import { CART_MAX_QUANTITY } from "@/lib/commerce";
import { GIFT_WRAP_BDT } from "@/lib/constants";
import { formatBdt } from "@/lib/format";
import type { CartLine as CartLineData } from "@/types/domain";

const STEP_BUTTON =
  "grid size-8 place-items-center rounded-full text-base text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

export function CartLine({ item }: { item: CartLineData }) {
  const maxQuantity = Math.min(CART_MAX_QUANTITY, item.stockQuantity);
  const stockWarning = item.stockQuantity <= 0 || item.quantity > item.stockQuantity;

  return (
    <article className="flex gap-4 border-b border-border py-5 first:pt-0 last:border-b-0 sm:gap-5">
      <Link
        href={`/products/${item.slug}`}
        className="relative block size-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary sm:size-28"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.imageAlt}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <span className="grid h-full place-items-center text-muted-foreground">
            <ImageOff aria-hidden="true" className="size-5" strokeWidth={1.4} />
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="block truncate font-medium transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {item.artisanName ?? "Craft BD studio"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatBdt(item.priceBdt)} each
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold">
            {formatBdt(item.lineTotalBdt)}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <form
            action={updateCartItemAction}
            className="inline-flex items-center rounded-full border border-border bg-background"
          >
            <input type="hidden" name="itemId" value={item.id} />
            <button
              type="submit"
              name="quantity"
              value={item.quantity - 1}
              aria-label={`Decrease quantity of ${item.title}`}
              className={STEP_BUTTON}
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="w-7 text-center text-sm" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="submit"
              name="quantity"
              value={item.quantity + 1}
              aria-label={`Increase quantity of ${item.title}`}
              className={STEP_BUTTON}
              disabled={item.quantity >= maxQuantity}
            >
              +
            </button>
          </form>

          {item.giftWrapAvailable ? (
            <form action={updateCartItemAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="quantity" value={item.quantity} />
              <input
                type="hidden"
                name="giftWrap"
                value={item.giftWrap ? "false" : "true"}
              />
              <button
                type="submit"
                aria-pressed={item.giftWrap}
                className={
                  item.giftWrap
                    ? "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                    : "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                }
              >
                <Gift aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
                {item.giftWrap
                  ? `Gift wrap added (+${formatBdt(GIFT_WRAP_BDT)}/piece)`
                  : `Add gift wrap (+${formatBdt(GIFT_WRAP_BDT)}/piece)`}
              </button>
            </form>
          ) : null}

          <form action={removeCartItemAction} className="ml-auto">
            <input type="hidden" name="itemId" value={item.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Trash2 aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
              Remove
            </button>
          </form>
        </div>

        {stockWarning ? (
          <p className="mt-2 text-xs text-amber-700">
            Only {Math.max(item.stockQuantity, 0)} available. Reduce the
            quantity before checkout.
          </p>
        ) : null}
      </div>
    </article>
  );
}
