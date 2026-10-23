# Verification of the Gemini UI and UX audit, 34 defects

Date: 2026-10-23. Lane: crow-researcher, read only. No product code changed.
Source audit: `docs/audits/GEMINI-UIUX-AUDIT-2026-10-23.md`, a register of claims.
Corpus read: `astro/src` (components, pages, layouts, styles, data, scripts), `astro/scripts/check-budgets.js`, `_headers`, `_redirects`, `llms.txt`, `Assets/brand/integrations/LOGO-PROVENANCE.md`, the platform `api/app` CORS and host code, `packages/server-infra/src/public-hosts.mjs`, the premium spec, the D305 analysis, `DECISION-GATES.md`.
Renders: three Playwright Chromium runs, one browser at a time, against the live dev server `http://localhost:8093` (every page asserted 200 and the landed URL before measuring). Free RAM was 3.9 GB at launch. Scripts and screenshots are in the session scratchpad, not committed.

## Verdict counts

| Verdict | Count | Ids |
|---|---|---|
| REAL | 8 | P0-1, P1-6, P2-2, P2-3, P2-5, P2-10, P3-4, P3-6 |
| PARTLY | 18 | P0-2, P0-3, P1-1, P1-2, P1-3, P1-4, P1-5, P1-7, P1-8, P2-4, P2-6, P2-8, P2-9, P2-11, P2-12, P2-13, P3-2, P3-7 |
| FALSE | 8 | P0-4, P2-1, P2-7, P2-14, P3-1, P3-3, P3-5, P3-8 |
| NEEDS-RENDER | 0 | none left, every render claim was measured |

Total 34. Ten rows carry a CONFLICT flag (an owner or driver decision, or a written file warning, stands against the audit's fix): P0-1 (fixture fallback), P0-2, P1-1, P1-2, P1-3, P1-5, P2-9, P2-12, P3-2, P3-6.

## Lane buckets

| Lane | Ids |
|---|---|
| PREMIUM-BUILD | P1-1, P1-2, P1-4, P1-7, P1-8 |
| AUTOPLAY | P2-10 |
| PHOTOS | none (P3-2 is an OWNER question that informs the running lane) |
| WEB-FIX (new) | P0-1 (website half), P0-2 (host half), P0-3, P1-6, P2-2, P2-3, P2-4, P2-5, P2-6, P2-8, P2-11, P3-4, P3-7 |
| OWNER | P0-1 (API deploy half), P0-2 (screenshot recapture half), P1-3, P1-5, P2-9, P2-12, P2-13, P3-2, P3-6 |
| Close as FALSE, no work | P0-4, P2-1, P2-7, P2-14, P3-1, P3-3, P3-5, P3-8 |

File collision warning: `git status` shows the AUTOPLAY and PHOTOS lanes have uncommitted edits in `Hero.astro`, `Audience.astro`, `Capabilities.astro`, `ProductCarousel.astro`, `Screens.astro`, `TabSwitcher.astro`, `evidenced.ts`, `evidenced.css`, `tabs.ts`, `flashcards.ts`. P1-6 touches `Hero.astro` and P2-10 touches `evidenced.css`, so WEB-FIX must start those two edits only after the running lanes commit.

---

## P0 rows

### P0-1 Tender finder fails (REAL, with one CONFLICT)
- Measurement: Playwright on `/tools/tender-finder/` (200, landed URL same), clicked `#tf-submit`. Result: console says `Access to fetch at 'https://api.velstrian.com/api/v1/bid/free/tenders/search' from origin 'http://localhost:8093' has been blocked by CORS policy`, the request ends `net::ERR_FAILED`, status text is `Tender search is not available right now. Please try again later.` Reproduced exactly as claimed. A negative would have been a 200 result list.
- Curl of the OPTIONS preflight, `Access-Control-Request-Method: POST`: Origin `http://localhost:8093` gives 400 with no allow-origin. Origin `https://velstrian.com` gives 400. Origin `https://crowagent.ai` gives 200 with `access-control-allow-origin: https://crowagent.ai`.
- Why local dev fails: the website base is `API_ORIGIN = 'https://api.velstrian.com'` (`astro/src/data/app.ts:52`), which is the production API. Production CORS ignores `ALLOWED_ORIGINS` by design: `api/app/main.py:388` to `api/app/main.py:395` sets `cors_origins = _always_allowed` when `settings.is_production`, and `_always_allowed` is `PRODUCTION_BROWSER_ORIGINS` (`api/app/public_hosts.py:48` to `:58`), which holds app, marketing and portal hosts only. So `http://localhost:8093` can never be allowed on production. The same preflight against `https://api-staging.velstrian.com` also returns 400, because staging uses the default `allowed_origins = "http://localhost:3000"` (`api/app/config.py:535`).
- What production will do: the deployed production API does NOT yet carry this route. A POST with Origin `https://crowagent.ai` returned 401 `Missing bearer token`, while the source exempts the path (`api/app/middleware/auth.py:183`, `api/app/routers/bid_free_tender_finder.py:123`). Staging has the route (POST returned 422, a validation answer). The deployed production origin list also lacks `https://velstrian.com` (preflight 400), so even after the route ships the finder fails from the new domain until the production API is redeployed with the widened list from `public_hosts.py`. This is the predates-the-release case the brief suspected.
- Root cause: two separate causes. Local dev is a CORS allow list on a production host. Production is an API deploy that is behind the tree.
- CONFLICT: the audit's remedy "fall back to realistic offline demonstration data" would show invented tenders on a tool that says it searches real notices. That breaks the standing rule that product claims are never fabricated and the site rule "never draw it" for captures. Reject the fixture. The graceful failure message already exists (`tf-status`, `data-e503`, `astro/src/pages/tools/tender-finder/index.astro:215`).
- Fix, one line: add a dev only Vite proxy so local pages call same origin and no CORS applies, and ship the API with the release (route plus velstrian.com origins). Files: `astro/astro.config.mjs` (dev proxy, with `API_ORIGIN` read from an env override in dev only), and the owner/driver API promote.
- Lane: WEB-FIX for the dev proxy and the wording. OWNER for the API redeploy (it ships with the R2.8.5 release, there is nothing to do on the website to make production work).

### P0-2 Brand schism and form endpoints (PARTLY, CONFLICT)
Three claims inside one row.
1. "Velstrian Tenderworks" in screenshots. `Velstrian Tenderworks` is the legitimate platform identity (workspace CLAUDE.md IDENTITY HARD RULE), so the name is not a defect. The mark IS stale. Measured: the walkthrough serves `Assets/product-captures/web/questions-screen.webp` (and four siblings), and viewing it shows the sidebar logo as the old blue bar chart glyph beside "Velstrian Tenderworks", not the Quantum V mark. The captures were taken 2026-10-23 at 02:40 to 04:23 (file mtimes), and the platform rolled Quantum V into code later that day (`1b4440402`, `cd9deb9e7`, `3fba4cdf9`, D309) but it is not on staging yet. So the audit is right about the pixels and the cause is sequence, not a website bug.
2. Forms post to `app.crowagent.ai`. True: `ContactForm.astro:184` (`action="https://app.crowagent.ai/api/contact/submit"`), `NewsletterForm.astro:78` (`NOTIFY_ENDPOINT`). `app.velstrian.com` does not resolve (curl exit 000), `app.crowagent.ai` answers 307. `PRIMARY_DOMAIN = "crowagent.ai"` in `packages/server-infra/src/public-hosts.mjs` stays until the production round of R285-REBRAND-15 (the file says so). A deliberate stay is NOT a defect.
3. The real defect: the host is typed in four website places instead of one. `data/app.ts:22` holds `APP_ORIGIN` but the two form files ignore it, and `_headers` carries `form-action` and `connect-src` for the same host (`_headers:46`, `:291` to `:293`). At the switch an editor must find all of them.
- Fix, one line: build the contact and newsletter endpoints from `APP_ORIGIN` so the switch is one constant plus the `_headers` allow list (and `check-csp-required-origins.js`), and recapture the five walkthrough screens after the platform staging promote carries Quantum V. Files: `ContactForm.astro`, `NewsletterForm.astro`, `data/app.ts`, then the capture harness (`R285-WEB-REAL-SCREENSHOTS-01`).
- How it flips at the switch: change `APP_ORIGIN` to `https://app.velstrian.com`, widen `_headers`, run the guard. Nothing else.
- Lane: WEB-FIX for item 3. OWNER for item 1, which waits on the staging promote (a recapture before it would capture the old mark again).

### P0-3 Mobile menu (PARTLY)
- Measurement at 390 by 844, `/` and `/pricing/` (both 200), opened `.ca-ham`, expanded every accordion, scrolled the menu to the bottom. The menu background is `rgb(9, 11, 18)` and text `rgb(247, 248, 251)` on pages whose body is light, so the dark inversion is REAL.
- The occlusion claim is FALSE. Last link ("About") bottom is 722.5 px and the sticky action row top is 754.5 px, 32 px clear, `occluded: false`. The action row is in flow and sticky (`Nav.astro:1000` to `:1007`), so links scroll above it.
- Minor real item: `overscroll-behavior` computes `auto`, so the menu can chain scroll to the page.
- Root cause: the light tone class `on-light` is applied only to the `<header>` (`Nav.astro:90`), and `.ca-mob-menu` is a sibling after `</header>` (`Nav.astro:151`), so it takes the dark root tokens (`background: var(--c-bg)`, `Nav.astro:823`).
- Fix, one line: give `.ca-mob-menu` the same `on-light` class when `tone === 'light'`, add `overscroll-behavior: contain`. Files: `astro/src/components/nav/Nav.astro`.
- Lane: WEB-FIX. Note it touches `Nav.astro`, so sequence it with P1-2.

### P0-4 `/sectors/facilities-management/` (FALSE)
- Measurement: curl local gives 404 for both `/sectors/facilities-management/` and the no slash form, 200 for `/sectors/facilities/`. Then grepped every href: `grep -rn "sectors/facilities" astro/src astro/public _redirects llms.txt llms-full.txt blog` returns only `pages/sectors/index.astro:65` and `llms.txt:38`, both the correct `/sectors/facilities/`. A grep of every built `astro/dist` html for an href containing `facilities-management` returns nothing. The only source hits are prose in `content/compare/bid-vs-cleantender.md`. A negative would have been an href to the long slug, and there is none.
- Verdict: no broken internal link exists. The 404 is a URL the auditor typed. Optional hardening only: a `_redirects` 301 costs nothing, but nothing links there.
- Lane: none.

---

## P1 rows

### P1-1 Zebra stripes (PARTLY, CONFLICT with the premium spec)
- Measurement: computed band backgrounds on `/` at 1440: Hero light (255,255,255), Facts/Proof dark (9,11,18), Audience light, Capabilities light-alt (244,245,248), Refusal dark, Screens light, Steps dark, Security light, Plans light-alt, FAQ light, Close gradient. The alternation is real. The audit's hex values are slightly off (#f9fafb and #0c0f17 are not the tokens) but the pattern is exact.
- Conflict: the premium spec keeps the dark bands on purpose and adds wedge seams on three of them (spec section 5, "Wedges", and section 7 "Home": Hero wedge down into Facts, Refusal wedge up into Screens). It does not unify the canvas, which is what the audit asks. The spec answers the "razor edge" half and not the "one canvas" half.
- Fix, one line: build spec section 5 wedges and section 7 home sequence, add the audit's inner top and bottom hairline on `.band--dark` only if the spec lane agrees.
- Files: `Band.astro`, `styles/tokens.css` band block (about 3545 to 3600), `evidenced.css`.
- Lane: PREMIUM-BUILD.

### P1-2 Navbar over dark bands (PARTLY, CONFLICT with a file warning)
- Measurement: header computed `position: sticky` (not fixed), `::before` background `rgb(255, 255, 255)` with `backdrop-filter: none`. The audit's `rgba(255,255,255,0.8)` glass claim is FALSE. The nav is fully opaque.
- That is deliberate. `Nav.astro` comment block (the "FILL WENT 72% to 100%, 2026-08-31, OWNER REPORT" paragraph) says the translucent bar made section headings and nav links legible on top of each other, and the owner asked for opaque. A file that already warns outranks the audit's remedy of a translucent slate bar.
- The seam itself (light bar over a dark band) is real and the spec misses it. Spec section 7 never mentions the header.
- Fix, one line: switch the bar to the dark role scope (opaque, not translucent) while a `.band--dark` is under it, and keep the 100 percent fill. Needs the IntersectionObserver, so check the 12 KB `jsShared` line first.
- Files: `Nav.astro`, `scripts/nav.ts`, `NavDropdown.astro` (the mega panel already has an `.on-light` variant at `:373`).
- Lane: PREMIUM-BUILD (nav colour), after WEB-FIX P0-3 lands in the same file.

### P1-3 Three hero buttons (PARTLY)
- Measurement: `.ea-hero .ea-actions` holds `a.ea-btn--primary` "Start now", `a.ea-btn--secondary` "Try the walkthrough", `button.ea-btn--quiet` "Watch the one minute tour" (`Hero.astro:34` to `:41`). Count of actions is three, as claimed, but only one is primary and the third is the quiet variant, so "three competing primaries" overstates it.
- Conflict: the walkthrough and the tour were added on purpose (comment at `Hero.astro:36`, R285-WEB-INTERACTIVE-WALKTHROUGH-01), and `START_LABEL` is locked by D236 and `check-content-parity.js`. This is a design choice for the owner. RULE 0-U asks for one primary action per screen, which is already met.
- Options: A keep as is. B make the walkthrough an inline text link and keep the tour as the quiet button. C one button plus one link. Recommended: B.
- Files if chosen: `Hero.astro` (AUTOPLAY lane has uncommitted edits there).
- Lane: OWNER.

### P1-4 Aurora pause button (PARTLY)
- Measurement on `/pricing/`, `/integrations/`, `/tools/`, `/cookie-preferences/` at 1440 and 390 (all 200): the button's bottom is 12 px above the section bottom on every route (for example pricing 481 vs 493), so it is inside its own band, never over the next section. "Straddles the dividing boundary" is FALSE in layout terms.
- Visual part is real: the screenshot of `/resources/` shows the white button sitting across the top edge of the aurora gradient strip at the foot of the hero, because the strip is drawn in the same bottom corner (`Band.astro:57`, `evidenced.css:1269` to `:1284`). It reads as stuck on the seam.
- Fix, one line: move the button to the top right of the hero (`top: var(--space-3)`) or lift it clear above the strip. Keep 44 by 44 and the `hidden` until script rule.
- Files: `evidenced.css` (`.ea-motion`, `.ea-page-hero` padding comment at `:1363`).
- Lane: PREMIUM-BUILD. Home at 1440 reports the button `hidden` (script state), unrelated to this row.

### P1-5 Alignment rhythm (PARTLY, CONFLICT with an owner decision)
- Measurement: h2 `text-align` per band on `/` at 1440: Hero center, Proof center, Who start, Caps start, Refusal center, Screens start, Steps start, Secure start, Plans start, FAQ center, Close start. The mix is real.
- Conflict: `styles/alignment.css` exists because the owner reported left aligned text four times and ordered centred text everywhere (owner quote in its header, 2026-08-03). The audit asks for left anchored for every mid page section, the opposite instruction. The spec does not address alignment, so this is a gap in the spec and a decision only the owner can make.
- Options: A leave as is. B centre every head. C left anchor every head. Recommended: A for now, and ask the owner to pick B or C once, because the premium build will touch every section head.
- Lane: OWNER.

### P1-6 "cancel in the 7 days" (REAL)
- Measurement: grep with the template variable, `grep -rn "cancel in the\|in the {TRIAL" astro/src`: three hits, `components/evidenced/Hero.astro:44`, `components/evidenced/Walkthrough.astro:211`, `components/pricing/PricingPlans.astro:108`. Source is `Cancel in the {TRIAL_DAYS} days and pay nothing` and `TRIAL_DAYS = 7` (`data/pricing.ts:343`). The plain text "cancel in the 7 days" does not exist in source, which is why a literal grep misses it. The audit says "across multiple pages", which is three components.
- Fix, one line: change to "cancel within {TRIAL_DAYS} days and pay nothing" in all three. No gate keys on the phrase (grepped `astro/scripts`, `tests`).
- Lane: WEB-FIX (Hero.astro after AUTOPLAY commits).

### P1-7 `/resources/` solid purple (PARTLY)
- Measurement on `/resources/` (200): the four `.res-card` backgrounds are `rgb(255,255,255)`, four columns, art box transparent. No `#4f46e5` exists in `astro/src` (grep). The whole card is NOT purple. What is purple is the type led cover banner at the top of each card, and the screenshot shows all four banners in the same indigo, so the sameness is real.
- Spec mapping: spec section 7 "Resources and guides" calls for category rows as rails with one hue per category and the newest guide as Tier 3. That fixes it. Not a separate fix.
- Files: `ResourcesGrid.astro`, `ResourceCard.astro`, `blog/covers.ts` (hue per family).
- Lane: PREMIUM-BUILD.

### P1-8 Pricing table (PARTLY)
- Measurement: the table is `COMPARE_LEAD` plus `COMPARE_MORE`, 12 feature rows (`data/pricing.ts:426` to `:500`, counted), not "40+". No sticky and no Pro column highlight exists (grep of `PricingCompare.astro`).
- Trap in the audit's fix: the table sits in `.pricing-table-scroll` with `overflow-x: auto` (`PricingCompare.astro:177`), which makes a sticky `thead` stick to that box and not to the page, so a sticky header at the nav height would do nothing.
- Spec mapping: spec section 7 "Pricing" says a faint Iris wash on the recommended column header only. The Pro column highlight is therefore in the spec. A sticky header for 12 rows is low value.
- Fix, one line: add the recommended column wash from the spec, and skip the sticky header unless the scroll wrapper is removed on desktop.
- Files: `PricingCompare.astro`.
- Lane: PREMIUM-BUILD.

---

## P2 rows

### P2-1 Default focus rings (FALSE)
- Measurement at 1440: focused the Products button, computed `outline: solid 3px rgb(12, 14, 21)`, offset 3px, `:focus-visible` true. Footer link: `solid 3px rgb(255, 255, 255)` on the dark footer. Source: `Nav.astro:435` (`:where(.ca-nav, .ca-mob-menu) :where(a, button):focus-visible` with `outline: 3px solid var(--c-interactive)` at `:436`). Custom rings exist. A negative would have been a 2px black ring from the browser, and the ring is 3px and tokenised.
- Optional: a violet double ring is a taste change, not a defect.
- Lane: none.

### P2-2 Mega menu icon mix (REAL)
- Measurement: Products items render a solid dot, a solid dot and a stroked grid with `stroke-width="2"`. `data/nav.ts:74` allows `'dot' | 'grid' | 'arrow' | 'book'`, Resources rows use `dot, dot, arrow, grid, book` (`:111` to `:196`).
- Fix, one line: draw all rows with one 20 px stroke set at one stroke width inside a tinted tile. Needs a design pick for the icon set. Check it stays inside the design system tokens.
- Files: `NavDropdown.astro`, `data/nav.ts`.
- Lane: WEB-FIX.

### P2-3 Price swap snaps (REAL)
- Evidence: Annual and Monthly price blocks swap `display: none` and `flex` on `#billing-toggle:checked` (`PricingPlans.astro:156` to `:188`), so no transition is possible. `tabular-nums` already exists in `evidenced.css` for other figures.
- Fix, one line: crossfade the two blocks with opacity and a short transform, honouring `prefers-reduced-motion`, no JS.
- Files: `PricingPlans.astro`, `pages/pricing.astro` styles.
- Lane: WEB-FIX.

### P2-4 Toggle asymmetry (PARTLY)
- Evidence: both selected states use one rule (`pricing.astro:203` to `:210`, accent wash, accent border, same shadow), so "Monthly grey filled, Annual outlined" is not in the CSS. The sliding pill is real: the toggle is two radio labels with no moving indicator.
- Fix, one line: add a sliding pill under the two labels with CSS only (`:has()` or a pseudo element), reduced motion safe.
- Files: `pages/pricing.astro`.
- Lane: WEB-FIX.

### P2-5 FAQ snaps (REAL)
- Evidence: `.ea-qa` is a native `<details>` with no `::details-content` or `interpolate-size` rule (grep over `styles` and `components` finds none). Used by home, bid, pricing, faq and the pricing credits rows (`Faq.astro:64`, `PricingFaq.astro:27`).
- Fix, one line: animate with `::details-content` and `interpolate-size: allow-keywords` as progressive enhancement with a reduced motion off switch. Do not replace the native element with a grid and `data-open` script, that adds JS and breaks "one disclosure recipe".
- Files: `styles/evidenced.css` (`.ea-qa` at `:3107`).
- Lane: WEB-FIX.

### P2-6 Palette scrollbar and badges (PARTLY)
- Scrollbar half is FALSE, already shipped: `CommandPalette.astro:266` to `:285` sets `scrollbar-width: thin`, `scrollbar-color` and `::-webkit-scrollbar` with the comment "R285-WEB-GEMINI-AUDIT-5, Gemini's scrollbar adopted by the owner 2026-10-23". Computed `scrollbar-width` was `thin` in the render.
- Badge half is real: `.cmdk__s` uppercase and `flex: 0 0 auto`, with 209 px for "Bid and tender software" next to a 100 px title. No title truncated in the 14 rows sampled, so the harm is visual weight, not lost text.
- Fix, one line: shorten the section labels at their source to `Bid`, `Buy`, `Tool`, `Glossary`, `Blog`, `Compare`.
- Files: `pages/search-index.json.ts` and the data it reads.
- Lane: WEB-FIX.

### P2-7 Blog measure 1268 px (FALSE)
- Measurement at 1440 on `/blog/ppn-026-what-has-published-and-what-has-not/` (200): all 32 paragraphs measure 602 px wide, and `prose.css:119` sets `.prose p { max-width: 36.8em }`. The page has about 1,633 words, not 2,500. A negative would have been a width over 800, none was.
- Lane: none.

### P2-8 Sticky table of contents (PARTLY)
- Evidence: a "Jump to a section" disclosure TOC exists, `Article.astro:309` to `:320` (`<details class="art__toc">`), shown only when `keyPoints` is set and the post has more than two sections. The sampled post has 9 h2 and no key points, so it renders no TOC (`.art__toc` absent in the render). So the gap is real for posts without key points, and the audit's "no TOC on the site" is false.
- Fix, one line: render the TOC whenever sections exceed two, not only with key points. Skip scroll spy (extra JS, no budget case).
- Files: `layouts/Article.astro`, and the compare layout if the owner wants it there.
- Lane: WEB-FIX.

### P2-9 Official integration logos (PARTLY, CONFLICT with an owner decision)
- Evidence: `data/integrations.ts` states in code comments "WITHDRAWN 2026-08-04 BY OWNER DECISION ON A-37 ... THE DECISION WAS NOT TO SEEK A LICENCE", citing a UK IPO dispute and that "nominative use in TEXT is the low-risk form". `Assets/brand/integrations/LOGO-PROVENANCE.md` records the withdrawals (Teams, Google, Google Drive, Okta, Ping, SharePoint and OneDrive marks), a build gate `check-vendor-logos.js` fails a reversal, and the policy file's rule 3 forbids implied endorsement. Only the Confluence mark survives as an official `@atlaskit/logo` asset.
- Integration reality: the platform supports three document sources, SharePoint, OneDrive for Business and Confluence Cloud (`pages/integrations.astro:20`, `content_sources.py:93`). Google Drive is NOT an integration, so showing its mark would be a false claim.
- Options: A keep generic glyphs (recommended, matches A-37). B restore only the Confluence mark. C seek vendor permission first.
- Lane: OWNER.

### P2-10 Walkthrough controls (REAL)
- Measurement at 1440 on `/walkthrough/` (200): Back left edge x 80, Next left edge x 1240, gap between them 1,040 px. Markup `Walkthrough.astro:165` to `:169`, `.ea-walk__move` inside a `data-car-controls` block.
- Fix, one line: group Back, step text and Next in one centred cluster under the stage.
- Files: `Walkthrough.astro`, `evidenced.css` (`.ea-walk__nav`, `:2179`).
- Lane: AUTOPLAY (it is a carousel and that lane holds `evidenced.ts` and `evidenced.css`), layout change only.

### P2-11 Matrix reset and empty state (PARTLY)
- Evidence: the Clear button resets fully and hides the panel, the filter bar and the clipboard fallback (`clearResult`, `tender-compliance-matrix/index.astro:1096` to `:1115`) and an empty message `#e-empty` exists (`:391`). What is missing is any listener on the textarea itself, so deleting the text by hand leaves the old result until Build or Clear is pressed (the only `input` listener is the filter box, `:1077`). My render used the wrong result selector, so the stale result itself was not seen on screen, this row is code read.
- Fix, one line: clear the result when the textarea becomes empty. Costs a few bytes inside the tool island that sits above its 13 KB line today (15 KB exception ceiling in `check-budgets.js`), so measure the build.
- Files: `pages/tools/tender-compliance-matrix/index.astro`.
- Lane: WEB-FIX, low priority.

### P2-12 Contact form labels (PARTLY)
- Evidence: placeholders use `var(--c-text-muted)` (`styles/forms.css:90`), a token, not `#9ca3af`. Labels sit above the fields as persistent visible labels (`ContactForm.astro`).
- Conflict: floating labels hide the label when the field has a value and work against RULE 0-U for small business users and WCAG 3.3.2 practice. The focus ring on fields is already styled.
- Options: A keep persistent labels (recommended). B floating labels.
- Lane: OWNER.

### P2-13 Cookie preferences page (PARTLY)
- Evidence: `pages/cookie-preferences.astro` already says "There is nothing to configure on this page, and that is not an oversight" and lists three categories each marked "None set". The honest "no controls" fact is true.
- The audit's remedy asks for "real-time verification status indicators", which would be a live claim the site cannot back without a measuring script. Workspace rule 7 in the website CLAUDE.md says do not break the cookie preferences page.
- Options: A leave (recommended). B retitle to a privacy page, keep the URL and the category list. C add a live check, rejected.
- Lane: OWNER.

### P2-14 Proof metric hover (FALSE)
- Measurement: `document.body.innerText` on `/` (200) contains none of `3.2x`, `42M`, `100%`, and `grep -rn "3\.2x\|£42M" astro/src` finds nothing relevant. The proof band (`.ea-proof`, "Find the right work, and answer it with proof.") holds text like "New work every morning" and "A score out of 100". The metrics in the audit do not exist on the site, and publishing them would break the rule against unverified numeric claims in the website CLAUDE.md.
- Lane: none.

---

## P3 rows

### P3-1 Image dimensions (FALSE)
- Measurement: every `document.images` entry on `/` (15 images), `/walkthrough/` (5) and `/about/` (2) at 1440, all pages 200. Images lacking a `width` or `height` attribute: 0 on all three. Lazy images lacking them: 0. A negative would have been a non empty list and the list is empty. The `[Performance]` console string in the audit is not a Chrome message I could reproduce, so it likely came from the auditor's own tooling.
- Lane: none.

### P3-2 Stock photography on the audience section (PARTLY, CONFLICT)
- Evidence: the home audience section carries licensed photographs on purpose. Owner direction on 2026-10-23 asked for photographs on each audience card, recorded in the D305 analysis (`IMAGERY-AND-DISCLOSURE-ANALYSIS-2026-10-23.md`, decision D4 faces, amended 2026-10-23 by R285-WEB-AUDIENCE-PHOTOS-01 to one face per audience card). The audit's "replace with UI captures" is the opposite of that choice. It is also wrong on About: `AboutStory.astro:11` records the photo removed and replaced by a real screen.
- Recommendation: keep the photos, mark CONFLICT, tell the PHOTOS lane nothing changes. If the owner now agrees with the audit they say so, and it is a revert of D4.
- Lane: OWNER, informed. PHOTOS lane continues unchanged.

### P3-3 Duplicate form names (FALSE)
- Measurement on `/contact/`: contact form fields `website`, `name`, `email`, `organisation`, `enquiry_type`, `message`, `gdpr_consent` and newsletter fields `website`, `email`. Names repeat across two separate `<form>` elements, which is valid HTML. IDs are unique (`cp-website`, `contact-nl-website`, `dupIds: []`). `ContactForm.astro:36` says the field names "are an API contract" consumed by `app.crowagent.ai/api/contact/submit`, so renaming the honeypot would break the server. The home page has no form in the footer at all (the footer holds no form on `/`).
- Lane: none.

### P3-4 Footer social anchors (REAL, low)
- Measurement: five social anchors in `footer` each have an `aria-label` such as "Velstrian on LinkedIn (opens in a new tab)" and empty `textContent`. Real, and harmless to assistive tech.
- Fix, one line: replace the `aria-label` with a `visually-hidden` span carrying the same text so the anchor has text and one accessible name, not both.
- Files: `components/footer/Footer.astro`, `data/footer.ts`.
- Lane: WEB-FIX.

### P3-5 FAQ border stacking (FALSE)
- Evidence: `.ea-qa` has `border-top: 1px` only and `.ea-qa:last-of-type` adds one bottom border (`evidenced.css:3107` to `:3113`), so each seam is a single 1 px line. A doubled border would need a `border-bottom` on `.ea-qa` and there is none. Read from source, not pixel measured.
- Lane: none.

### P3-6 View Transitions (REAL, absent, cost problem)
- Evidence: grep for `ClientRouter`, `ViewTransitions`, `view-transition` over `astro/src`, `astro/scripts`, `astro.config.mjs` returns nothing, so it is absent as claimed.
- Cost, measured from the installed package `astro@7.4.0`: `node_modules/astro/dist/transitions/router.js` is 25,226 bytes, `swap-functions.js` 13,353, `events.js` 3,682, unminified source. The minified and gzip figure is not measured and needs a build.
- Budgets: `check-budgets.js` `jsTotal` is 60 KB (D307, built total was 36,822 B), so the total has room. But the router would be on every route and counts in `jsShared`, whose ceiling is 12 KB with an exception ceiling of 16 KB against 15.6 KB measured (`check-budgets.js` EXCEPTIONS, `jsShared:all`). That is 0.4 KB of headroom. It would fail that line unless the owner raises it again, which the file calls "the ratchet this file exists to prevent". The per route 16.0 KB ceiling is that same shared line.
- Risk: with soft navigation the page scripts (`evidenced.ts`, `nav.ts`, autoplay, tabs, flashcards, the palette) run once at load and would need re-init on `astro:page-load`, and D305 "play once" and reduced motion rules would need retesting.
- Options: A do not add (recommended). B add after a measured build and a raise of the `jsShared` exception, owner approval.
- Lane: OWNER.

### P3-7 Palette empty state (PARTLY)
- Evidence: the resting list shows `RESTING_ACTIONS = 3` actions (Start now, Book a 30-minute call, Ask about Velstrian Bid) then route suggestions (`scripts/command-palette.ts:43`, render rows 1 to 8). So it is a flat list with no grouping, as claimed, but it is not empty.
- Fix, one line: group the resting rows under small headings (Popular, Pages) or add quick pills. Size is small, check the shared script line.
- Files: `scripts/command-palette.ts`, `components/nav/CommandPalette.astro`.
- Lane: WEB-FIX.

### P3-8 Button press state (FALSE)
- Measurement: scanned the loaded stylesheets for `.ea-btn:active`, found an `.ea-btn:active` rule that applies `transform: scale(var(--press-scale))`. The press effect exists. A negative would have been no `:active` rule.
- Lane: none.

---

## Decisions for the owner (each with one recommended answer)

1. P0-1 API: confirm the production API redeploys with the release so the finder and the velstrian.com origins work. Recommended: yes, it ships with the R2.8.5 promote. The offline fixture is rejected.
2. P0-2 screenshots: recapture the five walkthrough screens after the staging promote carries Quantum V. Recommended: yes, queue it after the promote.
3. P1-3 hero buttons: A keep, B walkthrough as a text link, C one button plus one link. Recommended: B.
4. P1-5 alignment: A leave, B centre every head, C left anchor every head. Recommended: A until the premium build, then decide once.
5. P2-9 logos: A keep text and generic glyphs, B Confluence only, C seek permissions. Recommended: A.
6. P2-12 floating labels: Recommended: keep persistent labels.
7. P2-13 cookie page: Recommended: leave it, the page is honest.
8. P3-2 audience photos: Recommended: keep the photographs.
9. P3-6 View Transitions: Recommended: do not add, it costs the shared script line and re-init work.

---

## WEB-FIX lane outcome (2026-10-23, crow-builder, local commits only, nothing pushed)

Measured on the dev server `http://localhost:8093` with Playwright Chromium 147, every page asserted 200 at its landed URL first. Driver decisions applied where the rows above said OWNER: P1-3 option B, P2-13 reframe, P3-6 CSS only view transitions, P2-12 labels stay with a border tidy.

| Id | Commit | Before | After |
|---|---|---|---|
| P0-1 API | platform `f8f47576d` | no test named the marketing origins | `api/tests/test_public_hosts.py`: production CORS names `https://velstrian.com` and `https://www.velstrian.com` (and both crowagent.ai twins), a localhost `ALLOWED_ORIGINS` is dropped in production and accepted outside it. 21 passed, red proved by widening the production branch and dropping the apex. The tree already derives the list (`api/app/public_hosts.py:56`). The live API still answers 400 until the R2.8.5 promote redeploys it. No staging website origin exists, so none was added. |
| P0-1 web | `35cbb8ca` | CORS blocked, `net::ERR_FAILED`, a red one line status | dev only `server.proxy` in `astro.config.mjs` sends `/api/v1/bid/free/` to `https://api-staging.velstrian.com` (override `DEV_API_ORIGIN`), the page posts same origin under `import.meta.env.DEV` only. 200 through the proxy and 20 real notices at 1440 and 390. A 503 now shows a card with Try again and Start now that takes focus. No sample tenders. |
| P0-2 host | `cde6c1d5` | `app.crowagent.ai` typed in `ContactForm.astro:184`, `NewsletterForm.astro:78` and twice in `check-csp-required-origins.js` | all read `APP_ORIGIN` from `data/app.ts`. Guard red proved with `APP_ORIGIN = https://app.velstrian.com` (fails connect-src and form-action), green 9 of 9 restored. |
| P0-3 | `17404611` | menu `rgb(9,11,18)` on light pages, overscroll `auto` | `rgb(255,255,255)` with ink `rgb(12,14,21)` on `/`, `/pricing/`, `/about/` at 390x844, `overscroll-behavior: contain`, safe area insets on top, sides and the close button (bottom was already on the action row). |
| P1-6 | `e7c00bd3` and `612bfc1f` | `Cancel in the {TRIAL_DAYS} days` and four FAQ answers with two other endings | `Cancel within {TRIAL_DAYS} days and pay nothing` everywhere. |
| P1-3 | `612bfc1f` | three hero actions, two of them buttons | option B: Start now is the one filled button, the tour stays quiet, the walkthrough is an `.ea-link` with the right arrow, 44px high. |
| P2-2 | `e4f55f22` | filled dot beside 2 stroke glyphs at 14px | every row draws `Icon.astro` (1.75 stroke) at 18px in a 32px accent tinted tile, 8 of 8 rows measured identical. Three glyphs added to `data/icons.ts`: compare, table, book. |
| P2-3, P2-4 | `eb8bb745` | outlines blink between segments, prices swap `display` | one sliding pill over two equal columns (213px travel at 1440), prices share one grid cell and crossfade, tabular numerals, card heights unchanged, the swap recipe exists once in `pricing.astro`. Reduce: 0s. |
| P2-5 | `f7ab161f` | snaps | `::details-content` grows 73 to 334px over the `--dur` clock, native details kept, inside `@supports` and no-preference. Placed in `motion.css`. |
| P2-6, P3-7 | `976e794c` | 209px column heading as the badge, resting list started with Home, a miss showed only text | short tags derived from the address (widest 73px), five quick jumps at rest and under the no match message. |
| P2-8 | `066c682b` | contents only with key points, 9 of 12 posts had none | contents on every post of 4 or more sections. From 80rem an open list sticks in the left gutter (top 96 after scroll), paragraph still 602px at x419. |
| P2-11 | `10577184` | emptying the box left the old matrix | an input listener clears it and a cleared card offers the next step, never on first load. |
| P2-12 | `6c35e3d3` | field edge `rgb(233,234,238)` on white, no hover | edge `--ea-rule-strong`, hover `--c-text-muted`, focus ring unchanged. Labels stay. |
| P2-13 | `5f477ddd` | read as a settings screen with no settings, and three sentences no longer true | leads with "We use no tracking cookies, so there is nothing to switch off", four cards state what is kept (one session value `ea_motion` on Pause, Turnstile once a form is used). No toggles, URL kept. |
| P3-4 | `0a2b3b47` | `aria-label` over empty anchors | visually hidden text, same accessible names. |
| P3-6 | `fe44916d` | none | `@view-transition { navigation: auto }` in `motion.css` inside no-preference, `--dur-fast` root fade, header named so it holds still. No ClientRouter, no JS. `pagereveal` carries a transition on `/` to `/pricing/`, none under reduce. |

### P0-2, the domain switch in full

1. `astro/src/data/app.ts`: `APP_ORIGIN = 'https://app.velstrian.com'`. The header, plan buttons, contact form and newsletter form all follow.
2. `_headers`: add `https://app.velstrian.com` to `connect-src` and `form-action` (keep the old host through the overlap).
3. Run `node astro/scripts/check-csp-required-origins.js`. It now reads `APP_ORIGIN` and fails until step 2 is done.
4. KNOWN REMAINDER, not yet one line: seven markdown files carry a literal `https://app.crowagent.ai/signup` link (`content/blog/frameworks-and-dps-explained.md`, `method-statement-that-scores.md`, `ppn-026-social-value-guide.md`, `private-sector-rfp-pqq-guide.md`, `regulatory-updates-2026.md`, `social-value-portal-vs-bid.md`, `content/legal/security.md`). Filed as a board row.

### Still open from this lane

- P0-1 production: the live API still refuses `https://velstrian.com` until the R2.8.5 promote redeploys it (owner approved, not done by this lane).
- A-391: seven markdown files hardcode the app signup host (the P0-2 remainder above).
- A-392: `/cookies` (`content/legal/cookies.md:18`) still says the site sets "no session storage, and no requests to anyone else", which `/cookie-preferences/` now corrects. It is a legal document, so the wording is the owner's to approve.
