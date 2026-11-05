// R29-GA95-WEB-LIGHTHOUSE-LIVE-01 (Kiro brief 36 Task 2).
//
// Run Lighthouse MOBILE three times each against the LIVE site on home,
// pricing, /bid/, /buy/, the help centre and the tender finder, and report the
// median of the four category scores per page and overall. Also confirm there
// are 0 CSP console errors and that the Cloudflare JavaScript Detections
// bootstrap (__CF$cv$params) is gone from each live page (owner decision D586
// switched JavaScript Detections off).
//
// No site file changes, read only against production. lighthouse and
// chrome-launcher are resolved from the website main checkout's node_modules
// (the same source ga35-csp-lighthouse-local.mjs used).
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const WEBSITE_NM = 'C:/Users/bhave/Velstrian Repo/velstrian-website/node_modules';
const BASE = 'https://velstrian.com';
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'bid', path: '/bid/' },
  { name: 'buy', path: '/buy/' },
  { name: 'help centre', path: '/help/' },
  { name: 'tender finder', path: '/tools/tender-finder/' },
];
const RUNS = 3;

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

async function main() {
  const require = (await import('node:module')).createRequire(pathToFileURL(path.join(WEBSITE_NM, 'x')).href);
  const lighthouse = require('lighthouse').default || require('lighthouse');
  const chromeLauncher = require('chrome-launcher');

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  // Lighthouse defaults to the mobile form factor with Moto G4 emulation and
  // simulated 4G throttling. Set it explicitly so the record is unambiguous.
  const config = {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    },
  };

  const out = { base: BASE, runs_per_page: RUNS, when: new Date().toISOString(), pages: [] };
  try {
    for (const pg of PAGES) {
      const url = `${BASE}${pg.path}`;
      const perRun = [];
      let cfParamsSeen = false;
      let cspErrTotal = 0;
      for (let i = 0; i < RUNS; i++) {
        const res = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error' }, config);
        const lhr = res.lhr;
        const cat = (id) => Math.round((lhr.categories[id]?.score ?? 0) * 100);
        const scores = {
          performance: cat('performance'),
          accessibility: cat('accessibility'),
          'best-practices': cat('best-practices'),
          seo: cat('seo'),
        };
        perRun.push(scores);
        const consoleItems = lhr.audits['errors-in-console']?.details?.items ?? [];
        const cspErrors = consoleItems.filter((it) => /content security policy|csp/i.test((it.description || '') + ' ' + (it.source || '')));
        cspErrTotal += cspErrors.length;
        const finalHtml = lhr.audits['network-requests'] ? '' : '';
        void finalHtml;
        if (lhr.audits['errors-in-console']) {
          if (consoleItems.some((it) => /__CF\$cv\$params|challenge-platform\/scripts\/jsd/.test(JSON.stringify(it)))) cfParamsSeen = true;
        }
      }
      const medians = {
        performance: median(perRun.map((r) => r.performance)),
        accessibility: median(perRun.map((r) => r.accessibility)),
        'best-practices': median(perRun.map((r) => r['best-practices'])),
        seo: median(perRun.map((r) => r.seo)),
      };
      out.pages.push({ page: pg.name, url, perRun, medians, csp_console_errors_total: cspErrTotal, cf_params_in_console: cfParamsSeen });
      console.error(`done ${pg.name}: perf ${medians.performance} a11y ${medians.accessibility} bp ${medians['best-practices']} seo ${medians.seo}`);
    }
  } finally {
    await chrome.kill();
  }

  // Overall median of each category across the six pages' medians.
  out.overall = {
    performance: median(out.pages.map((p) => p.medians.performance)),
    accessibility: median(out.pages.map((p) => p.medians.accessibility)),
    'best-practices': median(out.pages.map((p) => p.medians['best-practices'])),
    seo: median(out.pages.map((p) => p.medians.seo)),
  };
  console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
