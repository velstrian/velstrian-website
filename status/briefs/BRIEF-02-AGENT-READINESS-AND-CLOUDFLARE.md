# Gemini brief 02: velstrian.com agent readiness (website code) and Cloudflare dashboard changes

Driver: Claude (reviews your work). Executor: Gemini. Date 2026-10-30. Release R2.9.

Rows: **R29-WEB-AGENT-READINESS-AND-CLOUDFLARE-HARDENING-01** (website board A-504) and
**R29-STEP-REBRAND-08-WEBSITE-01**. Repo: `velstrian-website`.

Part A is website code. Part B is four Cloudflare dashboard changes. Do Part B only the way it is
written, change nothing else in Cloudflare.

## Read first

`velstrian-website/CLAUDE.md`, `velstrian-website/GEMINI.md`, `velstrian-platform/ENGINEERING-STANDARDS.md`
(rules 0-G, 0-T, 0-L, 0-S, 0-U, IDENTITY). Where `GEMINI.md` says Gemini changes no code, this brief
wins for this task only: the owner authorises code changes and LOCAL commits on a `review/*` branch.

## Hard limits

- **No push.** A push to website `main` is a production Cloudflare deploy and needs its own owner
  approval. No `wrangler deploy`, no dashboard change.
- No em dash, en dash or semicolon in any user facing text (the deploy fails on an em dash).
- Never open or print `.env*`, keys or tokens. Identity is `Velstrian Tenderworks <platform@velstrian.com>`.
- Free RAM must stay above 1 GB. One heavyweight (the astro build) at a time.
- Commit by pathspec, `git commit -- <paths>`, never `git add .`.

## Measured by the driver on 2026-10-30

isitagentready.com scan of https://velstrian.com: **level 2 Bot-Aware**. Passing: robots.txt, sitemap,
Link headers (service-doc, describedby), AI bot rules, Content Signals. The only requirement for
level 3 Agent-Readable is Markdown content negotiation. Failing but out of scope (no such service
exists, publishing them would describe nothing real): API catalog, OAuth discovery, MCP server card,
A2A card, agent skills, WebMCP, DNS-AID, ARD, personal agent protocol. Commerce checks are neutral.

# PART A, website code

## Task 1, Markdown twins with content negotiation (free plan)

Cloudflare's Markdown for Agents switch is Pro plan only, and the owner rule is free plan only, so
build it in the site.

1. First find how the site is served today: Pages static assets, a Pages Function, or the Worker in
   `cloudflare-workers/` (`wrangler.toml`, `marketing-edge-cache.ts`, `tools-bot-conditional.ts`).
   Report which. If an existing Worker or Function already runs on every HTML request, add the
   negotiation there so no new invocation is billed. If adding it means a NEW Worker or Function on
   every request, STOP and report the expected requests per day against the free 100,000 per day
   limit before building.
2. At build time emit a Markdown twin of every public HTML page (`/pricing` gets `/pricing.md`, `/`
   gets `/index.md`). Main content only (no nav, footer, cookie banner), keep headings, links and any
   JSON-LD as a fenced json block at the end. A small Astro integration or a post build script over
   `dist/` is fine. Add it to the existing build script so it runs every build.
3. When a request carries `Accept: text/markdown`, serve the twin with
   `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`. Browsers still get HTML. Every
   HTML response also gets `Vary: Accept` and a
   `Link: </path.md>; rel="alternate"; type="text/markdown"` alongside the existing Link values in `_headers`.
4. Read every block you edit, comments included. A file that warns against your change outranks this
   brief, so report the conflict and stop.

## Task 2, auth.md heading

`auth.md` H1 is `# Signing in to Velstrian`. The scanner needs an H1 containing `auth.md`. Change it
to `# Velstrian auth.md` and keep the body. If an existing test or the brand guard asserts the old
heading, update it in the same commit.

## Task 3, Content Signals (owner approved 2026-10-30)

`robots.txt` line `Content-Signal: ai-train=no, search=yes, ai-input=no` becomes
`Content-Signal: ai-train=no, search=yes, ai-input=yes`. Update the comment so it states why: the
site wants to be cited in AI answers, and training stays off. Change it wherever the robots source
lives (root `robots.txt`, `astro/public`, or a generator). Find all copies first.

## Task 4, R29-STEP-REBRAND-08-WEBSITE-01

`astro/src/data/site-facts.json` lines 520 and 572 are evidence strings saying HSTS was measured on
`app.crowagent.ai`. Reword to `app.velstrian.com` (re-measured 2026-10-30: it sends
`max-age=31536000; includeSubDomains; preload`, the root site sends `max-age=63072000`). Leave line 69
(`status.crowagent.ai`), it is the banned host guard. Run `astro/scripts/check-site-facts.mjs`.

## Verify (targeted only)

- `npm run build` in `astro/` once, green, and the count of `.md` twins written equal to the count of
  HTML pages in `dist/` (state both numbers).
- Serve `dist/` locally the way production serves it (`wrangler pages dev` or `wrangler dev` for the
  Worker), then:
  `curl -sI -H "Accept: text/markdown" http://localhost:<port>/pricing` returns `text/markdown` and
  `Vary: Accept`, and the same without the header returns `text/html`. Paste both.
- `check-brand-names.js`, `check-site-facts.mjs`, and only the tests that cover the files you touched.

## Commit and board

- Branch `review/r29-agent-readiness` from website `main`. One commit per task, messages
  `feat(agents): R29-WEB-AGENT-READINESS-AND-CLOUDFLARE-HARDENING-01 <what>` and
  `fix(copy): R29-STEP-REBRAND-08-WEBSITE-01 HSTS evidence names app.velstrian.com`.
- Set both platform rows and A-504 to `BUILT 2026-10-30 - <sha7s> on review/r29-agent-readiness,
  not pushed, waits on the owner website push approval`. Keep the old text after `Was:`. Rebuild the
  board (platform `docs/AI-ONBOARDING-GUIDE.md` section 7.3).

## Report back (short)

How the site is served, files changed with lines, the build numbers, the two curl outputs, the
sha7s, anything not done and why.

---

# PART B, Cloudflare dashboard

**Owner approval, 2026-10-30:** Gemini may make exactly the four dashboard changes below in the
Cloudflare dashboard, in the browser, on zone `velstrian.com`. Nothing else. This overrides the
"no settings changes" line in `GEMINI.md` for these four changes only.

## Before you start

- Sign in to https://dash.cloudflare.com as **contact@velstrian.com** (owner rule, every third party
  dashboard uses that account). Check the signed in account in the top right before any change.
  Account name: VELSTRIAN SYSTEMS LIMITED.
- Never print, copy or screenshot an API token, service token secret or key. If one is on screen,
  report only its NAME.
- No DNS change, no SSL/TLS change, no change to any other rule, app or setting.
- Write a note of every value BEFORE you change it, so each change can be undone.

## Already done by the Cloudflare agent, verify only

Early Hints is ON (Speed, Optimization). Confirm it reads On. Change nothing.

## Change 1, WAF custom rule (block scan paths)

Security, Security rules, Create rule, Custom rule.
- Name: `Block common scan paths`
- Expression (Edit expression):
  `(starts_with(http.request.uri.path, "/.env")) or (starts_with(http.request.uri.path, "/.git")) or (starts_with(http.request.uri.path, "/wp-admin")) or (starts_with(http.request.uri.path, "/wp-login.php")) or (starts_with(http.request.uri.path, "/xmlrpc.php"))`
- Action: Block. Deploy.

Test: `curl -s -o /dev/null -w "%{http_code}" https://velstrian.com/.env` gives 403, and
`https://velstrian.com/pricing`, `https://app.velstrian.com/login` and `https://api.velstrian.com/health`
give the same status as before the rule (measure all three BEFORE deploying, then after).

## Change 2, rate limiting rule (auth endpoints on app.velstrian.com)

The Cloudflare agent asked for paths on api.velstrian.com. **There are none.** The driver measured
the code on 2026-10-30: the API has no sign in or password reset endpoint. Password sign in goes
from the browser straight to Supabase (which has its own limits and Turnstile). The account
recovery endpoints live on the web app, **app.velstrian.com**, which is proxied by Cloudflare.

Security, Security rules, Create rule, Rate limiting rule.
- Name: `Rate limit account recovery endpoints`
- Expression:
  `(http.host eq "app.velstrian.com" and (starts_with(http.request.uri.path, "/api/auth/password-reset/") or http.request.uri.path eq "/api/auth/reset-password" or http.request.uri.path eq "/api/auth/unlock" or http.request.uri.path eq "/api/auth/accept-invite" or starts_with(http.request.uri.path, "/api/auth/email-change")))`
- Characteristic: IP. Period 10 seconds. Requests: 20. Action: Block. Duration: 10 seconds (the
  free plan fixes these, take what it allows and report it).
- **Must NOT match** `/api/auth/send-email-hook` (Supabase calls it from a few shared IPs, blocking it
  stops every auth email), `/auth/callback`, any Stripe or webhook path, or anything on
  api.velstrian.com. The expression above already avoids them, do not widen it.
- The free plan allows one rate limiting rule. If one already exists, stop and report it.

Test: one `curl -s -o /dev/null -w "%{http_code}" -X POST https://app.velstrian.com/api/auth/password-reset/request -H "Content-Type: application/json" -d "{}"`
returns the same status as before the rule (a 4xx for an empty body is fine). Do NOT send 20
requests to trip it, and never put a real email address in the body.

## Change 3, binding cookie on the portal Access app

Zero Trust, Access, Applications, **Velstrian Portal** (covers portal.velstrian.com and
staging-portal.velstrian.com), Edit, Settings or Advanced, **Binding Cookie** On, Save. Only that app.

Test: open https://portal.velstrian.com in a fresh window, complete the Access sign in, and confirm
the portal home loads. If sign in breaks, turn the cookie Off at once and report.

## Change 4, remove leftover test emails from the staging Access app

**Velstrian Staging App**, policy **Named testers**. Remove ONLY these six, which are one-off
leftovers written by the portal invite Playwright spec (`apps/portal/tests/e2e/forms/customer-invite.spec.ts:125`
creates a fresh `e2e-invite-<timestamp>@example.com` each run, so nothing reuses them):

- e2e-invite-1790438270661@example.com
- e2e-invite-1790440894306@example.com
- e2e-invite-1790505102678@example.com
- e2e-invite-1790513120253@example.com
- e2e-invite-1790620625998@example.com
- e2e-invite-1790621088948@example.com

Leave every gmail.com address and the service token policy exactly as they are. The owner decides
those. Do not touch the Velstrian Portal policy list.

## Part B board and report

- Update R29-WEB-AGENT-READINESS-AND-CLOUDFLARE-HARDENING-01 in
  `velstrian-platform/RELEASE-2.9-TRACKER.md`: prefix the status with
  `2026-10-30 dashboard: Early Hints on (verified), WAF scan path rule <id>, rate limit rule <id>,
  binding cookie on Velstrian Portal, 6 e2e test emails removed from staging.` Keep OPEN while the
  website code half (brief 02) is not BUILT. Keep the old text after `Was:`. Rebuild the board
  (`docs/AI-ONBOARDING-GUIDE.md` section 7.3). Do the same on website board item A-504 with
  `node status/add-issue.js --id A-504 --note "..."`.
- Report back, short: for each change the before value, the after value read back from the
  dashboard, the rule ids, and every curl status before and after. Anything you could not do and why.

## Why only these four (driver verdicts on the 15 audit findings, for the record)

Driver verdicts on the 15 findings, measured 2026-10-30.

| # | Finding | Verdict |
|---|---|---|
| 1 | Enable HSTS | NO CHANGE. Already sent by the site, max-age 63072000, includeSubDomains, preload. Edge HSTS would duplicate it |
| 2 | Minimum TLS 1.3 | NO CHANGE. Keep 1.2, older public-sector and corporate proxies still need it. TLS 1.3 is already on |
| 3 | DMARC p=reject | ALREADY A ROW, R29-EMAIL-DMARC-REJECT-01, earliest 2026-11-12 after two clean weeks. Add adkim=s and aspf=s then, after confirming Brevo DKIM aligns |
| 4 | SPF -all | WITH ROW 3 on 2026-11-12, only after every sender is listed. Today SPF is `include:_spf.mx.cloudflare.net ~all` |
| 5 | Proxy status.velstrian.com | NO CHANGE. It is a CNAME to Better Uptime, whose custom domain certificate needs DNS only |
| 6 | Auto Minify | NO CHANGE. Cloudflare retired Auto Minify in 2024, and Astro already minifies |
| 7 | Early Hints | APPLY |
| 8 | 0-RTT | NO CHANGE. api.velstrian.com is on this zone and 0-RTT allows replay of POST requests |
| 9 | www to root redirect | ALREADY DONE. www.velstrian.com/pricing answers 301 to velstrian.com/pricing |
| 10 | Rate limit the API | APPLY WITH CARE. Never per IP on all of api.velstrian.com, because the web app calls the API from a few Vercel server IPs and one rule would throttle every customer. Free plan gives one rule. Limit only sign in and password reset paths, about 20 requests per 10 seconds per IP, action Block, and exclude the Stripe webhook path |
| 11 | WAF custom rule | APPLY. One rule, all hosts: block paths starting `/.env`, `/.git`, `/wp-admin`, `/wp-login.php`, `/xmlrpc.php` |
| 12 | Access email lists | REVIEW FIRST. The `e2e-invite-*@example.com` entries may be used by the staging Playwright walks, so check before removing. The portal list is the owner's call |
| 13 | Cache rules | NO CHANGE for app.velstrian.com, Vercel already serves immutable asset headers. Website static assets already cache |
| 14 | Rocket Loader | NO CHANGE. It rewrites script tags and would break the site's CSP script hashes |
| 15 | Access binding cookie | APPLY on the portal and staging portal apps, then sign in once to confirm |

The Cloudflare agent applied Early Hints on 2026-10-30. It could not do the WAF rule, the rate limit or the binding cookie (its token has no write permission) and listed the Access emails without changing them.
