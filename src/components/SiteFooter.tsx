import Image from "next/image"
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
            <Image
              src="/brand/lockup-white.png"
              alt={`${SCHOOL_FULL}, ${PROGRAM}`}
              width={3305}
              height={360}
              className="h-8 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed text-text-on-inverse-muted">
              An experiential learning program where students build production
              AI systems for real clients.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-text-on-inverse-muted">Go to</p>
            <ul className="mt-3 space-y-2">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-on-inverse transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#quote"
                  className="text-sm text-text-on-inverse transition-opacity hover:opacity-70"
                >
                  Get a quote
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-border-on-inverse pt-6 text-xs text-text-on-inverse-muted">
          {PROGRAM}, {SCHOOL_FULL}. Provo, Utah.
        </p>
      </div>
    </footer>
  )
}
