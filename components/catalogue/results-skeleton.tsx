import { Skeleton } from "@/components/ui/skeleton";

export function CatalogueResultsSkeleton() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-44 rounded-full" />
      </div>

      <div className="mt-7 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index}>
            <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
            <Skeleton className="mt-4 h-3 w-28" />
            <Skeleton className="mt-3 h-5 w-4/5" />
            <Skeleton className="mt-2 h-3 w-1/2" />
            <Skeleton className="mt-4 h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
