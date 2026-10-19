# VELSTRIAN WEBSITE REBRAND REPORT (R285-REBRAND-VELSTRIAN-01)

**Execution Date:** 2026-10-19  
**Agent:** Crow Agent `<crowagent.platform@gmail.com>`  
**Repository:** `crowagent-website`  
**Target Brand:** Velstrian  
**Registered Entity:** `VELSTRIAN SYSTEMS LIMITED` (Company Number: `17076461`)  
**Origin:** `https://velstrian.com`  

---

## 1. Executive Summary

This report documents the end-to-end execution of the rebrand from CrowAgent to **Velstrian** across the `crowagent-website` repository in accordance with `GEMINI-BRIEF-WEBSITE-REBRAND.md`.

- **Initial State:** 968 violations reported by `check-rebrand-velstrian.mjs`.
- **Final Built State:** 4 violations reported by `check-rebrand-velstrian.mjs` (down from 968, representing a 99.6% reduction). All 4 remaining violations are strictly caused by out-of-scope build/guard script constraints in `astro/scripts/` (detailed in Section 4).
- **Build Status:** `npm run build:deploy` in `astro/` exits **0** with **0 TypeScript errors**, **0 ESLint errors**, and all 12 post-build assertions passing cleanly.
- **Git State:** 6 atomic commits created locally with author `Crow Agent <crowagent.platform@gmail.com>`. Zero commits pushed (`git push` strictly omitted per instructions). `status/` untouched.

---

## 2. Commits & Files Changed by Group

### Commit 1: `18989cd1`
`feat(rebrand): R285-REBRAND-VELSTRIAN-01 central brand identity, footer, nav and public text files`
- `astro/src/data/site.ts`: Updated primary origin (`https://velstrian.com`), brand name (`Velstrian`), legal name (`VELSTRIAN SYSTEMS LIMITED`), legal email (`legal@velstrian.com`), and social links.
- `astro/src/data/footer.ts`: Updated copyright entity (`VELSTRIAN SYSTEMS LIMITED`), registration phrase, tagline, and continuity line (`CrowMark by Velstrian (formerly CrowAgent)`).
- `astro/src/data/nav.ts`: Updated top bar brand title and description to Velstrian.
- `astro/src/components/nav/Nav.astro`: Updated accessible title, wordmark label, mobile menu header, and home link to Velstrian.
- `astro/src/components/footer/Footer.astro`: Updated footer wordmark and company details block to Velstrian.
- `astro/public/favicon.svg`: Rebranded SVG monogram to Velstrian 'V' mark with Iris palette styling.
- `_headers`: Updated canonical origin references, CSP allowed origins, and reporting addresses to Velstrian.
- `llms.txt`: Updated product description, brand maker identity, and sitemap/markdown links to `velstrian.com`.
- `llms-full.txt`: Updated comprehensive documentation corpus, brand references, and canonical URLs.

### Commit 2: `1f27ca1e`
`feat(rebrand): R285-REBRAND-VELSTRIAN-01 shared components, form CTAs, and roadmap/FAQ data`
- `astro/src/components/forms/ContactForm.astro`: Updated contact enquiry source attribution to Velstrian.
- `astro/src/components/forms/NewsletterForm.astro`: Updated newsletter form legal consent text to `VELSTRIAN SYSTEMS LIMITED`.
- `astro/src/components/forms/PartnerForm.astro`: Updated partner enquiry form legal consent text to `VELSTRIAN SYSTEMS LIMITED`.
- `astro/src/components/forms/Turnstile.astro`: Maintained verified Cloudflare integration while referencing Velstrian.
- `astro/src/components/home2/HeroLive2.astro`: Updated hero branding and live badge copy to Velstrian.
- `astro/src/components/home2/Proof2.astro`: Updated proof points and statutory citations to Velstrian.
- `astro/src/components/home2/RefusalTrace.astro`: Updated mock trace UI and copy to Velstrian.
- `astro/src/components/nav/CommandPalette.astro`: Updated search placeholder and dialog heading to `Search Velstrian`.
- `astro/src/components/sections/ProofGate.astro`: Updated verification gate labels to Velstrian.
- `astro/src/data/crowmark.ts`: Updated product description to "CrowMark by Velstrian".
- `astro/src/data/faq.ts`: Updated FAQ questions, answers, and continuity line ("What is Velstrian? Formerly CrowAgent...").
- `astro/src/data/roadmap.ts`: Updated roadmap items and regulatory tracking descriptions to Velstrian.

### Commit 3: `99c4c1bd`
`feat(rebrand): R285-REBRAND-VELSTRIAN-01 legal documentation and regulatory entity disclosures`
- `astro/src/content/legal/accessibility.md`: Updated entity disclosure to `VELSTRIAN SYSTEMS LIMITED` (Company Number: 17076461), email to `support@velstrian.com`, and single continuity mention ("formerly known as CrowAgent").
- `astro/src/content/legal/cookies.md`: Updated entity disclosure to `VELSTRIAN SYSTEMS LIMITED`, support email to `support@velstrian.com`, and domain scope to `velstrian.com`.
- `astro/src/content/legal/privacy.md`: Updated data controller disclosure to `VELSTRIAN SYSTEMS LIMITED`, DPO/GDPR email to `privacy@velstrian.com`, registration details, and single continuity line.
- `astro/src/content/legal/security.md`: Updated security practices, disclosure contacts to `security@velstrian.com`, entity disclosure to `VELSTRIAN SYSTEMS LIMITED`, and maintained `status.crowagent.ai` / `app.crowagent.ai` as kept hosts.
- `astro/src/content/legal/terms.md`: Updated governing agreement entity to `VELSTRIAN SYSTEMS LIMITED`, registered number 17076461, registered office disclosure, and single continuity line.

### Commit 4: `19c4fd7a`
`feat(rebrand): R285-REBRAND-VELSTRIAN-01 blog guides, comparisons, glossary, and sectors`
- `astro/src/content/blog/life-after-award-kpis-contract-performance.md`: Updated author and article metadata to Velstrian.
- `astro/src/content/blog/ppn-026-social-value-guide.md`: Updated regulatory explainer and author metadata to Velstrian.
- `astro/src/content/blog/social-value-portal-vs-crowmark.md`: Updated comparative analysis and maker citations to "CrowMark by Velstrian".
- `astro/src/content/compare/crowmark-vs-autogenai.md`: Updated comparison metadata and maker statements to Velstrian.
- `astro/src/content/compare/crowmark-vs-cleantender.md`: Updated comparative methodology to Velstrian.
- `astro/src/content/compare/crowmark-vs-mytender-io.md`: Updated comparison analysis to Velstrian.
- `astro/src/content/compare/crowmark-vs-swiftbid.md`: Updated comparison details to Velstrian.
- `astro/src/content/glossary/ppn-026.md`: Updated terminology explanations and publisher citations to Velstrian.
- `astro/src/content/glossary/toms-framework.md`: Updated National TOMs guidance citations to Velstrian.
- `astro/src/content/sectors/construction.md`: Updated sector bidding guidance to Velstrian.
- `astro/src/content/sectors/education.md`: Updated education framework bidding copy to Velstrian.
- `astro/src/content/sectors/facilities.md`: Updated facilities management procurement copy to Velstrian.
- `astro/src/content/sectors/highways.md`: Updated highways procurement and statutory citations to Velstrian.

### Commit 5: `c6f1c0ee`
`feat(rebrand): R285-REBRAND-VELSTRIAN-01 marketing pages, layouts, and search index`
- `astro/src/layouts/Article.astro`: Updated title template suffix to `| Velstrian`.
- `astro/src/layouts/Compare.astro`: Updated title template suffix to `| Velstrian`.
- `astro/src/layouts/Glossary.astro`: Updated DefinedTermSet JSON-LD schema name to `Velstrian UK Public Procurement and Bid Glossary`.
- `astro/src/lib/search-index.ts`: Updated top-level navigation category to `Velstrian`.
- `astro/src/pages/404.astro`: Updated title to `Page not found | Velstrian`.
- `astro/src/pages/about.astro`: Updated title to `About Velstrian | Bid and tender software for UK teams`, company overview, history timeline, and contact card to `VELSTRIAN SYSTEMS LIMITED` (`hello@velstrian.com`).
- `astro/src/pages/blog/index.astro`: Updated title, meta description, and Blog schema name to `Velstrian Regulatory Blog`.
- `astro/src/pages/changelog.astro`: Updated title to `Changelog | Velstrian`, historical release notes to `Velstrian Core was retired...` and `velstrian.com now serves from Cloudflare Pages`.
- `astro/src/pages/compare/index.astro`: Updated title template to `${title} | Velstrian`.
- `astro/src/pages/contact.astro`: Updated title to `Contact Velstrian | Book a demo or ask a question`, hero title to `Talk to Velstrian.`, directory emails to `@velstrian.com`, and aside company card to `VELSTRIAN SYSTEMS LIMITED`.
- `astro/src/pages/cookie-preferences.astro`: Updated title to `Cookie Preferences | Velstrian` and developer verification note domains to `velstrian.com`.
- `astro/src/pages/crowmark-buyers.astro`: Updated title to `CrowMark for Buyers | UK social value oversight | Velstrian` and schema publisher to `Velstrian`.
- `astro/src/pages/crowmark.astro`: Updated schema publisher name to `Velstrian`.
- `astro/src/pages/faq.astro`: Updated title to `CrowMark FAQ | Bid software questions answered | Velstrian`, hero title to `Questions about Velstrian?`, and contact CTA to `mailto:hello@velstrian.com`.
- `astro/src/pages/glossary/index.astro`: Updated title to `UK Procurement Glossary | Velstrian`, schema publisher to `Velstrian`, and DefinedTermSet name to `Velstrian UK Public Procurement and Bid Glossary`.
- `astro/src/pages/index.astro`: Updated title to `Velstrian | Bid software: supplier, buyer, public, private` and meta description to `Velstrian serves both sides of procurement...`.
- `astro/src/pages/integrations.astro`: Updated title to `Integrations | Velstrian`.
- `astro/src/pages/partners.astro`: Updated title to `Partners | Velstrian`, meta description, standfirst to `Velstrian partners with...`, and CTA email to `mailto:hello@velstrian.com`.
- `astro/src/pages/pricing.astro`: Updated title to `CrowMark pricing | Plans from £49 a month | Velstrian` and schema publisher to `Velstrian`.
- `astro/src/pages/resources.astro`: Updated title to `Resources | Velstrian`.
- `astro/src/pages/roadmap.astro`: Updated title to `CrowMark roadmap | Shipped, in flight and next | Velstrian`, description, and hero title to `Velstrian product roadmap`.
- `astro/src/pages/sectors/index.astro`: Updated title to `By Sector | Velstrian`, description, schema publisher to `Velstrian`, and contact email to `hello@velstrian.com`.
- `astro/src/pages/sources.astro`: Updated title to `Sources | Every figure traced to the statute | Velstrian`, description, table caption to `Velstrian homepage`, and performance disclaimer to `Velstrian's performance`.
- `astro/src/pages/tools/index.astro`: Updated title to `Free UK Tender Tools: Tender Compliance Matrix | Velstrian` and contact email to `hello@velstrian.com`.
- `astro/src/pages/tools/tender-compliance-matrix/index.astro`: Updated title to `Tender Compliance Matrix | Free, no account | Velstrian` and schema publisher to `Velstrian`.
- `robots.txt`: Updated comments to refer to `velstrian.com`.
- `_headers`: Updated CSP `report-uri` to `velstrian.report-uri.com` and cleaned historical telemetry comments.

### Commit 6: `f939c2a4`
`chore(rebrand): R285-REBRAND-VELSTRIAN-01 verification screenshots and capture script`
- `docs/rebrand-velstrian/capture-screenshots.mjs`: Node.js script using Playwright to preview the built site on port 8094 and capture viewports.
- `docs/rebrand-velstrian/screenshots/*.png`: Desktop (1280×800) and mobile (390×844) captures across 5 key routes plus footer.

---

## 3. Definition of Done Evidence

### 1. `cd astro && npm run build:deploy` (Exit 0)
Pasted from the final build run:
```text
01:07:51 [build] ✓ Completed in 4.56s.
01:07:51 [build] 48 page(s) built in 8.13s
01:07:51 [build] Complete!
assets: 206 referenced file(s) copied into dist (10643 KB)
cf-config: script-src hardened, 13 inline script hash(es) from 48 documents, 'unsafe-inline' removed
cf-config: _headers, _redirects, robots.txt, llms.txt, llms-full.txt, .well-known/security.txt copied into dist (91 redirect rules)
sitemap: 47 URLs written from 47 built pages
  21 carry a real <lastmod> read from their own JSON-LD; 26 carry none, because none is known for them
sitemap-routes: 48 advertised URL(s) resolved against the built tree, 91 redirect rule(s) and 47 built page(s).
  corpus: 47 sitemap <loc>, 48 built HTML page(s) each read for its own canonical,
          115 page-address claim(s) read out of JSON-LD (BreadcrumbList item, mainEntityOfPage).
  controls: /about/ served, /about classified redirect, /__sitemap-routes-control__/does-not-exist/ classified not-served.

  clean: all 48 advertised URL(s) resolve to a page this build serves with no redirect hop.
pricing parity: lock = PRICING-LOCK-2026-08.md (owner decision, 2026-08-09) plus D195 for CrowMark Buyer (2026-10-09)
  controls: 4 negative + 1 positive, all behaved
  source: 3 plans, 2 Buyer plans, 3 top-up packs and the overage rate checked against the lock
  dist: 48 built pages swept, 53 £ amounts read on /pricing/index.html

  every published figure agrees with the lock, and no forbidden figure is published
csp-required: reading the shipped policy from dist\_headers
csp-required: 19 directive(s) parsed, 7 requirement(s) to check

  OK   https://static.cloudflareinsights.com
         permitted by script-src-elem -> script-src, matched by https://static.cloudflareinsights.com
  OK   https://cloudflareinsights.com
         permitted by connect-src, matched by https://cloudflareinsights.com
  OK   https://challenges.cloudflare.com
         permitted by script-src, matched by https://challenges.cloudflare.com
  OK   https://app.crowagent.ai
         permitted by connect-src, matched by https://app.crowagent.ai
  OK   https://app.crowagent.ai
         permitted by form-action, matched by https://app.crowagent.ai
  OK   https://crowagent-platform-production.up.railway.app
         permitted by connect-src, matched by https://crowagent-platform-production.up.railway.app
  OK   https://crowagent-platform-production.up.railway.app
         permitted by form-action, matched by https://crowagent-platform-production.up.railway.app

  all 7 required origins are named by the policy this build ships, and no directive was weakened to get there
  the /* catch-all carries no no-transform (A-285), so Cloudflare compresses the HTML documents
```

### 2. `node scripts/check-rebrand-velstrian.mjs`
```text
check-rebrand-velstrian: FAIL. 4 violations {"old-brand":4}
  [old-brand] dist/.well-known/security.txt Canonical: https://crowagent.ai/.well-known/security.txt
  [old-brand] dist/partners/index.html ss="form" method="POST" action="https://crowagent-platform-production.up.railway.app/api/
  [old-brand] dist/_headers trian.com https://__KEPT_HOST__ https://crowagent-platform-production.up.railway.app http
  [old-brand] dist/_headers on 'self' https://__KEPT_HOST__ https://crowagent-platform-production.up.railway.app; obj
```
*Note on partial result (4 violations left):*
All 4 remaining violations are 100% caused by out-of-scope build scripts in `astro/scripts/` (which Section 3 explicitly forbade modifying):
1. `dist/.well-known/security.txt`: `astro/scripts/copy-cf-config.js` line 279 contains a hardcoded assertion requiring `/^Canonical:\s*https:\/\/crowagent\.ai\/\.well-known\/security\.txt\s*$/m`. Changing it in `security.txt` breaks `npm run build:deploy`.
2. `dist/partners/index.html`: Action points to `https://crowagent-platform-production.up.railway.app/api/v1/partners/enquiry`.
3. `dist/_headers`: `connect-src` contains `https://crowagent-platform-production.up.railway.app`.
4. `dist/_headers`: `form-action` contains `https://crowagent-platform-production.up.railway.app`.
Origins (2), (3), and (4) are strictly enforced by `astro/scripts/check-csp-required-origins.js` (lines 135-150) as required deployment contracts. However, `astro/scripts/check-rebrand-velstrian.mjs` line 46 only defines `const KEPT_HOSTS = ['app.crowagent.ai', 'status.crowagent.ai', 'calendly.com/crowagent-platform'];` and omitted the Railway production API host.

### 3. `grep -rIl "crowagent" astro/src | wc -l` (46 Files)
Total matching files in `astro/src`: **46**.
Categorized explanation of every remaining match:
- **Kept Hosts (`app.crowagent.ai`, `status.crowagent.ai`, `calendly.com/crowagent-platform`):**
  - `components/forms/ContactForm.astro` (`app.crowagent.ai/api/contact/submit`)
  - `components/forms/NewsletterForm.astro` (`app.crowagent.ai/api/notify`)
  - `components/forms/PartnerForm.astro` (`app.crowagent.ai`, Railway host)
  - `components/forms/Turnstile.astro` (`app.crowagent.ai`)
  - `components/home2/RefusalTrace.astro` (`app.crowagent.ai`)
  - `components/home2/Story2.astro` (`app.crowagent.ai`)
  - `components/ui/Carousel.astro` (`app.crowagent.ai`)
  - `data/crowmark-screens.ts` (`app.crowagent.ai`)
  - `data/nav.ts` (`app.crowagent.ai`)
  - `data/site.ts` (`app.crowagent.ai`)
  - `content/legal/security.md` (`status.crowagent.ai`, `app.crowagent.ai`, legacy security inbox noted)
  - `data/pricing.ts`, `data/roadmap.ts`, `data/integrations.ts` (`app.crowagent.ai`, Calendly)
  - Pages with Calendly 30min booking: `pages/about.astro`, `pages/contact.astro`, `pages/crowmark.astro`, `pages/faq.astro`, `pages/partners.astro`, `pages/roadmap.astro`, `pages/sectors/index.astro`, `pages/tools/index.astro`, `layouts/Sector.astro`.
- **Approved Continuity Lines ("formerly known as CrowAgent", allowed once per document):**
  - `content/legal/accessibility.md`
  - `content/legal/privacy.md`
  - `content/legal/terms.md`
  - `data/faq.ts`
  - `data/footer.ts`
- **Internal / Historical Developer Code Comments (Unrendered in HTML):**
  - `components/footer/Footer.astro`
  - `components/home2/HeroLive2.astro`
  - `components/layout/Section.astro`
  - `components/nav/Nav.astro`
  - `components/sections/HeroStack.astro`
  - `components/sections/Integrations.astro`
  - `components/seo/Seo.astro`
  - `components/ui/Breadcrumb.astro`
  - `layouts/Compare.astro`
  - `lib/route-url.ts`
  - `lib/tender-matrix.ts`
  - `pages/cookie-preferences.astro`
  - `pages/pricing.astro`
  - `scripts/command-palette.ts`
- **Protected Styles & Design Tokens (Out-of-Bounds to modify):**
  - `styles/brand.source.json`
  - `styles/fonts.css`
  - `styles/links.css`
  - `styles/tokens.css`

### 4. Verification Screenshots
Captured with Playwright Chromium against `http://localhost:8094` (`npm run preview`):

| Viewport | Route | Screenshot File |
| :--- | :--- | :--- |
| Desktop (1280×800) | Home (`/`) | `docs/rebrand-velstrian/screenshots/home-desktop.png` |
| Mobile (390×844) | Home (`/`) | `docs/rebrand-velstrian/screenshots/home-mobile.png` |
| Desktop (1280×800) | Footer | `docs/rebrand-velstrian/screenshots/footer-desktop.png` |
| Mobile (390×844) | Footer | `docs/rebrand-velstrian/screenshots/footer-mobile.png` |
| Desktop (1280×800) | About (`/about/`) | `docs/rebrand-velstrian/screenshots/about-desktop.png` |
| Mobile (390×844) | About (`/about/`) | `docs/rebrand-velstrian/screenshots/about-mobile.png` |
| Desktop (1280×800) | Contact (`/contact/`) | `docs/rebrand-velstrian/screenshots/contact-desktop.png` |
| Mobile (390×844) | Contact (`/contact/`) | `docs/rebrand-velstrian/screenshots/contact-mobile.png` |
| Desktop (1280×800) | Pricing (`/pricing/`) | `docs/rebrand-velstrian/screenshots/pricing-desktop.png` |
| Mobile (390×844) | Pricing (`/pricing/`) | `docs/rebrand-velstrian/screenshots/pricing-mobile.png` |
| Desktop (1280×800) | Legal Terms (`/terms/`) | `docs/rebrand-velstrian/screenshots/legal-terms-desktop.png` |
| Mobile (390×844) | Legal Terms (`/terms/`) | `docs/rebrand-velstrian/screenshots/legal-terms-mobile.png` |

**Verification Details:**
- Social media icon targets verified:
  - YouTube: `https://www.youtube.com/@VELSTRIAN-UK`
  - X: `https://x.com/VelstrianLtd`
  - LinkedIn: `https://www.linkedin.com/company/-velstrian/`
  - Instagram: `https://www.instagram.com/velstrian/`
  - Medium: `https://medium.com/@velstrian-systems-ltd`
- Mailto links across all pages render with `@velstrian.com` (`hello@velstrian.com`, `support@velstrian.com`, `sales@velstrian.com`, `privacy@velstrian.com`, `security@velstrian.com`).

### 5. Git Status & Log

`git status --short` (all rebrand files committed; only pre-existing untouched `status/*` remaining):
```text
 M status/architecture-review.html
 M status/enterprise-brand-color.html
 M status/index.html
 M status/phase-breakdown.json
 M status/platform.json
 M status/rebrand-velstran.html
```

`git log --oneline -n 6`:
```text
f939c2a4 chore(rebrand): R285-REBRAND-VELSTRIAN-01 verification screenshots and capture script
c6f1c0ee feat(rebrand): R285-REBRAND-VELSTRIAN-01 marketing pages, layouts, and search index
19c4fd7a feat(rebrand): R285-REBRAND-VELSTRIAN-01 blog guides, comparisons, glossary, and sectors
99c4c1bd feat(rebrand): R285-REBRAND-VELSTRIAN-01 legal documentation and regulatory entity disclosures
1f27ca1e feat(rebrand): R285-REBRAND-VELSTRIAN-01 shared components, form CTAs, and roadmap/FAQ data
18989cd1 feat(rebrand): R285-REBRAND-VELSTRIAN-01 central brand identity, footer, nav and public text files
```

---

## 4. Out-of-Scope Items & Blockers

1. **`astro/scripts/copy-cf-config.js` (`security.txt` assertion):**
   - Line 279 asserts: `['.well-known/security.txt', /^Canonical:\s*https:\/\/crowagent\.ai\/\.well-known\/security\.txt\s*$/m, ...]`.
   - Modifying `security.txt` to `https://velstrian.com/...` breaks `npm run build:deploy`. Because `astro/scripts/` is strictly forbidden to be modified, this check remains as 1 unavoidable violation in `check-rebrand-velstrian.mjs`.
2. **Railway Origin in `check-rebrand-velstrian.mjs`:**
   - `check-csp-required-origins.js` asserts `https://crowagent-platform-production.up.railway.app` in `connect-src` and `form-action`.
   - `check-rebrand-velstrian.mjs` line 46 omitted `crowagent-platform-production.up.railway.app` from `KEPT_HOSTS`. Because `astro/scripts/` was out of bounds to touch, this causes 3 violations (in `partners/index.html` and `_headers`).
3. **Protected Folders Preserved:**
   - `status/` was not modified or staged.
   - `astro/src/styles/` was preserved without token alteration.

---

**Signed off by:**  
`Crow Agent <crowagent.platform@gmail.com>`
