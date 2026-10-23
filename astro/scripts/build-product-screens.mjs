#!/usr/bin/env node
/**
 * build-product-screens.mjs (R285-WEB-REAL-SCREENSHOTS-01, D303 regenerable media).
 *
 * The 21 Figma screens and panels (R285-WEB-FIGMA-SCREENS-01) are exported as PNG masters into
 * Assets/product-screens/ and listed in src/data/product-screens.json. A PNG master is too heavy to
 * serve, so this writes a WebP and an AVIF of each into Assets/product-screens/web/<master name>.webp|avif,
 * which is what src/data/product-captures.ts serves for a slot with no real capture.
 *
 * Regenerate after a new Figma export (a logo or design change): one command, from astro/:
 *   node scripts/build-product-screens.mjs
 * It prints each file and its size, and fails if any served file is over the single image budget
 * in check-budgets.js (250 KB), so a heavy export is caught here rather than at the gate.
 */
import { mkdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..', '..');
const list = JSON.parse(readFileSync(path.join(here, '..', 'src', 'data', 'product-screens.json'), 'utf8'));
const out = path.join(repo, 'Assets', 'product-screens', 'web');
const LIMIT = 250 * 1024;
mkdirSync(out, { recursive: true });

let over = 0;
for (const item of list.items) {
  const master = path.join(repo, item.file);
  // Named after the master (screen-... or panel-...): two items share the slug requirement-pack.
  const base = path.join(out, path.basename(item.file, '.png'));
  await sharp(master).webp({ quality: 82 }).toFile(`${base}.webp`);
  await sharp(master).avif({ quality: 55 }).toFile(`${base}.avif`);
  const w = statSync(`${base}.webp`).size;
  const a = statSync(`${base}.avif`).size;
  if (w > LIMIT || a > LIMIT) over += 1;
  console.log(`${item.id.padEnd(4)} ${item.slug.padEnd(22)} webp ${(w / 1024).toFixed(1).padStart(6)} KB  avif ${(a / 1024).toFixed(1).padStart(6)} KB`);
}
if (over > 0) {
  console.error(`${over} file(s) over the 250 KB single image budget`);
  process.exit(1);
}
