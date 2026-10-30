# Gemini brief 07: mono label weight and the dark teal text colour

Driver: Claude (reviews your work). Executor: Gemini. Date 2026-10-30. Release R2.9.

Rows: **R29-STEP-REBRAND-05-ARTWORK-AND-DESIGN-SYSTEM-01** (Part A) and **R29-STEP-P2-PREMIUM-TYPE-01**
(Part B), in `velstrian-platform/RELEASE-2.9-TRACKER.md`. Read both rows and the history of
`R285-REBRAND-05-ARTWORK-AND-DESIGN-SYSTEM` and `R285-P2-PREMIUM-TYPE-01` in `RELEASE-2.8.5-TRACKER.md`.

## Hard limits

- RULE 0-C: change the CENTRAL token once and let it flow. Never hardcode a colour, weight or font
  locally. A change that needs edits in many places means a missing token: add the token, then point
  the places at it.
- No push, deploy, promote, migration, SQL or dashboard change. Local commits only.
- Platform: branch `review/r29-type-tokens` from platform `main`. Website: branch from website `main`
  named `review/r29-type-tokens`, NOT the agent readiness branch.
- Targeted tests only (RULE 0-T). One heavyweight at a time, free RAM above 1 GB. Never kill a
  process you did not start.
- No empty catch, no `@ts-ignore`, no `eslint-disable`. No em dash, en dash or semicolon in user
  facing text. Identity `Velstrian Tenderworks <platform@velstrian.com>`. Commit by pathspec.
- **When you finish, switch BOTH repositories back to `main`.** Tracker edits are committed on
  platform `main` only.

## Part A, mono labels at weight 500

The technical font is DM Mono (`packages/tokens/src/constants.ts:155`, `packages/tokens/src/tokens.css:474`).
DM Mono has no 700 weight, so every mono label set to bold is a FAKE bold the browser draws. Driver
decision (no scope change): mono labels use weight 500.

1. Find every place mono text is set bold or 700: Tailwind `font-mono` together with `font-bold` or
   `font-semibold` (about 48 class lists across `web/`, `apps/portal/src`, `packages/`), and CSS rules
   that use `var(--font-mono)` or `var(--ca-font-mono)` with `font-weight: 600` or `700`. Strip comments
   before counting. Report the count per area.
2. Fix it centrally. Add a token for the mono label weight (for example `--font-mono-weight: 500`
   in `tokens.css`, mirrored in `constants.ts` if constants carry weights) and a utility class or
   Tailwind theme entry that sets mono and that weight together. Point every place from step 1 at it.
   Do not leave a raw `500` in components.
3. Check the font files load 500. If only 400 is loaded, load DM Mono 500 the same way 400 is loaded
   (self hosted, no external font host). Report which weights are now loaded.
4. Add a guard test that fails if `font-mono` appears with `font-bold` or `font-semibold`, or a mono
   rule sets weight 600 or 700, comments stripped. Prove it red on the old tree, green after.
5. Emails and PDFs: if the email shell or PDF styles use mono at 700, change them through their own
   token source (`packages/tokens/src/email-shell.ts` and the PDF style source), then regenerate the
   generated files with their own generator scripts (`api/app/services/_email_shell_generated.py`,
   `scripts/generate-auth-email-templates.mjs`). Never hand edit a generated file.

## Part B, dark theme teal text from #FFFFFF to #F8F9FB

Driver decision 2026-10-29 (no scope change): in the dark theme, the primary text colour used on teal
changes from pure white `#FFFFFF` to `#F8F9FB`, in the central tokens, website included.

1. Find the token that holds that colour in `packages/tokens/src/tokens.css` (and its source, for
   example `brand.source.json`, if tokens are generated). Read the comments around it first. If a
   comment warns against this change, stop and report it.
2. Change it once at the source and regenerate whatever is generated from it. Report every token
   name that changed and every generated file that changed.
3. Website: `velstrian-website` takes its tokens from the same source or a synced copy. Find how it
   gets them and apply the same change through that path, never by hand editing a colour.
4. Contrast: compute the contrast ratio of the new colour against every dark theme teal background
   it sits on (read the background tokens). Each must stay at or above 4.5 to 1 for normal text.
   Report the numbers.

## Verify

- Platform: `pnpm tsc --noEmit` in `web/` and `apps/portal`, the token and brand guard tests (find
  them by the token file names), your new mono guard, in as few invocations as possible. `next build`
  once in `web/` if any CSS or Tailwind config changed.
- Website: `npm run build` in `astro/` once, all gates.
- Screenshots of one page with mono labels and one dark teal surface, before and after, on local dev
  (`http://localhost:3000` for the app with the test login, the website preview for the site), saved
  under `web/test-results/r29-type-tokens/` and `velstrian-website/test-results/r29-type-tokens/`.

## Commit, board, report

- Commits: `fix(design): R29-STEP-REBRAND-05-ARTWORK-AND-DESIGN-SYSTEM-01 mono labels at weight 500 from one token`
  and `fix(design): R29-STEP-P2-PREMIUM-TYPE-01 dark teal primary text F8F9FB from the central token`
  (one per repo where both repos change).
- Switch both repositories to `main`. Set both rows to BUILT with branches, sha7s, counts, contrast
  numbers and `not pushed`. Keep the old text after `Was:`. Commit the tracker on platform `main`,
  rebuild the board (`docs/AI-ONBOARDING-GUIDE.md` section 7.3).
- Report back, short: counts found and fixed per area, the new token names, font weights loaded,
  guard red and green output, contrast table, test and build results, sha7s, anything not done.
