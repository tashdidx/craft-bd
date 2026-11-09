import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  LogOut,
  MailCheck,
  Package,
  ShieldCheck,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { AccountSkeleton } from "@/components/account/account-skeleton";
import { PasswordForm } from "@/components/account/password-form";
import { ProfileForm } from "@/components/account/profile-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { displayNameFor, requireUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { getCartCount } from "@/lib/data/cart";
import { getOrderCount } from "@/lib/data/orders";
import { getWishlistCount } from "@/lib/data/wishlist";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Your account",
  description: "Manage your Craft BD profile and sign-in details.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const current = await requireUser("/account");
  const { user, profile } = current;
  const name = displayNameFor(current);
  const firstName = name.split(/\s+/)[0] ?? name;
  const role = profile?.role ?? "customer";
  const memberSince = profile?.created_at ?? user.created_at;
  const [orderCount, wishlistCount, cartCount] = await Promise.all([
    getOrderCount(),
    getWishlistCount(),
    getCartCount(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Your account
          </p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">
            Hello, {firstName}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Your profile and sign-in details are held here. The catalogue and
            craft stories remain open to everyone.
          </p>
        </div>
        <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.6}
                />
              </span>
              <div>
                <h2 className="text-2xl leading-tight">Profile details</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This is the name and contact number attached to your account.
                </p>
              </div>
            </div>

            <div className="mt-6">
              {profile ? (
                <ProfileForm profile={profile} email={user.email ?? ""} />
              ) : (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                  Your profile record is not available right now. Refresh the
                  page in a moment.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.6}
                />
              </span>
              <div>
                <h2 className="text-2xl leading-tight">Password</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Choose a new password. Supabase Auth stores the credential;
                  Craft BD never sees it.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <PasswordForm />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl leading-tight">Account</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <MailCheck
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                    strokeWidth={1.7}
                  />
                  Email
                </dt>
                <dd className="mt-1 break-all">{user.email ?? "Not set"}</dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  {user.email_confirmed_at ? "Confirmed" : "Not confirmed"}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                    strokeWidth={1.7}
                  />
                  Member since
                </dt>
                <dd className="mt-1">{formatDate(memberSince)}</dd>
              </div>

              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Account role
                </dt>
                <dd className="mt-1">{ROLE_LABELS[role]}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl leading-tight">Your craft shelf</h2>
            <ul className="mt-4 space-y-2">
              <AccountLink
                href="/account/orders"
                label="Orders"
                count={orderCount}
                icon={Package}
              />
              <AccountLink
                href="/account/wishlist"
                label="Wishlist"
                count={wishlistCount}
                icon={Heart}
              />
              <AccountLink
                href="/cart"
                label="Cart"
                count={cartCount}
                icon={ShoppingBag}
              />
            </ul>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl leading-tight">Session</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Signing out clears this browser&apos;s Supabase session.
            </p>
            <form action={signOutAction} className="mt-5">
              <Button type="submit" variant="outline" className="w-full">
                <LogOut aria-hidden="true" className="size-4" strokeWidth={1.8} />
                Sign out
              </Button>
            </form>
          </section>

          <section className="rounded-3xl border border-border bg-accent p-6 text-accent-foreground">
            <h2 className="text-xl leading-tight">Keep browsing</h2>
            <p className="mt-2 text-sm leading-6 text-accent-foreground/70">
              Every published piece is still available without signing in.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Go to the catalogue
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}

function AccountLink({
  href,
  label,
  count,
  icon: Icon,
}: {
  href: string;
  label: string;
  count: number;
  icon: LucideIcon;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Icon aria-hidden="true" className="size-4" strokeWidth={1.7} />
        <span className="flex-1">{label}</span>
        <span className="text-xs tabular-nums">{count}</span>
        <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
      </Link>
    </li>
  );
}
