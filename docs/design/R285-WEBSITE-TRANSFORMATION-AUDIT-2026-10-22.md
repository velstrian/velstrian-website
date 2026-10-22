# Website transformation audit, 2026-10-22

Row: R285-WEB-TRANSFORMATION-AUDIT-01. Read only audit, no site code edited.
Measured on the dev server `http://localhost:8093` between 11:29 and 11:40 on 2026-10-22, tree at website `2831333d` plus uncommitted edits from the screenshot lane (`data/product-captures.ts`, `Assets/product-captures/web/answer-from-library.webp`, blog photos). Pages may have moved since.

## How this was measured, and what it cannot see

- Corpus: every template under `astro/src/pages` (38 URLs: home, bid, buy, pricing, about, resources, contact, faq, integrations, partners, sectors index and 4 sectors, compare index and 4 comparisons, tools index and 2 tools, glossary index and 2 entries, blog index and 2 posts, roadmap, changelog, sources, security, privacy, terms, accessibility, cookies, cookie-preferences, 404). Legal pages other than privacy and security were only measured, not read. Of 12 blog posts and the glossary only 2 each were walked.
- Method: Playwright Chromium at 375, 768 and 1440. Status 200 and landed URL asserted for all 38 per width (the 404 returns 404 as it should). 117 page loads. Raw data `laneC\walk.json`. Full page screenshots `laneC\*_{375,768,1440}.png`, contact sheets `*_sheet0.png`. All under `C:\Users\bhave\AppData\Local\Temp\claude\C--Users-bhave-Crowagent-Repo\74b854b9-f3a6-455c-a98f-1e91bded945e\scratchpad\laneC\`.
- Measured clean: zero horizontal overflow on all 117 loads, zero broken images, zero broken internal links (125 distinct links followed, all under 400), zero en or em dashes in rendered text, one h1 per page, no reveal blocks stuck at opacity 0 at 375 or 768 (2 on `/tools/tender-compliance-matrix/` at 1440, below the fold, see N6).
- Negative case: an overflow would show `scrollWidth > clientWidth`. A broken image would show `naturalWidth = 0` on a loaded image.
- Measurement artefact to know about: my first full page shots showed black empty frames on `/bid/` where the real screenshots are. They are lazy images that had not loaded when the shot was taken. Re-shot with `loading=eager` and they render. Not a defect.
- Not measured: Lighthouse, real contrast ratios (judged by eye on sheets), motion timing, the dev toolbar was hidden. Claims were checked against `packages/pricing/catalogue.ts` and the existing `docs/rebrand-velstrian/WEBSITE-CLAIMS-AUDIT-2026-10-21.md` (108 claims, 8 owner decisions D252). I did not repeat that audit, I checked which of its findings are still live on the site today.
- Owner decisions that are not mine are marked DECISION.

## Verdict in one paragraph

The home page and mobile layout have moved a long way: the hero is plain, the copy reads as a small firm would want, and real captures are landing (`/` and `/bid/`, plus the CVG capture on sectors, contact, and a comparison). The site is not yet top 1% because of five things: (1) `/buy/`, `/pricing/`, `/integrations/`, `/security/` and the tools have no real screen at all, (2) stock photography and AI 3D thumbnails on `/about/`, `/blog/`, `/resources/` which the owner already called cheap, (3) interior pages still frame the product as public sector only and are jargon first, against RULE 0-U, (4) a set of certification and residency claims the D250 and D252 decisions already say to change are still live, (5) a thin trust layer: no named person anywhere.

## Counts

Must fix 9, should fix 15, nice to have 7. S7 is a standing website rule (every target 44 by 44 px, `crowagent-website/CLAUDE.md` rule 7) so treat it as must if the driver wants strict reading. Taste items are labelled and kept out of the must rank.

## MUST FIX

| # | Page and section | Evidence | Fix in the site's own system |
|---|---|---|---|
| M1 | Every page, footer trust row, and `/about/` "Your data, kept safe" | Badge "Built to ISO 27001 controls" renders on all 38 pages (`components/footer/Footer.astro` via `data/footer.ts`, `components/about/AboutTrust.astro:34`). Claims audit T5 and D250: the company holds no certificate. D255 allows positive wording, so the badge text, not the idea, is the problem | DECISION D-1. Recommended: change the term to "Follows ISO/IEC 27001" (D255 wording, true, no certificate implied) and keep the detail line. Edit `data/footer.ts` and `AboutTrust.astro` only, the footer reads from the data file |
| M2 | Footer and About trust cards, plus contact form note | "EU data residency" next to roadmap text saying drafting runs on Google Gemini and Anthropic Claude (`/roadmap/` "Two models, two jobs"), and claims audit shows prompts can reach US processors. Contact says "Data residency: EU" | Two part claim, true in both directions: "Customer data is stored in the EU (Ireland). Drafting sends only the text a task needs to our AI processors." This sentence is already on `/about/`. Make the badge carry the same words, not the bare "EU data residency". Files: `data/footer.ts`, `AboutTrust.astro`, `ContactForm.astro` |
| M3 | `/buy/` all sections | `/buy/`: 0 images, 36 svgs, every screen is a drawn mock with "Example data". The page is 15,205px tall at 1440. Buy is half the product and the busy buyer is a named target | Wire real Buy captures into the same `evidenced/Frame.astro` slots. Slots: hero (evaluation of one criterion), requirement pack, supplier submissions and receipts, side by side price comparison, pre-read boundary, delivery oversight. Owned by the screenshot lane, row only here |
| M4 | `/pricing/`, `/integrations/`, `/security/`, `/tools/*`, `/faq/` | 0 real screens. Pricing: plan cards only. Integrations: 20 svgs, no screen of the connect flow. Tools: no output shown | Slots to add: pricing (credit meter screen), integrations (connect SharePoint screen, webhook rule), tools (a result of the Tender Finder and the matrix with a real notice), security (the settings page for single sign-on and the audit log). Slots only |
| M5 | `/about/` "Built by engineers who read the rules" | A staged stock photo of two people at a desk (`laneC\_about__1440_sheet0.png`, second panel). Owner 2026-10-21: stock photos looked cheap. It also says "Built by engineers" over a photo of two non-identified people, which reads as a claim about the team | Remove. Replace with real named founders and a real photo of them (DECISION D-2) or no image. The section works as text plus the company card |
| M6 | `/blog/` index and `/resources/` hub | 12 blog thumbnails are generic stock (a calendar with pins, an abacus, office scenes, Parliament). `/resources/` cards use four AI 3D renders (isometric grid, glass cards, open book, bar chart) that say nothing about the article. Same family the owner rejected | Either type led covers built from the design system (title plus a real figure or screen crop) or remove thumbnails and use the index as a clean list. Recommended: a type led cover component fed by the front matter, in `components/blog/PostImage.astro`. Files: `components/blog/PostImage.astro`, `pages/blog/index.astro`, `components/resources/ResourcesGrid.astro`, `Assets/blog-photos` references in `content/blog/*.md` front matter |
| M7 | Sector pages (`/sectors/construction/`, `education/`, `facilities/`, `highways/`) | Hero "Stronger bids for public works." and the body is public sector only: "Public works", CPV code, frameworks, PPN 017, TOMs, "Two forces make these bids harder" in a 130 word paragraph (`content/sectors/*.md`). RULE 0-U: public and private named, jargon explained first time, one idea per section | Rewrite hero and the first section per sector in plain words, name private clients (a housing association, a retailer, a facility owner), move the statute detail into a collapsed "For when you need it" block as `/bid/` already does. Files: `content/sectors/*.md` (4) |
| M8 | `/compare/*` hero and body | "Velstrian Bid is a UK bid and tender management suite for public-sector suppliers" (`content/compare/bid-vs-autogenai.md`), "Best for: UK SMEs and public-sector suppliers" | Say "public and private" as the home page does. Competitor cells "Not stated publicly" are fine and sourced, keep them. Files: `content/compare/*.md` (4), `layouts/Compare.astro` only if labels live there |
| M9 | `/` "It will not make things up." and `/bid/` same block | Absolute sentence on the headline of a section. Owner rule: never state AI accuracy. The body is accurate (it shows proof or says it has none) but the headline reads as a guarantee | DECISION D-3. Recommended headline: "Every claim shows its proof, or says it has none." Files: `components/home2/*` (the Proof section) and `components/bid/*` |

## SHOULD FIX

| # | Page and section | Evidence | Fix |
|---|---|---|---|
| S1 | `/` and `/bid/` hero | The hero slab shows a drawn mock ("Example data") while the real captures sit lower. Strong, but the first screen a buyer sees is the weakest proof | Swap the hero Frame to the real answer screen once the capture lane has one cleared of customer data. Slot: hero. Files: `components/home2/*`, `data/product-captures.ts` (other lane owns) |
| S2 | `/bid/` and `/buy/` page length | `/bid/` 15,285px and 2,564 words at 1440, 21,977px at 375. The "detail" block (Procurement Act 2023 section 52 and 71, PPN 026, PPN 017, seven rubric rows, "Everything Velstrian Bid does today") is correctly labelled "for when you need it" but is still a wall at 375 | Keep every item (no scope cut). Collapse each of the four cards and the rubric table behind one tap each. File: `components/bid/BidDetail.astro`, `components/buy/BuyDetail*.astro` |
| S3 | `/pricing/` hero | Eyebrow, headline, then a monthly or annual toggle that is a tiny dot at 12px beside text (`_pricing__1440_sheet0.png`). Headline repeats the home hero, so the page opens without saying "pricing" in large type | Headline "Simple prices, shown up front." Make the toggle a 44px segmented control. File: `components/pricing/*` |
| S4 | Interior hero gradient strip | On `/contact/`, `/integrations/`, `/tools/*`, `/about/`, blog and compare the thin blue strip under the hero touches the next section or card with no pad (cards sit on the strip on `/contact/`, heading touches it on `/integrations/`). Home aurora is fine | Add the pad token under the strip, or use the same aurora slab. File: `components/evidenced/PageHero.astro` and its CSS in `styles/evidenced.css` |
| S5 | `/resources/` hero | Large empty band left of the paragraph, headline "The rules, explained for UK teams." is public only and jargon, the closing CTA says "find UK public-sector tenders" | "Plain guides to bidding, public or private." CTA matches home. Files: `components/resources/ResourcesHero.astro`, `pages/resources.astro` |
| S6 | `/about/` credibility | Company card exists (Velstrian Systems Ltd, 17076461, founded March 2026) but no named person, no photo, no address ("Registered office: details in our Privacy Policy"). "Written and won public sector bids from 2010" is unverifiable (claims audit decision 8) | DECISION D-2. Named founders with roles and a link, registered office on the card |
| S7 | Footer link and small controls | Footer links are 26px high, social icons 36px, "Status" and "Cookie preferences" 24px, header logo 32px (measured, `q.cjs` on `/bid/`, same on all pages at 1440). Under the 44px target | Pad link rows to 44px hit area without changing look. File: `components/footer/Footer.astro` styles |
| S8 | Contact | `hello@`, `support@`, `sales@`, `security@velstrian.com` shown, while the identity rule names `contact@velstrian.com` and `lib/brand-names.ts:77` holds it. Reply time "three to five business days" is slow against "top 1%". Calendly URL slug is `crowagent-platform/30min`, an old brand name in a visitor link | DECISION D-4: which mailboxes exist. Recommended: show `contact@` plus the existing role boxes only if they are monitored. Move Calendly to a Velstrian slug. Files: `pages/contact.astro`, `components/forms/*`, `data/site.ts` |
| S9 | `/roadmap/` | Jargon heavy for the target reader ("Passkeys (WebAuthn)", "SCIM", "Enterprise OIDC connectors", Phase 1 `Q2 2026`). "We won't build" box fine. Names Gemini and Claude, which is good for honesty but sits beside the residency badge (M2) | Lead each phase with a one line plain sentence, keep the detail. File: `data/roadmap.ts` |
| S10 | `/integrations/` | 1,090 words, no real screen, written for an IT administrator (SAML, SCIM, webhooks) | Open with "Sign in with your work account, read your documents where they live" and one real screen, push the admin detail into collapses. Files: `pages/integrations.astro`, `data/integrations.ts` |
| S11 | `/sources/`, `/changelog/`, `/security/` | Text only, 11,000px at 375 for sources and security. Rater view: fine for E-E-A-T, weak for a first time reader | A three line plain summary at the top of each. Files: those pages |
| S12 | Defensive disclaimers (D255) | Sector pages and `/bid/` carry "These checks are advisory and are not legal advice", "Not stated publicly". D255 asks for positive wording | Keep the one accurate scope line on `/security/` and `/bid/`, drop the repeats per sector. Files: `content/sectors/*.md` (same batch as M7) |
| S13 | Claims still live from the 2026-10-21 audit | `ProofGate.astro:94` "reads both UK registers" while four sources are live (D252 decision 1). Check `data/site-facts.json` rules already cover it, the badge in M1 is the same family | Replace with "reads the official UK and EU listing sites". File: `components/sections/ProofGate.astro` |
| S14 | Compare pages | Long (7,800px, 1,500 words) and text led. The comparison table is good, the rest repeats it | Lead with the table, collapse the narrative. File: `layouts/Compare.astro` |
| S15 | `/bid/` and `/buy/` intro copy | The word "councils" appears in reader facing intro text (`components/bid/BidWhatItDoes.astro:63`, `components/buy/BuyHero.astro:29`, 8 files in `astro/src`). The website rule says never "council" as a product label, here it is a buyer example next to schools, housing associations and companies, so I judge it allowed. DECISION D-6: confirm it is an example and not the banned label. | none unless the owner says so |

## NICE TO HAVE

| # | Item |
|---|---|
| N1 | Home: a quiet "who runs this" strip near the pricing (company, founded, contact) for E-E-A-T. Files: `components/home2/*` |
| N2 | Glossary entries and 404 are clean. Add related links at the foot of glossary entries. `layouts/Glossary.astro` |
| N3 | 404: good. Add the two top links as buttons. `pages/404.astro` |
| N4 | Tender Finder form is clean but flat, add a real result screen below it (slot only). |
| N5 | A second screenshot carousel caption could name the product area (Find, Decide, Answer, Check, Track) as chips. |
| N6 | Two reveal blocks on `/tools/tender-compliance-matrix/` at 1440 stay below 0.1 opacity until scrolled, harmless, confirm they fire on scroll in the browser. |
| N7 | Newsletter box repeated on contact and footer-like places. Keep one. |

## Taste, not defects

Section rhythm on `/bid/` (alternating light and dark bands), the three card plan rows, the purple gradient frames behind screenshots. They are consistent and on system. I would not spend a lane on them.

## RULE 0-U read, per page, first time user from a 10 person firm

- `/` passes: one idea per section, public and private named, jargon limited to a footnote. Fix M9 and S1 only.
- `/bid/` passes the top and fails the bottom (S2).
- `/buy/` copy passes, screens fail (M3).
- `/pricing/` passes on numbers (all match `packages/pricing/catalogue.ts` lines 646 to 648: 1/5/10 seats, 200/750/3,000 credits, 3/10/25 guests, trial 7 days 30 credits). Fails on the toggle (S3).
- `/sectors/*` `/compare/*` `/roadmap/` `/integrations/` fail (M7, M8, S9, S10).
- `/about/` `/contact/` pass on tone, fail on E-E-A-T (M5, S6, S8).

## Google rater style read

Purpose clear on 34 of 38 pages. Main content real, no thin or spam pages found (lowest main text word count: `/faq/` 203, `/404` 103). E-E-A-T gaps: no named people, "won bids since 2010" unsourced, no customer evidence yet (correct, none exist, do not invent). Reputation signals present: Companies House link (`find-and-update.company-information.service.gov.uk/company/17076461`), ICO registration, status page. Titles and descriptions are present on all 38 (see `walk.json`).

## Decision list for the owner

- D-1 Footer and About badge wording. Options: (a) "Follows ISO/IEC 27001" (recommended), (b) remove the badge, (c) keep as is.
- D-2 Named founders and photo on About, and whether the 2010 bid history stays. Recommended: name them with a real photo, keep history only if each line is true and sourceable.
- D-3 Headline "It will not make things up." Recommended: "Every claim shows its proof, or says it has none."
- D-4 Which public mailboxes are real and monitored, and the Calendly slug. Recommended: `contact@` as the single public address.
- D-5 Blog and resources imagery. Recommended: type led generated covers, no photography.

## Non overlapping build batches (by file)

Run as parallel lanes. No file appears in two batches. The screenshot lane keeps `data/product-captures.ts`, `evidenced/Frame.astro`, `Assets/product-captures/**`.

| Batch | Scope | Files |
|---|---|---|
| WT-A trust and claims wording | M1, M2, S13, M9 headline in the Proof blocks | `data/footer.ts`, `components/footer/Footer.astro` (text only), `components/about/AboutTrust.astro`, `components/forms/ContactForm.astro`, `components/sections/ProofGate.astro`, `components/home2/Proof2.astro`, `data/site-facts.json` |
| WT-B sectors and compare plain words, public and private | M7, M8, S12, S14 | `content/sectors/*.md`, `content/compare/*.md`, `layouts/Compare.astro`, `layouts/Sector.astro` |
| WT-C about and contact trust | M5, S6, S8 | `components/about/*` except `AboutTrust.astro`, `pages/about.astro`, `pages/contact.astro`, `data/site.ts` |
| WT-D imagery for blog and resources | M6, S5 | `components/blog/PostImage.astro`, `pages/blog/index.astro`, `components/resources/*`, `pages/resources.astro`, `layouts/Article.astro` |
| WT-E bid and buy page weight and slots | S2, M3 slots (hosting only, not the captures) | `components/bid/*`, `components/buy/*`, `pages/bid.astro`, `pages/buy.astro` |
| WT-F pricing, hero strip, tap targets | S3, S4, S7 | `components/pricing/*`, `pages/pricing.astro`, `components/evidenced/PageHero.astro`, `styles/evidenced.css`, footer CSS in `components/footer/Footer.astro` is a conflict with WT-A so WT-F takes only the `<style>` block and WT-A only the markup: run WT-A first, then WT-F |
| WT-G roadmap, integrations, sources, changelog plain summaries | S9, S10, S11 | `data/roadmap.ts`, `data/integrations.ts`, `pages/integrations.astro`, `pages/roadmap.astro`, `pages/sources.astro`, `pages/changelog.astro`, `content/legal/security.md` |
| Screens (not a build batch here) | M3, M4, S1, N4 slots per page listed above | owned by the screenshot lane |

Cost note (RULE 0-G): none of this schedules or deploys anything. Each batch is local edits verified with the site gates, one push needs separate owner approval.
