import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, Boxes, ImageOff, Star } from "lucide-react";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFilterPills } from "@/components/admin/admin-filter-pills";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { AdminSearchForm } from "@/components/admin/admin-search-form";
import { ProductStatusBadge } from "@/components/admin/admin-badges";
import { SubmitButton } from "@/components/commerce/submit-button";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import {
  PRODUCT_STATUSES,
  parseProductStatusFilter,
  searchParam,
} from "@/lib/admin";
import { PRODUCT_STATUS_LABELS } from "@/lib/constants";
import { updateProductAction } from "@/lib/actions/admin";
import { getAdminProducts } from "@/lib/data/admin";
import { formatBdt } from "@/lib/format";

export const metadata: Metadata = {
  title: "Products",
  description: "Craft BD catalogue operations.",
  robots: { index: false, follow: false },
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...PRODUCT_STATUSES.map((status) => ({
    value: status,
    label: PRODUCT_STATUS_LABELS[status],
  })),
];

const INPUT_CLASS =
  "mt-1.5 block h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

const SELECT_CLASS =
  "mt-1.5 block h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminProductsPage(props: ProductsPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton rows={5} />}>
      <AdminProductsContent {...props} />
    </Suspense>
  );
}

async function AdminProductsContent({ searchParams }: ProductsPageProps) {
  await requireAdmin("/admin/products");
  const search = await searchParams;
  const status = parseProductStatusFilter(search.status);
  const q = searchParam(search.q);
  const products = await getAdminProducts({ status, q });

  const returnParams = new URLSearchParams();
  if (status !== "all") returnParams.set("status", status);
  if (q) returnParams.set("q", q);
  const returnTo =
    returnParams.size > 0
      ? `/admin/products?${returnParams.toString()}`
      : "/admin/products";

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        title="Products"
        description={`${products.length} ${
          products.length === 1 ? "piece" : "pieces"
        }${q ? ` matching “${q}”` : ""}. Adjust price and stock, publish or archive a piece, and choose what the home page features.`}
      />

      <AdminNotice notice={search.notice} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <AdminFilterPills
          basePath="/admin/products"
          current={status}
          options={FILTER_OPTIONS}
          q={q}
        />
        <AdminSearchForm
          basePath="/admin/products"
          status={status}
          q={q}
          placeholder="Search product title"
        />
      </div>

      {products.length === 0 ? (
        <div className="mt-8">
          <AdminEmptyState
            icon={Boxes}
            title={q ? "No pieces match that search" : "No pieces in this view"}
            description={
              q
                ? "Search matches the product title. Clear the search or choose another status."
                : "Draft, published, and archived pieces all appear here."
            }
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {products.map(({ product, category, artisan, primaryImage }) => (
            <li
              key={product.id}
              className="rounded-3xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="relative block h-24 w-full shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary sm:size-20">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 80px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-muted-foreground">
                      <ImageOff
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={1.5}
                      />
                    </span>
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-semibold underline-offset-4 hover:text-primary hover:underline"
                    >
                      {product.title}
                    </Link>
                    <ProductStatusBadge status={product.status} />
                    {product.is_featured ? (
                      <Badge variant="accent">
                        <Star
                          aria-hidden="true"
                          className="size-3 fill-current"
                          strokeWidth={1.6}
                        />
                        Featured
                      </Badge>
                    ) : null}
                    {product.status === "published" &&
                    product.stock_quantity <= 3 ? (
                      <Badge variant="warning">
                        {product.stock_quantity === 0
                          ? "Out of stock"
                          : `Low stock · ${product.stock_quantity}`}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {artisan?.display_name ?? "Studio"} ·{" "}
                    {category?.name ?? "Uncategorised"} · Stock{" "}
                    {product.stock_quantity} · {formatBdt(product.price_bdt)}
                  </p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View public page
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5"
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>

                <details className="w-full shrink-0 sm:w-72">
                  <summary className="cursor-pointer list-none rounded-full border border-border bg-background px-4 py-2 text-center text-xs font-medium transition-colors hover:border-primary/40 [&::-webkit-details-marker]:hidden">
                    Edit price, stock &amp; status
                  </summary>
                  <AdminActionForm
                    action={updateProductAction}
                    className="mt-3 rounded-2xl border border-border bg-background/60 p-4"
                  >
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-xs">
                        <span className="font-medium">Price (BDT)</span>
                        <input
                          type="number"
                          name="priceBdt"
                          required
                          min={1}
                          step="1"
                          defaultValue={product.price_bdt}
                          className={INPUT_CLASS}
                        />
                      </label>
                      <label className="block text-xs">
                        <span className="font-medium">Stock</span>
                        <input
                          type="number"
                          name="stockQuantity"
                          required
                          min={0}
                          step="1"
                          defaultValue={product.stock_quantity}
                          className={INPUT_CLASS}
                        />
                      </label>
                    </div>
                    <label className="mt-3 block text-xs">
                      <span className="font-medium">Catalogue status</span>
                      <select
                        name="status"
                        defaultValue={product.status}
                        className={SELECT_CLASS}
                      >
                        {PRODUCT_STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {PRODUCT_STATUS_LABELS[value]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mt-3 flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        defaultChecked={product.is_featured}
                        className="size-4 rounded border-border"
                      />
                      <span className="font-medium">Feature on the home page</span>
                    </label>
                    <SubmitButton
                      className="mt-4 w-full"
                      size="sm"
                      pendingLabel="Saving piece…"
                    >
                      Save piece
                    </SubmitButton>
                  </AdminActionForm>
                </details>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
