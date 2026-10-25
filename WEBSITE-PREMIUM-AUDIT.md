# Velstrian website: top 1% premium UI and UX audit

Started 2026-10-25. Auditor: Kiro. Scope: the marketing site only
(`crowagent-website/astro`), judged on the live dev server at http://localhost:8093
at 1440 desktop, 768 tablet and 390 mobile.

This is a findings and proposals document. No source is changed on the strength of
this file alone. Every proposal is written to stay inside the existing token system
(`astro/src/styles/tokens.css`, `brand.source.json`) and to pass the gate chain
(`scripts/run-gates.mjs`). Where a proposal touches a recorded owner decision it says so
and is held for sign off rather than applied.

Severity key:
- P0 broken or off brand enough to undermine the premium claim on a money page.
- P1 a clear quality gap a discerning visitor would notice.
- P2 a refinement that lifts polish.
- P3 a nice to have or a thing to confirm is intentional.

Status key: OPEN (found, not actioned) | PROPOSED (fix drafted, awaiting sign off) |
APPLIED (change made and verified on the built site) | REFUTED (measured on the page, the
claim does not hold, no change made for it) | HELD (conflicts with a recorded owner decision,
put to the owner as a question).

---

## How this audit was run

- Browser: playwright-cli driving the pre existing session `kc-ad97fd0e`. `goto` works,
  `open` is blocked by a localhost approval that does not surface. Scrolling via
  `eval "() => window.scrollTo(...)"`, then `screenshot` of the viewport. Full page
  screenshots exceed the image decoder limit, so pages are read fold by fold.
- Viewports: 1440x900 desktop first, then 768 and 390 for the money pages.

## Routes in scope (about 48)

Static: `/`, `/about`, `/ai`, `/bid`, `/buy`, `/pricing`, `/partners`, `/contact`,
`/faq`, `/integrations`, `/roadmap`, `/changelog`, `/resources`, `/sources`,
`/walkthrough`, `/cookie-preferences`, `/404`, `/blog`, `/compare`, `/glossary`,
`/sectors`, `/tools`, `/tools/tender-compliance-matrix`, `/tools/tender-finder`.

Collections (one template each, representative entry audited then spot checked):
blog (13 posts), compare (4), glossary (2), sectors (4), legal (5).

---

## Global findings

_(accumulated as the walk proceeds)_

---

## Per page findings

### `/` home
_(in progress)_

**Premium already**
- Confident two line hero, black then Iris gradient second line. Strong, modern.
- Clear primary / secondary / tertiary action hierarchy under the hero.
- Angled Iris wedge into a layered product demo card. Good premium device.
- Write / Find / Decide bento with realistic in product mockups on gradient art panels.

**Findings**

| ID | Sev | Status | Finding |
|---|---|---|---|
| H-01 | P1 | APPLIED | Product mockups clipped mid word on the right edge. Seen on `/` (Write/Find/Decide bento) and `/buy` (the "Cleaning and building maintenance" panel, "Guide for this p..." cut). RECURRING, so this is how the demo panels size within their container, not a one off. On a top 1% site a demo panel should fit cleanly or bleed full width with intent, never cut mid word. |
| H-02 | P3 | REFUTED | Faint grid texture sits behind the very top of the hero under the nav. Confirm it is an intentional backdrop and not a stray background at the wrong z or opacity. |
| H-03 | P3 | APPLIED | A floating pause control sits top right above the fold with no visible animated context yet. Confirm its target is obvious to a first time visitor, or tie it visually to the thing it pauses. |
| H-04 | P3 | APPLIED | "See the screens you will use" device panel: the blurred owner email on a demo row looks slightly rough. Minor, consider a cleaner redaction (solid token tinted bar) for a crisper premium read. |

**Also strong (no action)**
- "See the screens you will use" full product shot in an Iris device frame is contained cleanly, no clipping. Good contrast with H-01.
- Pricing teaser is textbook restraint: three tiers, only the Pro card carries the gradient rim + Recommended pill + gradient CTA, the rest plain white on a subtle grey surface. This is the Stripe style the owner asked for, done well.

**Verdict:** the home page is already near the premium bar. Findings are refinements (H-01 is the only one a visitor would notice), not rescues.

---

### `/ai`
On system: same hero (eyebrow + black/Iris headline + Iris wedge), two product cards (Bid Iris pen, Buy teal checklist). Clean.
- Confirms H-02 (grid backdrop) and H-03 (pause control) are intentional site wide patterns, not stray. H-02 can close as "intentional".

### `/pricing`
On system, clean. Monthly/Annual billing toggle present (good). Three tiers, Pro carries the rim + Recommended pill.
| ID | Sev | Status | Finding |
|---|---|---|---|
| PR-01 | P3 | REFUTED | Button treatment drifts: pricing hero CTA is flat Iris solid, home hero CTA is a richer gradient fill, and the Pro card CTA is gradient. Pick one "primary CTA" fill and apply it consistently so the eye reads one button language across pages. |

### `/bid`
Strong. The big product composition (full Velstrian Bid app view under floating status cards, bleeding off left and bottom with intent) is the premium device done RIGHT, contained, no clip. This proves H-01 is a defect not the norm.

### `/buy`
On system. Product panel at the foot clipped on the right again ("Guide for this p..." cut) = H-01 recurrence.
| ID | Sev | Status | Finding |
|---|---|---|---|
| BY-01 | P3 | APPLIED | Headline gradient split lands mid phrase ("...and **compare what suppliers can back up**") where home/bid/ai/pricing split cleanly at a line or clause. Re-balance the colour break to a clause boundary so it reads deliberate. |

---

### `/about`
Distinct and strong: four persona pills (write / sign off / score / deliver), Companies House trust line. On system.

### `/faq`
All black headline (correct for lookup context), breadcrumb, search box with helpful placeholder, categorised sections. Good discipline.

### `/blog` index
All black headline (content context). Featured post uses the one allowed `--ea-card--wash` with a real image.
| ID | Sev | Status | Finding |
|---|---|---|---|
| BL-01 | P3 | HELD | Featured image is generic stock style (pinned calendar). A top 1% brand reads better with bespoke or on brand art. Content quality, not a code defect. |

### `/compare` index
Honest positioning ("we concede the points where Velstrian Bid is not the strongest"). On system.

### `/glossary` index
Excellent: the "Statutory spotlight" feature card uses a bespoke Iris-to-cyan gradient art panel with flowing line art. This is the quality bar to replicate elsewhere.

### `/sectors` index
On system.
| ID | Sev | Status | Finding |
|---|---|---|---|
| SE-01 | P2 | REFUTED | Copy says "Nine UK sectors" but the content collection holds 4 sector files (construction, education, facilities, highways). Confirm the count: either the prose overstates, or sectors render from a source the audit did not see. A wrong count on a premium site erodes trust. |

### `/integrations`
Same bespoke gradient art feature card as glossary. Consistent, premium.

### `/roadmap`
Last updated date stamp, changelog link, vertical timeline with Iris phase nodes and a LIVE NOW pill. Honest, dependable. Good.

### `/tools`
Topic pills, two clear tool CTAs, "No account, no email gate" trust signal. On system.

### `/contact`
Three card contact layout (call / portfolio / email), plain white cards per lookup rule. `contact@velstrian.com` confirms the rebrand domain. Good.

---

## Mobile (390) findings

### `/` home at 390
Mostly well handled: hamburger, full width gradient CTA, stacked actions, product card scales down.
| ID | Sev | Status | Finding |
|---|---|---|---|
| M-01 | P1 | APPLIED | The floating pause control COLLIDES with the H1 at 390. It sits directly over the end of "Write strong bids" (overlaps "ds"). A floating control must never overlap the headline. Move it clear of the H1 on small viewports, or dock it to the animated region. |
| M-02 | P3 | APPLIED | Hero headline wraps to four lines with the gradient starting mid line ("bids yourself, **using what you already have**"). Expected on mobile but a clause aligned break would read more deliberate. Low priority. |

---

## Prioritised fix backlog

Ordered by impact on the top 1% premium claim. Each is written to stay inside the token
system and the gate chain. None touch a recorded owner decision without a note.

**P1, fix first (a discerning visitor notices these)**
1. **M-01** Pause control overlaps the H1 on mobile (`/` at 390). Reposition clear of the
   headline on small viewports, or dock it to the animated region. Likely a one rule change
   in the hero's control positioning, must respect the reduced motion contract.
2. **H-01** Product demo panels clipped mid word on the right edge, recurring on `/` and
   `/buy`. Either constrain the panel to its container or make the bleed full width and
   deliberate, matching the clean `/bid` composition which already does this right.

**P2, polish**
3. **SE-01** "Nine UK sectors" vs 4 sector files. Confirm and correct the count.
4. **PR-01** Unify the primary CTA fill (gradient vs flat Iris) so one button language reads
   across all pages. Define it once as a token backed button variant.

**P3, confirm or nice to have**
5. **BY-01** Re balance the `/buy` headline gradient break to a clause boundary.
6. **M-02** Clause aligned hero wrap on mobile.
7. **H-04** Cleaner redaction bar for the demo email on `/`.
8. **BL-01** Replace stock featured image with on brand art.
9. **H-02 CLOSED** The hero grid backdrop is an intentional site wide pattern (seen on every
   hero), not a stray background.
10. **H-03** Confirm the pause control's target is obvious to a first time visitor.

## Global findings (site wide)

**Strengths (keep and replicate)**
- One coherent hero system across every page: eyebrow, black + Iris gradient headline, Iris
  wedge divider, consistent action hierarchy.
- Disciplined card system: plain white in lookup/content contexts, one tinted or gradient art
  feature card per page, the Stripe style restraint the owner asked for.
- Bespoke Iris-to-cyan gradient art panels (glossary, integrations) are a genuine premium
  signature. This is the bar to hold everywhere.
- Excellent mobile nav: command search, clean accordions, pinned actions, clear close.
- Clean, accessible markup (aria-expanded, aria-controls, labelled controls, dedicated close).
- Honest, trustworthy copy (concede weak points, cite sources, no unverifiable claims), which
  itself reads premium in this category.

**Opportunities to push from top tier to top 1% (all token safe)**
- G-1 Motion: the system is calm and correct (hover lift + spotlight, reduced motion
  respected). A top 1% lift is tasteful SCROLL REVEAL on section entry (fade + 8-12px rise,
  staggered, one shot, reduced motion disables it). Check `motion.css` and `check-motion.js`
  first, there may already be a reveal primitive to extend rather than add.
- G-2 Consistent "one hero control" and "one primary CTA" language (ties PR-01, H-03, M-01).
- G-3 Make every product demo panel a first class contained or full bleed composition like
  `/bid` (ties H-01), so no page shows an accidental clip.
- G-4 Bespoke art everywhere a feature card carries an image (ties BL-01), retire stock.

## Verdict

The site is already a strong, system governed, premium marketing site, clearly top tier. The
gap to a defensible top 1% is small and specific: fix the two P1 issues (mobile H1 collision,
demo panel clipping), unify the CTA and hero control language, correct the sectors count, and
add one restrained scroll reveal. None of this requires leaving the token system or weakening
a gate. Recommend doing the two P1 fixes first on a `review/*` branch, verifying on the built
site with `cd astro && npm run build`, before touching anything cosmetic.

## Not yet audited (confirmatory, same templates)

Dynamic entries reuse templates already audited: a blog article (Article.astro), a compare
page (Compare.astro), a glossary term (Glossary.astro), a sector page (Sector.astro), the five
legal pages (Legal.astro), `/partners`, `/resources`, `/changelog`, `/sources`,
`/walkthrough`, `/cookie-preferences`, `/404`. Tablet (768) on all pages. These should be spot
checked but are unlikely to change the verdict.

---

## Lane X verification and fixes (2026-10-25)

Every finding was measured on the page before anything changed (Playwright, status 200 and
the landed URL asserted per route). Screenshots: `audit-screenshots/kiro-premium-2026-10-25/`
(`before/`, `after/`, `spot/`). Board rows are listed in the website board.

| ID | Measured verdict | What changed |
|---|---|---|
| M-01, H-03, G-2 (control) | TRUE, and wider than reported. The pause control overlapped a heading on 22 of 60 route and width pairs: the H1 on `/`, `/bid/`, `/buy/`, `/about/` at every width from 1024 down to 360, and the `/pricing/` label at 390 and 360. | The control now docks on the moving colour it pauses: bottom right on the stage aurora, and just above the right end of the ribbon on a page hero. The hero bottom padding holds it (`--ea-hero-pad-b` floor, page hero and compact hero padding). Re-measured: 0 overlaps on 30 routes at 1440, 1024, 768, 600, 390 and 360, and on top of everything at its centre. Still 44 by 44, hidden until the script shows it, gone under reduced motion. |
| H-01, G-3 | TRUE. Captures cut mid word on the right in every bento tile on `/`, `/bid/` and `/buy/` (7 to 66 percent of the capture width cropped), up to 33 percent off the foot on `/buy/`, and the find card crop on `/contact/` and `/walkthrough/` at 390 stopped on "Scotland ·", "publishe" and "Save". | One token, `--shot-fade`, and one device: where a screen runs off its tile or its crop it fades out over that length, so the window still bleeds with intent and no word is cut. Bento shots fade on every edge they bleed off. Frame crops and walkthrough regions fade only when the region ends inside the capture (computed from the crop numbers), which replaces a hand set flag on three regions. |
| SE-01 | REFUTED. `/sectors/` renders nine sector cards (four link to their own sector page, five to `/bid/`), so "Nine UK sectors" was true. | The count is now read from the card list, so it cannot drift, and the lead says four have a page of their own. |
| PR-01, G-2 (CTA) | REFUTED. Every primary CTA on `/`, `/pricing/`, `/bid/`, `/buy/`, `/about/`, `/contact/`, `/blog/`, `/faq/` and `/tools/`, nav included, computes to the same fill, `--btn-p-fill`, already defined once in tokens.css and read by both button families. The white primary is the deliberate inverse on the closing gradient band. | None. |
| BY-01, M-02 | TRUE. `/buy/` and `/bid/` started the colour after "and" and "then", and at 390 the home, `/bid/` and `/about/` colour began mid line. | The colour phrase on `/bid/` and `/buy/` now starts after the comma. On a phone the phrase is its own balanced block, so colour and line change together with no one word widow. Re-measured on seven heroes at 1440, 768, 390 and 360. |
| H-04 | TRUE. The bid list capture carried six blurred email runs in the owner column. | Six solid rounded bars in a tint read from tokens.css (`--c-ink-2` at 24 percent over `--c-light-3`), painted by `astro/scripts/redact-capture-emails.mjs`. The capture harness in crowagent-platform still blurs, so a recapture needs this script run again until the harness paints a bar itself. |
| BL-01, G-4 | HELD. Owner direction D305 (2026-10-23, later than the RULE 0-U note of 2026-10-21) keeps the licensed photographs on the 12 existing posts and the faces on Audience and Sector pages, with designed covers for new posts only. Retiring them reverses a recorded owner decision. | None. Put to the owner as a question. |
| G-1 | REFUTED as missing. The reveal exists (`[data-reveal]`, scripts/evidenced.ts initReveal): 36 of 36 items on `/`, 29 on `/buy/` and 18 on `/pricing/` settle in once on scroll, none arm under reduced motion. The proposed 8 to 12px rise was tried before and the owner could not see it (R285-WEB-SCROLL-MOTION-01, 2026-10-22), which is why the token is 24px. | None. |
| H-02 | Confirmed intentional. The grid is `.ea-hero__sky::before` (R285-WEB-HERO-BACKDROP-02), drawn on every hero. | None. |
| Not yet audited | Spot checked at 1440, 768 and 390: a blog post, a compare page, a glossary term, a sector page, privacy and terms, `/partners/`, `/resources/`, `/changelog/`, `/sources/`, `/walkthrough/`, `/cookie-preferences/`, `/404`, both tools, `/integrations/`, `/roadmap/`. The only text cut found is inside deliberate horizontal scrollers (the integrations rail, the compare, privacy, terms and sources tables). The pause control overlaps nothing on any of them. | Covered by the M-01 and H-01 changes. |
