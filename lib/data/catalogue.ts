import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  CATALOGUE_PAGE_SIZE,
  type CatalogueFilters,
} from "@/lib/catalogue";
import { DIVISIONS, OCCASION_LABELS } from "@/lib/constants";
import type { BdDivision } from "@/lib/supabase/enums";
import { getPublicSupabaseClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/supabase/database.types";
import type {
  CatalogueFacetCount,
  CatalogueFacets,
  CatalogueResult,
  ProductCardData,
  ProductDetailData,
} from "@/types/domain";

export const PRODUCT_CARD_COLUMNS = `
  id,
  title,
  slug,
  short_description,
  price_bdt,
  compare_at_price_bdt,
  stock_quantity,
  is_featured,
  region,
  materials,
  categories ( id, name, slug ),
  artisans ( id, display_name, slug, district, region ),
  product_images ( url, alt_text, is_primary, sort_order ),
  reviews ( rating )
`;

const PRODUCT_DETAIL_COLUMNS = `
  *,
  categories ( * ),
  artisans ( * ),
  product_images ( * ),
  craft_stories ( * ),
  craft_journeys ( * ),
  certificates ( * ),
  reviews ( id, rating, title, comment, created_at, is_verified_purchase )
`;

export interface RawCardRow {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  price_bdt: number;
  compare_at_price_bdt: number | null;
  stock_quantity: number;
  is_featured: boolean;
  region: BdDivision;
  materials: string[];
  categories: Pick<Tables<"categories">, "id" | "name" | "slug"> | null;
  artisans: Pick<
    Tables<"artisans">,
    "id" | "display_name" | "slug" | "district" | "region"
  > | null;
  product_images: Array<
    Pick<Tables<"product_images">, "url" | "alt_text" | "is_primary" | "sort_order">
  >;
  reviews: Array<Pick<Tables<"reviews">, "rating">>;
}

interface RawDetailRow extends Tables<"products"> {
  categories: Tables<"categories"> | null;
  artisans: Tables<"artisans"> | null;
  product_images: Tables<"product_images">[];
  craft_stories: Tables<"craft_stories"> | Tables<"craft_stories">[] | null;
  craft_journeys: Tables<"craft_journeys">[];
  certificates: Tables<"certificates"> | Tables<"certificates">[] | null;
  reviews: Array<
    Pick<
      Tables<"reviews">,
      | "id"
      | "rating"
      | "title"
      | "comment"
      | "created_at"
      | "is_verified_purchase"
    >
  >;
}

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function averageRating(ratings: number[]) {
  if (ratings.length === 0) return null;

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Math.round((total / ratings.length) * 10) / 10;
}

export function mapCard(row: RawCardRow): ProductCardData {
  const images = [...row.product_images].sort(
    (a, b) =>
      Number(b.is_primary) - Number(a.is_primary) ||
      a.sort_order - b.sort_order,
  );
  const primary = images[0] ?? null;
  const ratings = row.reviews
    .map((review) => review.rating)
    .filter((rating) => Number.isFinite(rating));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    priceBdt: row.price_bdt,
    compareAtPriceBdt: row.compare_at_price_bdt,
    stockQuantity: row.stock_quantity,
    isFeatured: row.is_featured,
    region: row.region,
    materials: row.materials,
    category: row.categories,
    artisan: row.artisans,
    primaryImage: primary
      ? { url: primary.url, alt_text: primary.alt_text }
      : null,
    ratingAverage: averageRating(ratings),
    reviewCount: ratings.length,
  };
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function emptyResult(page: number): CatalogueResult {
  return {
    items: [],
    total: 0,
    page,
    pageCount: 1,
    pageSize: CATALOGUE_PAGE_SIZE,
  };
}

export async function getCatalogueFacets(): Promise<CatalogueFacets> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const supabase = getPublicSupabaseClient();

  const [categoryResult, productResult, artisanResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("category_id, region, materials, occasion_tags, price_bdt")
      .eq("status", "published"),
    supabase
      .from("artisans")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  if (categoryResult.error) {
    throw new Error(`Could not load categories: ${categoryResult.error.message}`);
  }
  if (productResult.error) {
    throw new Error(`Could not load facets: ${productResult.error.message}`);
  }
  if (artisanResult.error) {
    throw new Error(`Could not count artisans: ${artisanResult.error.message}`);
  }

  const categories = categoryResult.data ?? [];
  const products = productResult.data ?? [];
  const categoryCounts = new Map<string, number>();
  const regionCounts = new Map<string, number>();
  const materialCounts = new Map<string, number>();
  const occasionCounts = new Map<string, number>();
  const prices: number[] = [];

  for (const product of products) {
    categoryCounts.set(
      product.category_id,
      (categoryCounts.get(product.category_id) ?? 0) + 1,
    );
    regionCounts.set(product.region, (regionCounts.get(product.region) ?? 0) + 1);
    prices.push(product.price_bdt);

    for (const material of product.materials) {
      materialCounts.set(material, (materialCounts.get(material) ?? 0) + 1);
    }

    for (const occasion of product.occasion_tags) {
      occasionCounts.set(occasion, (occasionCounts.get(occasion) ?? 0) + 1);
    }
  }

  const regions: CatalogueFacetCount<BdDivision>[] = DIVISIONS.filter(
    (division) => (regionCounts.get(division.value) ?? 0) > 0,
  ).map((division) => ({
    value: division.value,
    label: division.label,
    count: regionCounts.get(division.value) ?? 0,
  }));

  const materials: CatalogueFacetCount[] = [...materialCounts.entries()]
    .map(([value, count]) => ({ value, label: titleCase(value), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const occasions: CatalogueFacetCount[] = [...occasionCounts.entries()]
    .map(([value, count]) => ({
      value,
      label: OCCASION_LABELS[value] ?? titleCase(value),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: categoryCounts.get(category.id) ?? 0,
    })),
    regions,
    materials,
    occasions,
    price: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
    total: products.length,
    artisanCount: artisanResult.count ?? 0,
  };
}

export async function getCatalogueProducts(
  filters: CatalogueFilters,
): Promise<CatalogueResult> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const supabase = getPublicSupabaseClient();
  let categoryIds: string[] | null = null;

  if (filters.categories.length > 0) {
    const { data, error } = await supabase
      .from("categories")
      .select("id")
      .in("slug", filters.categories)
      .eq("is_active", true);

    if (error) {
      throw new Error(`Could not resolve categories: ${error.message}`);
    }

    categoryIds = (data ?? []).map((category) => category.id);

    if (categoryIds.length === 0) {
      return emptyResult(1);
    }
  }

  // Count first so an out-of-range ?page= can be clamped to the last real
  // page. PostgREST rejects ranges past the end with a 416 error.
  let countQuery = supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  if (categoryIds) countQuery = countQuery.in("category_id", categoryIds);
  if (filters.regions.length > 0) {
    countQuery = countQuery.in("region", filters.regions);
  }
  if (filters.materials.length > 0) {
    countQuery = countQuery.overlaps("materials", filters.materials);
  }
  if (filters.occasions.length > 0) {
    countQuery = countQuery.overlaps("occasion_tags", filters.occasions);
  }
  if (filters.minPrice !== undefined) {
    countQuery = countQuery.gte("price_bdt", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    countQuery = countQuery.lte("price_bdt", filters.maxPrice);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    throw new Error(`Could not count the catalogue: ${countError.message}`);
  }

  const total = count ?? 0;

  if (total === 0) {
    return emptyResult(1);
  }

  const pageCount = Math.max(1, Math.ceil(total / CATALOGUE_PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);

  let query = supabase
    .from("products")
    .select(PRODUCT_CARD_COLUMNS)
    .eq("status", "published");

  if (categoryIds) query = query.in("category_id", categoryIds);
  if (filters.regions.length > 0) query = query.in("region", filters.regions);
  if (filters.materials.length > 0) {
    query = query.overlaps("materials", filters.materials);
  }
  if (filters.occasions.length > 0) {
    query = query.overlaps("occasion_tags", filters.occasions);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte("price_bdt", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price_bdt", filters.maxPrice);
  }

  switch (filters.sort) {
    case "newest":
      query = query
        .order("published_at", { ascending: false })
        .order("title", { ascending: true });
      break;
    case "price-asc":
      query = query
        .order("price_bdt", { ascending: true })
        .order("title", { ascending: true });
      break;
    case "price-desc":
      query = query
        .order("price_bdt", { ascending: false })
        .order("title", { ascending: true });
      break;
    case "name":
      query = query.order("title", { ascending: true });
      break;
    case "featured":
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false });
      break;
  }

  const from = (page - 1) * CATALOGUE_PAGE_SIZE;
  const to = from + CATALOGUE_PAGE_SIZE - 1;
  const { data, error } = await query.range(from, to);

  if (error) {
    throw new Error(`Could not load the catalogue: ${error.message}`);
  }

  const rows = (data ?? []) as unknown as RawCardRow[];

  return {
    items: rows.map(mapCard),
    total,
    page,
    pageCount,
    pageSize: CATALOGUE_PAGE_SIZE,
  };
}

export async function getProductDetail(
  slug: string,
): Promise<ProductDetailData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue", `product-${slug}`);

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_DETAIL_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load this piece: ${error.message}`);
  }
  if (!data) return null;

  const row = data as unknown as RawDetailRow;
  const ratings = row.reviews
    .map((review) => review.rating)
    .filter((rating) => Number.isFinite(rating));

  return {
    product: row,
    category: firstOrNull(row.categories),
    artisan: firstOrNull(row.artisans),
    images: [...row.product_images].sort((a, b) => a.sort_order - b.sort_order),
    story: firstOrNull(row.craft_stories),
    journey: [...row.craft_journeys].sort((a, b) => a.sort_order - b.sort_order),
    certificate: firstOrNull(row.certificates),
    ratingAverage: averageRating(ratings),
    reviewCount: ratings.length,
    reviews: [...row.reviews]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.created_at,
        isVerifiedPurchase: review.is_verified_purchase,
      })),
  };
}

export async function getFeaturedProducts(limit = 4): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_COLUMNS)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Could not load featured pieces: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawCardRow[]).map(mapCard);
}

export async function getProductsByArtisan(
  artisanId: string,
): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue", `artisan-products-${artisanId}`);

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_COLUMNS)
    .eq("status", "published")
    .eq("artisan_id", artisanId)
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load this studio's pieces: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawCardRow[]).map(mapCard);
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4,
): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_COLUMNS)
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", excludeProductId)
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Could not load related pieces: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawCardRow[]).map(mapCard);
}
