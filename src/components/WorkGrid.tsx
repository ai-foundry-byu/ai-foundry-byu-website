"use client"

import { useState } from "react"
import { ShowcaseCard } from "@/components/ShowcaseCard"
import type { ShowcaseItem } from "@/lib/content"

/**
 * The filterable grid on /work. Single-select chips derived from the tags
 * actually present in the data, so a new card with a new tag grows the bar
 * with no code change, and a filter can never be empty.
 *
 * Deliberately no search box and no sort: under a few dozen items those are
 * furniture. Filters are category chips only; confidentiality and build
 * status will be properties of the card, not browsing axes.
 */
export function WorkGrid({ items }: { items: ShowcaseItem[] }) {
  const tags = Array.from(new Set(items.flatMap((i) => i.tags)))
  const [active, setActive] = useState<string | null>(null)
  const shown = active ? items.filter((i) => i.tags.includes(active)) : items

  const chip = (selected: boolean) =>
    selected
      ? "border border-surface-inverse bg-surface-inverse px-4 py-2 text-sm font-semibold text-text-on-inverse"
      : "border border-border-subtle bg-surface-default px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong"

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-border-subtle bg-surface-default">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-4">
          <button
            type="button"
            onClick={() => setActive(null)}
            className={chip(active === null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag === active ? null : tag)}
              className={chip(active === tag)}
            >
              {tag}
            </button>
          ))}
          <span className="ml-auto text-sm text-text-primary opacity-60">
            {shown.length} {shown.length === 1 ? "build" : "builds"}
          </span>
        </div>
      </div>

      <div className="surface-paper-dim">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((item) => (
              <ShowcaseCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
