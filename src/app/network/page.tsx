import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { EmbeddedForm } from "@/components/EmbeddedForm"
import {
  FORMS,
  NETWORK_INTERESTS,
  NETWORK_LEAD,
  SCHOOL_FULL,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "Join the network",
  description:
    "Join the AI Foundry network at the " +
    SCHOOL_FULL +
    ". Events, a weekly AI digest, access to the cohort for hiring, and project proposals.",
  alternates: { canonical: "/network" },
}

export default function NetworkPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="surface-iron text-text-on-inverse">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="flex items-start gap-5">
              <span aria-hidden className="ember-bar mt-2 h-16 w-1 shrink-0" />
              <div>
                <p className="eyebrow text-text-on-inverse-muted">
                  Join the network
                </p>
                <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-6xl">
                  Plug into the Foundry.
                </h1>
              </div>
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-on-inverse-muted">
              {NETWORK_LEAD}
            </p>
          </div>
        </section>

        <section className="surface-paper">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-20">
              <div>
                <h2 className="font-serif text-xl font-semibold text-text-primary">
                  What you can opt into
                </h2>
                <ul className="mt-6 space-y-6">
                  {NETWORK_INTERESTS.map((interest) => (
                    <li key={interest.title} className="border-l-2 border-border-accent pl-5">
                      <p className="text-base font-semibold text-text-primary">
                        {interest.title}
                      </p>
                      <p className="mt-1.5 text-base leading-relaxed text-text-primary opacity-80">
                        {interest.blurb}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <EmbeddedForm
                  src={FORMS.network}
                  title="Join the network"
                  height={780}
                />
                <p className="mt-6 text-base text-text-primary opacity-80">
                  No spam. Leave at any time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
