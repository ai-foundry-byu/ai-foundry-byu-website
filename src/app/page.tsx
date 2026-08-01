import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { MotionCta } from "@/components/MotionCta"
import {
  BUILD_HEADING,
  BUILDERS_DETAIL,
  BUILDERS_EYEBROW,
  BUILDERS_HEADLINE,
  FACULTY,
  HERO_STATEMENT,
  HERO_SUPPORT,
  MISSION,
  OFFERINGS,
  PARTNER_DETAIL,
  PARTNER_EYEBROW,
  PARTNER_HEADLINE,
  QUOTE_CTA,
  QUOTE_CTA_NOTE,
  QUOTE_LEAD,
  VALUES,
  VISION,
} from "@/lib/content"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <MissionVisionValues />
        <Proof />
        <GetAQuote />
      </main>
      <SiteFooter />
    </>
  )
}

/* ────────────────────────────────────────────────────────────
   1. Hero
   ──────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      id="hero"
      className="surface-iron-deep relative isolate overflow-hidden text-text-on-inverse"
    >
      {/*
        Background layer. Currently the tonal navy surface class above.
        A looping video, like byumarketinglab.com uses, drops in HERE as an
        absolutely positioned <video> plus a navy scrim, and nothing else in
        this section has to move. That was the point of building it this way.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center md:py-40">
        {/* The AI glyph that used to sit above the headline was removed
            2026-08-01. The header lockup already identifies the program, so
            the headline now leads the hero on its own. */}

        {/*
          max-w-4xl, not the full column. Marketing Lab centres three lines of
          two or three words each, which is why theirs reads as a statement.
          Centring a full sentence across a wide measure reads as mush, so the
          width is capped to force the same two-to-three line break.
        */}
        <h1 className="wonk max-w-4xl font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl md:text-7xl">
          {HERO_STATEMENT}
        </h1>

        {/*
          One sentence, so it is measured and spaced as an attribution to the
          headline rather than as a paragraph.

          max-w-4xl matches the h1 above, which is wider than the sentence needs
          and that is the point: the cap never becomes the thing that breaks the
          line, so it holds on one line at desktop and only wraps when the
          viewport itself is narrower. text-balance then splits the wrap evenly
          instead of leaving a two-word orphan on the last line.

          mt-6, not the mt-8 this had when it was three lines: a single line
          belongs to the headline, so it sits closer to it than to the buttons.
        */}
        <p className="mt-6 max-w-4xl text-balance text-lg leading-relaxed text-text-on-inverse-muted">
          {HERO_SUPPORT}
        </p>

        {/* mt-12, up from mt-11. Two lines of support copy went away, so the
            action group needs its own space to stay a separate step and to keep
            the hero from collapsing upward. */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          {/*
            A same-page anchor, not a route link, and that is deliberate. This
            scrolls down to the Get a quote section, and globals.css sets
            scroll-behavior smooth so the browser animates it. MotionCta keeps it
            an <a> for exactly that reason: next/link would intercept the click
            and route instead of scrolling.
          */}
          <MotionCta href="#quote" className="btn-ember px-8 py-4 text-base">
            Submit a project
          </MotionCta>
          <MotionCta
            href="/network"
            className="inline-flex items-center justify-center border border-border-on-inverse px-8 py-4 text-base font-semibold text-text-on-inverse transition-colors hover:border-border-accent"
          >
            Join the network
          </MotionCta>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   2. Mission, vision, values

   The copy here is verbatim and proofed. If you are tempted to
   tighten a sentence, do not.
   ──────────────────────────────────────────────────────────── */

function MissionVisionValues() {
  return (
    <section id="mission" className="surface-paper scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Mission and vision are peers, so their gutter sits one step above
            the gap between value rows and one step below the gap between the
            major blocks. 64px reads as a pair; 80px read as two strangers. */}
        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow text-text-accent">Mission</p>
            <p className="mt-5 font-serif text-2xl leading-[1.35] tracking-[-0.01em] text-text-primary md:text-3xl">
              {MISSION}
            </p>
          </div>
          <div>
            <p className="eyebrow text-text-accent">Vision</p>
            <p className="mt-5 font-serif text-2xl leading-[1.35] tracking-[-0.01em] text-text-primary md:text-3xl">
              {VISION}
            </p>
          </div>
        </div>

        {/*
          One spacing ladder governs this whole section, biggest gap outermost:

            16px  inside a value row, numeral/name to its paragraph (gap-y-4)
            48px  between value rows on mobile, 64px from md (py-6 md:py-8)
            56px  mission to vision when they stack (gap-14)
            64px  between major blocks, 80px from md (this mt)
            96px  section padding, 128px from md (py-24 md:py-32)

          Each step is larger than the one nested inside it, which is the only
          reason it can be this tight without reading as cramped. If you change
          one number, move the ones around it or the ladder stops working.
        */}
        <div className="mt-16 md:mt-20">
          {/* The eyebrow is the whole heading. There was a line here that said
              "The standard we hold." It said nothing the three values below do
              not say better, so it is gone. */}
          <h2 className="eyebrow text-text-accent">Values</h2>

          {/*
            A numbered list, not three cards.

            Three equal columns made these read as a feature grid, and the third
            column of a feature grid is where text goes to die. Each value is a
            paragraph of argument, so it wants a reading measure, not a narrow
            column. Stacked and numbered, it reads the way it was written: as a
            standard, in order.

            An ordered list is also the honest markup. These are numbered items,
            so <ol> is what a screen reader should announce.
          */}
          {/* 24px, not 40px: the eyebrow is this list's only heading, so it has
              to sit close enough to the rule to belong to it. */}
          <ol className="mt-6 border-t border-border-subtle">
            {VALUES.map((value, i) => (
              // Row padding is half the gap it creates, since two adjacent rows
              // each contribute one. py-8 therefore reads as 64px between rows,
              // one step under the 80px between blocks.
              <li
                key={value.name}
                className="grid gap-x-10 gap-y-4 border-b border-border-subtle py-6 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:py-8"
              >
                <div className="flex items-baseline gap-5">
                  <span
                    aria-hidden
                    className="font-serif text-4xl font-semibold leading-none text-text-accent md:text-5xl"
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-serif text-xl font-semibold leading-tight text-text-primary md:text-2xl">
                    {value.name}
                  </h3>
                </div>
                <p className="max-w-[34rem] text-base leading-relaxed text-text-primary">
                  {value.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   3. Proof

   Sits between the values and What we build on purpose: a buyer
   meets credibility on the way to the form rather than after it.
   Scott also appears on /about, and the duplication is deliberate.
   Nobody deciding whether to fill in the form will visit /about
   first.

   Copy, sourcing rules, and what is deliberately absent: see the
   proof block in content.ts. Short version, no logos, and no name
   goes here unless a person on /about backs it.
   ──────────────────────────────────────────────────────────── */

function Proof() {
  return (
    <section className="surface-paper-dim">
      {/* Deliberately the shallowest band on the page. It is a credential
          strip on the way to the form, not a section in its own right, so it
          sits well under the 96/128px the real sections use. */}
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        {/* Three columns from md. Each is one appeal to ethos: a named faculty
            advisor, the builders' track record, and an organisational
            relationship. They stack on narrow screens in that order, which is
            also strongest-first if only the top one gets read. */}
        <div className="grid gap-10 md:grid-cols-3 md:gap-10">
          {/* The accent bar as a rule, matching the faculty treatment already
              on /about so the two read as the same component. */}
          <div className="border-l-2 border-border-accent pl-6">
            {/* Not text-accent for this eyebrow. Orange on the tinted surface
                is 4.27:1, which is large-text-only and fails at 12px. */}
            <p className="eyebrow text-text-primary opacity-80">{FACULTY.role}</p>
            {/* One step down from the 30px this was. These two are supporting
                credentials, not section headings, so they should not compete
                with the values above or What we build below. */}
            <p className="mt-2 font-serif text-xl font-semibold text-text-primary md:text-2xl">
              {FACULTY.name}
            </p>
            {/* Stays 16px. The type scale in SPEC.md sets a 16px floor for
                prose and this is prose, so the size reduction in this band is
                taken out of the display type instead. */}
            <p className="mt-2 text-base leading-relaxed text-text-primary">
              {FACULTY.detail}
            </p>
          </div>

          <div className="border-l-2 border-border-accent pl-6">
            <p className="eyebrow text-text-primary opacity-80">
              {BUILDERS_EYEBROW}
            </p>
            <p className="mt-2 font-serif text-xl font-semibold leading-snug text-text-primary md:text-2xl">
              {BUILDERS_HEADLINE}
            </p>
            <p className="mt-2 text-base leading-relaxed text-text-primary opacity-90">
              {BUILDERS_DETAIL}
            </p>
          </div>

          <div className="border-l-2 border-border-accent pl-6">
            <p className="eyebrow text-text-primary opacity-80">
              {PARTNER_EYEBROW}
            </p>
            <p className="mt-2 font-serif text-xl font-semibold leading-snug text-text-primary md:text-2xl">
              {PARTNER_HEADLINE}
            </p>
            <p className="mt-2 text-base leading-relaxed text-text-primary opacity-90">
              {PARTNER_DETAIL}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   4. Get a quote, the #quote anchor target
   ──────────────────────────────────────────────────────────── */

function GetAQuote() {
  return (
    <section
      id="quote"
      className="surface-iron scroll-mt-20 text-text-on-inverse"
    >
      {/* max-w-7xl here, wider than the max-w-6xl the rest of the page uses.
          The three cards need the extra width to hold their headings on one
          line, and the heading and lead above stay capped and centred so the
          wider band reads as deliberate rather than as a broken column. */}
      <div className="mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
            {BUILD_HEADING}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-on-inverse-muted">
            {QUOTE_LEAD}
          </p>
        </div>

        {/*
          The three things we build. The form is not here, it has its own page,
          so this section stays about the work rather than turning into
          paperwork halfway down.

          There was a "Three offerings." heading and an explanatory paragraph
          above this grid. Both are gone as filler: the cards already say what
          they are, and counting them for the reader is not information. The
          cards now sit directly under the section lead, which is why this
          wrapper carries the block gap the removed heading used to.
        */}
        <div className="mt-14">
          <div className="grid gap-px border border-border-on-inverse bg-border-on-inverse md:grid-cols-3">
            {OFFERINGS.map((offering) => (
              <article
                key={offering.name}
                className="flex flex-col bg-surface-inverse p-8"
              >
                {/*
                  22px at md, up from 20px, and it must stay on one line.

                  The measurement that drives this: "AI integration and
                  orchestration" is the longest heading and needs 306px on one
                  line at 20px, while the card only had 303px of inner width. It
                  missed by three pixels, which is why it wrapped. At max-w-7xl
                  the inner width is about 346px and the same string needs 335px
                  at 22px, so it now fits with room to spare.

                  If a heading ever gets longer, this wraps again. Shorten the
                  heading rather than shrinking the type.
                */}
                <h4 className="font-serif text-lg font-semibold leading-snug md:text-[1.375rem]">
                  {offering.name}
                </h4>
                <p className="mt-4 text-lg leading-relaxed text-text-on-inverse-muted">
                  {offering.blurb}
                </p>

                {/*
                  The card is centred, the list inside it is not. A bulleted
                  list with a centred ragged left edge is unreadable: the eye
                  loses the return sweep. So the block is centred and the lines
                  stay flush left inside it, which reads as deliberate.

                  Bullets are text-lg, up from text-base. They still wrap to two
                  lines and cannot be made to fit one: the longest bullet needs
                  596px on a single line and the card has about 346px. Going
                  16px to 18px costs no extra lines, so the size increase is
                  free.
                */}
                <ul className="mx-auto mt-6 space-y-3 text-left">
                  {offering.points.map((point) => (
                    <li key={point} className="flex gap-3 text-lg leading-relaxed">
                      {/* The accent as a fill, never as text. Orange type on
                          navy is 2.90:1 and fails, but a square of it is not
                          type and carries no meaning on its own. */}
                      <span
                        aria-hidden
                        className="ember-bar mt-[0.45rem] h-1.5 w-1.5 shrink-0"
                      />
                      <span className="text-text-on-inverse">{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* The one way through to the form, and the same button treatment as
            the top bar so the call to action reads as one thing site-wide. */}
        <div className="mt-16">
          <MotionCta href={QUOTE_CTA.href} className="btn-ember px-9 py-4 text-base">
            {QUOTE_CTA.label}
          </MotionCta>
          <p className="mt-5 text-base text-text-on-inverse-muted">
            {QUOTE_CTA_NOTE}
          </p>
        </div>
      </div>
    </section>
  )
}
