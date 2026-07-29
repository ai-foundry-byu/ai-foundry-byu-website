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
  #quote              Get a quote, the short form (anchor target)
/network              Join the Network subpage
/about                About Us, 15 MBA tiles
```

**Top nav:** `Join the network` and `About us` as plain tabs, plus `Get a quote`
as a button, all on a navy bar. No dropdowns.

`Get a quote` in the bar points at `/#quote`, the same place the hero button goes.
**There is deliberately only one Get a quote destination.** A separate `/quote` page
would mean two copies of the offerings and the form to keep in step, and they would
drift. `Submit a project` is the hero button only, never a nav item.

## Landing page, in order

### 1. Hero

Centred, Marketing Lab scale, with the anvil above it on the same axis.
The measure is capped so the sentence breaks over two lines rather than running
the full column width:

> **An AI-native product studio and consultancy.**

Two buttons side by side:

| Button | Behaviour |
|---|---|
| `Submit a project` | Smooth-scrolls **down the same page** to `#quote`. Not a link to another page |
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

### 3. Get a quote, anchor `#quote`

Order within the section matters: **the offerings run before the form fields.**
Someone arriving here from the top bar has not necessarily read anything else on
the site, so the first thing they meet is what the engagement is, not a request
for their phone number.

1. Heading and lead
2. **Three offerings**: full-stack applications, AI integration and orchestration,
   AI enablement and training. Copy lives in `OFFERINGS` in `content.ts`
3. The eight-field form, with What happens next beside it

The eleven-section intake brief is **split across two forms**, decided 2026-07-28
after a teardown of byumarketinglab.com. Nothing from the brief was dropped, it was
sequenced. `FORMS.md` is the field-by-field spec for both.

- **On the page: eight fields.** Marketing Lab's six (first, last, phone, email,
  company, project description) plus website and timeline. Two minutes to fill
- **After first contact: the rest**, as a longer intake survey
- **Budget is deliberately not up front.** It is the strongest qualifier in the brief
  and the fastest way to lose a visitor who has no reason yet to trust a first-year
  program. Revisit once inbound is steady

This supersedes the earlier open recommendation, which is now resolved.

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
- Use the co-brand lockup only, never a standalone AI Foundry mark. The real one
  arrived 2026-07-28 and is in `public/brand/`

## Build status, 2026-07-28

All three pages are built and all three gates pass. `npm run dev`, then look.

| Page | Route | State |
|---|---|---|
| Landing | `/` | Built. Hero, mission/vision/values, `#quote` |
| Join the Network | `/network` | Built. Interests list plus the form slot |
| About Us | `/about` | Built. Faculty, then 15 tiles with headshots |

Where the code lives:

- `src/lib/content.ts` — **every word of copy on the site.** Change text here, not in JSX
- `src/components/SiteHeader.tsx` — navy bar, the co-brand lockup, two nav tabs
- `src/components/SiteFooter.tsx`
- `src/components/EmbeddedForm.tsx` — the form slot and its fallback
- `src/app/{page,network/page,about/page}.tsx` — layout only, no copy

Notes on how it was built:

- **Zero client JavaScript.** The mobile menu is a native `<details>`, and the hero
  button is a plain `#quote` anchor that the browser scrolls smoothly on its own.
  Every route prerenders static
- **Zero dependencies beyond Next and React.** Dropped `@supabase/supabase-js` and
  `motion`, both unused here. Nothing left to misconfigure
- The hero background is a separate layer already in place, so the video can drop in
  later without restructuring the section
- `data-scroll-behavior="smooth"` is set on `<html>`. Next 16 stopped suppressing CSS
  smooth scroll during navigation, so without it every route change would slowly glide

### The logo, resolved

**Brandon supplied the real co-brand lockup on 2026-07-28.** It is in the header and
the footer. This closes the open compliance risk: the site no longer ships the `af-*`
Block Y derivative, which was AI-generated and never approved.

Sources are archived in `_brand-src/`, and `scripts/build-brand-assets.py` regenerates
everything in `public/brand/`:

| File | Use |
|---|---|
| `lockup.png` | full colour, background knocked out, for light surfaces |
| `lockup-white.png` | white reversal, used in the header and footer |
| `anvil.png` | full colour, trimmed |
| `anvil-white.png` | white reversal, used in the hero |

The white reversal is the sanctioned treatment: BYU marks appear in navy or white
only. The script recolours and trims, it never redraws, so every letterform is the
one that arrived in the source file.

Still open, same category: `favicon-*.png` and `og-image.png` were carried over from
the old repo and probably still contain the derivative mark. Regenerate them from
the real lockup before launch.

## Still needed from Brandon

- [ ] **The share URL for the project intake form.** Paste into `FORMS.intake` in
      `src/lib/content.ts`. That is the entire change, nothing else moves
- [ ] **The share URL for Join the Network.** Same, `FORMS.network`
- [ ] Confirm the 15 roles. Titles were carried from the old site and are unverified
- [ ] Confirm Scott Murff's title before it goes public. It is the highest-credibility
      line on the site and the one most worth getting exactly right
- [ ] Regenerate `og-image.png` and the favicons from the real lockup. The carried-over ones probably still hold the unapproved Block Y derivative

Two things I decided rather than block on, both easy to reverse:

- **Nav is two plain tabs**, Join the network and About us, both pointing at pages
  that exist. Edit `NAV` in `content.ts`
- **The 30-field form question, answered.** Split into eight fields up front and a
  follow-up survey for the rest. See `FORMS.md` and the Get a quote section above

## Verification before any push

```sh
npm run lint
npm run check:contrast
npm run build
```

All three must exit 0. CI runs the same three on every PR.
