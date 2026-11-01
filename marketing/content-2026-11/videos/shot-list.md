# Master shot list

Every shot below names the exact route to record on staging, what to show, and what to avoid. Routes and screen names are confirmed in the `velstrian-platform` code at branch `review/r29-content-kiro-crew`. Citations are `path:line`.

Rule for every shot: sign in as the staging test persona named, never production, never real data. Do not open, hover or click any checkout, upgrade, buy credits or billing payment control. If a flow would reach one, stop at the step before it and cut.

Personas (names from `web/e2e/r285-staging-walk/README.md`): supplier shots use `SUPPLIER_PUBLIC` and `SUPPLIER_PRIVATE`. Buyer shots use `BUYER_PUBLIC`. The driver holds the sign ins.

Corrected on 2026-10-31 against the driver's reference recording (manifest at the media URL in channel #64). Where a route redirects on the real staging persona, the LANDED screen is named and used. Weak or empty screens are either cut or described as an empty state, and no data is created to fill them.

## Supplier long walkthrough (`supplier-long`), persona `SUPPLIER_PUBLIC`

| # | Request route | Lands on (real) | Show | Avoid |
| --- | --- | --- | --- | --- |
| 1 | `/home` | `/home` | The signed in workspace, the left menu, the organisation name in the sidebar | Any real tenant name, use the staging persona |
| 2 | `/bid/opportunities` | `/bid/opportunities` | The single search bar, the source chips (Find a Tender Service, Contracts Finder, Public Contracts Scotland), the ranked list | SAM.gov key if it shows a secret |
| 3 | `/bid/new` | `/bid/new` | The Start a bid step | Nothing paid |
| 4 | `/bid/contracts/<id>/tender` | tender | Tender documents, the Changes from the buyer section | Real file names with personal data |
| 5 | `/bid/contracts/<id>/questions` | questions (Response page) | The extracted questions list | |
| 6 | `/bid/contracts/<id>/compliance-matrix` | REDIRECTS to `/requirements` | The Requirements screen it lands on. Rename this shot to "requirements" | Do not imply a separate compliance-matrix page |
| 7 | `/evidence` | `/evidence` | The Evidence Vault (org level, at /evidence, not the per bid evidence route which redirects to Contract delivery) | A real certificate holder name |
| 8 | `/bid/contracts/<id>/narrative` | REDIRECTS to `/questions` (Response page) | The Response page it lands on, where answers are drafted. Rename this shot to "response" | Do not imply a separate narrative page |
| 9 | `/bid/contracts/<id>/social-value` | social-value | Choosing PPN 026 measures | PPN 026 only, never PPN 002 |
| 10 | `/bid/contracts/<id>/review` | review | The review screen. This persona has NO sign off stages, so describe it as the review step rather than showing a sign off that is not there | Do not invent a sign off |
| 11 | `/bid/contracts/<id>/submission` | submission | The cover letter section. Do NOT click export | Do NOT click export or reach any payment or portal checkout |

## Buyer long walkthrough (`buyer-long`), persona `BUYER_PUBLIC`

First visit lands on `/agree`. Tick the terms box once (the expected step) before the rest. Pick a requirement WITHOUT clarification questions. Do NOT film requirement 01, it shows a supplier email address. Add a DOM scrub that replaces any email with "[supplier email]" before every still and in the video.

| # | Request route | Lands on (real) | Show | Avoid |
| --- | --- | --- | --- | --- |
| 1 | `/buyer` | `/buyer` | The buyer workspace | Real tenant data |
| 2 | `/buyer/requirements/new` | `/buyer/requirements/new` | The Requirement Builder stepper, starting from a template | A requirement with a real email |
| 3 | `/buyer/requirements/<id>` | the requirement | This persona has NO weighting editor, it shows the procurement route and the send step. Describe those, not a weighting editor that is not there | Do not invent a weighting editor |
| 4 | `/buyer/pipeline` | `/buyer/pipeline` | The pipeline, the section 93 notice content, the contract register export | |
| 5 | `/buyer/evaluations/<id>` | the evaluation | A scored evaluation, evaluator set scores, the computed headline | Make clear the headline is computed, never by AI |
| 6 | `/buyer/compare-bids` | `/buyer/compare-bids` | Bids brought to one whole life figure per currency | Note it is never ranked for you |
| 7 | `/buyer/evaluations/<id>` (award) | same as shot 5, Awarded | This persona shows Awarded with NO standstill or letters step. Describe the award state, do not show a standstill flow that is not there | Do not invent a standstill or letters step |
| 8 | `/buyer/suppliers/<id>` | the supplier record | The supplier record after award | |
| 9 | `/buyer/suppliers/<id>/scorecards` | scorecards | EMPTY STATE on this persona. Either cut, or describe what a buyer sees before any scorecard exists | Do not create a scorecard to fill it |
| 10 | `/buyer/suppliers/<id>/reviews` | reviews | EMPTY STATE on this persona. Either cut, or describe the empty state | Do not create a review to fill it |
| 11 | `/buyer/value-tracker` | `/buyer/value-tracker` | Tracking delivered value, the finance queue (may be an empty state, describe it if so) | Totals are kept separate, do not imply one headline |

## Shorts

Each short is one row from the long walkthroughs, recorded on its own, 30 to 90 seconds, silent first with burned in captions. See `script-shorts.md` for the per short voice over and the exact in and out points. Same routes, same avoid rules.

## Capture settings for the recorder

- Resolutions: 1920x1080 for the horizontal cut, 1080x1920 for vertical, 1080x1350 and 1080x1080 where a social crop is needed.
- Clean staging profile only, no extension, bookmark bar or personal sign in.
- No trace or video of URLs that carry a token. The staging walk turns traces off for this reason (`web/e2e/r285-staging-walk/README.md`, rule 7).
- Email and PII scrub (REQUIRED): before every still and in the video, replace any email address on screen with "[supplier email]" via a DOM scrub. Never film requirement 01 (it shows a supplier email). Avoid any field that could show a real phone number or person. Use only synthetic staging records.
- The Cloudflare Access gate on the staging host is passed with the cf-access-client-id and cf-access-client-secret headers (the recorder adds them on the staging host only). The Vercel bypass header is added too.

## Code citations (unchanged, screen behaviour confirmed in the platform code)

Opportunities `web/app/(dashboard)/bid/opportunities/page.tsx:55`. Start a bid `web/app/(dashboard)/bid/new/page.tsx`. Clarifications redirect to tender#changes `web/app/(dashboard)/bid/contracts/[id]/clarifications/page.tsx:3`. Submission `.../submission/page.tsx:2`. Pipeline `.../buyer/pipeline/page.tsx:2`. Evaluation deterministic headline `.../buyer/evaluations/[id]/page.tsx:1-3`. Compare-bids `.../buyer/compare-bids/page.tsx:1`. Scorecards `.../buyer/suppliers/[id]/scorecards/page.tsx:27`. Reviews `.../buyer/suppliers/[id]/reviews/page.tsx:29`. Value-tracker `.../buyer/value-tracker/page.tsx:1`. The redirects in shots 6 and 8 (supplier) are the live staging behaviour recorded in the driver reference.
