"use client"

import { useState } from "react"
import { NETWORK_INTERESTS } from "@/lib/content"

/**
 * The join-the-network form. Six fields, per FORMS.md form 3, posting to
 * /api/network which upserts into Supabase (network_members) keyed on email,
 * so re-joining updates interests instead of duplicating a person.
 *
 * This replaced the embedded Google Form on 2026-08-01 when the site was
 * wired to the existing Supabase backend.
 *
 * The checkbox titles come from NETWORK_INTERESTS so the ledger above the
 * form and the options inside it cannot drift apart; they are literally the
 * same strings. Order maps to the interest_* columns below.
 */

const INTEREST_FIELDS = [
  "interest_events",
  "interest_digest",
  "interest_talent",
  "interest_project",
] as const

const inputClass =
  "w-full border border-border-subtle bg-surface-default px-4 py-3 text-base text-text-primary outline-none transition-colors focus:border-border-strong"

const labelClass = "block text-sm font-semibold text-text-primary"

type Status = "idle" | "submitting" | "success" | "error"

export function NetworkForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "submitting") return
    setStatus("submitting")
    setErrorMsg(null)

    const data = new FormData(e.currentTarget)
    const payload: Record<string, unknown> = {
      full_name: data.get("full_name"),
      email: data.get("email"),
      organization: data.get("organization"),
      role: data.get("role"),
      linkedin: data.get("linkedin"),
    }
    for (const f of INTEREST_FIELDS) payload[f] = data.get(f) === "on"

    try {
      const res = await fetch("/api/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = await res.json()
      if (!res.ok) {
        setErrorMsg(body.error ?? "Could not join right now. Please try again.")
        setStatus("error")
        return
      }
      setStatus("success")
    } catch {
      setErrorMsg("Could not join right now. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="border border-border-subtle bg-surface-default p-10 text-center">
        <p className="eyebrow text-text-primary opacity-80">Welcome</p>
        <p className="mt-3 font-serif text-xl text-text-primary">
          You are in the network.
        </p>
        <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-text-primary">
          You will hear from us based on what you opted into. Update your
          choices anytime by submitting this form again with the same email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="border border-border-subtle bg-surface-default p-6 md:p-10">
      <p className="text-base leading-relaxed text-text-primary opacity-80">
        Alumni, friends, and builders. Tell us what you want in on: events,
        the AI digest, the talent network, or a project of your own.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="n-name" className={labelClass}>
            Full name
          </label>
          <input id="n-name" name="full_name" autoComplete="name" className={`mt-2 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="n-email" className={labelClass}>
            Email
          </label>
          <input id="n-email" name="email" type="email" required autoComplete="email" className={`mt-2 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="n-org" className={labelClass}>
            Organization <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input id="n-org" name="organization" autoComplete="organization" className={`mt-2 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="n-role" className={labelClass}>
            Role <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input id="n-role" name="role" autoComplete="organization-title" className={`mt-2 ${inputClass}`} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="n-linkedin" className={labelClass}>
            LinkedIn <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input id="n-linkedin" name="linkedin" type="url" placeholder="https://www.linkedin.com/in/" className={`mt-2 ${inputClass}`} />
        </div>
      </div>

      <fieldset className="mt-8">
        <legend className={labelClass}>What do you want in on</legend>
        <div className="mt-3 space-y-2">
          {NETWORK_INTERESTS.map((interest, i) => (
            <label key={interest.title} className="flex cursor-pointer items-center gap-3 text-base text-text-primary">
              <input type="checkbox" name={INTEREST_FIELDS[i]} className="h-4 w-4 accent-(--color-ember)" />
              {interest.title}
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
        {status === "submitting" ? "Joining..." : "Join the network"}
      </button>
    </form>
  )
}
