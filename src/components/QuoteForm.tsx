"use client"

import { useState } from "react"

/**
 * The quote request form. Eight fields, per FORMS.md form 1, posting to
 * /api/quote which writes to Supabase (project_proposals).
 *
 * This replaced the embedded Google Form on 2026-08-01 when the site was
 * wired to the existing Supabase backend. Same fields, same order, same
 * help text; what changed is where a submission lands.
 *
 * It sits on the navy band of /quote, so like the old embed it renders as
 * a white plate. Field styling is shared with NetworkForm by convention,
 * not by abstraction: two forms is not enough duplication to earn a
 * field-component layer.
 */

const TIMELINES = [
  "As soon as possible",
  "Within a semester",
  "Within the year",
  "Exploring, no date yet",
]

const inputClass =
  "w-full border border-border-subtle bg-surface-default px-4 py-3 text-base text-text-primary outline-none transition-colors focus:border-border-strong"

const labelClass = "block text-sm font-semibold text-text-primary"

type Status = "idle" | "submitting" | "success" | "error"

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "submitting") return
    setStatus("submitting")
    setErrorMsg(null)

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      phone: data.get("phone"),
      company: data.get("company"),
      website: data.get("website"),
      project_description: data.get("project_description"),
      desired_timeline: data.get("desired_timeline"),
    }

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = await res.json()
      if (!res.ok) {
        setErrorMsg(body.error ?? "Could not submit right now. Please try again.")
        setStatus("error")
        return
      }
      setStatus("success")
    } catch {
      setErrorMsg("Could not submit right now. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="bg-surface-default p-10 text-center">
        <p className="eyebrow text-text-primary opacity-80">Received</p>
        <p className="mt-3 font-serif text-xl text-text-primary">
          Thank you. We have your request.
        </p>
        <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-text-primary">
          We will reach out within a few business days with next steps.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="bg-surface-default p-6 md:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="q-first" className={labelClass}>
            First name
          </label>
          <input id="q-first" name="first_name" required autoComplete="given-name" className={`mt-2 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="q-last" className={labelClass}>
            Last name
          </label>
          <input id="q-last" name="last_name" required autoComplete="family-name" className={`mt-2 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="q-email" className={labelClass}>
            Email
          </label>
          <input id="q-email" name="email" type="email" required autoComplete="email" className={`mt-2 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="q-phone" className={labelClass}>
            Phone number
          </label>
          <input id="q-phone" name="phone" type="tel" required autoComplete="tel" className={`mt-2 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="q-company" className={labelClass}>
            Company
          </label>
          <input id="q-company" name="company" required autoComplete="organization" className={`mt-2 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="q-website" className={labelClass}>
            Website <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input id="q-website" name="website" type="url" autoComplete="url" placeholder="https://" className={`mt-2 ${inputClass}`} />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="q-desc" className={labelClass}>
          What do you want built
        </label>
        <p className="mt-1 text-sm leading-relaxed text-text-primary opacity-70">
          A few sentences is plenty. If you are not sure yet, say so, that is a
          normal place to start.
        </p>
        <textarea id="q-desc" name="project_description" required rows={5} className={`mt-2 ${inputClass} resize-y`} />
      </div>

      <fieldset className="mt-6">
        <legend className={labelClass}>
          When do you need it <span className="font-normal opacity-60">(optional)</span>
        </legend>
        <div className="mt-3 space-y-2">
          {TIMELINES.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-3 text-base text-text-primary">
              <input type="radio" name="desired_timeline" value={t} className="h-4 w-4 accent-(--color-ember)" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      {status === "error" && errorMsg ? (
        <p role="alert" className="mt-6 border border-border-accent bg-surface-subtle px-4 py-3 text-base text-text-primary">
          {errorMsg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-ember mt-8 w-full px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Submitting..." : "Request a quote"}
      </button>
    </form>
  )
}
