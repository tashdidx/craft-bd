import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto grid w-full max-w-3xl place-items-center px-6 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <Compass aria-hidden="true" className="size-6" strokeWidth={1.5} />
      </span>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
        404
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">
        This path does not lead to a page.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
        The catalogue, craft stories, and product detail pages are all reachable
        from the home page.
      </p>
      <Button asChild className="mt-7">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
