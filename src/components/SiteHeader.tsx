import Image from "next/image"
import Link from "next/link"
import { NAV, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * Top bar. Navy, so it reads as one surface with the hero below it. Two tabs,
 * Join the network and About us. Click either and it takes you straight there.
 *
 * Deliberately a server component. The mobile menu is a native <details>, so
 * the header ships zero JavaScript.
 *
 * The mark is the real co-brand lockup produced for the program, in its white
 * reversal. BYU's rule is that marks appear in navy or white only, so a
 * single-colour white reversal is the sanctioned treatment on a dark surface.
 * The letterforms are untouched: `scripts/build-brand-assets.py` knocks the
 * white background out and recolours, it never redraws.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface-inverse">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/lockup-white.png"
            alt={`${SCHOOL_FULL}, ${PROGRAM}`}
            width={3305}
            height={360}
            priority
            className="h-6 w-auto md:h-9"
          />
        </Link>

        {/* desktop nav */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-2">
            {NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-2 text-sm font-semibold text-text-on-inverse transition-opacity hover:opacity-70"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* mobile nav: native disclosure, no script */}
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none px-2 py-2 text-sm font-semibold text-text-on-inverse [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-0 top-full z-50 mt-2 w-56 border border-border-on-inverse bg-surface-inverse-deep py-2 shadow-lg"
          >
            <ul>
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-semibold text-text-on-inverse transition-colors hover:bg-surface-inverse-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  )
}
