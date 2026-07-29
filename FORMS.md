# The three forms

> **Built and live, 2026-07-29.** All three owned by `aifoundry.byu@gmail.com`, filed in
> **02 Deals & Clients**. Verified publicly reachable: every question renders for an
> anonymous visitor with no Google sign-in.
>
> Quote form is on `/quote`, network form is on `/network`, survey is emailed.
>
> **End-to-end verified 2026-07-29 16:00.** A real submission was made through each
> of the two public forms and confirmed to arrive as a row in the correct response
> sheet, including the multi-select checkbox field, which arrives as a single
> comma-joined cell. Both test submissions were then removed from **both** places
> a response lives: the sheet row and the form's own response store. Deleting one
> does not remove the other. `scripts/remove-test-submissions.gs` is how, and it
> refuses to touch anything that is not the test email.
>
> | | Edit | Responses |
> |---|---|---|
> | Get a quote | [form](https://docs.google.com/forms/d/1tfwnK9BDuG8fKrhLtL8uy8RK9enbHGSUMrYkYufOiB0/edit) | [sheet](https://docs.google.com/spreadsheets/d/1mG0PeVp1ZsuheWYM3tGDJ3FwgZ7qSw0Vk1iN9d_cyyE/edit) |
> | Project intake survey | [form](https://docs.google.com/forms/d/1yUVL6nKvG-LUWGogazSH2H5kIp7vOK8q5_cxz6WpJYo/edit) | [sheet](https://docs.google.com/spreadsheets/d/1kaTEwirk5_cdHkrbnXJ1H_P8eyX4n7YoGRQ6g659lqQ/edit) |
> | Join the network | [form](https://docs.google.com/forms/d/1pSeIx4wwMLBCgnrk0jciO-WTJ5SHCLvvnWUSEGOjLWU/edit) | [sheet](https://docs.google.com/spreadsheets/d/17I2IK5W_88iuncKTE5YuZtS1HWU_KsnXhacGF81MXb4/edit) |
>
> Survey share link, for emailing after first contact:
> `https://docs.google.com/forms/d/e/1FAIpQLSfzSBpHwIw9E5ppyx1WcEFseNBNvkUBBBwR3LvX6SIh7C_C1A/viewform`

Both are Google Forms writing into one Google Sheet each. No backend, no API keys,
nothing that can fail at deploy. Build them, then paste each share URL into `FORMS`
in `src/lib/content.ts`. That is the only code change.

Source for every field: `AI-Foundry-Project-Brief.pdf`, the eleven-section intake brief.
Nothing from the brief was dropped. It was split by *when* it is worth asking.

## Why it is split

BYU Marketing Lab, the closest comparable program and the site this one is modelled
on, asks **six fields** for a quote: first name, last name, phone, email, company,
brief project description. That is the whole form. Everything else happens after
someone is already talking to them.

Thirty-plus fields in front of a first-time visitor is how you get a beautiful form
nobody finishes. So: eight fields up front, the rest once there is a conversation.

---

## Form 1: Get a quote

Lives on its own page at `/quote`. **Eight fields.**

| # | Field | Type | Required | Notes |
|---|---|---|---|---|
| 1 | First name | Short answer | Yes | |
| 2 | Last name | Short answer | Yes | |
| 3 | Email | Short answer, email validation | Yes | |
| 4 | Phone number | Short answer | Yes | |
| 5 | Company | Short answer | Yes | |
| 6 | Website | Short answer | No | |
| 7 | What do you want built | Paragraph | Yes | Help text: "A few sentences is plenty. If you are not sure yet, say so, that is a normal place to start." |
| 8 | When do you need it | Multiple choice | No | As soon as possible / Within a semester / Within the year / Exploring, no date yet |

Form description, at the top:

> Tell us what you want built. We come back with a scope of work, a cost estimate,
> and a delivery timeline. All information is treated as confidential.

Confirmation message, after submit:

> Thanks. We will follow up, and send a short intake survey so we can scope the work
> properly.

### What changed from the brief, and why

**Added to Marketing Lab's six:**

- **Website.** One tap for them, and it lets whoever picks this up research the
  company before the first call instead of during it
- **Timeline.** One tap, and it is the difference between "this fits a semester"
  and "this does not." It is a dropdown, not a date picker, so nobody has to commit

**Deliberately held back: budget.** It is the strongest qualifier in the brief and
the fastest way to lose someone who has not yet been given a reason to trust a
first-year program. It moves to Form 2, once there is a conversation to hang it on.
Revisit this once inbound is steady: at that point screening matters more than volume.

---

## Form 2: Project intake survey

**Not linked from the site.** Sent after first contact. This is the rest of the brief.

Ten sections. Keep them as Google Forms *sections* so the progress bar shows, and mark
everything optional except section 1: someone filling this out is already a live lead,
and a required field they cannot answer is a reason to stop.

| # | Section | What it asks |
|---|---|---|
| 1 | Current process | The process to replace or improve, step by step. How often it runs, who runs it, hours per week, and where it currently fails (errors, delays, omissions) |
| 2 | Objectives | The intended outcome, and one or more measurable success criteria |
| 3 | Users | Intended users with roles and headcount. Technical proficiency: High / Moderate / Low |
| 4 | Scope | Three to five capabilities required for the initial release. Capabilities desired later. Exclusions: what it must not do, what it must not access |
| 5 | Data and integrations | Where the relevant data lives. Systems to integrate with (multi-select: Email Gmail/Outlook, Excel/spreadsheets, Google Drive/OneDrive, CRM, QuickBooks/accounting, Calendar, SMS/text, Telephone system, Website forms, Slack/Teams, Social media, Industry-specific software, Other). Whether access can be provided. Sample files: Available / Available with preparation / Not available |
| 6 | Platform | Target environment (multi-select: Windows desktop, macOS desktop, Web browser, iOS, Android, Scheduled/unattended). Continuous background operation, or on demand |
| 7 | Compliance and privacy | Applicable regulations. Sensitive data. Any action that must require human approval |
| 8 | Design references | Applications considered well designed, and why. Applications found difficult, and why |
| 9 | Budget and ownership | Budget range. Prior attempts and their outcomes. Who owns the result after delivery, and who gets trained |
| 10 | Additional information | Anything else relevant to scoping |

Closing message, verbatim from the brief:

> Upon receipt, we will review your responses, follow up with any clarifying
> questions, and provide a written scope of work covering deliverables, cost,
> and schedule.

---

---

## Form 3: Join the network

Lives on `/network`. **Six fields, one of them required.**

Nobody is buying anything here, they are raising a hand, so every extra field is
pure cost. Email is the only thing actually required.

| # | Field | Type | Required |
|---|---|---|---|
| 1 | Full name | Short answer | No |
| 2 | Email | Short answer, email validation | **Yes** |
| 3 | Company or organization | Short answer | No |
| 4 | Role | Short answer | No |
| 5 | LinkedIn | Short answer | No |
| 6 | I'm interested in | Checkboxes | No |

Checkbox options, which **must** stay in step with `NETWORK_INTERESTS` in
`src/lib/content.ts`, since that is what the page renders beside the form:

- Live BYU-sponsored AI events
- Weekly AI digest
- Access to the cohort for talent
- Submitting a project proposal

### Merging JD's existing list

JD may already own a join-the-network list. Treat **this form's response sheet as
the merge target**, not the other way round: the sheet the form writes into is the
one the program account owns and the one that keeps growing.

1. Open `AI Foundry: Network signups`
2. Map JD's columns onto the six above. Anything he has that does not map, add as a
   new column to the right of the form's columns. Never insert a column in the
   middle, it breaks the form's write position
3. Append his rows underneath. **Leave the Timestamp cell empty on imported rows.**
   That empty timestamp is how you tell an import from a real submission later
4. Dedupe on email, keeping the row with the earlier timestamp where both have one

Worth deciding rather than drifting into: whether JD's list holds people who ever
consented to be emailed by AI Foundry specifically. If it does not, importing them
into a list you then send a digest to is the kind of thing that gets a BYU program
a complaint. Ask him where the names came from before merging.

---

## Building them

`scripts/create-google-forms.gs` builds the forms to this spec, wires each to its own
response spreadsheet, and files them in **02 Deals & Clients** in the AI Foundry
shared Drive (`1x6toDmtaR28SdMDiCpnOfaQBzNxkmRsh`).

**Two separate entry points, and picking the right one matters:**

| Function | Builds |
|---|---|
| `createAiFoundryForms` | Get a quote **and** the intake survey. Already run. Running it again makes duplicates |
| `createNetworkForm` | Join the network only |

Select the function in the dropdown next to Run. Forms 1 and 2 are already live and
already collecting, so use `createNetworkForm` from here on.

Run it once at script.google.com, signed in as whichever account should **own** the
forms. Ownership matters more than it looks: the owner keeps the form and its
responses. A form owned by a student's personal Gmail leaves with that student.

It logs the embed URL. Paste that into `FORMS.intake` in `src/lib/content.ts`,
`npm run dev`, and look at `/quote`. That is the only code change.

Safe to re-run: it creates new files rather than editing existing ones, so nothing
already collecting responses can be clobbered.

Doing it by hand instead: build the form, Responses tab, link a Google Sheet, then
Send, the `<>` embed tab, and copy the `src` URL out of the iframe snippet.

Form 2 never touches the site. It gets emailed.

One thing worth deciding before launch: Google Forms puts a Google-branded frame
around an embedded form, which reads as noticeably less official than the rest of
the page. Tally embeds cleanly and is free at this volume. Either works with the
code as written, since both are just a URL.
