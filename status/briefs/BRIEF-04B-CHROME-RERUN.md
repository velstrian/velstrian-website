# Brief 04B: Claude in Chrome rerun of brief 04 Part B

Row: **R29-EMAIL-BREVO-SUPABASE-E2E-01** and **R29-AUTH-STAGING-CAPTCHA-SECRET-01**. Date 2026-10-30.

Use Chrome signed in as contact@velstrian.com. Never read out, copy into chat or screenshot any secret.
Record every value before you change it.

## What the driver found after the first run

- Only three template files reached you because Gemini's six are on a review branch. They are now in
  `C:\Users\bhave\AppData\Local\Temp\claude\C--Users-bhave-Velstrian-Repo\bd02e4fc-4cc5-42b3-97ff-f10f89e3fc94\scratchpad\supabase-auth-templates\`.
  Each `.html` file starts with a comment giving the exact subject line and the dashboard template name.
- **The reset email never sent because of a captcha mismatch, not email.** Staging log at 16:48:51 UTC:
  `resetPasswordForEmail` failed with `captcha protection: request disallowed (invalid-input-response)`.
  There is one Turnstile widget, **Velstrian Marketing**, site key `0x4AAAAAADML7D0t7OQT4B4R`, which
  covers app, portal, staging-app and staging-portal. Staging Supabase must hold a secret that is not
  this widget's. Production Supabase has captcha OFF today (a fake token was accepted), which is why
  production resets work.
- **The signup was refused because the form posted country `AF` (Afghanistan), not GB**, three times
  (log `signup.business_only_refused`, market AF). Filed as R29-AUTH-SIGNUP-COUNTRY-POSTS-AF-01. For
  this rerun, pick the country by typing `United Kingdom` and clicking the option in the list, then
  check the field shows it before submitting.

## Steps

1. **Turnstile secret.** In Cloudflare (dash.cloudflare.com, account VELSTRIAN SYSTEMS LIMITED),
   Turnstile, widget Velstrian Marketing: open its settings and copy its secret key to the clipboard
   only. In Supabase **staging** `ipgrnwvfnumgvnxkpxsc`, Authentication, Attack Protection (Bot and
   Abuse Protection): confirm the provider is Turnstile and paste that secret, Save. Do NOT turn captcha
   on in production. Report only "secret replaced" or "already matched".
2. **Templates, staging then production.** Authentication, Email Templates. For each of the six
   templates (Confirm sign up, Invite user, Magic link, Change email address, Reset password,
   Reauthentication): set the subject from the file's comment, paste the whole `.html` file as the body,
   Save, reload the page and confirm the subject and the first heading persisted. This replaces the two
   you pasted earlier, which were the older versions.
3. **Brevo blocked contacts and tracking**, still unchecked: Transactional, Settings, report open and
   click tracking on or off, and Contacts, Blocked, count and reasons only. Confirm sender
   support@velstrian.com is gone and contact@velstrian.com is the only sender.
4. **Live test on staging.**
   a. `https://staging-app.velstrian.com/forgot-password` for `crowagent.platform+r285-team-owner@gmail.com`
      (this staging account exists, the driver checked).
   b. `/signup` with `crowagent.platform+r29-email-<yyyymmddhhmm>@gmail.com`, country United Kingdom
      chosen from the list, a valid format company number (any 8 digits, staging only), terms ticked,
      marketing unticked.
   c. In Gmail (crowagent.platform@gmail.com) both emails arrive within 5 minutes, From
      `Velstrian Tenderworks <contact@velstrian.com>`, Velstrian branded, links to
      staging-app.velstrian.com, not in spam. Screenshot each with the link cropped. Do not click links.
   d. Brevo, Transactional, Logs: both show delivered.
5. If step 4a still sends nothing, stop and report the time of the attempt so the driver can read the log.

## Report back (short)

Per step: before, after, evidence. For 4c the From, the subject and the link host of each email.
