"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto grid w-full max-w-3xl place-items-center px-6 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <AlertTriangle
          aria-hidden="true"
          className="size-6"
          strokeWidth={1.5}
        />
      </span>
      <h1 className="mt-5 text-3xl">The catalogue could not load</h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
        The catalogue service did not respond. Try loading the pieces again.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          Reference: {error.digest}
        </p>
      ) : null}
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
