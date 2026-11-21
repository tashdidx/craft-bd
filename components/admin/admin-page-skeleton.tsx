import { Skeleton } from "@/components/ui/skeleton";

export function AdminPageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-10 w-64" />
      <Skeleton className="mt-3 h-4 w-full max-w-lg" />
      <div className="mt-8 flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <div className="mt-8 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
