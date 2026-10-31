# Master shot list

Every shot below names the exact route to record on staging, what to show, and what to avoid. Routes and screen names are confirmed in the `velstrian-platform` code at branch `review/r29-content-kiro-crew`. Citations are `path:line`.

Rule for every shot: sign in as the staging test persona named, never production, never real data. Do not open, hover or click any checkout, upgrade, buy credits or billing payment control. If a flow would reach one, stop at the step before it and cut.

Personas (names from `web/e2e/r285-staging-walk/README.md`): supplier shots use `SUPPLIER_PUBLIC` and `SUPPLIER_PRIVATE`. Buyer shots use `BUYER_PUBLIC`. The driver holds the sign ins.

## Supplier long walkthrough (`supplier-long`)

| # | Screen and route | Show | Avoid | Cite |
| --- | --- | --- | --- | --- |
| 1 | Home, `/home` | The signed in workspace, the left menu, the organisation name in the sidebar | Any real tenant name, use the staging persona | nav in `web/src/config/platformNav.ts` |
| 2 | Opportunities, `/bid/opportunities` | The single search bar, the source chips (Find a Tender Service, Contracts Finder, Public Contracts Scotland), the ranked list | SAM.gov key entry if it shows a secret | `web/app/(dashboard)/bid/opportunities/page.tsx:55` |
| 3 | Start a bid, `/bid/new` | Starting a bid from an opportunity, the details step | Nothing paid | `web/app/(dashboard)/bid/new/page.tsx` ("Start a bid") |
| 4 | Tender documents, `/bid/contracts/[id]/tender` | Uploading the tender pack, the Changes from the buyer section | Real file names with personal data | `web/app/(dashboard)/bid/contracts/[id]/clarifications/page.tsx:3` (redirect to tender#changes) |
| 5 | Questions, `/bid/contracts/[id]/questions` | The extracted questions list | | route present under contracts/[id] |
| 6 | Compliance matrix, `/bid/contracts/[id]/compliance-matrix` | Breaking questions into rows, assigning owners | | route present |
| 7 | Evidence, `/bid/contracts/[id]/evidence` and the Evidence Vault | Linking a policy or certificate as proof | A real certificate holder name | route present, evidence vault articles exist |
| 8 | Narrative, `/bid/contracts/[id]/narrative` | Drafting an answer grounded in the evidence, the citation side drawer | | route present |
| 9 | Social value, `/bid/contracts/[id]/social-value` | Choosing PPN 026 measures | Say PPN 026 only, never PPN 002 | help copy reads PPN 026 bands, `web/lib/help-articles.ts` header |
| 10 | Review, `/bid/contracts/[id]/review` | Peer review and sign off | | route present |
| 11 | Submission, `/bid/contracts/[id]/submission` | Exporting to Word and PDF, the compliance matrix export | Do NOT proceed to any payment or portal checkout | `web/app/(dashboard)/bid/contracts/[id]/submission/page.tsx:2` |

## Buyer long walkthrough (`buyer-long`)

| # | Screen and route | Show | Avoid | Cite |
| --- | --- | --- | --- | --- |
| 1 | Buyer home, `/buyer` | The buyer workspace | Real tenant data | nav registry |
| 2 | Requirement Builder, `/buyer/requirements/new` | Building a requirement with the stepper, starting from a template | | `web/app/(dashboard)/buyer/requirements/new/page.tsx:1` ("Requirement Builder") |
| 3 | Weighting and rubric, inside the requirement | Setting the weighting and the scoring rubric | | `buyer-weighting-and-rubric` article exists |
| 4 | Pipeline, `/buyer/pipeline` | The pipeline view, the section 93 notice content, the contract register export | | `web/app/(dashboard)/buyer/pipeline/page.tsx:2` |
| 5 | Evaluations, `/buyer/evaluations/[id]` | A scored evaluation, evaluator set scores, the deterministic headline | Make clear the headline is computed, never by AI | `web/app/(dashboard)/buyer/evaluations/[id]/page.tsx:1-3` |
| 6 | Compare bids, `/buyer/compare-bids` | Bids brought to one whole life figure per currency | Note it is never ranked for you | `web/app/(dashboard)/buyer/compare-bids/page.tsx:1` |
| 7 | Award and standstill, `/buyer/evaluations/[id]` award step | Recording the award, the standstill period, letters | Do not send a real letter to a real address | `buyer-award-standstill-and-letters` article exists |
| 8 | Supplier record, `/buyer/suppliers/[id]` | The supplier record after award | | route present |
| 9 | Scorecards, `/buyer/suppliers/[id]/scorecards` | Scoring the supplier, the scorecard panel over the record | | `web/app/(dashboard)/buyer/suppliers/[id]/scorecards/page.tsx:27` |
| 10 | Reviews, `/buyer/suppliers/[id]/reviews` | Running a supplier review session | | `web/app/(dashboard)/buyer/suppliers/[id]/reviews/page.tsx:29` |
| 11 | Value tracker, `/buyer/value-tracker` | Tracking delivered value, the finance queue | Totals are kept separate, do not imply one headline | `web/app/(dashboard)/buyer/value-tracker/page.tsx:1` |

## Shorts

Each short is one row from the long walkthroughs, recorded on its own, 30 to 90 seconds, silent first with burned in captions. See `script-shorts.md` for the per short voice over and the exact in and out points. Same routes, same avoid rules.

## Capture settings for whoever records

- Resolutions: 1920x1080 for the horizontal cut, 1080x1920 for vertical, 1080x1350 and 1080x1080 where a social crop is needed.
- Hide any browser extension, bookmark bar and personal profile. Use a clean staging profile.
- No trace or video of URLs that carry a token. The staging walk turns traces off for this reason (`web/e2e/r285-staging-walk/README.md`, rule 7).
- Blur or avoid any field that could show a real email, phone number or person. Use only synthetic staging records.
