import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabasePublicConfig } from "./config";

/**
 * Service-role client. Bypasses RLS and must only be used from trusted server
 * code (admin dashboards, certificate issuance, maintenance scripts).
 */
export function createAdminClient() {
  const config = getSupabasePublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!config || !serviceRoleKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL, a public Supabase key, and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }

  return createSupabaseClient<Database>(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
