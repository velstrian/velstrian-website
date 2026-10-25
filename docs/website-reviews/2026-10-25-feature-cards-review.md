# Feature cards review, 2026-10-25

Board items: A-418 (this review), A-419 (integrations MCP card), A-420 (compare screens).
Screenshots are in `docs/website-reviews/2026-10-25/`, named `before-*` and `after-*`, each at 1440, 1024 and 390.
Every page was checked to answer 200 on its own URL on the local dev server (port 8093) before it was measured.

## What was reviewed

Four sample cards the owner had Gemini build, all drawn by one new component, `astro/src/components/ui/StripeCard.astro`:

| Page | Card | Variant | Art |
|---|---|---|---|
| /glossary/ | Statutory Spotlight · PPN 026 | banner | statutory-horizon |
| /glossary/ | Intelligence and analysis (links to /blog/) | compact | iris-flow |
| /glossary/ | Toolkit and benchmarks (links to /resources/) | compact | cyan-aurora |
| /integrations/ | Featured integration · AI assistants (MCP) | banner | protocol-stream |

Screenshots: `before-glossary-gxspotlight-*.png`, `before-glossary-gxcross-*.png`, `before-integrations-intspotlightband-*.png` and the matching `after-*` files.

## Verdict

The idea is good and the visual direction fits the site. A clear title, one plain line and one link, beside a quiet piece of brand art, is the kind of signpost a first time visitor from a small firm can act on in one read. The colours already come from the central tokens (`--qv-iris`, `--qv-violet`, `--qv-cyan`, `--ea-*`). It needed fixes in six places before it met the site's own rules, and those are done (below). The copy on the glossary cards still reads like it was written for procurement specialists, which is against RULE 0-U, and that is a proposal for the owner rather than a change.

## Defects found and fixed in the samples

1. **A second motion system on hover.** The card lifted 3px, swapped to a larger shadow, nudged the arrow and zoomed the art by 3 percent. Every other card on the site follows the calm card contract (D294, `check-sheen.js` rule 1): on hover the edge moves one step in colour and the link underlines, nothing else. The lift, the shadow swap and the zoom were also not on `--transition-hover`, which carries `border-color` only, so they jumped rather than eased. Now: edge colour plus link underline, the same as `.ea-tcard`.
2. **A resting shadow.** Cards on this site carry none. Removed.
3. **Hardcoded colour.** The decorative lines and glints were drawn in the literal `white` (RULE 0-C). They now draw in `currentColor`, set once from `--stage-ink`, the role for ink on the brand gradient (naming `--c-white` directly is itself a defect under `check-palette-roles.js`). The `16px` fallback inside the radius `var()` was removed, so `--v3-radius-card` is the only source.
4. **Clashing SVG ids.** Gradient and filter ids such as `sh-bg` are global to the document, so two cards with the same art on one page would share one set of definitions. Each card now scopes its ids to its art and title.
5. **Heading order.** The integrations card is the first thing after the page's `h1`, but rendered an `h3`, skipping a level. The component takes a `level` prop, and that card renders an `h2`.
6. **Phone layout.** Stacked on a narrow column, each card drew a 190px block of gradient under its text. At 390 wide the two glossary cards were mostly decoration. The art is now a 64px band on narrow columns and a side pane only once the card is wide enough. Also: `cursor: pointer` on a card with no link is gone, and a linked card has a visible focus ring.
7. **Sentence case (RULE 0-S).** The glossary titles were in title case with ampersands ("Regulatory Blog", "Procurement Act 2023 & PPN 026 Transition"). Now sentence case and "and".

Contrast: the text sits on the solid card ground, never on the art, and uses `--c-text`, `--ea-sub` and `--ea-accent-ink`, the same pairs every other card uses, so the contrast is unchanged from the site's audited cards. Reduced motion: the only motion left is the edge colour transition, which is switched off under `prefers-reduced-motion: reduce`.

Performance note: each art pane uses an SVG `feGaussianBlur` of 28 to 30 over a large circle. One blur per card is cheap on a laptop and measurably more expensive on a low end phone. With two or three cards on a page it is fine. If cards spread to many pages, swap the blurred circle for a radial gradient with a soft stop, which looks the same and costs one paint.

## The integrations card (A-419, fixed)

The draft linked to /roadmap/, which never mentions MCP, and claimed "certified read scopes" and "zero context leakage", neither of which is a thing the product states. What is live, checked in crowagent-platform: a read only MCP connector (`api/app/routers/mcp.py`) and a read and write MCP server (`api/app/mcp/server.py`), both used with a Velstrian API key. The agent access server (`api/app/mcp/agent_tools.py`) is built and switched off (`MCP_SERVER_ENABLED` defaults off).

Now: "Work on your bids from your AI assistant. Connect an AI assistant such as Claude to Velstrian Bid over the Model Context Protocol (MCP). Use the read only connector to look things up, or the read and write server to work on your bids. Both use a Velstrian API key you create." It links to a new `#mcp` anchor on the same page, where the MCP card in "E-sourcing, CRM and agents" now describes both connections, directly above the line saying which plans include the Integrations package. The roadmap lists the agent access server under "In progress" as built and not yet switched on, with no date.

## Copy proposals for the glossary cards (owner decision, not changed)

RULE 0-U: a first time reader from a 10 person firm should understand each card in one read.

| Card | Now | Proposed |
|---|---|---|
| Spotlight kicker | Statutory Spotlight · PPN 026 | In focus · PPN 026 |
| Spotlight title | Procurement Act 2023 and the PPN 026 transition | The new rules for public contracts, in plain English |
| Spotlight line | Plain-English legal briefing on the statutory shifts reshaping UK public bidding: Most Advantageous Tender (MAT) scoring, transparent supplier registers, and published KPIs. | What changed when the Procurement Act 2023 started, and what PPN 026 asks you to show about social value. Each term explained the first time it appears. |
| Blog kicker | Intelligence and analysis | Blog |
| Blog line | Deep analysis of PPN policy shifts, statutory thresholds, and UK public procurement deadlines. | Short guides to winning public and private contracts, and what each rule change means for your bids. |
| Resources kicker | Toolkit and benchmarks | Free guides and tools |

Also proposed: rename `StripeCard` to `FeatureCard`. It is an internal name, but it names another company's product.

## Where similar cards would help (proposals, not built)

The rule for each: one card per page, a signpost to a next step the visitor would otherwise miss, static apart from the site's shared arrival on scroll. No card gets its own motion.

| Page | Card | What it shows | Why it helps a first time small business visitor |
|---|---|---|---|
| /resources/ | Free tool | The Tender Compliance Matrix: put a tender's requirements in one checklist, free | A zero cost first step. Today it is one link among many |
| /blog/ | Start here | The guide to finding your first public sector contract | Most first visitors have never bid. One obvious starting article beats a list sorted by date |
| /bid/ | See it end to end | The walkthrough (/walkthrough/): one bid from finding the contract to approval | Answers "what will I actually do in it" before the pricing question |
| /buy/ | For buyers: PPN 026 | What PPN 026 asks of a buyer, linking to /glossary/ppn-026/ | Busy buyers are not procurement specialists either. Points them to the plain explanation |
| /faq/ | How we use AI | Links to /ai/: what the AI does, what a person approves, where data goes | The commonest trust question for a small firm, answered on a page built for it |
| /security/ | How we use AI | The same /ai/ card | Security readers ask about AI next |

## Where they would add noise

- **Home page.** It already carries the hero answer screen, the product carousel, the capability tabs and the steps block, all on the one automatic advance. A decorated card would compete with the one primary action.
- **/pricing/.** A decision page. A card pulls attention from choosing a plan, and anything near a price is guarded by `check-pricing-parity.js` for good reason.
- **The compare pages.** Dense evidence pages that now carry a screen with its steps (A-420). A card would be a third device in the same scroll.
- **/contact/, legal pages, cookie preferences, 404.** One job each. A card there is decoration.
- **More than one per page.** Two glossary cards side by side work because they are a pair at the end of the page. Three or more turns signposts into a gallery.
