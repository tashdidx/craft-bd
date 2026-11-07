import QRCode from "qrcode";
import { cn } from "@/lib/utils";

interface VerificationQrProps {
  value: string;
  label: string;
  className?: string;
  size?: number;
}

/**
 * Renders a print-friendly QR code as inline SVG. The encoded value is always
 * the absolute verification URL for the current request origin.
 */
export async function VerificationQr({
  value,
  label,
  className,
  size = 208,
}: VerificationQrProps) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: size,
    color: {
      dark: "#2b2119",
      light: "#ffffff",
    },
  });

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("[&>svg]:h-auto [&>svg]:w-full", className)}
      // The generated SVG contains only paths and rectangles, never the input
      // text, so it is safe to inline.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
