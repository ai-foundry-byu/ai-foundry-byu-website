import Image from "next/image"
import type { ShowcaseItem } from "@/lib/content"

/**
 * One reference build. Shared by the landing Showcase band and /work so the
 * two can never drift apart.
 *
 * The image slot is a proof slot, not a screenshot slot: today every item has
 * a live screenshot, and when confidential or unlaunched work arrives the
 * slot will carry the strongest available evidence instead (walkthrough
 * video, sanitized deliverable, schematic, or outcome stat). That variant
 * vocabulary is specified in the portfolio mock from 2026-08-03; extend the
 * ShowcaseItem type when the first such case lands.
 */
export function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <article className="flex flex-col border border-border-subtle bg-surface-default">
      {/* 16:10, matching the 1200x750 source crops exactly, so object-cover
          never actually crops anything. */}
      <div className="relative aspect-[8/5] bg-surface-inverse">
        <Image
          src={item.image}
          alt={`Screenshot of ${item.name}`}
          fill
          sizes="(min-width: 768px) 560px, 90vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className="font-serif text-2xl font-semibold text-text-primary">
          {item.name}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-2 text-sm font-semibold text-text-primary opacity-80"
            >
              <span aria-hidden className="ember-bar h-1.5 w-1.5 shrink-0" />
              {tag}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base leading-relaxed text-text-primary opacity-90">
          {item.blurb}
        </p>
        <p className="mt-auto flex flex-wrap gap-x-6 pt-5">
          {item.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-ember text-base font-semibold"
            >
              {link.label}
            </a>
          ))}
        </p>
      </div>
    </article>
  )
}
