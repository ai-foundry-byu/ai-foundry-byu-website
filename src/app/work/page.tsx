import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { WorkGrid } from "@/components/WorkGrid"
import { SHOWCASE, SCHOOL_FULL, WORK_HEADING, WORK_LEAD } from "@/lib/content"

export const metadata: Metadata = {
  title: "Our work",
  description:
    "Products shipped by AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ". Every entry is live and in use today.",
  alternates: { canonical: "/work" },
}

/**
 * The full portfolio. The landing page's Showcase band highlights a few and
 * links here; this page holds everything and lets a visitor filter by
 * category. Both render the same SHOWCASE data through the same card, so
 * adding a build is one entry in content.ts plus one image.
 */
export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="surface-iron text-text-on-inverse">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className="eyebrow text-text-on-inverse-muted">Our work</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-6xl">
              {WORK_HEADING}
            </h1>
            <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-text-on-inverse-muted">
              {WORK_LEAD}
            </p>
          </div>
        </section>

        <WorkGrid items={SHOWCASE} />
      </main>
      <SiteFooter />
    </>
  )
}
