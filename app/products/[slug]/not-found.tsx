import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto grid w-full max-w-3xl place-items-center px-6 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <PackageSearch
          aria-hidden="true"
          className="size-6"
          strokeWidth={1.5}
        />
      </span>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
        Piece not found
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">
        This piece is not in the current catalogue.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
        It may have been unpublished or the link may be incomplete. The full
        catalogue lists every published piece with its maker and origin.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/products">Browse the catalogue</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to the home page</Link>
        </Button>
      </div>
    </div>
  );
}
