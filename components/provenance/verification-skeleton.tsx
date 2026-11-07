import { Skeleton } from "@/components/ui/skeleton";

export function VerificationSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-10 w-72 max-w-full" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Skeleton className="h-14 rounded-3xl" />
          <Skeleton className="h-[560px] rounded-[2rem]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
