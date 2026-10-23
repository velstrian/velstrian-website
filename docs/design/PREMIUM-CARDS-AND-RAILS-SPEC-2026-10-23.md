# Premium cards, wedges and rails: design spec for the whole website

Date: 2026-10-23. Status: spec for a builder lane, no code changed by this document.
Brand: Velstrian, design system Quantum V (D309). Owner direction: 2026-10-23 (cards too flat and white, corner colour wash, horizontal card rails, Stripe wedges, "colours plus motion", "top 1% ultra premium", page by page).
Site rules that bind this spec: RULE 0-C (tokens only), RULE 0-U (simple for small business readers), D305 (play once, pause, WCAG 2.2.2), D307 (60 KB total script), one motion device not four, no em or en dashes in user facing text, calm hover contract (check-sheen).

## 0. The five decisions that matter most

1. **Tints are corner washes on a white card, never a grey fill.** A card stays white at its text zone and carries Iris, Violet or Cyan bleeding in from one corner, capped so the worst pixel still passes AA 4.5:1 for body text (table in section 3). Dark mode gets the same wash on the dark card, capped lower.
2. **Three card tiers, assigned by job.** Tier 1 plain (lists and legal), Tier 2 tinted (the default for marketing cards), Tier 3 feature (one per section at most, gradient art or stage fill). Each page section below names its tier, so a builder asks no design question.
3. **Rails use native CSS scroll snap and zero new JavaScript.** Same pattern Stripe ships on /blog (measured, section 1). Five places become rails. A phone shows a peeking next card, a desktop shows arrow buttons only if the existing 60 KB budget allows, otherwise none (the row is scrollable by trackpad, touch, keyboard and the focus scroll). No autoplay on rails, so D305 and WCAG 2.2.2 are met by having nothing that moves.
4. **Wedges are the Stripe skew, but built with clip-path on the band, at 3 degrees, on three seams only.** Stripe skews a full background by -6 degrees. We use a gentler angle and fewer seams so text never sits on a slanted edge and the page stays calm (RULE 0-U). The wedge is a band edge, not a new motion device.
5. **Hover stays calm.** Stripe lifts guide cards 8px on hover (measured). We do not copy that. The owner removed flashing hover effects on 2026-10-21 and `check-sheen.js` fails on anything beyond an edge step. Depth comes from colour and shadow at rest, not from hover movement.

## 1. What the reference sites actually do (measured)

How measured: raw HTML and linked CSS fetched with curl on 2026-10-23 from stripe.com/gb/guides, stripe.com/blog, linear.app and vercel.com, then searched for the properties below. A negative result is stated as a negative. Files were saved in the scratchpad, not committed. Linear and Vercel were sampled in part (Linear's fetched stylesheets were 28.7 KB, Vercel's 969 KB), so their entries are weaker evidence than Stripe's.

### Stripe (strongest evidence)

| Finding | Measured value | Source |
|---|---|---|
| Rail is native scroll snap | `.FullWidthCarousel__track{display:flex; overflow-x:scroll; scroll-snap-type:x mandatory; scroll-padding-left/right:var(--overflowMargin); scrollbar-width:none; overscroll-behavior-x:contain}` and `.FullWidthCarousel__track>*{scroll-snap-align:start}` | `v1-FullWidthCarousel-ca581ba22d8ecfdc500f.css`, used 14 times on /blog |
| Rail bleeds to the screen edge | The layout is `width:var(--windowWidth); margin-left:calc(var(--overflowMargin)*-1)`, with a 16px margin under 1112px and a centred-container-matching margin above. A 1px spacer keeps the first card aligned with the page text | same file |
| Card sizes on the rail | Card width is the window minus margins under 600px (one card nearly full width), two across at 600 to 1199px, a fixed 244px at 1200px and above. Gap 26px | `v1-UpdateCard-6f84d66dfdf363020027.css` |
| Rail hover | On a fine pointer only, a hover layer fades in (`#0a2540` fill) and the card scales 1.082, with `prefers-reduced-motion` setting transition to none. Scale is our "no" (see decision 5) | UpdateCard css |
| Wedge sections | `.Section__background{transform:skewY(var(--sectionAngle)); overflow:hidden; background:var(--backgroundColor)}` with `--angleNormal:-6deg` | inline CSS in the guides and blog HTML |
| Card depth is shadow plus colour | `--cardShadowSmall:0 6px 12px -2px rgba(50,50,93,.25), 0 3px 7px -3px rgba(0,0,0,.3)`, XLarge `0 50px 100px -20px rgba(50,50,93,.25), 0 30px 60px -30px rgba(0,0,0,.3)`. The shadow colour is a tint of the brand indigo, not black | guides HTML |
| Card radius is small | `--cardBorderRadius:8px` | guides HTML |
| Tinted card art is per category | Each guide card is 254 by 356px with a fill and stroke colour per category, for example `#19c9c9 / #66dcdc`, `#ff629c / #ff97bd`, `#1981e8 / #66abf0`, `#2c326a / #585e8d`. White text on the fill, art is a separate layer | `.GuidesCard--variant*` rules in the guides HTML |
| Palette is a ramp of seven named shades | `--shadeOneColor` to `--shadeSevenColor` (`#16cbe1`, `#0073e6`, `#1086db`, `#635bff`, `#96f`, `#002c59`, `#00c4c4`) used for gradients and card fills | guides and blog HTML |
| Heading font | `sohne-var`. Not relevant, we keep Manrope | HTML |

Negative result worth stating: I did not find a radial "corner glow" rule in the Stripe guides and blog CSS. Their tint comes from solid category fills and gradient art. The owner's "colour bleeding from a corner" is therefore our design, derived from Stripe's shadow tint and Linear's edge sheen, not a copy of one rule.

### Linear (partial)

Found in the sampled CSS: card sheen as `linear-gradient(135deg, #ffffff26 0%, #ffffff0d 25%)` (a corner light that fades by 25%), fills at 3 to 4 percent white (`#ffffff08`, `#ffffff0a`), and a pale blue to lilac gradient `linear-gradient(180deg, #b2d5ff 0%, #dfd1ff 100%)` on the page. No scroll snap rule appeared in the 28.7 KB sampled, so I do not claim Linear uses snap rails.

### Vercel (partial)

Found: a Tailwind snap utility (`scroll-snap-type:x`), edge fades by `mask-image:linear-gradient(#000 0 0%...#0000 100%)` (the fade that hints more cards), and radial gradients as vignettes. No skewed section found. Edge fade is worth adopting on rails.

### What we take and what we leave

| Take | Leave |
|---|---|
| Native snap rail, bleed to edge, hidden scrollbar, contain overscroll | Hover scale and hover lift (calm hover contract) |
| Brand tinted shadow instead of black | 6 degree skew of whole background (text on a slant, motion cost) |
| One saturated feature card per row, others quiet | A different bright colour per category (we have three brand hues, Iris, Violet, Cyan) |
| Edge fade mask on rails | Guide card 356px tall art cards (we have no art budget, section 4 uses gradient only) |

## 2. Audit of the current site (measured in the repo, 2026-10-23)

Corpus: `astro/src/styles/tokens.css` (4,103 lines), `evidenced.css` (3,432), `surfaces.css`, `astro/src/components/**`, `astro/src/pages/**`, `astro/scripts/run-gates.mjs`.

- **The one card is flat white by design.** `.ea-card` is `border:1px solid var(--ea-rule); border-radius:var(--v3-radius-card); background:var(--ea-raised)` with a border-only hover (`evidenced.css` 2765 to 2782). Its comment: "THE ONE CARD (D294)... Never a flat grey box" and a hover that steps only the edge. On a light band `--c-card` is `--c-light-0` (#FFFFFF) and `--shadow-card` is recomputed to a soft ink shadow (`tokens.css` 3806 to 3834). So every light card is white on near white with a hairline. That is the owner's complaint, confirmed.
- **Dark cards are glass**, `--c-card: rgba(255,255,255,0.05)` plus `--c-border: rgba(255,255,255,0.16)` (`tokens.css` 1222, 1270). They already carry depth. The work is on light bands.
- **Band system exists**: `Band.astro` takes `tone: 'light' | 'light-alt' | 'dark'`, and `.band--stage` is an indigo to purple 135 degree gradient with blooms (`tokens.css` 3545 to 3600). Home sequence today: Hero (light), Facts (dark), Audience (light), Capabilities (light-alt), Refusal (dark), Screens (light), Steps (dark), SecurityBuiltIn (light), Plans (light-alt), Faq (light), Close. Source: `pages/index.astro` 102 to 115 and each component's `<Band tone=...>`.
- **Card users** (count of `ea-card`, `ea-tcard`, `ea-cards` hits per file): integrations 16, glossary index 10, contact 7, tools 6, partners 6, RelatedPosts 5, sectors index 4, compare index 4, BuyDetail 3, plus FlashCards, ResourcesStandards, PricingBuy, BuyTrust, ResourceCard, PricingPlans, Plans, AboutNewsletter, blog index, tender-finder.
- **A scroll snap row already exists**: `FlashCards.astro` lines 266 to 279 (`overflow-x:auto; scroll-snap-type:x mandatory; scroll-snap-align:start`) in its `snap` layout, which stacks to a grid on a phone. The rail spec reuses this recipe and changes the phone behaviour (rail stays a rail).
- **No wedge or skew exists** (grep for `clip-path|skew|ea-wedge` in `src/styles` found nothing that paints a section edge).
- **The premium colour and motion work** (`ce778b5b` stage light leak, scroll depth, one press, refusal on the beat, and `19a8d4b0` brand gradient accent phrase on hero and refusal headlines) is the motion device. This spec adds no second motion device.
- **Budgets**: `check-budgets.js` has `jsTotal: 60 KB`, `jsShared: 12 KB`, `jsRouteMax: 13 KB`, `cssTotal: 220 KB`, `criticalPath: 170 KB`, `htmlPerRoute: 26 KB` (lines 228 to 399). Built `dist/_astro/*.js` totals 33,634 bytes across 7 files today (measured, consistent with the roughly 36 KB in the brief). CSS headroom is not measured here. The builder must read the current CSS total before step 1.

## 3. New tokens (exact values) and contrast

Source of values: Quantum V pack colours from the rollout map (Iris #6C63FF, Iris Deep #4D45DC and #3F38C4, Ribbon Violet #A477FF, Signal Cyan #31D7C5, Deep Space #090B12, Cloud #F4F5F8) and its contrast table. Contrast computed on 2026-10-23 with WCAG 2.x relative luminance (a 12 line node script, results below).

### 3.1 Pigments to add to `brand.source.json` (then run platform `packages/tokens/scripts/gen-brand.mjs`, which syncs the website copy, and confirm with `check-brand-drift.js`)

These are solid blends, so the guard can test a real colour. Light wash is the colour at its PEAK (the corner pixel), laid over white.

| Pigment | Value | How derived |
|---|---|---|
| `wash-iris-light` | `#F0EFFF` | Iris #6C63FF at 10% over #FFFFFF |
| `wash-violet-light` | `#F6F1FF` | Ribbon Violet #A477FF at 10% over white |
| `wash-cyan-light` | `#DEF9F6` | Signal Cyan #31D7C5 at 16% over white (cyan is paler so it can go deeper) |
| `wash-iris-dark` | `#202142` | Iris at 16% over #12151E |
| `wash-violet-dark` | `#292542` | Violet at 16% over #12151E |
| `wash-cyan-dark` | `#15282F` | Cyan at 10% over #12151E |

### 3.2 Contrast of body text at the peak of each wash (the worst pixel)

Light, text on the wash peak (floor 4.5):

| Wash peak | ink-0 #0C0E15 | ink-1 #30333C | ink-2 (muted) #5F636E | Iris ink #4D45DC | Bid #7E22CE | Buy #0E776C |
|---|---|---|---|---|---|---|
| Iris 10% on white `#F0EFFF` | 16.98 | 11.11 | 5.29 | 5.78 | 6.15 | 4.77 |
| Violet 10% on white `#F6F1FF` | 17.39 | 11.38 | 5.42 | 5.92 | 6.30 | 4.89 |
| Cyan 16% on white `#DEF9F6` | 17.43 | 11.41 | 5.43 | 5.93 | 6.31 | 4.90 |

All pass 4.5. Rule that follows: **a wash sits on a WHITE card only.** On the cloud page colour the same wash drops below the floor for muted and Buy text (iris 16% on #F4F5F8 gives Buy 4.11 and muted 4.55, measured), so washes never go on `--c-light-1`.

Dark, text on the wash peak:

| Wash peak | Cloud #F7F8FB | Steel #D8DAE1 | Mist #A9ADBA | Iris text #8C85FF | Bid UI #D08BFF | Buy #31D7C5 |
|---|---|---|---|---|---|---|
| Iris 16% `#202142` | 14.57 | 11.07 | 6.90 | 5.09 | 6.50 | 8.59 |
| Violet 16% `#292542` | 13.76 | 10.46 | 6.52 | 4.81 | 6.13 | 8.11 |
| Cyan 10% `#15282F` | 14.37 | 10.92 | 6.81 | 5.02 | 6.41 | 8.47 |

All pass. Ceilings measured and why they are the caps: dark cyan at 16% gives Iris text 4.36 and at 24% gives 3.53 (fails), dark violet at 24% gives 4.18 (fails). So the dark caps are iris 20% (4.80), violet 16%, cyan 10%. Light caps are the table above. These caps are the values written into the tokens, so no component can exceed them.

White label on a Tier 3 feature fill: white on Iris Deep #4D45DC is 6.56, on #3F38C4 is 8.16, on the stage mid blend (#3F38C4 into #6D28D9 at 50%) is 7.72.

### 3.3 CSS tokens to add to `tokens.css` (roles, in `@layer tokens`, bound to the pigments, never typed in components)

```
--card-wash-iris:    var(--wash-iris-light);     /* dark mode block rebinds to --wash-iris-dark */
--card-wash-violet:  var(--wash-violet-light);
--card-wash-cyan:    var(--wash-cyan-light);
--card-wash-pos:     0% 0%;                      /* corner the colour bleeds from, per card via data-wash-corner */
--card-wash-reach:   62%;                        /* wash fades to transparent by this distance */
--card-tint-iris:    radial-gradient(120% 90% at var(--card-wash-pos), var(--card-wash-iris), transparent var(--card-wash-reach));
--card-tint-violet:  radial-gradient(120% 90% at var(--card-wash-pos), var(--card-wash-violet), transparent var(--card-wash-reach));
--card-tint-cyan:    radial-gradient(120% 90% at var(--card-wash-pos), var(--card-wash-cyan), transparent var(--card-wash-reach));
--card-feature-fill: var(--stage-gradient);      /* already exists: indigo into purple */
--card-shadow-tint:  color-mix(in srgb, var(--c-teal-dark) 22%, transparent);  /* the Stripe idea: brand tinted shadow */
--elev-card-tinted:
  0 1px 2px color-mix(in srgb, var(--elev-shadow-ink) 8%, transparent),
  0 14px 34px -14px var(--card-shadow-tint);
--elev-card-feature:
  0 2px 6px color-mix(in srgb, var(--elev-shadow-ink) 10%, transparent),
  0 32px 70px -22px var(--card-shadow-tint);
--rail-gap:          var(--space-5);
--rail-card-w:       clamp(264px, 78vw, 340px);  /* 390px phone shows one card plus a peek of the next */
--rail-peek-fade:    linear-gradient(90deg, #000 0, #000 calc(100% - 48px), transparent 100%);
--wedge-angle:       3deg;
--wedge-depth:       clamp(28px, 4vw, 56px);     /* height of the slanted edge */
```

The `--card-wash-*` colours rebind inside the existing dark block, so one token name works on both temperatures, which is the same pattern as `--c-card`. `--rail-peek-fade` uses the literal `#000` as a mask alpha, which is not a colour value in the design system sense. The builder should confirm `check-palette-roles.js` does not flag it, and if it does, use `black` in a `mask-image` only inside tokens.css.

## 4. Card tiers

| Tier | Look | Class | Use |
|---|---|---|---|
| 1 Plain | White, hairline, no wash (today's `.ea-card`) | `.ea-card` | Lists a reader scans: FAQ rows, glossary term links, legal pages, tables, form panels, anything where colour would add noise |
| 2 Tinted | White base + one corner wash (Iris, Violet or Cyan) + `--elev-card-tinted` | `.ea-card.ea-card--tint` with `data-wash="iris\|violet\|cyan"` and optional `data-wash-corner="tl\|tr\|bl\|br"` | The default marketing card: capabilities, audiences, steps, benefits, resources, sectors, compare, integrations, related posts |
| 3 Feature | Stage gradient fill (indigo into purple), white text (6.56 to 8.16), `--elev-card-feature` | `.ea-card.ea-card--feature` | At most ONE per card group and one per section: the recommended plan, the lead capability, the newest guide, the main refusal statement |

Hue meaning (so colour is not random, RULE 0-U): Iris is the default and means "the platform". Violet means Velstrian Bid (matches `--bid`). Cyan means Velstrian Buy (matches the Buy signal). On shared pages (home, pricing) the product cards use violet or cyan to say which product, and generic cards use Iris. Never alternate hues for decoration. A group of cards that share a job uses ONE hue.

Corner rule: wash corner is top left by default and top right in the second card of a pair, so a row of three does not read as stripes. Text never starts in the top 30 percent of a card's height inside the wash zone without the caps above, which the contrast table already guarantees.

Hover on every tier: the border steps to `--c-border-hover` and nothing else changes, exactly the contract `check-sheen.js` measures. Feature cards additionally keep their fill. No lift, no scale, no shadow change.

Dark mode: `--card-wash-*` rebinds to the dark pigments, tint over `--c-card` glass. Tier 3 stays the stage gradient on both temperatures (white text 6.56 or better). Tier 1 is unchanged.

Reduced motion and forced colors: cards have no motion. Under `forced-colors: active` the wash is dropped (`background-image:none`) and the border carries the shape.

## 5. Wedges

Stripe skews a whole background by -6 degrees. We keep the idea and soften it.

- **Shape**: the bottom edge of a band slants by `--wedge-angle` (3 degrees, descending left to right) using `clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--wedge-depth)), 0 100%)` on the band's background layer, with the next band pulled up by `margin-top: calc(var(--wedge-depth) * -1)`. Content is NOT clipped or skewed, so text never sits on a slant (the failure Stripe's skew risks on narrow screens).
- **Class**: `.band--wedge-down` (slant ends the band) and `.band--wedge-up` (mirror). Set in `Band.astro` as an optional prop `wedge?: 'down' | 'up'`.
- **Where, exactly three seams site wide, all dark to light or light to dark**: (1) Home, under Hero into Facts. (2) Home, under Refusal into Screens. (3) Bid and Buy, under the hero into the first content band. Everywhere else seams stay straight. Fewer wedges is the premium look and the 390px phone reads cleaner.
- **Colour**: a wedge is the existing stage gradient on the dark side, so no new colour. A dark band wedge uses `--c-bg`, not black.
- **Phone**: `--wedge-depth` clamps to 28px, still visible, never taller than the band padding.
- **Reduced motion**: nothing moves, so nothing to reduce. The scroll depth on the stage from `ce778b5b` is the one motion device and a wedge never animates.
- **Forced colors and print**: `clip-path` removed, straight edge.
- **CWV**: clip-path on a static layer costs no layout and no extra request. Check CLS stays at the current value, the margin pull is static.

## 6. Rails

### 6.1 Behaviour (one component, `.ea-rail`, shared by every rail)

- Markup stays a list: `<ul class="ea-rail">` with `<li>` cards, so it is a real list for screen readers and works with no script and no CSS.
- CSS (adapted from the measured Stripe recipe): `display:flex; gap:var(--rail-gap); overflow-x:auto; scroll-snap-type:x mandatory; scroll-padding-inline:var(--gutter); overscroll-behavior-x:contain; scrollbar-width:none` and `> li { flex:0 0 var(--rail-card-w); scroll-snap-align:start }`. Edge bleed uses the same negative margin trick as Stripe, with `--gutter` from the existing layout token.
- **Keyboard**: the rail is a scroll container, so it gets `tabindex="0"`, `role="region"` and `aria-label="<what the cards are>, scroll sideways"`. Arrow keys scroll it natively. Every card link inside stays focusable and the browser scrolls a focused card into view, with `scroll-padding` stopping it hiding under the edge.
- **Focus**: `:focus-visible` on the rail draws the existing `--ea-focus` outline with offset, same as `a.ea-tcard:focus-visible`.
- **Buttons**: none by default. If the builder has script budget left after measuring, add previous and next as `.control` buttons driven by `scrollBy`, hidden until the script loads (the FlashCards rule, so a reader never sees a dead button). Recommended answer: skip them in the first build. Native swipe, trackpad and keyboard already work, and a visible fade on the right edge (`--rail-peek-fade` as `mask-image`) tells people there is more.
- **Autoplay**: none. D305 and WCAG 2.2.2 are therefore satisfied by having nothing that moves. `check-autoplay.mjs` should not see any new timer.
- **Reduced motion**: use `scroll-behavior:auto` only. No smooth scroll animation under `prefers-reduced-motion`.
- **390px phone**: `--rail-card-w` is `clamp(264px, 78vw, 340px)`, so at 390px one card is about 304px with a visible peek of the next. The rail bleeds to the screen edge. The page itself must still have no horizontal scroll, so the rail container uses `contain: inline-size` or a clipping wrapper with the scroller inside. Add the rail to the 390px overflow assertion in `check-render.js`.
- **Desktop**: three cards fit in view at 1440, so a rail only appears when there are more than three cards. With three or fewer the same markup renders as the existing grid (`.ea-cards`). One component, two layouts, chosen by count in the component, not by the page.
- **Dark mode**: the fade mask and snap are colour free. Cards inside follow their tier.
- **Print**: the rail becomes a wrapped grid.

### 6.2 Where rails go (only where a grid has more than 3 cards and the cards are comparable)

| Place | Cards | Why a rail |
|---|---|---|
| Home, Capabilities | the capability cards | Eight or more tiles in a tall grid today, a rail shortens the page |
| Home and Bid and Buy, Audience / "who it is for" | audience cards | Peers, easy to browse sideways |
| Blog index, "latest" strip, and RelatedPosts on every post | post cards | The Stripe /blog pattern, measured |
| Resources, guides row per category | guide cards | Stripe /guides pattern |
| Integrations, per category | integration cards | 16 card hits, long grid today |

Not rails: pricing plans (readers must compare side by side), FAQ, glossary, legal, sectors (few cards), forms. Hiding a plan off screen would harm comparison.

## 7. Page by page treatment

Builder can apply these with no further design questions. "Wedge" means seam wedge from section 5. "Rail" means section 6. Tier numbers from section 4. Section names are the components in `astro/src/components`.

### Home (`pages/index.astro`)
- Hero (light): headline keeps the brand gradient phrase (`19a8d4b0`). Add a top right Iris light leak behind the product screen. No cards. Wedge down into Facts.
- Facts (dark): stat cards Tier 2 dark, Iris wash, top left. Numbers stay Manrope.
- Audience (light): three audience cards, Tier 2, three hues by meaning: Iris (small firms), Violet (bid writers), Cyan (buyers). Becomes a rail only if more than three.
- Capabilities (light-alt): Tier 2 in a rail, Iris washes, with the first card Tier 3 feature ("answer the questions using your own documents"). The band background is the cloud colour, but each card keeps its own white base, so the wash sits on white and the section 3.2 rule holds. Never put a wash directly on the cloud background.
- Refusal (dark): one Tier 3 feature statement. Wedge up into Screens.
- Screens (light): product screenshots in a rail on a phone only, grid on desktop. Screens sit on an Iris to Violet soft glow (existing stage bloom), no card chrome.
- Steps (dark): numbered steps Tier 2 dark with Cyan wash. The existing FlashCards `steps` mode keeps its D305 play once behaviour.
- SecurityBuiltIn (light): Tier 1 plain checklist cards, because trust content should look calm.
- Plans (light-alt): the recommended plan is Tier 3 feature, the others Tier 2 Iris. No rail.
- Faq (light): Tier 1 only.
- Close: Tier 3 panel on the stage gradient.

### Velstrian Bid (`pages/bid.astro`)
Violet is the page hue (matches `--bid`). BidHero: stage gradient with violet bloom, wedge down. BidWhatItDoes: Tier 2 violet washes in a rail. BidDetail: FlashCards cards Tier 2 violet, "Read in full" stays native details. Steps: Tier 2 dark with violet. Screens: as home. Plans: as home. BidTrust: Tier 1. BidFaq: Tier 1. Close: Tier 3.

### Velstrian Buy (`pages/buy.astro`)
Cyan is the page hue. BuyHero: stage gradient with cyan bloom, wedge down. BuyWhatItDoes: Tier 2 cyan in a rail. BuyBoundary: Tier 3 feature statement (what Buy will not do). BuyDetail and BuyTrust: Tier 2 cyan and Tier 1. BuyFaq: Tier 1. Close: Tier 3. Check Buy text on cyan wash: 4.90 at the cap, passes.

### Pricing (`pages/pricing.astro`)
PricingHero: stage gradient, no wedge. PricingPlans: recommended plan Tier 3, others Tier 2 Iris, side by side, no rail. PricingBuy and PricingPurchaseOrder: Tier 1. PricingCredits: Tier 2 Cyan (credits relate to Buy and Bid use). PricingCompare: table stays Tier 1, a faint Iris wash on the recommended column header only. PricingFaq: Tier 1. Money numbers are never placed on a gradient.

### Compare (`pages/compare/index.astro`, `[...slug].astro`, layout `Compare.astro`)
Index: Tier 2 Iris cards in the grid (4 hits today), the newest or main comparison Tier 3. Detail page: comparison table Tier 1, verdict panel Tier 3, "who should pick which" two Tier 2 cards Violet and Cyan. No rail.

### Blog index and posts (`pages/blog/index.astro`, `layouts/Article.astro`, `RelatedPosts.astro`)
Index: newest post is a wide Tier 3 feature card. The rest sit in category rows, each a rail of Tier 2 post cards with the category colour mapped to Iris, Violet or Cyan (three categories maximum on screen, else Iris). Post page: keep the dark hero to light reading pane hard cut exactly as the Article.astro comment requires (it says never a gradient, so NO wedge on the cut). Reading pane is Tier 1 only, long text never sits on a wash. RelatedPosts becomes a rail of Tier 2 cards on the dark foot band. `TypeCover.astro` covers already give tinted art, reuse their hue per post type.

### Resources and guides (`pages/resources.astro`, `ResourcesGrid`, `ResourceCard`, `ResourcesStandards`)
The site has no `/guides` route, `resources` is the guides equivalent. ResourcesHero: stage gradient. Category rows as rails (Stripe /guides pattern) of Tier 2 cards, each category one hue. The newest guide Tier 3. ResourcesStandards: Tier 1, standards are reference.

### Glossary (`pages/glossary`, `layouts/Glossary.astro`)
Tier 1 only. Letter index and term cards are a lookup tool, colour adds noise. Hero gets the stage gradient. Term page: definition panel gets a single Iris wash Tier 2.

### About (`pages/about.astro`, `components/about/*`)
AboutHero: stage gradient. AboutStory: Tier 1 text. AboutHistory: timeline cards Tier 2 Iris. AboutRoles and AboutVariants: Tier 2 in a rail only if more than three. AboutTrust: Tier 1. AboutNewsletter: Tier 3 panel.

### Legal pages (`layouts/Legal.astro`, `[legal].astro`, cookie preferences)
Calm on purpose. Page header on the stage gradient, body Tier 1 only, no wash, no rail, no wedge. A summary box at the top ("in plain words") is Tier 2 Iris, because a small business reader needs the short version first (RULE 0-U). Contrast on long text is the plain 17 to 1 ink on white.

### Other pages
Sectors index and detail (`Sector.astro`): Tier 2 Iris cards, grid (few cards). Integrations: Tier 2 rail per category. Tools (tender finder, compliance matrix): the tool panel is Tier 1, the intro cards Tier 2. Contact and partners: forms Tier 1, route cards Tier 2. FAQ page: Tier 1. Changelog and roadmap: Tier 1 rows with an Iris wash on the "now" item. 404: one Tier 3 card.

## 8. Plain words check (RULE 0-U)

What this simplifies for a first time reader from a 10 person firm: colour tells them which product they are looking at (violet means writing bids, cyan means buying), one highlighted card per group says where to start, long pages become sideways rows they can skim, and legal pages stay calm with a plain summary first. No new jargon is introduced. Rail labels read "Swipe to see more" in plain words, never "carousel".

## 9. Gates that will check it, and the guard to extend

Per RULE 0-G, no new gate, no new ratchet. Extend the existing guards, all already in `scripts/run-gates.mjs`.

| Existing gate | What it checks for this work | Extension needed |
|---|---|---|
| `check-app-contrast.js` | text on surfaces | Add the wash peaks from 3.2 as rendered backgrounds (light and dark) and fail below 4.5. THIS is the guard to extend, and it is the one that stops a future wash going past its cap |
| `check-palette-roles.js` | components name roles, only tokens.css names colours | Nothing, it already forbids raw hex in components. Verify the new tokens pass |
| `check-design-system.js` and `check-treatments.js` | one recipe per job | Add `.ea-card--tint`, `.ea-card--feature` and `.ea-rail` as the only definitions, so no component restates a wash |
| `check-sheen.js` | calm hover | Add one assertion: Tier 2 and Tier 3 hover changes the border only |
| `check-render.js` | no horizontal overflow at 390 | Add the rail pages to the 390px sweep and assert the document does not scroll sideways |
| `check-autoplay.mjs` | nothing moves unasked | Assert the rails add no timer (expected result: unchanged) |
| `check-budgets.js` | CSS 220 KB, JS 60 KB, route JS 13 KB | No change to budgets. Expected: JS unchanged (no new script), CSS grows by an estimated 2 to 3 KB, which the builder must measure against headroom before step 1 |
| `check-cwv.js` | CLS and LCP | No change, review the number after the wedge steps |
| `check-brand-drift.js` | website and platform brand copies match | Run after step 1 to prove sync |
| `check-english.js`, `check-comment-terminators.js` | dashes and copy | Any new copy ("Swipe to see more") must pass |

Red-prove the contrast extension once (set a wash to 24% locally and confirm the gate fails), as RULE 0-C requires for a guard test.

## 10. JavaScript budget and Core Web Vitals

- JS: step plan adds ZERO bytes in steps 1 to 6. Today 33,634 B in 7 files under a 60 KB limit (measured on `dist/_astro`). Optional rail buttons (step 7) would add under 1 KB if built on `scrollBy`, so the total stays far under 60 KB.
- CSS: washes are static `background-image` gradients, no images, no extra requests.
- LCP: unaffected, no new hero image. CLS: rail cards have fixed `flex-basis` and aspect from content, wedge margins are static, so no shift expected. INP: no new handlers.
- Paint cost: radial gradients on perhaps 30 cards per page are cheap. Do not add `backdrop-filter` to tinted cards (it is expensive and the glass dark card already has it).

## 11. Ordered build plan (builder lane, Opus 5.5, one wave then one targeted verification)

Per RULE 0-G and 0-T, no push and no full suite. Verify with targeted gates only. One heavy build at a time (RULE 0-L).

1. **Tokens.** Edit `astro/src/styles/brand.source.json` (add the 6 wash pigments, plus bindings), run platform `packages/tokens/scripts/gen-brand.mjs`, edit `astro/src/styles/tokens.css` (section 3.3 tokens, dark rebind, forced colors). Verify `check-brand-drift.js`.
2. **Card tiers.** Edit `astro/src/styles/evidenced.css` next to `.ea-card` (line about 2765): add `.ea-card--tint`, `.ea-card--feature`, the `data-wash` and `data-wash-corner` attribute selectors, hover contract unchanged. Update `astro/src/styles/surfaces.css` only if a duplicate card recipe appears there.
3. **Contrast guard.** Extend `astro/scripts/check-app-contrast.js` with the section 3.2 peaks. Red-prove it once.
4. **Rail component.** New `astro/src/components/ui/Rail.astro` (wraps the list, picks rail or grid by count, adds role, label, tabindex) and `.ea-rail` CSS in `evidenced.css`. Reuse the recipe in `FlashCards.astro` lines 266 to 279 and change its phone behaviour to stay a rail.
5. **Apply tiers and rails per page** (section 7), one pass, in this file order: `components/evidenced/{Hero,Facts,Audience,Capabilities,Refusal,Screens,Steps,SecurityBuiltIn,Plans,Faq,Close}.astro`, then `components/bid/*`, `components/buy/*`, `components/pricing/*`, `components/about/*`, `components/resources/*`, `components/blog/RelatedPosts.astro`, `pages/blog/index.astro`, `pages/compare/index.astro`, `pages/sectors/index.astro`, `pages/integrations.astro`, `pages/tools/index.astro`, `pages/contact.astro`, `pages/partners.astro`, `pages/glossary/index.astro`, `layouts/{Legal,Glossary,Compare,Sector}.astro`.
6. **Wedges.** Add the `wedge` prop to `components/evidenced/Band.astro`, `.band--wedge-down` and `.band--wedge-up` CSS in `evidenced.css`, and apply to the three seams in section 5 (`pages/index.astro` via `Hero` and `Refusal`, `BidHero`, `BuyHero`).
7. **Optional rail buttons** (only if the owner wants visible arrows): new `astro/src/scripts/rail.ts` under 1 KB, hidden until loaded, `.control` class.
8. **Extend the other gates** listed in section 9 (`check-sheen.js`, `check-render.js`, `check-treatments.js`, `check-design-system.js`).
9. **One verification wave**, local only: `astro check`, `astro build`, then `check-app-contrast`, `check-palette-roles`, `check-design-system`, `check-treatments`, `check-sheen`, `check-render` at 390 and 1440, `check-autoplay`, `check-budgets`, `check-cwv`, `check-english`, `check-brand-drift`, in one `run-gates` invocation. Screenshot home, bid, buy, pricing, blog index, one post, resources, glossary, about and one legal page at 390 and 1440, light and dark, and read them as a first time small business reader (RULE 0-U).
10. **Board rows.** Add website board rows with `add-issue.js` and rebuild the :8099 board (the owner rule that every AI updates its own rows). No deploy. The owner tests on the local dev server (port 8093) before anything reaches the production website.

## 12. Decisions for the driver (recommendations, none are layout questions for the owner)

1. Rail arrow buttons: ship none in the first build (recommended), add in step 7 if the owner asks after seeing it.
2. Wedge angle 3 degrees and exactly three seams (recommended). Owner may ask for Stripe's steeper -6 degrees later and the token `--wedge-angle` makes that one line.
3. Hue meaning: Iris platform, Violet Bid, Cyan Buy (recommended, matches the existing signals).
4. Whether `check-palette-roles.js` accepts `#000` inside a `mask-image` token. Builder to test and, if flagged, move the literal into tokens.css only.

## 13. Limits of this research

Stripe was measured from its HTML and 25 linked CSS files. Linear and Vercel were sampled in part and the entries say so. I did not run a browser, so computed styles after JavaScript were not measured, and no screenshot of any site was taken. The contrast numbers are computed, not rendered, and the guard in step 3 is what proves them on the real build.
