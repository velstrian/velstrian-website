# R285-WEB-REAL-SCREENSHOTS-01: real product screens on the website

Owner, 2026-10-22: "we must use real product screenshots", "start real product screenshots work".
RULE 0-U: show, do not explain. Real screens of Velstrian Bid and Velstrian Buy wherever the site
shows the product, with honest framing ("A real screen from a demo account").

Status on 2026-10-22: harness built and run on staging. 8 of 35 slots now show a real LIGHT capture.
The other 27 keep their drawn recreation and its "Example data" caption until a real screen exists.

## 1. How a slot works

Every product picture on the site is a `Frame` or an `AppWindow` naming a key
(`data-capture="..."`). `astro/src/data/product-captures.ts` resolves each key:

1. an entry in `astro/src/data/product-captures.real.json` (written by the harness) wins,
2. otherwise the slot renders its drawn HTML recreation with an "Example data." caption.

A real entry carries the served WebP, its CSS size, alt, caption and, for a wide card, a `wide`
and a `phone` crop region that `Frame.astro` applies to the one file. A recapture is a harness run
and nothing else. No drawn recreation has been deleted: each stays as the fallback for its slot.

## 2. Inventory: every place the site depicts the product

Measured by reading every `capture=` attribute and every `ProductScreen` use in `astro/src`, then
checking which page imports each component. "Route" is the platform screen that shows the same
thing, verified to exist under `crowagent-platform/web/app/(dashboard)/`.

| # | Page and section | Slot key | Shows today | Should show | Platform route and state | Screen exists | Real capture |
|---|---|---|---|---|---|---|---|
| 1 | `/` hero stage | `home-hero-answer` | drawn answer with cited sources | an answer with each claim linked to its document | `/bid/contracts/[id]/questions`, Sources tab | yes | waits on R285-BID-ANSWER-SOURCES-01 (source chip cites the tender, not the library) |
| 2 | `/` who it is for, small firm tab | `home-who-small` | drawn list of 3 contracts | the morning feed, several cards | `/bid/opportunities` | yes | not yet, needs a three card slot in the harness |
| 3 | `/` who it is for, team tab | `home-who-team` | drawn "who is doing what" | question owners and progress | `/bid/contracts/[id]/questions` (AssignmentControl, ReadyToReviewPanel) | yes | waits on seed 02 |
| 4 | `/` who it is for, buyer tab | `home-who-buyer` | drawn supplier reply with proof | an evaluation with located evidence | `/buyer/evaluations/[id]` | yes | waits on seed 02 |
| 5 | `/` and `/bid/` capabilities, Find | `home-cap-find` | **real** feed card | one contract in the feed | `/bid/opportunities` | yes | **captured** `find-feed-card.webp` |
| 6 | `/` capabilities, Decide | `home-cap-decide` | drawn fit score | bid or no bid fit | `/bid/contracts/[id]/overview` | yes | refused by the harness: the demo has no track record, so the fit reads weak with a red Pass (D256). Waits on seed 02 |
| 7 | `/` capabilities, Answer | `home-cap-answer` | **real** question list | the questions, each drafted | `/bid/contracts/[id]/questions` | yes | **captured** `answer-question-list.webp` |
| 8 | `/` capabilities, Check | `home-cap-check` | drawn comments | comments on one question | `/bid/contracts/[id]/questions` (CommentThread) | yes | waits on seed 02 |
| 9 | `/` capabilities, Deliver | `home-cap-deliver` | drawn promises checklist | promises with proof and dates | `/bid/contracts/[id]/delivery` | yes | waits on a won bid with commitments (section 3) |
| 10 | `/` and `/bid/` refusal section | `home-refusal-check` | drawn claim check | claim backing against the evidence vault | `/bid/contracts/[id]/questions`, Check claims against evidence | yes | not yet, needs a harness slot after looking at the result panel |
| 11 | `/` and `/bid/` carousel, slide 1 | `home-car-board` | drawn bid list | the bid list | `/bid` | yes | waits on seed 02 and the staging promote (whole screen, rail marks) |
| 12 | carousel, slide 2 | `home-car-answer` | **real** answer | a drafted answer | `/bid/contracts/[id]/questions`, question 1 | yes | **captured** `answer-from-library.webp` |
| 13 | carousel, slide 3 | `home-car-refusal` | **real** refusal | no figure invented | `/bid/contracts/[id]/questions`, question 6 | yes | **captured** `refusal-no-source.webp` |
| 14 | carousel, slide 4 | `home-car-deliver` | drawn delivery | delivery checklist | `/bid/contracts/[id]/delivery` | yes | waits on a won bid with commitments |
| 15 | `/contact/` what you see on the call | `contact-call-find` | **real** feed card | one contract in the feed | `/bid/opportunities` | yes | **captured** |
| 16 | `/compare/`, `/compare/bid-vs-mytender-io/`, `/sectors/construction/` | `screen-find` | **real** feed card | the feed | `/bid/opportunities` | yes | **captured** |
| 17 | `/compare/bid-vs-autogenai/` | `screen-answer-list` | **real** question list | the questions | `/bid/contracts/[id]/questions` | yes | **captured** |
| 18 | `/compare/bid-vs-swiftbid/`, `/sectors/education/` | `screen-answer-library` | **real** answer | a drafted answer | `/bid/contracts/[id]/questions` | yes | **captured** |
| 19 | `/compare/bid-vs-cleantender/`, `/sectors/facilities/` | `screen-evidence` | drawn proof for each promise | delivery evidence | `/bid/contracts/[id]/delivery#evidence` | yes | waits on a won bid with commitments |
| 20 | (ProductScreen option, no page uses it today) | `screen-buyer-requirement` | drawn | requirement pack | `/buyer/requirements/[id]` | yes | waits on seed 02 |
| 21 | `/sectors/highways/` | `screen-buyer-delivery` | drawn supplier promises | what suppliers promised after award | `/buyer/suppliers/[id]/commitments`, `/buyer/value-tracker` | yes | waits on buyer award data (section 3) |
| 22 | `/sectors/` | `screen-insights` | drawn bids at a glance | insights | `/bid/analytics` | yes | waits on seed 02 |
| 23 | `/partners/` | `screen-action-centre` | drawn due this week | action centre | `/actions` | yes | waits on seed 02 |
| 24 | `/about/` hero | `about-hero` | drawn four role view | one response seen by four roles | none: a composite of four screens | **no single screen** | recommendation for the owner: keep the drawing, or replace it with the answer capture. Question, not a decision |
| 25 | `/bid/` hero | `bid-hero` | drawn tender with questions | the questions screen | `/bid/contracts/[id]/questions` | yes | capture exists (`answer-question-list`) but a tall narrow list in the hero stage needs a design look first, so it is not wired |
| 26 | `/bid/` what it does, Find | `home-cap-find` (shared) | **real** | | | yes | **captured** (same slot as 5) |
| 27 | `/bid/` what it does, Decide | `bid-decide` | drawn | fit | `/bid/contracts/[id]/overview` | yes | as 6 |
| 28 | `/bid/` what it does, Answer | `home-car-answer` (shared) | **real** | | | yes | **captured** (same slot as 12) |
| 29 | `/bid/` what it does, Check | `bid-check` | drawn | comments | as 8 | yes | waits on seed 02 |
| 30 | `/bid/` what it does, Deliver | `bid-deliver` | drawn | delivery | as 9 | yes | waits on a won bid with commitments |
| 31 | `/buy/` hero | `buy-hero` | drawn criterion evaluation | an evaluation | `/buyer/evaluations/[id]` | yes | waits on seed 02 |
| 32 | `/buy/` boundary | `buy-boundary-gate` | drawn pre read limits | the pre read refusing to set a mark | `/buyer/evaluations/[id]` (PrereadPanel, CriterionCard) | yes | waits on supplier submissions in the evaluation, then a harness slot |
| 33 | `/buy/` what it does, request | `buy-cap-request` | drawn requirement pack | requirement pack | `/buyer/requirements/[id]` | yes | waits on seed 02 |
| 34 | `/buy/` what it does, collect | `buy-cap-collect` | drawn submissions and clarifications | submissions and the clarification register | `/buyer/evaluations/[id]` tabs, `/buyer/requirements/[id]` | yes | waits on supplier submissions, then a harness slot |
| 35 | `/buy/` what it does, compare | `buy-cap-compare` | drawn whole life costs | whole life cost comparison | `/buyer/whole-life-costs/[id]` | yes | waits on bid figures, then a harness slot |
| 36 | `/buy/` what it does, evidence | `buy-cap-evidence` | drawn located quotes | pre read evidence | `/buyer/evaluations/[id]` | yes | waits on seed 02 and submissions |
| 37 | `/buy/` what it does, after award | `buy-cap-decision` | drawn post award oversight | promised social value tracked | `/buyer/value-tracker`, `/buyer/suppliers/[id]/commitments` | yes | waits on buyer award data |

35 distinct slot keys (rows 26 and 28 reuse keys). 8 keys show a real capture now. 34 of the 35
have a real platform screen today, `about-hero` is the one composite with no single screen.

Pages checked that depict no product: `/pricing/`, `/resources/` (its cards are abstract glass
illustrations, `Assets/images/r285-gemini/card-*`), `/integrations/`, `/faq/`, `/tools/`, the
Tender Compliance Matrix tool (it is the tool itself, not a picture of the product), the blog cards
(photographs in `Assets/blog-photos/`) and the OG cards (`scripts/generate-og-images.js`, title
cards). None needs a screenshot.

## 3. Demo data plan

All of it lives on STAGING (`ipgrnwvfnumgvnxkpxsc`) only. Production never. Every name, sum and
sentence is invented and marked "(example)" where a reader could mistake it for a real buyer.

| Organisation | Kind | What it holds | How it is seeded |
|---|---|---|---|
| Northfield Facilities Services Ltd (`...d1`) | supplier, small facilities and grounds care firm | 4 evidence documents (case study, quality policy, insurance summary, social value statement), 6 answer library entries, the Riverside tender with 6 drafted questions, one claim backing run | `scripts/staging/seeds/website-demo/01_demo_pair.sql` (applied 2026-10-21) then `web/e2e/product-captures/seed1.spec.ts`, `seed2.spec.ts`, `seed3.spec.ts` (run 2026-10-21) |
| same | | 5 more bids: grounds care for a housing association (public, drafting), office cleaning for a logistics firm (PRIVATE request for quote, evidence stage), school site maintenance (public, submitted), Calderside civic buildings (public, WON), retail park cleaning (PRIVATE, WON). A value and closing date on the Riverside bid. A two comment thread on its question 4 | `02_demo_pipeline_and_buyer.sql`, written 2026-10-22, **NOT APPLIED** |
| Riverside Borough Estates (`...d2`) | buyer, a housing estates owner | a published requirement pack (cleaning and building maintenance, six estate blocks, quality 40, price 40, social value 20), a draft pack (communal gardens), an open evaluation | same file, **NOT APPLIED** |

Still to fill, each through the product's own flows rather than SQL, because their tables are many
and their invariants live in the API:

- **Delivery promises on a won bid** (slots 9, 14, 19, 30): open the Calderside bid, record its
  social value commitments and one monthly evidence item through `/bid/contracts/[id]/delivery`.
- **Supplier submissions, clarifications, whole life costs and post award tracking for the buyer**
  (slots 32, 34, 35, 37, 21): invite two example suppliers to the published Riverside requirement
  with the existing respond token flow, upload their replies, then open whole life costs and the
  value tracker. The walk personas `R285_D4_*` and `R285_D5_*` already exercise this flow and can
  be copied as a seed spec.

No seed calls an AI model except the existing seed2 and seed3 (already run, ledgered).

## 4. The capture harness

`crowagent-platform/web/e2e/product-captures/website.spec.ts`, run through the existing
`playwright.captures.config.ts`. From `crowagent-platform/web/`:

```
npx playwright test --config=playwright.captures.config.ts --project=captures website.spec.ts
```

- Dry run (no sign in, writes nothing, proves the gates and the login page):
  `CAPTURE_DRY_RUN=1` before the same command.
- Some slots only: `CAPTURE_ONLY=find-feed,answer-list`.
- Ids default to the demo bid and the fixed ids in seed 02. Override with `DEMO_BID_ID`,
  `DEMO_WON_BID_ID`, `DEMO_REQUIREMENT_ID`, `DEMO_EVALUATION_ID`. Website path: `WEBSITE_ROOT`.

What it does for each slot: signs in as the demo supplier or buyer (tenant proved from the sidebar
by the walk's `signIn`), sets the account theme to light and asserts it took, opens the screen and
asserts its status and landed URL, sets the state (question, tab), grows answer boxes or keeps them
at app height, hides the cookie banner, staging pills, chat and toasts through the CSSOM (the app's
CSP refuses an injected style), and captures at 2x. It writes `<file>.webp` and `<file>.avif` into
`crowagent-website/Assets/product-captures/web/` and the entry into
`astro/src/data/product-captures.real.json`.

What makes it refuse a slot (the slot is reported and NOT written, its frame keeps the drawing):

- the text its alt describes is not on the screen (so the alt is never a guess),
- a retired brand word (CrowMark, CrowAgent) is in the region's text or image names,
- a word the website never prints (council, PPN 002) is in the region. A live feed card naming a
  council is skipped and the next card is tried,
- a state the website must not show (for Decide, a weak fit from an empty track record),
- a region too small to be the screen.

Crop regions are measured from the rendered text lines, never typed: `wide` runs out to the furthest
line that stops short of the card's far right (falls back to the full width if any line would be
cut), `phone` runs down to just above the action row and its right edge moves left until it falls
between items.

It refuses production three ways: the walk fixture's `assertStagingTarget`, the harness's own check
against `STAGING_APP_HOSTS` and `PRODUCTION_HOSTS` from `@velstrian/server-infra/public-hosts.mjs`,
and the tenant check. Red proved on 2026-10-22: with `R285_BASE_URL=https://app.crowagent.ai` the run
fails with `REFUSED` before a page opens.

## 5. What was captured on 2026-10-22

Probe first: `https://staging-app.velstrian.com/login` answered 200, landed on `/login`, title
"Sign in · Velstrian Tenderworks", zero "CrowMark" or "CrowAgent" in the page. A signed out
`/bid/opportunities` landed on `/login` (as it should). Staging web predates the 2026-10-22 rebrand
commits (product mark letter, brand rasters), so whole screen captures that include the rail wait
for the promote. Panel captures do not show the rail, and the harness checked each for retired
brand words.

Captured, light theme, 2x, demo supplier, files in `Assets/product-captures/web/`:

| File | CSS size | Slots |
|---|---|---|
| `find-feed-card.webp` | 1086 by 201, wide crop 567, phone crop 372 by 141 | `home-cap-find`, `contact-call-find`, `screen-find` |
| `answer-question-list.webp` | 341 by 706 | `home-cap-answer`, `screen-answer-list` |
| `answer-from-library.webp` | 811 by 479 | `home-car-answer`, `screen-answer-library` |
| `refusal-no-source.webp` | 811 by 481 | `home-car-refusal` |

They replace the four dark crops of 2026-10-21 under the same names. The feed card is a real live
public notice, as the earlier one was. The answer is worded "drafted from your own documents", not
"from your library", because the app labels that draft's source as the tender
(R285-BID-ANSWER-SOURCES-01).

## 6. Steps after the staging promote (driver)

1. Dry run seed 02 on staging: `begin;` + the file + `rollback;` through the Supabase MCP
   `execute_sql` on `ipgrnwvfnumgvnxkpxsc`. If clean, run it without the rollback.
2. Fill the delivery promises and the buyer submissions through the product (section 3).
3. From `crowagent-platform/web/`, with free RAM above the floor, run the harness command above.
   It prints `captured` and `not captured` with a reason per slot.
4. Look at every written file. Then `git diff astro/src/data/product-captures.real.json` in the
   website repo.
5. Website checks from `crowagent-website/astro`: `node scripts/check-facts.js`,
   `node scripts/check-english.js`, `node scripts/check-design-system.js`, `npx astro check`, then
   the built page in a browser at 1440 and 390 (`npm run build`, `npm run preview`).
6. Commit the website files by pathspec. Nothing is pushed without the owner.

## 7. Open, by name

- `home-hero-answer` waits on R285-BID-ANSWER-SOURCES-01.
- `about-hero` has no single screen. Keep the drawing or use the answer capture: owner's call.
- `bid-hero`, `home-who-small`, `home-refusal-check` need a design look or a harness slot first.
- Harness slots still to add once their data exists: `buy-cap-collect`, `buy-cap-compare`,
  `buy-cap-decision`, `screen-buyer-delivery`, `buy-boundary-gate`, `home-refusal-check`.
- The phone crop of the feed card keeps the separator dot after "Scotland" (a CSS drawn dot the
  text measure cannot see), as the earlier hand crop did.
