"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/lib/actions/auth";
import { INITIAL_AUTH_STATE } from "@/lib/auth-state";
import type { Profile } from "@/types/domain";

interface ProfileFormProps {
  profile: Profile;
  email: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [state, action, pending] = useActionState(
    updateProfileAction,
    INITIAL_AUTH_STATE,
  );
  const fullName = state.values?.fullName ?? profile.full_name;
  const phone = state.values?.phone ?? profile.phone ?? "";

  return (
    <form action={action} className="space-y-5">
      {state.status === "error" && state.message ? (
        <FormAlert variant="error">{state.message}</FormAlert>
      ) : null}
      {state.status === "success" && state.message ? (
        <FormAlert variant="success">{state.message}</FormAlert>
      ) : null}

      <FormField
        label="Full name"
        name="fullName"
        type="text"
        autoComplete="name"
        placeholder="Your name"
        defaultValue={fullName}
        errors={state.errors?.fullName}
        required
      />

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+880 1XXX XXXXXX"
        defaultValue={phone}
        errors={state.errors?.phone}
        hint="Optional. Used for delivery and custom-order updates."
      />

      <div>
        <label
          htmlFor="account-email"
          className="text-sm font-medium text-foreground"
        >
          Email
        </label>
        <input
          id="account-email"
          type="email"
          value={email}
          disabled
          className="mt-2 h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted px-3.5 text-sm text-muted-foreground"
        />
        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
          Email changes are handled through a separate verification flow.
        </p>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Save profile"
        )}
      </Button>
    </form>
  );
}
