import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Choose a new password for your Craft BD account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

async function ResetPasswordContent() {
  const current = await getCurrentUser();

  if (!current) {
    return (
      <AuthCard
        title="This link has expired."
        description="Password reset links are single-use and time-limited. Request a fresh one to continue."
      >
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Choose a new password."
      description={
        current.user.email
          ? `You are resetting the password for ${current.user.email}.`
          : "Choose a new password for your account."
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
