/**
 * check-site-facts.mjs: one gate rule per record in src/data/site-facts.json.
 *
 * R285-WEB-CLAIMS-AUDIT-01, owner decision D252 (7): "A generated site facts
 * file with one rule per record joins the website build gate chain (website
 * build, no GitHub Actions cost)."
 *
 * WHY IT READS dist AND NOT src. A claim is what the reader sees. Fourteen
 * components in src are imported by no page, and several still carry the old
 * wording, so a source scan would fail on text nobody reads and miss text that
 * a data file assembles at build time. The page text is taken from the built
 * HTML with comments, scripts (except JSON-LD, which search engines quote) and
 * styles removed, plus image alt text and the meta description. llms.txt and
 * llms-full.txt are read from the repository root, which is what copy-assets
 * ships.
 *
 * WHAT IT CANNOT SEE. Pixels inside the raster screenshots, and anything a
 * script writes into the page after load. The /buy/ evidence drawer swaps its
 * text from an inline script, so the `buy_panel_score` rule reads that
 * script's source as well as the page text.
 *
 * DRIFT. Where crowagent-platform sits beside this repository, the derived
 * records are regenerated in memory and compared with the committed file. A
 * difference fails the gate: run `node scripts/generate-site-facts.mjs`, then
 * correct every page the new facts contradict. Cloudflare Pages has no
 * platform checkout, so there the drift rule is skipped and says so.
 *
 * Same contract as the other gates: named exceptions with a written reason,
 * every exception printed, stale exceptions reported, anything else fails.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FACTS_PATH, PLATFORM, derive } from './generate-site-facts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const REPO = path.join(ROOT, '..');
const FACTS = JSON.parse(fs.readFileSync(FACTS_PATH, 'utf8'));

/* ── THE CORPUS ─────────────────────────────────────────────────────────── */

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&#x27;': "'", '&apos;': "'" };

export function pageText(html) {
  const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const alts = [...html.matchAll(/\salt="([^"]*)"/gi)].map((m) => m[1]);
  const desc = [...html.matchAll(/<meta\s+name="description"\s+content="([^"]*)"/gi)].map((m) => m[1]);
  const body = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<template[\s\S]*?<\/template>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return [body, ...alts, ...desc, ...ld]
    .join(' \n ')
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e.toLowerCase()] ?? ' ')
    .replace(/\\u0026/g, '&')
    .replace(/[ \t\r\f\v]+/g, ' ');
}

function routeOf(file) {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  return '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
}

function loadCorpus() {
  if (!fs.existsSync(DIST)) {
    console.error('check-site-facts: dist/ not found. Run `astro build` first.');
    process.exit(1);
  }
  const pages = walk(DIST).map((f) => ({ route: routeOf(f), text: pageText(fs.readFileSync(f, 'utf8')), html: fs.readFileSync(f, 'utf8') }));
  for (const name of ['llms.txt', 'llms-full.txt']) {
    const p = path.join(REPO, name);
    if (fs.existsSync(p)) pages.push({ route: name, text: fs.readFileSync(p, 'utf8'), html: '' });
  }
  return pages;
}

/* ── HELPERS ────────────────────────────────────────────────────────────── */

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function context(text, index, len) {
  return text.slice(Math.max(0, index - 70), index + len + 70).replace(/\s+/g, ' ').trim();
}

/** Every match of `re` on every page, as findings. `keep(text, m)` may veto. */
function scan(pages, re, keep = () => true) {
  const out = [];
  for (const p of pages) {
    for (const m of p.text.matchAll(re)) {
      if (keep(p.text, m)) out.push({ route: p.route, hit: m[0], ctx: context(p.text, m.index, m[0].length) });
    }
  }
  return out;
}

function banned(pages, phrases, flags = 'g') {
  return phrases.flatMap((ph) => scan(pages, new RegExp(esc(ph), flags)));
}

const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/* ── THE RULES, ONE PER RECORD ──────────────────────────────────────────── */

const RULES = [
  {
    record: 'sources',
    why: 'Four sources are live (D252 (1)): Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED, refreshed daily at 06:00 UTC. Canada, World Bank and US federal are on request per organisation. A source whose feed is not connected is never named.',
    check(pages) {
      const f = FACTS.sources;
      const out = [];
      for (const n of f.never_name) out.push(...banned(pages, [n.name]));
      out.push(...scan(pages, /\bAustralia\b/g));
      /* A two source list that stops short of the other two. */
      out.push(
        ...scan(
          pages,
          /(?:Contracts Finder(?: and | \+ |, )Find a Tender|Find a Tender(?: and | \+ |, )Contracts Finder)(?! service)/g,
          (t, m) => !/Public Contracts Scotland/.test(t.slice(m.index, m.index + m[0].length + 60)),
        ),
      );
      /* Canada named without the on request qualifier. */
      out.push(...scan(pages, /\bCanada\b/g, (t, m) => !/on request|per organisation/i.test(t.slice(Math.max(0, m.index - 160), m.index + 200))));
      /* The ingest time without its zone. */
      out.push(...scan(pages, /06:00(?! UTC)/g));
      return out;
    },
  },
  {
    record: 'upload',
    why: 'A bid starts from PDF, Word, text, Excel or CSV up to 25 MB a file. The pack takes ZIP and PowerPoint up to 100 MB a file. Images are not accepted.',
    check(pages) {
      const allowed = new Set(FACTS.upload.allowed_mb);
      const out = [
        ...scan(pages, /\b(\d+)\s?MB\b/g, (t, m) => !allowed.has(Number(m[1]))),
        ...scan(pages, /\b(?:PNG|JPEG|JPG)\b/g, (t, m) => /upload|reads?\b|files?\b/i.test(t.slice(Math.max(0, m.index - 120), m.index + 120))),
      ];
      /* D288. While the platform ships email intake switched off, no page may
         offer to take a tender by email: "forward the email", "forwarded by
         email", "the email you forwarded", "email intake", a tender+ address. */
      if (!FACTS.upload.email_intake) {
        out.push(
          ...scan(pages, /\bforward(?:s|ed|ing)?\b[^.\n]{0,40}?\be-?mail/gi),
          ...scan(pages, /\be-?mail(?:s|ed)?\b[^.\n]{0,40}?\bforward(?:s|ed|ing)?\b/gi),
          ...scan(pages, /\be-?mail intake\b|\btender\+/gi),
        );
      }
      return out;
    },
  },
  {
    record: 'fit_dimensions',
    why: `The fit rubric has ${FACTS.fit_dimensions.count} dimensions (bid_fit.py).`,
    check(pages) {
      const n = FACTS.fit_dimensions.count;
      return scan(pages, /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|\d+)[- ]dimension/gi, (t, m) => {
        const v = /^\d+$/.test(m[1]) ? Number(m[1]) : NUM_WORDS.indexOf(m[1].toLowerCase());
        return v !== n;
      });
    },
  },
  {
    record: 'plans',
    why: 'Single sign-on is on every plan (D241). Guest reviewers are 3, 10 and 25 on the Bid plans and must be published on /pricing/.',
    check(pages) {
      const out = scan(pages, /\bPortfolio\b[^.]{0,120}\bsingle sign-on\b/g, (t, m) => {
        const sentence = t.slice(m.index, t.indexOf('.', m.index + m[0].length) + 1);
        return !/every plan/.test(sentence);
      });
      const pricing = pages.find((p) => p.route === '/pricing/');
      const g = FACTS.plans.bid;
      if (!pricing || !/Guest reviewers/.test(pricing.text)) {
        out.push({ route: '/pricing/', hit: 'Guest reviewers', ctx: 'the guest reviewer row is missing' });
      } else {
        for (const k of ['starter', 'pro', 'portfolio']) {
          if (!new RegExp(`Guest reviewers[\\s\\S]{0,400}\\b${g[k].guest_reviewers}\\b`).test(pricing.text)) {
            out.push({ route: '/pricing/', hit: `${k} ${g[k].guest_reviewers}`, ctx: 'guest reviewer allowance not shown' });
          }
        }
      }
      return out;
    },
  },
  {
    record: 'regions',
    why: 'Customer data is stored in the EU (Ireland). Drafting prompts reach US AI processors, so nothing may say documents stay in the region or data stays in the UK.',
    check: (pages) => banned(pages, FACTS.regions.banned),
  },
  {
    record: 'certifications',
    why: 'D255: say what we do, positively. "Follows ISO/IEC 27001" (D281, which retired "Built to ISO 27001 controls") and "GDPR compliant" are approved. The one boundary is a certificate or attestation the company does not hold, so "ISO 27001 certified", "certified to ISO 27001", "SOC 2" and "Cyber Essentials certified" fail the build. Every page that carries the footer must show the six trust badges from trust_badges, word for word.',
    check(pages) {
      const out = banned(pages, FACTS.certifications.banned, 'gi');
      /* The trust strip is the footer's, read from trust_badges. A page that
         carries the footer and is missing a badge means a second, local list
         has crept back in. */
      for (const p of pages) {
        if (!/class="[^"]*footer-credibility/.test(p.html)) continue;
        for (const b of FACTS.trust_badges.list) {
          if (!p.text.includes(b)) out.push({ route: p.route, hit: `missing trust badge "${b}"`, ctx: 'footer-credibility' });
        }
      }
      return out;
    },
  },
  {
    record: 'status_host',
    why: `The status page is ${FACTS.status_host.url}.`,
    check(pages) {
      const out = banned(pages, FACTS.status_host.banned);
      for (const p of pages) {
        for (const m of p.html.matchAll(/href="(https?:\/\/status\.[^"/]+)/g)) {
          if (m[1] !== FACTS.status_host.url) out.push({ route: p.route, hit: m[1], ctx: 'status link to the wrong host' });
        }
      }
      return out;
    },
  },
  {
    record: 'processors',
    why: 'One processor list. Sentry is in the EU (Germany), Gemini is the 2.5 family, and every processor is named on both /privacy/ and /security/.',
    check(pages) {
      const out = banned(pages, FACTS.processors.banned);
      for (const route of FACTS.processors.pages_listing_all) {
        const p = pages.find((x) => x.route === route);
        for (const proc of FACTS.processors.list) {
          if (!p || !p.text.includes(proc.name)) out.push({ route, hit: proc.name, ctx: 'processor missing from this page' });
        }
      }
      return out;
    },
  },
  {
    record: 'ico',
    why: 'Until the ICO register shows the new name, no page tells a reader to search the register for it (D252 (4)).',
    check(pages) {
      if (FACTS.ico.register_shows_new_name) return [];
      return scan(pages, /search(?:ing)? for/gi, (t, m) => /\bICO\b/.test(t.slice(Math.max(0, m.index - 200), m.index + 120)));
    },
  },
  {
    record: 'product_status',
    why: 'The app stays invite only until the owner asks for general availability, and that is said ONLY on the app login and sign up screens (owner, D455 and D456, 2026-10-25, superseding the D252 item 8 private beta milestone). No page and no llms file uses beta, invite only, waitlist or request access wording, claims live production, or calls out a rename.',
    check(pages) {
      const s = FACTS.product_status;
      const out = banned(pages, s.banned, 'gi');
      const words = s.banned_access_wording.map((w) => esc(w).replace(/[ -]/g, '[\\s-]'));
      out.push(...scan(pages, new RegExp('\\b(?:' + words.join('|') + ')\\b', 'gi')));
      return out;
    },
  },
  {
    record: 'ai_advisor',
    why: 'The AI Compliance Advisor is a released feature (D252 (5)) and is described as live.',
    check(pages) {
      const a = FACTS.ai_advisor;
      const out = banned(pages, a.banned);
      const p = pages.find((x) => x.route === a.page);
      if (!p || !p.text.includes(a.must_contain)) out.push({ route: a.page, hit: a.must_contain, ctx: 'the Advisor is missing' });
      return out;
    },
  },
  {
    record: 'unsupported_claims',
    why: 'Claims no measurement supports.',
    check: (pages) => banned(pages, FACTS.unsupported_claims.banned),
  },
  {
    record: 'buy_panel_score',
    why: 'Velstrian Buy never scores. Any score shown on /buy/ is the panel score, entered by the evaluator, and says so.',
    check(pages) {
      const r = FACTS.buy_panel_score;
      const p = pages.find((x) => x.route === r.page);
      if (!p) return [{ route: r.page, hit: 'page', ctx: 'not built' }];
      const out = [];
      for (const src of [p.text, p.html]) {
        for (const m of src.matchAll(/\bscore:\s*\d/gi)) {
          if (!src.slice(Math.max(0, m.index - 12), m.index).toLowerCase().includes(r.required_prefix.toLowerCase())) {
            out.push({ route: r.page, hit: 'Score:', ctx: context(src, m.index, 6) });
          }
        }
      }
      return out;
    },
  },
  {
    record: 'security_controls',
    why: 'D290 and D295: the "Security built in" block prints only what is true today, from one list, on the home page and /security/. No scheduled scan of the live site, no tested restore, no training promise until a measurement backs it.',
    check(pages) {
      const r = FACTS.security_controls;
      const out = banned(pages, r.banned, 'gi');
      for (const route of r.pages) {
        const p = pages.find((x) => x.route === route);
        for (const g of r.groups) {
          for (const c of g.controls) {
            if (!p || !p.text.includes(c.line)) out.push({ route, hit: `${c.id} "${c.line}"`, ctx: 'security control missing from this page' });
          }
        }
      }
      return out;
    },
  },
  {
    record: 'capabilities',
    why: 'A capability the product has must stay on the page it was placed on. An underclaim is a defect too.',
    check(pages) {
      const out = [];
      for (const c of FACTS.capabilities.list) {
        if (!c.page) continue;
        const p = pages.find((x) => x.route === c.page);
        if (!p || !p.text.includes(c.must_contain)) out.push({ route: c.page, hit: `${c.id} "${c.must_contain}"`, ctx: c.claim });
      }
      return out;
    },
  },
  {
    record: 'ai_use',
    why: 'A-417: /ai/ prints every line of the record word for word, a line marked coming says will or coming so it never reads as built, no page promises the AI is never wrong (D359, D371), and no page that lists providers names one that is not in DPA Schedule 1 (OpenAI waits on the D329 notice).',
    check(pages) {
      const r = FACTS.ai_use;
      const out = banned(pages, r.banned, 'gi');
      const p = pages.find((x) => x.route === r.page);
      for (const g of r.groups) {
        for (const l of g.lines) {
          if (!p || !p.text.includes(l.line)) out.push({ route: r.page, hit: `${l.id} "${l.line}"`, ctx: 'AI use line missing from this page' });
          if (l.status === 'coming' && !/\b(will|coming)\b/i.test(l.line)) out.push({ route: r.page, hit: l.id, ctx: 'a coming line must say will or coming' });
        }
      }
      for (const route of r.provider_pages) {
        const pp = pages.find((x) => x.route === route);
        if (pp) out.push(...banned([pp], r.not_yet_providers));
      }
      return out;
    },
  },
];

/* ── NAMED EXCEPTIONS ───────────────────────────────────────────────────── */

/* The one exception (the Figma Discover drawing's alt text on
   /sectors/construction/ and /compare/) was removed 2026-10-22 with the
   drawing itself: ProductScreen shows the real feed capture there now. */
const EXCEPTIONS = [];

function excused(record, f) {
  return EXCEPTIONS.find(
    (e) => e.record === record && e.route.test(f.route) && e.hit.test(f.hit) && (!e.ctxMatch || e.ctxMatch.test(f.ctx)),
  );
}

/* ── RUN ────────────────────────────────────────────────────────────────── */

function drift() {
  if (!fs.existsSync(PLATFORM)) {
    console.log('  drift: SKIPPED, crowagent-platform is not beside this repository (expected on Cloudflare Pages)');
    return [];
  }
  const now = derive();
  const out = [];
  for (const [k, v] of Object.entries(now)) {
    if (JSON.stringify(v) !== JSON.stringify(FACTS[k])) {
      out.push({ route: 'src/data/site-facts.json', hit: k, ctx: 'differs from the platform. Run node scripts/generate-site-facts.mjs and correct the pages it contradicts' });
    }
  }
  return out;
}

const pages = loadCorpus();
let failed = 0;
const used = new Set();
console.log(`check-site-facts: ${RULES.length} record rules plus drift, over ${pages.length} pages and llms files\n`);

const driftFindings = drift();
if (driftFindings.length) {
  failed += driftFindings.length;
  console.log('FAIL drift');
  for (const f of driftFindings) console.log(`  ${f.route}: ${f.hit} ${f.ctx}`);
} else if (fs.existsSync(PLATFORM)) {
  console.log('PASS drift (derived records match crowagent-platform)');
}

for (const rule of RULES) {
  const findings = rule.check(pages);
  const real = [];
  for (const f of findings) {
    const e = excused(rule.record, f);
    if (e) used.add(e);
    else real.push(f);
  }
  if (real.length === 0) {
    console.log(`PASS ${rule.record}`);
    continue;
  }
  failed += real.length;
  console.log(`FAIL ${rule.record}: ${rule.why}`);
  for (const f of real) console.log(`  ${f.route}  "${f.hit}"  ...${f.ctx}...`);
}

console.log('\nexceptions:');
for (const e of EXCEPTIONS) {
  console.log(`  ${used.has(e) ? 'used ' : 'STALE'} ${e.record} ${e.route}: ${e.why}`);
}
const stale = EXCEPTIONS.filter((e) => !used.has(e));
if (stale.length) {
  failed += stale.length;
  console.log(`\n${stale.length} stale exception(s). Delete them, a stale exception hides the next real hit.`);
}

if (failed) {
  console.log(`\ncheck-site-facts: FAIL, ${failed} finding(s)`);
  process.exit(1);
}
console.log('\ncheck-site-facts: PASS');
