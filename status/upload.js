'use strict';
/**
 * upload.js - token gated marketing upload, served by serve-board.js on :8099.
 * [R29-BOARD-MKT-UPLOAD-01]
 *
 * Why: the team member's Kiro crew (another machine on the office LAN) could only post TEXT
 * to the board channels. Its marketing output (images, videos, captions, drafts) now lands
 * here so the owner can review it from the board.
 *
 *   PUT /api/upload/mkt/<relative path>   raw body, header X-Channel-Token (same token as channel.js)
 *                                          writes status/media/mkt/<relative path>
 *   GET /media/mkt/  or  /media/mkt/index.html   index page, generated on every request
 *   GET /media/mkt/<relative path>        the file (Range supported so videos seek)
 *
 * status/media/ is gitignored, so uploads never reach the website repo or a deploy.
 *
 * Path rule: the RAW request path is checked, before any URL normalisation, because WHATWG
 * URL parsing folds "../" and "%2e%2e" away and a guard that reads the normalised path
 * would never see the traversal it exists to refuse.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MAX_BYTES = 50 * 1024 * 1024;
const PREFIX = '/api/upload/mkt/';
const MEDIA_PREFIX = '/media/mkt/';
const SAFE = /^[A-Za-z0-9._/-]+$/;
const MAX_DEPTH = 8;
const MAX_SEGMENT = 120;

const TYPES = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.srt': 'text/plain; charset=utf-8', '.vtt': 'text/vtt; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.pdf': 'application/pdf',
};
const IMAGE = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const VIDEO = new Set(['.mp4', '.webm']);
const CAPTION = new Set(['.srt', '.vtt']);

/** Returns the clean relative path, or an error string. Never touches the disk. */
function sanitise(rel) {
  if (typeof rel !== 'string' || rel.length === 0) return { error: 'path required' };
  if (rel.length > 512) return { error: 'path too long' };
  if (!SAFE.test(rel)) return { error: 'path may contain only A-Z a-z 0-9 . _ / -' };
  if (rel.startsWith('/')) return { error: 'absolute path refused' };
  const parts = rel.split('/');
  if (parts.length > MAX_DEPTH) return { error: `at most ${MAX_DEPTH} levels` };
  for (const p of parts) {
    if (p === '' || p === '.' || p === '..') return { error: 'empty, "." or ".." segment refused' };
    if (p.startsWith('.')) return { error: 'hidden names refused' };
    if (p.length > MAX_SEGMENT) return { error: 'name too long' };
  }
  const ext = path.extname(parts[parts.length - 1]).toLowerCase();
  if (!TYPES[ext]) return { error: `extension not allowed, use one of ${Object.keys(TYPES).join(' ')}` };
  if (parts.length === 1 && parts[0].toLowerCase() === 'index.html') return { error: 'index.html at the top is reserved for the generated index' };
  return { rel: parts.join('/'), ext };
}

function inside(root, file) {
  return file.startsWith(root + path.sep);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');

function walk(root, dir, out) {
  let names;
  try { names = fs.readdirSync(dir); } catch (err) { if (err.code === 'ENOENT') return out; throw err; }
  for (const name of names.sort()) {
    if (name.startsWith('.')) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(root, full, out);
    else if (TYPES[path.extname(name).toLowerCase()]) out.push({ rel: path.relative(root, full).split(path.sep).join('/'), size: st.size, mtime: st.mtime });
  }
  return out;
}

/** The board's own palette: the first :root block of status/index.html, so no literal lives here. */
function boardTokens(statusDir) {
  try {
    const html = fs.readFileSync(path.join(statusDir, 'index.html'), 'utf8');
    const m = html.match(/:root\s*\{[\s\S]*?\n\s*\}/);
    return m ? m[0] : '';
  } catch (err) {
    process.stderr.write(JSON.stringify({ level: 'error', service: 'serve-board', operation: 'upload.tokens', error: err.message, timestamp: new Date().toISOString() }) + '\n');
    return '';
  }
}

function renderIndex(mktDir, statusDir) {
  const files = walk(mktDir, mktDir, []);
  const groups = new Map();
  for (const f of files) {
    const dir = f.rel.includes('/') ? f.rel.slice(0, f.rel.lastIndexOf('/')) : '(top level)';
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir).push(f);
  }
  const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
  const card = (f) => {
    const name = f.rel.slice(f.rel.lastIndexOf('/') + 1);
    const ext = path.extname(name).toLowerCase();
    const href = enc(f.rel);
    const cap = `<figcaption><a href="${href}">${esc(name)}</a> · ${mb(f.size)}</figcaption>`;
    if (IMAGE.has(ext)) return `<figure><a href="${href}"><img loading="lazy" src="${href}" alt="${esc(name)}"></a>${cap}</figure>`;
    if (VIDEO.has(ext)) {
      const stem = f.rel.slice(0, f.rel.length - ext.length);
      const vtt = files.find((x) => x.rel === stem + '.vtt');
      const track = vtt ? `<track kind="captions" srclang="en" label="Captions" src="${enc(vtt.rel)}" default>` : '';
      return `<figure class="wide"><video controls preload="metadata" src="${href}">${track}</video>${cap}</figure>`;
    }
    const kind = CAPTION.has(ext) ? 'Captions' : ext.slice(1).toUpperCase();
    return `<div class="file"><span class="kind">${esc(kind)}</span> <a href="${href}">${esc(name)}</a> · ${mb(f.size)}</div>`;
  };
  const sections = [...groups.entries()].map(([dir, list]) =>
    `<section><h2>${esc(dir)}</h2><div class="grid">${list.map(card).join('')}</div></section>`).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Marketing uploads</title>
<style>
${boardTokens(statusDir)}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;padding:32px var(--gutter) 80px}
.wrap{max-width:var(--measure);margin:0 auto}
a{color:var(--brand-accent)}a:hover{color:var(--brand-accent-hover)}
h1{font-size:24px;margin:0 0 4px}.sub{color:var(--sub);margin:0 0 20px}
h2{font-size:17px;margin:28px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:8px}
.wide{grid-column:1/-1}
img{display:block;width:100%;height:auto;border-radius:6px}
video{display:block;width:100%;max-width:960px;border-radius:6px;background:var(--brand-tile)}
figcaption{font-size:13px;color:var(--sub);word-break:break-all;margin-top:6px}
.file{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px;font-size:14px;word-break:break-all}
.kind{font-family:ui-monospace,monospace;font-size:12px;color:var(--sub)}
</style></head><body><div class="wrap">
<h1>Marketing uploads</h1>
<p class="sub">${files.length} file${files.length === 1 ? '' : 's'} uploaded by the Kiro crew. Drafts for review, nothing here is published. <a href="/#platform">Back to the board</a></p>
${sections || '<p>No uploads yet.</p>'}
</div></body></html>`;
}

function json(send, res, status, obj) {
  send(res, status, JSON.stringify(obj), 'application/json; charset=utf-8');
}

function serveFile(req, res, file, ext, log) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); return; }
    const headers = {
      'Content-Type': TYPES[ext], 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes',
      'X-Content-Type-Options': 'nosniff',
    };
    // Uploaded HTML runs in a sandbox, so a file from another machine cannot act as the board.
    if (ext === '.html') headers['Content-Security-Policy'] = 'sandbox';
    let start = 0;
    let end = st.size - 1;
    let status = 200;
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range && st.size > 0 && (range[1] || range[2])) {
      if (range[1]) { start = Number(range[1]); end = range[2] ? Math.min(Number(range[2]), st.size - 1) : st.size - 1; }
      else { start = Math.max(0, st.size - Number(range[2])); }
      if (start > end || start >= st.size) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); res.end(); return; }
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${st.size}`;
    }
    headers['Content-Length'] = st.size === 0 ? 0 : end - start + 1;
    res.writeHead(status, headers);
    if (req.method === 'HEAD' || st.size === 0) { res.end(); return; }
    fs.createReadStream(file, { start, end }).on('error', (e) => {
      log('error', 'upload.serve_failed', { error: e.message });
      res.destroy(e);
    }).pipe(res);
  });
}

function receive(req, res, send, log, mktDir, target, rel) {
  const tmp = path.join(mktDir, `.upload-${crypto.randomBytes(8).toString('hex')}.tmp`);
  let size = 0;
  let failed = false;
  const out = fs.createWriteStream(tmp, { flags: 'wx' });
  const fail = (status, error) => {
    if (failed) return;
    failed = true;
    out.destroy();
    fs.unlink(tmp, (e) => { if (e && e.code !== 'ENOENT') log('error', 'upload.tmp_cleanup', { error: e.message }); });
    log('error', 'upload.refused', { path: rel, reason: error, from: req.socket.remoteAddress });
    res.setHeader('Connection', 'close');
    json(send, res, status, { ok: false, error });
  };
  req.on('data', (c) => {
    size += c.length;
    if (size > MAX_BYTES) { fail(413, 'file larger than 50 MB'); req.unpipe(out); req.resume(); }
  });
  req.on('error', (e) => fail(400, `upload interrupted: ${e.message}`));
  out.on('error', (e) => fail(500, `write failed: ${e.message}`));
  out.on('finish', () => {
    if (failed) return;
    fs.rename(tmp, target, (e) => {
      if (e) { fail(500, `rename failed: ${e.message}`); return; }
      log('info', 'upload.stored', { path: rel, bytes: size, from: req.socket.remoteAddress });
      json(send, res, 201, { ok: true, path: rel, bytes: size, url: MEDIA_PREFIX + enc(rel) });
    });
  });
  req.pipe(out);
}

/**
 * opts: { mktDir, statusDir, tokenOk }. Returns handle(req, res, send, log), true when handled.
 */
function create(opts) {
  const mktDir = path.resolve(opts.mktDir);
  const statusDir = opts.statusDir;
  const tokenOk = opts.tokenOk;

  return function handle(req, res, send, log) {
    const raw = String(req.url || '').split('?')[0];

    if (raw.startsWith('/api/upload/')) {
      if (!raw.startsWith(PREFIX)) { json(send, res, 404, { ok: false, error: 'only /api/upload/mkt/<path>' }); return true; }
      if (req.method !== 'PUT') { json(send, res, 405, { ok: false, error: 'PUT only' }); return true; }
      if (!tokenOk(req.headers['x-channel-token'])) {
        log('error', 'upload.refused', { reason: 'bad token', from: req.socket.remoteAddress });
        res.setHeader('Connection', 'close');
        json(send, res, 401, { ok: false, error: 'bad or missing X-Channel-Token' });
        return true;
      }
      const clean = sanitise(raw.slice(PREFIX.length));
      if (clean.error) {
        log('error', 'upload.refused', { reason: clean.error, from: req.socket.remoteAddress });
        res.setHeader('Connection', 'close');
        json(send, res, 400, { ok: false, error: clean.error });
        return true;
      }
      const declared = Number(req.headers['content-length']);
      if (Number.isFinite(declared) && declared > MAX_BYTES) {
        res.setHeader('Connection', 'close');
        json(send, res, 413, { ok: false, error: 'file larger than 50 MB' });
        return true;
      }
      const target = path.resolve(mktDir, ...clean.rel.split('/'));
      if (!inside(mktDir, target)) { json(send, res, 400, { ok: false, error: 'path escapes mkt' }); return true; }
      try {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        const realRoot = fs.realpathSync(mktDir);
        const realParent = fs.realpathSync(path.dirname(target));
        if (realParent !== realRoot && !inside(realRoot, realParent)) { json(send, res, 400, { ok: false, error: 'path escapes mkt' }); return true; }
        const existing = fs.lstatSync(target, { throwIfNoEntry: false });
        if (existing && !existing.isFile()) { json(send, res, 409, { ok: false, error: 'a folder or link already has that name' }); return true; }
      } catch (err) {
        log('error', 'upload.prepare_failed', { path: clean.rel, error: err.message });
        json(send, res, 500, { ok: false, error: 'could not prepare the folder' });
        return true;
      }
      receive(req, res, send, log, mktDir, target, clean.rel);
      return true;
    }

    if (raw === '/media/mkt' || raw.startsWith(MEDIA_PREFIX)) {
      if (req.method !== 'GET' && req.method !== 'HEAD') { send(res, 405, 'Method not allowed', 'text/plain; charset=utf-8'); return true; }
      let rel;
      try { rel = decodeURIComponent(raw.slice(MEDIA_PREFIX.length)); } catch (err) { send(res, 400, 'Bad path', 'text/plain; charset=utf-8'); return true; }
      if (raw === '/media/mkt' || rel === '' || rel === 'index.html') {
        try { fs.mkdirSync(mktDir, { recursive: true }); } catch (err) { log('error', 'upload.mkdir', { error: err.message }); }
        send(res, 200, req.method === 'HEAD' ? '' : renderIndex(mktDir, statusDir), 'text/html; charset=utf-8');
        return true;
      }
      const clean = sanitise(rel);
      if (clean.error) { send(res, 404, 'Not found', 'text/plain; charset=utf-8'); return true; }
      const file = path.resolve(mktDir, ...clean.rel.split('/'));
      if (!inside(mktDir, file)) { send(res, 404, 'Not found', 'text/plain; charset=utf-8'); return true; }
      serveFile(req, res, file, clean.ext, log);
      return true;
    }
    return false;
  };
}

module.exports = { create, sanitise, renderIndex, MAX_BYTES, TYPES };
