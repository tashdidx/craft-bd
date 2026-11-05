"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { signInAction } from "@/lib/actions/auth";
import { INITIAL_AUTH_STATE } from "@/lib/auth-state";

interface LoginFormProps {
  next: string;
  initialError?: string;
}

export function LoginForm({ next, initialError }: LoginFormProps) {
  const [state, action, pending] = useActionState(
    signInAction,
    INITIAL_AUTH_STATE,
  );
  const message =
    state.status === "error" ? state.message : initialError;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {message ? <FormAlert variant="error">{message}</FormAlert> : null}
      {state.status === "success" && state.message ? (
        <FormAlert variant="success">{state.message}</FormAlert>
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

      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        errors={state.errors?.password}
        required
      />

      <div className="flex items-center justify-between gap-3">
        <Link
          href="/forgot-password"
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>
        <span className="text-xs text-muted-foreground">
          Secure sign-in by Supabase
        </span>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
