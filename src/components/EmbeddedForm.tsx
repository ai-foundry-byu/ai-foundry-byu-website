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
  height = 900,
}: {
  src: string | null
  title: string
  height?: number
}) {
  if (!src) {
    return (
      <div className="border border-border-subtle bg-surface-subtle p-10 text-center">
        <p className="eyebrow text-text-primary opacity-70">Coming shortly</p>
        <p className="mt-3 font-serif text-xl text-text-primary">
          This form is being finalized.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-primary">
          It will appear here as soon as it is live. Nothing else on this page
          changes when it does.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-border-subtle bg-surface-default">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        height={height}
        className="w-full"
      />
    </div>
  )
}
