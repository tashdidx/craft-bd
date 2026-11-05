/**
 * Only allow same-origin absolute paths. Anything else falls back to a safe
 * destination so a crafted `next` value cannot turn into an open redirect.
 */
export function safeNextPath(value: unknown, fallback = "/account") {
  if (typeof value !== "string") return fallback;

  const path = value.trim();

  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback;
  if (path.includes("\n") || path.includes("\r")) return fallback;

  return path;
}
