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
 * ── 2026-10-22: ONE LOOP BACK, WITH ITS PAUSE (owner decision D293) ─────────
 *
 * The hero aurora keeps moving. Section 2 below no longer asserts "no loop at
 * all": it asserts that every loop sits in a hero band, that each such band
 * carries a pause control a keyboard can reach, that pressing it stops every
 * loop and lasts the session, and that reduced motion shows neither.
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
/* AUTOPLAY_DIST points the gate at another build, which is how its red
   proofs run against a mutated copy without touching dist/. */
const DIST = process.env.AUTOPLAY_DIST || path.join(__dirname, '..', 'dist');
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

console.log('autoplay: verifying motion behaviour and WCAG 2.2.2 compliance on /');

/* ── 1. THE VERSION 3 MOTION MOMENTS (rewritten 2026-10-21) ────────────────
 *
 * R285-WEB-ENTERPRISE-REDESIGN-01, strategy 0.8 "Motion". The home page now
 * moves in four ways, and every one is driven here and read back:
 *
 *   the refusal check   [data-refusal]: plays once when it reaches mid
 *                       window and ends on the finished frame (no data-play)
 *   product sequences   .ea-seq: the hero card plays once on load, the
 *                       capability cards once in view, each ending at
 *                       data-seq-state="run" and never cycling back
 *   the carousel        [data-car]: NO AUTOPLAY. It stays on screen 1 for
 *                       longer than WCAG 2.2.2's five seconds untouched, and
 *                       moves only when a reader presses next
 *   reduced motion      nothing is armed at all: no hidden step, no hidden
 *                       section, no refusal mid frame
 *
 * The version 2 RefusalTrace (.h2rt, its --reel custom property) is no longer
 * rendered on /. Asserting it would fail on an absence the strategy decided. */
console.log('\n  version 3 motion moments on / (strategy 0.8)');
{
  const page = await open('no-preference');
  const seqLoad = await page.evaluate(() => document.querySelector('.ea-seq[data-seq="load"]')?.dataset.seqState ?? null);
  await page.waitForTimeout(2500);
  const seqAfter = await page.evaluate(() => document.querySelector('.ea-seq[data-seq="load"]')?.dataset.seqState ?? null);
  check('hero sequence plays once on load', seqAfter === 'run', `${seqLoad} -> ${seqAfter}`);

  const refusalBefore = await page.evaluate(() => document.querySelector('[data-refusal]')?.dataset.play ?? 'absent');
  check('refusal check is armed below the fold before it is seen', refusalBefore === 'armed', `data-play=${refusalBefore}`);
  await page.evaluate(() => document.querySelector('[data-refusal]')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(3000);
  const refusalAfter = await page.evaluate(() => document.querySelector('[data-refusal]')?.dataset.play ?? 'absent');
  check('refusal check plays once to its finished frame', refusalAfter === 'run', `data-play=${refusalAfter}`);
  await page.waitForTimeout(3000);
  const refusalLater = await page.evaluate(() => document.querySelector('[data-refusal]')?.dataset.play ?? 'absent');
  check('refusal check halts, no loop (WCAG 2.2.2)', refusalLater === refusalAfter, `${refusalAfter} -> ${refusalLater}`);

  await page.evaluate(() => document.querySelector('[data-car]')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const carStart = await page.evaluate(() => document.querySelector('[data-car-n]')?.textContent ?? null);
  await page.waitForTimeout(6500);
  const carLater = await page.evaluate(() => document.querySelector('[data-car-n]')?.textContent ?? null);
  check('carousel never advances on its own (6.5s untouched)', carStart === '1' && carLater === '1', `${carStart} -> ${carLater}`);
  await page.click('[data-car-next]');
  await page.waitForTimeout(600);
  const carNext = await page.evaluate(() => document.querySelector('[data-car-n]')?.textContent ?? null);
  check('carousel moves when the reader presses next', carNext === '2', `screen ${carNext}`);
  await page.close();
}
{
  const page = await open('reduce');
  await page.waitForTimeout(800);
  const armed = await page.evaluate(() =>
    document.querySelectorAll('[data-reveal="armed"], [data-seq-state="armed"], [data-play="armed"]').length,
  );
  check('under reduced motion nothing is armed or hidden', armed === 0, `armed=${armed}`);
  await page.close();
}

/* ── 2. THE HERO AURORA LOOPS, AND ITS PAUSE CONTROL (D293) ─────────────────
 *
 * The owner decided on 2026-10-22 that the hero aurora keeps moving (D293).
 * It is the ONE loop on the site, so WCAG 2.2.2 now binds it: moving content
 * that starts on its own and lasts more than five seconds needs a way to
 * pause it. The rule, measured on every hero route:
 *
 *   a  every infinite animation running in <main> sits inside a hero band
 *      (.ea-hero). A loop anywhere else has no pause control to answer for it.
 *   b  every hero band running a loop carries a REACHABLE pause control: shown,
 *      at least 44 by 44px, in the tab order, not disabled or inert, and the
 *      topmost thing at its own centre (nothing painted over it).
 *   c  pressing it FROM THE KEYBOARD stops every loop in that band, and says so
 *      (aria-pressed="true"). Focus is dropped before reading, for the reason
 *      given in this file's header.
 *   d  the choice lasts the session: after a reload the loops stay stopped,
 *      and a second press starts them again.
 *   e  under reduced motion no loop runs and no pause control is shown.
 *   f  a pause control is never shown in a band where nothing loops.
 *
 * Red proven against a mutated copy of dist (AUTOPLAY_DIST): with the button
 * stripped (b fails), with the loops forced to run whatever the button says
 * (c and d fail), and with a loop injected outside the hero (a fails). */
const HERO_ROUTES = ['/', '/bid/', '/buy/', '/pricing/'];

/** Running infinite animations in <main>, each with the hero band holding it. */
const loopsIn = (page) => page.evaluate(() => document.getAnimations()
  .filter((a) => a.playState === 'running' && a.effect && a.effect.getTiming().iterations === Infinity)
  .map((a) => {
    const t = a.effect.target;
    const inMain = Boolean(t && t.closest && t.closest('main'));
    const hero = t && t.closest ? t.closest('.ea-hero') : null;
    const cls = t && typeof t.className === 'string' && t.className.trim() ? '.' + t.className.trim().split(/\s+/).join('.') : '';
    return { inMain, hero: hero ? (hero.id || 'hero') : null, name: a.animationName || 'animation', el: t ? t.tagName.toLowerCase() + cls : '?' };
  })
  .filter((l) => l.inMain));

/** The pause control of every hero band, and whether a reader can reach it. */
const controls = (page) => page.evaluate(() => [...document.querySelectorAll('main .ea-hero')].map((band) => {
  const b = band.querySelector(':scope > button[data-aurora-pause]');
  if (!b) return { hero: band.id || 'hero', present: false };
  b.scrollIntoView({ block: 'center', behavior: 'instant' });
  const r = b.getBoundingClientRect();
  const cs = getComputedStyle(b);
  const shown = !b.hidden && cs.display !== 'none' && cs.visibility !== 'hidden';
  const top = shown ? document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) : null;
  return {
    hero: band.id || 'hero', present: true, shown,
    w: Math.round(r.width), h: Math.round(r.height),
    tab: b.tabIndex >= 0 && !b.disabled && !b.closest('[inert]'),
    onTop: Boolean(top && (top === b || b.contains(top))),
  };
}));

console.log('\n  hero aurora loops and their pause control (D293, WCAG 2.2.2)');
for (const route of HERO_ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const res = await page.goto(`${base}${route}`, { waitUntil: 'load' });
  const landed = new URL(page.url()).pathname;
  check(`${route} answers 200 and lands on ${route}`, res?.status() === 200 && landed === route, `status ${res?.status()} landed ${landed}`);
  await page.waitForTimeout(600);

  const loops = await loopsIn(page);
  const stray = loops.filter((l) => !l.hero);
  check(`${route} a: every loop sits in a hero band`, stray.length === 0,
    stray.length ? stray.map((l) => `${l.name} on ${l.el}`).join(', ') : `${loops.length} loop(s), all in a hero`);

  const ctl = await controls(page);
  const looping = new Set(loops.filter((l) => l.hero).map((l) => l.hero));
  for (const hero of looping) {
    const c = ctl.find((x) => x.hero === hero);
    const ok = Boolean(c && c.present && c.shown && c.w >= 44 && c.h >= 44 && c.tab && c.onTop);
    check(`${route} b: hero "${hero}" has a reachable pause control`, ok,
      c ? `present=${c.present} shown=${c.shown} ${c.w}x${c.h} tab=${c.tab} onTop=${c.onTop}` : 'no hero band found');
  }
  for (const c of ctl.filter((x) => x.present && x.shown && !looping.has(x.hero))) {
    check(`${route} f: no pause control in a band where nothing loops`, false, `hero "${c.hero}" shows one with 0 loops`);
  }

  /* c and d press the control, so they run only when b found one to press.
     Without one, b has already failed and there is nothing to measure. Only
     loops inside a hero count here: a stray loop is rule a's finding. */
  const inHero = async () => (await loopsIn(page)).filter((l) => l.hero);
  if (looping.size && ctl.some((c) => c.present && c.shown)) {
    const btn = page.locator('main .ea-hero > button[data-aurora-pause]').first();
    await btn.focus();
    await page.keyboard.press('Space');
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.waitForTimeout(400);
    const after = await inHero();
    const pressed = await btn.getAttribute('aria-pressed');
    check(`${route} c: the keyboard press stops every loop`, after.length === 0 && pressed === 'true',
      `${loops.length} -> ${after.length} running, aria-pressed=${pressed}`);

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(600);
    const kept = await inHero();
    const keptPressed = await btn.getAttribute('aria-pressed');
    check(`${route} d: the pause lasts the session (after a reload)`, kept.length === 0 && keptPressed === 'true',
      `${kept.length} running, aria-pressed=${keptPressed}`);
    await btn.click();
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.waitForTimeout(400);
    const resumed = await inHero();
    check(`${route} d: a second press starts them again`, resumed.length > 0, `${resumed.length} running`);
  }
  await ctx.close();

  const rctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rpage = await rctx.newPage();
  await rpage.goto(`${base}${route}`, { waitUntil: 'load' });
  await rpage.waitForTimeout(600);
  const rl = await loopsIn(rpage);
  const rc = (await controls(rpage)).filter((x) => x.present && x.shown);
  check(`${route} e: reduced motion, no loop and no pause control`, rl.length === 0 && rc.length === 0,
    `loops=${rl.length} visible pause controls=${rc.length}`);
  await rctx.close();
}

await browser.close();
server.close();

console.log(`\n  ${checks} behavioural check(s): the v3 motion moments on /, and the hero aurora on ${HERO_ROUTES.length} routes`);
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
    '\n  nothing moves for a reader who asked for no motion, the only loop is the hero\n' +
    '  aurora, and every hero that runs it offers a pause a keyboard can reach, that\n' +
    '  genuinely stops it, lasts the session and can be undone',
);
