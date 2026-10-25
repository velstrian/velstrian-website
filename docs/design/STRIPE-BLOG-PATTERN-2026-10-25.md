# Stripe blog pattern, measured 2026-10-25 (owner decision D424)

Owner, 2026-10-25: "D305 take hybrid approach and check how stripe does https://stripe.com/blog and must adopt same design and all the cards etc."

We adopt the PATTERN only. No Stripe asset, brand, colour or text is copied. Every value below is translated into a Velstrian token (`astro/src/styles/tokens.css`, block "STRIPE BLOG PATTERN (D424)").

## How it was measured

Playwright (Chromium, from `crowagent-website/astro`) opened `https://stripe.com/blog` and one post (`/blog/trends-from-money20-20-2026-the-rise-of-hidden-financial-services`) at 1440 and 390 wide. Both answered 200 on the URL requested (no redirect). Values are `getComputedStyle` and `getBoundingClientRect` reads, not estimates, except where marked "read off the screenshot". Screenshots: `audit-screenshots/stripe-pattern-2026-10-25/stripe-reference/`.

A negative result would have been: no `article` elements (the index is not a list of posts), or the computed values coming from the cookie banner. 40 `article.BlogIndexPost` elements were found, so the reads are from the posts.

## Index layout

| Part | Measured at 1440 | At 390 |
|---|---|---|
| Content column | 1080px wide, x 180 to 1260, on a 4 column grid drawn with faint dashed rules | 358px, 16px gutters |
| Featured post | one raised white card, 1080 by 508, radius 8px, shadow `0 50px 100px -20px` brand tinted plus `0 30px 60px -30px` ink. Text left half, picture right half inset 16px from the card edge | same card, stacked: category, title, author, excerpt, Read more, picture |
| Every other post | NOT a card. An open row on the grid: category and title over columns 1 to 3, date and author in column 4, excerpt and Read more in columns 1 to 2, the picture in columns 3 to 4 lifted with the same deep shadow | stacked in the same order as the featured card |
| Gap between rows | 112px | about 80px |
| Filters, pagination | none above the fold, category links only | none |

## Card anatomy

| Part | Measured |
|---|---|
| Category | 15px, weight 425, line height 24px, letter spacing 0.2px, brand accent ink, sentence case. A 1px accent rule (`::before`, width 1px) sits on the grid line to its left |
| Title | 38px, weight 425, line height 48px, letter spacing -0.2px, darkest ink. Featured card title is larger, about 40px (read off the screenshot) |
| Excerpt | 18px, weight 300, line height 28px, letter spacing 0.2px, body grey, about 460px measure |
| Read more | 15px accent ink, a chevron after the words |
| Author | 48px round avatar, name 15px darkest ink, role 15px body grey |
| Date | 15px body grey, set in the right column on rows, beside an accent rule |
| Picture | 16:9 to 4:5 product illustration or photograph, radius 4 to 8px, the deep shadow, no border |
| Hover | the title does not change colour or underline, the picture does not move or scale (measured before and after `hover()`: identical colour, `transform: none`, opacity 1). Only the Read more link reacts |

## Post header and article

| Part | Measured at 1440 |
|---|---|
| Trail | "Blog / Category" in accent ink top left, 18px |
| Title | left aligned in columns 2 to 4 (x 466), about 56px, weight 500, line pitch 67px (read off the screenshot), 3 lines |
| Date | under the title with the 1px accent rule on the column line |
| Author | column 1, beside the hero picture: 48px round avatar, name, role |
| Hero picture | columns 2 to 4, 810px wide, square corners on the left edge, full photograph |
| Body | 810px column at x 450, 18px weight 300, line height 28px |
| Section heading | 34px, weight 500, line height 48px, letter spacing -0.2px |
| At 390 | single column, title then date, author, picture, body |

## How Stripe mixes illustration and photography

The featured and list pictures are mostly bespoke brand art (a big number, a gradient field, a product shape) with real event photography where the post is about a real event. Art and photos share one treatment: same radius, same deep shadow, same 16:9 frame in the list. That is the hybrid D305 already chose: real photographs where they are good, designed art in brand tokens everywhere else.

## The Velstrian translation

| Stripe | Velstrian token or class |
|---|---|
| 1080px column, 4 column grid | `.ea-wrap` and the 4 track `.ea-postlist` row grid |
| deep two layer shadow | `--elev-post-feature` (Iris tinted, light and dark) |
| 8px card radius | `--v3-radius-card` (12px, the site's one card radius, kept) |
| 1px accent rule on the category | `--post-rule-w` and `--ea-accent` |
| 15px category, sentence case | `--t-ea-small`, `--t-w-ea-medium`, accent ink |
| 38px row title, 48px line | `--t-h3` (30px at 1440, the site's section heading tier), `--lh-post-title` |
| 56px post title | `--t-page` (53px at 1440, the page title tier) |
| 18px excerpt, 28px line | `--t-ea-lead`, `--lh-post-excerpt` |
| 48px avatar | `--post-avatar` |
| 112px between rows | `--post-row-gap` |
| calm hover | the site's calm card contract (D294 and D321) is kept: edge step plus the lift on cards, underline on Read more |

The 12px radius, the Manrope type, the four heading tiers (check-design-system.js allows no fifth size, so the titles take the nearest tier rather than Stripe's exact pixels) and the D321 lift are Velstrian's own and stay. A grid card title stays at `--t-ea-h3`. Weight 300 body text is not adopted: Manrope at 300 on white falls under the contrast the site holds, so the excerpt stays at the body weight.
