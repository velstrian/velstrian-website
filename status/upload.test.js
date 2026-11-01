'use strict';
// [R29-BOARD-MKT-UPLOAD-01] node --test status/upload.test.js
// Drives the real upload handler over a real socket with RAW request paths, because a
// guard that only ever sees a normalised URL is never shown the traversal it refuses.
const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const upload = require('./upload.js');

const TOKEN = 'test-token-' + crypto.randomBytes(6).toString('hex');
const base = fs.mkdtempSync(path.join(os.tmpdir(), 'mkt-upload-'));
const statusDir = path.join(base, 'status');
const mktDir = path.join(statusDir, 'media', 'mkt');
fs.mkdirSync(mktDir, { recursive: true });
fs.writeFileSync(path.join(statusDir, 'index.html'), '<style>\n  :root{\n    --bg:#000;\n  }\n</style>');
fs.writeFileSync(path.join(statusDir, 'secret.txt'), 'outside');

const handle = upload.create({ mktDir, statusDir, tokenOk: (t) => t === TOKEN });
const send = (res, status, body, type) => { res.writeHead(status, { 'Content-Type': type }); res.end(body); };
const log = () => {};
const server = http.createServer((req, res) => {
  if (!handle(req, res, send, log)) send(res, 404, 'fallthrough', 'text/plain');
});
let port;

test.before(() => new Promise((r) => server.listen(0, '127.0.0.1', () => { port = server.address().port; r(); })));
test.after(() => { server.close(); fs.rmSync(base, { recursive: true, force: true }); });

function req(method, rawPath, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: '127.0.0.1', port, method, path: rawPath, headers }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}
const put = (p, body, token = TOKEN) => req('PUT', '/api/upload/mkt/' + p, body, token === null ? {} : { 'X-Channel-Token': token });

function listAll(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? listAll(path.join(dir, d.name)) : [path.join(dir, d.name)]));
}

test('a good upload is stored and served back byte identical', async () => {
  const bytes = crypto.randomBytes(300000);
  const r = await put('launch/hero.png', bytes);
  assert.strictEqual(r.status, 201, r.body.toString());
  assert.strictEqual(JSON.parse(r.body).bytes, bytes.length);
  const g = await req('GET', '/media/mkt/launch/hero.png');
  assert.strictEqual(g.status, 200);
  assert.strictEqual(g.headers['content-type'], 'image/png');
  assert.ok(g.body.equals(bytes), 'served bytes differ from uploaded bytes');
  const ranged = await req('GET', '/media/mkt/launch/hero.png', null, { Range: 'bytes=10-19' });
  assert.strictEqual(ranged.status, 206);
  assert.ok(ranged.body.equals(bytes.subarray(10, 20)));
});

test('the index lists files grouped by folder, images inline, videos with a player, captions linked', async () => {
  await put('reels/clip.mp4', Buffer.from('fake mp4'));
  await put('reels/clip.vtt', Buffer.from('WEBVTT\n'));
  await put('copy/post.md', Buffer.from('# hi'));
  for (const p of ['/media/mkt/', '/media/mkt/index.html']) {
    const r = await req('GET', p);
    assert.strictEqual(r.status, 200);
    const html = r.body.toString();
    assert.match(html, /<h2>launch<\/h2>/);
    assert.match(html, /<h2>reels<\/h2>/);
    assert.match(html, /<img[^>]+src="launch\/hero\.png"/);
    assert.match(html, /<video controls[^>]+src="reels\/clip\.mp4"><track kind="captions"[^>]+src="reels\/clip\.vtt"/);
    assert.match(html, /<a href="reels\/clip\.vtt">clip\.vtt<\/a>/);
    assert.match(html, /<a href="copy\/post\.md">post\.md<\/a>/);
    assert.match(html, /--bg:#000/, 'board tokens not inlined');
  }
});

test('uploaded html is served sandboxed', async () => {
  await put('pages/flyer.html', Buffer.from('<p>x</p>'));
  const r = await req('GET', '/media/mkt/pages/flyer.html');
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.headers['content-security-policy'], 'sandbox');
});

test('a missing or wrong token is refused and nothing is written', async () => {
  const before = listAll(mktDir).length;
  assert.strictEqual((await put('a.png', Buffer.from('x'), null)).status, 401);
  const wrong = await put('a.png', Buffer.from('x'), 'nope');
  assert.strictEqual(wrong.status, 401);
  assert.ok(!wrong.body.toString().includes(TOKEN), 'token leaked in a response');
  assert.strictEqual(listAll(mktDir).length, before);
});

test('path traversal and unsafe paths are refused before any write', async () => {
  const bad = [
    '../secret.png', '../../status/x.png', 'a/../../x.png', 'a/./b.png', '..%2fx.png', '%2e%2e/x.png',
    '/etc/x.png', '//x.png', 'a\\..\\x.png', 'C:/x.png', 'C:x.png', 'a%00.png', 'a%20b.png', 'a//b.png',
    '.hidden.png', 'index.html', 'a/.git/x.png',
  ];
  for (const p of bad) {
    const r = await put(p, Buffer.from('evil'));
    assert.ok(r.status === 400, `${p} gave ${r.status}`);
  }
  assert.strictEqual(fs.readFileSync(path.join(statusDir, 'secret.txt'), 'utf8'), 'outside');
  assert.ok(!fs.existsSync(path.join(statusDir, 'media', 'secret.png')));
  assert.ok(!fs.existsSync(path.join(base, 'x.png')));
  assert.ok(listAll(base).every((f) => f.startsWith(mktDir + path.sep) || f.startsWith(path.join(statusDir, 'index.html')) || f.endsWith('secret.txt')));
});

test('bad extensions are refused', async () => {
  for (const p of ['x.exe', 'x.js', 'x.svg', 'x.png.exe', 'x', 'x.PNG.bat', 'noext/']) {
    assert.strictEqual((await put(p, Buffer.from('x'))).status, 400, p);
  }
  assert.strictEqual((await put('UPPER.PNG', Buffer.from('x'))).status, 201);
});

test('more than 50 MB is refused and leaves no temp file', async () => {
  const declared = await req('PUT', '/api/upload/mkt/big.mp4', null, { 'X-Channel-Token': TOKEN, 'Content-Length': String(upload.MAX_BYTES + 1) }).catch((e) => ({ status: 'socket:' + e.code }));
  assert.ok(declared.status === 413 || String(declared.status).startsWith('socket:'), String(declared.status));
  const chunked = await new Promise((resolve) => {
    const r = http.request({ host: '127.0.0.1', port, method: 'PUT', path: '/api/upload/mkt/big2.mp4', headers: { 'X-Channel-Token': TOKEN, 'Transfer-Encoding': 'chunked' } }, (res) => {
      res.resume(); res.on('end', () => resolve(res.statusCode));
    });
    r.on('error', () => resolve('reset'));
    const chunk = Buffer.alloc(1024 * 1024);
    let sent = 0;
    const pump = () => { while (sent < 52) { sent += 1; if (!r.write(chunk)) { r.once('drain', pump); return; } } r.end(); };
    pump();
  });
  assert.ok(chunked === 413 || chunked === 'reset', String(chunked));
  await new Promise((r) => setTimeout(r, 200));
  assert.ok(!fs.existsSync(path.join(mktDir, 'big.mp4')) && !fs.existsSync(path.join(mktDir, 'big2.mp4')));
  assert.deepStrictEqual(fs.readdirSync(mktDir).filter((n) => n.endsWith('.tmp')), []);
});

test('only PUT uploads, and other upload roots do not exist', async () => {
  assert.strictEqual((await req('POST', '/api/upload/mkt/a.png', 'x', { 'X-Channel-Token': TOKEN })).status, 405);
  assert.strictEqual((await req('PUT', '/api/upload/other/a.png', 'x', { 'X-Channel-Token': TOKEN })).status, 404);
});
