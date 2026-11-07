import "server-only";

import { headers } from "next/headers";
import { SITE } from "@/lib/constants";

/**
 * Resolves the origin from a header bag. Route handlers can pass their request
 * headers directly; server components use `getRequestOrigin()` below.
 */
export function resolveRequestOrigin(headerStore: Headers) {
  const origin = headerStore.get("origin");

  if (origin && /^https?:\/\//i.test(origin)) {
    return origin.replace(/\/$/, "");
  }

  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? null;

  if (!host) return SITE.url;

  const forwardedProto = headerStore.get("x-forwarded-proto");
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");
  const protocol = forwardedProto ?? (isLocal ? "http" : "https");

  return `${protocol}://${host}`;
}

/**
 * Resolves the origin the request actually arrived on. Verification links and
 * labels must point back at the running app, not a hard-coded production URL.
 */
export async function getRequestOrigin() {
  return resolveRequestOrigin(await headers());
}
