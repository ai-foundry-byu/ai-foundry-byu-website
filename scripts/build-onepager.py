#!/usr/bin/env python3
"""Rebuild the AI Foundry one-pager with a full team appendix (all 23 people + bios)."""
import base64, html, io, json, mimetypes, os, pathlib

HERE = pathlib.Path(__file__).parent
TEAM = json.load(open(HERE / "team.json"))
PHOTO_DIR = pathlib.Path("/Users/murff/ai-foundry-byu/website/public")
LOCKUP = pathlib.Path("/Users/murff/ai-foundry-byu/website/public")

NAVY = "#002E5D"
ACCENT = "#C0431E"
GREY = "#58595B"
RULE = "#DDE1E6"


def data_uri(p: pathlib.Path):
    if not p.exists():
        return None
    mime = mimetypes.guess_type(str(p))[0] or "image/jpeg"
    return f"data:{mime};base64,{base64.b64encode(p.read_bytes()).decode()}"


def esc(s):
    return html.escape(s or "")


# Leadership = everything that is not "Undergraduate"
leads = [m for m in TEAM if m["role"] != "Undergraduate"]
undergrads = [m for m in TEAM if m["role"] == "Undergraduate"]


def person_card(m, show_role=True):
    uri = data_uri(PHOTO_DIR / m["photo"].lstrip("/"))
    img = (f'<img src="{uri}" alt="">' if uri
           else '<div class="ph"></div>')
    role = f'<div class="prole">{esc(m["role"])}</div>' if show_role else ""
    bio = (f'<p class="pbio">{esc(m["bio"])}</p>' if m["bio"]
           else '<p class="pbio pmissing">Bio to come.</p>')
    return f"""<div class="card">
      <div class="photo">{img}</div>
      <div class="pmeta">
        <div class="pname">{esc(m['name'])}</div>
        {role}
        {bio}
      </div>
    </div>"""


CSS = f"""
@page {{ size: letter; margin: 0.75in 0.9in; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; font-family: "Helvetica Neue", Arial, sans-serif;
        color: #2B2B2B; font-size: 9.6pt; line-height: 1.5; }}
h1, h2, h3, .serif {{ font-family: Georgia, "Times New Roman", serif; color: {NAVY}; }}
h1 {{ font-size: 25pt; margin: 0 0 14pt; line-height: 1.12; }}
h2 {{ font-size: 15pt; margin: 0 0 8pt; }}
h3 {{ font-size: 11pt; margin: 0 0 5pt; }}
p {{ margin: 0 0 8pt; }}
a {{ color: {ACCENT}; text-decoration: none; }}

.tick {{ width: 46px; height: 5px; background: {ACCENT}; margin-bottom: 14pt; }}
.lockup {{ font-size: 11.5pt; font-weight: 700; letter-spacing: .055em; color: {NAVY};
           margin-bottom: 2pt; }}
.lockup .bar {{ color: #C3C7CC; font-weight: 400; }}
.lockup .af {{ color: {ACCENT}; }}
.school {{ font-size: 6.6pt; letter-spacing: .13em; color: {GREY}; margin-bottom: 22pt; }}

.lede {{ font-size: 10.4pt; color: #3A3A3A; margin-bottom: 16pt; max-width: 78%; }}

.eyebrow {{ font-size: 7pt; font-weight: 700; letter-spacing: .16em; color: {ACCENT};
            text-transform: uppercase; margin: 20pt 0 6pt;
            break-after: avoid; page-break-after: avoid; }}
h2 {{ break-after: avoid; page-break-after: avoid; }}
.ugsec {{ page-break-before: always; }}
.rule {{ border-top: 1px solid {RULE}; margin: 14pt 0; }}

.cols3 {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border: 1px solid {RULE}; }}
.cols3 > div {{ padding: 11pt 12pt; border-right: 1px solid {RULE}; }}
.cols3 > div:last-child {{ border-right: 0; }}
ul {{ margin: 6pt 0 0; padding-left: 12pt; list-style: none; }}
li {{ margin-bottom: 4pt; position: relative; padding-left: 9pt; }}
li:before {{ content: ""; position: absolute; left: 0; top: 5.5px;
             width: 4px; height: 4px; background: {ACCENT}; }}

.phases {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18pt; }}
.pnum {{ font-family: Georgia, serif; font-size: 8.5pt; color: #9AA0A6; margin-bottom: 3pt; }}

.why {{ display: grid; grid-template-columns: 175px 1fr; gap: 6pt 18pt; }}
.why .k {{ font-family: Georgia, serif; font-weight: 700; color: {NAVY}; font-size: 10pt; }}

.glance {{ background: #F1F4F7; padding: 16pt 18pt; }}
.glance .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12pt 24pt; }}
.glance .lbl {{ font-size: 6.8pt; letter-spacing: .13em; color: {GREY};
                text-transform: uppercase; margin-bottom: 3pt; }}
.glance .val {{ color: {NAVY}; font-size: 9.4pt; }}

.footer {{ margin-top: 16pt; font-size: 9pt; }}

/* ---------- appendix ---------- */
.appendix {{ page-break-before: always; }}
.grid4 {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 13pt 14pt; }}
.card {{ page-break-inside: avoid; break-inside: avoid; }}
.photo {{ width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #E8EAED;
          margin-bottom: 5pt; }}
.photo img {{ width: 100%; height: 100%; object-fit: cover;
              filter: grayscale(1) contrast(1.02); display: block; }}
.pname {{ font-family: Georgia, serif; font-weight: 700; color: {NAVY}; font-size: 8.8pt;
          line-height: 1.2; }}
.prole {{ font-size: 7pt; color: {GREY}; margin-top: 1pt; margin-bottom: 3pt; }}
.pbio {{ font-size: 7.1pt; line-height: 1.42; color: #4A4A4A; margin: 0; }}
.pmissing {{ color: #A9AEB4; font-style: italic; }}
.ph {{ width: 100%; height: 100%; background: #E8EAED; }}
"""

lead_cards = "\n".join(person_card(m) for m in leads)
ug_cards = "\n".join(person_card(m, show_role=False) for m in undergrads)

DOC = f"""<!doctype html>
<html><head><meta charset="utf-8"><title>AI Foundry</title><style>{CSS}</style></head>
<body>

<div class="tick"></div>
<div class="lockup">BYU MARRIOTT <span class="bar">|</span> <span class="af">AI FOUNDRY</span></div>
<div class="school">SCHOOL OF BUSINESS</div>

<h1>An AI-native product studio<br>and consultancy.</h1>
<p class="lede">We build AI products. One team works out what is worth building and then
ships it, because those are no longer two jobs.</p>

<div class="rule"></div>
<div class="eyebrow">What we do</div>
<h2>Three offerings.</h2>
<p>Engagements usually combine them. Most clients start with one and add the others as the
work proves out.</p>

<div class="cols3">
  <div>
    <h3>Full-stack applications</h3>
    <p>Net-new web and mobile applications, built end to end on a modern stack and shipped
    to production. Any language the job calls for.</p>
    <ul><li>Customer-facing products (B2C)</li>
        <li>Products you sell to other businesses (B2B)</li>
        <li>Internal tools and line-of-business systems</li></ul>
  </div>
  <div>
    <h3>AI integration and orchestration</h3>
    <p>AI wired into the systems you already run, rather than a standalone prototype that
    never reaches anyone's daily work.</p>
    <ul><li>Agents and copilots that work against your data</li>
        <li>Automations across Slack, Notion, and your existing stack</li>
        <li>Document processing, extraction, routing, and summarization</li></ul>
  </div>
  <div>
    <h3>AI enablement and training</h3>
    <p>We set your team up to build this way themselves, using the same tooling we use on
    the engagement.</p>
    <ul><li>Claude Code, Codex, and frontier agent tooling</li>
        <li>Agentic workflow and automation setup</li>
        <li>Co-working alongside your staff, then handoff</li></ul>
  </div>
</div>

<div class="eyebrow">How engagements run</div>
<h2>Find the problem, build the thing, hand it over.</h2>
<p>One fixed fee of <strong>$22,000</strong> covers all three phases across an 8-month
engagement, run as a sequence rather than a menu.</p>

<div class="phases">
  <div><div class="pnum">01</div><h3>Audit and discovery</h3>
    <p>An AI-specific audit of your business. We find where AI actually helps you: which
    products are worth building, which workflows are worth automating. The output points at
    specific things to build, with an estimate and a sequence.</p></div>
  <div><div class="pnum">02</div><h3>Build</h3>
    <p>We build and ship working software. Not a report, not a prototype. Production code,
    integrated with your systems, running in your environment.</p></div>
  <div><div class="pnum">03</div><h3>Transfer</h3>
    <p>We co-work with your people throughout the build and hand off ownership at the end.
    The capability stays in-house after we go.</p></div>
</div>

<div class="rule"></div>
<div class="eyebrow">Why us</div>
<h2>What makes this different.</h2>
<div class="why">
  <div class="k">We ship, not advise</div>
  <div>A strategy firm rarely leaves a working product behind. Every engagement ends with
  software running in your hands. That is the line between us and a traditional
  consultancy, and it is deliberate.</div>
  <div class="k">Strategy and engineering in one team</div>
  <div>The people deciding what to build are the people building it. Nothing is lost in a
  handoff between a strategy team and a delivery vendor, because there is no handoff.</div>
  <div class="k">MBB-caliber thinking, AI-accelerated pricing</div>
  <div>Led by an ex-McKinsey faculty advisor, delivered by a bench of MBAs and undergraduate
  engineers. The work meets a top-tier consulting standard at a fraction of top-tier rates.</div>
  <div class="k">We are built on the tooling we sell</div>
  <div>We run on frontier agent tooling internally. When we set up your team, we are teaching
  the workflow we use every day, not one we read about.</div>
</div>

<div class="eyebrow">At a glance</div>
<div class="glance">
  <h2 style="margin-bottom:12pt">Who we are.</h2>
  <div class="grid">
    <div><div class="lbl">What</div><div class="val">An official program of the BYU Marriott
      School of Business</div></div>
    <div><div class="lbl">Faculty advisor</div><div class="val">Scott Murff, former
      McKinsey &amp; Company</div></div>
    <div><div class="lbl">Team</div><div class="val">30 builders, in mixed teams</div></div>
    <div><div class="lbl">Engagement model</div><div class="val">$22,000 fixed fee,
      8-month engagement</div></div>
  </div>
</div>

<div class="tick" style="margin-top:20pt"></div>
<h2>Start with a conversation.</h2>
<p>The fastest way to find out whether there is something here worth building is to let us
look. Scoped small, fixed fee, and it ends with a concrete list of what to build and what it
would take.</p>
<div class="footer"><a href="https://aifoundry.byu.edu">aifoundry.byu.edu</a>
&nbsp;|&nbsp; <a href="mailto:aifoundry@byu.edu">aifoundry@byu.edu</a></div>

<!-- ================= APPENDIX ================= -->
<div class="appendix">
  <div class="eyebrow" style="margin-top:0">Appendix</div>
  <h2>The team.</h2>
  <p style="max-width:86%">AI Foundry is 30 builders working in mixed teams. MBAs cover
  product, deals, marketing, finance, and design; undergraduate builders do the engineering.
  Delivery teams are staffed from both.</p>

  <div class="eyebrow">MBA leadership</div>
  <div class="grid4">{lead_cards}</div>

  <div class="ugsec">
    <div class="eyebrow" style="margin-top:0">Undergraduate builders</div>
    <p style="max-width:86%">Undergraduate builders come from the Marriott School's strategy
    and applied AI coursework. They are staffed onto delivery teams alongside the MBAs and do
    the engineering.</p>
    <div class="grid4">{ug_cards}</div>
  </div>
</div>

</body></html>"""

out = HERE / "AI-Foundry-onepager.html"
out.write_text(DOC, encoding="utf-8")
print("wrote", out, f"({len(leads)} leads, {len(undergrads)} undergrads)")
missing = [m["name"] for m in TEAM if not m["bio"]]
if missing:
    print("MISSING BIOS:", ", ".join(missing))
