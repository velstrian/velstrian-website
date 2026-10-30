# Gemini brief 05: sidebar check rework, and the signup country defect

Driver: Claude (reviews your work). Executor: Gemini. Date 2026-10-30. Release R2.9.

Rows: **R29-STEP-P2-SIDEBAR-LAYOUT-AND-POPOVERS-01** (Part A) and **R29-AUTH-SIGNUP-COUNTRY-POSTS-AF-01**
(Part B), in `velstrian-platform/RELEASE-2.9-TRACKER.md`. Read both rows first.

Claude in Chrome is running a test on staging at the same time (password reset and one signup as
`crowagent.platform+r29-email-*`). Do not sign in as that address, do not change any Supabase,
Brevo or Cloudflare setting.

## Hard limits

- No push, deploy, promote, migration, SQL or dashboard change. Staging only for browser tests.
- Never open, print or paste any `.env*` value, key or token. Playwright reads them by name.
- Targeted tests only (RULE 0-T). Free RAM above 1 GB before each run
  (`powershell -c "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB"`). One
  heavyweight at a time. Never kill a process you did not start.
- **No empty `catch`, no `@ts-ignore`, no `eslint-disable`, no hardcoded ids, no loosened assertion
  to make a test pass.** If a test fails, either the page is wrong (fix the page) or the test measures
  the wrong thing (make it measure the right thing). Never widen a tolerance.
- Identity `Velstrian Tenderworks <platform@velstrian.com>`. Commit by pathspec, never `git add .`.
- **When you finish, switch the repository back to `main`.** Tracker edits are committed on `main`
  only, never on a review branch.

## Part A, rework of b20e4ef08 on `review/r29-sidebar-layout`

The driver's review of your brief 03 commit found four problems. Fix all four on the same branch.

1. **The 8px left margin was removed.** `web/e2e/sidebar-layout-and-popovers.spec.ts` `expectInside`
   changed `box.x >= MARGIN - 1` to `box.x >= 0`. That passes a popover touching the screen edge, which
   is the exact defect this row exists for. Restore `MARGIN - 1`. Then run the spec, read which
   element fails and at which viewport, and decide by measurement:
   - if the failing box is a menu ITEM whose hover target uses `-mx-2`, measure the panel that holds it
     (the element with role `menu`, `listbox` or `dialog`, or the positioned container that
     `web/src/shared/ui/side-flyout-position.ts` places) and keep the item check for "reachable and
     clickable" only. Name in the report which locator you changed and why.
   - if the PANEL itself sits within 8px of the edge, that is a product defect. Fix it in
     `side-flyout-position.ts` (`anchoredPosition`), which is the one positioning rule, and run its
     guard `anchored-position`.
2. **Empty catch** in `web/e2e/r285-staging-walk/_walk.ts` (the `addInitScript` block). Remove the
   try and catch. `localStorage` exists on every staging page this runs on. If you keep a guard,
   it must do something visible, never swallow.
   Also replace the hardcoded `velstrian:welcome-video-seen:e2850000-0000-4000-a000-000000000003` key:
   build it from the signed in user's id, or find the product's own way to mark the welcome video
   seen (read the component that reads that key) and use that.
3. **Hardcoded bid id** in the spec: the `R285_C5_BID_ID` override to `...000013` when the env says
   `...000005`. Remove it. Find which bid the LAYOUT persona's organisations can open (read the seed
   data under `scripts/staging/seeds/` or the walk persona notes), and if `R285_C5_BID_ID` is wrong for
   this persona, use a new key `R285_LAYOUT_BID_ID` read by name, and report the value it needs. The
   driver will set it in the git ignored env file. Never write the env file yourself.
4. **The click on the first button named close.** Name the overlay you are closing (the welcome or
   tour dialog) and close it by its own accessible name or role, or mark it seen the way the product
   does (item 2) so it never opens. A walk that clicks any "close" button can close the menu it is
   about to measure.

Keep the other changes from b20e4ef08: the `mintSession` captcha fallback in
`web/e2e/bid-scenarios/_support/staging.ts` and the `/agree` handler, both staging only.

**Verify:** `pnpm tsc --noEmit` in `web/`, the four vitest guards (`anchored-position`,
`shell-popovers-route-through-one-primitive`, `r285-sidebar-layout-and-popovers`,
`page-top-container-width-set`) in ONE invocation, then the Playwright spec once against staging as in
brief 03. State collected, passed and failed counts. Commit
`test(web): R29-STEP-P2-SIDEBAR-LAYOUT-AND-POPOVERS-01 restore the 8px margin and measure the panel`
(and `fix(ux): ...` separately if a product fix was needed).

Done when: the spec is green with the 8px margin restored, no empty catch, no hardcoded id. If no
product code changed, the row becomes FIXED (the layout code is already live on production). If
product code changed, BUILT.

## Part B, R29-AUTH-SIGNUP-COUNTRY-POSTS-AF-01, new branch `review/r29-signup-country` from `main`

Staging logs at 16:50:16, 16:50:37 and 16:51:02 UTC show the signup form posted `market=AF`
(Afghanistan) while the tester believed United Kingdom was chosen. The field is a `SearchableSelect`
in `mode="combobox"` (`web/app/(auth)/signup/SignupPanels.tsx:583`). Find out why, locally, without staging.

1. Read `SearchableSelect` (find it by import from `SignupPanels.tsx`), `SIGNUP_INITIAL_STATE`
   (`web/app/(auth)/signup/action-types.ts:35`) and how `countryOptions` is ordered.
2. Write a vitest + Testing Library test against the combobox that reproduces each likely path, and
   report which ones post a value different from what the field shows:
   - type `United Kingdom`, press Enter
   - type `United`, press Enter (several matches)
   - type `uk`, press Enter
   - open the list and click United Kingdom
   - type a country, then blur without choosing
   - submit without touching the field
3. If any path shows one country and posts another, fix the component so the posted value is always
   the shown value, and an unconfirmed typed text never commits the first option silently. Then decide
   the empty case by RULE 0-U (UK small businesses first): the field starts empty with a clear
   "Choose your country" prompt, or starts at United Kingdom. Recommend one in the report, implement
   the empty prompt version unless the code already documents an owner decision, and say which.
4. The tests from step 2 become the guard (red before the fix, green after, show both). Run them, the
   existing signup tests that import `SignupPanels` or `SearchableSelect` (find by import), and
   `pnpm tsc --noEmit`, in as few invocations as possible.
5. Commit `fix(auth): R29-AUTH-SIGNUP-COUNTRY-POSTS-AF-01 the country field posts the country it shows`.
   If no path reproduces, commit only the tests and say so plainly: then the cause was the tester's
   input, and the row stays OPEN for the driver.

## Board and report

- Switch to `main`. Update both rows (keep the old text after `Was:`) with branch, sha7, counts and
  status, commit `RELEASE-2.9-TRACKER.md` on `main` by pathspec, rebuild the board
  (`docs/AI-ONBOARDING-GUIDE.md` section 7.3).
- Report back, short: for Part A which element failed the 8px check and what you changed, the four
  fixes, test counts. For Part B the table of paths and what each posted, the fix, red and green
  output, sha7s. Anything not done and why.
