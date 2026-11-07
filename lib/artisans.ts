import { DIVISIONS } from "@/lib/constants";
import type { BdDivision } from "@/lib/supabase/enums";

export const ARTISAN_SORTS = ["featured", "name", "experience"] as const;

export type ArtisanSort = (typeof ARTISAN_SORTS)[number];

export const ARTISAN_SORT_OPTIONS: ReadonlyArray<{
  value: ArtisanSort;
  label: string;
}> = [
  { value: "featured", label: "Featured first" },
  { value: "name", label: "Name: A to Z" },
  { value: "experience", label: "Most experienced" },
];

export interface ArtisanDirectoryFilters {
  q: string;
  craft: string | null;
  region: BdDivision | null;
  sort: ArtisanSort;
}

const CRAFT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_REGIONS = new Set<string>(DIVISIONS.map((division) => division.value));
const VALID_SORTS = new Set<string>(ARTISAN_SORTS);

function firstValue(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export function parseArtisanSearchParams(
  params: Record<string, string | string[] | undefined>,
): ArtisanDirectoryFilters {
  const q = (firstValue(params.q) ?? "").trim().slice(0, 80);
  const rawCraft = firstValue(params.craft) ?? "";
  const rawRegion = firstValue(params.region) ?? "";
  const rawSort = firstValue(params.sort) ?? "";
  const region = VALID_REGIONS.has(rawRegion) ? (rawRegion as BdDivision) : null;
  const sort = VALID_SORTS.has(rawSort)
    ? (rawSort as ArtisanSort)
    : "featured";

  return {
    q,
    craft: CRAFT_SLUG_PATTERN.test(rawCraft) ? rawCraft : null,
    region,
    sort,
  };
}

export function artisanDirectoryHref(
  filters: ArtisanDirectoryFilters,
  patch: Partial<ArtisanDirectoryFilters> = {},
) {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();

  if (next.q) params.set("q", next.q);
  if (next.craft) params.set("craft", next.craft);
  if (next.region) params.set("region", next.region);
  if (next.sort !== "featured") params.set("sort", next.sort);

  const query = params.toString();
  return query ? `/artisans?${query}` : "/artisans";
}

export function countActiveArtisanFilters(filters: ArtisanDirectoryFilters) {
  let count = 0;

  if (filters.q) count += 1;
  if (filters.craft) count += 1;
  if (filters.region) count += 1;

  return count;
}
