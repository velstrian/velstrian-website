/**
 * generate-site-facts.mjs: writes src/data/site-facts.json from the platform.
 *
 * R285-WEB-CLAIMS-AUDIT-01, owner decision D252 (7). The website claims audit
 * (crowagent-platform/docs/rebrand-velstrian/WEBSITE-CLAIMS-AUDIT-2026-10-21.md)
 * found 108 claims of which 43 were wrong in one direction or the other, and
 * nothing tied any of them to the product. This file is the tie.
 *
 * TWO KINDS OF RECORD.
 *
 *   DERIVED  read from the platform repository on every run: the live notice
 *            sources, the upload formats and limits, the fit dimensions and
 *            the plan allowances. Running this script after a platform change
 *            rewrites them, and check-site-facts.mjs fails the build when the
 *            committed file no longer matches what this script would write.
 *
 *   MEASURED facts that no file in either repository holds, such as the
 *            hosting regions (read from the Supabase project and response
 *            headers) or the ICO register state. They are kept from the
 *            committed file, each with the date it was measured and how.
 *
 * Run from astro/:  node scripts/generate-site-facts.mjs
 * It needs ../../crowagent-platform beside this repository. Cloudflare Pages
 * does not have it, which is why the JSON is committed and the gate only
 * checks drift where the platform is present.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FACTS_PATH = path.join(__dirname, '..', 'src', 'data', 'site-facts.json');
export const PLATFORM = path.resolve(__dirname, '..', '..', '..', 'crowagent-platform');

const P = {
  markets: 'api/app/services/bid_markets.json',
  config: 'api/app/config.py',
  dropzone: 'web/src/features/bid/intake/TenderDropzone.tsx',
  uploadPanel: 'web/src/features/bid/rfp/TenderUploadPanel.tsx',
  fit: 'api/app/services/bid_fit.py',
  catalogue: 'packages/pricing/catalogue.ts',
};

/** Reader facing names. A source with no name here fails generation, so a new
    platform source cannot reach the site under its internal key. */
const SOURCE_NAMES = {
  fts: 'Find a Tender',
  contracts_finder: 'Contracts Finder',
  public_contracts_scotland: 'Public Contracts Scotland',
  ted: 'EU TED',
  canadabuys: 'Canada (CanadaBuys)',
  world_bank: 'World Bank',
  sam_gov: 'US federal (SAM.gov, with your own key)',
  austender: 'AusTender',
};

/** Feed URL settings in config.py. A source whose URL is blank fetches nothing,
    so the site must never name it. */
const FEED_URL_SETTINGS = { austender: 'austender_atm_rss_url' };

function read(rel) {
  return fs.readFileSync(path.join(PLATFORM, rel), 'utf8');
}

function fail(msg) {
  throw new Error(`generate-site-facts: ${msg}`);
}

function deriveSources() {
  const markets = JSON.parse(read(P.markets));
  const config = read(P.config);
  const defaults = new Set(markets.default_markets);
  const live = [];
  const onRequest = [];
  const neverName = [];
  for (const m of markets.markets) {
    if (m.availability !== 'available') continue;
    for (const key of m.discovery_sources) {
      const name = SOURCE_NAMES[key] ?? fail(`no reader name for source "${key}"`);
      const setting = FEED_URL_SETTINGS[key];
      if (setting) {
        const blank = new RegExp(`^\\s*${setting}\\s*:\\s*str\\s*=\\s*""`, 'm').test(config);
        if (blank) {
          neverName.push({ key, name, reason: `${setting} is blank in ${P.config}, so the source fetches nothing` });
          continue;
        }
      }
      (defaults.has(m.code) ? live : onRequest).push({ key, name, market: m.code });
    }
  }
  if (!/06:00 UTC/.test(config)) fail(`${P.config} no longer states the 06:00 UTC ingest job`);
  return {
    source: [P.markets, P.config],
    live,
    on_request: onRequest,
    never_name: neverName,
    refresh: 'daily',
    refresh_time: '06:00 UTC',
  };
}

function exts(src, constName) {
  const m = src.match(new RegExp(`${constName}\\s*=\\s*\\[([^\\]]*)\\]`));
  if (!m) fail(`${constName} not found`);
  return [...m[1].matchAll(/['"]([a-z0-9]+)['"]/g)].map((x) => x[1]);
}

function mb(src, constName) {
  const m = src.match(new RegExp(`${constName}\\s*=\\s*(\\d+)\\s*\\*\\s*1024\\s*\\*\\s*1024`));
  if (!m) fail(`${constName} not found`);
  return Number(m[1]);
}

function deriveUpload() {
  const dz = read(P.dropzone);
  const panel = read(P.uploadPanel);
  return {
    source: [P.dropzone, P.uploadPanel],
    start_a_bid: { formats: exts(dz, 'ACCEPTED_TENDER_EXTENSIONS'), max_mb: mb(dz, 'MAX_TENDER_FILE_SIZE') },
    tender_pack: { formats: exts(panel, 'ALLOWED_EXTENSIONS'), max_mb: mb(panel, 'MAX_FILE_SIZE') },
    email_intake: true,
    allowed_mb: [mb(dz, 'MAX_TENDER_FILE_SIZE'), mb(panel, 'MAX_FILE_SIZE')],
    images_accepted: false,
  };
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function deriveFit() {
  const src = read(P.fit);
  const dims = [...src.matchAll(/^_W_([A-Z_]+)\s*=\s*([\d.]+)/gm)].map((m) => ({
    name: m[1].toLowerCase().replace(/_/g, ' '),
    points: Number(m[2]),
  }));
  const total = dims.reduce((a, d) => a + d.points, 0);
  if (dims.length === 0 || total !== 100) fail(`fit weights read as ${dims.length} dimensions totalling ${total}`);
  return { source: [P.fit], count: dims.length, count_word: NUMBER_WORDS[dims.length], dimensions: dims };
}

function derivePlans() {
  const src = read(P.catalogue);
  const plan = (key) => {
    const block = src.match(new RegExp(`\\n  ${key}: \\{([\\s\\S]*?)\\n  \\},`));
    if (!block) fail(`plan ${key} not found in ${P.catalogue}`);
    const a = block[1].match(/allowances:\s*\{\s*seats:\s*(\d+),\s*creditsPerMonth:\s*(\d+)(?:,\s*guestReviewers:\s*(\d+))?/);
    if (!a) fail(`allowances for ${key} not found`);
    const integrations = (block[1].match(/integrations:\s*"(\w+)"/) ?? [])[1] ?? 'included';
    const seatAddOns = /seatAddOnsAllowed:\s*true/.test(block[1]);
    return { seats: Number(a[1]), credits: Number(a[2]), guest_reviewers: a[3] ? Number(a[3]) : null, integrations, seat_add_ons: seatAddOns };
  };
  return {
    source: [P.catalogue, 'D241 (single sign-on on every plan)'],
    bid: { starter: plan('starter'), pro: plan('pro'), portfolio: plan('portfolio') },
    sso_every_plan: true,
  };
}

/** Builds the derived half of the record set. Exported for the gate. */
export function derive() {
  return {
    sources: deriveSources(),
    upload: deriveUpload(),
    fit_dimensions: deriveFit(),
    plans: derivePlans(),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!fs.existsSync(PLATFORM)) {
    console.error(`generate-site-facts: platform repository not found at ${PLATFORM}`);
    process.exit(1);
  }
  const current = JSON.parse(fs.readFileSync(FACTS_PATH, 'utf8'));
  const next = { ...current, ...derive() };
  fs.writeFileSync(FACTS_PATH, JSON.stringify(next, null, 2) + '\n');
  console.log(`generate-site-facts: wrote ${path.relative(process.cwd(), FACTS_PATH)}`);
}
