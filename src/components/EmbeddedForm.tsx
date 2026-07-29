/**
 * A hosted form, embedded.
 *
 * There is no backend in this site and no database, which means there is
 * nothing to configure and no environment variable that can be missing at
 * deploy time. The tradeoff is that the form lives in a form tool (Tally,
 * Google Forms) and we embed it.
 *
 * TO CONNECT A FORM: put its share URL in `FORMS` in src/lib/content.ts.
 * That is the whole change. Until then this renders the honest fallback
 * below rather than an empty frame.
 */
export function EmbeddedForm({
  src,
  title,
  heightClass = "h-[900px]",
  tone = "light",
}: {
  src: string | null
  title: string
  /**
   * Height as Tailwind classes, not a pixel attribute, so it can be responsive.
   *
   * A cross-origin iframe cannot report its own content height, so the height
   * has to be declared from outside. Google Forms rewraps its question labels as
   * the frame narrows, which makes the content TALLER on small screens, so the
   * classes go from tall to short as the breakpoints go up.
   *
   * Getting this wrong in either direction is visible. Too short and the frame
   * becomes a nested scroll region that swallows trackpad and touch scrolling
   * and hides the Submit button behind an inner scrollbar most people never
   * find. Too tall and there is dead white space under Submit. Too tall is the
   * better failure, so these values are deliberately generous.
   */
  heightClass?: string
  /** Which surface this sits on. A hosted form is always a light rectangle, so
   *  on navy it gets a white plate rather than pretending to be transparent. */
  tone?: "light" | "inverse"
}) {
  const frame =
    tone === "inverse"
      ? "bg-surface-default"
      : "border border-border-subtle bg-surface-default"

  if (!src) {
    return (
      <div className={`${frame} p-10 text-center`}>
        <p className="eyebrow text-text-primary opacity-80">Coming shortly</p>
        <p className="mt-3 font-serif text-xl text-text-primary">
          This form is being finalized.
        </p>
        <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-text-primary">
          It will appear here as soon as it is live. Nothing else on this page
          changes when it does.
        </p>
      </div>
    )
  }

  return (
    <div className={frame}>
      {/*
        loading="eager", and this was a real bug rather than a preference.

        It was loading="lazy". On both pages that use this the iframe sits below
        the fold, so the browser deferred fetching it and a visitor saw a blank
        white rectangle until they happened to scroll far enough to trigger the
        load. A second visit looked fine because it was cached, which is exactly
        the pattern that makes this kind of thing survive testing.

        Lazy-loading the one element the page exists for is backwards. On /quote
        the form IS the page. A blank form is a silently lost lead.
      */}
      <iframe
        src={src}
        title={title}
        loading="eager"
        className={`w-full ${heightClass}`}
      />
    </div>
  )
}
