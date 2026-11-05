import { DIVISIONS, DIVISION_LABELS, OCCASION_LABELS, OCCASIONS } from "@/lib/constants";
import type { BdDivision } from "@/lib/supabase/enums";
import { formatBdt } from "@/lib/format";

export const CATALOGUE_PAGE_SIZE = 12;

export const CATALOGUE_SORTS = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "name",
] as const;

export type CatalogueSort = (typeof CATALOGUE_SORTS)[number];

export interface CatalogueFilters {
  categories: string[];
  regions: BdDivision[];
  materials: string[];
  occasions: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: CatalogueSort;
  page: number;
}

export interface CatalogueInput {
  name: string;
  value: string;
}

export interface ActiveCatalogueFilter {
  key: string;
  label: string;
  href: string;
}

export const CATALOGUE_SORT_OPTIONS: ReadonlyArray<{
  value: CatalogueSort;
  label: string;
}> = [
  { value: "featured", label: "Featured first" },
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

export const PRICE_BANDS: ReadonlyArray<{
  label: string;
  minPrice?: number;
  maxPrice?: number;
}> = [
  { label: "Under ৳2,000", maxPrice: 1_999 },
  { label: "৳2,000 – ৳5,000", minPrice: 2_000, maxPrice: 5_000 },
  { label: "৳5,000 – ৳10,000", minPrice: 5_001, maxPrice: 10_000 },
  { label: "Over ৳10,000", minPrice: 10_001 },
];

const CATEGORY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_REGIONS = new Set<string>(DIVISIONS.map((division) => division.value));
const VALID_OCCASIONS = new Set<string>(OCCASIONS);
const VALID_SORTS = new Set<string>(CATALOGUE_SORTS);

export function createEmptyCatalogueFilters(): CatalogueFilters {
  return {
    categories: [],
    regions: [],
    materials: [],
    occasions: [],
    sort: "featured",
    page: 1,
  };
}

function toArray(value: string | string[] | undefined): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value;
  return [];
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function normalizeToken(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 60);
}

function parsePrice(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;

  return Math.min(Math.floor(parsed), 100_000_000);
}

function parsePage(value: string | string[] | undefined) {
  const parsed = parsePrice(value);
  if (parsed === undefined) return 1;

  return Math.min(Math.max(parsed, 1), 10_000);
}

export function parseCatalogueSearchParams(
  input: Record<string, string | string[] | undefined>,
): CatalogueFilters {
  const categories = unique(
    toArray(input.category)
      .map(normalizeToken)
      .filter((value) => CATEGORY_SLUG_PATTERN.test(value)),
  ).slice(0, 20);

  const regions = unique(
    toArray(input.region)
      .map(normalizeToken)
      .filter((value) => VALID_REGIONS.has(value)),
  ).slice(0, 8) as BdDivision[];

  const materials = unique(
    toArray(input.material)
      .map(normalizeToken)
      .filter(Boolean),
  ).slice(0, 20);

  const occasions = unique(
    toArray(input.occasion)
      .map(normalizeToken)
      .filter((value) => VALID_OCCASIONS.has(value)),
  ).slice(0, 20);

  let minPrice = parsePrice(input.min);
  let maxPrice = parsePrice(input.max);

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  const sortValue = toArray(input.sort)[0]?.trim() ?? "";
  const sort = VALID_SORTS.has(sortValue)
    ? (sortValue as CatalogueSort)
    : "featured";

  return {
    categories,
    regions,
    materials,
    occasions,
    minPrice,
    maxPrice,
    sort,
    page: parsePage(input.page),
  };
}

/**
 * Serializes filters into the canonical query shape. The page is reset to 1
 * whenever a facet changes, and defaults are omitted so URLs stay readable.
 */
export function catalogueSearchParams(
  filters: CatalogueFilters,
  overrides: Partial<CatalogueFilters> = {},
) {
  const next: CatalogueFilters = {
    ...filters,
    ...overrides,
    page: overrides.page ?? 1,
  };
  const params = new URLSearchParams();

  for (const value of next.categories) params.append("category", value);
  for (const value of next.regions) params.append("region", value);
  for (const value of next.materials) params.append("material", value);
  for (const value of next.occasions) params.append("occasion", value);

  if (next.minPrice !== undefined) params.set("min", String(next.minPrice));
  if (next.maxPrice !== undefined) params.set("max", String(next.maxPrice));
  if (next.sort !== "featured") params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));

  return params;
}

export function catalogueHref(
  filters: CatalogueFilters,
  overrides: Partial<CatalogueFilters> = {},
) {
  const query = catalogueSearchParams(filters, overrides).toString();
  return query ? `/products?${query}` : "/products";
}

export function catalogueInputs(
  filters: CatalogueFilters,
  options: { includeSort?: boolean; includePage?: boolean } = {},
): CatalogueInput[] {
  const inputs: CatalogueInput[] = [];

  for (const value of filters.categories) inputs.push({ name: "category", value });
  for (const value of filters.regions) inputs.push({ name: "region", value });
  for (const value of filters.materials) inputs.push({ name: "material", value });
  for (const value of filters.occasions) inputs.push({ name: "occasion", value });

  if (filters.minPrice !== undefined) {
    inputs.push({ name: "min", value: String(filters.minPrice) });
  }
  if (filters.maxPrice !== undefined) {
    inputs.push({ name: "max", value: String(filters.maxPrice) });
  }
  if (options.includeSort !== false && filters.sort !== "featured") {
    inputs.push({ name: "sort", value: filters.sort });
  }
  if (options.includePage && filters.page > 1) {
    inputs.push({ name: "page", value: String(filters.page) });
  }

  return inputs;
}

export function getActiveCatalogueFilters(
  filters: CatalogueFilters,
): ActiveCatalogueFilter[] {
  const active: ActiveCatalogueFilter[] = [];

  for (const value of filters.categories) {
    active.push({
      key: `category-${value}`,
      label: value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      href: catalogueHref(filters, {
        categories: filters.categories.filter((item) => item !== value),
      }),
    });
  }

  for (const value of filters.regions) {
    active.push({
      key: `region-${value}`,
      label: DIVISION_LABELS[value],
      href: catalogueHref(filters, {
        regions: filters.regions.filter((item) => item !== value),
      }),
    });
  }

  for (const value of filters.materials) {
    active.push({
      key: `material-${value}`,
      label: value.replace(/\b\w/g, (letter) => letter.toUpperCase()),
      href: catalogueHref(filters, {
        materials: filters.materials.filter((item) => item !== value),
      }),
    });
  }

  for (const value of filters.occasions) {
    active.push({
      key: `occasion-${value}`,
      label: OCCASION_LABELS[value] ?? value,
      href: catalogueHref(filters, {
        occasions: filters.occasions.filter((item) => item !== value),
      }),
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const label =
      filters.minPrice !== undefined && filters.maxPrice !== undefined
        ? `${formatBdt(filters.minPrice)} – ${formatBdt(filters.maxPrice)}`
        : filters.minPrice !== undefined
          ? `From ${formatBdt(filters.minPrice)}`
          : `Up to ${formatBdt(filters.maxPrice ?? 0)}`;

    active.push({
      key: "price",
      label,
      href: catalogueHref(filters, {
        minPrice: undefined,
        maxPrice: undefined,
      }),
    });
  }

  return active;
}

export function countActiveCatalogueFilters(filters: CatalogueFilters) {
  return (
    filters.categories.length +
    filters.regions.length +
    filters.materials.length +
    filters.occasions.length +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0)
  );
}

export function getPageWindow(
  page: number,
  pageCount: number,
): Array<number | "ellipsis"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);

  if (page <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (page >= pageCount - 2) {
    pages.add(pageCount - 1);
    pages.add(pageCount - 2);
    pages.add(pageCount - 3);
  }

  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  const window: Array<number | "ellipsis"> = [];

  for (const value of sorted) {
    const previous = window.at(-1);
    if (typeof previous === "number" && value - previous > 1) {
      window.push("ellipsis");
    }
    window.push(value);
  }

  return window;
}
