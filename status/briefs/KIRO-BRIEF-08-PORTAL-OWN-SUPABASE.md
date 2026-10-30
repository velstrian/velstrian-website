# Kiro brief 08: move the founders portal onto its own Supabase project

Owner of the work: a Velstrian team member, executing with Kiro. Driver and reviewer: Claude.
Row: **R29-PORTAL-OWN-SUPABASE-01** (Phase 1, P1) in `velstrian-platform/RELEASE-2.9-TRACKER.md`.
Written 2026-10-30. Read it fully before starting. Ask the owner when a step says so.

## 0. Before you start

1. Read `velstrian-platform/docs/AI-ONBOARDING-GUIDE.md` and `velstrian-platform/ENGINEERING-STANDARDS.md`.
   Rules that bite here: RULE 0-G (no push without the owner's written approval, state the cost
   first), 0-T (targeted tests only), 0-V (measure before you claim), 0-L (this machine's RAM is
   shared, stay above 1 GB free), IDENTITY (`Velstrian Tenderworks <platform@velstrian.com>`, never a
   personal name or email), secrets guide 3.7 (never print, paste or commit a key).
2. Work on branch `review/r29-portal-own-supabase` from platform `main`. Commit by pathspec. **Switch
   back to `main` when you stop for the day** (the :8099 board and other agents read `main`).
3. Access check. The new project is `upxwdxhqzdsjnpsftsfb` (free plan, owner created 2026-10-30).
   Confirm you can open it in the Supabase dashboard and through your Supabase tool. If you cannot,
   stop and ask the owner to add you to the organisation that holds it.

## 1. What the owner decided (fixed, do not reopen)

- The portal is internal (founders only). It gets its own Supabase project, separate from the
  platform database (production `gujtuecjzfiqsdnzgyvo`, staging `ipgrnwvfnumgvnxkpxsc`).
- **One database for both portal environments.** `staging-portal.velstrian.com` and
  `portal.velstrian.com` both use `upxwdxhqzdsjnpsftsfb`. A test on the staging portal therefore writes
  real portal data. Test with care and clean up what you create.
- Free plan. A free project pauses after a week with no activity and has no downloadable backups.
  Note this in your report, do not change the plan.

## 2. What exists today (measured by the driver 2026-10-30)

- The portal (`apps/portal`) has ONE Supabase connection, set by `NEXT_PUBLIC_SUPABASE_URL` (92 uses),
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (56) and `SUPABASE_SERVICE_ROLE_KEY` (37), built in
  `apps/portal/src/lib/supabase/` (`browser.ts`, `server.ts`, `admin.ts`, `environments.ts`,
  `identity.ts`). It points at the PLATFORM database today.
- 25 portal tables live in the platform production database, created by 7 migration files in
  `supabase/migrations/` (search `create table` for `portal_`): `portal_users` (5 rows, the founders),
  `portal_passkey_credentials`, `portal_passkey_challenges`, `portal_user_backup_codes`,
  `founder_sessions` (18), `founder_tasks`, `portal_audit_log` (about 2,035), `portal_workflow_runs`
  (about 6,405), `portal_workflows`, `portal_integrations` (38), `portal_approvals`, `portal_documents`,
  `portal_financials`, `portal_mrr_snapshots`, `portal_kb_articles`, `portal_tasks`,
  `portal_notifications`, `portal_notification_preferences`, `portal_events`,
  `portal_monitoring_alerts`, `portal_compliance_items`, `portal_beta_invites`, `portal_orgs`,
  `portal_rate_limits`, `portal_erased_operators`. Re-measure the list yourself first (step 3.1).
- 69 portal source files read `portal_*` tables. 18 read CUSTOMER tables (`organisations`,
  `product_subscriptions`, `profiles`, `organisation_members`).
- Portal sign in: Cloudflare Access in front, then a Supabase password grant with a Turnstile
  captcha token (`apps/portal/src/app/login/page.tsx:241`), plus the portal's own passkey ceremony
  (`apps/portal/src/lib/auth/passkey-*`). Production Supabase captcha is ON since 2026-10-30.

## 3. The work

### 3.1 Inventory (no changes yet)
Produce `docs/release-2.9/portal-own-supabase/INVENTORY.md`:
- every portal-owned table, view, function, trigger, RLS policy, storage bucket and cron job, from the
  migrations AND from the live platform database (both can differ, list both, flag differences)
- every `apps/portal` file and whether it reads portal data, customer data or both
- every place the PLATFORM app (`web/`, `api/`) reads or writes a `portal_*` table. These must keep
  working, so each needs a decision (move, API call, or stays)
- every env variable and dashboard setting the portal uses (names only, never values)

### 3.2 Design, then STOP for owner approval
Write `docs/release-2.9/portal-own-supabase/DESIGN.md` covering:
- **Two connections in the portal.** Portal connection (new project) for portal sign in and the
  `portal_*` tables. Platform connection (existing project), SERVER SIDE ONLY, for the customer data
  the portal shows and manages. Name them clearly, for example `getPortalSupabase()` and
  `getPlatformAdmin()`. The browser never holds a platform key.
- How the founders sign in after the move: their Supabase auth accounts, passkeys and backup codes
  are copied into the new project with the same user ids, so passkeys keep working. Say how you copy
  `auth.users` and `auth.identities` safely, and how you prove a founder can sign in before switching.
- Data copy method for the large tables (audit log, workflow runs), with row counts before and after.
- Cutover order and rollback: the portal keeps working on the old database until the switch, and the
  switch can be undone by changing env variables back.
- Env variable names and which Vercel environment each goes into (portal project, staging and
  production). New names for the portal database, existing names stay pointing at the platform.
- Supabase settings to copy to the new project: auth site URL and redirects for both portal hosts,
  captcha (Turnstile, the Velstrian Marketing widget's secret, the owner pastes it), email hook if the
  portal sends auth email, rate limits.
- Cost statement (RULE 0-G): free project, any new Vercel env change, deploys needed.
- **Stop here and send the design to the owner and the driver. Do not build until approved.**

### 3.3 Build (after approval)
- New migration set for the portal project under `supabase/portal/migrations/` (keep it apart from
  the platform migrations). Apply to `upxwdxhqzdsjnpsftsfb` only through the Supabase tool's
  `execute_sql`, never `db push` and never the Supabase CLI (platform rule, it replays 1,100 files).
- Portal code: split the connections as designed. Every customer data read goes through the server
  side platform connection. Tests for each changed file.
- Copy data and founder accounts. Show row counts per table, old and new, equal.
- Guard test: fails if any `apps/portal` browser code imports the platform connection, and fails if
  any `portal_*` table is read through the platform connection after the move.
- Verify locally: `pnpm tsc --noEmit` in `apps/portal`, the portal tests you changed, `next build` of
  the portal once.

### 3.4 Switch and clean up (each needs the owner's written approval)
1. Set the new env variables on the portal Vercel project (staging environment first).
2. Promote the portal to staging with the existing promote script, never a git deploy. Every founder
   signs in on staging-portal with password and passkey, and you walk the main portal pages.
3. Production: same, after the owner approves the production step.
4. Only after a week of the portal working on the new project: drop the `portal_*` tables from the
   platform databases with a migration, owner approved, and remove the old code paths.

## 4. Board and report

- Update the row R29-PORTAL-OWN-SUPABASE-01 at each step (OPEN, then WIP, BUILT when code is done and
  not live, FIXED when the owner confirms on production). Keep the old text after `Was:`. Commit the
  tracker on platform `main` only and rebuild the board (onboarding guide section 7.3).
- At each stop, report to the owner and the driver, short: what you measured, what changed (files,
  commits), test results with counts, what you need approved next.
