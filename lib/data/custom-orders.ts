import "server-only";

import { cache } from "react";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type {
  Artisan,
  Category,
  CustomOrder,
  CustomOrderArtisanSummary,
  CustomOrderDetailData,
  CustomOrderEvent,
  CustomOrderListItem,
} from "@/types/domain";

type RawArtisanRow = Pick<
  Artisan,
  | "id"
  | "slug"
  | "display_name"
  | "workshop_name"
  | "craft_specialization"
  | "district"
  | "region"
  | "avatar_url"
>;

type RawCategoryRow = Pick<Category, "id" | "name" | "slug">;

interface RawCustomOrderRow extends CustomOrder {
  artisans: RawArtisanRow | RawArtisanRow[] | null;
  categories: RawCategoryRow | RawCategoryRow[] | null;
}

interface RawCustomOrderDetailRow extends RawCustomOrderRow {
  custom_order_events: CustomOrderEvent[] | null;
}

const CUSTOM_ORDER_COLUMNS = `
  *,
  artisans (
    id,
    slug,
    display_name,
    workshop_name,
    craft_specialization,
    district,
    region,
    avatar_url
  ),
  categories ( id, name, slug )
`;

const CUSTOM_ORDER_DETAIL_COLUMNS = `
  ${CUSTOM_ORDER_COLUMNS},
  custom_order_events ( * )
`;

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function mapArtisan(
  row: RawArtisanRow | null,
): CustomOrderArtisanSummary | null {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    workshopName: row.workshop_name,
    craftSpecialization: row.craft_specialization,
    district: row.district,
    region: row.region,
    avatarUrl: row.avatar_url,
  };
}

function mapListItem(row: RawCustomOrderRow): CustomOrderListItem {
  const { artisans, categories, ...order } = row;

  return {
    order,
    artisan: mapArtisan(firstOrNull(artisans)),
    category: firstOrNull(categories),
  };
}

export const getCustomOrders = cache(
  async (): Promise<CustomOrderListItem[]> => {
    const current = await getCurrentUser();
    if (!current) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("custom_orders")
      .select(CUSTOM_ORDER_COLUMNS)
      .eq("customer_id", current.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Could not load your custom orders: ${error.message}`,
      );
    }

    return ((data ?? []) as unknown as RawCustomOrderRow[]).map(mapListItem);
  },
);

export const getCustomOrderByCode = cache(
  async (requestCode: string): Promise<CustomOrderDetailData | null> => {
    const current = await getCurrentUser();
    if (!current) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("custom_orders")
      .select(CUSTOM_ORDER_DETAIL_COLUMNS)
      .eq("request_code", requestCode)
      .eq("customer_id", current.user.id)
      .maybeSingle();

    if (error) {
      throw new Error(`Could not load this custom order: ${error.message}`);
    }
    if (!data) return null;

    const row = data as unknown as RawCustomOrderDetailRow;
    const { custom_order_events: events, ...listRow } = row;

    return {
      ...mapListItem(listRow),
      events: [...(events ?? [])].sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime(),
      ),
    };
  },
);

export const getCustomOrderCount = cache(async (): Promise<number> => {
  const current = await getCurrentUser();
  if (!current) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("custom_orders")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", current.user.id);

  return count ?? 0;
});
