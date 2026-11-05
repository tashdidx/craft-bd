"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/lib/actions/auth";
import { INITIAL_AUTH_STATE } from "@/lib/auth-state";

export function SignUpForm() {
  const [state, action, pending] = useActionState(
    signUpAction,
    INITIAL_AUTH_STATE,
  );

  return (
    <form action={action} className="space-y-5">
      {state.status === "error" && state.message ? (
        <FormAlert variant="error">{state.message}</FormAlert>
      ) : null}
      {state.status === "success" && state.message ? (
        <FormAlert variant="success">
          {state.message}{" "}
          <Link href="/login" className="font-semibold underline underline-offset-4">
            Go to sign in
          </Link>
        </FormAlert>
      ) : null}

      <FormField
        label="Full name"
        name="fullName"
        type="text"
        autoComplete="name"
        placeholder="Your name"
        defaultValue={state.values?.fullName}
        errors={state.errors?.fullName}
        required
      />

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

      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a password"
        hint="At least 8 characters, including a letter and a number."
        errors={state.errors?.password}
        required
      />

      <FormField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your password"
        errors={state.errors?.confirmPassword}
        required
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Creating your account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-xs leading-5 text-muted-foreground">
        By creating an account you agree to keep the catalogue a respectful
        record of the makers and traditions it represents.
      </p>
    </form>
  );
}
