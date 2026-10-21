/**
 * check-status-pulse.mjs: the live marks hold STILL, and stay lit.
 *
 * ── WHAT THIS GATE USED TO ASSERT, AND WHY IT NOW ASSERTS THE OPPOSITE ──────
 *
 * From 2026-08-04 this gate proved that two status marks breathed and pinged on
 * an infinite loop: the current milestone dot on the /about history rail and
 * the footer's "All systems operational" dot, both wearing `fx-status-pulse`
 * from styles/effects.css.
 *
 * On 2026-10-21 the owner removed every looping decoration on the site
 * (R285-WEB-ENTERPRISE-REDESIGN-01: "remove unnecessary flashing animation ...
 * as looks very cheap"), so styles/effects.css and the recipe are gone. The two
 * marks are still the two live marks on the site, and the danger has turned
 * round: a mark that loses its animation can also lose its LIGHT, if whatever
 * replaces the recipe leaves it dimmed or hidden. So this gate keeps its place
 * in scripts/run-gates.mjs and asserts the new contract on the rendered page:
 *
 *   PRESENT   both marks exist on the route named for them
 *   STILL     neither runs an animation, with motion allowed or reduced
 *   LIT       both compute to opacity 1 and a visible size, so holding still
 *             never means going out
 *   RETIRED   no built page carries `fx-status-pulse` or any other `fx-`
 *             recipe class from the deleted effects stylesheet, so the loop
 *             cannot come back by markup alone
 *
 * PULSE_DIST overrides the directory served.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serveDist } from './lib/dist-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = process.env.PULSE_DIST || path.join(__dirname, '..', 'dist');

/** Every live mark on this site, and why it is one. */
const MARKS = [
  {
    selector: '.tl__item--now .tl__dot',
    route: '/about/',
    why: 'The current milestone on the /about history rail, the one row that is NOW.',
  },
  {
    selector: '.ca-footer-status-dot',
    route: '/about/',
    why: 'The footer live mark beside "All systems operational", on every route.',
  },
];

/** The retired recipe classes from styles/effects.css. */
const RETIRED = /class="[^"]*\b(fx-status-pulse|fx-shimmer|fx-pulse|fx-edge|fx-seam)\b[^"]*"/g;

function htmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) htmlFiles(f, out);
    else if (e.name.endsWith('.html')) out.push(f);
  }
  return out;
}

const pages = htmlFiles(DIST);
if (!pages.length) {
  console.error(`status-pulse: no built HTML under ${DIST}. Run the build first.`);
  process.exit(1);
}

const retired = [];
for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(RETIRED)) {
    retired.push(`${path.relative(DIST, f).replace(/\\/g, '/')}  .${m[1]}`);
  }
}

const results = [];
const rec = (name, pass, detail) => results.push({ name, pass, detail });
rec(`no retired fx- recipe class in ${pages.length} built page(s)`, retired.length === 0,
  retired.length ? retired.slice(0, 10).join(', ') : 'none found');

const server = await serveDist(DIST, 'status-pulse');
const browser = await chromium.launch();

for (const reducedMotion of ['no-preference', 'reduce']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion });
  const page = await ctx.newPage();
  for (const m of MARKS) {
    await page.goto(server.url(m.route), { waitUntil: 'load' });
    await page.waitForTimeout(600);
    const r = await page.evaluate((sel) => {
      const node = document.querySelector(sel);
      if (!node) return { found: false };
      const box = node.getBoundingClientRect();
      const anims = node.getAnimations({ subtree: true }).filter((a) => a.playState === 'running');
      return {
        found: true,
        anims: anims.map((a) => a.animationName || a.transitionProperty || 'animation'),
        opacity: getComputedStyle(node).opacity,
        size: `${Math.round(box.width)}x${Math.round(box.height)}`,
        visible: box.width > 0 && box.height > 0 && getComputedStyle(node).visibility !== 'hidden',
      };
    }, m.selector);
    const tag = `${m.route} ${m.selector} [${reducedMotion}]`;
    rec(`${tag} PRESENT`, r.found, r.found ? m.why : 'the element does not exist on this route');
    if (!r.found) continue;
    rec(`${tag} STILL`, r.anims.length === 0,
      r.anims.length ? `running: ${r.anims.join(', ')}` : 'no animation running');
    rec(`${tag} LIT`, r.opacity === '1' && r.visible, `opacity ${r.opacity}, box ${r.size}`);
  }
  await ctx.close();
}

await browser.close();
server.close();

const pad = (s, n) => String(s).padEnd(n);
console.log('\n' + '='.repeat(104));
console.log('THE LIVE MARKS HOLD STILL AND STAY LIT: a browser, the built site');
console.log('='.repeat(104));
let fail = 0;
for (const r of results) {
  if (!r.pass) fail++;
  console.log(`${r.pass ? ' PASS' : ' FAIL'}  ${pad(r.name, 62)} ${r.detail}`);
}
console.log('='.repeat(104));
console.log(`${results.length - fail}/${results.length} passed`);

if (fail) {
  console.error('\nstatus-pulse: a live mark is moving, dimmed, missing, or a retired fx- recipe class');
  console.error('is back in the markup. The looping status pulse was removed on 2026-10-21');
  console.error('(R285-WEB-ENTERPRISE-REDESIGN-01) and the marks report their state by colour and');
  console.error('by the sentence beside them, holding still.\n');
  process.exit(1);
}
console.log('\n  clean: both live marks are present, hold still with or without reduced motion, and');
console.log('  stay fully lit, and no built page carries a retired fx- recipe class.');
process.exit(0);
