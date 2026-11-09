import "server-only";

import { cache } from "react";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type {
  CheckoutDefaults,
  OrderDetailData,
  OrderListItem,
} from "@/types/domain";
import type { BdDivision } from "@/lib/supabase/enums";

interface RawOrderRow extends Tables<"orders"> {
  order_items: Tables<"order_items">[] | null;
}

function splitOrder(row: RawOrderRow): OrderDetailData {
  const { order_items: items, ...order } = row;

  return {
    order,
    items: [...(items ?? [])].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    ),
  };
}

export const getOrders = cache(async (): Promise<OrderListItem[]> => {
  const current = await getCurrentUser();
  if (!current) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items (*)")
    .eq("customer_id", current.user.id)
    .order("placed_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load your orders: ${error.message}`);
  }

  return ((data ?? []) as unknown as RawOrderRow[]).map(splitOrder);
});

export const getOrderByNumber = cache(
  async (orderNumber: string): Promise<OrderDetailData | null> => {
    const current = await getCurrentUser();
    if (!current) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items (*)")
      .eq("order_number", orderNumber)
      .eq("customer_id", current.user.id)
      .maybeSingle();

    if (error) {
      throw new Error(`Could not load this order: ${error.message}`);
    }
    if (!data) return null;

    return splitOrder(data as unknown as RawOrderRow);
  },
);

export const getOrderCount = cache(async (): Promise<number> => {
  const current = await getCurrentUser();
  if (!current) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", current.user.id);

  return count ?? 0;
});

export async function getDefaultAddress(
  profileId: string,
  fallback: { name: string; phone: string },
): Promise<CheckoutDefaults> {
  const supabase = await createClient();
  const { data: address } = await supabase
    .from("addresses")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_default", true)
    .maybeSingle();

  if (address) {
    return {
      recipientName: address.recipient_name,
      phone: address.phone,
      addressLine1: address.address_line1,
      addressLine2: address.address_line2 ?? "",
      city: address.city,
      district: address.district,
      division: address.division,
      postalCode: address.postal_code ?? "",
    };
  }

  return {
    recipientName: fallback.name,
    phone: fallback.phone,
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    division: "dhaka" satisfies BdDivision,
    postalCode: "",
  };
}
