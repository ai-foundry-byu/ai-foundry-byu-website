import { createClient } from "@supabase/supabase-js"

/**
 * The live numbers behind /roadmap, read straight from Supabase on the server.
 *
 * This is deliberately NOT an API route. The page that needs these is a server
 * component on the same deploy, so it can query directly: no public endpoint to
 * secure, no CORS, no service key anywhere near a browser, and no fetch that
 * can fail after the page has already painted.
 *
 * Every field degrades to null on its own. A table that has not been migrated,
 * or a Supabase blip, must cost us that one number and nothing else. The page
 * renders a dash in its place. The alternative, a page that 500s because one
 * count failed, is a worse answer to "where does the program stand".
 */

export type RoadmapStats = {
  network: number | null
  applications: number | null
  proposals: number | null
  advisoryBoard: number | null
  foundingPartners: number | null
  linkedinFollowers: number | null
  claudeArchCerts: number | null
  readAt: Date
}

/** Every field null. What we render when there is no database to talk to. */
function emptyStats(): RoadmapStats {
  return {
    network: null,
    applications: null,
    proposals: null,
    advisoryBoard: null,
    foundingPartners: null,
    linkedinFollowers: null,
    claudeArchCerts: null,
    readAt: new Date(),
  }
}

export async function getRoadmapStats(): Promise<RoadmapStats> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY

  // No credentials is the normal case on a contributor's laptop and during
  // `next build`. Render the page with dashes rather than failing the build.
  if (!url || !key) return emptyStats()

  const supabase = createClient(url, key)

  /** Exact row count, head-only so no rows cross the wire. */
  async function count(table: string): Promise<number | null> {
    const { count, error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true })
    if (error) {
      console.error(`roadmap stats: count(${table}):`, error.message)
      return null
    }
    return count ?? 0
  }

  /**
   * People per tier, COUNTING ONLY THOSE WHO HAVE ACTUALLY SAID YES.
   *
   * The tier column is a pipeline stage, not a commitment: `advisory_t1`
   * holds prospects and warm leads alongside real board members. Counting
   * the tier alone published eight advisory board members when three had
   * confirmed, and it counted a person whose acceptance was later retracted
   * as a fabricated meeting-note extraction.
   *
   * So the status column is the gate, and it is an allowlist rather than a
   * denylist on purpose. A status nobody has thought about yet must fail
   * closed and go uncounted. The failure mode we are protecting against is
   * overclaiming a credential in public, and undercounting our own board is
   * a far cheaper mistake than naming someone who never agreed.
   *
   * A verbal yes does not count either. Aaron Arnoldsen has been a verbal
   * commitment since 2026-06-15 with the written invite still unsent; until
   * that is signed he is a commitment we owe, not a credential we hold.
   */
  const COMMITTED = new Set(["confirmed", "signed", "active"])

  async function tiers(): Promise<{ advisory: number; founding: number } | null> {
    const { data, error } = await supabase.from("af_people").select("tier,status")
    if (error) {
      console.error("roadmap stats: af_people:", error.message)
      return null
    }
    const committed = data.filter((r) => COMMITTED.has(String(r.status)))
    const inTier = (...t: string[]) =>
      committed.filter((r) => t.includes(r.tier)).length
    return {
      advisory: inTier("advisory_t1", "advisory_t2"),
      founding: inTier("founding_lead"),
    }
  }

  /**
   * The weekly metrics table, newest first. A metric is only captured on the
   * weeks it changed, so the answer for "how many followers" is the most
   * recent non-null value, not the value for this week specifically.
   */
  async function weekly(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("af_metrics_weekly")
      .select("metric_name,value")
      .order("week_of", { ascending: false })
      .limit(50)
    if (error) {
      console.error("roadmap stats: af_metrics_weekly:", error.message)
      return {}
    }
    const latest: Record<string, number> = {}
    for (const row of data) {
      if (row.value != null && !(row.metric_name in latest)) {
        latest[row.metric_name] = row.value
      }
    }
    return latest
  }

  const [network, applications, proposals, people, metrics] = await Promise.all([
    count("network_members"),
    count("foundry_applications"),
    count("project_proposals"),
    tiers(),
    weekly(),
  ])

  return {
    network,
    applications,
    proposals,
    advisoryBoard: people ? people.advisory : null,
    foundingPartners: people ? people.founding : null,
    linkedinFollowers: metrics.linkedin_followers ?? null,
    // Absent means nobody has certified yet, which is a real zero rather than
    // a missing reading. The other fields cannot make that distinction, but
    // this one can, because the goal is known.
    claudeArchCerts: metrics.claude_arch_certs ?? 0,
    readAt: new Date(),
  }
}
