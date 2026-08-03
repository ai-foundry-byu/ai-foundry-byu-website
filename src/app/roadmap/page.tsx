import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { MotionCta } from "@/components/MotionCta"
import { getRoadmapStats, type RoadmapStats } from "@/lib/roadmap-stats"
import {
  CERT_GOAL,
  QUOTE_CTA,
  ROADMAP,
  ROADMAP_EYEBROW,
  ROADMAP_HEADING,
  ROADMAP_LEAD,
  ROADMAP_STATS_NOTE,
  SCHOOL_FULL,
  type RoadmapItem,
  type RoadmapStatus,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ", is building, and where each piece of it currently stands.",
  alternates: { canonical: "/roadmap" },
}

/**
 * Rebuilt at most every ten minutes.
 *
 * The counts come from our own database, so they could be read on every
 * request, but nothing on this page changes minute to minute and a marketing
 * page should not open a database connection per visitor. Ten minutes is
 * under the resolution of anything shown here and keeps the page static for
 * almost everyone who loads it.
 */
export const revalidate = 600

export default async function RoadmapPage() {
  const stats = await getRoadmapStats()

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Counts stats={stats} />
        <Phases stats={stats} />
        <Close />
      </main>
      <SiteFooter />
    </>
  )
}

/* ────────────────────────────────────────────────────────────
   1. Hero

   The same arrangement /about uses: accent bar, eyebrow, headline.
   Deliberately not the centred landing-page hero, because this is an
   interior page and should read as one.
   ──────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="surface-iron text-text-on-inverse">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex items-start gap-5">
          <span aria-hidden className="ember-bar mt-2 h-16 w-1 shrink-0" />
          <div>
            <p className="eyebrow text-text-on-inverse-muted">
              {ROADMAP_EYEBROW}
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-6xl">
              {ROADMAP_HEADING}
            </h1>
          </div>
        </div>
        <p className="mt-8 max-w-[46rem] text-lg leading-relaxed text-text-on-inverse-muted">
          {ROADMAP_LEAD}
        </p>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   2. The live counts

   A hairline grid on navy, the same gap-px construction the offering
   cards on the landing page use, so the two read as one component
   family rather than two takes on a card.
   ──────────────────────────────────────────────────────────── */

type Cell = { label: string; value: number | null; caption: string }

function Counts({ stats }: { stats: RoadmapStats }) {
  const cells: Cell[] = [
    { label: "Network", value: stats.network, caption: "people in the network" },
    { label: "LinkedIn", value: stats.linkedinFollowers, caption: "followers" },
    { label: "Proposals", value: stats.proposals, caption: "projects submitted" },
    { label: "Applications", value: stats.applications, caption: "to the cohort" },
    { label: "Advisory board", value: stats.advisoryBoard, caption: "confirmed" },
    { label: "Founding partners", value: stats.foundingPartners, caption: "engaged" },
  ]

  return (
    <section className="surface-iron-deep text-text-on-inverse">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* gap-px over a bordered background, so the hairlines between cells
            are the background showing through rather than six sets of
            borders that would double up where they meet. */}
        <div className="grid gap-px border border-border-on-inverse bg-border-on-inverse sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell) => (
            <div
              key={cell.label}
              className="flex flex-col gap-1 bg-surface-inverse-deep p-7"
            >
              <p className="eyebrow text-text-on-inverse-muted">{cell.label}</p>
              {/* tabular-nums so the six figures sit on a common grid rather
                  than shifting width with their digits. */}
              <p className="mt-1 font-serif text-4xl font-semibold leading-none tabular-nums md:text-5xl">
                {fmt(cell.value)}
              </p>
              <p className="mt-1 text-base text-text-on-inverse-muted">
                {cell.caption}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-base text-text-on-inverse-muted">
          {ROADMAP_STATS_NOTE}{" "}
          <time dateTime={stats.readAt.toISOString()}>
            {stats.readAt.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          .
        </p>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   3. The phases

   Three blocks reading downward, each a hairline-divided ledger. The
   same component shape as VALUES on the landing page and the interests
   list on /network.

   Not three columns. Every item here is a sentence or two of argument,
   and a third of a 1152px column is not a reading measure. Stacked, the
   order also carries meaning: it is a sequence, and a sequence read left
   to right across three columns loses that the moment it wraps.
   ──────────────────────────────────────────────────────────── */

function Phases({ stats }: { stats: RoadmapStats }) {
  return (
    <section className="surface-paper">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-20 md:gap-24">
          {ROADMAP.map((phase) => (
            <div key={phase.n}>
              <div className="flex items-baseline gap-5">
                <span
                  aria-hidden
                  className="font-serif text-4xl font-semibold leading-none text-text-accent md:text-5xl"
                >
                  {phase.n}
                </span>
                <div>
                  <h2 className="font-serif text-2xl font-semibold leading-tight text-text-primary md:text-3xl">
                    {phase.title}
                  </h2>
                  <p className="mt-1 text-base text-text-primary opacity-70">
                    {phase.subtitle}
                  </p>
                </div>
              </div>

              <ul className="mt-8 border-t border-border-subtle">
                {phase.items.map((item) => (
                  <Row key={item.name} item={item} stats={stats} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Row({ item, stats }: { item: RoadmapItem; stats: RoadmapStats }) {
  const value = item.stat
    ? (stats[item.stat.field as keyof RoadmapStats] as number | null)
    : null

  return (
    <li className="grid gap-x-10 gap-y-4 border-b border-border-subtle py-7 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <div>
        {/*
          The chip on its own line, always, rather than floated beside the
          name. Inline it only fits the short titles: "Claude Architect
          certification" needs about 290px of the 320px column and the chip
          needs another 95px, so four of the twelve rows wrapped and eight
          did not. A rule that holds for every row beats one that reads
          tighter on some of them.
        */}
        <h3 className="font-serif text-xl font-semibold leading-tight text-text-primary">
          {item.name}
        </h3>
        <div className="mt-2.5">
          <StatusChip status={item.status} />
        </div>

        {/* The number lives with the name, not with the paragraph, so a
            reader scanning the left column gets name, state, and figure
            without reading the prose at all. */}
        {item.goal ? (
          <CertGoal certs={stats.claudeArchCerts} />
        ) : item.stat ? (
          <p className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-semibold leading-none tabular-nums text-text-primary">
              {fmt(value)}
            </span>
            <span className="text-base text-text-primary opacity-70">
              {item.stat.caption}
            </span>
          </p>
        ) : null}
      </div>

      <p className="max-w-[34rem] text-base leading-relaxed text-text-primary">
        {item.detail}
      </p>
    </li>
  )
}

/**
 * Progress toward the certification goal.
 *
 * A bar rather than a bare count, because the goal is the information: "2"
 * means nothing on its own and "2 of 10" means something. The bar is an
 * orange fill on a tinted track, never orange type, since orange text on
 * white is 4.67:1 and legal but the figure beside it is already carrying
 * that job at a larger size.
 */
function CertGoal({ certs }: { certs: number | null }) {
  const n = certs ?? 0
  const pct = Math.min(100, Math.round((n / CERT_GOAL) * 100))

  return (
    <div className="mt-3 max-w-[18rem]">
      <p className="flex items-baseline gap-2">
        <span className="font-serif text-3xl font-semibold leading-none tabular-nums text-text-primary">
          {certs == null ? "—" : n}
        </span>
        <span className="text-base text-text-primary opacity-70">
          of {CERT_GOAL} certified
        </span>
      </p>
      <div
        className="mt-3 h-1.5 w-full bg-surface-subtle"
        role="progressbar"
        aria-valuenow={n}
        aria-valuemin={0}
        aria-valuemax={CERT_GOAL}
        aria-label={`Claude Architect certifications: ${n} of ${CERT_GOAL}`}
      >
        <div
          className="ember-bar h-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Status, as a filled chip.
 *
 * All three states come out of the existing palette rather than
 * introducing a green: navy fill for shipped, orange fill for in flight,
 * and an outline for agreed-but-not-started. Both fills carry white type,
 * which is 13.56:1 on navy and 4.67:1 on orange, so both clear AA at this
 * size. Orange as TYPE would not, which is why it is never used that way.
 */
function StatusChip({ status }: { status: RoadmapStatus }) {
  const styles: Record<RoadmapStatus, string> = {
    live: "bg-surface-inverse text-text-on-inverse",
    active: "bg-surface-accent text-text-on-accent",
    planned: "border border-border-subtle text-text-primary opacity-70",
  }
  const labels: Record<RoadmapStatus, string> = {
    live: "Live",
    active: "In progress",
    planned: "Planned",
  }

  return (
    <span
      className={`inline-flex shrink-0 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────
   4. Out

   One way on, matching the rest of the site: the proposal form.
   ──────────────────────────────────────────────────────────── */

function Close() {
  return (
    <section className="surface-paper-dim">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
        <h2 className="font-serif text-2xl font-semibold tracking-[-0.01em] text-text-primary md:text-3xl">
          Want your project on this roadmap?
        </h2>
        <div className="mt-8">
          <MotionCta
            href={QUOTE_CTA.href}
            className="btn-ember px-9 py-4 text-base"
          >
            {QUOTE_CTA.label}
          </MotionCta>
        </div>
      </div>
    </section>
  )
}

/** An em dash for a missing reading, so a failed count never renders as 0. */
function fmt(n: number | null): string {
  return n == null ? "—" : n.toLocaleString("en-US")
}
