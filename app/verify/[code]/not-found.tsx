import Link from "next/link";
import { ScanLine, ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CertificateNotFound() {
  return (
    <div className="mx-auto grid w-full max-w-3xl place-items-center px-6 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <ShieldQuestion
          aria-hidden="true"
          className="size-6"
          strokeWidth={1.5}
        />
      </span>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
        Certificate not found
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">
        No certificate carries that code.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
        The code may be mistyped, or the certificate may not have been issued by
        Craft BD. Codes take the form{" "}
        <span className="font-mono text-xs text-foreground">
          CBD-JAM-2026-0001
        </span>{" "}
        and are printed on the card that ships with the piece.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/verify">
            <ScanLine aria-hidden="true" className="size-4" />
            Try another code
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Browse the catalogue</Link>
        </Button>
      </div>
    </div>
  );
}
