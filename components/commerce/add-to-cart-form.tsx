import { Gift, ShoppingBag } from "lucide-react";
import { addToCartAction } from "@/lib/actions/cart";
import { SubmitButton } from "@/components/commerce/submit-button";
import { CART_MAX_QUANTITY } from "@/lib/commerce";
import { GIFT_WRAP_BDT } from "@/lib/constants";
import { formatBdt } from "@/lib/format";

interface AddToCartFormProps {
  productId: string;
  stockQuantity: number;
  giftWrapAvailable: boolean;
  nextPath: string;
  defaultGiftWrap?: boolean;
  className?: string;
}

export function AddToCartForm({
  productId,
  stockQuantity,
  giftWrapAvailable,
  nextPath,
  defaultGiftWrap = false,
  className,
}: AddToCartFormProps) {
  const maxQuantity = Math.min(CART_MAX_QUANTITY, stockQuantity);
  const soldOut = stockQuantity <= 0;

  return (
    <form action={addToCartAction} className={className}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="next" value={nextPath} />

      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Quantity
          </span>
          <select
            name="quantity"
            defaultValue="1"
            disabled={soldOut}
            className="mt-1.5 block h-11 w-20 rounded-full border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {Array.from({ length: maxQuantity }, (_, index) => index + 1).map(
              (quantity) => (
                <option key={quantity} value={quantity}>
                  {quantity}
                </option>
              ),
            )}
          </select>
        </label>

        <SubmitButton
          className="h-11 flex-1"
          pendingLabel="Adding…"
          disabled={soldOut}
        >
          <ShoppingBag aria-hidden="true" className="size-4" strokeWidth={1.8} />
          {soldOut ? "Sold out" : "Add to cart"}
        </SubmitButton>
      </div>

      {giftWrapAvailable && !soldOut ? (
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="giftWrap"
            value="true"
            defaultChecked={defaultGiftWrap}
            className="size-4 rounded border-border accent-primary"
          />
          <Gift aria-hidden="true" className="size-4" strokeWidth={1.7} />
          Add gift wrapping (+{formatBdt(GIFT_WRAP_BDT)} per piece)
        </label>
      ) : null}

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {soldOut
          ? "This piece is currently sold out."
          : "Cash on delivery. You will be asked to sign in before the cart is saved."}
      </p>
    </form>
  );
}
