import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormAlertProps {
  variant: "error" | "success" | "info";
  children: React.ReactNode;
  className?: string;
}

const styles = {
  error: {
    box: "border-red-200 bg-red-50 text-red-800",
    icon: AlertCircle,
  },
  success: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: CheckCircle2,
  },
  info: {
    box: "border-border bg-secondary text-secondary-foreground",
    icon: Info,
  },
} as const;

export function FormAlert({ variant, children, className }: FormAlertProps) {
  const style = styles[variant];
  const Icon = style.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm leading-6",
        style.box,
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0"
        strokeWidth={1.8}
      />
      <div>{children}</div>
    </div>
  );
}
