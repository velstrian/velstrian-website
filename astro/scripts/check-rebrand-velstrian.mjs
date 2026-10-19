#!/usr/bin/env node
/**
 * R285-REBRAND-VELSTRIAN-01. Guard for the website rebrand from CrowAgent to Velstrian.
 *
 * It reads the BUILT site in dist/, because that is what a reader sees. A grep over src/
 * cannot tell copy from a code comment, and a comment that says "CrowAgent" is harmless
 * while a footer that says it is the defect.
 *
 * It is deliberately NOT in `build` or `build:deploy` and NOT wired into CI (RULE 0-G).
 * It runs locally, by hand and from the Gemini AfterAgent hook in ../.gemini/settings.json.
 *
 * Usage: node scripts/check-rebrand-velstrian.mjs            (from astro/, after npm run build:deploy)
 *        node scripts/check-rebrand-velstrian.mjs --json     (machine readable, used by the hook)
 * Exit 0 = every property holds. Exit 1 = at least one violation, each one printed with file and text.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SRC = join(ROOT, 'src');
const JSON_OUT = process.argv.includes('--json');

const LEGAL_NAME = 'VELSTRIAN SYSTEMS LIMITED';
const COMPANY_NUMBER = '17076461';
const ORIGIN = 'https://velstrian.com';
const SOCIALS = [
  'https://www.youtube.com/@VELSTRIAN-UK',
  'https://x.com/VelstrianLtd',
  'https://www.linkedin.com/company/-velstrian/',
  'https://www.instagram.com/velstrian/',
  'https://medium.com/@velstrian-systems-ltd',
];
const OLD_SOCIALS = [
  'x.com/CrowAgentLtd',
  'twitter.com/CrowAgentLtd',
  'youtube.com/@CrowAgentUK',
  'linkedin.com/company/crowagent-ltd',
  'instagram.com/crowagent.ai',
  'medium.com/@crowagent.platform',
];
// Hosts that stay on crowagent.ai in this round (owner decision 2026-10-18: website and
// email move now, the app moves later in its own migration). A reader can see these and
// that is correct until the app migration lands.
const KEPT_HOSTS = [
  'app.crowagent.ai',
  'status.crowagent.ai',
  'calendly.com/crowagent-platform',
  'crowagent-platform-production.up.railway.app', // the API host the partner form posts to, moves with the app
];

const TEXT_EXT = new Set(['.html', '.xml', '.txt', '.json', '.js', '.webmanifest', '.svg']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function newestMtime(dir) {
  return walk(dir).reduce((m, p) => Math.max(m, statSync(p).mtimeMs), 0);
}

const violations = [];
const add = (rule, file, text) =>
  violations.push({ rule, file: file ? relative(ROOT, file).replaceAll('\\', '/') : '', text });

if (!existsSync(join(DIST, 'index.html'))) {
  add('dist-missing', null, 'dist/index.html not found. Run `npm run build:deploy` in astro/ first.');
} else if (newestMtime(SRC) > statSync(join(DIST, 'index.html')).mtimeMs) {
  add('dist-stale', null, 'src/ changed after the last build. Run `npm run build:deploy` again, a stale dist proves nothing.');
} else {
  const files = walk(DIST).filter((p) => TEXT_EXT.has(extname(p)) || p.endsWith('_headers') || p.endsWith('_redirects'));
  for (const file of files) {
    let raw = readFileSync(file, 'utf8');
    const isHeaders = file.endsWith('_headers');
    const isRedirects = file.endsWith('_redirects');
    // Mask the hosts that legitimately stay, so the brand rules below only see the rest.
    let masked = raw;
    for (const h of KEPT_HOSTS) masked = masked.split(h).join('__KEPT_HOST__');

    // 1. Old brand in reader visible output. "formerly CrowAgent" is allowed once per page
    //    as the continuity line, nothing else.
    const scrubbed = masked.replace(/formerly(?: known as)? CrowAgent/gi, '__FORMERLY__');
    if (!isRedirects) {
      const m = scrubbed.match(/.{0,40}crow\s?agent.{0,40}/gi);
      if (m) for (const hit of m.slice(0, 5)) add('old-brand', file, hit.trim());
    }

    // 2. Old addresses and the wrong legal names.
    for (const m of raw.match(/[a-z0-9._-]+@crowagent\.ai/gi) || []) add('old-email', file, m);
    for (const m of raw.match(/(?:CrowAgent|Velstrian) (?:Ltd|Limited)\b/g) || []) {
      if (m !== LEGAL_NAME) add('wrong-legal-name', file, `${m} (the registered name is ${LEGAL_NAME})`);
    }

    // 3. Old social profiles anywhere.
    for (const s of OLD_SOCIALS) if (raw.includes(s)) add('old-social', file, s);

    // 4. The trade mark is an application, not a registration. ® is a false claim until UKIPO registers it.
    if (raw.includes('®') || raw.includes('&reg;')) add('registered-symbol', file, '® used, VELSTRIAN is a pending application (UK00004461754). Use ™ or nothing.');

    // 5. Canonicals and structured data must point at the new origin.
    if (extname(file) === '.html') {
      const canon = raw.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
      if (canon && !canon[1].startsWith(ORIGIN)) add('canonical-origin', file, canon[1]);
      for (const m of raw.match(/"@id":"https?:\/\/(?:www\.)?crowagent\.ai[^"]*"/g) || []) add('jsonld-origin', file, m);
    }
    if (isHeaders && /https:\/\/(?:www\.)?crowagent\.ai(?![a-z.-])/.test(raw.replace(/https:\/\/(app|status)\.crowagent\.ai/g, ''))) {
      add('headers-origin', file, 'bare crowagent.ai origin left in _headers, use velstrian.com (app. and status. may stay)');
    }
  }

  // 6. Required facts on the built pages.
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  for (const s of SOCIALS) if (!home.includes(s)) add('social-missing', join(DIST, 'index.html'), s);
  const allHtml = walk(DIST).filter((p) => p.endsWith('.html')).map((p) => readFileSync(p, 'utf8')).join('\n');
  if (!allHtml.includes(LEGAL_NAME)) add('legal-name-missing', null, `${LEGAL_NAME} appears on no built page`);
  if (!allHtml.includes(COMPANY_NUMBER)) add('company-number-missing', null, `${COMPANY_NUMBER} appears on no built page`);
  if (!/hello@velstrian\.com/.test(allHtml)) add('email-missing', null, 'hello@velstrian.com appears on no built page');
  const sitemap = join(DIST, 'sitemap.xml');
  if (existsSync(sitemap) && !readFileSync(sitemap, 'utf8').includes(`<loc>${ORIGIN}/`)) add('sitemap-origin', sitemap, `sitemap <loc> entries do not start with ${ORIGIN}/`);
}

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ ok: violations.length === 0, count: violations.length, violations: violations.slice(0, 60) }));
} else if (violations.length === 0) {
  console.log('check-rebrand-velstrian: PASS. 0 violations in the built site.');
} else {
  const byRule = violations.reduce((m, v) => ((m[v.rule] = (m[v.rule] || 0) + 1), m), {});
  console.error(`check-rebrand-velstrian: FAIL. ${violations.length} violations ${JSON.stringify(byRule)}`);
  for (const v of violations.slice(0, 200)) console.error(`  [${v.rule}] ${v.file} ${v.text}`);
}
process.exit(violations.length === 0 ? 0 : 1);
