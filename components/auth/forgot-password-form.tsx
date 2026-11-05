"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { requestPasswordResetAction } from "@/lib/actions/auth";
import { INITIAL_AUTH_STATE } from "@/lib/auth-state";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    INITIAL_AUTH_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="space-y-5">
        <FormAlert variant="success">{state.message}</FormAlert>
        <p className="text-sm leading-6 text-muted-foreground">
          Follow the link in that email to choose a new password. If it does not
          arrive, check your spam folder or request another link.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state.status === "error" && state.message ? (
        <FormAlert variant="error">{state.message}</FormAlert>
      ) : null}

      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        defaultValue={state.values?.email}
        errors={state.errors?.email}
        required
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Sending the link…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}
