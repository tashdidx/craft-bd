import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabasePublicConfig } from "./config";

function isProtectedPath(pathname: string) {
  return pathname === "/account" || pathname.startsWith("/account/");
}

function hasAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some(({ name }) => /^sb-.+-auth-token(\.\d+)?$/.test(name));
}

/**
 * Refreshes the Supabase auth session on navigation and forwards updated
 * cookies to the browser.
 *
 * The protected-route check here is optimistic only, based on the presence of
 * an auth cookie. Every protected page and Server Action still validates the
 * JWT with Supabase before reading or writing data.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const config = getSupabasePublicConfig();
  if (!config) {
    return response;
  }

  if (isProtectedPath(request.nextUrl.pathname) && !hasAuthCookie(request)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(loginUrl);
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
