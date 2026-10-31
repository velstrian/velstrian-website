# R29-CONTENT-KIRO-CREW-01 report

Executor: the Kiro crew. Driver and reviewer: Claude. Date 2026-10-31. Release R2.9.

All work is on the branch `review/r29-content-kiro-crew` in both clones. Nothing is pushed. Nothing is published. Every piece is a draft for the owner to approve, piece by piece.

Branch heads at the time of this report:
- velstrian-platform: `0ed695ba319f4f66c82ff562fb6cd26b0941d076`
- velstrian-website: `fc34e8494ae698ce5bbba7c48a37e2575e394e78`

## 1. Knowledge base

The public help centre is generated from `velstrian-platform/web/lib/help-articles.ts`. The driver rewrote all 38 existing articles on a separate branch, so the crew did NOT touch that file. New articles went in a new file, and proposed edits to existing articles went in a gaps file.

### Gap list

Mapped the 38 existing articles by topic, then found the journeys and features with no article. The full map and the proposed cross links to existing articles are in `velstrian-website/marketing/content-2026-11/knowledge-base-gaps.md`.

Gaps now covered by new articles: find and assess tenders, the Answer library, the selection questionnaire, clarifications and buyer changes, Workflows, Integrations, supplier scorecards, supplier reviews, the Value tracker, and the buyer pipeline and contract register.

Gaps noted but deliberately NOT written in this pass (queued with the driver as a later batch, to avoid any unverified step): frameworks, tone profiles, reports and analytics and learnings, advisor, the partner workspace, buyer risk radar, reputation, transparency and portfolio, the developer API, the organisation settings detail screens, and the onboarding journey.

### Articles added

File `velstrian-platform/web/lib/help-articles-crew.ts`, 10 new articles, same object shape and brand tokens as `help-articles.ts`. Word counts (content only):

| Slug | Words |
| --- | --- |
| find-and-assess-opportunities | 470 |
| reuse-answers-answer-library | 376 |
| selection-questionnaire-reusable-answers | 395 |
| buyer-changes-and-clarifications | 397 |
| workflow-rules-automation | 328 |
| connect-your-tools-integrations | 353 |
| buyer-supplier-scorecards | 412 |
| buyer-supplier-reviews | 407 |
| buyer-value-tracker | 381 |
| buyer-pipeline-and-contract-register | 307 |

Every article is at least 300 words, every step and screen name is confirmed in the product code (citations in the batch 1 review request and in the gaps file), no price, seat or credit figure is typed, and no banned claim appears. The driver accepted batch 1 and is merging it, wiring it into the help index and running the help guard tests on the owner side (the crew did not install node_modules on the shared machine).

## 2. Product video series

Scripts, shot lists, caption files and thumbnail specs are in `velstrian-website/marketing/content-2026-11/videos/` (21 files). The clips are recorded by the driver on the owner machine from these shot lists (owner decision, Option A, recorded in the channel), then the crew burns in the captions and builds the thumbnails. Recording is on staging only, and every shot that would reach a checkout or payment step is marked STOP, because the staging Stripe P0 (R29-STAGING-STRIPE-LIVE-KEY-01) is still open.

- `README.md`, `shot-list.md` (every shot cites a route in the platform code, file:line).
- `script-supplier-long.md`, `script-buyer-long.md`, `script-shorts.md` (2 long walkthroughs plus 13 shorts).
- `captions/` 16 SRT files (2 long, 14 short).
- `thumbnails/thumbnail-specs.md` one spec per video plus the tokens used.

## 3. Social media pack

In `velstrian-website/marketing/content-2026-11/social/` (28 files):

- `carousels/` 12 carousel specs, 6 to 10 slides each, problem then real screen then one call to action, for 1080x1350 and 1080x1080.
- `autoplay/` 12 autoplay loop specs, 6 to 15 seconds, silent first with captions, for 1080x1350 and 1080x1920.
- `copy.md` post text for LinkedIn, X and Instagram, hashtags, and alt text for every image.
- `calendar.md` a 6 week posting plan, three posts a week, Bid and Buy alternating.

The real product screens in the carousels and loops come from the same driver recording as the videos. No stock photography, no person presented as a customer.

## 4. Tokens used

From the central sources named in the brief: `velstrian-website/astro/src/styles/tokens.css` and `brand.source.json`, and the platform mirror `velstrian-platform/packages/tokens/brand/brand.source.json`. Pack: Quantum V (owner decision D309, 2026-10-23).

- Colours: --c-bg #090B12, --c-floor #050609, --c-panel #12151E, --c-raised #181C27, --c-text #F7F8FB, --c-text-sub #D8DAE1, --c-text-muted #A9ADBA, --c-teal #8C85FF, --c-teal-dark #4D45DC, --on-accent #090B12 (dark) and #FFFFFF (light).
- Type: --font-display Manrope, --font-body Inter, --font-mono DM Mono, scale tokens --t-h1, --t-page, --t-h2, --t-h4, --t-body.
- No colour was invented or eyeballed.

## 5. REVIEW list, claims the crew could not fully verify

These are stated carefully in the drafts and flagged here for the driver and owner to confirm before publishing:

- The deterministic evaluation headline ("a fixed calculation, the same every time, never by AI"). Taken from `velstrian-platform/web/app/(dashboard)/buyer/evaluations/[id]/page.tsx:1-3`. Confirm it is still true and safe to say on screen.
- The SAM.gov source on the Opportunities screen (US federal work, your own key, daily limit). Taken from `web/src/widgets/discover-search/DiscoverSearch.tsx:18-21`. Shown only if staging has it enabled.
- Workflows and Integrations plan gating (Portfolio, or Pro with the Integrations add on, owner decision D206). Named without a price, because prices must come from the catalogue helpers, not typed. If a price is wanted in copy, the crew will name the helper and the driver wires it.
- Nothing claims a win rate, accuracy figure, customer count, testimonial or compliance promise. Social value is PPN 026 only. The data line used is "Primary data stored in the EU".

## 6. What was left out and why

- No video or image binaries. Recording needs a browser, ffmpeg and the staging accounts and gate keys, which live on the owner side. The crew produced everything that does not need a live recording, so the driver can record straight from the shot lists and the crew finishes the captions and thumbnails.
- The later batch of knowledge base articles listed in section 1 is not written yet, to avoid any unverified step in a published guide.
- No price, seat or credit figure is typed anywhere, per the brief.

## 7. Compliance checks the crew ran

Across the new article file and the whole `content-2026-11` folder: 0 em or en dashes, 0 semicolons in prose, 0 hype words, 0 typed prices, 0 old product names, 0 PPN 002 in copy, 0 "EU data residency", no text art characters, and no win rate, accuracy, customer count or testimonial claim in any on screen or published line. British English throughout.

## 8. Handover

Commits are on `review/r29-content-kiro-crew` in both clones, not pushed. The owner decides how the branch reaches the driver (an approved push of the review branch). The driver reviews each batch in the channel and asks the owner to approve publishing, piece by piece. The crew did not edit the release tracker (the driver owns it).
