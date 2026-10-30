# Brief 06: Supabase email setup (Gemini, in the browser)

Row: R29-EMAIL-BREVO-SUPABASE-E2E-01 and R29-AUTH-STAGING-CAPTCHA-SECRET-01. Start after brief 05.
Sign in to dashboards as contact@velstrian.com. Never write a secret into chat, a file or a report.

## 1. Email templates (staging, then production)

Files: `C:\Users\bhave\Velstrian Repo\gemini-briefs\supabase-auth-templates\` (six `.html` files).

Supabase, project staging `ipgrnwvfnumgvnxkpxsc` then production `gujtuecjzfiqsdnzgyvo`,
Authentication, Email Templates. For each file:
- open the template named in the file's first comment
- set the subject from the file's first comment
- replace the body with the whole file
- save, reload, check the subject stuck

## 2. Captcha key (staging only)

Cloudflare, Turnstile, widget **Velstrian Marketing**, copy its secret key.
Supabase staging, Authentication, Attack Protection, provider Turnstile, paste the key, save.
Do not change production.

## Report

One line per template per project (saved yes or no), and "staging captcha key saved". Nothing else.
