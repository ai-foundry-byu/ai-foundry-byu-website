"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"

/**
 * A call to action that scales on hover and press.
 *
 * This is the ONLY client component on the site. Everything else is a server
 * component and every route prerenders to static HTML, so keep the boundary
 * here as tight as it is: one small leaf that hydrates, not a page.
 *
 * Why this exists rather than motion.button:
 *
 *   Every call to action on this site is a link. It goes somewhere. Rendering a
 *   <button> instead would drop the href, which costs cmd-click to open in a new
 *   tab, right-click to copy the link, and it makes a screen reader announce a
 *   button that does not act like one. The animation is not worth any of that,
 *   so the element stays a link and motion wraps it.
 *
 * Why the scale is not 1.1:
 *
 *   1.1 on a 200px-wide button is 20px of growth, which shoves the layout around
 *   and blurs the text mid-transform because the browser is scaling a rasterised
 *   layer. 1.04 reads as responsive at this button size without either problem.
 *   Change it if you disagree, but check it on the wide "Request a quote" button
 *   rather than the narrow one.
 *
 * Reduced motion is handled explicitly. globals.css neutralises CSS animation
 * for prefers-reduced-motion, but these transforms are driven by JavaScript and
 * would sail straight past that, so the hook checks the same preference and
 * returns a static link instead.
 */

const MotionLink = motion.create(Link)

const HOVER = 1.04
const TAP = 0.97
/** Fast enough to feel like a response to the cursor, not an animation. */
const SPRING = { type: "spring" as const, stiffness: 420, damping: 30 }

type Props = {
  href: string
  className?: string
  children: React.ReactNode
}

export function MotionCta({ href, className, children }: Props) {
  const reduced = useReducedMotion()

  // Same-page anchors keep a plain <a>. next/link would intercept the click and
  // route, which breaks the CSS smooth-scroll the hero button depends on.
  const isAnchor = href.startsWith("#")

  if (reduced) {
    return isAnchor ? (
      <a href={href} className={className}>
        {children}
      </a>
    ) : (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  const animation = {
    whileHover: { scale: HOVER },
    whileTap: { scale: TAP },
    transition: SPRING,
  }

  return isAnchor ? (
    <motion.a href={href} className={className} {...animation}>
      {children}
    </motion.a>
  ) : (
    <MotionLink href={href} className={className} {...animation}>
      {children}
    </MotionLink>
  )
}
