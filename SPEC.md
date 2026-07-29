# Official AI Foundry Site — build spec

Everything needed to build this site. Confirmed with Brandon 2026-07-28.
Repo: `ai-foundry-byu/Official-AI-Foundry-Site`

## Decisions already made, do not relitigate

| Decision | Answer |
|---|---|
| Scope | **Clean rebuild.** Landing, Join the Network, About Us. Nothing else ported |
| Forms | **Embedded** (Tally / Google Forms). No backend, no database, **no environment variables** |
| About Us | **15 MBAs**, headshots available. Source roster from Scott's repo `/team` page |
| Hero line | **"An AI-native product studio and consultancy."** |
| Deploy | Push to `main`. Scott wires Vercel afterwards |

Deliberately excluded: `/jobs`, `/admin`, `/apply`, `/projects/new`, all API routes, Supabase.
Zero env vars is a feature. It removes the entire class of failure that broke the old project.

## Site structure

```
/                     landing
  #hero               big statement + 2 buttons
  #mission            mission, vision, values
  #submit             the project intake form (anchor target)
/network              Join the Network subpage
/about                About Us, 15 MBA tiles
```

**Top nav:** `Join the Network` and `About Us`, both as dropdown tabs.
`Submit a Project` is NOT a nav item. It lives on the landing page only.

## Landing page, in order

### 1. Hero

Large bold statement, Marketing Lab scale:

> **An AI-native product studio and consultancy.**

Two buttons side by side:

| Button | Behaviour |
|---|---|
| `Submit a project` | Smooth-scrolls **down the same page** to `#submit`. Not a link to another page |
| `Join the network` | Navigates to `/network` |

Later, not now: video or motion background behind the hero, like byumarketinglab.com.
Build the hero so a background layer can be dropped in without restructuring.

### 2. Mission, vision, values

Verbatim. Do not paraphrase, do not shorten, do not "improve."

**Mission**
> We develop AI builders of faith, skill, and integrity who amplify opportunity and increase abundance worldwide.

**Vision**
> A world where expertise is abundant, and human flourishing is never limited by access, only by ambition.

**Values**

1. **Technical Excellence.** We are judged by what we ship: whether it works, and whether someone would pay for it. We compete on output, not pedigree. Credentials, whitepapers, and good intentions don't count as evidence; working systems in production do. Every Foundry builder is expected to master the frontier and prove that mastery through shipped work.

2. **Moral Conviction.** We hold ourselves to a higher standard than any rule will ever require. The real test of character is what you build when no one is auditing you. Access to people's data, attention, and labor is a trust freely given, never a lever to pull. We build only what people would consent to if they fully understood it. Our faith and integrity are not a compliance layer; they are the reason we build at all.

3. **Relentless Urgency.** We don't wait for permission to act on what we already know is right. Free, responsible people don't wait for institutional consensus. Urgency is a choice, the only thing that turns belief into shipped work instead of another meeting. It is how we stay at the frontier, and how we bring the frontier back to BYU.

### 3. Submit a project, anchor `#submit`

Content comes from `AI-Foundry-Project-Brief.pdf`, the Project Intake Brief. Eleven sections:

1. **Client Information** — name, company, email, telephone, industry, website, brief description of the business
2. **Current Process** — process to replace or improve step by step; frequency, personnel, hours per week; where it currently fails (errors, delays, omissions)
3. **Objectives** — intended outcome; one or more measurable success criteria
4. **Users** — intended users with roles and headcount; technical proficiency (High / Moderate / Low)
5. **Scope** — required capabilities for initial release, three to five items; desired future capabilities; exclusions (must not perform, must not access)
6. **Data and Integrations** — where relevant data lives; systems to integrate with (multi-select: Email Gmail/Outlook, Excel/spreadsheets, Google Drive/OneDrive, CRM, QuickBooks/accounting, Calendar, SMS/text, Telephone system, Website forms, Slack/Teams, Social media, Industry-specific software, Other); whether access can be provided; sample files (Available / Available with preparation / Not available)
7. **Platform** — target environment (multi-select: Windows desktop, macOS desktop, Web browser, iOS, Android, Scheduled/unattended); continuous background operation vs on-demand
8. **Compliance and Privacy** — applicable regulations; sensitive data and actions requiring human approval
9. **Design References** — apps considered well designed and why; apps found difficult and why
10. **Timeline and Budget** — target delivery date; budget range; prior attempts and outcomes; post-delivery ownership and who receives training
11. **Additional Information** — anything else relevant to scoping

Header copy from the brief:
> Please complete this form to the extent possible. Your responses are used to prepare a scope of work, cost estimate, and delivery timeline. All information is treated as confidential.

Closing copy from the brief:
> Upon receipt, we will review your responses, follow up with any clarifying questions, and provide a written scope of work covering deliverables, cost, and schedule.

> **OPEN RECOMMENDATION, needs Brandon's call.** Thirty-plus fields inline on a landing page is a
> lot to ask of a first-time visitor. Marketing Lab's equivalent asks six. Suggested alternative:
> a short qualifier on the page (name, company, email, one-paragraph description) that routes to
> the full intake brief after first contact. Build the full form as specified unless Brandon says
> otherwise, but raise it once.

## Join the Network, `/network`

Reachable from the hero button and the top nav. Embedded form.
Reference the existing `/network` page in Scott's repo, which collects: name, email, company, role, LinkedIn.
Existing copy there: "Welcome to the network."

## About Us, `/about`

Picture tiles for the 15 MBAs. Source the roster from Scott's repo `src/app/team/page.tsx`.
Headshots exist. Confirm where the files live before building the grid.

Known names from prior work, verify against Scott's repo before publishing:
JD Davenport, Rachel Moulton, Corbin Sterling, Brandon Jeppson, Alex Sisk, Abe Bedard,
Felix Vivanco Salazar, Tulga Ganbat, Jake Healey, Sylvan Scott, Chase Clement, John Passey,
Tyler Doman, Enoch Councill, Jorge Beltran.

Faculty: **Scott Murff**, Faculty Advisor, Associate Teaching Professor of Strategy, ex-McKinsey.
Naming him is the highest-value credibility item on the site. Confirm title with him first.

## Brand rules, non-negotiable

Carried over in `src/app/globals.css` as a three-layer token system with an enforced contrast
contract. `npm run check:contrast` fails the build on a violation.

- Palette is BYU's: navy `#002E5D`, white, royal `#003DA5`, slate `#7C878E`, accent orange `#D14124`
- **Orange is a fill on dark, never text on navy.** That pair is 2.90:1 and fails
- Accent text on navy uses BYU Light Blue `#BDD6E6`, 8.99:1
- Accent on the subtle grey surface is 4.27:1, so large text only
- Sentence case headlines. **No em dashes, ever**
- Never "the Marriott School". "BYU Marriott School of Business" first reference, "BYU Marriott" after
- Never a standalone "AI Foundry" without BYU identification
- No approved standalone logo exists. Use the co-brand lockup only

## Still needed from Brandon

- [ ] The form embed code or share URL for the project intake brief
- [ ] The form embed for Join the Network, if different
- [ ] Headshot files for the 15 MBAs, and where they live
- [ ] Confirmation of each person's current role title
- [ ] What sits in the two nav dropdowns

## Verification before any push

```sh
npm run lint
npm run check:contrast
npm run build
```

All three must exit 0. CI runs the same three on every PR.
