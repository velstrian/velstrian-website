#!/usr/bin/env node
/**
 * render-owner-review.js, D451 (owner, 2026-10-25), row R285-BOARD-OWNER-REVIEW-HTML-01.
 *
 * WHY IT EXISTS. Every document the owner must read, approve, sign or decide on
 * was a .md file in crowagent-platform, and the owner finds raw markdown very
 * hard to read. This renders each one to a standalone, readable HTML page under
 * status/review/<slug>.html, so the board can open it as an action link.
 *
 * WHAT IT READS.
 *   - status/owner-review-docs.json: row id -> document paths. One line per row,
 *     so a new approval document is added by one line.
 *   - the release tracker, for the row title and the current status text, which
 *     becomes the "What you are asked to decide" box. History after " Was:" is
 *     dropped, it is the past, not the ask.
 *   - index.html's first :root block, for the --pb-* palette. The review pages
 *     hold no colour of their own, so a board palette change reaches them on the
 *     next rebuild.
 *
 * Called by build-platform-board.js on every rebuild, so the pages stay current.
 * Runnable alone: node status/render-owner-review.js
 *
 * The status/review/ directory is owned by this script: pages for documents no
 * longer mapped are removed, so a stale approval page cannot outlive its row.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const MAPPING = path.join(HERE, 'owner-review-docs.json');

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadMarked(platform) {
  /* No new dependency: marked is already installed for the platform web app,
     the same copy render-legal-docs.mjs uses. */
  const resolved = require.resolve('marked', { paths: [path.join(platform, 'web')] });
  return require(resolved).marked;
}

function git(platform, args) {
  return execFileSync('git', ['-C', platform, ...args], { encoding: 'utf8' }).trim();
}

/* Row id -> { title, verdict, ask } from the tracker table. */
function readRows(tracker, ids) {
  const text = fs.readFileSync(tracker, 'utf8');
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\|\s*([A-Z0-9][A-Z0-9-]+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (!m || !ids.has(m[1]) || out[m[1]]) continue;
    const title = m[2].replace(/^(?:\[[A-Z]+:[^\]]*\])+\s*/, '');
    const status = m[3];
    const verdict = (status.match(/^([A-Z][A-Z ]*?[A-Z])\b(?=\s|$)/) || [])[1] || '';
    const current = status.split(/\s+Was:\s/)[0];
    const ask = current
      .replace(/^[A-Z][A-Z ]*?[A-Z]\s+\d{4}-\d{2}-\d{2}\s*[-:]?\s*/, '')
      .replace(/`/g, '');
    out[m[1]] = { title, verdict, ask };
  }
  return out;
}

/* The --pb-* palette, read from the board page itself. */
function boardTokens() {
  const page = fs.readFileSync(path.join(HERE, 'index.html'), 'utf8');
  const root = (page.match(/:root\{([\s\S]*?)\n\s*\}/) || [])[1] || '';
  const decls = [...root.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--pb-[a-z0-9-]+)\s*:\s*([^;]+);/g)];
  const light = decls.filter(([, k]) => !k.endsWith('-dk'));
  const darkKeys = new Set(decls.filter(([, k]) => k.endsWith('-dk')).map(([, k]) => k));
  const all = decls.map(([, k, v]) => `${k}:${v.trim()};`).join('');
  const swap = light
    .filter(([, k]) => darkKeys.has(`${k}-dk`))
    .map(([, k]) => `${k}:var(${k}-dk);`).join('');
  return { all, swap };
}

function css() {
  const t = boardTokens();
  return `:root{${t.all}color-scheme:var(--pb-scheme)}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${t.swap}}}
:root[data-theme="dark"]{${t.swap}}
*{box-sizing:border-box}
body{margin:0;background:var(--pb-bg);color:var(--pb-ink);font-family:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;font-size:17px;line-height:1.65}
main{max-width:760px;margin:0 auto;padding:28px 16px 64px}
a{color:var(--pb-accent)}
.back{font-size:14px;margin:0 0 18px}
.rv-head{background:var(--pb-panel);border:1px solid var(--pb-line);border-left:4px solid var(--pb-accent);border-radius:10px;padding:18px 20px;margin:0 0 18px}
.rv-kicker{margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--pb-muted);font-weight:600}
.rv-head h1{margin:0 0 10px;font-size:26px;line-height:1.3}
.rv-meta{margin:0;font-size:13.5px;color:var(--pb-muted);overflow-wrap:anywhere}
.rv-meta code{font-size:12.5px}
.rv-row{display:inline-block;font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12.5px;background:var(--pb-accent-soft);color:var(--pb-ink);border-radius:999px;padding:2px 10px;margin:0 6px 6px 0}
.rv-ask{background:var(--pb-decision-bg);border:1px solid var(--pb-line);border-left:4px solid var(--pb-decision);border-radius:10px;padding:16px 20px;margin:0 0 28px}
.rv-ask h2{margin:0 0 10px;font-size:15px;text-transform:uppercase;letter-spacing:.06em;color:var(--pb-decision)}
.rv-ask .item{margin:0 0 12px}
.rv-ask .item:last-child{margin:0}
.rv-ask .rid{display:block;font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12.5px;color:var(--pb-muted)}
.rv-ask .rtitle{display:block;font-weight:600;margin:2px 0 4px}
.rv-ask p{margin:0;font-size:15px;overflow-wrap:anywhere}
.doc h1{font-size:28px;line-height:1.3;margin:32px 0 12px}
.doc h2{font-size:22px;line-height:1.35;margin:32px 0 10px;padding-top:12px;border-top:1px solid var(--pb-line)}
.doc h3{font-size:18px;margin:24px 0 8px}
.doc p,.doc ul,.doc ol{margin:0 0 14px}
.doc li{margin:0 0 6px}
.doc code{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:.86em;background:var(--pb-panel2);border-radius:4px;padding:1px 5px;overflow-wrap:anywhere}
.doc pre{background:var(--pb-panel2);border:1px solid var(--pb-line);border-radius:8px;padding:12px 14px;overflow-x:auto}
.doc pre code{background:none;padding:0}
.doc blockquote{margin:0 0 16px;padding:10px 16px;border-left:4px solid var(--pb-accent);background:var(--pb-panel);border-radius:0 8px 8px 0}
.doc .tbl{overflow-x:auto;margin:0 0 18px;border:1px solid var(--pb-line);border-radius:8px;background:var(--pb-panel)}
.doc table{border-collapse:collapse;width:100%;font-size:14.5px;line-height:1.5}
.doc th,.doc td{padding:8px 10px;border-bottom:1px solid var(--pb-line);text-align:left;vertical-align:top;overflow-wrap:anywhere}
.doc th{background:var(--pb-panel2);font-weight:600}
.doc tr:last-child td{border-bottom:0}
.doc hr{border:0;border-top:1px solid var(--pb-line);margin:28px 0}
`;
}

function slugOf(rel, taken) {
  let slug = path.basename(rel, '.md').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (taken.has(slug)) {
    const parent = path.basename(path.dirname(rel)).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    slug = `${parent}-${slug}`;
  }
  taken.add(slug);
  return slug;
}

function renderOwnerReview({ platform, tracker, outDir = path.join(HERE, 'review') }) {
  const mapping = JSON.parse(fs.readFileSync(MAPPING, 'utf8')).rows || {};
  const ids = new Set(Object.keys(mapping));
  const rows = readRows(tracker, ids);
  const marked = loadMarked(platform);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'review.css'), css());

  /* Path -> the rows that point at it, so a document shared by two rows is
     rendered once with both asks at the top. */
  const byPath = new Map();
  for (const [row, paths] of Object.entries(mapping)) {
    for (const rel of paths) {
      if (!byPath.has(rel)) byPath.set(rel, []);
      byPath.get(rel).push(row);
    }
  }

  const taken = new Set();
  const docs = new Map();
  const missing = [];
  const watch = [];
  const head = git(platform, ['rev-parse', '--short', 'HEAD']);
  for (const [rel, rowIds] of byPath) {
    const abs = path.join(platform, rel);
    if (!fs.existsSync(abs)) {
      missing.push({ path: rel, rows: rowIds });
      docs.set(rel, { path: rel, missing: true });
      continue;
    }
    watch.push(abs);
    const slug = slugOf(rel, taken);
    const sha = git(platform, ['log', '-1', '--format=%h', '--', rel]);
    const dirty = git(platform, ['status', '--short', '--', rel]);
    const shaText = sha
      ? `<code>${esc(sha)}</code>${dirty ? ' plus uncommitted edits' : ''}`
      : `not yet committed (working tree at <code>${esc(head)}</code>)`;
    const src = fs.readFileSync(abs, 'utf8');
    const title = ((src.match(/^#\s+(.+)$/m) || [])[1] || path.basename(rel, '.md')).replace(/[`*]/g, '').trim();
    const body = marked.parse(src, { gfm: true })
      .replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, '</table></div>');
    const asks = rowIds.map((id) => {
      const r = rows[id];
      if (!r) return `<div class="item"><span class="rid">${esc(id)}</span><p>This row is not in the tracker. The mapping line is stale.</p></div>`;
      return `<div class="item"><span class="rid">${esc(id)} &middot; ${esc(r.verdict || '?')}</span>` +
        `<span class="rtitle">${esc(r.title)}</span><p>${esc(r.ask || 'No ask recorded on the row.')}</p></div>`;
    }).join('');
    const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title>
<link rel="stylesheet" href="review.css"></head>
<body><main>
<p class="back"><a href="../index.html#platform">Back to the board</a></p>
<header class="rv-head">
<p class="rv-kicker">Owner review</p>
<h1>${esc(title)}</h1>
<p>${rowIds.map((id) => `<span class="rv-row">${esc(id)}</span>`).join('')}</p>
<p class="rv-meta">Source <code>crowagent-platform/${esc(rel)}</code>, rendered from ${shaText}. A read only copy, the source file is what counts.</p>
</header>
<section class="rv-ask" aria-labelledby="ask"><h2 id="ask">What you are asked to decide</h2>${asks}</section>
<article class="doc">
${body}
</article>
</main></body></html>
`;
    fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
    docs.set(rel, { path: rel, slug, title, sha: sha || null, dirty: Boolean(dirty), href: `review/${slug}.html` });
  }

  /* Remove pages this script no longer owns a source for. */
  const keep = new Set([...docs.values()].filter((d) => d.slug).map((d) => `${d.slug}.html`));
  for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith('.html') && !keep.has(f)) fs.unlinkSync(path.join(outDir, f));
  }

  const entries = Object.entries(mapping).map(([row, paths]) => ({
    row,
    title: rows[row] ? rows[row].title : null,
    verdict: rows[row] ? rows[row].verdict : null,
    docs: paths.map((p) => docs.get(p)),
  }));
  return { entries, missing, watch };
}

module.exports = { renderOwnerReview };

if (require.main === module) {
  const platform = path.resolve(HERE, '..', '..', 'crowagent-platform');
  const tracker = fs.readdirSync(platform)
    .filter((n) => /^RELEASE-[\d.]+-TRACKER\.md$/.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .pop();
  const r = renderOwnerReview({ platform, tracker: path.join(platform, tracker) });
  for (const e of r.entries) {
    for (const d of e.docs) console.log(`${e.row}  ->  ${d.missing ? `MISSING ${d.path}` : d.href}`);
  }
  if (r.missing.length) process.exitCode = 1;
}
