import Link from "next/link";
import { UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtisanNotFound() {
  return (
    <div className="mx-auto grid w-full max-w-3xl place-items-center px-6 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <UserRoundSearch
          aria-hidden="true"
          className="size-6"
          strokeWidth={1.5}
        />
      </span>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
        Studio not found
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">
        This artisan studio is not in the directory.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
        The studio may not be approved yet, or the link may be incomplete. The
        directory lists every approved maker with their craft and district.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/artisans">Browse artisan studios</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Browse the catalogue</Link>
        </Button>
      </div>
    </div>
  );
}
