# R285-WEB-FIGMA-SCREENS-01: Figma product screens, handoff

Status 2026-10-22 (resumed after the restart): ALL BUILT AND EXPORTED, 10 Screens, 11 Panels, 3 coded explainer specs.
NOT WIRED into any page: integration is a separate lane after lane Y finishes.

Figma file: https://www.figma.com/design/KO4JkhUrCvvopjP8E8zQLa (team "Crow", page "Screens").

## Done

- Renderer library stored in the file (shared plugin data `velstrian` / `lib`, 20.6 KB). Load in any `use_figma` call with
  `const L = await eval(figma.root.getSharedPluginData('velstrian','lib'))(figma);`
  It holds the app UI kit built from the real light theme tokens (`packages/tokens/src/tokens.css` `[data-theme="light"]`,
  `BRAND_MARK_TOKENS` for the mark), Plus Jakarta Sans display, Inter body, radii 6/8/12: sidebar with the Velstrian
  Tenderworks mark and Bd/By product rail, header (breadcrumb, search, bell, avatar, no beta pill), cards, chips, buttons,
  tabs, tables, bars, icons (lucide paths).
- Screen S2 "screen/response-answer" (node 3:122, 1440x900): Velstrian Bid response workspace, question list, drafted
  answer with two cited sources, source check passed. Screenshot checked and fixed on resume, see below.

## Progress, resumed 2026-10-22 after the restart

Screenshot checked and exported (1440x900 PNG, `Assets/product-screens/`, recorded in
`astro/src/data/product-screens.json`): S1 bids board 5:119, S2 response answer 3:122 (fixed: header search wrap,
editor header overflow, footer overlap, chips aligned), S3 no source 6:2, S4 delivery promises 7:122, S5 buyer
evaluation 7:458, S6 discover feed 8:119, S7 requirement pack 9:134, S8 supplier promises after award 9:409, S9 insights
(no win rate tile, no win rate chart) 9:715, S10 action centre 10:119. All 10 Screens done.
All 11 Panels done, built at 600x450 then `rescale(2)` in Figma, so each frame is 1200x900 and exports 1:1 (the 2x
export of a 600x450 view): P1 feed 11:43, P2 question list 11:101, P3 who is doing what 11:159, P4 comments 11:209,
P5 promises checklist 13:53, P6 supplier reply with panel score 68 / 100 13:109, P7 pre-read boundary (product notice
verbatim) 13:140, P8 requirement pack 13:197, P9 submissions and supplier questions 15:59, P10 whole life costs 15:117,
P11 after award 15:181. Screens sit on the page in one row at y=0, Panels in one row at y=1100. The library's header search now takes `o.search` and truncates to one line.

## Size system (driver decision, replaces the brief's)

- Screen 16:10, 1440x900, full app view with sidebar and header.
- Panel 4:3, 1200x900, one focused part of the app, no sidebar, own card chrome. Plan: build at 600x450 with real app
  type sizes, then `rescale(2)` so it reads as a zoomed app view.
- Phone 390x844 only where the phone is the point, at most one per page.
- Export 2x, WebP and AVIF, into `Assets/product-screens/`, plus `astro/src/data/product-screens.json`.

## Planned designs (left to build)

Screens (10 designs): S1 bids board (home-car-board), S2 response answer (home-car-answer, screen-answer-library,
screen-answer-list, bid-hero, about-hero as a recommendation), S3 no source found (home-car-refusal), S4 delivery promises
(home-car-deliver, screen-evidence), S5 buyer evaluation (buy-hero), S6 discover feed (screen-find), S7 requirement pack
(screen-buyer-requirement), S8 supplier promises after award (screen-buyer-delivery), S9 insights WITHOUT the win rate tile
(screen-insights), S10 action centre (screen-action-centre).

Panels (11 designs): P1 feed (home-cap-find, contact-call-find, home-who-small), P2 question list (home-cap-answer),
P3 who is doing what (home-who-team), P4 comments (home-cap-check), P5 promises checklist (home-cap-deliver, bid-deliver),
P6 supplier reply with proof and panel score (home-who-buyer), P7 pre-read boundary (buy-boundary-gate, product disclaimer
verbatim from `public-sector/preread.ts`), P8 requirement pack (buy-cap-request), P9 submissions and clarifications
(buy-cap-collect), P10 whole life costs (buy-cap-compare), P11 after award (buy-cap-decision).

Coded, Figma spec only, never exported: hero answer sequence (home-hero-answer), refusal check (home-refusal-check), fit
breakdown (home-cap-decide, bid-decide, product labels from `common/humanise.ts` fitDimension, points 22/20/18/12/12/6/10).

Proposed drops (driver's 6 per page): /bid/ drops bid-check and its carousel, /buy/ drops buy-cap-evidence and the
BuyDetail drawn mocks. Counting rule used: a tab set or a carousel is one visual position. Owner or driver to confirm.

## Coded explainer specs (Figma only, never exported)

Page "Screens", row at y=2200. Each frame shows the end state, which is also the reduced motion state, the timed
sequence, and the rules: spec/hero-answer-sequence 17:18 (home-hero-answer), spec/refusal-check 17:117
(home-refusal-check), spec/fit-breakdown 17:236 (home-cap-decide, bid-decide, labels from `common/humanise.ts`,
weights 22/20/18/12/12/6/10 and bands 68/45 verified in `api/app/services/bid_fit.py`).

## Content checks made on every frame

- Buyer scoring is 0 to 100 per criterion everywhere (S5, P6, P7, P11). No "4 / 5" anywhere.
- Insights has no Win rate tile and no win rate chart (tiles are Total bids, Social value delivered, Evidence completion).
- No email forwarding, no test mode or beta pill, no "example" labels. A text scan over all 1,153 text layers found no
  banned word, no em or en dash and no semicolon.
- Public and private named: bid board, discover feed (private invitation upload), action centre, insights subtitle.
- Fictional organisations only (Northfield Facilities, Riverside Borough Estates, Hollin Vale Homes and others). No
  buyer name uses the word council.
- Pre-read notice (S5, P7) is verbatim from `public-sector/preread.ts`. Blocked figure copy (S3) follows
  `bid/answer-editor.ts` ungroundedFiguresBlocked, in plainer words.

## JSON schema (`astro/src/data/product-screens.json`)

`{ schema, figmaFile, items: [{ id, slug, kind: "screen"|"panel", product: "bid"|"buy", node, file, width, height,
alt, slots[] }] }`. `file` is relative to the repo root. `slots` are the planned visual positions from the plan above,
the integration lane decides final wiring.

## Left for the integration lane

- Export is PNG only. WebP and AVIF conversion was not done (the brief for this lane asked for PNG).
- Proposed drops for the 6 per page cap are still a driver or owner decision (see above).
- Wiring, captions, and removing "Example data" and "A real screen from a demo account" captions.

## Findings for the integration lane

- Buyer scores in the product are 0 to 100 per criterion (`web/app/(dashboard)/buyer/evaluations/[id]/page.tsx:657`).
  The website's "Panel score: 4 / 5" (BuyHero, AboutHero) does not match the product.
- Capabilities and BidWhatItDoes copy still says "or forward the email". Email intake is OFF in production (D288, facts A6).
- Insights in the product has a Win rate tile: the screen must leave it out.
- Remove every "Example data" and "A real screen from a demo account" caption when wiring.
