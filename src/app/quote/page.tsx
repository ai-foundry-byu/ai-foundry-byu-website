import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { EmbeddedForm } from "@/components/EmbeddedForm"
import { FORMS, QUOTE_LEAD, QUOTE_STEPS, SCHOOL_FULL } from "@/lib/content"

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Tell AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ", what you want built. Eight fields, and you get back a scope of work, a cost estimate, and a delivery timeline.",
  alternates: { canonical: "/quote" },
}

/**
 * This page exists to hold the form and nothing else.
 *
 * That is the whole design constraint. Someone arrives here having already
 * read the offerings on the landing page and decided to act, so anything else
 * competing for attention is a reason to stop before submitting. No offerings
 * repeated, no nav bait, one column, one thing to do.
 */
export default function QuotePage() {
  return (
    <>
      <SiteHeader />
      <main className="surface-iron text-text-on-inverse">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
              Request a quote
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-on-inverse-muted">
              {QUOTE_LEAD}
            </p>
          </div>

          <div className="mt-14">
            {/*
              Eight questions. Heights measured against a real 390px viewport,
              not guessed: the form's content runs about 1895px there, so 1950
              clears Submit with roughly 55px of slack. It shortens as the
              breakpoints rise because Google's card caps at 640px wide, so the
              labels stop rewrapping once the column can hold that.
            */}
            <EmbeddedForm
              src={FORMS.intake}
              title="Request a quote"
              heightClass="h-[1950px] sm:h-[1890px] md:h-[1840px]"
              tone="inverse"
            />
          </div>

          {/* After the form, not before it. Someone who is ready to fill it in
              should meet the fields first; this is for the ones who scroll
              past looking for what it commits them to. */}
          <div className="mt-16 border-t border-border-on-inverse pt-12">
            <h2 className="eyebrow text-center text-text-on-inverse-muted">
              What happens next
            </h2>
            <ol className="mt-8 grid gap-8 sm:grid-cols-3">
              {QUOTE_STEPS.map((step) => (
                <li key={step.n}>
                  {/* On navy the muted token is BYU Light Blue at 8.99:1, so
                      unlike the tinted band this needs no opacity juggling. */}
                  <span className="eyebrow block text-text-on-inverse-muted">
                    {String(step.n).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-base font-semibold text-text-on-inverse">
                    {step.title}
                  </span>
                  <span className="mt-1.5 block text-base leading-relaxed text-text-on-inverse-muted">
                    {step.detail}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-14 text-center text-base text-text-on-inverse-muted">
            Not ready yet?{" "}
            <Link href="/#quote" className="font-semibold text-text-on-inverse underline underline-offset-4">
              Read what we build
            </Link>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
