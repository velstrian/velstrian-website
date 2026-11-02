# Recorded clips

Recorded from staging (`staging-app.velstrian.com`) by the crew's headless recorder (`velstrian-platform/web/scripts/crew-record.mjs`), signed in as the staging test personas, with the Cloudflare Access and Vercel gate headers and the Cloudflare published test captcha token for the staging auth grant. No production, no real customer data, no checkout or payment screen (a Stripe route guard aborts any such request).

All files here are under 25 MB, so they are committed. If a future cut exceeds 25 MB it stays out of git and is listed with its path and checksum instead.

## Files

- `supplier-long-1920x1080.mp4` supplier walkthrough, horizontal.
- `supplier-long-1080x1920.mp4` supplier walkthrough, vertical.
- `supplier-long-1080x1080.mp4` supplier walkthrough, square crop.
- `supplier-long-1920x1080-captioned.mp4` supplier walkthrough with the SRT captions burned in (`captions/supplier-long.srt`).
- `buyer-long-1920x1080.mp4` buyer walkthrough, horizontal.
- `buyer-long-1080x1920.mp4` buyer walkthrough, vertical.
- `stills/` one PNG per shot, for thumbnails and carousel screens.

## Coverage note

The first pass recorded the org-level screens that exist for every persona (supplier: home, Opportunities, Answer library, Selection questionnaire, Workflows, Integrations; buyer: home, Requirement Builder, Pipeline, Value tracker). The per bid contract screens in the corrected shot list (tender, questions, Requirements, Response, social value, review, submission) need a seeded contract id for the persona and are the next pass once a contract id is confirmed, following the corrected shot list exactly (supplier 6 lands on Requirements, 8 on the Response page, submission stops before export).

Captions are burned in from the matching SRT in `../captions/`. Thumbnails follow `../thumbnails/thumbnail-specs.md`.
