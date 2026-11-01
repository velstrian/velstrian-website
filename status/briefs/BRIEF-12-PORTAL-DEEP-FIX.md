# Gemini brief 12: founders portal, deep check and fix of every page

Driver: Claude (reviews every result). Executor: Gemini. Date 2026-11-01. Release R2.9.

The founders portal (https://portal.velstrian.com) is used by the founders only. The owner found broken
features and a lot of old content from products that no longer exist. Work through every item below in
order, systematically, with full checks. Do not stop between items. Do not ask whether to continue.

Rows (in `velstrian-platform/RELEASE-2.9-TRACKER.md`, read each one in full first):
R29-PORTAL-BIZ-DOCS-AI-KEY-01, R29-PORTAL-INTEGRATION-HEALTH-01, R29-PORTAL-STALE-PRODUCT-CONTENT-01,
R29-PORTAL-KB-CONNECT-SOURCES-01, R29-PORTAL-REGULATION-UPDATES-DECISION-01,
R29-PORTAL-SIDEBAR-COLLAPSE-01, R29-PORTAL-FULL-PAGE-AUDIT-01.
Already fixed by Claude, do not redo: R29-PORTAL-RECEIPTS-MONTH-END-01 (d62fb5c33) and
R29-PORTAL-SECRET-IN-ERROR-LOG-01 (da4bcb3d8).

## Where you work

- Platform worktree `C:\w\vp`, branch `review/r29-batch2`. Do not switch branches. Other lanes commit
  here too, so commit ONLY your own paths with `git commit -- <paths>`.
- Portal code: `apps/portal`. Tests: `npx vitest run <files>` from `apps/portal`, and
  `npx tsc --noEmit -p .` there. TARGETED tests only, one batched run per item (RULE 0-T).
- Do not touch `review/kiro-portal-step4` in `C:\w\kp` (Kiro's database move code). If your fix
  touches a file that branch also changes (`apps/portal/src/lib/supabase/*` or the 16 customer data
  routes it moves to `getPlatformAdmin()`), write it so it works on both and say so in the report.

## The items

### 1. Business Hub document generation (P0, R29-PORTAL-BIZ-DOCS-AI-KEY-01)

Production logs show `POST /api/agents/generate` failing with `401 invalid x-api-key` from Anthropic, so
the portal's AI key is wrong. The owner will set a valid key. Your part:
- Find every portal route that calls an AI provider and the setting each one reads.
- When a key is missing or refused, the screen must say plainly which setting to fix ("The AI key for
  the portal is missing or not accepted. Set ANTHROPIC_API_KEY on the portal project."), never
  "An unexpected error occurred". The real cause is logged without the value.
- Tests with a mocked provider: a refused key, a missing key and a good key.
- NO real AI call. The portal's live AI budget is almost used. If you need one, ask in the report.

### 2. Integration panels (P1, R29-PORTAL-INTEGRATION-HEALTH-01)

Production logs, 2026-11-01:
- GitHub: `list organization repositories` and `Dependabot alerts` return Not Found, and the workflow
  list reads files from the OLD `crowagent/crowagent-platform` repository. The organisation is now
  `velstrian` and the repository `velstrian-platform`. Find where the organisation and repository come
  from (the integrations store `GITHUB_ORG`, `getCredentialOr`, `GITHUB_ORG_LOGIN`, the shared deploy
  targets) and make ONE source decide it. Remove the dead workflow paths (for example
  `stripe-bootstrap-cyber-cash.yml`, `sprint1-ci.yml`) from anything that lists them. If the stored
  integration value is wrong, say exactly what the owner sets on the Integrations page.
- Railway: `/api/railway/metrics` and the env var list get HTTP 400. Find out why (token, project id,
  environment id, or a changed GraphQL query) by reading the code and Railway's API docs, then fix it.
  Never print a token.
- Supabase management: the owner is replacing a malformed token. Check the staging DB and health panels
  read it correctly after the change.
- Each panel that cannot reach its service shows a plain message naming the service and the setting,
  not a blank card or a generic error.

### 3. Old product content (P1, R29-PORTAL-STALE-PRODUCT-CONTENT-01)

The Outreach Generator offers Sustainability Manager, Energy Consultant and Property Manager personas.
The Campaign Content Agent has the same problem. These come from decommissioned products (CrowAgent Core,
CrowCash, CrowCyber, CrowESG, CSRD Checker). Never build or restore those products.
- Sweep EVERY portal agent, prompt, persona list, dropdown, template, sample text and seed for old
  product content: energy, sustainability manager, property, MEES, EPC, CSRD, ESG, cyber, cash flow,
  CrowMark, CrowAgent, crowagent.ai. Strip comments before you judge a match (a comment that explains
  why something was removed is a guard, leave it).
- Replace the audiences with the real ones for Velstrian Bid and Velstrian Buy: owner or managing
  director of a small firm, bid writer or bid manager, operations manager, public sector procurement
  officer, private sector buyer, framework manager. Name public AND private buyers.
- Pain point examples: PPN 026 only, never PPN 002.
- Business Hub shows pipeline rows tagged "Retired product". List them for the owner with a
  recommendation (archive or relabel). Do not delete data.
- A guard test that fails if a dead product persona or name returns in a portal agent or prompt file.

### 4. Knowledge base connected to the real sources (P2, R29-PORTAL-KB-CONNECT-SOURCES-01)

`/portal/kb` and `/portal/kb/ask` must cover what the founders actually maintain:
- the platform help articles (`web/lib/help-articles.ts` and `web/lib/help-articles-crew.ts`, the single
  source the public help centre is generated from),
- the website help centre (`velstrian-website/astro/src/data/help-centre.generated.json`),
- the Tawk knowledge base, if Tawk offers a free read API (check the docs, never a paid plan),
- the Google Drive documents (the legal and compliance PDFs folder in the platform Google Drive), shown
  as a list with title, last modified date and a link. Read only.
One list with a source label on each item, a search box, and the ask box answering from those sources
with a link to each source it used. Read only. Free APIs only. Any new credential is a question for the
owner, never invented. If an item needs an owner setting, say which.

### 5. Regulation updates page: keep or not (P2, R29-PORTAL-REGULATION-UPDATES-DECISION-01)

The owner asks whether `/portal/regulation-updates` is needed. Measure: what it shows, where its data
comes from, when it last updated, and whether anything else reads it. Then write a recommendation with
evidence: keep, repurpose (for example Procurement Act 2023, PPNs and threshold changes that matter to
small bidders) or remove. Do NOT remove or rebuild it. The owner decides.

### 6. Sidebar collapse (P2, R29-PORTAL-SIDEBAR-COLLAPSE-01)

The group that holds the current page cannot be collapsed. Find why (it is probably forced open while
a child is active), fix it so every group opens and closes, remember the choice, and keep the current
page visible some other way (highlight). Check it with the keyboard and on a phone width.

### 7. Every portal page, deep check (P1, R29-PORTAL-FULL-PAGE-AUDIT-01)

The owner says many more pages need work. Do a full audit:
- List every portal route under `apps/portal/src/app` (pages and API).
- For each page, with Playwright against a local portal (`next dev` from `apps/portal`, mocked
  services where a real one is needed, never production): it loads without errors, the browser console
  is clean, every button and form does what it says, no old product or brand content, plain English
  for a busy founder (RULE 0-U), colours and type from the design tokens only (RULE 0-C), works at 390
  and 1440 width, and has a clear empty state and error state.
- Write the register to `docs/release-2.9/PORTAL-PAGE-AUDIT-2026-11-01.md`: page, what works, what is
  broken, evidence (file:line, screenshot path), severity, fix sha.
- Fix in batches grouped by root cause. File every defect you cannot fix in the same pass as its own
  row in the tracker (next free R29-PORTAL-... id), never silently.

## Rules (all binding)

- **Production is read only.** Read logs and data, never write. No deploy, no push, no env change, no
  Vercel or Railway or Supabase setting change. Those are the owner's.
- **No paid AI calls.** Mock every provider in tests.
- **Secrets.** Never print, paste, log or commit a key, token or env value. Test with fake shapes only.
- **A grep is a hint, not a finding.** Confirm at the call site and in the running page.
- **Writing (RULE 0-S).** British English, sentence case, no em or en dashes, no semicolons in prose,
  no hype words. Product names: Velstrian Bid and Velstrian Buy. Never "council".
- **Machine (RULE 0-L).** Free RAM above 1.5 GB before any build, browser or test run. One heavy job
  at a time. Never kill a process you did not start.
- Identity `Velstrian Tenderworks <platform@velstrian.com>`. End each commit with
  `Co-Authored-By: Gemini <noreply@google.com>`.

## Report

Write `gemini-briefs/BRIEF-12-REPORT.md`: per item, the sha, files with lines, tests with collected and
passed counts, screenshots, what is left and why, and every owner step in plain words. Update each row
you touched in `velstrian-platform/RELEASE-2.9-TRACKER.md` (main checkout, commit by pathspec): BUILT
when the code is done and tested locally, OPEN with the reason when not. Then rebuild the board:
`node status/build-platform-board.js` from `velstrian-website`, then
`node scripts/assign-phases.mjs ../velstrian-website/status/platform.json` from `velstrian-platform`,
then the board again.

## Addendum (Claude, 2026-11-01 03:05 UTC): measured cause of item 1

`getCredential()` in `apps/portal/src/lib/integrations/store.ts` reads the Integrations store
(`portal_integrations`) FIRST and the Vercel env var only when nothing is stored. Production holds a
stored `ANTHROPIC_API_KEY` from 2026-09-15, so the owner's new Vercel key is never used and every
generate call gets 401. Stored `GITHUB_ORG` (2026-10-29) and `RAILWAY_API_TOKEN` (2026-10-29) are the
likely cause of item 2 in the same way. In item 1 and 2: when a stored credential is refused by its
provider, the message must say "the key saved on the Integrations page was refused, update it there",
and the Integrations page must show which source (saved or Vercel) is in use for each key, without
the value. Do not change the precedence itself without asking.

## Addendum 2 (owner, 2026-11-01 03:15 UTC): item 1 is NOT solved by the saved key, investigate

The owner says the key saved on the Integrations page and the Vercel `ANTHROPIC_API_KEY` are the SAME
key, and the same key works for Claude's testing, yet production `POST /api/agents/generate` still gets
`401 invalid x-api-key` (03:00 UTC, deployment dpl_CAXi1bhT). Find the real cause by measurement, never
by printing the key. Check at least:
- what `getCredential('ANTHROPIC_API_KEY')` actually returns at runtime: its length, first 7
  characters (`sk-ant-`) and whether it has a space, line break or quote, logged as a SHAPE only;
- whether the saved ciphertext decrypts with the current encryption key or an older one (the store
  has key id logic), which would turn a correct key into a wrong string;
- whether the generate path builds its own Anthropic client with a different variable, header, base
  URL or proxy than the one that works;
- whether staging behaves the same (staging is safe to test, production stays read only).
Fix the cause, add a test for it, and make the error say what is wrong in plain words.
