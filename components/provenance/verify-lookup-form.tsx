"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  certificateVerifyPath,
  isValidCertificateCode,
  normalizeCertificateCode,
} from "@/lib/provenance";
import { cn } from "@/lib/utils";

export function VerifyLookupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = new FormData(event.currentTarget).get("code");
    const code = normalizeCertificateCode(
      typeof value === "string" ? value : "",
    );

    if (!isValidCertificateCode(code)) {
      setError(
        "Enter a full certificate code, for example CBD-JAM-2026-0001.",
      );
      return;
    }

    setError(null);
    setPending(true);
    router.push(certificateVerifyPath(code));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="certificate-code"
          className="text-sm font-medium text-foreground"
        >
          Certificate code
        </label>
        <input
          id="certificate-code"
          name="code"
          type="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={24}
          placeholder="CBD-JAM-2026-0001"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "certificate-code-error" : "certificate-code-hint"}
          className={cn(
            "mt-2 h-12 w-full rounded-xl border bg-background px-4 font-mono text-sm uppercase tracking-wider outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring",
            error
              ? "border-red-300 focus-visible:ring-red-300"
              : "border-border",
          )}
        />
        <p
          id="certificate-code-hint"
          className="mt-1.5 text-xs leading-5 text-muted-foreground"
        >
          Printed on the certificate card that ships with the piece, or shown on
          the product page.
        </p>
        {error ? (
          <p
            id="certificate-code-error"
            role="alert"
            className="mt-1.5 text-xs leading-5 text-red-700"
          >
            {error}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Opening the record…
          </>
        ) : (
          <>
            <Search aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Verify certificate
          </>
        )}
      </Button>
    </form>
  );
}
