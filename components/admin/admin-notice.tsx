import { CheckCircle2 } from "lucide-react";
import { adminNoticeMessage } from "@/lib/admin-state";

export function AdminNotice({
  notice,
}: {
  notice: string | string[] | undefined;
}) {
  const message = adminNoticeMessage(notice);
  if (!message) return null;

  return (
    <div
      role="status"
      className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      <CheckCircle2
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0"
        strokeWidth={1.8}
      />
      <p className="leading-6">{message}</p>
    </div>
  );
}
