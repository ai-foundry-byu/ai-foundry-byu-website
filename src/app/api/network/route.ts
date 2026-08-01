import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * POST /api/network. Joins the AI Foundry network.
 *
 * Writes to the same Supabase project the previous site used, table
 * network_members (see supabase/migrations/001_network_members.sql).
 * The client is created lazily at request time so `next build` succeeds
 * on machines without the env vars.
 */
function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  try {
    const body = await req.json()

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      )
    }

    const row = {
      full_name: str(body.full_name),
      email,
      organization: str(body.organization),
      role: str(body.role),
      linkedin: str(body.linkedin),
      interest_events: !!body.interest_events,
      interest_digest: !!body.interest_digest,
      interest_talent: !!body.interest_talent,
      interest_project: !!body.interest_project,
      source: "web",
    }

    // Upsert on email so a re-join updates interests instead of duplicating.
    const { data, error } = await supabase
      .from("network_members")
      .upsert(row, { onConflict: "email" })
      .select("id")
      .single()

    if (error) {
      console.error("network insert error:", error)
      return NextResponse.json(
        { error: "Could not join right now. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error("network submission error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null
}
