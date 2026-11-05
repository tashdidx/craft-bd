import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Craft BD account to keep your profile and contact details in one place.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account."
      description="One account for your profile and contact details. The catalogue remains open without signing in."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
