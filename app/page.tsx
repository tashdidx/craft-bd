import { Database, MapPin, Package, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/constants";

const foundations = [
  {
    icon: Database,
    title: "18 relational tables",
    detail: "Accounts, catalogue, stories, provenance, commerce, and moderation.",
  },
  {
    icon: MapPin,
    title: "9 artisan studios",
    detail: "Narayanganj, Dhamrai, Jamalpur, Faridpur, Sylhet, and Rajshahi.",
  },
  {
    icon: Package,
    title: "16 seeded products",
    detail: "Across eight craft traditions, with materials, stock, and pricing.",
  },
  {
    icon: ShieldCheck,
    title: "RLS on every table",
    detail: "Public catalogue reads, owner-scoped writes, and JWT-based admin access.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-primary font-display text-xl text-primary-foreground">
            C
          </span>
          <div>
            <p className="font-display text-xl leading-none">{SITE.name}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Bangladeshi handicrafts
            </p>
          </div>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Foundation · Chunk 1
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 pb-20 pt-8 sm:pt-14">
        <section className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              A marketplace with memory
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Handmade in Bangladesh, carried with its story.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
              {SITE.description}
            </p>
            <p className="mt-6 max-w-2xl rounded-2xl border border-border bg-card/70 px-5 py-4 text-sm leading-6 text-muted-foreground">
              This build establishes the data foundation only. Product discovery,
              artisan pages, verification, cart, custom orders, and reviews arrive
              in the next chunks.
            </p>
          </div>

          <aside className="rounded-[2rem] border border-border bg-card p-7 shadow-[0_24px_80px_-48px_rgba(43,33,25,0.45)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Foundation status
            </p>
            <dl className="mt-5 space-y-4">
              <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
                <dt className="text-sm text-muted-foreground">Schema</dt>
                <dd className="font-display text-2xl">Complete</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
                <dt className="text-sm text-muted-foreground">RLS policies</dt>
                <dd className="font-display text-2xl">Enabled</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
                <dt className="text-sm text-muted-foreground">Seed data</dt>
                <dd className="font-display text-2xl">Loaded</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-muted-foreground">Backend</dt>
                <dd className="font-display text-2xl">Supabase</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-5 text-muted-foreground">
              Run <code className="rounded bg-muted px-1.5 py-0.5">npm run db:verify</code>{" "}
              to replay the migrations and seed against a throwaway Postgres.
            </p>
          </aside>
        </section>

        <section aria-labelledby="foundation-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                What is ready
              </p>
              <h2 id="foundation-heading" className="mt-3 text-3xl sm:text-4xl">
                A catalogue built to hold context.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Every product can carry its maker, origin, material story, six-stage
              making process, and a tamper-evident certificate.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {foundations.map(({ icon: Icon, title, detail }) => (
              <article
                key={title}
                className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 text-lg leading-snug">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] bg-accent px-7 py-10 text-accent-foreground sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-foreground/60">
                Next chunk
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
                Product discovery, filters, and the story behind every piece.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-accent-foreground/70">
                Chunk 2 adds the catalogue grid, faceted search by price, region,
                and material, the product detail page, craft stories, and the
                six-stage craft journey timeline.
              </p>
            </div>
            <div className="rounded-2xl border border-accent-foreground/15 px-5 py-4 text-sm text-accent-foreground/75">
              Awaiting review of Chunk 1
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{SITE.name} · Dhaka, Bangladesh</p>
          <p>Seed names and reviews are fictional; the craft traditions are real.</p>
        </div>
      </footer>
    </div>
  );
}
