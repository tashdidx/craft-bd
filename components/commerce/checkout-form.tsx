"use client";

import { useActionState } from "react";
import { Banknote, Gift, LockKeyhole, Truck } from "lucide-react";
import { SubmitButton } from "@/components/commerce/submit-button";
import { Badge } from "@/components/ui/badge";
import {
  INITIAL_CHECKOUT_STATE,
  type CheckoutFieldName,
} from "@/lib/checkout-state";
import { placeOrderAction } from "@/lib/actions/checkout";
import { DIVISIONS } from "@/lib/constants";
import { formatBdt } from "@/lib/format";
import type { CheckoutDefaults } from "@/types/domain";

interface CheckoutSummary {
  itemCount: number;
  subtotalBdt: number;
  shippingBdt: number;
  giftWrapBdt: number;
  totalBdt: number;
}

interface CheckoutFormProps {
  defaults: CheckoutDefaults;
  summary: CheckoutSummary;
}

const INPUT_CLASS =
  "mt-1.5 block h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

function FieldError({
  name,
  errors,
}: {
  name: CheckoutFieldName;
  errors: Partial<Record<CheckoutFieldName, string[]>> | undefined;
}) {
  const message = errors?.[name]?.[0];
  if (!message) return null;

  return (
    <p id={`${name}-error`} className="mt-1.5 text-xs leading-5 text-red-700">
      {message}
    </p>
  );
}

export function CheckoutForm({ defaults, summary }: CheckoutFormProps) {
  const [state, formAction] = useActionState(
    placeOrderAction,
    INITIAL_CHECKOUT_STATE,
  );
  const values = state.values;

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        {state.status === "error" && state.message ? (
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
          >
            {state.message}
          </p>
        ) : null}

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <Truck
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.6}
              />
            </span>
            <div>
              <h2 className="text-2xl leading-tight">Delivery details</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                The parcel is addressed to whoever receives it. A phone number
                helps the courier reach them.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium">Recipient name</span>
              <input
                type="text"
                name="recipientName"
                required
                autoComplete="name"
                defaultValue={values?.recipientName ?? defaults.recipientName}
                aria-invalid={Boolean(state.errors?.recipientName)}
                aria-describedby={
                  state.errors?.recipientName ? "recipientName-error" : undefined
                }
                className={INPUT_CLASS}
              />
              <FieldError name="recipientName" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">Phone</span>
              <input
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                placeholder="+8801XXXXXXXXX"
                defaultValue={values?.phone ?? defaults.phone}
                aria-invalid={Boolean(state.errors?.phone)}
                aria-describedby={state.errors?.phone ? "phone-error" : undefined}
                className={INPUT_CLASS}
              />
              <FieldError name="phone" errors={state.errors} />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">Street address</span>
              <input
                type="text"
                name="addressLine1"
                required
                autoComplete="address-line1"
                defaultValue={values?.addressLine1 ?? defaults.addressLine1}
                aria-invalid={Boolean(state.errors?.addressLine1)}
                aria-describedby={
                  state.errors?.addressLine1 ? "addressLine1-error" : undefined
                }
                className={INPUT_CLASS}
              />
              <FieldError name="addressLine1" errors={state.errors} />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">
                Apartment, floor, or landmark{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <input
                type="text"
                name="addressLine2"
                autoComplete="address-line2"
                defaultValue={values?.addressLine2 ?? defaults.addressLine2}
                className={INPUT_CLASS}
              />
              <FieldError name="addressLine2" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">City or town</span>
              <input
                type="text"
                name="city"
                required
                autoComplete="address-level2"
                defaultValue={values?.city ?? defaults.city}
                aria-invalid={Boolean(state.errors?.city)}
                aria-describedby={state.errors?.city ? "city-error" : undefined}
                className={INPUT_CLASS}
              />
              <FieldError name="city" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">District</span>
              <input
                type="text"
                name="district"
                required
                defaultValue={values?.district ?? defaults.district}
                aria-invalid={Boolean(state.errors?.district)}
                aria-describedby={
                  state.errors?.district ? "district-error" : undefined
                }
                className={INPUT_CLASS}
              />
              <FieldError name="district" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">Division</span>
              <select
                name="division"
                required
                defaultValue={values?.division ?? defaults.division}
                aria-invalid={Boolean(state.errors?.division)}
                aria-describedby={
                  state.errors?.division ? "division-error" : undefined
                }
                className={INPUT_CLASS}
              >
                {DIVISIONS.map((division) => (
                  <option key={division.value} value={division.value}>
                    {division.label}
                  </option>
                ))}
              </select>
              <FieldError name="division" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">
                Postal code{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <input
                type="text"
                name="postalCode"
                inputMode="numeric"
                autoComplete="postal-code"
                defaultValue={values?.postalCode ?? defaults.postalCode}
                aria-invalid={Boolean(state.errors?.postalCode)}
                className={INPUT_CLASS}
              />
              <FieldError name="postalCode" errors={state.errors} />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <Gift aria-hidden="true" className="size-5" strokeWidth={1.6} />
            </span>
            <div>
              <h2 className="text-2xl leading-tight">Gift message</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Optional. Written on the packing slip; gift wrapping is set per
                piece in your cart.
              </p>
            </div>
          </div>

          <label className="mt-6 block text-sm">
            <span className="sr-only">Gift message</span>
            <textarea
              name="giftMessage"
              rows={4}
              maxLength={280}
              placeholder="For Ma, with love — may this quilt keep her warm through winter."
              defaultValue={values?.giftMessage ?? ""}
              className="block w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            />
            <FieldError name="giftMessage" errors={state.errors} />
          </label>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl leading-tight">Payment</h2>
            <Badge variant="secondary">
              <Banknote
                aria-hidden="true"
                className="size-3"
                strokeWidth={1.8}
              />
              Cash on delivery
            </Badge>
          </div>
          <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <LockKeyhole
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
              strokeWidth={1.7}
            />
            No online payment is collected here. The order is recorded as
            payment due and the studio confirms it directly.
          </p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl leading-tight">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">
                Pieces ({summary.itemCount})
              </dt>
              <dd>{formatBdt(summary.subtotalBdt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>
                {summary.shippingBdt === 0 ? (
                  <span className="text-primary">Free</span>
                ) : (
                  formatBdt(summary.shippingBdt)
                )}
              </dd>
            </div>
            {summary.giftWrapBdt > 0 ? (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Gift wrapping</dt>
                <dd>{formatBdt(summary.giftWrapBdt)}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatBdt(summary.totalBdt)}</dd>
            </div>
          </dl>

          <SubmitButton
            className="mt-6 w-full"
            size="lg"
            pendingLabel="Placing order…"
          >
            Place order
          </SubmitButton>

          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Placing the order reserves your pieces and clears the cart. You can
            track the status from your account.
          </p>
        </div>
      </aside>
    </form>
  );
}
