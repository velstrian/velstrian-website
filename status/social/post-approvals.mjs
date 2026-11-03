#!/usr/bin/env node
/**
 * post-approvals.mjs: the approval gate for Velstrian social posts.
 *
 * Row R29-GA-SOCIAL-LAUNCH-01. D533: free only, every post approved by email
 * before it is published. D535: the approvers. This script only PREPARES and
 * TRACKS. It never posts, never sends email and runs only when someone runs it
 * (no timer, no cloud job). Publishing is done by hand in the browser.
 *
 * An approval binds to a sha256 of the exact post text. If the text in the
 * posts file changes after approval, the approval no longer counts.
 *
 * Commands (run from anywhere):
 *   node post-approvals.mjs list
 *   node post-approvals.mjs show <id>
 *   node post-approvals.mjs approve <id> --by <email> --at <ISO time> --message-id <gmail message id>
 *   node post-approvals.mjs reject <id> --by <email> --at <ISO time> --message-id <id> [--note <text>]
 *   node post-approvals.mjs publishable
 *   node post-approvals.mjs published <id> --url <post url> [--at <ISO time>]
 *   node post-approvals.mjs render
 *   options: --posts <file> to use another posts file
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(HERE, 'approvals.json');
const DEFAULT_POSTS = join(HERE, 'ga-launch-posts-2026-11-03.md');
const HTML_FILE = join(HERE, 'ga-launch-approval.html');

/** D535: the approver and the two backup approvers. Nobody else can approve. */
export const APPROVERS = [
  'aparajita.parihar@gmail.com',
  'crowagent.platform@gmail.com',
  'monikaparul.singh@gmail.com',
];

export function hashText(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/** Parse "## <id> | <channel> | <label>" sections, their Key: value lines and the ```text body. */
export function parsePosts(markdown) {
  const posts = [];
  const sections = markdown.split(/^## /m).slice(1);
  for (const section of sections) {
    const head = section.split('\n', 1)[0];
    const m = head.match(/^(P\d+[a-z]?)\s*\|\s*([\w-]+)\s*\|\s*(.+)$/);
    if (!m) continue;
    const fields = {};
    for (const line of section.split('\n').slice(1)) {
      if (line.startsWith('```')) break;
      const f = line.match(/^(Account|Format|Image|Sources):\s*(.*)$/);
      if (f) fields[f[1].toLowerCase()] = f[2].trim();
    }
    const body = section.match(/```text\n([\s\S]*?)\n```/);
    if (!body) throw new Error(`post ${m[1]} has no \`\`\`text body`);
    posts.push({ id: m[1], channel: m[2], label: m[3].trim(), ...fields, text: body[1], hash: hashText(body[1]) });
  }
  const ids = posts.map((p) => p.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) throw new Error(`duplicate post id ${dup}`);
  return posts;
}

export function loadState(file = STATE_FILE) {
  if (!existsSync(file)) return { schema: 1, posts: {} };
  return JSON.parse(readFileSync(file, 'utf8'));
}

function saveState(state, file = STATE_FILE) {
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

/** The single rule: approved, by a named approver, with when and the email message id, for THIS text. */
export function approvalProblem(post, record) {
  if (!record || record.decision !== 'approved') return 'no approval recorded';
  if (!APPROVERS.includes(String(record.by).toLowerCase())) return `approver ${record.by} is not on the D535 list`;
  if (!record.at || Number.isNaN(Date.parse(record.at))) return 'approval has no valid time';
  if (!record.messageId) return 'approval has no email message id';
  if (record.hash !== post.hash) return 'text changed after approval, approve again';
  return null;
}

function statusOf(post, state) {
  const r = state.posts[post.id];
  if (r?.publishedUrl) return 'published';
  if (r?.decision === 'rejected' && r.hash === post.hash) return 'rejected';
  return approvalProblem(post, r) ? 'awaiting approval' : 'approved, ready to publish';
}

function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith('--')) {
      flags[args[i].slice(2)] = args[i + 1];
      i += 1;
    }
  }
  return flags;
}

function need(flags, names) {
  const missing = names.filter((n) => !flags[n]);
  if (missing.length) throw new Error(`missing ${missing.map((n) => `--${n}`).join(', ')}`);
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderHtml(posts, state) {
  const cards = posts.map((p) => `
  <article>
    <h2>${escapeHtml(p.id)}: ${escapeHtml(p.label)}</h2>
    <p class="meta"><strong>Status:</strong> ${escapeHtml(statusOf(p, state))}</p>
    <p class="meta"><strong>Account:</strong> ${escapeHtml(p.account ?? '')}</p>
    <p class="meta"><strong>Format:</strong> ${escapeHtml(p.format ?? '')}</p>
    <p class="meta"><strong>Image:</strong> ${escapeHtml(p.image ?? '')}</p>
    <pre>${escapeHtml(p.text)}</pre>
    <p class="meta"><strong>Where each fact comes from:</strong> ${escapeHtml(p.sources ?? '')}</p>
    <p class="meta">${p.text.length} characters</p>
  </article>`).join('\n');
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Launch posts approval</title>
<style>
  :root { color-scheme: light dark; }
  body { background: Canvas; color: CanvasText; font: 16px/1.55 system-ui, sans-serif; margin: 0; padding: 16px; }
  main { max-width: 760px; margin: 0 auto; }
  article { border: 1px solid GrayText; border-radius: 8px; padding: 16px; margin: 0 0 20px; }
  h1 { font-size: 1.6rem; } h2 { font-size: 1.15rem; margin: 0 0 8px; }
  .meta { color: GrayText; margin: 4px 0; font-size: 0.92rem; overflow-wrap: anywhere; }
  pre { white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; border-left: 3px solid GrayText; padding: 8px 12px; margin: 12px 0; }
</style>
</head>
<body>
<main>
  <h1>Velstrian launch posts for your approval</h1>
  <p>Row R29-GA-SOCIAL-LAUNCH-01. ${posts.length} posts across ${new Set(posts.map((p) => p.channel)).size} channels. Nothing is posted until it is approved by email (D533). Reply to the approval email with "approved" or with your edits, per post id.</p>
  <p>Every fact comes from the website facts file or the pricing source, listed under each post. Generated by post-approvals.mjs from ga-launch-posts-2026-11-03.md, do not edit by hand.</p>
${cards}
</main>
</body>
</html>
`;
}

function main(argv) {
  const [cmd, ...rest] = argv;
  const flags = parseFlags(rest);
  const id = rest[0] && !rest[0].startsWith('--') ? rest[0] : undefined;
  const posts = parsePosts(readFileSync(flags.posts ?? DEFAULT_POSTS, 'utf8'));
  const state = loadState();
  const find = () => {
    const p = posts.find((x) => x.id === id);
    if (!p) throw new Error(`no post ${id}, known: ${posts.map((x) => x.id).join(', ')}`);
    return p;
  };

  switch (cmd) {
    case 'list':
      for (const p of posts) console.log(`${p.id.padEnd(5)} ${p.channel.padEnd(18)} ${String(p.text.length).padStart(5)} chars  ${statusOf(p, state)}`);
      return 0;
    case 'show': {
      const p = find();
      console.log(`${p.id} ${p.label}\n${p.account}\nImage: ${p.image}\n\n${p.text}`);
      return 0;
    }
    case 'approve':
    case 'reject': {
      const p = find();
      need(flags, ['by', 'at', 'message-id']);
      const by = flags.by.toLowerCase();
      if (!APPROVERS.includes(by)) throw new Error(`${flags.by} is not an approver (D535): ${APPROVERS.join(', ')}`);
      if (Number.isNaN(Date.parse(flags.at))) throw new Error(`--at ${flags.at} is not a valid time`);
      state.posts[p.id] = {
        decision: cmd === 'approve' ? 'approved' : 'rejected',
        by, at: flags.at, messageId: flags['message-id'], hash: p.hash,
        ...(flags.note ? { note: flags.note } : {}),
        recordedAt: new Date().toISOString(),
      };
      saveState(state);
      console.log(`${p.id} ${state.posts[p.id].decision} by ${by}`);
      return 0;
    }
    case 'publishable': {
      const ready = posts.filter((p) => !approvalProblem(p, state.posts[p.id]) && !state.posts[p.id].publishedUrl);
      if (!ready.length) console.log('nothing is publishable yet');
      for (const p of ready) console.log(`${p.id} ${p.label}`);
      return 0;
    }
    case 'published': {
      const p = find();
      need(flags, ['url']);
      const problem = approvalProblem(p, state.posts[p.id]);
      if (problem) {
        console.error(`refused: ${p.id} ${problem}`);
        return 2;
      }
      state.posts[p.id].publishedUrl = flags.url;
      state.posts[p.id].publishedAt = flags.at ?? new Date().toISOString();
      saveState(state);
      console.log(`${p.id} recorded as published at ${flags.url}`);
      return 0;
    }
    case 'render':
      writeFileSync(HTML_FILE, renderHtml(posts, state), 'utf8');
      console.log(`wrote ${HTML_FILE}`);
      return 0;
    default:
      console.error('usage: node post-approvals.mjs list | show <id> | approve <id> --by --at --message-id | reject <id> --by --at --message-id | publishable | published <id> --url | render');
      return 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (err) {
    console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
