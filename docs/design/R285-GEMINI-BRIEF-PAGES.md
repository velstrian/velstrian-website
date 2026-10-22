# Gemini build brief: move a page onto design system v3

Row R285-WEB-ENTERPRISE-REDESIGN-01, strategy 0.7. Written 2026-10-22 by the platform driver (Claude) after reviewing the /buy/ build. Gemini builds ONE page per run, the driver checks every line before anything is committed. The page for this run is named in the prompt.

## Read these first, in this order

1. `docs/design/R285-GEMINI-BRIEF-BUY-PAGE.md`, section "Hard rules". Every rule there binds this run too (files you may change, tokens only, Action buttons only, no red, British English with no em or en dashes, never invent a fact, product views as HTML recreations captioned "Example data", identity, NO commit, NO push, shared machine).
2. `docs/design/R285-DESIGN-STRATEGY-2026-10-21.md` section 0 (0.1 to 0.8). Section 0 overrides sections 2 to 6.
3. The finished v3 pages, as the model to copy: `astro/src/pages/index.astro`, `bid.astro`, `buy.astro`, with `astro/src/components/evidenced/`, `components/bid/` and `components/buy/`.
4. The current version of YOUR page. It is the SOURCE OF FACTS. Keep every capability, link, form and fact it carries (RULE 0-U: simplicity is never a scope cut). Rewrite how it is said.

## What the /buy/ review found, so do not repeat it

- **Shared components take props now.** `evidenced/Steps.astro` takes `steps` and `action`. `evidenced/Close.astro` takes `title`, `lead` and `primary`. Pass copy that fits YOUR reader. Never leave the supplier default ("download your bid") on a page for someone else.
- **Never type a price, a percentage or a count.** Read them from `astro/src/data/pricing.ts` (`PLANS`, `BUYER_PLANS`, `CREDIT_TOPUPS`, `TRIAL_DAYS`, `OVERAGE_PER_CREDIT_LABEL`, `annualDiscountPct(plan)`) and `astro/src/data/site-facts.ts`. A typed "£299" or "10% off" was found and removed.
- **Never put `#` straight before digits in visible copy** ("Receipt #801"). The palette gate reads it as a colour. Write "Receipt 801".
- **Do not size stages, frames or cards yourself.** No local `height`, `min-height`, `aspect-ratio` or `width` on `.ea-stage`, `.ea-frame`, `.ea-card` or plan cards. The driver is fixing equal sizing centrally in `evidenced/` right now, and your page inherits it only if you leave sizing to the components.
- **Every old heading must land somewhere.** In your report, list each heading of the old page and where its content now lives (band and new headline), or that it was deliberately reworded. The content parity gate checks this, and the driver records it.

## Check your work before you report

1. http://localhost:8093/<your route>/ returns 200, and the landed URL is your route (not a 404 page). Look at it at 1440 px and 390 px: no horizontal scroll, nothing overlaps.
2. Free RAM above 1 GB and no other `astro build` running, then from `astro/`: `node node_modules/astro/bin/astro.mjs build`, `node scripts/copy-assets.js`, `node scripts/copy-cf-config.js`.
3. Then run each of these from `astro/` and report the exit code of each: `check-design-system.js`, `check-palette-roles.js`, `check-english.js`, `check-facts.js`, `check-site-facts.mjs`, `check-content-parity.js`, `check-motion.js`, `check-csp.js`, `check-budgets.js`, `check-controls.js`, `check-faq-parity.js`, `check-seo-parity.js`, `check-links.js`, `check-brand-names.js`, `check-sheen.js`. Fix what is yours. If a failure is in a shared file you may not touch, put it under "Needs from the driver" with the gate output.

## Report back (paste this filled in)

- Files changed and created, one line each.
- The storyline band by band, with each headline.
- Every fact used and where it came from (file and line).
- Old heading to new home, for every heading of the old page.
- What you simplified, in plain words (RULE 0-U).
- Needs from the driver.
- Gate results, one line each with exit code.

## Page notes

### /pricing/ (`astro/src/pages/pricing.astro`)
The plan is already written: `../crowagent-platform/docs/release-2.8.5/design/R285-BILLING-AND-PRICING-TRANSFORMATION-SPEC-2026-10-21.md`, Part 2 (2.1 to 2.4) and the website rows of Part 4 (W1 to W13), with the decisions in Part 6. Follow it. Section 2.4 says what must wait for the production round: copy that is not yet true on production stays as it is today, and you list it under "Needs from the driver". Plan cards: name, one "for you if" line, price, three lines, one button, every number from `pricing.ts`.

### /about/ (`astro/src/pages/about.astro`)
Who Velstrian is and why it exists, for a small firm deciding whether to trust us. No customer names, quotes or numbers we cannot source. Leave a clearly marked slot for a people photo in the story band (`<!-- PEOPLE PHOTO SLOT: people-small-team -->`), but do NOT reference the files in `Assets/images/r285-gemini/` yet. The driver converts and credits them first.
