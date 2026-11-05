"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "@/lib/request-origin";
import { safeNextPath } from "@/lib/safe-redirect";
import type { AuthActionState, AuthFieldName } from "@/lib/auth-state";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
} from "@/lib/validation/auth";

const FIELD_NAMES: AuthFieldName[] = [
  "fullName",
  "email",
  "phone",
  "password",
  "confirmPassword",
];

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function toFieldErrors(error: {
  flatten(): { fieldErrors: Record<string, string[] | undefined> };
}): AuthActionState["errors"] {
  const flattened = error.flatten().fieldErrors;
  const errors: NonNullable<AuthActionState["errors"]> = {};

  for (const field of FIELD_NAMES) {
    const messages = flattened[field];
    if (messages && messages.length > 0) {
      errors[field] = messages;
    }
  }

  return errors;
}

function rateLimitMessage(status?: number) {
  return status === 429
    ? "Too many attempts. Wait a moment and try again."
    : null;
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      errors: toFieldErrors(parsed.error),
      values: { email: formValue(formData, "email") },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message:
        rateLimitMessage(error.status) ?? "Email or password is incorrect.",
      values: { email: parsed.data.email },
    };
  }

  redirect(safeNextPath(formData.get("next"), "/account"));
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      errors: toFieldErrors(parsed.error),
      values: {
        fullName: formValue(formData, "fullName"),
        email: formValue(formData, "email"),
      },
    };
  }

  const origin = await getRequestOrigin();
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", "/account");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: callback.toString(),
    },
  });

  if (error) {
    return {
      status: "error",
      message:
        rateLimitMessage(error.status) ??
        "We could not create that account. Try a different email or sign in.",
      values: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
      },
    };
  }

  if (!data.user) {
    return {
      status: "error",
      message: "We could not create that account. Try again in a moment.",
      values: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
      },
    };
  }

  // With email confirmation enabled Supabase returns a user but no session.
  if (!data.session) {
    return {
      status: "success",
      message:
        "Check your inbox to confirm your email. Once confirmed, you can sign in.",
      values: { email: parsed.data.email },
    };
  }

  redirect("/account");
}

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter the email address on your account.",
      errors: toFieldErrors(parsed.error),
      values: { email: formValue(formData, "email") },
    };
  }

  const origin = await getRequestOrigin();
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", "/reset-password");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: callback.toString() },
  );

  if (error && error.status === 429) {
    return {
      status: "error",
      message: "Too many attempts. Wait a moment and try again.",
      values: { email: parsed.data.email },
    };
  }

  return {
    status: "success",
    message:
      "If an account exists for that email, a password reset link is on its way.",
    values: { email: parsed.data.email },
  };
}

export async function updatePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      errors: toFieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message:
        "Your session has expired. Request a new reset link or sign in again.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      status: "error",
      message:
        rateLimitMessage(error.status) ??
        "We could not update your password. Try again in a moment.",
    };
  }

  return {
    status: "success",
    message: "Password updated. Keep this new password somewhere safe.",
  };
}

export async function updateProfileAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = updateProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      errors: toFieldErrors(parsed.error),
      values: {
        fullName: formValue(formData, "fullName"),
        phone: formValue(formData, "phone"),
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Your session has expired. Sign in again to update your profile.",
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      status: "error",
      message:
        "We could not save your profile. Refresh the page and try again.",
      values: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
      },
    };
  }

  return {
    status: "success",
    message: "Profile updated.",
    values: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
    },
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
