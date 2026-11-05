# Craft BD

A digital marketplace connecting Bangladeshi artisans with customers who care
about provenance, craft, and cultural memory.

**Current build: Chunk 1 — project foundation, relational schema, and seed data.**
Product discovery, artisan pages, provenance verification, commerce, custom
orders, and moderation UI arrive in later chunks.

## Stack

- Next.js 16 App Router (TypeScript, React 19)
- Tailwind CSS v4 + shadcn/ui conventions + Lucide icons
- Supabase Postgres, Auth, and Row Level Security
- `@supabase/ssr` with Next.js Proxy session refresh

## What is in Chunk 1

- 18 public tables covering accounts, artisans, catalogue, cultural stories,
  craft journeys, provenance certificates, commerce, custom orders, reviews,
  carts/wishlists, and admin audit logs.
- Postgres enums, foreign keys, checks, generated totals, updated-at triggers,
  ownership helpers, and RLS policies for every table.
- A Supabase Auth trigger that creates a `profiles` row on signup.
- Demo seed data for 8 craft traditions, 9 artisan studios, 16 products, 16
  craft stories, 96 journey stages, 16 certificates, orders, reviews, and
  three custom orders at different lifecycle stages.
- Local SVG artwork for every seeded category and artisan, so the catalogue
  works without third-party image services.
- Typed Supabase browser/server/admin clients and a Next.js Proxy session
  refresher.

## Prerequisites

- Node.js 20.9+ (Node 22 is used in development)
- A Supabase project (hosted) **or** Docker Desktop for local Supabase CLI use
- Supabase CLI (installed as a dev dependency; `npx supabase` also works)

## 1. Install and configure

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
```

Fill `.env.local` from **Supabase Dashboard → Project Settings → API**:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Older Supabase projects can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead of
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; the app accepts either.

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in client code.

## 2. Apply the schema and seed

### Hosted Supabase (recommended when Docker is unavailable)

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npm run db:push
```

`db:push` runs `supabase db push --remote --include-seed`, applying both
migrations and `supabase/seed.sql`.

### Local Supabase (requires Docker)

```bash
npm run db:start
npm run db:reset
```

`db:reset` replays migrations and `seed.sql`. Local API: `http://127.0.0.1:54321`.

### Verify without a database

```bash
npm run db:verify
```

This starts a throwaway in-process Postgres (PGlite) with a stubbed Supabase
auth schema, runs both migrations and the seed, and asserts row counts,
six-stage journeys, primary images, certificate hashes, RLS enablement, and
other invariants. It is a test harness only; the app always uses Supabase.

## 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`. The foundation page does not require Supabase to
render, but authenticated and catalogue features in later chunks do.

## Demo accounts

Every seeded account uses the password **`CraftBD@2026`**.

| Role | Email |
| --- | --- |
| Admin | `admin@craftbd.test` |
| Customer | `nusrat.jahan@example.com` |
| Customer | `arif.hossain@example.com` |
| Artisan | `rahima.begum@artisan.craftbd.test` |
| Artisan | `gouranga.pal@artisan.craftbd.test` |

All names, workshops, prices, and reviews are demo data. The craft histories and
regional references describe real Bangladeshi traditions.

## Data model

| Area | Tables |
| --- | --- |
| Accounts | `profiles` |
| Craft taxonomy | `categories` |
| Artisans | `artisans` |
| Catalogue | `products`, `product_images` |
| Cultural storytelling | `craft_stories`, `craft_journeys` |
| Provenance | `certificates` |
| Commerce | `addresses`, `orders`, `order_items` |
| Custom orders | `custom_orders`, `custom_order_events` |
| Feedback | `reviews` |
| Cart & wishlist | `carts`, `cart_items`, `wishlists` |
| Admin audit | `admin_actions` |

Key rules enforced by the database:

- Money is `numeric(12,2)` in BDT; order and line totals are generated columns.
- A published product must have a publish date; stock cannot go negative.
- Every product can have one craft story, six ordered journey stages, one
  active certificate, and one primary image.
- Customers can only review products from a delivered order item.
- Artisans can manage their own products/images/stories/journeys, but only
  admins can change artisan approval status, featuring, or role.
- Admin authorization uses the signed JWT `app_metadata.role`, not a mutable
  profile column.
- Certificate payloads are hashed with SHA-256; `npm run db:verify` recomputes
  every hash.

## Useful commands

```bash
npm run dev          # Next.js development server
npm run build        # production build
npm run typecheck    # TypeScript, no emit
npm run lint         # ESLint
npm run db:verify    # offline schema + seed verification
npm run db:start     # local Supabase (Docker)
npm run db:reset     # reset local DB + replay seed
npm run db:push      # push migrations + seed to linked remote
npm run db:types     # regenerate lib/supabase/database.types.ts from remote
npm run art:generate # regenerate local craft/artisan SVGs
```

## Scope note

AI-driven recommendations (FR-13) are intentionally excluded. All discovery,
filtering, and gift suggestions are deterministic database queries over
category, region, materials, price, occasion, and stock.
