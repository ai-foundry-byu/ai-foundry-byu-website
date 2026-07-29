import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import {
  HERO_STATEMENT,
  HERO_SUPPORT,
  MISSION,
  OFFERINGS,
  OFFERINGS_HEADING,
  OFFERINGS_LEAD,
  QUOTE_CTA,
  QUOTE_HEADING,
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
        {/* The anvil, above the headline and on the same centre axis. It is
            decorative here: the header already carries the identifying lockup,
            so this one is aria-hidden rather than announced twice. */}
        {/* The SVG, not the PNG, so it stays crisp at any size and on any
            display. unoptimized because Next's image optimizer refuses SVG
            unless dangerouslyAllowSVG is set, and turning that on globally to
            serve one first-party file is a bad trade. */}
        <Image
          src="/brand/anvil-white.svg"
          alt=""
          aria-hidden
          width={290}
          height={181}
          priority
          unoptimized
          className="h-16 w-auto md:h-20"
        />

        {/*
          max-w-4xl, not the full column. Marketing Lab centres three lines of
          two or three words each, which is why theirs reads as a statement.
          Centring a full sentence across a wide measure reads as mush, so the
          width is capped to force the same two-to-three line break.
        */}
        <h1 className="wonk mt-8 max-w-4xl font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl md:text-7xl">
          {HERO_STATEMENT}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-on-inverse-muted">
          {HERO_SUPPORT}
        </p>

        <div className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          {/*
            A plain anchor, not a Link, and that is deliberate. This scrolls
            down the same page to the Get a quote section. globals.css sets
            scroll-behavior smooth, so the browser animates it with no
            JavaScript at all.
          */}
          <a href="#quote" className="btn-ember px-8 py-4 text-base">
            Submit a project
          </a>
          <Link
            href="/network"
            className="inline-flex items-center justify-center border border-border-on-inverse px-8 py-4 text-base font-semibold text-text-on-inverse transition-colors hover:border-border-accent"
          >
            Join the network
          </Link>
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
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
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

        <div className="mt-24">
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
          <ol className="mt-10 border-t border-border-subtle">
            {VALUES.map((value, i) => (
              <li
                key={value.name}
                className="grid gap-x-10 gap-y-4 border-b border-border-subtle py-10 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:py-12"
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
   3. Get a quote, the #quote anchor target
   ──────────────────────────────────────────────────────────── */

function GetAQuote() {
  return (
    <section
      id="quote"
      className="surface-iron scroll-mt-20 text-text-on-inverse"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
            {QUOTE_HEADING}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-on-inverse-muted">
            {QUOTE_LEAD}
          </p>
        </div>

        {/*
          What we sell. The form itself is not here: it has its own page, so
          this section stays about the work rather than turning into paperwork
          halfway down.
        */}
        <div className="mt-20">
          <h3 className="font-serif text-2xl font-semibold tracking-[-0.01em] md:text-3xl">
            {OFFERINGS_HEADING}
          </h3>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-text-on-inverse-muted">
            {OFFERINGS_LEAD}
          </p>

          <div className="mt-12 grid gap-px border border-border-on-inverse bg-border-on-inverse md:grid-cols-3">
            {OFFERINGS.map((offering) => (
              <article
                key={offering.name}
                className="flex flex-col bg-surface-inverse p-8"
              >
                <h4 className="font-serif text-lg font-semibold leading-snug md:text-xl">
                  {offering.name}
                </h4>
                <p className="mt-4 text-base leading-relaxed text-text-on-inverse-muted">
                  {offering.blurb}
                </p>

                {/*
                  The card is centred, the list inside it is not. A bulleted
                  list with a centred ragged left edge is unreadable: the eye
                  loses the return sweep. So the block is centred and the lines
                  stay flush left inside it, which reads as deliberate.
                */}
                <ul className="mx-auto mt-6 space-y-3 text-left">
                  {offering.points.map((point) => (
                    <li key={point} className="flex gap-3 text-base leading-relaxed">
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
          <Link href={QUOTE_CTA.href} className="btn-ember px-9 py-4 text-base">
            {QUOTE_CTA.label}
          </Link>
          <p className="mt-5 text-base text-text-on-inverse-muted">
            Eight fields. Two minutes.
          </p>
        </div>
      </div>
    </section>
  )
}
