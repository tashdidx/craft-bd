import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabasePublicConfig } from "./config";

/**
 * Refreshes the Supabase auth session on navigation and forwards updated
 * cookies to the browser. Auth checks belong in pages/actions, not here.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const config = getSupabasePublicConfig();
  if (!config) {
    return response;
  }

  const supabase = createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not trust getSession() here: getUser() validates the JWT with Supabase.
  await supabase.auth.getUser();

  return response;
}
