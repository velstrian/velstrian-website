#!/usr/bin/env node
/**
 * serve-board.js — the :8099 board server started by Velstrian-Board.ps1.
 *
 * Serves the status/ folder like http-server, plus POST /api/rebuild, which the
 * board's "Refresh now" and "Auto refresh" buttons call (index.html). A rebuild runs
 * the documented sequence: build-platform-board.js, then the platform repo's
 * assign-phases.mjs (writes phase-breakdown.json), then build-platform-board.js again.
 *
 * Listens on every interface like http-server did: team members open briefs at the office
 * network address (192.168.1.63:8099). No dependencies. Usage: node status/serve-board.js --port=8099
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const STATUS_DIR = __dirname;
const WEBSITE_DIR = path.resolve(STATUS_DIR, '..');
const PLATFORM_DIR = path.resolve(WEBSITE_DIR, '..', 'velstrian-platform');
const portArg = process.argv.find((a) => a.startsWith('--port='));
const PORT = Number(portArg ? portArg.split('=')[1] : 8099);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.cjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.woff2': 'font/woff2', '.woff': 'font/woff',
};

function log(level, operation, extra) {
  const line = JSON.stringify({ level, service: 'serve-board', operation, ...extra, timestamp: new Date().toISOString() });
  (level === 'error' ? process.stderr : process.stdout).write(line + '\n');
}

function run(file, args, cwd) {
  return new Promise((resolve, reject) => {
    execFile(process.execPath, [file, ...args], { cwd, timeout: 180000, maxBuffer: 16 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(new Error(`${path.basename(file)} failed: ${(stderr || err.message).trim().split('\n').slice(-3).join(' ')}`));
      else resolve(stdout);
    });
  });
}

let rebuilding = null;
async function rebuild() {
  const started = Date.now();
  const board = path.join(STATUS_DIR, 'build-platform-board.js');
  await run(board, [], WEBSITE_DIR);
  const phases = path.join(PLATFORM_DIR, 'scripts', 'assign-phases.mjs');
  if (fs.existsSync(phases)) {
    await run(phases, [path.join(STATUS_DIR, 'platform.json')], PLATFORM_DIR);
    await run(board, [], WEBSITE_DIR);
  }
  return { ok: true, at: new Date().toISOString(), ms: Date.now() - started };
}

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/rebuild') {
    if (req.method !== 'POST') return send(res, 405, JSON.stringify({ ok: false, error: 'POST only' }), TYPES['.json']);
    rebuilding = rebuilding || rebuild().finally(() => { rebuilding = null; });
    rebuilding.then(
      (result) => { log('info', 'rebuild', { ms: result.ms }); send(res, 200, JSON.stringify(result), TYPES['.json']); },
      (err) => { log('error', 'rebuild', { error: err.message }); send(res, 500, JSON.stringify({ ok: false, error: err.message }), TYPES['.json']); },
    );
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', TYPES['.txt']);

  let rel;
  try { rel = decodeURIComponent(url.pathname); } catch (err) { return send(res, 400, 'Bad path', TYPES['.txt']); }
  let file = path.resolve(STATUS_DIR, '.' + rel);
  if (file !== STATUS_DIR && !file.startsWith(STATUS_DIR + path.sep)) return send(res, 403, 'Forbidden', TYPES['.txt']);

  fs.stat(file, (statErr, st) => {
    if (!statErr && st.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (readErr, data) => {
      if (readErr) return send(res, 404, 'Not found', TYPES['.txt']);
      send(res, 200, req.method === 'HEAD' ? '' : data, TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
    });
  });
});

server.on('error', (err) => { log('error', 'listen', { error: err.message, port: PORT }); process.exit(1); });
server.listen(PORT, () => log('info', 'listen', { url: `http://localhost:${PORT}/` }));
