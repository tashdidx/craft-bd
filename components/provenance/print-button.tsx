"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintButtonProps {
  label: string;
  className?: string;
}

export function PrintButton({ label, className }: PrintButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={className ?? "w-full print:hidden"}
      onClick={() => window.print()}
    >
      <Printer aria-hidden="true" className="size-4" strokeWidth={1.8} />
      {label}
    </Button>
  );
}
