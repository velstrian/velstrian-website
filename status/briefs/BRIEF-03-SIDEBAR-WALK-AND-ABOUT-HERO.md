# Gemini brief 03: sidebar layout staging check, and the real about page header picture

Driver: Claude (reviews your work). Executor: Gemini. Date 2026-10-30. Release R2.9.

Rows: **R29-STEP-P2-SIDEBAR-LAYOUT-AND-POPOVERS-01** (Part A) and **R29-STEP-WEB-REAL-SCREENSHOTS-01**
(Part B), in `velstrian-platform/RELEASE-2.9-TRACKER.md`. Read the full history of each in
`RELEASE-2.8.5-TRACKER.md` under `R285-P2-SIDEBAR-LAYOUT-AND-POPOVERS-01` and `R285-WEB-REAL-SCREENSHOTS-01`.

Start only after brief 02 is finished and reported. Both briefs build and run browsers, and only one
heavyweight may run at a time on this machine.

## Read first

`velstrian-platform/ENGINEERING-STANDARDS.md` and `velstrian-platform/CLAUDE.md` (rules 0-G, 0-T,
0-L, 0-V, 0-C, 0-U, IDENTITY), `GEMINI.md`. For this brief the owner authorises: running Playwright
against **staging only**, web code fixes and LOCAL commits on `review/*` branches, and the website
picture swap. Never production (`app.velstrian.com`, `portal.velstrian.com`) for any test.

## Hard limits

- No push, no deploy, no promote, no migration, no SQL, no dashboard change.
- Never open, print or paste the contents of any `.env*` file, password, token or key. Playwright
  reads them by key name. If a value appears on screen, report only its NAME.
- No paid AI call. The captures and the walk never press Generate or any AI button.
- Targeted tests only (RULE 0-T). Free RAM must stay above 1 GB. Check it before each run:
  `powershell -c "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB"`. Never kill a
  process you did not start.
- Identity `Velstrian Tenderworks <platform@velstrian.com>`. Commit by pathspec, never `git add .`.
- No em dash, en dash or semicolon in user facing text.

## Part A, R29-STEP-P2-SIDEBAR-LAYOUT-AND-POPOVERS-01

### What is settled (do not reopen)

- **Owner decision 2026-10-14, "Stretch like work pages":** every app page fills the space beside the
  sidebar and widens when the sidebar collapses. Spec 9.2's fixed 880px form column is SUPERSEDED for
  app pages. Long single line inputs stay capped inside their cards. Only `reading` pages (the
  changelog, help articles) are centred. The R2.9 row text that says "follow spec 9.2" is wrong and
  the owner decision wins. Correct the row text when you update it.
- The popover fix (organisation list opens upwards from the sidebar foot, one positioning rule in
  `web/src/shared/ui/side-flyout-position.ts`) is on production `f89e959`.

### What remains, do all of it

1. **Legacy widths.** The old row named nine routes with `72rem` or `64rem` fallback widths. Prove,
   with comments stripped, that no page, `loading.tsx`, `RouteSkeleton` or `PageLayout` call under
   `web/app` or `web/src` still applies a 72rem or 64rem cap. A grep hit in a comment is not a hit.
   List each of the nine routes with the line that now sets its width (`web/src/config/platformNav.ts`
   width set, `PageShell`, or `PageLayout`). If any real cap remains, fix it to the width set.
2. **Run the real browser check on staging.** The spec is `web/e2e/sidebar-layout-and-popovers.spec.ts`
   (read its header). The driver set up the account on 2026-10-30: the persona keys
   `R285_LAYOUT_EMAIL`, `R285_LAYOUT_PASSWORD`, `R285_LAYOUT_TENANT` are now in the git-ignored
   `web/.env.r285-walk` (the Overdue 1280 walk persona, now a member of 6 staging organisations, home
   organisation holds both products). Load that file the same way the existing staging walk does
   (read `web/e2e/r285-staging-walk/_walk.ts` and how the walk is normally started), never by
   printing it. Then from `web/`:
   `BASE_URL=https://staging-app.velstrian.com npx playwright test e2e/sidebar-layout-and-popovers.spec.ts --project=chromium --no-deps --workers=1`
   `R285_C5_BID_ID` is already in the same file.
3. **Classify every failure** as a SPEC defect (the test is wrong) or a PRODUCT defect (the page is
   wrong). Assert the landed URL and status before trusting any measurement (a login redirect or a
   404 is not a layout). Fix spec defects in the spec. Fix product defects in web code.
4. **Check the owner's two original reports by eye** in the same staging session, with screenshots
   saved under `web/test-results/r29-sidebar/`:
   - dark theme, sidebar expanded, window 1440x980: open the organisation switcher at the foot of the
     sidebar. All 6 organisations are reachable on screen, the list is not cut off, and the product
     rows above still scroll normally.
   - sidebar collapsed, window 1920x1080: `/support` and `/bid/new` fill the width beside the rail
     with no large empty band on the right, and expanding the sidebar narrows them.
5. If you changed product code: `pnpm tsc --noEmit` in `web/`, the vitest guards
   `anchored-position`, `shell-popovers-route-through-one-primitive`, `r285-sidebar-layout-and-popovers`
   and `page-top-container-width-set` (find their files by name), in ONE invocation, then rerun the
   Playwright spec once. Report collected and passed counts.

Done when: the spec runs green against staging with its collected count stated, both owner reports
check out by eye with screenshots, and no legacy cap remains. A product fix only goes live with the
next promote, so the row then reads BUILT, not FIXED.

## Part B, R29-STEP-WEB-REAL-SCREENSHOTS-01

**Settled by the driver (RULE 0-U, show do not explain):** the about page header takes a REAL product
capture, the drafted answer screen, replacing the designed picture.

1. Read `velstrian-website/docs/design/R285-REAL-SCREENSHOTS-PLAN.md` (section 8 explains why
   `about-hero` was left as a design) and the capture harness `web/e2e/product-captures/website.spec.ts`
   (one command, light theme at 2x, refuses production, writes the website WebP and
   `product-captures.real.json`).
2. Capture the drafted answer screen from staging for the `about-hero` slot. If the harness has no
   `about-hero` target, add one that reuses the existing drafted answer capture and its crop rules.
   Emails and personal names blurred, no "council", no retired brand words, no weak fit shown.
3. Put the picture on the website: in `velstrian-website`, on the branch from brief 02
   (`review/r29-agent-readiness`), so one owner approved push carries both. Keep the alt text plain
   and true (what the screen shows, for a first time small business reader). Mark it as a real capture
   in `product-captures.real.json`.
4. Verify: `npm run build` in `velstrian-website/astro` once, then the built `/about` page shows the
   new picture (screenshot it at 1280 and 390 from the local preview, under
   `velstrian-website/test-results/r29-about-hero/`). Check the picture size is no larger than the
   other hero captures (state both byte sizes).

## Commit, board and report

- Part A: branch `review/r29-sidebar-layout` from platform `main`. Commit
  `fix(ux): R29-STEP-P2-SIDEBAR-LAYOUT-AND-POPOVERS-01 <what>` (or `test(e2e): ...` if only the spec
  changed, which then rides with the walk evidence).
- Part B: on `review/r29-agent-readiness`, commit `feat(web): R29-STEP-WEB-REAL-SCREENSHOTS-01 about page header is a real drafted answer capture`.
- Update both rows: BUILT with sha7, branch, the spec collected and passed counts, the screenshot
  folders, and `not pushed`. If the spec is fully green with no product change needed, Part A is
  FIXED (the code is already live on production `f89e959`). Keep old text after `Was:`. Rebuild the
  board (platform `docs/AI-ONBOARDING-GUIDE.md` section 7.3), and update the website board item for
  the screenshots with `node status/add-issue.js` (find its A-number first, it was A-322).
- Report back, short: the nine routes table, the spec result (collected, passed, failed with each
  failure classified), the two eye checks, files changed with lines, sha7s, and anything not done
  and why.
