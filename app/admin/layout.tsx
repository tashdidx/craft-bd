import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-6">
        <Suspense
          fallback={
            <Skeleton className="h-14 w-full rounded-3xl" aria-hidden="true" />
          }
        >
          <AdminNav />
        </Suspense>
      </div>
      {children}
    </div>
  );
}
