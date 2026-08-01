import type { Metadata } from "next"
import Image from "next/image"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import {
  CULTURE_DOUBLE_CLICK_HEADING,
  CULTURE_DOUBLE_CLICK_LEAD,
  CULTURE_EYEBROW,
  CULTURE_HEADING,
  CULTURE_LEAD,
  CULTURE_PRACTICES,
  CULTURE_PRINCIPLES,
  MARRIOTT_EYEBROW,
  MARRIOTT_GUIDING,
  MARRIOTT_MISSION,
  MARRIOTT_VALUES,
  MARRIOTT_VISION,
  ERA_NARRATIVE,
  FACULTY,
  SCHOOL_FULL,
  TEAM,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "About us",
  description:
    "The people behind AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ".",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="surface-iron text-text-on-inverse">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="flex items-start gap-5">
              <span aria-hidden className="ember-bar mt-2 h-16 w-1 shrink-0" />
              <div>
                <p className="eyebrow text-text-on-inverse-muted">About us</p>
                <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-6xl">
                  The people behind the Foundry.
                </h1>
              </div>
            </div>
            <p className="mt-8 max-w-[46rem] text-lg leading-relaxed text-text-on-inverse-muted">
              {ERA_NARRATIVE}
            </p>
          </div>
        </section>

        {/* Faculty first. It is the highest-credibility item on the site. */}
        <section className="surface-paper-dim">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="max-w-3xl border-l-2 border-border-accent pl-6">
              <p className="eyebrow text-text-primary opacity-80">
                {FACULTY.role}
              </p>
              <p className="mt-3 font-serif text-2xl font-semibold text-text-primary md:text-3xl">
                {FACULTY.name}
              </p>
              <p className="mt-3 max-w-[38rem] text-base leading-relaxed text-text-primary">
                {FACULTY.detail}
              </p>
            </div>
          </div>
        </section>

        <section className="surface-paper">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-text-primary md:text-4xl">
              The team
            </h2>

            <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((member) => (
                <article
                  key={member.name}
                  className="group flex flex-col border border-border-subtle"
                >
                  <div className="relative aspect-square bg-surface-inverse">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                      className="photo-duotone object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow text-text-primary opacity-80">
                      {member.role}
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-semibold text-text-primary">
                      {member.name}
                    </h3>
                    {member.bio && (
                      <p className="mt-3 text-base leading-relaxed text-text-primary opacity-90">
                        {member.bio}
                      </p>
                    )}
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-ember mt-auto inline-flex w-fit items-center pt-5 text-base font-semibold"
                    >
                      LinkedIn
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────
            Culture. The people above, the pyramid they run on below.

            The pyramid reads top down, and the page renders it in that
            order. The apex is BYU Marriott's own vision, mission, values,
            and guiding principle, verbatim and credited: the program
            inherits them, it does not edit them. They get the navy plate
            because primacy should be visible, not just stated. Below the
            plate is the double click: operating principles gathered from
            four named organizations (see the Culture block in content.ts),
            each row crediting where it came from, rendered as the same
            hairline-divided ledger /network uses. The audience is a client
            or a prospective student deciding what they are signing up for.
            ──────────────────────────────────────────────────── */}
        <section className="surface-paper-dim">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p className="eyebrow text-center text-text-accent">
              {CULTURE_EYEBROW}
            </p>
            <h2 className="mt-4 text-center font-serif text-3xl font-semibold tracking-[-0.02em] text-text-primary md:text-4xl">
              {CULTURE_HEADING}
            </h2>
            <p className="mx-auto mt-6 max-w-[42rem] text-base leading-relaxed text-text-primary opacity-90">
              {CULTURE_LEAD}
            </p>

            {/* The apex: Marriott, on navy. */}
            <div className="mt-12 bg-surface-inverse p-8 text-text-on-inverse md:p-12">
              <p className="eyebrow text-text-on-inverse-muted">
                {MARRIOTT_EYEBROW}
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="eyebrow text-text-on-inverse-muted">Vision</p>
                  <p className="mt-2 font-serif text-2xl font-semibold leading-snug tracking-[-0.01em] md:text-3xl">
                    {MARRIOTT_VISION}
                  </p>
                </div>
                <div>
                  <p className="eyebrow text-text-on-inverse-muted">Mission</p>
                  <p className="mt-2 font-serif text-2xl font-semibold leading-snug tracking-[-0.01em] md:text-3xl">
                    {MARRIOTT_MISSION}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-x-10 gap-y-8 border-t border-border-on-inverse pt-8 sm:grid-cols-2">
                {MARRIOTT_VALUES.map((v) => (
                  <div key={v.title}>
                    <p className="text-base font-semibold">{v.title}</p>
                    <p className="mt-2 text-base leading-relaxed text-text-on-inverse-muted">
                      {v.blurb}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-border-on-inverse pt-8">
                <p className="eyebrow text-text-on-inverse-muted">
                  Guiding principle
                </p>
                <p className="mt-2 text-base font-semibold">
                  {MARRIOTT_GUIDING.title}
                </p>
                <p className="mt-2 text-base leading-relaxed text-text-on-inverse-muted">
                  {MARRIOTT_GUIDING.blurb}
                </p>
              </div>
            </div>

            {/* The double click: the Foundry's operating principles. */}
            <h3 className="mt-16 text-center font-serif text-2xl font-semibold tracking-[-0.01em] text-text-primary">
              {CULTURE_DOUBLE_CLICK_HEADING}
            </h3>
            <p className="mx-auto mt-4 max-w-[42rem] text-base leading-relaxed text-text-primary opacity-90">
              {CULTURE_DOUBLE_CLICK_LEAD}
            </p>

            <ul className="mt-10 border-t border-border-subtle">
              {CULTURE_PRINCIPLES.map((p) => (
                <li
                  key={p.title}
                  className="grid gap-x-8 gap-y-1.5 border-b border-border-subtle py-5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
                >
                  <div className="flex gap-3">
                    <span
                      aria-hidden
                      className="ember-bar mt-[0.45rem] h-1.5 w-1.5 shrink-0"
                    />
                    <p className="text-base font-semibold leading-relaxed text-text-primary">
                      {p.title}
                    </p>
                  </div>
                  <div className="pl-[1.125rem] md:pl-0">
                    <p className="text-base leading-relaxed text-text-primary opacity-80">
                      {p.blurb}
                    </p>
                    <p className="mt-1 text-sm text-text-primary opacity-60">
                      {p.credit}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* The two practices are the Foundry's own, so they get their own
                small heading rather than hiding among the borrowed rows. */}
            <h3 className="mt-12 text-center font-serif text-2xl font-semibold tracking-[-0.01em] text-text-primary">
              Two practices we hold ourselves to
            </h3>
            <ul className="mt-8 border-t border-border-subtle">
              {CULTURE_PRACTICES.map((p) => (
                <li
                  key={p.title}
                  className="grid gap-x-8 gap-y-1.5 border-b border-border-subtle py-5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
                >
                  <div className="flex gap-3">
                    <span
                      aria-hidden
                      className="ember-bar mt-[0.45rem] h-1.5 w-1.5 shrink-0"
                    />
                    <p className="text-base font-semibold leading-relaxed text-text-primary">
                      {p.title}
                    </p>
                  </div>
                  <p className="pl-[1.125rem] text-base leading-relaxed text-text-primary opacity-80 md:pl-0">
                    {p.blurb}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
