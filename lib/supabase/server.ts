import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { getSupabasePublicConfig, SUPABASE_ENV_HINT } from "./config";

/**
 * Request-scoped Supabase client for Server Components, Server Actions, and
 * Route Handlers. Always call this per request; never cache the client itself.
 */
export async function createClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error(SUPABASE_ENV_HINT);
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot mutate cookies. The proxy refreshes the
          // session, so ignoring this write is the documented @supabase/ssr
          // pattern.
        }
      },
    },
  });
}
