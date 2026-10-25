/**
 * H-04 (premium audit 2026-10-25): the demo account's email address in the
 * owner column of the bid list capture is redacted with a solid bar, not a
 * blur.
 *
 * The capture harness (crowagent-platform web/e2e/product-captures/
 * website.spec.ts, hideChrome) blurs any email it finds where it stands. A
 * blur reads as a rough smudge at the size the home carousel shows it, so
 * this paints one solid rounded bar over each blurred run. Its colour is a
 * tint read from tokens.css, --c-ink-2 at 24 percent over --c-light-3 (the
 * same mix as CSS color-mix in srgb), never a typed colour. A bar in plain
 * --c-light-3 was measured nearly invisible on the row ground, so the blur's
 * halo still showed round it.
 *
 * The regions are in the capture's own pixels (2312 by 2262), measured on
 * the file of 2026-10-24. Run once after a recapture of bid-list:
 *   node scripts/redact-capture-emails.mjs
 * It rewrites the webp and the avif in place and refuses a file of any
 * other size, because the regions would then be wrong.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const tokens = fs.readFileSync(path.join(here, '..', 'src', 'styles', 'tokens.css'), 'utf8');
const hex = (name) => {
  const m = tokens.match(new RegExp(`--${name}:\\s*#([0-9a-fA-F]{6})`));
  if (!m) throw new Error(`redact-capture-emails: --${name} not found in tokens.css`);
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
};
const INK_SHARE = 0.24;
const ink = hex('c-ink-2');
const ground = hex('c-light-3');
const BAR = `rgb(${ink.map((c, i) => Math.round(c * INK_SHARE + ground[i] * (1 - INK_SHARE))).join(',')})`;

const W = 2312;
const H = 2262;
/** [left, right, centre y] of each blurred owner email, capture pixels. */
const RUNS = [
  [1440, 1955, 1142],
  [1407, 1920, 1358],
  [1344, 1857, 1574],
  [1243, 1756, 1790],
  [1383, 1890, 2006],
  [1425, 1938, 2222],
];
const BAR_H = 34;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${RUNS.map(
  ([l, r, y]) => `<rect x="${l}" y="${y - BAR_H / 2}" width="${r - l}" height="${BAR_H}" rx="${BAR_H / 2}" fill="${BAR}"/>`,
).join('')}</svg>`;

for (const [file, encode] of [
  ['bid-list.webp', (s) => s.webp({ quality: 90 })],
  ['bid-list.avif', (s) => s.avif({ quality: 60 })],
]) {
  const p = path.join(root, 'Assets', 'product-captures', 'web', file);
  const meta = await sharp(p).metadata();
  if (meta.width !== W || meta.height !== H) {
    throw new Error(`redact-capture-emails: ${file} is ${meta.width}x${meta.height}, expected ${W}x${H}. Measure the regions again.`);
  }
  const out = await encode(sharp(p).composite([{ input: Buffer.from(svg), top: 0, left: 0 }])).toBuffer();
  fs.writeFileSync(p, out);
  console.log(`redact-capture-emails: ${file} ${RUNS.length} bars in ${BAR}`);
}
