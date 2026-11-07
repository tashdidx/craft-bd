import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { ArtisanDirectoryFilters, ArtisanSort } from "@/lib/artisans";
import { getProductsByArtisan } from "@/lib/data/catalogue";
import { DIVISIONS } from "@/lib/constants";
import type { BdDivision } from "@/lib/supabase/enums";
import { getPublicSupabaseClient } from "@/lib/supabase/public";
import type {
  Artisan,
  ArtisanDetailData,
  ArtisanDirectoryEntry,
  ArtisanDirectoryResult,
  CatalogueFacetCount,
  Category,
} from "@/types/domain";

const ARTISAN_COLUMNS = `
  id,
  profile_id,
  display_name,
  slug,
  workshop_name,
  craft_specialization,
  primary_category_id,
  region,
  district,
  years_of_experience,
  biography,
  story_video_url,
  avatar_url,
  cover_image_url,
  languages,
  status,
  is_featured,
  created_at,
  updated_at,
  categories!artisans_primary_category_id_fkey ( id, name, slug )
`;

interface RawArtisanRow extends Artisan {
  categories:
    | Pick<Category, "id" | "name" | "slug">
    | Array<Pick<Category, "id" | "name" | "slug">>
    | null;
}

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function mapEntry(
  row: RawArtisanRow,
  productCount: number,
): ArtisanDirectoryEntry {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    workshopName: row.workshop_name,
    craftSpecialization: row.craft_specialization,
    primaryCategory: firstOrNull(row.categories),
    region: row.region,
    district: row.district,
    yearsOfExperience: row.years_of_experience,
    biography: row.biography,
    avatarUrl: row.avatar_url,
    coverImageUrl: row.cover_image_url,
    languages: row.languages,
    isFeatured: row.is_featured,
    productCount,
  };
}

async function loadApprovedArtisans(): Promise<ArtisanDirectoryEntry[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("artisans", "catalogue");

  const supabase = getPublicSupabaseClient();

  const [artisanResult, productResult] = await Promise.all([
    supabase
      .from("artisans")
      .select(ARTISAN_COLUMNS)
      .eq("status", "approved")
      .order("is_featured", { ascending: false })
      .order("display_name", { ascending: true }),
    supabase
      .from("products")
      .select("artisan_id")
      .eq("status", "published"),
  ]);

  if (artisanResult.error) {
    throw new Error(`Could not load artisan studios: ${artisanResult.error.message}`);
  }
  if (productResult.error) {
    throw new Error(
      `Could not count artisan pieces: ${productResult.error.message}`,
    );
  }

  const productCounts = new Map<string, number>();

  for (const product of productResult.data ?? []) {
    productCounts.set(
      product.artisan_id,
      (productCounts.get(product.artisan_id) ?? 0) + 1,
    );
  }

  const rows = (artisanResult.data ?? []) as unknown as RawArtisanRow[];

  return rows
    .map((row) => mapEntry(row, productCounts.get(row.id) ?? 0))
    .sort(
      (a, b) =>
        Number(b.isFeatured) - Number(a.isFeatured) ||
        a.displayName.localeCompare(b.displayName),
    );
}

function sortEntries(
  entries: ArtisanDirectoryEntry[],
  sort: ArtisanSort,
): ArtisanDirectoryEntry[] {
  if (sort === "featured") return entries;

  const sorted = [...entries];

  if (sort === "name") {
    sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
  } else {
    sorted.sort(
      (a, b) =>
        b.yearsOfExperience - a.yearsOfExperience ||
        a.displayName.localeCompare(b.displayName),
    );
  }

  return sorted;
}

export async function getArtisanDirectory(
  filters: ArtisanDirectoryFilters,
): Promise<ArtisanDirectoryResult> {
  "use cache";
  cacheLife("hours");
  cacheTag("artisans");

  const entries = await loadApprovedArtisans();
  const craftCounts = new Map<string, { name: string; count: number }>();
  const regionCounts = new Map<BdDivision, number>();
  const searchTerm = filters.q.toLowerCase();

  for (const entry of entries) {
    if (entry.primaryCategory) {
      const current = craftCounts.get(entry.primaryCategory.slug);
      craftCounts.set(entry.primaryCategory.slug, {
        name: entry.primaryCategory.name,
        count: (current?.count ?? 0) + 1,
      });
    }

    regionCounts.set(entry.region, (regionCounts.get(entry.region) ?? 0) + 1);
  }

  const filtered = entries.filter((entry) => {
    if (filters.craft && entry.primaryCategory?.slug !== filters.craft) {
      return false;
    }

    if (filters.region && entry.region !== filters.region) {
      return false;
    }

    if (searchTerm) {
      const haystack = [
        entry.displayName,
        entry.workshopName,
        entry.craftSpecialization,
        entry.primaryCategory?.name,
        entry.district,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(searchTerm)) return false;
    }

    return true;
  });

  const crafts = [...craftCounts.entries()]
    .map(([slug, value]) => ({ slug, name: value.name, count: value.count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const regions: CatalogueFacetCount<BdDivision>[] = DIVISIONS.filter(
    (division) => (regionCounts.get(division.value) ?? 0) > 0,
  ).map((division) => ({
    value: division.value,
    label: division.label,
    count: regionCounts.get(division.value) ?? 0,
  }));

  return {
    items: sortEntries(filtered, filters.sort),
    total: filtered.length,
    facets: {
      crafts,
      regions,
      total: entries.length,
    },
  };
}

export async function getFeaturedArtisans(
  limit = 3,
): Promise<ArtisanDirectoryEntry[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("artisans", "catalogue");

  const entries = await loadApprovedArtisans();
  return entries.slice(0, limit);
}

export async function getRelatedArtisans(
  current: {
    slug: string;
    primaryCategory: Pick<Category, "id" | "name" | "slug"> | null;
    region: BdDivision;
  },
  limit = 3,
): Promise<ArtisanDirectoryEntry[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("artisans", "catalogue");

  const entries = await loadApprovedArtisans();

  return entries
    .filter((entry) => entry.slug !== current.slug)
    .map((entry) => {
      let score = 0;

      if (
        current.primaryCategory &&
        entry.primaryCategory?.id === current.primaryCategory.id
      ) {
        score += 2;
      }
      if (entry.region === current.region) score += 1;

      return { entry, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.entry.isFeatured) - Number(a.entry.isFeatured) ||
        a.entry.displayName.localeCompare(b.entry.displayName),
    )
    .slice(0, limit)
    .map((item) => item.entry);
}

export async function getArtisanDetail(
  slug: string,
): Promise<ArtisanDetailData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("artisans", `artisan-${slug}`, "catalogue");

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("artisans")
    .select(ARTISAN_COLUMNS)
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load this artisan studio: ${error.message}`);
  }
  if (!data) return null;

  const row = data as unknown as RawArtisanRow;
  const products = await getProductsByArtisan(row.id);
  const reviewCount = products.reduce(
    (total, product) => total + product.reviewCount,
    0,
  );
  const ratingTotal = products.reduce(
    (total, product) =>
      total + (product.ratingAverage ?? 0) * product.reviewCount,
    0,
  );
  const ratingAverage =
    reviewCount > 0
      ? Math.round((ratingTotal / reviewCount) * 10) / 10
      : null;

  return {
    artisan: row,
    primaryCategory: firstOrNull(row.categories),
    products,
    productCount: products.length,
    ratingAverage,
    reviewCount,
  };
}
