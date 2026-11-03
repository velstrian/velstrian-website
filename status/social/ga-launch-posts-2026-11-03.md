# Velstrian GA launch posts, 2026-11-03

Row R29-GA-SOCIAL-LAUNCH-01. Decisions D533 (free only, every post approved by email) and D535 (the accounts and the approvers).

Rules for this file:

- Every post needs an approval record in `approvals.json` before it can be published. `node post-approvals.mjs` enforces it.
- An approval binds to the exact text. If a post body changes after approval, the approval no longer counts and the post must be approved again.
- Publish only after production is live with open sign up (the app is invite only until then, site-facts `product_status`).
- Every fact below is listed with its source under `Sources`. `site-facts` means `astro/src/data/site-facts.json` and `site-facts.ts` in the website repo. `pricing` means `astro/src/data/pricing.ts`, which mirrors `packages/pricing/catalogue.ts`.
- Image paths are existing website assets, relative to the website repo. The videos live in the website worktree `C:/w/vw` until they land in the main folder.

## P01 | linkedin-page | LinkedIn company page
Account: https://www.linkedin.com/company/-velstrian/
Format: Text post, about 1,300 characters (LinkedIn limit 3,000). Image attached.
Image: astro/public/banner-social.png
Sources: site.ts BRAND_LINE and SITE_SUMMARY; site-facts sources.live and sources.refresh; site-facts fit_dimensions; site-facts ai_use B1, B2, K1, D1; site-facts trust_strip T1; site-facts upload.start_a_bid; app.ts SIGNUP_URL; pricing TRIAL_NOTE

```text
Velstrian Bid is now available to small and mid size firms.

Qualify. Draft. Prove it.

If you write your own bids, with no bid team, Velstrian Bid is built for you. It works for public tenders and for private requests for proposal.

What it does for you:
1. Finds contracts that suit you, from Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED, refreshed daily.
2. Shows how well each contract fits you, on seven things: sector, social value, capacity, geography, timeline, evidence and market.
3. Reads the tender pack and lists every question and requirement the buyer sets.
4. Drafts each answer from your own documents and past answers. You review, edit and approve every answer, and you submit it yourself.

Your content is not used to train AI models. Your data is stored in the EU, in Ireland.

How to start:
1. Create your account at https://app.velstrian.com/signup
2. Upload the tender as PDF, Word, text, Excel or CSV.
3. Answer the questions using your own documents.

Your first 7 days are free. A card is needed to start.

Buying rather than bidding? Velstrian Buy helps buyers set out what they need and compare the replies.

#bidwriting #tenders #UKprocurement
```

## P02 | linkedin-profile | LinkedIn profile
Account: https://www.linkedin.com/in/velstrian-systems-ltd-690114447
Format: Text post, about 800 characters. Image attached.
Image: astro/public/assets/videos/v-draft-poster.webp
Sources: site.ts SITE_SUMMARY and BRAND_LINE_SUB; site-facts ai_use B2 and K1; app.ts SIGNUP_URL; pricing TRIAL_NOTE

```text
Today Velstrian Bid opens to small and mid size firms.

We built it for the people who write bids themselves, often alongside the day job. Finding the right contract, reading a long tender pack and writing every answer takes time a small firm rarely has.

Velstrian Bid makes it simpler:
- Find public and private contracts that suit you.
- Pick the ones worth bidding for.
- Draft your answers from your own documents, then review, approve and submit them yourself.

Start here: https://app.velstrian.com/signup
Your first 7 days are free. A card is needed to start.

If you know a small firm that bids for work, please pass this on.

#bidwriting #tenders #smallbusiness
```

## P03a | x | X, thread post 1 of 3
Account: https://x.com/VelstrianLtd
Format: Post, 280 characters at most (a link counts as 23). Image attached.
Image: astro/public/banner-social.png
Sources: site.ts SITE_SUMMARY; site-facts ai_use B2 and K1; app.ts SIGNUP_URL

```text
Velstrian Bid is now available to small and mid size firms that write their own bids, for public and private work.

Find contracts that suit you. Draft answers from your own documents. Review and submit them yourself.

Start: https://app.velstrian.com/signup

#bidwriting #tenders
```

## P03b | x | X, thread post 2 of 3
Account: https://x.com/VelstrianLtd
Format: Reply to P03a, 280 characters at most. No image.
Image: none
Sources: site-facts sources.live and sources.refresh; site-facts fit_dimensions

```text
Contract notices from Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED, refreshed daily.

Each one shows how well it fits you, on seven things, from sector and capacity to social value.
```

## P03c | x | X, thread post 3 of 3
Account: https://x.com/VelstrianLtd
Format: Reply to P03b, 280 characters at most. No image.
Image: none
Sources: site-facts upload.start_a_bid; site-facts ai_use B1, B2, D1; pricing TRIAL_NOTE

```text
Upload the tender as PDF, Word, text, Excel or CSV. Velstrian Bid lists every question the buyer sets and drafts each answer from your own documents.

Your content is not used to train AI models.

Your first 7 days are free. A card is needed to start.
```

## P04a | youtube-community | YouTube community post
Account: https://www.youtube.com/@VELSTRIAN-UK
Format: Community post, short text plus one image. Community posts need the channel to have the feature switched on, otherwise post P04b with the video instead.
Image: astro/public/banner-social.png
Sources: site.ts BRAND_LINE and SITE_SUMMARY; site-facts ai_use B2; app.ts SIGNUP_URL; pricing TRIAL_NOTE

```text
Velstrian Bid is now available to small and mid size firms.

Qualify. Draft. Prove it.

Find public and private contracts that suit you, and write your bid answers from your own documents. You review and submit every answer yourself.

Create your account: https://app.velstrian.com/signup
Your first 7 days are free. A card is needed to start.
```

## P04b | youtube-video | YouTube video title and description
Account: https://www.youtube.com/@VELSTRIAN-UK
Format: Upload of an existing website video. Title 100 characters at most, description below. Check the video plays with its voice over and captions on before upload (D532 captions on by default).
Image: video C:/w/vw/astro/public/assets/videos/supplier-long.mp4, thumbnail C:/w/vw/astro/public/assets/videos/supplier-long-poster.webp
Sources: site.ts SITE_SUMMARY and BRAND_LINE_SUB; site-facts sources.live; site-facts fit_dimensions; site-facts ai_use B1, B2, K1, D1; app.ts SIGNUP_URL; pricing TRIAL_NOTE

```text
TITLE: Velstrian Bid: find contracts and write bids from your own documents

DESCRIPTION:
Velstrian Bid makes bidding simple for small and mid size firms, for public and private work.

What it does:
- Finds contracts that suit you, from Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED, refreshed daily.
- Shows how well each contract fits you, on seven things: sector, social value, capacity, geography, timeline, evidence and market.
- Reads the tender pack and lists every question and requirement the buyer sets.
- Drafts each answer from your own documents and past answers.

You review, edit and approve every answer, and you submit it yourself. Your content is not used to train AI models.

Start now: https://app.velstrian.com/signup
Your first 7 days are free. A card is needed to start.

More about Velstrian: https://velstrian.com
```

## P05 | medium | Medium article
Account: https://medium.com/@velstrian-systems-ltd
Format: Short article, about 400 words, with a title and a cover image.
Image: astro/public/banner-social.png
Sources: site.ts BRAND_LINE, BRAND_LINE_SUB, SITE_SUMMARY; site-facts sources.live, sources.on_request, sources.refresh; site-facts fit_dimensions; site-facts ai_use B1, B2, B3, K1, K2, D1; site-facts trust_strip T1; site-facts upload.start_a_bid; site-facts ai_use U1; app.ts SIGNUP_URL; pricing TRIAL_NOTE

```text
TITLE: Velstrian Bid is here: bidding made simple for small firms

SUBTITLE: Qualify. Draft. Prove it. For public and private work.

Most small and mid size firms write their own bids. There is no bid team, no procurement specialist, just someone who knows the work and needs to win it. Velstrian Bid is built for that person.

Pick the contracts worth bidding for, write your answers from your own documents, and back every claim with evidence.

Find contracts that suit you
Velstrian Bid brings in contract notices from Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED, refreshed daily. Canada, US federal and World Bank notices are available per organisation on request.

See which ones are worth your time
Each contract shows how well it fits you, on seven things: sector, social value, capacity, geography, timeline, evidence and market. You spend your effort where you have a real chance.

Answer the questions using your own documents
Upload the tender as PDF, Word, text, Excel or CSV. Velstrian Bid reads the tender pack and lists every question and requirement the buyer sets. It drafts each answer from your own documents and past answers, for a public tender or a private company's request for proposal, and suggests win themes from what the buyer values and the proof you hold.

You stay in control
You review, edit and approve every answer, and you submit it yourself. Anything the AI writes is marked AI drafted, so you always know. Your content is not used to train AI models, and your data is stored in the EU, in Ireland.

For buyers too
Velstrian Buy helps buyers set out what they need and compare the replies. It reads every bid before your panel meets and points out what to check. It never scores. Your panel does.

How to start
1. Create your account at https://app.velstrian.com/signup
2. Upload your first tender.
3. Answer the questions using your own documents.

Your first 7 days are free. A card is needed to start.

Velstrian Tenderworks, https://velstrian.com
```

## P06 | instagram | Instagram post
Account: https://www.instagram.com/velstrian/
Format: Single image post. Links in captions do not click on Instagram, so the caption points to the link in the bio. Set the bio link to https://app.velstrian.com/signup before posting.
Image: astro/public/banner-social.png
Sources: site.ts BRAND_LINE and SITE_SUMMARY; site-facts ai_use B2 and K1; pricing TRIAL_NOTE

```text
Velstrian Bid is now available to small and mid size firms.

Qualify. Draft. Prove it.

Find public and private contracts that suit you. Draft your answers from your own documents. Review and submit them yourself.

Your first 7 days are free. A card is needed to start. Link in bio.

#bidwriting #tenders #smallbusiness
```

## P07 | tiktok | TikTok video caption
Account: https://www.tiktok.com/@velstrian
Format: Short video with caption, keep the caption under 150 characters so it shows in full. Check the video has its voice over and music before posting.
Image: video C:/w/vw/astro/public/assets/videos/v-draft.mp4
Sources: site-facts ai_use B2; site.ts SITE_SUMMARY

```text
Write your bid answers from your own documents. Velstrian Bid, for small firms bidding for public and private work. Link in bio. #bidwriting #tenders
```
