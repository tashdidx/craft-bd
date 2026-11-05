import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-redirect";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const next = safeNextPath(url.searchParams.get("next"), "/account");

  if (url.searchParams.get("error")) {
    return NextResponse.redirect(
      new URL("/login?error=link_expired", url.origin),
    );
  }

  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", url.origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=link_expired", url.origin),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
