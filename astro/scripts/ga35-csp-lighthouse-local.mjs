// Brief 35 Task 3 acceptance: serve the built dist with its real _headers CSP
// applied, run Lighthouse best-practices on 2 pages, and assert best-practices
// >= 95 with 0 CSP console errors. Locally there is no Cloudflare edge, so the
// per-request JSD script (__CF$cv$params) is NOT injected: this is the control
// that proves the website build's own CSP is clean and the blocked script is an
// edge injection, not a site inline script.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ASTRO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ASTRO, 'dist');
const WEBSITE_NM = 'C:/Users/bhave/Velstrian Repo/velstrian-website/node_modules';

// Parse the catch-all CSP from dist/_headers (the Content-Security-Policy on /*).
function readCsp() {
  const txt = fs.readFileSync(path.join(DIST, '_headers'), 'utf8');
  const line = txt.split(/\r?\n/).find((l) => /^\s*Content-Security-Policy:/i.test(l));
  return line ? line.replace(/^\s*Content-Security-Policy:\s*/i, '').trim() : null;
}
const CSP = readCsp();

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

function serve(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let file = path.join(DIST, p);
      if (p.endsWith('/')) file = path.join(file, 'index.html');
      else if (!path.extname(file)) file = path.join(DIST, p, 'index.html');
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; res.end('not found'); return; }
      const ext = path.extname(file);
      res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
      if (ext === '.html' && CSP) res.setHeader('Content-Security-Policy', CSP);
      res.end(fs.readFileSync(file));
    });
    server.listen(port, () => resolve(server));
  });
}

async function main() {
  const require = (await import('node:module')).createRequire(pathToFileURL(path.join(WEBSITE_NM, 'x')).href);
  const lighthouse = require('lighthouse').default || require('lighthouse');
  const chromeLauncher = require('chrome-launcher');

  const PORT = 4319;
  const server = await serve(PORT);
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  const pages = ['/buy/', '/pricing/'];
  const out = { csp_applied: !!CSP, results: [] };
  try {
    for (const p of pages) {
      const url = `http://localhost:${PORT}${p}`;
      let res = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['best-practices'] });
      const lhr = res.lhr;
      const bp = Math.round((lhr.categories['best-practices']?.score ?? 0) * 100);
      const consoleErr = lhr.audits['errors-in-console'];
      const cspErrors = (consoleErr?.details?.items ?? []).filter((it) => /content security policy|csp/i.test(it.description || ''));
      const inspector = lhr.audits['inspector-issues'];
      out.results.push({
        page: p,
        best_practices: bp,
        csp_console_errors: cspErrors.length,
        console_errors_total: (consoleErr?.details?.items ?? []).length,
        inspector_issues: (inspector?.details?.items ?? []).length,
        failing_bp_audits: (lhr.categories['best-practices'].auditRefs || [])
          .map((r) => lhr.audits[r.id])
          .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable')
          .map((a) => a.id),
      });
    }
  } finally {
    await chrome.kill();
    server.close();
  }
  console.log(JSON.stringify(out, null, 2));
  const pass = out.results.every((r) => r.best_practices >= 95 && r.csp_console_errors === 0);
  console.log(pass ? 'TASK3 LOCAL: PASS (best-practices >= 95, 0 CSP console errors)' : 'TASK3 LOCAL: review');
}
main().catch((e) => { console.error(e); process.exit(1); });
