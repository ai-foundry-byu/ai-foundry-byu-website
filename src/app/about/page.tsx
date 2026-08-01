import type { Metadata } from "next"
import Image from "next/image"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { ERA_NARRATIVE, FACULTY, SCHOOL_FULL, TEAM } from "@/lib/content"

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
      </main>
      <SiteFooter />
    </>
  )
}
