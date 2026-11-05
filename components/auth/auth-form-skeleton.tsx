import { Skeleton } from "@/components/ui/skeleton";

export function AuthFormSkeleton() {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-8">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-5 h-10 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <div className="mt-8 space-y-5">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index}>
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="mt-2 h-11 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
