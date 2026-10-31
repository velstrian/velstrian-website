'use strict';
/**
 * channel.js - append only message channels served by serve-board.js on :8099.
 *
 * Why: a team member's Kiro (on another machine) and Claude (on this machine) need one
 * shared file to talk through until the portal database move (R29-PORTAL-OWN-SUPABASE-01)
 * is done. This machine has no SMB share and no admin rights, and 8099 is already open on
 * the office network, so the board server carries the channel.
 *
 *   GET  /channels/<name>.md                 the whole conversation (plain file, readable by anyone on the LAN)
 *   GET  /api/channel/<name>?since=<n>       JSON, messages with number > n
 *   POST /api/channel/<name>                 JSON {"author":"kiro"|"claude","body":"..."}
 *                                            header X-Channel-Token: <token>
 *
 * The token lives OUTSIDE the served folder (~/.velstrian/channel-token), so GET can never
 * return it. Writes are append only: nothing can edit or delete an earlier message.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const CHANNEL_DIR = path.join(__dirname, 'channels');
const TOKEN_FILE = path.join(os.homedir(), '.velstrian', 'channel-token');
const CHANNELS = new Set(['kiro-portal-db']);
const AUTHORS = new Set(['kiro', 'claude']);
const MAX_BODY = 32 * 1024;
const HEADER_RE = /^### #(\d+) · ([A-Z]+) · (.+)$/gm;

function readToken() {
  try {
    return fs.readFileSync(TOKEN_FILE, 'utf8').trim();
  } catch (err) {
    process.stderr.write(JSON.stringify({ level: 'error', service: 'serve-board', operation: 'channel.token_missing', error: err.message, timestamp: new Date().toISOString() }) + '\n');
    return '';
  }
}

function tokenOk(given) {
  const expected = readToken();
  if (!expected || typeof given !== 'string') return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function fileFor(name) {
  return path.join(CHANNEL_DIR, `${name}.md`);
}

function parse(text) {
  const out = [];
  const heads = [...text.matchAll(HEADER_RE)];
  heads.forEach((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < heads.length ? heads[i + 1].index : text.length;
    const body = text.slice(start, end).replace(/\n---\s*$/, '').trim();
    out.push({ n: Number(m[1]), author: m[2].toLowerCase(), at: m[3], body });
  });
  return out;
}

let queue = Promise.resolve();
function append(name, author, body) {
  queue = queue.then(() => {
    const file = fileFor(name);
    const text = fs.readFileSync(file, 'utf8');
    const msgs = parse(text);
    const n = msgs.length ? msgs[msgs.length - 1].n + 1 : 1;
    const at = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    const block = `\n---\n\n### #${n} · ${author.toUpperCase()} · ${at}\n\n${body.trim()}\n`;
    fs.appendFileSync(file, block, 'utf8');
    return { ok: true, n, at };
  });
  return queue;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY + 1024) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/** Returns true when it handled the request. */
function handle(req, res, url, send, log) {
  const m = url.pathname.match(/^\/api\/channel\/([a-z0-9-]+)$/);
  if (!m) return false;
  const json = 'application/json; charset=utf-8';
  const name = m[1];
  if (!CHANNELS.has(name)) { send(res, 404, JSON.stringify({ ok: false, error: 'unknown channel' }), json); return true; }

  if (req.method === 'GET') {
    const since = Number(url.searchParams.get('since') || 0);
    const msgs = parse(fs.readFileSync(fileFor(name), 'utf8')).filter((x) => x.n > since);
    send(res, 200, JSON.stringify({ ok: true, messages: msgs }), json);
    return true;
  }
  if (req.method !== 'POST') { send(res, 405, JSON.stringify({ ok: false, error: 'GET or POST' }), json); return true; }
  if (!tokenOk(req.headers['x-channel-token'])) {
    log('error', 'channel.refused', { channel: name, reason: 'bad token', from: req.socket.remoteAddress });
    send(res, 401, JSON.stringify({ ok: false, error: 'bad or missing X-Channel-Token' }), json);
    return true;
  }
  readBody(req).then((raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch (err) { send(res, 400, JSON.stringify({ ok: false, error: 'body must be JSON' }), json); return; }
    const author = String(msg.author || '').toLowerCase();
    const body = typeof msg.body === 'string' ? msg.body : '';
    if (!AUTHORS.has(author)) { send(res, 400, JSON.stringify({ ok: false, error: 'author must be kiro or claude' }), json); return; }
    if (!body.trim() || body.length > MAX_BODY) { send(res, 400, JSON.stringify({ ok: false, error: `body required, max ${MAX_BODY} chars` }), json); return; }
    if (/^### #\d+ /m.test(body)) { send(res, 400, JSON.stringify({ ok: false, error: 'body must not contain a message header line' }), json); return; }
    return append(name, author, body).then((r) => {
      log('info', 'channel.append', { channel: name, author, n: r.n, from: req.socket.remoteAddress });
      send(res, 200, JSON.stringify(r), json);
    });
  }).catch((err) => {
    log('error', 'channel.append_failed', { channel: name, error: err.message });
    send(res, 500, JSON.stringify({ ok: false, error: err.message }), json);
  });
  return true;
}

module.exports = { handle, parse, CHANNEL_DIR };
