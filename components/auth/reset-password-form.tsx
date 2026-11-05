"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { updatePasswordAction } from "@/lib/actions/auth";
import { INITIAL_AUTH_STATE } from "@/lib/auth-state";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(
    updatePasswordAction,
    INITIAL_AUTH_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="space-y-5">
        <FormAlert variant="success">{state.message}</FormAlert>
        <Button asChild className="w-full">
          <Link href="/account">Go to your account</Link>
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
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Choose a new password"
        hint="At least 8 characters, including a letter and a number."
        errors={state.errors?.password}
        required
      />

      <FormField
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat the new password"
        errors={state.errors?.confirmPassword}
        required
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Updating your password…
          </>
        ) : (
          "Update password"
        )}
      </Button>
    </form>
  );
}
