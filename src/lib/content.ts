/**
 * Every word of site copy lives here, not in the components.
 *
 * The reason is editing. Brandon should be able to change what the site says
 * without reading JSX. If you are adding copy, add it here and render it from a
 * component. If you are changing copy, this is the only file you need to open.
 *
 * Two blocks are VERBATIM and must not be paraphrased, shortened, or improved:
 * MISSION, VISION, and VALUES. They are the decided language, proofed by the
 * team. See _reference/byu-static-site/_internal/brand-kit/voice.md.
 */

/* ────────────────────────────────────────────────────────────
   Naming

   BYU rule: "BYU Marriott School of Business" on first reference,
   "BYU Marriott" after, never "the Marriott School". And never a
   standalone "AI Foundry" without BYU identification, which is why
   the header pairs the two.
   ──────────────────────────────────────────────────────────── */

export const PROGRAM = "AI Foundry"
export const SCHOOL_FULL = "BYU Marriott School of Business"
export const SCHOOL_SHORT = "BYU Marriott"

/* ────────────────────────────────────────────────────────────
   Hero
   ──────────────────────────────────────────────────────────── */

export const HERO_STATEMENT = "An AI-native product studio and consultancy."

export const HERO_SUPPORT =
  "An experiential learning program of the " +
  SCHOOL_FULL +
  ". MBAs and undergraduates scope real projects, architect the solution, and ship systems that keep running after the semester ends."

/* ────────────────────────────────────────────────────────────
   Mission, vision, values. VERBATIM. Do not edit without Brandon.
   ──────────────────────────────────────────────────────────── */

export const MISSION =
  "We develop AI builders of faith, skill, and integrity who amplify opportunity and increase abundance worldwide."

export const VISION =
  "A world where expertise is abundant, and human flourishing is never limited by access, only by ambition."

export type Value = { name: string; body: string }

export const VALUES: Value[] = [
  {
    name: "Technical Excellence",
    body: "We are judged by what we ship: whether it works, and whether someone would pay for it. We compete on output, not pedigree. Credentials, whitepapers, and good intentions don't count as evidence; working systems in production do. Every Foundry builder is expected to master the frontier and prove that mastery through shipped work.",
  },
  {
    name: "Moral Conviction",
    body: "We hold ourselves to a higher standard than any rule will ever require. The real test of character is what you build when no one is auditing you. Access to people's data, attention, and labor is a trust freely given, never a lever to pull. We build only what people would consent to if they fully understood it. Our faith and integrity are not a compliance layer; they are the reason we build at all.",
  },
  {
    name: "Relentless Urgency",
    body: "We don't wait for permission to act on what we already know is right. Free, responsible people don't wait for institutional consensus. Urgency is a choice, the only thing that turns belief into shipped work instead of another meeting. It is how we stay at the frontier, and how we bring the frontier back to BYU.",
  },
]

/** Pairs with the vision on the About page. From voice.md. */
export const ERA_NARRATIVE =
  "Every general-purpose technology broke a constraint humanity assumed was permanent. Steam freed strength. The internet freed information. AI frees intelligence itself. Each time, an era of abundance followed. The Foundry exists to make sure this one reaches everyone."

/* ────────────────────────────────────────────────────────────
   Project intake brief

   Content is the eleven sections of AI-Foundry-Project-Brief.pdf.
   The page lists what will be asked so a visitor can judge the
   effort before starting; the form itself is embedded, so the
   fields live in the form tool, not in this repo.
   ──────────────────────────────────────────────────────────── */

/** The section is called "Get a quote". The button that jumps to it is called
 *  "Submit a project". Both labels are Brandon's, and they are not the same word
 *  on purpose: the button describes what you do, the section what you get. */
export const QUOTE_HEADING = "Get a quote"

/**
 * What we sell. This runs BEFORE the form fields, so someone arriving cold from
 * the top bar reads what the engagement actually is before being asked for their
 * phone number.
 */
export const OFFERINGS_HEADING = "Three offerings."

export const OFFERINGS_LEAD =
  "Engagements usually combine them. Most clients start with one and add the others as the work proves out."

export type Offering = { name: string; blurb: string; points: string[] }

export const OFFERINGS: Offering[] = [
  {
    name: "Full-stack applications",
    blurb:
      "Net-new web and mobile applications, built end to end on a modern stack and shipped to production. Any language the job calls for.",
    points: [
      "Customer-facing products (B2C)",
      "Products you sell to other businesses (B2B)",
      "Internal tools and line-of-business systems",
    ],
  },
  {
    name: "AI integration and orchestration",
    blurb:
      "AI wired into the systems you already run, rather than a standalone prototype that never reaches anyone's daily work.",
    points: [
      "Agents and copilots that work against your data",
      "Automations across Slack, Notion, and your existing stack",
      "Document processing, extraction, routing, and summarization",
    ],
  },
  {
    name: "AI enablement and training",
    blurb:
      "We set your team up to build this way themselves, using the same tooling we use on the engagement.",
    points: [
      "Claude Code, Codex, and frontier agent tooling",
      "Agentic workflow and automation setup",
      "Co-working alongside your staff, then handoff",
    ],
  },
]

export const QUOTE_LEAD =
  "Tell us what you want built. We come back with a scope of work, a cost estimate, and a delivery timeline. All information is treated as confidential."

/**
 * The eight fields that go on the page.
 *
 * BYU Marketing Lab's quote form, the closest comparable and the one this site
 * is modelled on, asks exactly six: first name, last name, phone, email,
 * company, brief project description. Those six are all here.
 *
 * Two are added, and only two. Website and timeline are each a single tap and
 * each changes how the work gets scoped, which is the bar a field has to clear
 * to earn a place before first contact.
 *
 * Budget is deliberately NOT here. It is the strongest qualifier in the brief
 * and the fastest way to lose a first-time visitor who has not yet been given a
 * reason to trust the program. It moves to the follow-up survey, once there is
 * a conversation to hang it on.
 *
 * The other thirty-odd fields in the intake brief are the follow-up survey
 * below. Nothing from the brief is lost, it is just sequenced.
 */
export type QuoteField = {
  label: string
  type: "text" | "email" | "tel" | "url" | "textarea" | "select"
  required: boolean
  help?: string
  options?: string[]
}

export const QUOTE_FIELDS: QuoteField[] = [
  { label: "First name", type: "text", required: true },
  { label: "Last name", type: "text", required: true },
  { label: "Email", type: "email", required: true },
  { label: "Phone number", type: "tel", required: true },
  { label: "Company", type: "text", required: true },
  { label: "Website", type: "url", required: false },
  {
    label: "What do you want built",
    type: "textarea",
    required: true,
    help: "A few sentences is plenty. If you are not sure yet, say so, that is a normal place to start.",
  },
  {
    label: "When do you need it",
    type: "select",
    required: false,
    options: [
      "As soon as possible",
      "Within a semester",
      "Within the year",
      "Exploring, no date yet",
    ],
  },
]

/** What happens after the form. Three steps, so nobody wonders. */
export const QUOTE_STEPS: { n: number; title: string; detail: string }[] = [
  { n: 1, title: "You send the short form", detail: "Eight fields. Two minutes." },
  { n: 2, title: "We follow up", detail: "A conversation, plus a longer intake survey covering process, users, data, platform, and compliance." },
  { n: 3, title: "You get a written scope", detail: "Deliverables, cost, and schedule, in writing." },
]

/**
 * The follow-up intake survey: the rest of AI-Foundry-Project-Brief.pdf.
 * Not rendered as form fields on the page. Kept here because it is the spec for
 * the second Google Form, and because it is the record of what the brief asks.
 */
export type IntakeSection = { n: number; title: string; detail: string }

export const SURVEY_SECTIONS: IntakeSection[] = [
  { n: 1, title: "Current process", detail: "The process to replace or improve, step by step. How often it runs, who runs it, hours per week, and where it currently fails." },
  { n: 2, title: "Objectives", detail: "The intended outcome, and one or more measurable success criteria." },
  { n: 3, title: "Users", detail: "Who will use it, their roles and headcount, and their technical proficiency." },
  { n: 4, title: "Scope", detail: "Three to five capabilities required for the initial release, capabilities desired later, and explicit exclusions." },
  { n: 5, title: "Data and integrations", detail: "Where the relevant data lives, which systems it must integrate with, whether access can be provided, and whether sample files are available." },
  { n: 6, title: "Platform", detail: "Target environment, and whether it runs continuously in the background or on demand." },
  { n: 7, title: "Compliance and privacy", detail: "Applicable regulations, sensitive data, and any action that must require human approval." },
  { n: 8, title: "Design references", detail: "Applications you consider well designed and why, and applications you find difficult and why." },
  { n: 9, title: "Budget and ownership", detail: "Budget range, prior attempts and their outcomes, and who owns and is trained on the result." },
  { n: 10, title: "Additional information", detail: "Anything else relevant to scoping the work." },
]

/* ────────────────────────────────────────────────────────────
   Join the network
   ──────────────────────────────────────────────────────────── */

export const NETWORK_LEAD =
  "Alumni, friends, and builders. Tell us what you want in on: events, the weekly digest, the talent network, or a project of your own."

export type Interest = { title: string; blurb: string }

export const NETWORK_INTERESTS: Interest[] = [
  { title: "Live BYU-sponsored AI events", blurb: "In-person sessions on the most cutting-edge technologies as they land." },
  { title: "Weekly AI digest", blurb: "A tight weekly read on what is moving in AI, curated for the BYU network." },
  { title: "Access to the cohort for talent", blurb: "An introduction to the cohort when you are hiring builders." },
  { title: "Submit a project proposal", blurb: "Something you want built. This routes to the project intake brief." },
]

/* ────────────────────────────────────────────────────────────
   People

   Roster and headshots carried from the previous site. Roles are as
   recorded there and are pending Brandon's confirmation.
   ──────────────────────────────────────────────────────────── */

export type Member = {
  name: string
  role: string
  bio: string | null
  linkedin: string
  photo: string
}

export const TEAM: Member[] = [
  { name: "JD Davenport", role: "Managing Director", bio: "JD is the Managing Director of AI Foundry and a BYU MBA candidate. Before the MBA he went from Technical PM to Principal at National Grid in about two years, building a cloud portfolio from zero to 500-plus services and an AI-driven pricing engine. He started AI Foundry to give MBAs real reps building and shipping with AI agents.", linkedin: "https://www.linkedin.com/in/jd-davenport/", photo: "/team/jd-davenport.jpg" },
  { name: "Rachel Moulton", role: "Chief of Staff", bio: "Rachel is involved in healthcare analytics and product management with a background in public health. She's focused on improving healthcare delivery through data and strategy and hopes to drive meaningful change in healthcare outcomes and experiences.", linkedin: "https://www.linkedin.com/in/rachel-moulton", photo: "/team/rachel-moulton.jpg" },
  { name: "Corbin Sterling", role: "Director of Marketing", bio: "Corbin is a BYU MBA candidate concentrating in Marketing and Strategy, with a creative background rooted in music and movie production. He is focused on using AI tools to sharpen how brands market and decide what to build next.", linkedin: "https://www.linkedin.com/in/corbinsterling/", photo: "/team/corbin-sterling.jpg" },
  { name: "Brandon Jeppson", role: "BYU Products", bio: "Brandon is a BYU MBA ('27) in Product Management, and the VP of Sales at Cougar Strategy Group. He is currently standing up the partnership motion at Redo, and is building AI operating systems to open new revenue channels with leading 3PL and logistics providers.", linkedin: "https://www.linkedin.com/in/bjepp/", photo: "/team/brandon-jeppson.jpg" },
  { name: "Alex Sisk", role: "External Deals", bio: "Alex is an MBA candidate concentrating in Finance with a background spanning commercial real estate, SaaS sales engineering, and entrepreneurship. He is launching a mortgage company with an AI-native operations strategy.", linkedin: "https://www.linkedin.com/in/alex-sisk/", photo: "/team/alex-sisk.jpg" },
  { name: "Abe Bedard", role: "SMBs", bio: "Abraham is a strategy-obsessed entrepreneur, BYU MBA ('27), and CEO at Yatta Golf. After scaling the brand from scratch to $7M+ in annual revenue, his mission remains unchanged: build wicked-good product, develop world-class talent, and help humans enjoy the heck out of life.", linkedin: "https://www.linkedin.com/in/abraham-bedard/", photo: "/team/abe-bedard.jpg" },
  { name: "Felix Vivanco Salazar", role: "Alumni Relations", bio: null, linkedin: "https://www.linkedin.com/in/felix-vivanco/", photo: "/team/felix-vivanco-salazar.jpg" },
  { name: "Tulga Ganbat", role: "Product Evaluation and QC", bio: "Tulga is an MBA candidate in Marketing and Product Management with a bachelor's degree in Statistics and Data Science. He is the founder of Orchuul.mn, Mongolia's first and largest AI-powered translation marketplace, which he independently built and scaled.", linkedin: "https://www.linkedin.com/in/tulgaganbat", photo: "/team/tulga-ganbat.jpg" },
  { name: "Jake Healey", role: "AI Tooling", bio: null, linkedin: "https://www.linkedin.com/in/jacobjhealey/", photo: "/team/jake-healey.jpg" },
  { name: "Sylvan Scott", role: "Thought Leadership", bio: null, linkedin: "https://www.linkedin.com/in/sylvan-j-scott/", photo: "/team/sylvan-scott.jpg" },
  { name: "Chase Clement", role: "Finance", bio: "Chase is an MBA candidate concentrating in Finance with a background in enterprise systems implementation and financial operations. A former Division 1 javelin thrower, he is now launching a mortgage company built on AI-driven automation.", linkedin: "https://www.linkedin.com/in/chase-clement9", photo: "/team/chase-clement.jpg" },
  { name: "John Passey", role: "UX and UI Design", bio: "John is an MBA candidate at BYU Marriott with five years of experience making health insurance easier to understand, navigate, and use.", linkedin: "https://www.linkedin.com/in/johnpassey/", photo: "/team/john-passey.jpg" },
  { name: "Tyler Doman", role: "Education and Training", bio: "Tyler is a BYU MBA ('27) on the entrepreneurship track with a background in strategy and growth. He is pursuing Entrepreneurship Through Acquisition, where he plans to acquire a small business and use AI implementation to professionalize and scale its operations.", linkedin: "https://www.linkedin.com/in/tyler-doman/", photo: "/team/tyler-doman.jpg" },
  { name: "Enoch Councill", role: "Ambassador, Cougar Capital", bio: "Enoch is a BYU MBA candidate and the Director of AI at Cougar Capital, the student-run investment fund, where he builds tools to speed up and sharpen the VC process. Before his MBA he worked in technology implementations, pre-sales, and customer success within B2B SaaS.", linkedin: "https://www.linkedin.com/in/enochcouncill/", photo: "/team/enoch-councill.jpg" },
  { name: "Jorge Beltran", role: "Ambassador, Savage", bio: "Jorge is an MBA candidate at BYU Marriott and a Finance Intern at Ford Motor Company. Previously he led organizations through ERP transformations as a Senior Supply Chain Consultant.", linkedin: "https://www.linkedin.com/in/jorge-u-beltran/", photo: "/team/jorge-beltran.jpg" },
]

/**
 * Faculty advisor. Naming him is the single highest-credibility item on the
 * site, which is also why the title needs to be right. Confirm with Scott
 * before this goes live.
 */
export const FACULTY = {
  name: "Scott Murff",
  role: "Faculty Advisor",
  detail:
    "Associate Teaching Professor of Strategy at the " +
    SCHOOL_FULL +
    ", and previously a consultant at McKinsey & Company.",
}

/* ────────────────────────────────────────────────────────────
   Forms

   Deliberately no backend, no database, and no environment variables:
   the whole class of deploy failure that broke the previous project
   cannot happen here. Both forms are embedded from a hosted form tool.

   To go live, paste the share URL. Nothing else needs to change.
   ──────────────────────────────────────────────────────────── */

export const FORMS: { intake: string | null; network: string | null } = {
  // "AI Foundry: Request a quote", owned by aifoundry.byu@gmail.com, filed in
  // 02 Deals & Clients. Built by scripts/create-google-forms.gs on 2026-07-29.
  // Responses land in "AI Foundry: Quote requests" in the same folder.
  intake:
    "https://docs.google.com/forms/d/e/1FAIpQLSc0fG4nrUqMch40-KFW6gdF4lTzibDxxORGlB8yXCfZDuoj3g/viewform?embedded=true",
  // "AI Foundry: Join the network", same owner and folder. Six fields, only the
  // email required. Responses land in "AI Foundry: Network signups", which is
  // also the merge target for JD's existing list. See FORMS.md.
  network:
    "https://docs.google.com/forms/d/e/1FAIpQLSc9FWFpkqD4R81s-WDh7Gqzf-WfwyfDog7NnRvmZC87fc5bLQ/viewform?embedded=true",
}

/* ────────────────────────────────────────────────────────────
   Navigation

   Every destination below is a page or a section that actually exists.
   Nothing here is a placeholder for a page yet to be built.
   ──────────────────────────────────────────────────────────── */

export type NavLink = { label: string; href: string }

/** Two tabs. Click either one and it takes you straight there. */
export const NAV: NavLink[] = [
  { label: "Join the network", href: "/network" },
  { label: "About us", href: "/about" },
]

/**
 * Two steps, two destinations, and they do not overlap.
 *
 *   NAV_CTA   -> /#quote   what we build, and what an engagement is
 *   QUOTE_CTA -> /quote    the form, and nothing else
 *
 * The offerings live in exactly one place and the form lives in exactly one
 * place, so neither can drift out of step with a second copy of itself. The
 * hero button and the top bar both land on the offerings; the only route to
 * the form is through them.
 */
export const NAV_CTA: NavLink = { label: "Get a quote", href: "/#quote" }

export const QUOTE_CTA: NavLink = { label: "Request a quote", href: "/quote" }
