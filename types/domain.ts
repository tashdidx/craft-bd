import type { Tables, TablesInsert } from "@/lib/supabase/database.types";
import type { BdDivision } from "@/lib/supabase/enums";

export type {
  ArtisanStatus,
  BdDivision,
  CertificateStatus,
  CustomOrderStatus,
  JourneyStage,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  ReviewStatus,
  UserRole,
} from "@/lib/supabase/enums";

export type Profile = Tables<"profiles">;
export type Category = Tables<"categories">;
export type Artisan = Tables<"artisans">;
export type Product = Tables<"products">;
export type ProductImage = Tables<"product_images">;
export type CraftStory = Tables<"craft_stories">;
export type CraftJourney = Tables<"craft_journeys">;
export type Certificate = Tables<"certificates">;
export type Address = Tables<"addresses">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type CustomOrder = Tables<"custom_orders">;
export type CustomOrderEvent = Tables<"custom_order_events">;
export type Review = Tables<"reviews">;
export type Cart = Tables<"carts">;
export type CartItem = Tables<"cart_items">;
export type Wishlist = Tables<"wishlists">;
export type AdminAction = Tables<"admin_actions">;

export type NewProduct = TablesInsert<"products">;
export type NewCustomOrder = TablesInsert<"custom_orders">;

/** Snapshot stored on orders so later address edits do not rewrite history. */
export interface ShippingAddressSnapshot {
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  district: string;
  division: BdDivision;
  postal_code?: string | null;
}

/** Public product card projection used by discovery and artisan pages. */
export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  priceBdt: number;
  compareAtPriceBdt: number | null;
  stockQuantity: number;
  isFeatured: boolean;
  region: BdDivision;
  materials: string[];
  category: Pick<Category, "id" | "name" | "slug"> | null;
  artisan: Pick<
    Artisan,
    "id" | "display_name" | "slug" | "district" | "region"
  > | null;
  primaryImage: Pick<ProductImage, "url" | "alt_text"> | null;
  ratingAverage: number | null;
  reviewCount: number;
}

/** Everything the product detail route renders in one read. */
export interface ProductDetailData {
  product: Product;
  category: Category | null;
  artisan: Artisan | null;
  images: ProductImage[];
  story: CraftStory | null;
  journey: CraftJourney[];
  certificate: Certificate | null;
  ratingAverage: number | null;
  reviewCount: number;
}

/** Public artisan card projection used by the directory and home page. */
export interface ArtisanDirectoryEntry {
  id: string;
  slug: string;
  displayName: string;
  workshopName: string | null;
  craftSpecialization: string;
  primaryCategory: Pick<Category, "id" | "name" | "slug"> | null;
  region: BdDivision;
  district: string;
  yearsOfExperience: number;
  biography: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  languages: string[];
  isFeatured: boolean;
  productCount: number;
}

export interface ArtisanDirectoryFacets {
  crafts: Array<{ slug: string; name: string; count: number }>;
  regions: CatalogueFacetCount<BdDivision>[];
  total: number;
}

export interface ArtisanDirectoryResult {
  items: ArtisanDirectoryEntry[];
  total: number;
  facets: ArtisanDirectoryFacets;
}

/** Everything the artisan profile route renders in one read. */
export interface ArtisanDetailData {
  artisan: Artisan;
  primaryCategory: Pick<Category, "id" | "name" | "slug"> | null;
  products: ProductCardData[];
  productCount: number;
  ratingAverage: number | null;
  reviewCount: number;
}

export interface CatalogueFacetCount<TValue extends string = string> {
  value: TValue;
  label: string;
  count: number;
}

export interface CatalogueCategoryFacet {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface CatalogueFacets {
  categories: CatalogueCategoryFacet[];
  regions: CatalogueFacetCount<BdDivision>[];
  materials: CatalogueFacetCount[];
  occasions: CatalogueFacetCount[];
  price: { min: number; max: number };
  total: number;
  artisanCount: number;
}

export interface CatalogueResult {
  items: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

/** One resolved cart line, joined with its product snapshot. */
export interface CartLine {
  id: string;
  productId: string;
  slug: string;
  title: string;
  priceBdt: number;
  quantity: number;
  stockQuantity: number;
  giftWrap: boolean;
  giftWrapAvailable: boolean;
  artisanId: string | null;
  artisanName: string | null;
  imageUrl: string | null;
  imageAlt: string;
  lineTotalBdt: number;
}

export interface CartData {
  id: string | null;
  items: CartLine[];
  itemCount: number;
  wrappedUnits: number;
  subtotalBdt: number;
  shippingBdt: number;
  giftWrapBdt: number;
  totalBdt: number;
}

export interface WishlistEntry {
  addedAt: string;
  product: ProductCardData;
}

export interface OrderListItem {
  order: Order;
  items: OrderItem[];
}

export interface OrderDetailData {
  order: Order;
  items: OrderItem[];
}

/** Prefill for the checkout shipping form. */
export interface CheckoutDefaults {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  division: BdDivision;
  postalCode: string;
}
