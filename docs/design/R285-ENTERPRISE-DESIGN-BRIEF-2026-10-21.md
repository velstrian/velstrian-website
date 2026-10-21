# R285 enterprise design brief, Velstrian website

Row: R285-WEB-ENTERPRISE-REDESIGN-01. Date: 2026-10-21. Author: research lane (read only on site code).
Scope: home, /bid/, /buy/, /pricing/ on `crowagent-website/astro`. Owner references: Confluence, Auth0, Vanta, Linear, Better Stack.

## How to read the evidence marks

- **opened-live** means measured in headless Chromium on the live page on 2026-10-21 (computed styles, `document.fonts`, `getAnimations`) and a screenshot exists in `audit-screenshots/r285-references/` (gitignored, 14 MB, not committed).
- **opened-fetch** means read through WebFetch, which returns a model summary of the page text. It is good for section order and wording, weak for exact numbers.
- **inferred** means my reading of a screenshot or an unmeasured guess. Every inferred fact is marked.
- Reference pages sat behind cookie banners in the screenshots. Computed styles are unaffected, the pixels are partly covered.
- Measurement scripts are in the session scratchpad only (`measure.cjs`, `hover.cjs`, `outline.cjs`). Raw results: `audit-screenshots/r285-references/measure-refs.json`, `measure-ours.json`, `hover-all.json`.

## Corrections to the brief that commissioned this document

1. **The webfont is loaded, not missing.** On localhost:8093 `document.fonts` reported Inter 400 to 800, Plus Jakarta Sans 600, 700 and 800, and JetBrains Mono 400 to 700 as `loaded` on all four pages (opened-live). `astro/src/styles/fonts.css` declares them from `/Assets/fonts/` and the five woff2 files exist in `crowagent-website/Assets/fonts/` (Inter-var 32,772 B, JetBrainsMono-var 28,728 B, PlusJakartaSans-600/700/800 10,976, 11,044 and 10,756 B). The remaining question is whether the production build serves them, which `copy-assets.js` is meant to guarantee and which I did not test because I did not build. So the "system fallback" symptom is not a missing file.
2. **The palette is Linear's, almost to the byte.** Our tokens: `--c-bg #08090A`, `--c-text #F7F8F8`, `--c-text-muted #8A8F98`, accent `#5E6AD2` and `#8B95E5` (tokens.css lines 1198, 2592, 2594, 1308, 1307). Linear's live computed values: body background `rgb(8, 9, 10)`, text `rgb(247, 248, 248)`, muted `rgb(138, 143, 152)` (opened-live). Hex for hex the same three greys. Anyone who knows Linear reads our canvas as a copy, which is a strong part of why the site reads as generated. This is the single biggest finding about colour.

---

## Part 1. Reference measurements

All values at 1440 wide unless stated. Source: opened-live unless marked.

### 1.1 Type, width and rhythm

| | Confluence | Auth0 | Vanta | Linear | Better Stack |
|---|---|---|---|---|---|
| Display family | Charlie Display (proprietary) | Aeonik | SC Ripley (serif) | Inter Variable | Helvetica Now Display |
| Body family | Charlie Text | Aeonik | Soehne | Inter Variable | Helvetica Now Text |
| Mono | none loaded | Aeonik Mono | none | Berkeley Mono | none |
| Faces loaded | 5 (400, 500 display, 400, 500, 700 text) | 4 | 6 | 2 (variable 100 to 900, plus mono) | 5 |
| h1 | 64 / 66.6 px, wt 500, ls -1.28 px (-0.02em) | 64 / 72, wt 400, ls -1 px | 56 / 61.6, wt 400, ls -2% | 64 / 64, wt 510, ls -1.408 px (-0.022em) | 53 / 58.3, wt 500 |
| h2 | 48 / 55.7, wt 500, ls -0.96 px | 56 / 64, wt 400 | 56 / 61.6, wt 400 | 48 / 48, wt 510 | 40 / 43.2, wt 700 |
| Lead (hero sub) | 20 / 31.2, wt 400 | 20 / 28, wt 400 | 18 / 25.6 | 15 / 24 | 20 / 24 |
| Body | 16 / 25 | 14 / 28 body, 20 / 28 lead | 16 / 25.6 | 15 to 16 / 24 | 16 / 24 |
| h1 at 390 | 44 / 45.8 | 44 / 56 | 42 / 46.2 | 38 / 41.8 | 40 / 44 |
| h2 at 390 | 32 | 40 | 42 | 24 | 28 |
| Content width (most common centred box) | 1433 (full bleed), hero text about 668 | 800 inner, 756 h1 box | 1280 (12 hits), 1056 (3) | 1310 (14 hits) | 1095 (8), 1320 (5) |
| Section padding top and bottom | 96 | 32 inside a 514 px tall scroll slide (inferred pinned sections) | 128 / 80 and 128 / 128 | 128 / 128 | 0 (spacing by margin, not measured) |
| Page height | 9,029 | 10,151 | 10,405 | 9,960 | 11,700 |

Reading: h1 sits at 53 to 64 px, weight 400 to 510, never bold. Letter spacing is about -0.02em at display sizes. Body is 16 px. Lead is 18 to 20 px. Three of five set display type at weight 400 or 500. Our h1 is 700 weight at 83.2 px (home) and 52.8 px (inner pages), so it is the heaviest and on home the largest in the set (opened-live, ours).

### 1.2 Colour, background, hero, media

| | Confluence | Auth0 | Vanta | Linear | Better Stack |
|---|---|---|---|---|---|
| Theme | light, `#F8F8F8` section bands, white canvas | dark purple `rgb(32,0,58)` with gradient wash | light `rgb(252,252,250)` canvas, lavender hero panel | near black `rgb(8,9,10)` | near black `rgb(11,12,20)` |
| Saturated hues in use (clustered count of computed colours, opened-live) | 1 dominant blue `rgb(24,96,216)` (69 hits) plus a small amber | 1 teal (350 hits) plus pastel purples | 1 purple family (about 66 and 63 hits across two shades) | 1 indigo family (90 hits) plus a few status colours | 1 indigo (74 hits) |
| Accent count (inferred from the above) | 1 | 1 plus gradient | 1 | 1 | 1 |
| h1 colour | ink `rgb(16,18,20)` | white | ink `rgb(24,24,34)` | white | gradient clipped text (computed colour is transparent) |
| Hero headline length | 6 words | 6 words | 4 words | 8 words (the DOM repeats it for split animation, 3x raw count) | 5 words |
| Hero sub line | 21 words | 28 words | 14 words | 11 words | 6 words in two short sentences |
| Hero CTAs | email field plus "Sign up" plus "Google" (form, not buttons) | "See it in action" (filled) and "Talk to an expert" (outline) | email field plus "Get a demo" | none in hero, "Sign up" lives in nav | email field plus "Start for free" |
| Hero visual | large grey rounded frame, product shot below the fold (inferred from screenshot) | gradient wash, customer logo strip under CTAs | lavender panel with illustrated integration chips (AWS, Google, GitHub) | **real product UI**, 1320 px wide, flat, directly under the sub line | **real product UI**, slight perspective, faded, with a carousel of 9 dots |
| Real product UI or illustration | UI | gradient plus logos | illustration plus UI chips | UI | UI |
| Page-level `@keyframes` count | 129 | 15 | 7 | 220 | 4 |
| Infinite animations running at load | 1 | 2 | 0 | 107 (cause not measured, likely product demo parts and spinners) | 2 |
| Ours for comparison | | | | | home 6, /bid/ 9, /buy/ 3, /pricing/ 11, keyframes 21 to 23 per page |

Keyframe counts are what the page's CSS contains, not what runs. Refs with huge counts (Confluence, Linear) ship a shared framework, so the running count matters more. The running counts are 0 to 2 on four sites. Ours run 3 to 11.

### 1.3 Cards, hover, frames, motion

Hover was measured by hovering up to three card-like boxes per page and diffing computed style after 700 ms (opened-live, `hover-all.json`).

| Site | Card hover measured | Framing of product screenshots |
|---|---|---|
| Confluence | no card-like box found by the heuristic, so not measured | rounded grey stage with a 1 px edge (inferred from screenshot) |
| Auth0 | not measured, same reason | full bleed inside slides (inferred) |
| Vanta | background shade step only: `rgb(239,239,245)` to `rgb(230,230,240)`, no transform, no shadow change | white chips with a soft shadow on a lavender field (inferred) |
| Linear | **no change at all** (transition 0 s or `filter` 0.16 s) | one frame, 1 px border, radius about 12, flat, 1320 wide, sits straight under the hero text (screenshot) |
| Better Stack | transition 0.15 s on colour, background and border colour, nothing else, no measured change on these three | product shot with perspective and a bottom fade, caption underneath, dots to switch (screenshot) |
| **Ours** | `translateY(-2px)`, border colour from 16% white to solid white, shadow replaced with a white inset 16% plus a glow shaded by the interactive colour (opened-live on home, /bid/ and /pricing/) | tilted, stacked cards on /bid/ hero (screenshot), a window chrome frame on home |

Nobody in the set lifts a card on hover. The strongest reference behaviour is a colour or shade step in 150 ms.

Motion that moves on the references (opened-live counts plus screenshots): Confluence and Better Stack carry one or two looping items each, Vanta none, Auth0 two (inferred to be the logo marquee and the hero wash), Linear many inside product demo frames (inferred). No reference loops a card border, a glow or a shimmer (no such animation names were seen in the hover diffs, and none is visible in the screenshots).

### 1.4 Navigation, footer, social proof, voice

| | Confluence | Auth0 | Vanta | Linear | Better Stack |
|---|---|---|---|---|---|
| Top-level nav (opened-live) | Features, Resources, Guides, Templates, Enterprise, Pricing (6) plus search, Sign in, Get it free | Build, Product, Solutions, Library, Pricing (5) plus Login, Sign up, Let's connect | Platform, Solutions, Partners, Resources, Plans (5) plus Log in, Get a demo | Product, Resources, Customers, Pricing, Now, Contact (6) plus Log in, Sign up | Platform, Documentation, Pricing, Community, Company, Enterprise (6) plus Sign in, Sign up |
| Utility bar | announcement strip (Gartner mention) | event strip | announcement strip | none | none |
| Footer links counted | 37 | 31 | 87 | 42 | 18 |
| Footer headings (opened-fetch) | Products, Resources, Learn | Starting with Auth0, Documentation, Contact and help, Company and trust | Product, Frameworks, Platform, Solutions, Customers, Partners, Resources, Articles, Company | Product, Features, Company, Resources, Connect, Legal | not visible in the fetch |
| Customer logos | Reddit, Dropbox, Roblox, Trivago, Riverty, Domino's, Sprout Social, Datasite (opened-fetch) | McLaren, PGA, Zapier, Cribl, CLAAS and 11 more (opened-fetch, five visible in screenshot) | Ramp, Cursor, Snowflake, Clay and more (opened-fetch) | none identified in the fetch, a quote from named staff at OpenAI and Ramp (opened-fetch) | UNICEF, Canada, Decathlon, Raycast, AMETEK, Redis visible in the hero (screenshot) |
| Numbers | "800 hours and $500k per year", "increase throughput by 200%" as customer quotes | "3 billion+ attacks blocked", "99.99% uptime", "23 billion+ authentications", footnoted | "16,000 businesses", "20% faster deal cycles", "93% of questionnaires" | "over 40,000 product teams" | "30x cheaper than Datadog", a cost table with dollar figures |
| Security block | none in the fetch | a "Security built-in" stat block and a footer "Compliance, Privacy and Security" link | **SOC 2 Type 2, ISO 27001, ISO 42001 and GDPR badges** | footer links to Security, DPA, AUP, no badges | none |
| Voice (verbatim samples, opened-fetch) | "Beat the blank page with AI creation and ready-to-use templates." | "Stop burning sprints on custom SAML just to close a contract." | "Are you a startup founder in need of a SOC 2 yesterday, but lacking time and resources?" | "Plan and navigate from idea to launch." | "Mark irrelevant logs as spam to exclude them and don't get charged." |
| Sentence length (inferred from the samples) | 7 to 14 words | 8 to 24 words | 8 to 18 words | 5 to 15 words | 5 to 12 words |
| Jargon | moderate, product nouns | names the concrete pain (SAML, sprints) | names the concrete deadline (SOC 2 yesterday) | high but exact (triage, diffs, cycles) | exact (eBPF, PromQL, OpenTelemetry) |

Voice conclusion: the best of these sentences name one concrete, expensive situation (SAML, a SOC 2 deadline, a Datadog bill). None uses a three-fragment cadence or abstract nouns such as "defensible" and "measurable".

### 1.5 What this means for us, in one table

| Reference practice | Applies to Velstrian? |
|---|---|
| One accent colour | Yes |
| Real product UI in the hero | Yes, once real staging captures land |
| Customer logos and numbers | **No.** Banned by D252. Replace with sources we read, measured product facts and our own data location table (see Part 4) |
| Compliance badges | **No.** `site-facts.json` certifications.held is empty. Say what is true instead |
| Display at weight 400 to 510 | Yes |
| No card lift on hover | Yes |
| Nav of 5 to 6 plus one login plus one filled CTA | Yes |

---

## Part 2. Our gaps by page, with owning files

Measured on localhost:8093 at 1440 and 390 on 2026-10-21 (opened-live, `measure-ours.json`, screenshots `ours-*`). File ownership is from reading the import list in `astro/src/layouts/Base.astro` and the pages. Where I did not confirm a file I say so.

### 2.1 Site-wide gaps

| # | Gap | Evidence | Owning file |
|---|---|---|---|
| G1 | Canvas, text and muted greys equal Linear's | tokens.css 1198, 2592, 2594 against Linear computed values | `src/styles/tokens.css`, `brand.source.json` |
| G2 | Hero h1 weight 700 and 83.2 px on home, 52.8 px on inner pages | computed on all four pages | `src/styles/headings.css`, `home.css`, hero components in `components/home2/HeroOutcome.astro` and the page hero blocks |
| G3 | Eyebrow is a mono, uppercase, 0.16em, gradient-clipped pill on every section | screenshots, labels.css 359, 525, 571 to 575 (`background-clip: text`) | `src/styles/labels.css` |
| G4 | Two display families plus a mono, all loud | fonts loaded list | `src/styles/fonts.css`, `tokens.css` 2621 to 2633 |
| G5 | Card hover lifts 2 px, turns the border solid white and adds a glow, and a rotating conic-gradient border exists | hover diff, effects.css 272 to 303 (`conic-gradient`, `fx-edge`) | `src/styles/effects.css`, `surfaces.css` (a separate lane is removing these now) |
| G6 | Infinite animations running at load: 6, 9, 3 and 11 on the four pages, against 0 to 2 on four references | `getAnimations()` | `effects.css` lines 102, 148, 303, 375, 441, 571, `surfaces.css` 780, `tokens.css` 3193 |
| G7 | 44 grep hits for `@keyframes` across `src/styles` (the owner counted 57 including components) | grep, a hint not a count of live animations | `motion.css` (15), `effects.css` (10), `bid.css` (3), `forms.css`, `duty-card.css`, `tokens.css` |
| G8 | Buttons are glossy pills with a gradient fill, drop shadow and glow, in both primary and secondary | screenshots, `--shadow-btn` tokens.css 2886 to 2887 | `components/ui/Button.astro`, `styles/button-row.css`, `controls.css` |
| G9 | Everything is centre aligned | all four hero screenshots | page hero blocks, `styles/alignment.css` |
| G10 | Nav carries a Ctrl K search chip and 7 text items | nav links list and screenshot | `components/nav/Nav.astro`, `CommandPalette.astro`, `data/nav.ts` |
| G11 | Page length. Ours: home 9,386 px, /bid/ 18,471, /buy/ 14,721, /pricing/ 9,905. References: 9,029 to 11,700, with /bid/ at about 1.6x the longest reference | docH | page files |
| G12 | Copy is cadence-first. "Better bids. Defensible evidence. Measurable delivery." is a three-fragment triplet and "The obligation outlives the bid." is abstract | h1 and h2 text | `pages/index.astro`, `bid.astro`, `buy.astro`, `pricing.astro`, `components/home2/*` |
| G13 | Product visuals are tilted stacks and mock windows | /bid/ hero screenshot | `pages/bid.astro` hero and `styles/bid.css`. I did not find the `perspective` or `rotate` rule by grep in `src/styles` or `components`, so the exact owner of the tilt is unconfirmed, locate it in `bid.astro` |
| G14 | CSS source is 215 KB in tokens.css alone, most of it comments | wc -c | `tokens.css`. Compiled size not measured, I did not run a build |

### 2.2 Home (`/`, `pages/index.astro`, 10 KB, composed from `components/home2`)

- 8 sections, 9,386 px. Section heights: hero 941, outcomes 686, **stages 2,651**, reasoning 1,614, walkthrough 475, audiences 857, trust 823, start 621 (opened-live).
- Hero: eyebrow pill, 3-sentence h1 at 83 px weight 700, lead, two glossy CTAs, a tilted window frame beside text that does not align to it (screenshot). Owner: `HeroOutcome.astro`, `HeroLive2.astro`, `DeviceChrome.astro`.
- The stages block (`OneTenderStages.astro`) alone is 28 percent of the page.
- Mobile 390: page is 14,756 px, h1 41.6 px in four lines with the centred 21 px pill above it.

### 2.3 /bid/ (`pages/bid.astro`, 56 KB)

- **19 sections, 18,471 px**, the longest of any page, with duplicated ideas: the-gap, deadline-timeline, mechanism, cap-fit, cap-citation, showcase, cap-refusal, cap-delivery, how-it-works, benefits, procurement-act, features, what-is-bid, buyers, pricing, free-tool, FAQ, cta (outline from opened-live).
- `how-it-works` (4 steps), `mechanism` (3 moves) and `showcase` (same four steps) say the same thing three times. `features` is 2,577 px.
- The hero h1 is gradient-clipped text, so computed colour is transparent (the measurement shows `rgba(0,0,0,0)`), which also makes contrast checking by tool unreliable.
- Mobile: 27,457 px, nearly twice any reference at 390.

### 2.4 /buy/ (`pages/buy.astro`, 70 KB)

- 11 sections, 14,721 px. `workspace` alone is 3,305 px. `what-it-is`, `how-it-works`, `specimen`, `delivery`, `scope`, `access` follow in a long list.
- Hero text "You publish the requirement. We locate the evidence." is clear but sits in the same centred pill layout as every other page, so Bid and Buy feel like one template recoloured.

### 2.5 /pricing/ (`pages/pricing.astro`, 80 KB)

- 9 sections, 9,905 px. The buyers section measured height 0 at load (a tab panel hidden behind the For suppliers and For buyers switch, outline shows `buyers h=0`).
- The FAQ is 2,220 px open. `ai-credits` 1,592 and `compare` 1,340 are the other two long blocks.
- The sticky switch (Monthly and Annual toggle plus audience tabs) is a good pattern and matches what references do on pricing, keep it.

---

## Part 3. Target system, exact values

Every value below is a proposal to be written into `tokens.css` and `brand.source.json` (RULE 0-C). Values marked **existing** already exist in `tokens.css`. Values marked **proposed** need owner sign off because no authoritative source holds them. Contrast figures are my computation from WCAG luminance, to be re-run by `check-palette-roles.js`.

### 3.1 Type

| Token | Value |
|---|---|
| `--font-display` | `'Inter', system-ui, sans-serif` (single family, display and body) |
| `--font-body` | same as display |
| `--font-mono` | `'JetBrains Mono', ui-monospace, monospace`, used for code, identifiers and clause numbers only, never for labels |
| Allowed weights | 400, 500, 600. Retire 700 and 800 in marketing |
| `--ls-display` | -0.022em (Linear measured -0.022em, Confluence -0.02em, Vanta -2%) |

| Role | Desktop | Mobile 390 | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| Hero h1 (home) | 60px | 38px | 600 | 1.08 | -0.022em |
| Page h1 (/bid/, /buy/, /pricing/) | 52px | 36px | 600 | 1.1 | -0.022em |
| h2 | 36px | 28px | 600 | 1.15 | -0.02em |
| h3 | 20px | 18px | 600 | 1.3 | -0.01em |
| Lead | 20px | 18px | 400 | 1.5 | 0 |
| Body | 16px | 16px | 400 | 1.6 | 0 |
| Small and table | 14px | 14px | 400 | 1.5 | 0 |
| Eyebrow | 14px | 14px | 500 | 1.4 | 0, sentence case, accent colour, no pill, no gradient, no mono |
| Code and clause number | 13px mono | 13px mono | 500 | 1.5 | 0 |

Reference check: refs h1 53 to 64 at 400 to 510 weight. We choose 600 for Inter because Inter at 510 is Linear's own look and we must not copy it exactly, and Inter at 400 reads thin at 52 px on a light canvas. This is judgement, not measured.

### 3.2 Layout and spacing

| Token | Value |
|---|---|
| `--measure` (container) | 1280px (**existing**, matches Vanta 1280 and sits between Linear 1310 and Better Stack 1095) |
| `--gutter` | 32px desktop, 20px mobile (**existing** is 24 and 20) |
| `--measure-prose` | 680px (about 70 characters at 16 px) |
| `--sec-pad-y` | `clamp(64px, 7.8vw, 112px)` (refs 96 to 128 desktop, ours 72 to 88) |
| `--sec-gap` (head to content) | 48px desktop, 32px mobile |
| Grid | 12 columns, gap 24px, feature rows 5 and 7 columns alternating |
| Space scale | 4, 8, 12, 16, 24, 32, 48, 64, 96, 112 (**existing** `--space-*` stops at 48, extend) |

### 3.3 Colour

**Decision D-A, theme:** the references split three dark (Linear, Auth0, Better Stack) and two light (Confluence, Vanta). Recommendation: **light marketing canvas, dark product frames and one dark closing band.** Reason: procurement and public sector buyers read documents on white, a dark canvas that matches Linear's hex values reads as a copied developer-tool skin, and our product frames are dark already so they gain contrast. Cost: flipping the canvas touches `brand.source.json`, which `check-brand-drift.js` compares against `crowagent-platform` (the app brand). It needs either a separate marketing palette in `brand.source.json` that the app ignores, or an app change. I did not measure how the app consumes the file, so I cannot price that. Owner decision.

Proposed light canvas (all **proposed** except where marked):

| Token | Value | Use |
|---|---|---|
| `--c-canvas` | `#FFFFFF` | page |
| `--c-canvas-alt` | `#F6F7F9` | alternate section band |
| `--c-ink` | `#101319` | headings and body |
| `--c-ink-sub` | `#4A5160` | secondary text |
| `--c-ink-muted` | `#667085` | captions (about 4.8 to 1 on white by my computation) |
| `--c-line` | `#E3E6EB` | 1px borders, table rules |
| `--c-line-strong` | `#C9CED8` | card hover border, input border |
| `--c-accent` | `#5E6AD2` (**existing** `--c-teal-dark`) | links, eyebrow, primary button fill. About 4.7 to 1 on white by my computation, so large text and UI only, use `#4650B5` (proposed) for body-size links |
| `--c-dark` | `#08090A` (**existing** `--c-bg`) | product frames and closing band |
| `--c-dark-raised` | `#16181D` (**existing** `--c-raised`) | frame chrome |
| Status colours | `--c-amber #E8B84B`, `--c-red #C06F68`, `--c-green #599260` (**existing**) | traced, missing, at risk states inside product frames only |

Rules: **one accent**. Retire `--c-violet`, `--c-orchid`, `--c-pink`, `--grad-spectrum` and every `--c-ambient-*` from marketing surfaces (tokens.css 1319 to 1322, 1443 to 1448). No gradient text. No radial wash behind heroes. A subtle `--c-canvas-alt` band is the only background variation.

### 3.4 Cards, buttons, frames

| Element | Spec |
|---|---|
| Card | 1px `--c-line`, radius 12px, padding 24px, background `--c-canvas`, **no shadow at rest** |
| Card hover | border colour to `--c-line-strong`, background to `--c-canvas-alt`, transition 150ms ease-out on `border-color, background-color`. No transform, no shadow, no glow, no gradient border. Matches Vanta (shade step) and Better Stack (150 ms colour transition) |
| Linked card | whole card is the link, underline the title on hover, arrow glyph shifts 0 px (does not move) |
| Primary button | background `--c-accent`, text `#FFFFFF`, radius 8px, height 44px, padding 0 20px, weight 500, no shadow. Hover `#4F5BC4` (proposed) over 150ms |
| Secondary button | transparent, 1px `--c-line-strong`, text `--c-ink`, same size. Hover background `--c-canvas-alt` |
| Text link | accent colour, underline on hover only |
| Product frame | radius 12px, 1px `--c-dark-raised`, top bar 36px with three neutral dots removed, title text only, shadow `0 1px 2px rgba(16,19,25,0.06), 0 16px 40px -16px rgba(16,19,25,0.28)`, **flat, no tilt, no stacking, no perspective** |
| Table | 1px row rules, 14px text, header 500 weight in `--c-ink-sub`, no zebra |

Button radius: references split between 4px (Auth0) and fully round (Confluence, Vanta, Linear nav pills). 8px is my judgement for a tool that is read as software, not a measurement.

### 3.5 Motion

| Rule | Value |
|---|---|
| Allowed transitions | colour, background, border colour, opacity, 150ms ease-out |
| Allowed entrance | one scroll reveal per block, opacity 0 to 1 and translateY 8px to 0, 240ms, once, never replays, disabled under `prefers-reduced-motion` |
| Infinite animations on marketing surfaces | **0** (spinner in forms is allowed as a loading state) |
| `@keyframes` target | 8 or fewer in total (reveal, fade, accordion, spinner, toast, skeleton, plus two spare), down from 57 by the owner's count and 44 by my grep |
| Removed | `fx-shimmer`, `fx-pulse`, `fx-edge`, `fx-seam`, `fx-status-*`, `surface-edge-beam`, `m-drift`, marquee on integrations unless the owner keeps it |
| Carousel | none. Better Stack has one, we do not need it |

### 3.6 Imagery

- Real staging captures only, framed as in 3.4. Until captures land, a flat illustrative frame built from HTML with a visible caption "Example data" and no tilt. Do not ship a placeholder that looks like a customer screenshot.
- Each page has at most 3 product frames, each above one idea.
- Icons: one stroke family, 20px, 1.5px stroke, `--c-ink-sub`. No filled gradient icon tiles.
- Photography and illustration: none.
- Wordmarks of data sources are allowed as plain text in `--c-ink-muted`, see 4.1 (they are sources, not customers).

### 3.7 Section patterns (the only eight patterns allowed)

1. **Hero left.** Left aligned. Eyebrow, h1, lead, two buttons, one reassurance line. Product frame directly beneath, 1280 wide, as Linear does.
2. **Facts strip.** 4 columns, a big number or word and one line each, drawn only from `site-facts.json`.
3. **Feature row.** 5 and 7 split, text plus product frame, alternating.
4. **Card trio.** Three cards, h3, two lines, one link each.
5. **Two sides.** Bid and Buy as two equal cards with a shared headline.
6. **Data table.** Plain table for regions, processors and plan comparison.
7. **FAQ accordion.** Closed by default, 6 questions, native `details`.
8. **Closing band.** Dark, one sentence, one button, one secondary link.

### 3.8 Copy voice rules

1. Headline is one sentence of 4 to 9 words with a verb and an object. References: 4, 5, 6, 6 and 8 words.
2. Lead is 1 to 2 sentences, 14 to 24 words.
3. Name the concrete situation. Good: "Stop burning sprints on custom SAML just to close a contract" (Auth0). Ours: say "Tender due in 10 days and the answers still sit in four documents" rather than "The obligation outlives the bid." Wording to be checked against D252.
4. No triplets of fragments. No abstract adjectives (defensible, measurable, powerful).
5. Specifics over claims: Procurement Act 2023 section numbers, PPN 026, file limits, plan credits, region names.
6. UK English, sentence case, no em or en dashes, no semicolons in prose, none of the banned words in the workspace CLAUDE.md.
7. Buttons say what happens: "Start with Velstrian Bid", "Book a 30-minute call". Avoid "Learn more".
8. Every number on a page exists in `site-facts.json` or is generated by `check-site-facts.mjs` from the platform. Never a customer count, win rate or time saving (banned strings: "minutes instead of days", "78% pre-written").

### 3.9 Navigation and footer

- Nav: logo, **Product** (Bid, Buy), **Pricing**, **Resources** (Blog, FAQ, Glossary, Changelog, Roadmap), **About**, then Sign in (text) and Start now (primary). Remove the Ctrl K chip from the bar, keep the palette on the keyboard shortcut only. That is 4 links, fewer than the references' 5 to 6.
- Footer: 5 columns (Product, Resources, Company, Legal, Trust), under 40 links, status link `https://status.velstrian.com` (site-facts.status_host).

---

## Part 4. Page blueprints

Content source is `astro/src/data/site-facts.json` (D252) unless a path is given. Section targets are page heights at 1440.

### 4.1 Home (`/`), target 5,500 to 6,500 px, 7 sections

| # | Section | Purpose | Content source |
|---|---|---|---|
| 1 | Hero left, frame below | state the product and give two paths | headline per voice rules, frame = real capture of requirement-to-evidence view. CTAs "Start with Velstrian Bid" and "See a real tender walkthrough" (existing) |
| 2 | Facts strip | replace the customer logo bar with things we can prove | `sources.live`: Find a Tender, Contracts Finder, Public Contracts Scotland, EU TED (4 live sources). `fit_dimensions.count`: seven. `upload`: 25 MB and 100 MB limits. `plans.sso_every_plan` |
| 3 | Two sides | Bid and Buy | existing copy from `BothSides2.astro`, shortened |
| 4 | Feature rows x3 | find, answer with citation, deliver after award | `capabilities` M1, M3, M15, plus `RefusalTrace.astro` as the one demo of the AI refusing an unsupported figure |
| 5 | Data and trust table | location of data, processors, certification statement | `regions`, `processors.list`, `certifications.soa_statement` ("ISO/IEC 27001 Annex A reviewed in our own Statement of Applicability. No certificate held."), `status_host` |
| 6 | Pricing teaser | price first | `plans` (200, 750, 3000 credits, 1, 5, 10 seats), prices from `src/data/pricing.ts`, which I did not open, so owner or builder must confirm "from 49 pounds" and "from 299 pounds" against the catalogue |
| 7 | Closing band | one action | existing `FinalCta2.astro` |

Removed: `OneTenderStages` (2,651 px) becomes a three-row feature block, `HomeOutcomes`, `HomeWalkthrough` merge into section 1 and 4.

### 4.2 /bid/, target 8,000 to 9,000 px, 9 sections (from 19)

| # | Section | Purpose | Content source |
|---|---|---|---|
| 1 | Hero left, frame below | what Bid does for a supplier | existing h1 ("Find UK tenders. Cite every answer. Prove delivery.") rewritten per rule 3.8.1 and 3.8.4 |
| 2 | Facts strip | sources and limits | `sources`, `upload.start_a_bid`, `fit_dimensions` |
| 3 | The problem | one pain, named | procurement duties (Procurement Act 2023 s.52 and s.71 already on page) |
| 4 | Feature row: find fit | fit score by seven dimensions with points | `fit_dimensions.dimensions` (sector 22, social value 20, capacity 18, geography 12, timeline 12, evidence 6, market 10) |
| 5 | Feature row: cite every answer and refuse what it cannot evidence | citations and refusals | M-list, `RefusalTrace.astro`, `ai_advisor.does` |
| 6 | Feature row: deliver after award | KPI duties and obligations | existing `procurement-act` and `cap-delivery` text, merged |
| 7 | What is included | card grid, 6 cards | M1 to M10, M14, M15 from `capabilities.list`. Do not publish M11 (partner console) or M12 (free briefing) while their `page` is null |
| 8 | Pricing and free tool | next step | `plans`, free Tender Compliance Matrix at `/tools/tender-compliance-matrix` |
| 9 | FAQ then closing band | objections | existing `data/faq.ts`, 6 questions |

Merged and removed: `mechanism`, `how-it-works` and `showcase` collapse into rows 4 to 6. `what-is-bid`, `benefits` and `buyers` fold into rows 3 and 7.

### 4.3 /buy/, target 7,000 to 8,000 px, 8 sections (from 11)

| # | Section | Purpose | Content source |
|---|---|---|---|
| 1 | Hero left, frame below | what Buy does for a buyer | existing h1 "You publish the requirement. We locate the evidence." |
| 2 | Boundary statement | "The AI reads. It never scores." as a plain two-column statement of what the system does and does not do | `buy_panel_score` (evidence drawer text must start "Panel "), `surface_policy` note in site-facts |
| 3 | Feature row: workspace | requirement to return | M5 Quick RFQ, M6 workspace extras |
| 4 | Feature row: one criterion, one quote | the specimen | existing `specimen` content |
| 5 | Feature row: delivery bands | five bands | existing `delivery` content, no new numbers |
| 6 | Scope | alongside the buyer's portal | M7 (Jaggaer, Atamis, In-tend, "You submit it"), `scope` text |
| 7 | Access | two ways to buy | existing `access` content, plan figures from the catalogue |
| 8 | FAQ and closing band | objections | existing six questions |

### 4.4 /pricing/, target 7,000 to 8,000 px, 7 sections (from 9)

| # | Section | Purpose | Content source |
|---|---|---|---|
| 1 | Hero left, short | one sentence plus the sticky audience and billing switch | keep the switch |
| 2 | Plan cards (Bid) | three plans | `plans.bid` (seats 1, 5, 10, credits 200, 750, 3000, guest reviewers 3, 10, 25, integrations none, add-on, included). Prices from the catalogue |
| 3 | Plan cards (Buy) | same pattern, in the hidden tab | existing |
| 4 | Compare table | detail | existing `compare`, plain table pattern |
| 5 | How AI usage is counted | credits explained | existing `ai-credits` text, shortened to a table plus 3 sentences |
| 6 | Purchase order and annual saving | buying routes | existing, merged into one block |
| 7 | FAQ accordion, then closing band | objections | existing, 6 questions closed by default |

---

## Part 5. Constraints and decisions

### 5.1 Hard constraints respected

No invented customers, logos, quotes, numbers or certifications. No em or en dashes in user facing text. Cloudflare free plan. Tokens only. UK English. Nothing in this brief adds a cost bearing item.

### 5.2 DECIDED by owner D254 (relayed by the coordinator, 2026-10-21)

**Webfont.** A self hosted, freely licensed webfont is approved. My choice, from the measurements above: **Inter variable, one file, for both display and body.**

| Item | Detail |
|---|---|
| File | `Inter-var.woff2`, already in `crowagent-website/Assets/fonts/`, **32,772 B (about 32 KB)**, weights 400 to 800 as declared in fonts.css (line 111 to 113) |
| Weights used | 400, 500, 600 |
| Licence | SIL Open Font License 1.1, which permits embedding and redistribution (opened-fetch: https://github.com/rsms/inter/blob/master/LICENSE.txt). Keep the licence text with the files |
| Remove | the three Plus Jakarta Sans files, 10,976 + 11,044 + 10,756 = **32,776 B (about 32 KB) saved** |
| Mono | keep `JetBrainsMono-var.woff2`, 28,728 B (about 28 KB) for code and clause numbers only. If the owner wants to save it, dropping it saves 28 KB and costs the clause number styling |
| Net font payload | from 94,276 B (about 92 KB, five files) to 61,500 B (about 60 KB, two files) |
| Why Inter | already shipping, no new file, and Linear proves Inter reads as an enterprise look at weight 510 and -0.022em |
| Why not Geist | Geist and Geist Mono are also OFL 1.1 (opened-fetch: https://github.com/vercel/geist-font), but file formats and sizes were not stated on the page and I did not measure a file, so any KB figure for Geist would be invented |
| Why not keep Plus Jakarta Sans | its 700 and 800 display weights are the heavy, rounded geometric look that, with the gradient eyebrow, reads as a generated template. Three files for one family cost the same bytes as the one Inter file |

Metric fallback faces already exist in fonts.css (`Inter Fallback`, `Inter Fallback Arial`, `Inter Fallback DejaVu`) so layout shift stays controlled. The `Jakarta Fallback` faces (lines 395 to 446) are removed with the family.

**Budgets no longer veto the redesign.** Each increase is measured and reported as a number. Current ceilings from `scripts/check-budgets.js`: `cssTotal` 220 KB (line 273) and `jsTotal` 36 KB (line 344). The per route 12 KB figure came from the commissioning brief and I did not locate its line. My expectation, as a direction and not a measurement: removing 57 keyframe blocks, gradient borders, shimmer and the spectrum tokens should lower CSS, and a light theme adds a second token set only if the owner keeps a dark theme. Build and report the compiled figure before and after, per page, in the first redesign commit. I did not build, so I give no compiled number.

### 5.3 Still open, owner decisions with a recommendation each

| ID | Question | Options | Recommendation | Cost |
|---|---|---|---|---|
| D-A | Marketing canvas colour | A light canvas with dark product frames. B stay dark but replace Linear's greys with our own | **A** | `brand.source.json` parity with the app via `check-brand-drift.js`, unmeasured. Every page needs re-contrast checks |
| D-B | Remove the integrations marquee and the `fx-*` loops entirely | Remove all, or keep one marquee | **Remove all, zero infinite animations** | Lowers CSS, loses a visual |
| D-C | Display weight | 500, 600 | **600** | None |
| D-D | Button radius | 8px, pill | **8px** | None, pure judgement |
| D-E | Placeholder frames until real captures | HTML example with an "Example data" caption, or hide the frame | **HTML example with caption** | Honesty depends on the caption staying |
| D-F | Hero layout | left aligned with frame below (Linear), or two columns (Confluence) | **left aligned, frame below** | None |
| D-G | Page length targets | the heights in Part 4, or keep current | **Part 4 targets** | Removing sections the owner may like. Each removed section must be named in the commit |
| D-H | Remove Ctrl K chip from the nav | remove, keep | **remove, keep the shortcut** | None |
| D-I | Rules that block a pattern the references use | see 5.4 | see 5.4 | |

### 5.4 Existing rules that block a reference pattern, for the owner to lift or keep

| Rule | Reference pattern it blocks | Recommendation |
|---|---|---|
| D252 facts gate | customer logos, customer numbers, compliance badges | **Keep.** Replace with sources, measured product facts and the data table |
| Zero-motion style gate `check-motion` (named in the build chain) | a single scroll reveal | **Keep the gate, allow the one reveal in 3.5.** I did not read the gate, so check what it enforces first |
| CSP and no third party scripts | embedded video, chat widget | **Keep.** The references' chat widgets are a cost with no benefit here |
| No semicolons or em dashes | none of the references' typography needs them | **Keep** |

---

## Appendix A. Ten most important findings

1. The three core greys (`#08090A`, `#F7F8F8`, `#8A8F98`) equal Linear's measured values, so the site reads as a copy.
2. The webfont does load, so the "system fallback" diagnosis is wrong. The real typographic issue is weight 700 at 83 px plus mono gradient eyebrows.
3. Reference h1s are 53 to 64 px at weight 400 to 510. Ours is 700 at 83 px on home.
4. Every reference uses one accent colour. We render indigo plus violet, orchid and pink gradients.
5. No reference lifts a card on hover. The strongest behaviour is a 150 ms shade or border colour step.
6. Four references run 0 to 2 infinite animations at load. Ours run 3 to 11 per page.
7. Linear and Better Stack put real product UI in the hero, flat or lightly angled. Ours uses tilted stacks and mock windows.
8. /bid/ is 18,471 px across 19 sections with the same four steps said three times. The longest reference page is 11,700.
9. References prove trust with customers and badges that we are barred from using, so our trust block must be our own data table, source list and plain certification statement.
10. The best reference copy names one concrete expensive situation. Ours leans on triplets and abstract adjectives.

## Appendix B. What I did not measure

Compiled CSS and JS bytes (no build run), the app's use of `brand.source.json`, `pricing.ts` figures, the owner of the tilt rule on /bid/, per-route JS, Confluence and Auth0 card hover (the heuristic found no card boxes), anything behind a cookie banner in the screenshots, and the production serving of the five font files.
