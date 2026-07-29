import Link from "next/link"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { EmbeddedForm } from "@/components/EmbeddedForm"
import {
  FORMS,
  HERO_STATEMENT,
  HERO_SUPPORT,
  MISSION,
  QUOTE_HEADING,
  QUOTE_LEAD,
  QUOTE_STEPS,
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
        <SubmitAProject />
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
        {/* The accent bar moves above the headline when the hero is centred.
            Beside it, it would pull the whole block off axis. */}
        <span aria-hidden className="ember-bar ember-bar-heat h-14 w-1" />

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
          <a href="#quote" className="btn-ember px-8 py-4 text-sm">
            Submit a project
          </a>
          <Link
            href="/network"
            className="inline-flex items-center justify-center border border-border-on-inverse px-8 py-4 text-sm font-semibold text-text-on-inverse transition-colors hover:border-border-accent"
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

          <div className="mt-8 grid gap-px border border-border-subtle bg-border-subtle md:grid-cols-3">
            {VALUES.map((value) => (
              <article key={value.name} className="bg-surface-default p-8">
                <span aria-hidden className="ember-bar block h-1 w-10" />
                <h3 className="mt-6 font-serif text-xl font-semibold text-text-primary">
                  {value.name}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-text-primary">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   3. Get a quote, the #quote anchor target
   ──────────────────────────────────────────────────────────── */

function SubmitAProject() {
  return (
    <section id="quote" className="surface-paper-dim scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-text-primary md:text-5xl">
            {QUOTE_HEADING}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-primary">
            {QUOTE_LEAD}
          </p>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-20">
          {/* The form leads now. It is eight fields, so there is nothing to
              warn anyone about before they start. */}
          <div>
            <EmbeddedForm src={FORMS.intake} title="Get a quote" height={720} />
          </div>

          <div>
            <h3 className="eyebrow text-text-primary opacity-80">
              What happens next
            </h3>
            <ol className="mt-6 space-y-6">
              {QUOTE_STEPS.map((step) => (
                <li key={step.n} className="flex gap-4">
                  {/* opacity floor is contrast, not taste: 60% navy on the
                      tinted band measures 3.83:1 and fails AA at this size */}
                  <span className="eyebrow mt-0.5 shrink-0 text-text-primary opacity-80">
                    {String(step.n).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text-primary">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-text-primary opacity-80">
                      {step.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
