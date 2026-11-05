"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { getSupabasePublicConfig, SUPABASE_ENV_HINT } from "./config";

export function createClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error(SUPABASE_ENV_HINT);
  }

  return createBrowserClient<Database>(config.url, config.anonKey);
}
