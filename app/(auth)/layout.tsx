import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Compass, ShieldCheck, UserRound } from "lucide-react";

const points = [
  {
    icon: UserRound,
    title: "Your details in one place",
    detail: "Name and contact information, held on your own account.",
  },
  {
    icon: ShieldCheck,
    title: "Supabase-backed sign-in",
    detail: "Passwords are handled by Supabase Auth, never stored by Craft BD.",
  },
  {
    icon: Compass,
    title: "The catalogue stays public",
    detail: "Browse every piece and story without creating an account.",
  },
] as const;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(154,63,36,0.10),transparent_42%),radial-gradient(circle_at_88%_22%,rgba(39,64,96,0.10),transparent_38%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
        <aside className="hidden lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Craft BD account
          </p>
          <h2 className="mt-4 max-w-md text-4xl leading-[1.08]">
            Keep the story attached to your side of the marketplace.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            An account keeps your details together while the catalogue stays
            open to everyone. Every piece still carries its maker, district,
            and process.
          </p>

          <ul className="mt-8 space-y-4">
            {points.map(({ icon: Icon, title, detail }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <Icon aria-hidden="true" className="size-4" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Continue to the catalogue
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </aside>

        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
