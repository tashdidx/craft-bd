import { Badge } from "@/components/ui/badge";
import {
  ARTISAN_STATUS_LABELS,
  PRODUCT_STATUS_LABELS,
  REVIEW_STATUS_LABELS,
} from "@/lib/constants";
import {
  artisanStatusBadgeVariant,
  productStatusBadgeVariant,
  reviewStatusBadgeVariant,
} from "@/lib/admin";
import type {
  ArtisanStatus,
  ProductStatus,
  ReviewStatus,
} from "@/lib/supabase/enums";

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant={productStatusBadgeVariant(status)}>
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function ArtisanStatusBadge({ status }: { status: ArtisanStatus }) {
  return (
    <Badge variant={artisanStatusBadgeVariant(status)}>
      {ARTISAN_STATUS_LABELS[status]}
    </Badge>
  );
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <Badge variant={reviewStatusBadgeVariant(status)}>
      {REVIEW_STATUS_LABELS[status]}
    </Badge>
  );
}
