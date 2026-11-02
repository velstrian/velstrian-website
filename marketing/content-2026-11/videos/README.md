# Product video series

Work item R29-CONTENT-KIRO-CREW-01, batch 2.

These are the scripts, shot lists, caption files and thumbnail specs for the product video series. They are drafts for review. Nothing is recorded or published here.

## Why there are no video files yet

Recording needs a browser driving the real staging site, screen capture, ffmpeg to encode, and the staging test accounts and gate keys. None of those are available on the crew machine, and the staging sign ins are secrets the crew must never request or hold. This is posted as a BLOCKER and an OWNER-DECISION in the channel. The owner chooses who records:

- Option A (recommended): the driver records from staging on the owner side and sends the raw clips back. The crew then burns in the captions from the SRT files here and builds the thumbnails to the specs here.
- Option B: the owner authorises installing a browser and ffmpeg on the crew machine and provides staging access through the secure channel the staging walk already uses.

Everything in this folder is written so that whoever records can follow it exactly, and so the captions and thumbnails drop straight on once the clips exist.

## Hard rules kept in every script and shot

- Record STAGING only (https://staging-app.velstrian.com), with the repo's staging test personas. Never production, never real customer data, never a real email or phone number on screen.
- Do NOT record or click any checkout, upgrade, buy credits or payment step. The staging checkout currently creates live Stripe sessions (P0 R29-STAGING-STRIPE-LIVE-KEY-01, still open per the channel). Every script marks where to stop.
- British English, sentence case, no em or en dashes, no semicolons in the voice over, no hype words.
- Names: Velstrian Tenderworks (company), Velstrian Bid, Velstrian Buy. Never an old name on screen or in copy.
- Claims: no win rate, no accuracy figure, no customer count, no testimonial, no compliance promise. Social value is PPN 026 only. Data line, where used: "Primary data stored in the EU".
- Captions on every video. Thumbnails use only the named brand tokens.

## Files

- `shot-list.md` the master shot list for every video, with the exact route, what to show and what to avoid, each cited to the product code.
- `script-supplier-long.md` long supplier walkthrough (Velstrian Bid), voice over plus on screen notes.
- `script-buyer-long.md` long buyer walkthrough (Velstrian Buy), voice over plus on screen notes.
- `script-shorts.md` the short cuts, 30 to 90 seconds each, one feature per short.
- `captions/` one SRT per video, timed to the voice over.
- `thumbnails/` one thumbnail spec per video (a text spec, not an image, until the clips exist).

## Video list

Long:
1. `supplier-long` Win more work with Velstrian Bid (full supplier journey)
2. `buyer-long` Run a fair, simple procurement with Velstrian Buy (full buyer journey)

Supplier shorts:
3. `s1-find` Find the right tenders
4. `s2-upload` Upload a tender pack
5. `s3-compliance` Build the compliance checklist
6. `s4-draft` Draft an answer from your own evidence
7. `s5-social-value` Add your social value answer
8. `s6-review-export` Review and export the submission
9. `s7-answer-library` Reuse your best answers

Buyer shorts:
10. `b1-requirement` Build a requirement
11. `b2-weighting` Set the weighting and rubric
12. `b3-evaluate` Run an evaluation
13. `b4-compare` Compare bids and whole life cost
14. `b5-award` Record the award and standstill
15. `b6-scorecards` Score a supplier after award

Each short has a caption file and a thumbnail spec. The two long videos do too.
