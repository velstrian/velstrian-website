// Renders key legal markdown from crowagent-platform into status/docs/legal/*.html
// so a browser on http://localhost:8099 can open them (file:// links are blocked).
// Run: NODE_PATH=../crowagent-platform/web/node_modules node status/render-legal-docs.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(path.resolve('../crowagent-platform/web/package.json'));
const { marked } = require('marked');
const here = path.dirname(fileURLToPath(import.meta.url));
const platform = path.resolve(here, '../../crowagent-platform');
const out = path.join(here, 'docs', 'legal');
mkdirSync(out, { recursive: true });

const DOCS = [
  ['dpa', 'docs/legal/data-processing-agreement.md', 'Data Processing Agreement (draft)'],
  ['signoff-pack', 'docs/release-2.8.5/legal/DPA-AND-LIABILITY-SIGNOFF-PACK-2026-10-23.md', 'DPA and liability sign off pack'],
  ['owner-actions-guide', 'docs/release-2.8.5/OWNER-ACTIONS-GUIDE-2026-10-23.md', 'Owner actions guide'],
  ['ico-name-change-pack', 'docs/release-2.8.5/legal/ICO-NAME-CHANGE-PACK-2026-10-23.md', 'ICO name change pack'],
  ['package-8-intl-addenda', 'docs/release-2.8.5/legal/PACKAGE-8-INTL-DPA-ADDENDA-DRAFT-2026-10-23.md', 'International DPA addenda, package 8 (draft)'],
  ['data-return-and-deletion', 'docs/legal/data-return-and-deletion-policy.md', 'Data return and deletion policy (draft)'],
  ['sla', 'docs/legal/service-level-agreement.md', 'Service level agreement (draft)'],
  ['security-evidence-pack', 'docs/trust/SECURITY-EVIDENCE-PACK-2026-10-22.md', 'Security evidence pack'],
  ['ai-provider-data-map', 'docs/trust/AI-PROVIDER-DATA-MAP-2026-10-22.md', 'AI provider data map'],
  ['ai-disclaimer', 'docs/legal/AI_DISCLAIMER_DRAFT.md', 'AI output disclaimer (draft)'],
  ['sub-processors', 'docs/legal/DPA-sub-processors.md', 'DPA sub-processor schedule'],
];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const git = (...a) => execFileSync('git', ['-C', platform, ...a], { encoding: 'utf8' }).trim();
const index = [];
for (const [slug, rel, title] of DOCS) {
  const sha = git('log', '-1', '--format=%h', '--', rel);
  const dirty = git('status', '--short', '--', rel) ? ' plus uncommitted edits' : '';
  const body = marked.parse(readFileSync(path.join(platform, rel), 'utf8'), { gfm: true });
  const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title><link rel="stylesheet" href="legal.css"></head>
<body><main><p class="src"><a href="../../rebrand-velstran.html#steps">Back to the rebrand plan</a> | Rendered from <code>crowagent-platform/${esc(rel)}</code> at <code>${sha}</code>${dirty}. A read only copy, edit the source, not this page.</p>
${body}</main></body></html>
`;
  writeFileSync(path.join(out, slug + '.html'), html);
  index.push(`${slug}.html  <-  ${rel}  @ ${sha}${dirty}`);
}
console.log(index.join('\n'));
