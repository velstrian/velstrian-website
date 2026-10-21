/**
 * check-sheen.js: the ONE calm hover, measured on the rendered page.
 *
 * ── WHAT THIS GATE USED TO ASSERT, AND WHY IT NOW ASSERTS THE OPPOSITE ──────
 *
 * From 2026-08-04 this gate proved that every card carried a travelling sheen
 * and every button a sweep, by photographing the band crossing the face. On
 * 2026-10-21 the owner reversed the effect itself: *"remove unnecessary
 * flashing animation when mouse hover into any cards as looks very cheap"*,
 * with the site to read like Linear, Vanta, Auth0, Better Stack and
 * Atlassian (R285-WEB-ENTERPRISE-REDESIGN-01).
 *
 * The file and its place in scripts/run-gates.mjs are kept, because the hazard
 * it was built for is unchanged: a hover is only true on the rendered page, and
 * a stylesheet that reads calm can still lift, glow or sweep once a component's
 * scoped rule merges with it. So the gate still drives a real pointer onto a
 * real card and reads what the browser does. What it now requires is the
 * contract in styles/tokens.css, the one card hover:
 *
 *   1  CARD, ONE CHANGE. Hovering a card moves its edge to --c-border-hover and
 *      changes NOTHING else that paints: no transform, no translate, no scale,
 *      no box-shadow, no background, no filter, and no ::before or ::after
 *      layer appearing or moving.
 *   2  CARD, CALM CLOCK. The only transitions that run are on the border
 *      colour, between 150 and 200ms, and no CSS animation starts.
 *   3  BUTTON, PLAIN COLOUR. Hovering a primary and a secondary button changes
 *      colour only: no transform, no translate, no scale, no box-shadow, no
 *      filter, no pseudo-element layer and no animation.
 *   4  REDUCED MOTION. Under `prefers-reduced-motion: reduce` the card still
 *      answers with its edge, and still nothing moves.
 *   5  NOTHING LOOPS. On every built route, once the page has loaded, no
 *      animation with infinite iterations is running. Shimmer, pulse, ping,
 *      breathe, drift, beam, edge and seam were all loops, and a loop is the
 *      thing a reader cannot stop by moving the pointer away.
 *
 * ── THE SELF-TEST, BECAUSE A GATE THAT CANNOT FAIL IS THE USUAL FAILURE ─────
 *
 * Before measuring the site, the gate puts the OLD hover back on one card and
 * one button through an injected stylesheet (a 2px lift, a cast glow, a
 * travelling ::after band and an infinite animation) and requires rules 1, 3
 * and 5 to fire on it. If they do not, the run is a PREFLIGHT failure: the
 * measurement is broken, and a clean result below would mean nothing. This is
 * the same shape check-transitions.js uses for its own two rules.
 *
 * DS_DIST points the gate at another build directory.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serveDist, routesOf } from './lib/dist-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = process.env.DS_DIST || path.join(__dirname, '..', 'dist');

/* `{ probe, reason }`. EMPTY, AND THAT IS THE STATE TO KEEP IT IN. A card that
   needs a second hover change has to argue against a clean baseline. */
const ALLOW = [];

/* The calm clock, in milliseconds. --dur-hover is --dur-fast, 0.18s. */
const CLOCK = { min: 150, max: 200 };

/* A card big enough to be a card rather than a chip, and wholly on screen. */
const MIN_CARD = { w: 240, h: 120 };

/* Three routes with plain cards, chosen for density: /bid/ carries the most
   plain surfaces, /about/ the timeline cards, /pricing/ the plan cards. */
const CARD_ROUTES = ['/bid/', '/about/', '/pricing/'];

/* The first page that renders each button variant in <main>. */
const BUTTON_ROUTES = ['/', '/pricing/', '/bid/', '/about/'];
const BUTTONS = [
  { sel: 'main .btn--primary', label: 'button primary' },
  { sel: 'main .btn--secondary', label: 'button secondary' },
];

/* Paint properties a hover may never change, and the ones it may. */
const CARD_MAY_CHANGE = new Set(['borderTop', 'borderRight', 'borderBottom', 'borderLeft']);
const BUTTON_MAY_CHANGE = new Set([
  'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'bg', 'bgImage', 'color',
]);
const TRANSITION_OK = /^border-(top|right|bottom|left)-color$|^border-color$|^background-color$|^color$/;

/* The old hover, put back for the self-test. Every line is one of the effects
   this redesign removed, so each rule must catch at least one of them. */
const OLD_HOVER = `
  [data-calm-probe]:hover { transform: translateY(-2px) !important;
    box-shadow: 0 22px 50px -14px rgba(255,255,255,.3) !important; }
  [data-calm-probe]::after { content: ''; position: absolute; inset: 0;
    pointer-events: none; transform: translateX(-100%); transition: transform 0.9s linear; }
  [data-calm-probe]:hover::after { transform: translateX(100%); }
  @keyframes calm-probe-loop { from { opacity: 1; } to { opacity: 0.5; } }
  [data-calm-probe] { animation: calm-probe-loop 1s linear infinite; }
`;

const server = await serveDist(DIST, 'sheen');
const url = (route) => server.url(route);
const browser = await chromium.launch();

const results = [];
const preflight = [];
const usedAllow = new Set();
const rec = (probe, name, pass, detail) => {
  if (!pass) {
    const ex = ALLOW.find((a) => a.probe === probe);
    if (ex) {
      usedAllow.add(ex.probe);
      results.push({ probe, name, pass: true, detail: `${detail}   [allowed: ${ex.reason}]` });
      return;
    }
  }
  results.push({ probe, name, pass, detail });
};

/* ══════════════════════════════════════════════════════════════════════════
 * IN THE PAGE
 * ══════════════════════════════════════════════════════════════════════════ */

/** Every paint property a hover could flash, read off the element and its two
    pseudo-elements. */
const SNAP = `(sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const cs = getComputedStyle(el);
  const pseudo = (p) => {
    const s = getComputedStyle(el, p);
    return [s.content, s.opacity, s.transform, s.backgroundImage, s.backgroundPosition].join(' | ');
  };
  return {
    borderTop: cs.borderTopColor,
    borderRight: cs.borderRightColor,
    borderBottom: cs.borderBottomColor,
    borderLeft: cs.borderLeftColor,
    transform: cs.transform,
    translate: cs.translate,
    scale: cs.scale,
    shadow: cs.boxShadow,
    bg: cs.backgroundColor,
    bgImage: cs.backgroundImage,
    color: cs.color,
    filter: cs.filter,
    opacity: cs.opacity,
    before: pseudo('::before'),
    after: pseudo('::after'),
  };
}`;

/** What is moving on the element and inside it, right now. */
const MOTION = `(sel) => {
  const el = document.querySelector(sel);
  if (!el) return [];
  return el.getAnimations({ subtree: true })
    .filter((a) => a.playState === 'running')
    .map((a) => ({
      kind: a.constructor.name,
      name: a.transitionProperty || a.animationName || '',
      pseudo: (a.effect && a.effect.pseudoElement) || '',
      dur: a.effect ? Number(a.effect.getTiming().duration) : 0,
      infinite: a.effect ? a.effect.getTiming().iterations === Infinity : false,
    }));
}`;

/** The resolved value of --c-border-hover, read the way the browser paints it. */
const HOVER_EDGE = `() => {
  const probe = document.createElement('div');
  probe.style.borderTop = '1px solid var(--c-border-hover)';
  document.body.appendChild(probe);
  const v = getComputedStyle(probe).borderTopColor;
  probe.remove();
  return v;
}`;

/** Every infinite animation running anywhere on the document. */
const LOOPS = `() => document.getAnimations()
  .filter((a) => a.playState === 'running' && a.effect && a.effect.getTiming().iterations === Infinity)
  .map((a) => {
    const t = a.effect.target;
    const cls = t && t.classList ? [...t.classList].filter((c) => !/^astro-/.test(c)).join('.') : '';
    return (a.animationName || a.transitionProperty || 'animation') + ' on ' +
      (t ? t.tagName.toLowerCase() : '?') + (cls ? '.' + cls : '') + ((a.effect && a.effect.pseudoElement) || '');
  })`;

/** Finite CSS animations still running inside the element (an entrance). */
const ENTRANCE_LEFT = `(sel) => {
  const el = document.querySelector(sel);
  if (!el) return 0;
  return el.getAnimations({ subtree: true })
    .filter((a) => a.constructor.name === 'CSSAnimation' && a.playState === 'running' &&
      a.effect && a.effect.getTiming().iterations !== Infinity && a.timeline === document.timeline)
    .length;
}`;

const fn = (src) => new Function(`return (${src});`)();
const snap = (page, sel) => page.evaluate(fn(SNAP), sel);
const motion = (page, sel) => page.evaluate(fn(MOTION), sel);
const loops = (page) => page.evaluate(fn(LOOPS));
const hoverEdge = (page) => page.evaluate(fn(HOVER_EDGE));

async function open(page, route) {
  await page.goto(url(route), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
}

/** Wait out a time-based entrance on the element, so rest and hover are read
    on a still element. Scroll-driven arrivals hold still while the page does. */
async function settle(page, sel) {
  for (let i = 0; i < 40; i++) {
    if (!(await page.evaluate(fn(ENTRANCE_LEFT), sel))) return true;
    await page.waitForTimeout(150);
  }
  return false;
}

/** Put the pointer on the element, and confirm the browser agrees it is there. */
async function hover(page, sel) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const box = await page.locator(sel).boundingBox();
    if (!box) return false;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(40);
    if (await page.evaluate((s) => Boolean(document.querySelector(s)?.matches(':hover')), sel)) return true;
    await page.mouse.move(0, 0);
    await page.waitForTimeout(80);
  }
  return false;
}

/** Tag the first plain card on the route and bring it on screen. */
function tagCard(page) {
  return page.evaluate(([minW, minH]) => {
    const el = [...document.querySelectorAll('.surface:not(.surface--frame)')].find((e) => {
      if (e.tagName === 'FIGURE' || e.querySelector('.surface')) return false;
      const r = e.getBoundingClientRect();
      return r.width >= minW && r.height >= minH && r.height < window.innerHeight - 40;
    });
    if (!el) return null;
    el.setAttribute('data-calm-probe', '');
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    return `${el.tagName.toLowerCase()}.${[...el.classList].filter((c) => !/^astro-/.test(c)).join('.')}`;
  }, [MIN_CARD.w, MIN_CARD.h]);
}

function tagButton(page, sel) {
  return page.evaluate((s) => {
    const el = [...document.querySelectorAll(s)].find((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (!el) return null;
    el.setAttribute('data-calm-probe', '');
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    return `${el.tagName.toLowerCase()}.${[...el.classList].filter((c) => !/^astro-/.test(c)).join('.')}`;
  }, sel);
}

const SEL = '[data-calm-probe]';

/** Which paint properties differ between rest and hover, outside `allowed`. */
function flashes(rest, lit, allowed) {
  return Object.keys(rest).filter((k) => !allowed.has(k) && rest[k] !== lit[k])
    .map((k) => `${k}: ${rest[k]} -> ${lit[k]}`);
}

/** Measure one hover. Returns everything the rules need. */
async function measure(page) {
  await page.mouse.move(0, 0);
  await page.waitForTimeout(250);
  await settle(page, SEL);
  const rest = await snap(page, SEL);
  if (!(await hover(page, SEL))) return { hovered: false };
  const moving = await motion(page, SEL);
  await page.waitForTimeout(450);
  const lit = await snap(page, SEL);
  await page.mouse.move(0, 0);
  return { hovered: true, rest, lit, moving };
}

/* ══════════════════════════════════════════════════════════════════════════
 * SELF-TEST: the old hover, reinstated, must be caught
 * ══════════════════════════════════════════════════════════════════════════ */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await open(page, CARD_ROUTES[0]);
  const sig = await tagCard(page);
  if (!sig) {
    preflight.push(`self-test: no plain card on ${CARD_ROUTES[0]} to reinstate the old hover on`);
  } else {
    await page.addStyleTag({ content: OLD_HOVER });
    const m = await measure(page);
    const caughtFlash = m.hovered && flashes(m.rest, m.lit, CARD_MAY_CHANGE).length > 0;
    const caughtLoop = (await loops(page)).some((l) => l.startsWith('calm-probe-loop'));
    if (!caughtFlash) {
      preflight.push('RULE 1 DID NOT FIRE. A 2px lift, a cast glow and a travelling ::after band were put ' +
        `back on ${sig} and the gate saw no change beyond the edge. A clean run below would mean nothing.`);
    }
    if (!caughtLoop) {
      preflight.push('RULE 5 DID NOT FIRE. An infinite animation was injected and the loop sweep did not report it.');
    }
  }
  await page.close();
}

/* ══════════════════════════════════════════════════════════════════════════
 * 1, 2, 4: CARDS, WITH AND WITHOUT MOTION
 * ══════════════════════════════════════════════════════════════════════════ */
for (const reduced of [false, true]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  for (const route of CARD_ROUTES) {
    const probe = `card ${route}${reduced ? ' reduce' : ''}`;
    await open(page, route);
    const sig = await tagCard(page);
    if (!sig) {
      preflight.push(`${probe}: no plain .surface of at least ${MIN_CARD.w}x${MIN_CARD.h} on this route`);
      continue;
    }
    const want = await hoverEdge(page);
    const m = await measure(page);
    if (!m.hovered) {
      preflight.push(`${probe} (${sig}): the pointer could not be brought onto the card in three attempts`);
      continue;
    }
    const flash = flashes(m.rest, m.lit, CARD_MAY_CHANGE);
    rec(probe, 'one change only', flash.length === 0,
      flash.length ? `${sig}: ${flash.join('; ')}` : `${sig}: nothing but the edge changed`);
    rec(probe, 'edge steps to --c-border-hover', m.lit.borderTop === want && m.rest.borderTop !== want,
      `${sig}: ${m.rest.borderTop} -> ${m.lit.borderTop} (token resolves to ${want})`);
    const anims = m.moving.filter((a) => a.kind !== 'CSSTransition');
    const badProps = m.moving.filter((a) => a.kind === 'CSSTransition' && !TRANSITION_OK.test(a.name));
    rec(probe, 'no animation, colour transitions only', !anims.length && !badProps.length,
      [...anims, ...badProps].map((a) => `${a.kind} ${a.name}${a.pseudo}`).join(', ') || 'none');
    if (!reduced) {
      const edge = m.moving.filter((a) => a.kind === 'CSSTransition' && /^border-/.test(a.name));
      const off = edge.filter((a) => a.dur < CLOCK.min || a.dur > CLOCK.max);
      rec(probe, `edge eases in ${CLOCK.min} to ${CLOCK.max}ms`, edge.length > 0 && !off.length,
        edge.length ? edge.map((a) => `${a.name} ${a.dur}ms`).join(', ') : 'no border transition was running');
    }
  }
  await ctx.close();
}

/* ══════════════════════════════════════════════════════════════════════════
 * 3: BUTTONS
 * ══════════════════════════════════════════════════════════════════════════ */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const b of BUTTONS) {
    let done = false;
    for (const route of BUTTON_ROUTES) {
      await open(page, route);
      const sig = await tagButton(page, b.sel);
      if (!sig) continue;
      const m = await measure(page);
      if (!m.hovered) {
        preflight.push(`${b.label} on ${route} (${sig}): the pointer could not be brought onto it`);
        done = true;
        break;
      }
      const flash = flashes(m.rest, m.lit, BUTTON_MAY_CHANGE);
      rec(b.label, 'plain colour change only', flash.length === 0,
        flash.length ? `${route} ${sig}: ${flash.join('; ')}` : `${route} ${sig}: colour only`);
      const anims = m.moving.filter((a) => a.kind !== 'CSSTransition' || !TRANSITION_OK.test(a.name));
      rec(b.label, 'no animation, colour transitions only', !anims.length,
        anims.map((a) => `${a.kind} ${a.name}${a.pseudo}`).join(', ') || 'none');
      done = true;
      break;
    }
    if (!done) preflight.push(`${b.label}: no visible ${b.sel} on ${BUTTON_ROUTES.join(', ')}`);
  }
  await page.close();
}

/* ══════════════════════════════════════════════════════════════════════════
 * 3b: THE EVIDENCED ANSWER BUTTON, ONE LIGHT SWEEP PER HOVER
 *
 * R285-WEB-ENTERPRISE-REDESIGN-01, strategy section 5 (adopted 2026-10-21):
 * the owner liked the light sweep and kept it on the PRIMARY button of the new
 * system only, "a single soft highlight passes across the button once per
 * hover, 400ms, on the button only, never on cards, never looping, off under
 * reduced motion". Rule 3 above still holds every older .btn to colour only.
 * This asserts the one sanctioned exception as a measured property, so the
 * sweep cannot spread to a card or start looping without failing here:
 *   - on hover exactly one transform transition runs, on ::after, 350-450ms,
 *     finite, and nothing else animates
 *   - a second hover plays it once more, so it is per hover and not a loop
 *   - under prefers-reduced-motion nothing moves at all
 *   - the secondary button changes colour only
 * ══════════════════════════════════════════════════════════════════════════ */
const SWEEP = { route: '/', primary: 'main .ea-btn--primary', secondary: 'main .ea-btn--secondary', min: 350, max: 450 };
for (const reduced of [false, true]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  await open(page, SWEEP.route);
  const sig = await tagButton(page, SWEEP.primary);
  const probe = reduced ? 'sweep, reduced motion' : 'sweep';
  if (!sig) {
    preflight.push(`${probe}: no visible ${SWEEP.primary} on ${SWEEP.route}`);
    await ctx.close();
    continue;
  }
  const passes = [];
  for (let i = 0; i < 2; i++) {
    const m = await measure(page);
    if (!m.hovered) {
      preflight.push(`${probe} on ${SWEEP.route} (${sig}): the pointer could not be brought onto it`);
      break;
    }
    passes.push(m);
  }
  if (passes.length === 2) {
    for (const [i, m] of passes.entries()) {
      const sweep = m.moving.filter((a) => a.kind === 'CSSTransition' && a.pseudo === '::after' && a.name === 'transform');
      const other = m.moving.filter((a) => !sweep.includes(a) && !(a.kind === 'CSSTransition' && TRANSITION_OK.test(a.name)));
      if (reduced) {
        rec(probe, `hover ${i + 1}: nothing moves`, sweep.length === 0 && other.length === 0,
          [...sweep, ...other].map((a) => `${a.kind} ${a.name}${a.pseudo}`).join(', ') || 'still');
      } else {
        const ok = sweep.length === 1 && !sweep[0].infinite && sweep[0].dur >= SWEEP.min && sweep[0].dur <= SWEEP.max;
        rec(probe, `hover ${i + 1}: one ${SWEEP.min}-${SWEEP.max}ms pass`, ok && other.length === 0,
          `${sig}: ` + ([...sweep, ...other].map((a) => `${a.kind} ${a.name}${a.pseudo} ${a.dur}ms${a.infinite ? ' infinite' : ''}`).join(', ') || 'no sweep ran'));
      }
    }
  }
  if (!reduced) {
    const sec = await tagButton(page, SWEEP.secondary);
    if (sec) {
      await page.evaluate((s) => document.querySelectorAll('[data-calm-probe]').forEach((e) => e.removeAttribute('data-calm-probe')), null);
      await tagButton(page, SWEEP.secondary);
      const m = await measure(page);
      if (m.hovered) {
        const flash = flashes(m.rest, m.lit, BUTTON_MAY_CHANGE);
        const anims = m.moving.filter((a) => a.kind !== 'CSSTransition' || !TRANSITION_OK.test(a.name));
        rec('evidenced secondary', 'colour only, nothing moves', flash.length === 0 && anims.length === 0,
          [...flash, ...anims.map((a) => `${a.kind} ${a.name}${a.pseudo}`)].join('; ') || 'colour only');
      }
    }
  }
  await ctx.close();
}

/* ══════════════════════════════════════════════════════════════════════════
 * 5: NOTHING LOOPS, ON EVERY BUILT ROUTE
 * ══════════════════════════════════════════════════════════════════════════ */
const allRoutes = routesOf(DIST);
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const found = [];
  for (const route of allRoutes) {
    await open(page, route);
    await page.waitForTimeout(200);
    for (const l of await loops(page)) found.push(`${route}  ${l}`);
  }
  rec('every route', `no infinite animation (${allRoutes.length} routes)`, found.length === 0,
    found.length ? found.join('\n' + ' '.repeat(70)) : `${allRoutes.length} routes loaded, 0 loops running`);
  await page.close();
}

await browser.close();
server.close();

/* ══════════════════════════════════════════════════════════════════════════
 * OUTPUT
 * ══════════════════════════════════════════════════════════════════════════ */
const pad = (s, n) => String(s).padEnd(n);
console.log('\n' + '='.repeat(104));
console.log('CALM HOVER: one edge step on a card, a plain colour on a button, and nothing that loops');
console.log('='.repeat(104));

console.log(`\n  ${ALLOW.length} recorded exception(s):`);
if (!ALLOW.length) console.log('    none, which is the state to keep it in');
for (const a of ALLOW) {
  console.log(`    ${a.probe}${usedAllow.has(a.probe) ? '' : '   [STALE: matched nothing]'}`);
  console.log(`        ${a.reason}`);
}
const stale = ALLOW.filter((a) => !usedAllow.has(a.probe));

console.log('');
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? ' PASS' : ' FAIL'}  ${pad(r.probe, 22)} ${pad(r.name, 42)} ${r.detail}`);
}
console.log('='.repeat(104));
console.log(`${results.length - failed}/${results.length} assertion(s) passed`);

if (preflight.length) {
  console.error(`\nsheen: ${preflight.length} preflight failure(s). WHAT FOLLOWS WAS NOT MEASURED:\n`);
  for (const p of preflight) console.error(`  ${p}`);
}
if (stale.length) {
  console.error(`\nsheen: ${stale.length} allow-list entr(ies) matched nothing. The list may only shrink.\n`);
}
if (failed || preflight.length || stale.length) {
  console.error('\n  The hover contract is in styles/tokens.css (--c-border-hover, --dur-hover,');
  console.error('  --transition-hover). A card steps its edge and nothing else, a button changes');
  console.error('  colour and nothing else, and nothing on the site loops.\n');
  process.exit(1);
}

console.log('\n  Every card answers a pointer with one edge step on the calm clock, every button with');
console.log('  a plain colour, the same holds under reduced motion, and no route runs a loop.\n');
