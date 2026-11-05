import { Skeleton } from "@/components/ui/skeleton";

export function AccountSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-11 w-80 max-w-full" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <Skeleton className="h-[430px] rounded-3xl" />
          <Skeleton className="h-[320px] rounded-3xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
