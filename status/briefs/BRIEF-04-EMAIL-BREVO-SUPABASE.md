# Brief 04: email, Brevo and Supabase auth templates, end to end

Driver: Claude. Date 2026-10-30. Release R2.9. Row: **R29-EMAIL-BREVO-SUPABASE-E2E-01**, which also
carries R29-STEP-REBRAND-03-AUTH-EMAIL-TEMPLATES-01, the template paste tail of
R29-STEP-REBRAND-05-ARTWORK-AND-DESIGN-SYSTEM-01, R29-AUTH-STAGING-SEND-EMAIL-HOOK-URL-01 and
R29-STEP-BREVO-SENDER-CONTACT-01.

Part A is code, for Gemini. Part B is dashboards and a live test, for **Claude in Chrome**, and runs
after Part A is committed.

## How email works today (measured by the driver 2026-10-30, do not redesign it)

- **Every email is built in our own code** from the central brand tokens and sent through the Brevo
  API: 32 templates in `web/lib/email/templates/*.tsx` and the API shell in
  `api/app/services/email_shell.py`. Sender `contact@velstrian.com` (Brevo sender id 5).
- **Sign-in emails** (sign up, reset, invite, magic link, email change) go through the Supabase
  **Send Email hook** to `/api/auth/send-email-hook`, which renders `web/lib/email/templates/auth-email.tsx`
  and sends through Brevo. Supabase's own dashboard templates are only a FALLBACK if the hook is off.
- **Templates stored in Brevo are retired on purpose** (R285-P2-EMAIL-VENDOR-BRANDING-SETTINGS-01,
  `DASHBOARD_TEMPLATES_RETIRED = true` in `apps/portal/src/lib/api/brevo-client.ts`), because a
  template that lives in Brevo hardcodes colours no repo guard can see (RULE 0-C). **Never create new
  email templates in the Brevo dashboard.** A missing email is fixed in code.
- Brevo log, 29 to 30 October: every email since the 29 October promote came from contact@velstrian.com
  (password reset, reset code, new device sign-in). Older failure alerts came from support@ and
  support@crowagent.ai, before that promote.
- Brevo plan: **Free, 300 emails a day** (owner rule: free tier only). Domain velstrian.com is
  authenticated. The driver deactivated retired Brevo templates 2, 3, 5, 6 and 7. Templates 1 and 4
  are still active because the tool's permission check blocked those two.
- Staging Supabase Auth has captcha ON, so a sign-in email can only be triggered from a real browser.

## Part A, code (Gemini)

Hard limits: no push, no deploy, no dashboard, local commits on `review/r29-email-templates` from
platform `main`, commit by pathspec, targeted tests only, never print a secret. **Switch the repo back
to `main` when you finish.**

1. **Missing fallback templates.** `scripts/generate-auth-email-templates.mjs` emits only
   `confirmation`, `reset-password` and `welcome` into `web/lib/email-templates/`. Supabase has six
   auth templates: Confirm signup, Invite user, Magic link, Change email address, Reset password,
   Reauthentication. Extend the generator so it emits all six (HTML and `.txt`), same tokens, same
   shell, the correct Supabase variables for each (`{{ .ConfirmationURL }}`, `{{ .Token }}`,
   `{{ .NewEmail }}` and so on, check the Supabase docs for each type). Plain words for a first time
   small business user (RULE 0-U), no em dash, en dash or semicolon. Regenerate, then update
   `api/tests/test_email_templates.py` and `web/lib/email/__tests__/auth-email-templates.test.ts`
   and run them in one invocation.
2. **Rewrite `docs/EMAIL_TEMPLATES.md`.** It is stale: it says auth mail goes through Supabase SMTP,
   names "EPC lookup" (a decommissioned product) and an unwired drip. Replace it with the real
   inventory: one row per email the product sends (trigger, recipient, code file, sender, transactional
   or marketing, unsubscribe rule), built by reading the code (every `send_email`, `sendTransactional`,
   `renderEmailTemplate` call site, comments stripped). Then list **gaps**: any journey that should
   email and does not (for example a buyer invite reply, a bid deadline, a failed payment, a
   completed export), each as a recommendation for the owner, not a decision.
3. Commit `fix(email): R29-EMAIL-BREVO-SUPABASE-E2E-01 six Supabase fallback templates from the tokens`
   and `docs(email): R29-EMAIL-BREVO-SUPABASE-E2E-01 real email inventory and gaps`. Report files,
   test counts, sha7s and the gap list.

## Part B, dashboards and live test (Claude in Chrome)

Use Chrome signed in as **contact@velstrian.com** for Brevo and the Supabase organisation. Check the
signed in account first. Never read out, copy or screenshot an API key, hook secret or SMTP password.
Change only what is listed. Record each setting before and after.

### Supabase, staging `ipgrnwvfnumgvnxkpxsc` then production `gujtuecjzfiqsdnzgyvo`

1. Authentication, Hooks: the Send Email hook is ENABLED and points at
   `https://staging-app.velstrian.com/api/auth/send-email-hook` (staging) and
   `https://app.velstrian.com/api/auth/send-email-hook` (production). Report what you find. Change it
   only if it names any other host, and do not touch the secret.
2. Authentication, URL Configuration: Site URL is `https://staging-app.velstrian.com` (staging) and
   `https://app.velstrian.com` (production). The redirect list names only velstrian.com hosts and
   localhost. Report any crowagent.ai entry, and remove it only on production after reporting.
3. Authentication, Email Templates: paste each of the six generated files from Part A
   (`web/lib/email-templates/*.html`, subject from the file header) into the matching template. These
   are the fallback only.
4. Authentication, Rate Limits: report the email send limits, change nothing.

### Brevo

5. Templates: set templates 1 (`portal-user-invite`) and 4 (`trial-expiry-reminder`) to inactive,
   the same as the other five. Delete none.
6. Senders: deactivate or delete sender id 3 `support@velstrian.com`, so only `contact@velstrian.com`
   remains. The code already sends from contact@ (`api/app/config.py` SENDER_EMAIL).
7. Transactional, Settings and Logs: report the daily send count against the 300 limit, whether open
   and click tracking is on, and the blocked contacts list (count and reasons only, no addresses).
8. Do not create webhooks, templates, campaigns, automations or lists. Do not send to any address
   outside the test inboxes below.

### Live end to end test on staging (real browser, Turnstile solves itself)

9. On `https://staging-app.velstrian.com/forgot-password`, request a reset for
   `crowagent.platform+r285-team-owner@gmail.com`. Then sign up a new account at `/signup` with
   `crowagent.platform+r29-email-<yyyymmddhhmm>@gmail.com`.
10. In Gmail (crowagent.platform@gmail.com) confirm both emails arrived within 5 minutes, From
    `Velstrian Tenderworks <contact@velstrian.com>`, Velstrian branded, links pointing at
    staging-app.velstrian.com, no crowagent text, not in spam. Screenshot each email (no tokens visible:
    crop the link). Do not click the links.
11. In Brevo Logs, confirm both sends show `delivered`.

### Report back (short)

Per step: before, after, and evidence. The two received emails with their From, subject and the
landing host of the link. Anything blocked and why.
