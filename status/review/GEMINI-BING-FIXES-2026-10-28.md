# Bing Webmaster & SEO Remediation Report (2026-10-28)

## 1. Summary

- **Task Owner Approval**: 2026-10-28
- **Identity**: Velstrian Tenderworks (`contact@velstrian.com`)
- **Products**: Velstrian Bid, Velstrian Buy
- **Branch**: `review/website-r285-2026-10-28` merged into `main`
- **Push Commit SHA**: `400e7b3d`
- **Issue Tracking ID**: `A-492` (status/issues.json)

---

## 2. Issues Fixed

### Issue 1: HTTP 400–499 Client Errors Probed by Bing
- **Bing Finding**: Bing Webmaster Tools reported 4xx errors probing `/sitemap-index.xml`.
- **Root Cause**: The site served `sitemap.xml`, but Bing crawler specifically probes `sitemap-index.xml`.
- **Fix**: Created `astro/public/sitemap-index.xml` with valid XML sitemap index pointing to `https://velstrian.com/sitemap.xml`.
- **Live Status**: Returns HTTP 200 on `https://velstrian.com/sitemap-index.xml`.

### Issue 2: Page Titles Under 30 Characters or Over 60 Characters
- **Bing Finding**: 20 help centre articles flagged with titles exceeding 60 characters (e.g. up to 88 characters).
- **SEO Audit Finding**: 13 pages had titles under 30 characters (e.g. 404, changelog, legal pages, partners, resources, roadmap, sectors).
- **Fix**:
  - Implemented title mapping table in `astro/src/pages/help/[slug].astro` covering all 38 help articles with concise titles between 41 and 53 characters.
  - Implemented title overrides in `astro/src/pages/[legal].astro` for generated legal routes without altering markdown source (preserving platform generator byte equality).
  - Adjusted titles in `404.astro`, `about.astro`, `changelog.astro`, `faq.astro`, `integrations.astro`, `partners.astro`, `resources.astro`, `roadmap.astro`, `sectors/index.astro`, `tools/index.astro`, `Compare.astro`, and content files.
- **Verification Result Across All 97 Routes**:
  - Short titles (< 30 characters): **0**
  - Long titles (> 60 characters): **0**

### Issue 3: Missing or Overly Long Meta Descriptions (> 160 Characters)
- **Bing Finding**: Bing flagged missing meta description tags on some internal routes.
- **SEO Audit Finding**: Descriptions exceeding 160 characters on 11 routes (tools, pricing, about, blog, glossary, sectors, and legal pages).
- **Fix**:
  - Shortened descriptions on `about.astro`, `buy.astro`, `pricing.astro`, `tools/index.astro`, compliance matrix, tender finder, `ppn-06-20-social-value-themes`, sector pages (education, facilities), and blog posts.
- **Verification Result Across All 97 Routes**:
  - Missing meta descriptions: **0**
  - Long descriptions (> 160 characters): **0**

### Issue 4: Rewording of "Where PPN 002 stands"
- **Requirement**: Reword the section in `astro/src/content/blog/ppn-026-what-has-published-and-what-has-not.md` to reference PPN 026 only, and never name PPN 002.
- **Fix**:
  - Section heading retitled to "The transition to PPN 026".
  - FAQ heading retitled to "Does PPN 026 replace earlier guidance?".
  - Removed obsolete naming from visible copy and FAQs.
  - Added allowed losses entries in `astro/scripts/check-content-parity.js` to document and defend the deliberate editorial change.

### Issue 5: Contracting Authority ("Council") Naming Check
- **Requirement**: Verify each "council" use is not our own naming (we never call buyers "council").
- **Audit**: Scanned all occurrences across the repository.
- **Result**: All 14 occurrences across the site are generic contracting authority examples (such as "a county council" or "local authority buyers"), never naming our product or platform.

---

## 3. Local Gate Verification Counts

All 44 gates in `npm run build` (`node scripts/run-gates.mjs`) ran locally and passed:

| Gate | Duration | Status |
| :--- | :--- | :--- |
| `check-comment-terminators` | 1367ms | PASS |
| `check-facts` | 1610ms | PASS |
| `check-english` | 2754ms | PASS |
| `check-vendor-logos` | 1381ms | PASS |
| `check-brand-drift` | 650ms | PASS |
| `check-help-centre` | 10128ms | PASS |
| `astro check` | 168916ms | PASS |
| `astro build` | 23766ms | PASS |
| `copy-assets` | 1486ms | PASS |
| `copy-cf-config` | 625ms | PASS |
| `build-sitemap` | 806ms | PASS |
| `check-sitemap-routes` | 700ms | PASS |
| `check-pricing-parity` | 1307ms | PASS |
| `check-site-facts` | 1423ms | PASS |
| `check-links` | 457ms | PASS |
| `check-device-frames` | 2251ms | PASS |
| `check-seo-parity` | 386ms | PASS |
| `check-faq-parity` | 544ms | PASS |
| `check-content-parity` | 987ms | PASS |
| `check-design-system` | 3190ms | PASS |
| `check-palette-roles` | 1325ms | PASS |
| `check-motion` | 962ms | PASS |
| `check-csp` | 582ms | PASS |
| `check-csp-required-origins` | 165ms | PASS |
| `check-brand-names` | 1717ms | PASS |
| `check-utilities` | 1269ms | PASS |
| `check-render` | 113686ms | PASS |
| `check-glossary-filter` | 9708ms | PASS |
| `check-timeline` | 58086ms | PASS |
| `check-heading-ink` | 24153ms | PASS |
| `check-treatments` | 57953ms | PASS |
| `check-controls` | 260553ms | PASS |
| `check-transitions` | 89145ms | PASS |
| `check-disclosure` | 70389ms | PASS |
| `check-shared-blocks` | 222623ms | PASS |
| `check-breadcrumbs` | 68966ms | PASS |
| `check-sheen` | 133143ms | PASS |
| `check-app-contrast` | 93960ms | PASS |
| `check-sticky-budget` | 12433ms | PASS |
| `check-status-pulse` | 6517ms | PASS |
| `check-font-coverage` | 634ms | PASS |
| `check-budgets` | 110209ms | PASS |
| `check-cwv` | 405932ms | PASS |
| `check-autoplay` | 257900ms | PASS |

**Total**: 44 gates run, 44 passed, 0 failed (2226.8s total).  
**Additional gate**: `node scripts/verify-robots.mjs` passed (AI discoverability stanzas and llms.txt verified).

---

## 4. Production Deployment & Live Verification

- **Pushed Commit**: `400e7b3d`
- **Cloudflare Pages Production Build**: Succeeded and live
- **Live Endpoint Checks**:
  - `https://velstrian.com/`: HTTP 200 OK
  - `https://velstrian.com/pricing/`: HTTP 200 OK
  - `https://velstrian.com/blog/ppn-026-what-has-published-and-what-has-not/`: HTTP 200 OK
  - `https://velstrian.com/help/`: HTTP 200 OK
  - `https://velstrian.com/help/account-security-and-data/`: HTTP 200 OK (Title: 51 characters)
  - `https://velstrian.com/sitemap-index.xml`: HTTP 200 OK (Points to sitemap.xml)
  - `https://www.velstrian.com/`: HTTP 301 Redirect to `https://velstrian.com/`

---

## 5. What Was Left / Cloudflare Agent Readiness Review

Following rule W14, the Cloudflare Agent Readiness items are reviewed individually with recommendations:

1. **Content Signals in `robots.txt`**:
   - *Description*: Add `Content-Signal: ai-train=no, search=yes, ai-input=no` to `robots.txt`.
   - *Recommendation*: Highly recommended for explicit AI crawler intent. Currently pending owner decision because modifying `robots.txt` is outside `astro/`.
   - *Alternative*: Keep current explicit crawler allowlist without content signals.
2. **Markdown for Agents (Content Negotiation)**:
   - *Description*: Respond with markdown when `Accept: text/markdown` is received.
   - *Recommendation*: Defer. `llms.txt` and `llms-full.txt` already provide clean, structured markdown for LLMs without requiring edge Worker proxies on static Pages.
   - *Alternative*: Add a Cloudflare Worker or Pages Function route to negotiate content.
3. **Link Discovery Headers**:
   - *Description*: Add `Link: </.well-known/api-catalog>; rel="api-catalog"` response headers.
   - *Recommendation*: Defer until a public API catalog is formally deployed, avoiding broken endpoint references.
4. **OAuth Protected Resource Metadata (RFC 9728)**:
   - *Description*: Serve metadata at `/.well-known/oauth-protected-resource`.
   - *Recommendation*: Not applicable for the static marketing website. Belongs on the platform app if machine-to-machine OAuth is offered.
5. **A2A Agent Card & DNS-AID**:
   - *Description*: Publish `/.well-known/agent-card.json` and DNS `_agents` SVCB records for agent-to-agent communication.
   - *Recommendation*: Defer until autonomous agent communication protocols are supported on the backend.
