import "server-only";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

export interface CurrentUser {
  user: User;
  profile: Profile | null;
}

/**
 * Data-access helper for the authenticated user. The JWT is validated with
 * Supabase on every request; the profile read is deduplicated per render pass.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  // Supabase auth reads the clock while validating the stored session. Defer to
  // request time so the auth-dependent UI never joins the static prerender.
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // A missing profile row must not take down the header or account page. The
  // auth trigger creates it on signup, so this is only a recovery path.
  if (profileError) return { user, profile: null };

  return { user, profile: profile ?? null };
});

export async function requireUser(nextPath = "/account") {
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return current;
}

/**
 * Administrator authorization reads the role from the signed JWT
 * (`app_metadata.role`). `profiles.role` is display data and is never trusted
 * for access control.
 */
export function isAdminUser(user: User) {
  return user.app_metadata?.role === "admin";
}

/**
 * Server-side guard for every admin page and Server Action. Signed-out visitors
 * are sent to sign in; signed-in non-admins get a 404 so the back office is not
 * advertised.
 */
export async function requireAdmin(nextPath = "/admin") {
  const current = await getCurrentUser();

  if (!current) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (!isAdminUser(current.user)) {
    notFound();
  }

  return current;
}

export function displayNameFor(current: CurrentUser) {
  const profileName = current.profile?.full_name?.trim();

  if (profileName) return profileName;

  const emailName = current.user.email?.split("@")[0]?.replace(/[._-]+/g, " ");

  return emailName ? emailName.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Craft BD member";
}
