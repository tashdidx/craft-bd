import Link from "next/link";
import { ArrowRight, Plus, ScanLine } from "lucide-react";

const FAQ = [
  {
    question: "How do I know a piece is really handmade?",
    answer:
      "Each listing names the studio, its district, and its craft. The making journey records six stages with the maker's own notes and timing, and every published piece carries a certificate code that resolves to the live record. Scan the QR label or enter the code on the Verify page.",
  },
  {
    question: "How is delivery priced, and how do I pay?",
    answer:
      "Delivery is BDT 120 anywhere in Bangladesh and free on orders of BDT 10,000 or more. Checkout recalculates the total from your saved cart, and payment is cash on delivery — no online gateway is involved.",
  },
  {
    question: "Can I add gift wrapping and a message?",
    answer:
      "Yes. Turn on gift wrap for individual pieces in your cart at BDT 150 per wrapped piece, then add a message of up to 280 characters at checkout. The message is recorded with the order for the studio to include.",
  },
  {
    question: "Do you deliver outside Bangladesh?",
    answer:
      "Not yet. Orders are currently delivered within Bangladesh only. Every parcel is tracked from pending through processing and shipping to delivered in your account, so you can follow each stage.",
  },
  {
    question: "What happens if a piece sells out while I am checking out?",
    answer:
      "Stock is checked again inside the order transaction. If a piece has just sold out, the order is stopped before anything is recorded or removed from your cart, and you are told which piece needs adjusting.",
  },
] as const;

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pt-20 sm:px-6"
    >
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Questions
          </p>
          <h2 className="mt-3 max-w-md text-3xl leading-tight sm:text-4xl">
            Before you order.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Pricing, wrapping, delivery, and provenance — the short version.
            Anything the catalogue records is also printed on the certificate
            that travels with the piece.
          </p>

          <div className="mt-8 rounded-3xl border border-border bg-secondary/50 p-5">
            <span className="grid size-9 place-items-center rounded-full bg-card text-primary">
              <ScanLine aria-hidden="true" className="size-4" strokeWidth={1.7} />
            </span>
            <p className="mt-3 text-sm font-medium">
              Holding a certificate code?
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Check the printed code against the live provenance record before
              you buy or gift the piece.
            </p>
            <Link
              href="/verify"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Verify a piece
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-[2rem] border border-border bg-card">
          {FAQ.map((item, index) => (
            <details
              key={item.question}
              name="home-faq"
              open={index === 0}
              className="group"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-5 py-5 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-7 sm:py-6 [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3 sm:gap-4">
                  <span className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium leading-6 transition-colors group-hover:text-primary group-open:text-primary sm:text-base">
                    {item.question}
                  </span>
                </span>
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-[transform,color,border-color] duration-300 group-open:rotate-45 group-open:border-primary/40 group-open:text-primary">
                  <Plus aria-hidden="true" className="size-4" strokeWidth={1.8} />
                </span>
              </summary>
              <div className="pr-5 pb-6 pl-[2.9rem] text-sm leading-7 text-muted-foreground sm:pr-7 sm:pl-[3.6rem]">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
