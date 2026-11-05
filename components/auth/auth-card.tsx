import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_30px_90px_-60px_rgba(43,33,25,0.55)] sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
        Craft BD account
      </p>
      <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <div className="mt-7">{children}</div>
      {footer ? (
        <div className="mt-7 border-t border-border pt-5 text-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
      <Link
        href="/products"
        className="mt-7 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        Browse the catalogue without an account
        <ArrowRight aria-hidden="true" className="size-3.5" />
      </Link>
    </section>
  );
}
