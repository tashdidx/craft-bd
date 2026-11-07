import { ArtisanDirectorySkeleton } from "@/components/artisan/artisan-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArtisansLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6">
      <div className="border-b border-border py-12 sm:py-16">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-5 h-12 w-full max-w-2xl" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-full max-w-lg" />
      </div>
      <ArtisanDirectorySkeleton />
    </div>
  );
}
