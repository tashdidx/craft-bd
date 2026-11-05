import type {
  BdDivision,
  CustomOrderStatus,
  OrderStatus,
  ReviewStatus,
  UserRole,
} from "@/lib/supabase/enums";

export const SITE = {
  name: "Craft BD",
  tagline: "Handmade in Bangladesh, carried with its story.",
  description:
    "A digital marketplace connecting Bangladeshi artisans with customers who value provenance, craft, and cultural memory.",
  url: "https://craftbd.example",
} as const;

export const DIVISIONS: ReadonlyArray<{
  value: BdDivision;
  label: string;
}> = [
  { value: "barishal", label: "Barishal" },
  { value: "chattogram", label: "Chattogram" },
  { value: "dhaka", label: "Dhaka" },
  { value: "khulna", label: "Khulna" },
  { value: "mymensingh", label: "Mymensingh" },
  { value: "rajshahi", label: "Rajshahi" },
  { value: "rangpur", label: "Rangpur" },
  { value: "sylhet", label: "Sylhet" },
];

export const DIVISION_LABELS: Record<BdDivision, string> = Object.fromEntries(
  DIVISIONS.map((division) => [division.value, division.label]),
) as Record<BdDivision, string>;

export const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Customer",
  artisan: "Artisan",
  admin: "Administrator",
};

export const JOURNEY_STAGES = [
  {
    stage: "raw_materials",
    label: "Raw materials",
    shortLabel: "Materials",
    description: "Sourcing and preparing the material.",
  },
  {
    stage: "design",
    label: "Design",
    shortLabel: "Design",
    description: "Charting the motif or form.",
  },
  {
    stage: "making",
    label: "Making",
    shortLabel: "Making",
    description: "The handwork at the heart of the craft.",
  },
  {
    stage: "finishing",
    label: "Finishing",
    shortLabel: "Finishing",
    description: "Cleaning, polishing, and softening.",
  },
  {
    stage: "quality_check",
    label: "Quality check",
    shortLabel: "Quality",
    description: "Checking the details that matter.",
  },
  {
    stage: "final_product",
    label: "Final product",
    shortLabel: "Final",
    description: "Certified, wrapped, and ready to travel.",
  },
] as const;

export const ORDER_STATUS_FLOW: ReadonlyArray<OrderStatus> = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const CUSTOM_ORDER_FLOW: ReadonlyArray<CustomOrderStatus> = [
  "submitted",
  "quoted",
  "approved",
  "in_production",
  "quality_check",
  "dispatched",
  "completed",
];

export const CUSTOM_ORDER_STATUS_LABELS: Record<CustomOrderStatus, string> = {
  submitted: "Request submitted",
  quoted: "Estimate sent",
  approved: "Estimate approved",
  declined: "Estimate declined",
  in_production: "In production",
  quality_check: "Quality check",
  dispatched: "Dispatched",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pending",
  published: "Published",
  flagged: "Flagged",
  removed: "Removed",
};

export const OCCASIONS = [
  "wedding",
  "festival",
  "housewarming",
  "newborn",
  "birthday",
  "anniversary",
  "corporate",
  "everyday",
  "gift",
  "heirloom",
] as const;

export const OCCASION_LABELS: Record<string, string> = {
  wedding: "Wedding",
  festival: "Festival",
  housewarming: "Housewarming",
  newborn: "Newborn",
  birthday: "Birthday",
  anniversary: "Anniversary",
  corporate: "Corporate gift",
  everyday: "Everyday",
  gift: "Just because",
  heirloom: "Heirloom",
  work: "Work",
  dining: "Dining",
  summer: "Summer",
  art: "Art & display",
};

export const DEMO_ACCOUNTS = {
  password: "CraftBD@2026",
  admin: "admin@craftbd.test",
  customer: "nusrat.jahan@example.com",
  artisan: "rahima.begum@artisan.craftbd.test",
} as const;

export const DEFAULT_SHIPPING_BDT = 120;
export const FREE_SHIPPING_THRESHOLD_BDT = 10_000;
export const GIFT_WRAP_BDT = 150;
