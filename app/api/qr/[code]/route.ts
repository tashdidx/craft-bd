import QRCode from "qrcode";
import {
  isValidCertificateCode,
  normalizeCertificateCode,
} from "@/lib/provenance";
import { resolveRequestOrigin } from "@/lib/request-origin";

interface QrRouteProps {
  params: Promise<{ code: string }>;
}

export async function GET(request: Request, { params }: QrRouteProps) {
  const { code: rawCode } = await params;
  const code = normalizeCertificateCode(rawCode);

  if (!isValidCertificateCode(code)) {
    return Response.json(
      { error: "A valid certificate code is required." },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") === "png" ? "png" : "svg";
  const download = url.searchParams.get("download") === "1";
  const origin = resolveRequestOrigin(request.headers);
  const verifyUrl = `${origin}/verify/${encodeURIComponent(code)}`;
  const filename = `craft-bd-${code}.${format}`;
  const disposition: Record<string, string> = download
    ? { "Content-Disposition": `attachment; filename="${filename}"` }
    : {};

  if (format === "png") {
    const buffer = await QRCode.toBuffer(verifyUrl, {
      type: "png",
      errorCorrectionLevel: "M",
      margin: 2,
      width: 1024,
      color: {
        dark: "#2b2119",
        light: "#ffffff",
      },
    });

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
        ...disposition,
      },
    });
  }

  const svg = await QRCode.toString(verifyUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 512,
    color: {
      dark: "#2b2119",
      light: "#ffffff",
    },
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      ...disposition,
    },
  });
}
