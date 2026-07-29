import Link from "next/link"
import { NAV, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * Top bar. Two dropdown tabs, per the spec.
 *
 * Deliberately a server component. The dropdowns open on hover and on
 * keyboard focus using CSS only, so the header ships zero JavaScript. The
 * mobile menu is a native <details>, which is why it also needs none.
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
          <ul className="flex items-center gap-1">
            {NAV.map((group) => (
              <li key={group.label} className="group relative">
                <Link
                  href={group.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:text-text-accent"
                >
                  {group.label}
                  <Chevron />
                </Link>

                {/* Opens on hover, and on keyboard focus anywhere inside the
                    group, which is what makes it reachable without a mouse. */}
                <div className="invisible absolute left-0 top-full w-72 translate-y-1 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="mt-1 border border-border-subtle bg-surface-default py-2 shadow-lg">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block px-4 py-2.5 transition-colors hover:bg-surface-subtle"
                        >
                          <span className="block text-sm font-semibold text-text-primary">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-xs font-normal text-text-primary">
                            {item.blurb}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
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
            className="absolute right-0 top-full z-50 mt-1 w-64 border border-border-subtle bg-surface-default py-2 shadow-lg"
          >
            {NAV.map((group) => (
              <div key={group.label} className="px-4 py-2">
                <p className="eyebrow text-text-primary">{group.label}</p>
                <ul className="mt-2 space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-sm font-semibold text-text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className="h-2.5 w-2.5 transition-transform group-hover:rotate-180"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="square" />
    </svg>
  )
}
