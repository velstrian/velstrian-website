# Gemini brief 09: why portal features fail on production

Driver: Claude (reviews your work). Executor: Gemini. Date 2026-10-31. Release R2.9.

Row: **R29-PORTAL-PROD-FEATURES-FAILING-01** (P0, first in the queue), in
`velstrian-platform/RELEASE-2.9-TRACKER.md`. Read the row first. The owner reports that portal
features fail on production even after the live Stripe key was set, and that most portal features
have issues.

This brief is a MEASUREMENT. You find every failing feature and its real cause, with evidence. You
do not fix production.

## Hard limits

- **Read only on production.** No deploy, promote, push, migration, SQL write, dashboard change,
  environment variable change or Stripe write. Read only SQL (`select`) through the Supabase MCP is
  allowed. Anything that would change production is a finding to report, never an action.
- **Do not touch the portal Supabase move.** `R29-PORTAL-OWN-SUPABASE-01` (project
  `upxwdxhqzdsjnpsftsfb`) belongs to a team member working in Kiro. Note how it affects your findings,
  but change nothing there.
- **Secrets (guide section 3.7).** The Cloudflare Access service token is in
  `velstrian-platform/.env.cf-access`. Load it from that file inside a script and send it as the
  `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers. Never print it, never put it on a
  command line, never paste it into a file, a log or a report.
- **RULE 0-V.** Do not assume the Stripe key is the cause. Every finding states what you measured,
  the HTTP status, the landed URL (a 302 to the Access login is NOT a measurement of the feature) and
  the stored error string from Sentry, Vercel runtime logs, Railway logs or the database.
- **Shared machine (RULE 0-L).** Keep free RAM above 1 GB. One browser session at a time. Never kill
  a process you did not start.
- Identity `Velstrian Tenderworks <platform@velstrian.com>`. Commit by pathspec. No em dash, en dash
  or semicolon in what the owner reads.

## Tools you have

Chrome DevTools MCP, Sentry, Vercel, Railway, Supabase (`supabase` for the platform organisation,
`supabase-portal` for the new portal project), PostHog, Stripe (read only).

## Steps

1. **List the portal features.** Read `velstrian-platform/apps/portal/src` (routes, pages and the API
   calls each one makes). Produce the feature list: name, route, and the backend calls it depends on
   (portal API routes, platform API on Railway, Supabase tables, Stripe).
2. **Find where production portal is served and what it talks to.** From the Vercel MCP: the
   `crowagent-portal` project, its latest production deployment, its git sha and the NAMES (never
   the values) of its production environment variables. Report which Supabase project and which API
   host those names point at, from the code that reads them.
3. **Collect the errors that already exist.** Sentry: unresolved issues for the portal in the
   `production` environment over the last 14 days, with last seen, event count and user count.
   Vercel: runtime errors and logs for the portal production deployment over the last 7 days.
   Railway: production API logs filtered to requests from the portal. Group by route.
4. **Walk each feature on production.** Through `https://portal.velstrian.com` with the Access
   headers (Chrome DevTools MCP or a script). Assert the status code and the landed URL first. For
   each feature record: works or fails, the failing network call, its status and response body
   (secrets redacted), and the console error.
5. **Match each failure to a root cause** with evidence: missing or misnamed environment variable,
   wrong host after the rebrand (`crowagent` against `velstrian` domains), Supabase RLS denial
   (shows as 200 with `[]`), missing table or column, Stripe mode or key mismatch, CORS, auth or
   session cookie domain. Name the file and line in the code where it breaks.
6. **File the rows.** One R2.9 row per DISTINCT root cause in `RELEASE-2.9-TRACKER.md`, ID
   `R29-PORTAL-PROD-<SHORT-NAME>-01`, `[SEV:..][LANE:PORTAL][PHASE:1]`, status `OPEN 2026-10-31`,
   with the features it breaks, the evidence and the fix you recommend. Update
   `R29-PORTAL-PROD-FEATURES-FAILING-01` to list the rows you filed. Commit the tracker on platform
   `main` by pathspec, then rebuild the board with the Refresh button on
   `http://localhost:8099/#platform`.

## What you hand back

A short report in `gemini-briefs/BRIEF-09-REPORT.md`:

- a table of every portal feature: works or fails, failing call, status, error string, root cause row
- the rows you filed, with severity
- what you could NOT measure and why (for example a feature that needs a real customer account)
- anything that looked like it needed a production change, as a question for the owner

## When you finish

Both repositories back on `main`. No uncommitted changes left except your report.
