import { Skeleton } from "@/components/ui/skeleton";

export function ArtisanDirectorySkeleton() {
  return (
    <div className="mt-8 space-y-8">
      <Skeleton className="h-44 rounded-3xl" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-3xl border border-border">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArtisanProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-6 h-56 w-full rounded-[2rem] sm:h-72" />
      <div className="mt-6 flex items-end gap-5">
        <Skeleton className="size-24 rounded-full" />
        <div className="flex-1 space-y-3 pb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-2xl" />
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}
