# Thumbnail specs

One spec per video. These are text specs, not images. Whoever builds the thumbnails uses only the brand tokens listed here, never an eyeballed colour. Tokens are read from `velstrian-website/astro/src/styles/tokens.css` and `brand.source.json` (Quantum V pack, owner decision D309).

## Shared rules

- Dark theme by default. Background `--c-bg` (#090B12). An optional deeper panel uses `--c-panel` (#12151E).
- Title text in `--font-display` (Manrope), colour `--c-text` (#F7F8FB).
- One short supporting line in `--font-body` (Inter), colour `--c-text-sub` (#D8DAE1).
- Accent element (a rule, a chip or the product mark) in `--c-teal` (#8C85FF). If text sits on an accent fill, the label is `--on-accent` (#090B12 on the dark theme).
- Product wordmark bottom left: Velstrian Bid or Velstrian Buy.
- Sizes: 1280x720 for the horizontal video thumbnail, plus a 1080x1080 square crop and a 1080x1350 portrait crop for social reuse.
- Contrast: title on background is #F7F8FB on #090B12, about 17:1, well past WCAG AA. Accent #8C85FF on #090B12 is about 7:1, safe for text. Keep any accent text at or above `--t-h4`.
- No stock photography. A real product screen, dimmed to about 20 percent behind the title, is allowed as the backdrop. No person presented as a customer.
- No banned claim on any thumbnail. No number that is a win rate, accuracy or customer count.

## Per video

| Video | Title line (display) | Support line (body) | Accent use | Backdrop screen |
| --- | --- | --- | --- | --- |
| supplier-long | Win more work | Velstrian Bid, end to end | --c-teal rule under title | Opportunities feed, dimmed |
| buyer-long | Run a fair process | Velstrian Buy, end to end | --c-teal rule under title | Evaluation screen, dimmed |
| s1-find | Find the right tenders | One search, three sources | --c-teal chip "Discover" | Opportunities feed |
| s2-upload | Upload your tender pack | Read into clear questions | --c-teal rule | Tender documents |
| s3-compliance | Nothing slips through | Build the checklist | --c-teal rule | Compliance matrix |
| s4-draft | Draft from your evidence | See where it came from | --c-teal chip "Evidence" | Narrative with citation drawer |
| s5-social-value | Your social value answer | Follows PPN 026 | --c-teal rule | Social value screen |
| s6-review-export | Review and export | Word and PDF, ready | --c-teal rule | Submission screen |
| s7-answer-library | Reuse your best answers | One library, every bid | --c-teal chip "Library" | Answer library |
| b1-requirement | Build a requirement | Step by step | --c-teal rule | Requirement Builder |
| b2-weighting | Keep it fair | Weighting and rubric | --c-teal rule | Weighting settings |
| b3-evaluate | Score with confidence | A fixed calculation | --c-teal rule | Evaluation detail |
| b4-compare | Compare on whole life cost | One figure per currency | --c-teal rule | Compare bids |
| b5-award | Record the award | Standstill and letters | --c-teal rule | Award step |
| b6-scorecards | Score your suppliers | Inside the supplier record | --c-teal rule | Supplier scorecard |

## Tokens used (for the report)

Colours: --c-bg #090B12, --c-panel #12151E, --c-text #F7F8FB, --c-text-sub #D8DAE1, --c-text-muted #A9ADBA, --c-teal #8C85FF, --c-teal-dark #4D45DC, --on-accent #090B12 (dark) / #FFFFFF (light).
Type: --font-display Manrope, --font-body Inter, --font-mono DM Mono. Scale tokens --t-h1, --t-page, --t-h2, --t-h4, --t-body.
Source: velstrian-website/astro/src/styles/tokens.css and velstrian-website/astro/src/styles/brand.source.json (Quantum V, D309). The platform mirror is velstrian-platform/packages/tokens/brand/brand.source.json.
