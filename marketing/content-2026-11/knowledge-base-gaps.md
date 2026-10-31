# Knowledge base: gap map and proposed edits

Work item R29-CONTENT-KIRO-CREW-01. Batch 1 of 3.

This file does two jobs:

1. It maps what the help centre already covers against the product, so the gaps are clear.
2. It lists proposed edits to EXISTING articles. New articles are not here. They are in `velstrian-platform/web/lib/help-articles-crew.ts`, because the driver rewrote all 38 existing articles on another branch today and the crew must not touch `help-articles.ts`.

Screen names and routes are confirmed in the product code. Citations are `path:line` against the `velstrian-platform` clone at the branch head recorded in the report.

## Existing articles (38), by category

- Getting started: `quick-start-velstrian`, `bid-workflow-end-to-end`, `procurement-act-2023-readiness`
- Velstrian Bid: `create-bid-contract`, `upload-tender-documents`, `build-compliance-matrix`, `generate-narrative`, `collaborative-bidding-and-review-workflows`, `export-tender-responses`, `social-value-score`, `ppn-06-20-social-value-themes`, `toms-social-value-calculator-deep-dive`, `carbon-reduction-plans-ppn-06-21`, `evidence-vault-basics`, `evidence-vault-audit-citations`, `private-bid-to-a-private-buyer`, `private-quick-quote`
- Velstrian Buy: `public-sector-supplier-review`, `public-sector-evaluation-scoring`, `buyer-set-up-your-workspace`, `buyer-build-a-requirement`, `buyer-local-priorities-and-social-value`, `buyer-weighting-and-rubric`, `buyer-publish-download-and-share-the-pack`, `buyer-record-suppliers`, `buyer-run-an-evaluation`, `buyer-compare-bids-and-whole-life-cost`, `buyer-award-standstill-and-letters`, `buyer-manage-the-contract`, `buyer-quick-rfq`, `private-buyer-mode`
- Account: `private-market-and-currency`, `sso-saml-scim-enterprise-setup`, `billing-and-plans`, `invite-team-members`, `account-security-and-data`, `audit-logs-and-compliance`
- Knowledge base: `support-and-reporting-faq`

Source of the list: `web/lib/help-articles.ts` (the `HELP_ARTICLES` array).

## Gaps found, and how each is now covered

| Feature or journey | Had an article before | Now covered by (new article slug) |
| --- | --- | --- |
| Find and assess tenders (the Opportunities screen) | No | `find-and-assess-opportunities` |
| Answer library (reusable answers, org level) | No | `reuse-answers-answer-library` |
| Selection questionnaire (reusable SQ, org level) | No | `selection-questionnaire-reusable-answers` |
| Clarifications and buyer changes (now in tender Documents) | No | `buyer-changes-and-clarifications` |
| Workflows (automation rules) | No | `workflow-rules-automation` |
| Integrations (webhooks, CRM push, document sources) | No | `connect-your-tools-integrations` |
| Supplier scorecards (Buy) | No | `buyer-supplier-scorecards` |
| Supplier reviews (Buy) | No | `buyer-supplier-reviews` |
| Value tracker (Buy) | No | `buyer-value-tracker` |
| Buyer pipeline and contract register (Buy) | No | `buyer-pipeline-and-contract-register` |

## Gaps noted but NOT written in batch 1 (proposed for a later batch)

These features have routes but need more code reading before an article can cite every step. They are listed so nothing is lost, not written yet, to avoid any UNVERIFIED step in a published guide.

- `bid/frameworks` (framework agreements)
- `bid/tone-profiles` (writing tone profiles)
- `bid/analytics`, `bid/reports`, `bid/learnings` (reporting and learnings)
- `bid/advisor`, `bid/actions`, `bid/first-briefing`, `bid/methodology`
- `bid/partner` area (partner or reseller workspace: overview, clients, branding, revenue)
- `buyer/risk-radar`, `buyer/reputation`, `buyer/transparency`, `buyer/portfolio`, `buyer/srm/actions`
- `settings/developer/api` and the SDK and API docs (developer API keys)
- `settings/organisation/*` detail screens (authentication, compliance, branding, members, audit)
- Onboarding journey (`onboarding/organisation-type`, `onboarding/product`)

## Proposed edits to EXISTING articles

The crew did not edit `help-articles.ts`. These are proposals for the driver to apply after the 38 article rewrite is merged. Each is a suggestion, not a change already made.

1. `bid-workflow-end-to-end`: add a short line pointing to the new `find-and-assess-opportunities` article at the start, so the lifecycle begins where a user actually begins, on the Opportunities screen, rather than at ingestion.
2. `collaborative-bidding-and-review-workflows`: cross link to `buyer-changes-and-clarifications`, because a clarification from the buyer often triggers a re-review, and the two topics sit next to each other in real use.
3. `evidence-vault-basics` and `generate-narrative`: cross link to `reuse-answers-answer-library`, since a reused library answer still draws on the Evidence Vault and still runs through drafting.
4. `public-sector-supplier-review`: cross link to the new `buyer-supplier-scorecards` and `buyer-supplier-reviews`, so the supplier management journey reads as one path.
5. `buyer-manage-the-contract`: cross link to `buyer-value-tracker` and `buyer-pipeline-and-contract-register`, because managing a contract, tracking its value and keeping the register current are one ongoing job.

These are cross links and pointers only. No wording change to an existing article is proposed in batch 1.
