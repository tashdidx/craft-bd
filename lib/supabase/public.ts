import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabasePublicConfig, SUPABASE_ENV_HINT } from "./config";

let publicClient: SupabaseClient<Database> | null = null;

/**
 * Cookie-free anon client for public catalogue reads.
 *
 * `cookies()` cannot be read inside a `'use cache'` scope, so cached catalogue
 * queries use this stateless client instead of the request-scoped server client
 * in `server.ts`.
 */
export function getPublicSupabaseClient(): SupabaseClient<Database> {
  if (publicClient) return publicClient;

  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error(SUPABASE_ENV_HINT);
  }

  publicClient = createClient<Database>(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return publicClient;
}
