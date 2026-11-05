import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";
import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Craft BD account.",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function callbackMessage(code: string | undefined) {
  switch (code) {
    case "missing_code":
      return "That sign-in link is incomplete. Request a new link and try again.";
    case "link_expired":
      return "That link has expired or was already used. Request a new one.";
    default:
      return "We could not complete that sign-in. Try again.";
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = safeNextPath(first(params.next), "/account");
  const errorCode = first(params.error);
  const initialError = errorCode ? callbackMessage(errorCode) : undefined;

  return (
    <AuthCard
      title="Welcome back."
      description="Sign in to manage your profile and keep your details in one place."
      footer={
        <>
          New to Craft BD?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={next} initialError={initialError} />
    </AuthCard>
  );
}
