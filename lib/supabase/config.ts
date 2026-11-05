/**
 * Reads the public Supabase configuration.
 *
 * The app deliberately does not throw at module load: builds and the static
 * foundation page should still work before a Supabase project is linked.
 */
export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supabase renamed the public "anon" key to "publishable key"; support both
  // so existing projects and older docs keep working.
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured() {
  return getSupabasePublicConfig() !== null;
}

export const SUPABASE_ENV_HINT =
  "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local. See .env.example.";
