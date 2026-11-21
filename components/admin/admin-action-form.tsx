"use client";

import { useActionState } from "react";
import {
  INITIAL_ADMIN_ACTION_STATE,
  type AdminActionState,
} from "@/lib/admin-state";

interface AdminActionFormProps {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  children: React.ReactNode;
  className?: string;
}

/**
 * Small client wrapper that keeps an admin form's validation error next to the
 * fields. Successful actions redirect back with a notice in the URL.
 */
export function AdminActionForm({
  action,
  children,
  className,
}: AdminActionFormProps) {
  const [state, formAction] = useActionState(
    action,
    INITIAL_ADMIN_ACTION_STATE,
  );

  return (
    <form action={formAction} className={className}>
      {children}
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
