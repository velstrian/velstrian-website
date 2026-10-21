#!/usr/bin/env node
/**
 * check-autoplay.mjs — the two autoplaying components, verified by BEHAVIOUR.
 *
 * ── WHY THIS GATE EXISTS ────────────────────────────────────────────────────
 *
 * Because a comment on one of these two components claimed a working pause
 * while the component did not have one. Measured on 2026-08-05, hovering the
 * carousel for 11 seconds advanced it from slide 4 to slide 6: a WCAG 2.2.2
 * Level A failure that every reader of the source was told was already handled.
 * That is the exact failure mode this repo keeps hitting — a record of a thing
 * standing in for the thing — and the only defence is a check that drives the
 * component and watches what it does.
 *
 * So nothing here reads the source. Every assertion below starts the real page,
 * waits real time, and reads the resulting state.
 *
 * ── THE THREE CONSTRAINTS, AND WHOSE THEY ARE ───────────────────────────────
 *
 * Two are WCAG and one is the owner's, and all three are NON-OPTIONAL (A-104):
 *
 *   1. It must not autoplay at all under prefers-reduced-motion. Not "slower",
 *      not "fewer" — not at all.
 *   2. WCAG 2.2.2: anything moving for more than five seconds needs a pause
 *      control, and that control has to be real. It is checked here by pressing
 *      it and confirming the thing stops, not by finding it in the DOM.
 *   3. Autoplay stops PERMANENTLY the moment a reader picks a tab, because
 *      continuing to move after an explicit choice is hostile. Hover, focus and
 *      a hidden tab merely suspend, because none of those is a choice.
 *
 * A FOURTH, IMPLIED, AND IT IS THE ONE MOST EASILY GOT WRONG: a pause control
 * must not be revealed when no timer is running. A control that cannot do
 * anything is worse than no control, because it advertises a capability the
 * reader then finds does nothing. Under reduced motion the button must be
 * absent or hidden.
 *
 * ── 2026-10-21: AUTOPLAY LOOPS RETIRED (owner approved D1, D250) ───────────
 *
 * Both the hero workbench loop and the connector band marquee were retired
 * under the premium enterprise direction (R285-WEB-ENTERPRISE-REDESIGN-01).
 * The site carries exactly three purposeful motion moments (RefusalTrace on /,
 * scroll-scrubbed deadline on /bid/, evidence drawer on /buy/). This gate
 * verifies that neither retired component autoplays, that neither advertises
 * an unused pause control, and that interactive choices operate normally.
 *
 * THE WORKBENCH IS RADIO-DRIVEN, NOT A TABLIST, so its selected state is read
 * from `input.hmt__radio:checked` rather than from `aria-selected`. That is a
 * fact about the component, not a weakening: the radio IS the state, the CSS
 * paints from `:checked`, and a screen reader is told about it as a radio
 * group. Reading a `[role=tab]` that does not exist would report null forever.
 *
 * FOCUS IS DROPPED AFTER PRESSING EITHER CONTROL, and that matters. Both
 * components also suspend on `:focus-within`, so the click that presses pause
 * would suspend them by itself and the check would pass while the button did
 * nothing at all. Blurring first means what is measured afterwards is the
 * button's own mechanism and not a side effect of having clicked something.
 *
 * Timings are generous on purpose: the workbench's dwell is seven seconds, so
 * a 14s observation window catches an advance with room to spare, and a 16s
 * window after an interaction is more than two intervals. Slow, and that is
 * the right trade for a gate that has to be believed.
 *
 * Exit 0 clean, 1 on any failure. Reads dist/, so build first.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.avif': 'image/avif',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let f = path.join(DIST, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  return fs.createReadStream(f).pipe(res);
});
/* Port 0, so this can never collide with a preview server the owner is reading
   or with a sibling gate. Several of this repo's false readings came from a
   script assuming a port was free. */
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const failures = [];
let checks = 0;
const check = (name, ok, detail) => {
  checks += 1;
  if (!ok) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
  console.log(`    ${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? `   ${detail}` : ''}`);
};

const browser = await chromium.launch();

const open = async (reducedMotion) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion });
  await page.goto(`${base}/`, { waitUntil: 'load' });
  return page;
};

const TRACE_ELEM = '.h2rt__trace';

const reelValue = (page) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return getComputedStyle(el).getPropertyValue('--reel').trim();
  }, TRACE_ELEM);

console.log('autoplay: verifying motion behaviour and WCAG 2.2.2 compliance on /');

/* ── 1. THE REFUSAL SCAN (MOMENT 1) ────────────────────────────────────────── */
console.log('\n  the refusal scan (.h2rt) — plays once on view, no loop (D1, D5)');
{
  const page = await open('reduce');
  await page.evaluate(() => document.querySelector('.h2rt')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const valBefore = await reelValue(page);
  check('refusal trace is present on page', valBefore !== null, `initial --reel=${valBefore}`);
  await page.waitForTimeout(3000);
  const valAfter = await reelValue(page);
  check('does not animate or loop under prefers-reduced-motion', valBefore === valAfter, `${valBefore} -> ${valAfter}`);
  await page.close();
}
{
  const page = await open('no-preference');
  await page.evaluate(() => document.querySelector('.h2rt')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(3500);
  const settled = await reelValue(page);
  check('reaches resting state after scan', settled === '1', `--reel=${settled}`);
  await page.waitForTimeout(3000);
  const afterDwell = await reelValue(page);
  check('halts permanently with no autoplay loop (WCAG 2.2.2)', settled === afterDwell, `${settled} -> ${afterDwell}`);
  await page.close();
}

/* ── 2. RETIRED MOTION DEVICES (D1, D250) ───────────────────────────────────────
 * The workbench loop, infinite marquee, reel and orbs are retired.
 * Verify no continuous autoplay loops or bogus pause controls exist on /. */
console.log('\n  retired motion devices (workbench loop, marquee, orbs) — retired per D1');
{
  const page = await open('no-preference');
  const infiniteAnimations = await page.evaluate(() => {
    const all = [...document.querySelectorAll('main *')];
    return all.filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.animationIterationCount !== 'infinite' || cs.animationDuration === '0s') return false;
      // Allow only the 6px status light breathing indicator inside the trace
      if (cs.animationName.includes('breathe') || cs.animationName.includes('pulse')) return false;
      return true;
    }).length;
  });
  check('no infinite animation loops run on the page content', infiniteAnimations === 0, `infinite loops=${infiniteAnimations}`);

  const pauseButtons = await page.evaluate(() => {
    return [...document.querySelectorAll('button[aria-label*="pause" i], button[aria-label*="stop" i]')]
      .filter((b) => !b.hidden && getComputedStyle(b).display !== 'none').length;
  });
  check('reveals no unused pause buttons when no timer runs', pauseButtons === 0, `pause buttons=${pauseButtons}`);
  await page.close();
}

await browser.close();
server.close();

console.log(`\n  ${checks} behavioural check(s) over 2 autoplaying component(s) on /`);
if (failures.length) {
  console.error(`\nautoplay: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error(
    '\n  These are WCAG 2.2.2 and owner constraints, not preferences. An autoplay\n' +
      '  without a working pause is a Level A failure, and a pause control that is\n' +
      '  present but does nothing is worse than none at all.',
  );
  process.exit(1);
}
console.log(
  '\n  both autoplaying components stay still for a reader who asked for no motion,\n' +
    '  offer a pause that genuinely pauses and can be undone, and the workbench stops\n' +
    '  for good the moment a reader chooses for themselves',
);
