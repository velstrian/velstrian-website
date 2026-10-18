# Gemini brief: website rebrand from CrowAgent to Velstrian

Reference: R285-REBRAND-VELSTRIAN-01. Written 2026-10-18 by Crow Agent for the owner to hand to Gemini.
This brief ASSIGNS BUILD WORK. For this brief only, it overrides the "reviewer only, changes no code"
line in `GEMINI.md`. Everything else in `GEMINI.md`, `AGENTS.md` and `CLAUDE.md` still binds.

## 0. Before you touch anything

1. Read `../crowagent-platform/docs/AI-ONBOARDING-GUIDE.md`, then `AGENTS.md`, `GEMINI.md` and `CLAUDE.md`
   in this repository. They hold the style, naming and claims rules referred to below.
2. Confirm the hooks are loaded: `.gemini/settings.json` registers a BeforeTool hook (path bounds, no push,
   no deploy) and an AfterAgent hook (runs the rebrand guard on the built site). If your client does not
   run Gemini CLI hooks, you must run the guard yourself, as section 6 says. The guard is the acceptance
   test either way.
3. Check free RAM before any build (`Get-CimInstance Win32_OperatingSystem`, `FreePhysicalMemory`). Never
   start a build below 1 GB free. Never kill a process. This machine is shared with the owner.

## 1. The facts. Use these exactly, never invent another

| Item | Value |
|---|---|
| Brand name in running copy | **Velstrian** |
| Registered legal name | **VELSTRIAN SYSTEMS LIMITED** (all capitals, exactly as Companies House holds it) |
| Short form | **VSL**, only after the full legal name has appeared once on the same page, and only where space is tight |
| Company number | **17076461** (unchanged) |
| Registered in | England and Wales |
| Primary website | **https://velstrian.com** |
| Product names | **CrowMark** and **CrowMark Buyer** stay exactly as they are (owner decision D2, 2026-10-18). Where the maker is named, write "CrowMark by Velstrian" |
| Continuity line | "formerly CrowAgent", at most once per page, only on About, the legal pages and the press or company facts block. Never "formerly CrowAgent Ltd" |
| Trade mark | VELSTRIAN is a UK trade mark APPLICATION, number UK00004461754, filed 18 October 2026. Never use ®. Use ™ only where a mark symbol is already used today. Never say "registered trade mark" |
| Email addresses | `hello@`, `support@`, `sales@`, `security@`, `privacy@`, `dpo@`, `legal@` all move from `@crowagent.ai` to `@velstrian.com`, same local part. Never print `crowagent.platform@gmail.com` on the site |

New social profiles, all checked live on 2026-10-18 and all showing VELSTRIAN SYSTEMS LIMITED:

| Network | URL |
|---|---|
| YouTube | https://www.youtube.com/@VELSTRIAN-UK |
| X | https://x.com/VelstrianLtd (handle `@VelstrianLtd`) |
| LinkedIn | https://www.linkedin.com/company/-velstrian/ (the leading hyphen is correct) |
| Instagram | https://www.instagram.com/velstrian/ |
| Medium | https://medium.com/@velstrian-systems-ltd |

The old ones to remove everywhere: `x.com/CrowAgentLtd`, `youtube.com/@CrowAgentUK`,
`linkedin.com/company/crowagent-ltd`, `instagram.com/crowagent.ai`, `medium.com/@crowagent.platform`.

### What stays on crowagent.ai in this round, do NOT change it

The app and status hosts move later in a separate migration (owner decision 2026-10-18). Leave every
`https://app.crowagent.ai...` link, every `https://status.crowagent.ai...` link, the Calendly link
`calendly.com/crowagent-platform/...`, and the `app.crowagent.ai` address drawn in the browser frame of
`ui/Carousel.astro` exactly as they are. The guard already allows them.

## 2. Scope. Do ALL of it

Measured on 2026-10-18 in the built site: 968 guard violations, about 454 "CrowAgent" mentions across 81
source files, 69 `@crowagent.ai` addresses, about 20 legal entity mentions.

1. **Central brand data first.** `astro/src/data/site.ts`: `name` to `Velstrian`, `legalName` to
   `VELSTRIAN SYSTEMS LIMITED`, `origin`, `defaultOgImage`, the `@id`, `url` and `logo` in the
   Organization JSON-LD to `https://velstrian.com`, `twitter` to `@VelstrianLtd`, `email` to
   `hello@velstrian.com`, `sameAs` to the five new profiles, and the description text. Keep the
   Companies House identifier. Then make every page and component READ these values instead of
   repeating them. A brand string typed into a component when `site.ts` already holds it is a
   defect (RULE 0-C: change once, propagate everywhere).
2. **Footer.** `astro/src/data/footer.ts`: the five social links with correct accessible names, the
   description text, the legal line (`VELSTRIAN SYSTEMS LIMITED, registered in England and Wales,
   company number 17076461`).
3. **Every page and component under `astro/src/`**: headers, hero copy, meta titles and descriptions,
   Open Graph and Twitter card text, alt text, aria labels, FAQ answers, glossary, blog, compare,
   sectors, tools, pricing, contact, partners, roadmap, changelog, resources, integrations, sources,
   404. Read each sentence. "CrowAgent" as the company becomes "Velstrian". Where the sentence was
   really about the product, use "CrowMark" instead. Rewrite so it reads naturally, do not just
   swap the word.
4. **Legal pages** (`astro/src/pages/[legal].astro` and its content): the contracting party, the data
   controller, the ICO registration sentence, privacy, terms, cookies, DPA, security. Use the full
   legal name and company number. Keep every legal meaning the same. **Do not change any clause other
   than the name, the addresses and the domain.** If a clause looks wrong, list it in your report.
5. **Public text files**: `llms.txt` and `llms-full.txt` (company name, origin, links to
   `https://velstrian.com/...`), `.well-known/security.txt` (Contact `mailto:security@velstrian.com`,
   Canonical `https://velstrian.com/.well-known/security.txt`, keep a valid future Expires date),
   `_headers` (replace a bare `https://crowagent.ai` or `https://www.crowagent.ai` origin with
   `https://velstrian.com`, keep every `app.crowagent.ai` and `status.crowagent.ai` origin).
6. **Assets that print the old name**: any SVG or text asset under `astro/public/` with "CrowAgent" in
   visible text. Do not redraw the logo mark and do not change any colour. If an image (PNG, JPG, OG
   card) shows the old name, list it in your report with its path. Do not try to edit pixels.
7. **Contact, sales and support CTAs**: every `mailto:` and every printed address uses the new domain.

## 3. Out of scope. The hook blocks these and you must not try a workaround

- `astro/src/styles/` (design tokens, RULE 0-C). The rebrand changes no colour, font or spacing.
- `astro/scripts/` (the gates, including the rebrand guard). Never edit a gate to make it pass.
- `astro/astro.config.mjs`, `robots.txt`, `_redirects`, `CNAME`, `cloudflare-workers/`, `package.json`,
  `.github/`, `.husky/`, `.gemini/`, `status/` and every rule file. Claude has already moved the `site:`
  origin, the robots Sitemap line, the CSP self origin and the llms.txt check to velstrian.com.
  Domain redirects, DNS and email routing are Claude's Cloudflare lane.
- Anything in `../crowagent-platform`. The app is not part of this brief.
- `git push`, any deploy, `wrangler`, `--no-verify`, `git add .` or `-A`, any history rewrite.

## 4. Writing rules (RULE 0-S, the deploy fails on some of these)

- No em dash and no en dash used as punctuation. No semicolons in prose. Minimise hyphens.
- British English, sentence case headings, plain words. Start with the point.
- Banned words: delve, leverage, testament, tapestry, underscore, pivot, paradigm, seamlessly, robust,
  elevate, dynamic, unlock, streamline, empower, game changer, best in class, cutting edge, furthermore,
  moreover, revolutionise, harness, unleash. Banned openers: "Crucially,", "It is worth noting",
  "That said", "At its core", "Simply put", "In summary,".
- Never "council" or "Public Sector edition" in reader text. PPN 026 only, never PPN 002.
- No new claims. Never a win rate, an AI accuracy figure or "makes you compliant". Do not add a story
  about why the company renamed. A rename is not news on a product page.
- Never edit a code identifier, CSS class, route path, cookie or storage key, environment variable or
  quoted error string, even if it contains "crowagent". If the guard flags one that a reader can see,
  report it instead of renaming it.

## 5. How to work

1. Make the `site.ts` and `footer.ts` changes first, then build once to see the remaining list:
   `cd astro && npm run build:deploy` then `node scripts/check-rebrand-velstrian.mjs`.
2. Work through the guard output file by file. Rebuild and re-run the guard after each group of pages,
   not after every edit (each build takes minutes and memory).
3. Run `astro check` errors to zero. `build:deploy` already includes it, plus the facts, English and
   brand drift checks. All of them must pass.
4. Commit locally in small groups by explicit path, author `Crow Agent <crowagent.platform@gmail.com>`
   (the pre-commit hook enforces it). Message format:
   `feat(rebrand): R285-REBRAND-VELSTRIAN-01 <what changed>`.

## 6. Definition of done. Every line must be true, with the evidence pasted in your report

1. `cd astro && npm run build:deploy` exits 0. Paste the last 15 lines.
2. `node scripts/check-rebrand-velstrian.mjs` prints `PASS. 0 violations`. Paste it.
3. `grep -rIl "crowagent" astro/src | wc -l` and the list, each remaining file explained (an identifier,
   an app link, a comment). Paste it.
4. Open the built site (`npm run preview`, port 8094) at 1280x800 and 390x844. Check the home page,
   About, Contact, Pricing, one legal page and the footer. Confirm the five social icons open the right
   profiles and the mailto links show `@velstrian.com`. Save screenshots to
   `docs/rebrand-velstrian/screenshots/` and list them.
5. `git status --short` is clean apart from files you list, and `git log --oneline` shows your commits.

Write the report to `docs/rebrand-velstrian/GEMINI-REPORT-WEBSITE-REBRAND.md` with: commits, files
changed by group, the evidence above, every out of scope item you found (images with the old name,
clauses that look wrong, flagged identifiers), and anything you could not do and why. **Do not write
"done" unless all five lines above hold.** Report a partial result as partial, with the count left.

Sign the report as `Crow Agent <crowagent.platform@gmail.com>`. Never write a password, key or token
anywhere, the report included.
