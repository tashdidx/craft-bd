import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6">
      <Skeleton className="mt-6 h-3 w-56" />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <Skeleton className="aspect-square w-full rounded-[2rem]" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-5 h-12 w-11/12" />
          <Skeleton className="mt-3 h-12 w-2/3" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-8 h-20 w-full rounded-2xl" />
          <Skeleton className="mt-8 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
        </div>
      </div>

      <Skeleton className="mt-16 h-72 w-full rounded-[2rem]" />
    </div>
  );
}
