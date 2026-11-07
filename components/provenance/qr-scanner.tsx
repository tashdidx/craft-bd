"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  CameraOff,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  ScanLine,
} from "lucide-react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import {
  certificateCodeFromScan,
  certificateVerifyPath,
} from "@/lib/provenance";
import { cn } from "@/lib/utils";

interface BarcodeDetectorResult {
  rawValue: string;
}

interface BarcodeDetectorInstance {
  detect(source: CanvasImageSource): Promise<BarcodeDetectorResult[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance;
  getSupportedFormats?: () => Promise<string[]>;
}

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

type ScannerStatus = "idle" | "starting" | "scanning" | "success" | "error";

function cameraErrorMessage(error: unknown) {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
        return "Camera permission was denied. Allow camera access in your browser settings, or enter the code manually.";
      case "NotFoundError":
        return "No camera was found on this device. Enter the code manually instead.";
      case "NotReadableError":
        return "The camera is already in use by another app. Close it and try again.";
      case "OverconstrainedError":
        return "This device cannot open a rear camera. Try a different browser or enter the code manually.";
      case "SecurityError":
        return "Camera access is blocked on this connection. Use HTTPS or localhost.";
      default:
        return "The camera could not be started. Enter the code manually instead.";
    }
  }

  return "The camera could not be started. Enter the code manually instead.";
}

export function QrScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const detectorRef = useRef<BarcodeDetectorInstance | null>(null);
  const decodingRef = useRef(false);
  const stoppedRef = useRef(true);
  const lastRejectedRef = useRef<{ value: string; at: number } | null>(null);
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    stoppedRef.current = true;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    detectorRef.current = null;
    decodingRef.current = false;

    const video = videoRef.current;

    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const handleDecoded = useCallback(
    (value: string) => {
      const code = certificateCodeFromScan(value, window.location.origin);

      if (!code) {
        const now = Date.now();
        const previous = lastRejectedRef.current;

        if (
          !previous ||
          previous.value !== value ||
          now - previous.at > 2500
        ) {
          lastRejectedRef.current = { value, at: now };
          setMessage(
            "That QR code is not a Craft BD product label. Point the camera at a label printed by Craft BD.",
          );
        }

        return;
      }

      stopCamera();
      setStatus("success");
      setMessage(`Opening the product record for ${code}…`);
      router.push(certificateVerifyPath(code));
    },
    [router, stopCamera],
  );

  const startCamera = useCallback(async () => {
    setStatus("starting");
    setMessage(null);
    lastRejectedRef.current = null;

    if (!window.isSecureContext) {
      setStatus("error");
      setMessage(
        "Camera access needs HTTPS or localhost. Enter the code manually instead.",
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setMessage(
        "This browser does not support camera access. Enter the code manually instead.",
      );
      return;
    }

    stoppedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
        },
      });

      if (stoppedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        stopCamera();
        setStatus("error");
        setMessage("The scanner could not start. Enter the code manually instead.");
        return;
      }

      video.srcObject = stream;
      await video.play();

      const Detector = window.BarcodeDetector;

      if (Detector) {
        try {
          const formats = Detector.getSupportedFormats
            ? await Detector.getSupportedFormats()
            : ["qr_code"];

          if (formats.includes("qr_code")) {
            detectorRef.current = new Detector({ formats: ["qr_code"] });
          }
        } catch {
          detectorRef.current = null;
        }
      }

      setStatus("scanning");
      setMessage("Point the camera at the QR code on the product label.");

      const tick = async () => {
        if (stoppedRef.current) return;

        const currentVideo = videoRef.current;
        const currentCanvas = canvasRef.current;

        if (!currentVideo || !currentCanvas) return;

        if (
          !decodingRef.current &&
          currentVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        ) {
          decodingRef.current = true;

          try {
            let value: string | null = null;

            if (detectorRef.current) {
              try {
                const results = await detectorRef.current.detect(currentVideo);
                value = results[0]?.rawValue ?? null;
              } catch {
                detectorRef.current = null;
              }
            }

            if (!value && !detectorRef.current) {
              const width = currentVideo.videoWidth;
              const height = currentVideo.videoHeight;

              if (width > 0 && height > 0) {
                currentCanvas.width = width;
                currentCanvas.height = height;

                const context = currentCanvas.getContext("2d", {
                  willReadFrequently: true,
                });

                if (context) {
                  context.drawImage(currentVideo, 0, 0, width, height);
                  const frame = context.getImageData(0, 0, width, height);
                  const result = jsQR(frame.data, frame.width, frame.height, {
                    inversionAttempts: "dontInvert",
                  });
                  value = result?.data ?? null;
                }
              }
            }

            if (value) handleDecoded(value);
          } finally {
            decodingRef.current = false;
          }
        }

        if (!stoppedRef.current) {
          frameRef.current = requestAnimationFrame(() => {
            void tick();
          });
        }
      };

      frameRef.current = requestAnimationFrame(() => {
        void tick();
      });
    } catch (error) {
      stopCamera();
      setStatus("error");
      setMessage(cameraErrorMessage(error));
    }
  }, [handleDecoded, stopCamera]);

  const handleStop = useCallback(() => {
    stopCamera();
    setStatus("idle");
    setMessage(null);
  }, [stopCamera]);

  const active = status === "scanning" || status === "success";

  return (
    <div className="rounded-[2rem] border border-border bg-card p-4 shadow-[0_30px_90px_-70px_rgba(43,33,25,0.6)] sm:p-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#171310]">
        <video
          ref={videoRef}
          className={cn(
            "size-full object-cover transition-opacity",
            active ? "opacity-100" : "opacity-0",
          )}
          muted
          playsInline
          autoPlay
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {status === "scanning" ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <div className="relative size-52 max-w-[70%]">
              <span className="absolute top-0 left-0 size-8 rounded-tl-lg border-t-2 border-l-2 border-white/90" />
              <span className="absolute top-0 right-0 size-8 rounded-tr-lg border-t-2 border-r-2 border-white/90" />
              <span className="absolute bottom-0 left-0 size-8 rounded-bl-lg border-b-2 border-l-2 border-white/90" />
              <span className="absolute right-0 bottom-0 size-8 rounded-br-lg border-r-2 border-b-2 border-white/90" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-white">
            <div className="grid justify-items-center gap-3">
              {status === "starting" ? (
                <Loader2
                  aria-hidden="true"
                  className="size-7 animate-spin text-white/80"
                />
              ) : status === "success" ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="size-8 text-emerald-400"
                />
              ) : status === "error" ? (
                <CameraOff
                  aria-hidden="true"
                  className="size-8 text-white/70"
                />
              ) : (
                <Camera
                  aria-hidden="true"
                  className="size-8 text-white/70"
                />
              )}
              <p className="text-sm font-medium">
                {status === "starting"
                  ? "Requesting camera access…"
                  : status === "success"
                    ? "Opening the product record…"
                    : status === "error"
                      ? "Camera unavailable"
                      : "Camera is off"}
              </p>
              {status === "idle" ? (
                <p className="max-w-xs text-xs leading-5 text-white/60">
                  Start the camera when you are ready to scan a product label.
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {message ? (
          <p
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
            className={cn(
              "text-xs leading-5",
              status === "error" ? "text-red-700" : "text-muted-foreground",
            )}
          >
            {message}
          </p>
        ) : null}

        {status === "idle" || status === "error" ? (
          <Button
            type="button"
            onClick={() => {
              void startCamera();
            }}
            className="w-full"
          >
            <ScanLine aria-hidden="true" className="size-4" strokeWidth={1.8} />
            {status === "error" ? "Try the camera again" : "Start camera"}
          </Button>
        ) : null}

        {status === "starting" ? (
          <Button type="button" disabled className="w-full">
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Starting camera…
          </Button>
        ) : null}

        {status === "scanning" ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleStop}
            className="w-full"
          >
            <CameraOff aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Stop camera
          </Button>
        ) : null}

        <p className="text-center text-xs leading-5 text-muted-foreground">
          Or{" "}
          <Link
            href="/verify"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            enter the certificate code manually
            <ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" />
          </Link>
          .
        </p>

        <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <LockKeyhole aria-hidden="true" className="size-3" strokeWidth={1.8} />
          The camera feed stays on your device. No frames are uploaded.
        </p>
      </div>
    </div>
  );
}
