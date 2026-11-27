import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-8 pb-20 sm:px-6">
      <Skeleton className="mt-6 h-3 w-56" />

      <div className="mt-6 grid gap-x-10 gap-y-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-14">
        <div className="lg:col-start-1 lg:row-start-1">
          <Skeleton className="aspect-[4/3] w-full rounded-[2rem]" />
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-5 h-12 w-11/12" />
          <Skeleton className="mt-3 h-12 w-2/3" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-8 h-20 w-full rounded-2xl" />
        </div>

        <div className="space-y-6 lg:col-start-1 lg:row-start-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-8 w-3/4 rounded-full" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>

      <Skeleton className="mt-16 h-72 w-full rounded-[2rem]" />
    </div>
  );
}
