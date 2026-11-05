import { BadgeCheck, CalendarDays, Fingerprint, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { Certificate } from "@/types/domain";

function payloadString(payload: unknown, key: string) {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const value = (payload as Record<string, unknown>)[key];
    return typeof value === "string" ? value : null;
  }

  return null;
}

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const origin = payloadString(certificate.certificate_payload, "origin");
  const isActive = certificate.status === "active";

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-accent text-accent-foreground">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-accent-foreground/15 px-6 py-5">
        <div className="flex items-start gap-3">
          <BadgeCheck
            aria-hidden="true"
            className="mt-0.5 size-6 text-accent-foreground"
            strokeWidth={1.6}
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-foreground/60">
              Provenance certificate
            </p>
            <p className="mt-1 font-mono text-sm">
              {certificate.certificate_code}
            </p>
          </div>
        </div>
        <Badge variant={isActive ? "success" : "warning"}>
          {isActive ? "Active" : certificate.status}
        </Badge>
      </div>

      <dl className="space-y-4 px-6 py-5 text-sm">
        <div className="flex items-start gap-3">
          <CalendarDays
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-accent-foreground/60"
            strokeWidth={1.6}
          />
          <div>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-accent-foreground/55">
              Issued
            </dt>
            <dd className="mt-0.5">{formatDate(certificate.issued_at)}</dd>
          </div>
        </div>

        {origin ? (
          <div className="flex items-start gap-3">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-accent-foreground/60"
              strokeWidth={1.6}
            />
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-accent-foreground/55">
                Recorded origin
              </dt>
              <dd className="mt-0.5">{origin}</dd>
            </div>
          </div>
        ) : null}

        <div className="flex items-start gap-3">
          <Fingerprint
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-accent-foreground/60"
            strokeWidth={1.6}
          />
          <div className="min-w-0">
            <dt className="text-[11px] uppercase tracking-[0.16em] text-accent-foreground/55">
              Tamper-evident hash
            </dt>
            <dd
              className="mt-1 break-all font-mono text-[10px] leading-5 text-accent-foreground/75"
              title={certificate.certificate_hash}
            >
              {certificate.certificate_hash}
            </dd>
          </div>
        </div>
      </dl>

      <p className="border-t border-accent-foreground/15 px-6 py-4 text-xs leading-5 text-accent-foreground/60">
        The hash is computed from the certificate payload recorded at issuance,
        so any later change to the record would produce a different hash.
      </p>
    </article>
  );
}
