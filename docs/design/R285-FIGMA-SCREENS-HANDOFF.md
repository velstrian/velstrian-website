# R285-WEB-FIGMA-SCREENS-01: Figma product screens, handoff (PARTIAL, stopped for machine restart)

Status 2026-10-22: STOPPED EARLY on the driver's instruction (machine restart). Nothing exported, nothing wired.

Figma file: https://www.figma.com/design/KO4JkhUrCvvopjP8E8zQLa (team "Crow", page "Screens").

## Done

- Renderer library stored in the file (shared plugin data `velstrian` / `lib`, 20.6 KB). Load in any `use_figma` call with
  `const L = await eval(figma.root.getSharedPluginData('velstrian','lib'))(figma);`
  It holds the app UI kit built from the real light theme tokens (`packages/tokens/src/tokens.css` `[data-theme="light"]`,
  `BRAND_MARK_TOKENS` for the mark), Plus Jakarta Sans display, Inter body, radii 6/8/12: sidebar with the Velstrian
  Tenderworks mark and Bd/By product rail, header (breadcrumb, search, bell, avatar, no beta pill), cards, chips, buttons,
  tabs, tables, bars, icons (lucide paths).
- Screen S2 "screen/response-answer" (node 3:122, 1440x900): Velstrian Bid response workspace, question list, drafted
  answer with two cited sources, grounding check passed. Not yet screenshot checked.

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
breakdown (home-cap-decide, bid-decide; product labels from `common/humanise.ts` fitDimension, points 22/20/18/12/12/6/10).

Proposed drops (driver's 6 per page): /bid/ drops bid-check and its carousel; /buy/ drops buy-cap-evidence and the
BuyDetail drawn mocks. Counting rule used: a tab set or a carousel is one visual position. Owner or driver to confirm.

## Findings for the integration lane

- Buyer scores in the product are 0 to 100 per criterion (`web/app/(dashboard)/buyer/evaluations/[id]/page.tsx:657`).
  The website's "Panel score: 4 / 5" (BuyHero, AboutHero) does not match the product.
- Capabilities and BidWhatItDoes copy still says "or forward the email". Email intake is OFF in production (D288, facts A6).
- Insights in the product has a Win rate tile: the screen must leave it out.
- Remove every "Example data" and "A real screen from a demo account" caption when wiring.
