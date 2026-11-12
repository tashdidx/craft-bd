"use client";

import { useActionState } from "react";
import {
  ArrowRight,
  CalendarClock,
  MessageSquare,
  Package,
  Palette,
  Ruler,
  Scissors,
  Wallet,
} from "lucide-react";
import { SubmitButton } from "@/components/commerce/submit-button";
import {
  INITIAL_CUSTOM_ORDER_STATE,
  type CustomOrderFieldName,
} from "@/lib/custom-order-state";
import { createCustomOrderAction } from "@/lib/actions/custom-orders";
import type { ArtisanDirectoryEntry } from "@/types/domain";

const INPUT_CLASS =
  "mt-1.5 block h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

const TEXTAREA_CLASS =
  "mt-1.5 block w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

interface CustomOrderFormProps {
  artisans: ArtisanDirectoryEntry[];
  selectedSlug?: string;
}

function FieldError({
  name,
  errors,
}: {
  name: CustomOrderFieldName;
  errors: Partial<Record<CustomOrderFieldName, string[]>> | undefined;
}) {
  const message = errors?.[name]?.[0];
  if (!message) return null;

  return (
    <p id={`${name}-error`} className="mt-1.5 text-xs leading-5 text-red-700">
      {message}
    </p>
  );
}

function describedBy(
  name: CustomOrderFieldName,
  errors: Partial<Record<CustomOrderFieldName, string[]>> | undefined,
) {
  return errors?.[name] ? `${name}-error` : undefined;
}

export function CustomOrderForm({
  artisans,
  selectedSlug,
}: CustomOrderFormProps) {
  const [state, formAction] = useActionState(
    createCustomOrderAction,
    INITIAL_CUSTOM_ORDER_STATE,
  );
  const values = state.values;
  const artisanDefault =
    values?.artisanSlug ?? selectedSlug ?? artisans[0]?.slug ?? "";

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
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
              <Scissors aria-hidden="true" className="size-5" strokeWidth={1.6} />
            </span>
            <div>
              <h2 className="text-2xl leading-tight">Choose the studio</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Pick the maker whose craft fits the piece. The request goes
                directly to that studio for an estimate.
              </p>
            </div>
          </div>

          <label className="mt-6 block text-sm">
            <span className="font-medium">Artisan studio</span>
            <select
              name="artisanSlug"
              required
              defaultValue={artisanDefault}
              aria-invalid={Boolean(state.errors?.artisanSlug)}
              aria-describedby={describedBy("artisanSlug", state.errors)}
              className={INPUT_CLASS}
            >
              {artisans.map((artisan) => (
                <option key={artisan.id} value={artisan.slug}>
                  {artisan.displayName} — {artisan.craftSpecialization} ·{" "}
                  {artisan.district}
                </option>
              ))}
            </select>
            <FieldError name="artisanSlug" errors={state.errors} />
          </label>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <Palette aria-hidden="true" className="size-5" strokeWidth={1.6} />
            </span>
            <div>
              <h2 className="text-2xl leading-tight">The piece</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Describe what you have in mind. Traditional motifs, a family
                pattern, or a completely new form are all welcome.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">What kind of piece?</span>
              <input
                type="text"
                name="productType"
                required
                placeholder="Bridal jamdani saree, six clay tea cups, floor mat…"
                defaultValue={values?.productType ?? ""}
                aria-invalid={Boolean(state.errors?.productType)}
                aria-describedby={describedBy("productType", state.errors)}
                className={INPUT_CLASS}
              />
              <FieldError name="productType" errors={state.errors} />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">Design description</span>
              <textarea
                name="designDescription"
                required
                rows={6}
                maxLength={2_000}
                placeholder="Describe the motifs, border, finish, and any details that matter to you. Mention the occasion and deadline if there is one."
                defaultValue={values?.designDescription ?? ""}
                aria-invalid={Boolean(state.errors?.designDescription)}
                aria-describedby={describedBy(
                  "designDescription",
                  state.errors,
                )}
                className={TEXTAREA_CLASS}
              />
              <FieldError name="designDescription" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">
                Colour{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <input
                type="text"
                name="color"
                placeholder="Deep indigo with a copper border"
                defaultValue={values?.color ?? ""}
                aria-describedby={describedBy("color", state.errors)}
                className={INPUT_CLASS}
              />
              <FieldError name="color" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">
                Size{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <input
                type="text"
                name="size"
                placeholder="Saree 12 haat, 180 ml cup, 6 ft × 4 ft"
                defaultValue={values?.size ?? ""}
                aria-describedby={describedBy("size", state.errors)}
                className={INPUT_CLASS}
              />
              <FieldError name="size" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">
                Material{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <input
                type="text"
                name="material"
                placeholder="Fine cotton with mulberry silk"
                defaultValue={values?.material ?? ""}
                aria-describedby={describedBy("material", state.errors)}
                className={INPUT_CLASS}
              />
              <FieldError name="material" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">Quantity</span>
              <input
                type="number"
                name="quantity"
                min={1}
                max={20}
                required
                defaultValue={values?.quantity ?? "1"}
                aria-invalid={Boolean(state.errors?.quantity)}
                aria-describedby={describedBy("quantity", state.errors)}
                className={INPUT_CLASS}
              />
              <FieldError name="quantity" errors={state.errors} />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">
                Reference image link{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <input
                type="url"
                name="referenceImageUrl"
                placeholder="https://…"
                defaultValue={values?.referenceImageUrl ?? ""}
                aria-invalid={Boolean(state.errors?.referenceImageUrl)}
                aria-describedby={describedBy(
                  "referenceImageUrl",
                  state.errors,
                )}
                className={INPUT_CLASS}
              />
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                A link to a photo or sketch helps the studio match the design.
                Uploads are not collected here.
              </p>
              <FieldError name="referenceImageUrl" errors={state.errors} />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <Wallet aria-hidden="true" className="size-5" strokeWidth={1.6} />
            </span>
            <div>
              <h2 className="text-2xl leading-tight">Budget and notes</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                An indicative range helps the studio quote realistically. The
                estimate is confirmed before any work begins.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium">
                Budget from{" "}
                <span className="font-normal text-muted-foreground">
                  (BDT, optional)
                </span>
              </span>
              <input
                type="number"
                name="budgetMin"
                min={0}
                step={100}
                inputMode="numeric"
                placeholder="4000"
                defaultValue={values?.budgetMin ?? ""}
                aria-invalid={Boolean(state.errors?.budgetMin)}
                aria-describedby={describedBy("budgetMin", state.errors)}
                className={INPUT_CLASS}
              />
              <FieldError name="budgetMin" errors={state.errors} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">
                Budget up to{" "}
                <span className="font-normal text-muted-foreground">
                  (BDT, optional)
                </span>
              </span>
              <input
                type="number"
                name="budgetMax"
                min={0}
                step={100}
                inputMode="numeric"
                placeholder="6500"
                defaultValue={values?.budgetMax ?? ""}
                aria-invalid={Boolean(state.errors?.budgetMax)}
                aria-describedby={describedBy("budgetMax", state.errors)}
                className={INPUT_CLASS}
              />
              <FieldError name="budgetMax" errors={state.errors} />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">
                Anything else the studio should know?{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <textarea
                name="customNotes"
                rows={4}
                maxLength={1_000}
                placeholder="Deadlines, a sample you can send, care requirements, or how the piece will be used."
                defaultValue={values?.customNotes ?? ""}
                aria-describedby={describedBy("customNotes", state.errors)}
                className={TEXTAREA_CLASS}
              />
              <FieldError name="customNotes" errors={state.errors} />
            </label>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl leading-tight">How a commission works</h2>
          <ol className="mt-5 space-y-4 text-sm">
            <Step
              icon={MessageSquare}
              title="Describe the piece"
              detail="Your brief is sent to the studio with a request code."
            />
            <Step
              icon={Wallet}
              title="Receive an estimate"
              detail="The studio replies with a price and an estimated timeline."
            />
            <Step
              icon={CalendarClock}
              title="Approve and follow"
              detail="Approve the quote, then track production, quality check, and dispatch."
            />
          </ol>

          <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-xs leading-5 text-muted-foreground">
            <p className="flex items-start gap-2">
              <Package
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
                strokeWidth={1.7}
              />
              Every request keeps its brief and timeline in your account.
              Estimates are not orders, and no payment is collected here.
            </p>
          </div>

          <SubmitButton
            className="mt-6 w-full"
            size="lg"
            pendingLabel="Sending request…"
          >
            Send request to studio
            <ArrowRight aria-hidden="true" className="size-4" />
          </SubmitButton>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Ruler aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
            You can answer the estimate later from this account.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Step({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof MessageSquare;
  title: string;
  detail: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" className="size-4" strokeWidth={1.7} />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {detail}
        </p>
      </div>
    </li>
  );
}
