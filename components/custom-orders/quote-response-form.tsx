"use client";

import { useActionState } from "react";
import { Check, X } from "lucide-react";
import { SubmitButton } from "@/components/commerce/submit-button";
import {
  INITIAL_QUOTE_RESPONSE_STATE,
} from "@/lib/custom-order-state";
import { respondToQuoteAction } from "@/lib/actions/custom-orders";

const TEXTAREA_CLASS =
  "mt-1.5 block w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

export function QuoteResponseForm({ requestCode }: { requestCode: string }) {
  const [state, formAction] = useActionState(
    respondToQuoteAction,
    INITIAL_QUOTE_RESPONSE_STATE,
  );

  return (
    <form action={formAction} className="mt-5">
      <input type="hidden" name="requestCode" value={requestCode} />

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
        >
          {state.message}
        </p>
      ) : null}

      <label className="block text-sm">
        <span className="font-medium">
          Note to the studio{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </span>
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          placeholder="Share a delivery deadline, a question about the estimate, or any change you would like to discuss."
          className={TEXTAREA_CLASS}
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <SubmitButton
          name="decision"
          value="approved"
          size="lg"
          pendingLabel="Saving response…"
          className="flex-1"
        >
          <Check aria-hidden="true" className="size-4" strokeWidth={2} />
          Approve estimate
        </SubmitButton>
        <SubmitButton
          name="decision"
          value="declined"
          size="lg"
          variant="outline"
          pendingLabel="Saving response…"
          className="flex-1"
        >
          <X aria-hidden="true" className="size-4" strokeWidth={2} />
          Decline
        </SubmitButton>
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Approving records your acceptance and lets the studio begin production.
        Declining closes the request without any payment.
      </p>
    </form>
  );
}
