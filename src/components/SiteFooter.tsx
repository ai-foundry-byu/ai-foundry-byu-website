import Link from "next/link"
import { NAV, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * Footer. Navy surface, so every text colour here comes from the
 * on-inverse set. The accent is never used as text on navy: that pair is
 * 2.90:1 and fails. It appears only as the fill in the rule above.
 */
export function SiteFooter() {
  return (
    <footer className="surface-iron mt-auto text-text-on-inverse">
      <div aria-hidden className="ember-bar h-1 w-full" />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-xl font-semibold">{PROGRAM}</p>
            <p className="eyebrow mt-1 text-text-on-inverse-muted">
              {SCHOOL_FULL}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-on-inverse-muted">
              An experiential learning program where students build production
              AI systems for real clients.
            </p>
          </div>

          <nav aria-label="Footer" className="flex gap-14">
            {NAV.map((group) => (
              <div key={group.label}>
                <p className="eyebrow text-text-on-inverse-muted">
                  {group.label}
                </p>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-text-on-inverse transition-opacity hover:opacity-70"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-12 border-t border-border-on-inverse pt-6 text-xs text-text-on-inverse-muted">
          {PROGRAM}, {SCHOOL_FULL}. Provo, Utah.
        </p>
      </div>
    </footer>
  )
}
