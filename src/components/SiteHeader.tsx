import Link from "next/link"
import { NAV, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * Top bar. Two tabs, Join the network and About us. Click either and it takes
 * you straight to that page: no dropdown, nothing to hover open first.
 *
 * Deliberately a server component. The mobile menu is a native <details>, so
 * the header ships zero JavaScript.
 *
 * The wordmark is set in type, not placed as an image, and that is on
 * purpose. AI Foundry has no approved logo on file: BYU Marriott Marketing
 * must produce the co-brand lockup, and the af-* mark in the old repo is an
 * AI-generated derivative of BYU's Block Y that was never approved. A
 * typographic lockup is the compliant thing to ship until the real one
 * arrives. See _reference/byu-static-site/_internal/BRAND-INVENTORY.md.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-default/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Wordmark />

        {/* desktop nav */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-2">
            {NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:text-text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* mobile nav: native disclosure, no script */}
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none px-2 py-2 text-sm font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-0 top-full z-50 mt-1 w-56 border border-border-subtle bg-surface-default py-2 shadow-lg"
          >
            <ul>
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-subtle"
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

/**
 * The typographic co-brand lockup: school first, program second, divided by
 * the vertical accent bar that is the design system's motif. This satisfies
 * the naming rule that AI Foundry never appears without BYU identification.
 */
function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span aria-hidden className="ember-bar h-8 w-[3px]" />
      <span className="leading-tight">
        <span className="block font-serif text-lg font-semibold tracking-[-0.01em] text-text-primary">
          {PROGRAM}
        </span>
        <span className="eyebrow block text-text-primary opacity-80">
          {SCHOOL_FULL}
        </span>
      </span>
    </Link>
  )
}

