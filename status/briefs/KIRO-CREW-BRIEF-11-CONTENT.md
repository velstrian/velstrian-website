# Kiro crew brief 11: knowledge base, product videos and an ultra premium social pack

Driver: Claude (reviews every deliverable). Executor: the Kiro crew. Date 2026-10-31. Release R2.9.

Row: **R29-CONTENT-KIRO-CREW-01** in `velstrian-platform/RELEASE-2.9-TRACKER.md`. It absorbs
`R286-PLATFORM-KNOWLEDGE-BASE-01`, `R286-PLATFORM-VIDEO-SERIES-01`, `R286-ONBOARDING-VIDEO-02` and
website item `A-506`. Read those rows first.

This is separate from the Kiro portal database move (`R29-PORTAL-OWN-SUPABASE-01`). Do not touch it.

## You work on your own machine: set up first

The driver works on another machine. Nothing in this brief refers to that machine's folders. Paths
below are relative to your own clones.

1. Clone or update both repositories and start from the latest `main`:
   - `https://github.com/velstrian/velstrian-platform` (product code, help articles, tokens)
   - `https://github.com/velstrian/velstrian-website` (public site, brand tokens)
   Run `git fetch origin` then `git switch -c review/r29-content-kiro-crew origin/main` in each.
   Check you are current: `git rev-list --count HEAD..origin/main` must print 0. A stale checkout
   gives wrong file paths and wrong screen names.
2. The brand spec `BRANDING-SPEC.md` lives in the owner's workspace and may not be in your clones.
   Use the tokens in `velstrian-platform/packages/tokens/src` and
   `velstrian-website/astro/src/styles/tokens.css` plus `brand.source.json`. If you need the spec,
   ask for it in the channel.
3. Your coordination channel (rules at the top, they bind you):
   http://192.168.1.63:8099/channels/kiro-crew-content.md . Post with the token the owner gave you
   (see the prompt). All questions, decisions, review requests and your final report go there.
4. Staging access for recording: you need staging test accounts and the Vercel staging access the
   repo's walks use (`velstrian-platform/web/e2e/r285-staging-walk`). If your machine does not have
   them, post a `BLOCKER` in the channel naming exactly what is missing. Never ask for a production
   login.

## Who it is for (RULE 0-U, the most important rule)

Small and mid size organisations that write bids THEMSELVES, with no bid team, bidding for PUBLIC
AND PRIVATE work. Every word must make the complicated work feel simple to a first time user from a
10 person firm. Plain words first, jargon only where needed and explained the first time. Name both
public and private buyers. One idea per piece. Show the real product, never stock photography.

## The three deliverables

### 1. Knowledge base (help centre)

- Source of truth for help articles: `velstrian-platform/web/lib/help-articles.ts` (the public help
  centre on velstrian.com is GENERATED from it, never edit the website copy directly).
- IMPORTANT, avoid a merge clash: the driver rewrote all 38 existing articles today on a branch you
  cannot see yet. So do NOT edit `help-articles.ts`. Put every NEW article in a new file
  `velstrian-platform/web/lib/help-articles-crew.ts`, in the same object shape as the entries in
  `help-articles.ts`, and list any change you would make to an EXISTING article in
  `velstrian-website/marketing/content-2026-11/knowledge-base-gaps.md`. The driver merges both.
- Cover every journey and feature of Velstrian Bid and Velstrian Buy that has no article yet:
  find, assess and win a contract; upload tender documents; requirements; drafting answers from
  your own documents; evidence vault; social value (PPN 026 only); reviews and approvals; exports;
  billing and plans; team and seats; integrations; and the Buy journeys (requirements, evaluations,
  supplier feedback). Map existing articles first and list the gaps.
- Each article: at least 300 words of real substance, what it is for, step by step in the product,
  what happens next, common problems. EVERY step and screen name must be confirmed in the code
  (`web/app`, components, i18n strings). Anything you cannot confirm is left out and listed.
  Prices, seats, credits and trial facts only through the catalogue helpers already used in
  `help-articles.ts` (never typed).

### 2. Product video series

- Supplier journey and buyer journey, each as one long walkthrough plus short cuts (30 to 90
  seconds) per feature, with burned in captions and a plain voice over script.
- Record REAL screens from STAGING only (`https://staging-app.velstrian.com`, test accounts from
  the repo's staging walk set up, `web/e2e/r285-staging-walk`). Never record production, never show
  real customer data, never a real email address or phone number on screen.
- Staging checkout currently creates LIVE Stripe sessions (P0 `R29-STAGING-STRIPE-LIVE-KEY-01`):
  do not record or click any checkout or payment step until the driver tells you it is fixed.
- Deliver: script (text), shot list, the video files (MP4, 1080p and 1080x1920 vertical), caption
  files (SRT), and a thumbnail per video.

### 3. Ultra premium social media pack

The bar: a top 1 percent B2B SaaS brand. Calm, confident, precise. Real product screens, generous
space, one message per slide, strong typography, motion that explains rather than decorates.

- **Carousels:** at least 12 promotional carousels (6 to 10 slides each, 1080x1350 and 1080x1080)
  for LinkedIn and Instagram: problem, how Velstrian solves it, the real screen, one plain call to
  action.
- **Autoplay posts:** at least 12 short looping videos (6 to 15 seconds, silent first with captions
  burned in, 1080x1350 and 1080x1920) that autoplay well in a feed: a feature in action, a before
  and after, a 3 step how-to.
- **Copy:** post text for each (LinkedIn, X, Instagram), hashtags kept short and relevant, alt text
  for every image.
- **Calendar:** a 6 week posting plan as a simple table, so the owner can approve and schedule.

## Brand and claims (all binding)

- **Design system (RULE 0-C):** colours, type, logo and spacing ONLY from the central sources:
  `velstrian-platform/packages/tokens/src`, `velstrian-website/astro/src/styles/tokens.css` and
  `brand.source.json`, and `velstrian-branding/BRANDING-SPEC.md`. Never invent or eyeball a colour.
  Name every token you used in your report.
- **Names:** the company is Velstrian Tenderworks. Products: Velstrian Bid and Velstrian Buy.
  Never "council" as a product name. Never CrowMark, CrowAgent or any old name.
- **Claims:** never a win rate, an AI accuracy figure, a customer count, a testimonial or logo you
  cannot prove, or a promise that the product makes anyone compliant. Positive wording is welcome
  ("follows ISO/IEC 27001", "UK GDPR compliant" where true), never a certificate we do not hold.
  Social value is PPN 026 only, never PPN 002. Data claim: "Primary data stored in the EU", never
  "EU data residency". Anything unverifiable goes in a REVIEW list in the report, not in the post.
- **Writing (RULE 0-S):** British English, sentence case, no em or en dashes, no semicolons in
  prose, no hype words (revolutionise, harness, unleash, cutting edge, game changing).
- **Accessibility:** captions on every video, alt text on every image, text contrast meeting WCAG AA
  against the token colours, nothing flashing.

## Hard limits

- **Publish nothing.** No post, upload, schedule, ad spend, or push to any social account, website
  or app. Everything is a draft for the owner's approval.
- **No push** to any git remote. Work on a branch named `review/r29-content-kiro-crew` in each repo
  you change. Never edit `vercel.json`. A push to website `main` is a production deploy and is never
  yours to do.
- **Money:** free tools only. Anything that costs money (paid stock, paid music, paid AI, a paid
  plan) is a question to the owner with the price first. AI generated imagery only if it is clearly
  better than a real product screen, and never of people presented as customers.
- **Secrets and data:** never put a key, password, real email or real phone number in any file,
  frame or caption.
- **Shared machine (RULE 0-L):** keep free RAM above 1.5 GB on the machine you run on, one browser
  at a time, and never kill a process you did not start.
- Identity for commits: `Velstrian Tenderworks <platform@velstrian.com>`. Commit by pathspec.

## Where to put things

- Knowledge base: edits to `velstrian-platform/web/lib/help-articles.ts` (and related help sources)
  on your review branch, with the existing help guard tests passing.
- Videos, social pack and scripts: a new folder `velstrian-website/marketing/content-2026-11/` on
  your review branch, organised as `knowledge-base-gaps.md`, `videos/`, `social/carousels/`,
  `social/autoplay/`, `social/copy.md`, `social/calendar.md`. Keep large binaries out of git if
  they are over 25 MB each: list their location and checksum instead.

## Report and handover

Commit everything on `review/r29-content-kiro-crew` in your clones. Do NOT push: a push needs the
owner's own approval. When a batch is ready, post a `REVIEW-REQUEST` in the channel. When all is
done, post your report in the channel as one message (or `part 1 of n` if longer than 30 KB) and add
it to your branch as `velstrian-website/marketing/content-2026-11/REPORT.md`. The owner then decides
how the branch reaches the driver (an approved push of the review branch). Your report covers:

- the knowledge base gap list and the articles added, with word counts
- every video and social asset with its file path, size and one line on its message
- the tokens used
- the REVIEW list of claims you could not verify
- anything you left out and why

Do not edit the tracker yourself (the driver owns it and updates `R29-CONTENT-KIRO-CREW-01` from your
channel messages). The driver reviews and asks the owner to approve publishing, piece by piece.
