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
 *   1  CARD, THE EDGE AND THE LIFT. Hovering a card moves its edge to
 *      --c-border-hover. Since D321 (owner 2026-10-23, amending the
 *      2026-10-21 contract) a v3 `.ea-card` also rises by `translate` 4 to
 *      8px straight up with a deeper shadow, and its spotlight may fade in on
 *      ::before (opacity and gradient position only). NOTHING else paints:
 *      no transform, no scale, no sideways move, no background, no filter,
 *      no ::after layer, and no ::before that moves. A lift outside the band
 *      fails, and under reduced motion the lift and the spotlight must not
 *      happen at all.
 *   2  CARD, CALM CLOCK. The only transitions that run are on the border
 *      colour, between 150 and 200ms, and the D321 lift (translate,
 *      box-shadow, the spotlight's opacity), and no CSS animation starts.
 *   3  BUTTON, PLAIN COLOUR. Hovering a primary and a secondary button changes
 *      colour only: no transform, no translate, no scale, no box-shadow, no
 *      filter, no pseudo-element layer and no animation.
 *   4  REDUCED MOTION. Under `prefers-reduced-motion: reduce` the card still
 *      answers with its edge, and still nothing moves.
 *   5  NOTHING LOOPS. On every built route, once the page has loaded, no
 *      animation with infinite iterations is running. Shimmer, pulse, ping,
 *      breathe, drift, beam, edge and seam were all loops, and a loop is the
 *      thing a reader cannot stop by moving the pointer away. LOOP_ALLOW
 *      below takes an owner decision per loop, matched by animation name AND
 *      element, and reports an entry STALE (a failure) the moment it stops
 *      running. It holds the hero aurora's five fields, which keep moving by
      owner decision D293 behind a pause control check-autoplay presses.
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

/* Rule 5's exceptions, matched exactly against "<animation> on <element>".
   Each one is an owner decision. Off under reduced motion is evidenced.css's
   job and rule 4's measurement does not see loops, so it is stated here. */
/* THE HERO AURORA, AND NOTHING ELSE (D293, owner 2026-10-22). Its five
   colour fields loop on 20 to 32 second periods (Gemini's, R285-WEB-GEMINI-AUDIT-6, which also swapped fields 4 and 5 onto ea-aurora-a and -b), transform only, inside the
   hero band only. R285-WEB-GATES-V3-01 had made them drift once and settle,
   which emptied this list. The owner chose the other answer to WCAG 2.2.2:
   it keeps moving and every hero that draws it carries a pause button, which
   check-autoplay.mjs presses and measures. Matched by animation name AND
   element, and STALE (a failure) the moment one stops running. */
const AURORA_WHY = 'owner D293 2026-10-22: hero aurora keeps moving, pause control in every hero band (check-autoplay), off under reduced motion';
const LOOP_ALLOW = [
  ['ea-aurora-a', 1], ['ea-aurora-b', 2], ['ea-aurora-c', 3], ['ea-aurora-a', 4], ['ea-aurora-b', 5],
].map(([name, n]) => ({ loop: `${name} on span.ea-aurora__f.ea-aurora__f--${n}`, reason: AURORA_WHY }));
const usedLoopAllow = new Set();

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
  /* sweep: the primary carries the one sanctioned light sweep, the same pass
     3b asserts on .ea-btn--primary (owner 2026-10-22, R285-WEB-BUTTON-SYSTEM-01:
     "where is button animations effect gone?"). */
  { sel: 'main .btn--primary', label: 'button primary', sweep: true },
  { sel: 'main .btn--secondary', label: 'button secondary' },
];

/* Paint properties a hover may never change, and the ones it may. */
const CARD_MAY_CHANGE = new Set(['borderTop', 'borderRight', 'borderBottom', 'borderLeft']);
/* D321: the lift a v3 card may add, on top of the edge. `translate` is then
   held to LIFT by liftProblem(), the shadow may deepen, and the spotlight on
   ::before may fade in and follow the pointer. */
const LIFT_MAY_CHANGE = new Set([...CARD_MAY_CHANGE, 'translate', 'shadow', 'beforeOpacity', 'beforeBg']);
const LIFT = { min: 4, max: 8 };
const LIFT_TRANSITION_OK = /^border-(top|right|bottom|left)-color$|^border-color$|^translate$|^box-shadow$|^opacity$/;
/* The lift, read off `translate`. Null when the hover kept to the D321 band
   (or, under reduced motion, did not lift at all), otherwise what is wrong. */
function liftProblem(rest, lit, reduced, required) {
  const px = (v) => (v === 'none' ? [0, 0] : v.split(/\s+/).map((n) => parseFloat(n) || 0).concat([0, 0]).slice(0, 2));
  const [x0, y0] = px(rest.translate);
  const [x1, y1] = px(lit.translate);
  const dx = x1 - x0;
  const dy = y1 - y0;
  if (reduced) {
    if (dx || dy) return `moved ${dx}px, ${dy}px under reduced motion`;
    if (rest.beforeOpacity !== lit.beforeOpacity) return `spotlight showed under reduced motion (${rest.beforeOpacity} -> ${lit.beforeOpacity})`;
    return null;
  }
  if (dx) return `moved sideways ${dx}px`;
  if (!dy) return required ? 'no lift: a v3 card rises 4 to 8px on hover (D321)' : null;
  if (-dy < LIFT.min || -dy > LIFT.max) return `lift of ${-dy}px is outside the D321 band of ${LIFT.min} to ${LIFT.max}px`;
  return null;
}
const BUTTON_MAY_CHANGE = new Set([
  'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'bg', 'bgImage', 'color',
]);
/* The one sanctioned light sweep, on every primary button (sections 3 and 3b). */
const SWEEP = { route: '/', primary: 'main .ea-btn--primary', secondary: 'main .ea-btn--secondary', min: 350, max: 450 };
const TRANSITION_OK = /^border-(top|right|bottom|left)-color$|^border-color$|^background-color$|^color$/;

/* The old hover, put back for the self-test. Every line is one of the effects
   this redesign removed, so each rule must catch at least one of them. */
const OLD_HOVER = `
  [data-calm-probe]:hover { transform: translateY(-2px) !important; translate: 0 -14px !important; scale: 1.04 !important;
    box-shadow: 0 22px 50px -14px rgba(255,255,255,.3) !important; }
  [data-calm-probe]::after { content: ''; position: absolute; inset: 0;
    pointer-events: none; transform: translateX(-100%); transition: transform 0.9s linear; }
  [data-calm-probe]:hover::after { transform: translateX(100%); }
  @keyframes calm-probe-loop { from { opacity: 1; } to { opacity: 0.5; } }
  [data-calm-probe] { animation: calm-probe-loop 1s linear infinite !important; }
`;
/* !important on the injected loop: a card inside a v3 section sits under
   evidenced.css's `main > .ea-sec * { animation: none }`, which outranks a
   lone attribute selector, and the self-test then failed to inject anything
   (2026-10-22, the first time /bid/ was a v3 page). The probe must land. */

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
  const before = getComputedStyle(el, '::before');
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
    beforeLayer: [before.content, before.transform, before.translate, before.scale, before.inset, before.width, before.height].join(' | '),
    beforeOpacity: before.opacity,
    beforeBg: before.backgroundImage,
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

/** The resolved value of --c-border-hover, read the way the browser paints it,
    resolved BESIDE the probed card: v3 band role scopes (.band--light and the
    rest) redeclare the token, so the value on body is the dark :root one and
    is wrong for a card on a light band. */
const HOVER_EDGE = `() => {
  const probe = document.createElement('div');
  probe.style.borderTop = '1px solid var(--c-border-hover)';
  const card = document.querySelector('[data-calm-probe]');
  ((card && card.parentElement) || document.body).appendChild(probe);
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

/** Finite CSS animations still running inside the element (an entrance).
    ALSO the v3 scroll reveal, which is a TRANSITION on opacity and transform
    (evidenced.ts initReveal, [data-reveal]) rather than an animation. The
    probe scrolls the card into view, that starts the reveal, and a rest
    snapshot read mid reveal then reports the reveal finishing as a hover
    "flash". Measured 2026-10-22 on /bid/ and /about/ once .ea-card was
    sampled: transform 6.5px -> none, opacity 0.29 -> 1. A hover never
    starts before rest is read, so waiting these out cannot hide one. */
const ENTRANCE_LEFT = `(sel) => {
  const el = document.querySelector(sel);
  if (!el) return 0;
  return el.getAnimations({ subtree: true })
    .filter((a) => a.playState === 'running' && a.effect && a.timeline === document.timeline && (
      (a.constructor.name === 'CSSAnimation' && a.effect.getTiming().iterations !== Infinity) ||
      (a.constructor.name === 'CSSTransition' && /^(opacity|transform|translate)$/.test(a.transitionProperty))))
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
const CARD_SEL = { surface: '.surface:not(.surface--frame)', 'ea-card': '.ea-card' };
function tagCard(page, kind = 'surface') {
  return page.evaluate(([minW, minH, sel]) => {
    /* The version 2 `.surface` card AND the v3 `.ea-card` (D294, the one
       card). Sampling only `.surface` is how the v3 card's shadow lift on
       hover went unmeasured until 2026-10-22. The recommended plan is left
       out on purpose: it is the already marked card and holds its accent
       edge on hover (evidenced.css .ea-plan--rec), so the edge step this
       contract measures is not its behaviour. */
    const el = [...document.querySelectorAll(sel)].find((e) => {
      if (e.tagName === 'FIGURE' || e.querySelector('.surface, .ea-card') || e.matches('.ea-plan--rec')) return false;
      const r = e.getBoundingClientRect();
      return r.width >= minW && r.height >= minH && r.height < window.innerHeight - 40;
    });
    if (!el) return null;
    el.setAttribute('data-calm-probe', '');
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    return `${el.tagName.toLowerCase()}.${[...el.classList].filter((c) => !/^astro-/.test(c)).join('.')}`;
  }, [MIN_CARD.w, MIN_CARD.h, CARD_SEL[kind]]);
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
    const caughtFlash = m.hovered && flashes(m.rest, m.lit, LIFT_MAY_CHANGE).length > 0;
    const caughtLift = m.hovered && liftProblem(m.rest, m.lit, false, true) !== null;
    const caughtLoop = (await loops(page)).some((l) => l.startsWith('calm-probe-loop'));
    if (!caughtFlash) {
      preflight.push('RULE 1 DID NOT FIRE. A 2px lift, a cast glow and a travelling ::after band were put ' +
        `back on ${sig} and the gate saw no change beyond the edge. A clean run below would mean nothing.`);
    }
    if (!caughtLift) {
      preflight.push('RULE 1 (D321 LIFT) DID NOT FIRE. A 14px lift was put back on ' +
        `${sig} and the lift band of ${LIFT.min} to ${LIFT.max}px did not reject it.`);
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
let eaCardsSampled = 0;
for (const reduced of [false, true]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  /* Each card kind on each route, on a fresh load so only one card carries
     the probe. A route may hold one kind or both, but it must hold one. */
  for (const route of CARD_ROUTES) {
    let sampled = 0;
    for (const kind of Object.keys(CARD_SEL)) {
      const probe = `card ${route} ${kind}${reduced ? ' reduce' : ''}`;
      await open(page, route);
      const sig = await tagCard(page, kind);
      if (!sig) continue;
      sampled += 1;
      if (kind === 'ea-card') eaCardsSampled += 1;
      const want = await hoverEdge(page);
      const m = await measure(page);
      if (!m.hovered) {
        preflight.push(`${probe} (${sig}): the pointer could not be brought onto the card in three attempts`);
        continue;
      }
      const lifts = kind === 'ea-card';
      const flash = flashes(m.rest, m.lit, lifts ? LIFT_MAY_CHANGE : CARD_MAY_CHANGE);
      rec(probe, lifts ? 'edge and D321 lift only' : 'one change only', flash.length === 0,
        flash.length ? `${sig}: ${flash.join('; ')}` : `${sig}: ${lifts ? 'only the edge, the lift and the spotlight changed' : 'nothing but the edge changed'}`);
      if (lifts) {
        const lp = liftProblem(m.rest, m.lit, reduced, true);
        rec(probe, reduced ? 'no lift, no spotlight' : `lifts ${LIFT.min} to ${LIFT.max}px straight up`, lp === null,
          `${sig}: ${lp || `translate ${m.rest.translate} -> ${m.lit.translate}`}`);
      }
      rec(probe, 'edge steps to --c-border-hover', m.lit.borderTop === want && m.rest.borderTop !== want,
        `${sig}: ${m.rest.borderTop} -> ${m.lit.borderTop} (token resolves to ${want})`);
      const anims = m.moving.filter((a) => a.kind !== 'CSSTransition');
      const okProp = lifts && !reduced ? LIFT_TRANSITION_OK : TRANSITION_OK;
      const badProps = m.moving.filter((a) => a.kind === 'CSSTransition' && !okProp.test(a.name));
      rec(probe, 'no animation, colour transitions only', !anims.length && !badProps.length,
        [...anims, ...badProps].map((a) => `${a.kind} ${a.name}${a.pseudo}`).join(', ') || 'none');
      if (!reduced) {
        const edge = m.moving.filter((a) => a.kind === 'CSSTransition' && /^border-/.test(a.name));
        const off = edge.filter((a) => a.dur < CLOCK.min || a.dur > CLOCK.max);
        rec(probe, `edge eases in ${CLOCK.min} to ${CLOCK.max}ms`, edge.length > 0 && !off.length,
          edge.length ? edge.map((a) => `${a.name} ${a.dur}ms`).join(', ') : 'no border transition was running');
      }
    }
    if (!sampled) {
      preflight.push(`card ${route}${reduced ? ' reduce' : ''}: no .surface or .ea-card of at least ${MIN_CARD.w}x${MIN_CARD.h} on this route`);
    }
  }
  await ctx.close();
}
if (!eaCardsSampled) {
  preflight.push(`no v3 .ea-card of at least ${MIN_CARD.w}x${MIN_CARD.h} on ${CARD_ROUTES.join(', ')}: the one card (D294) went unmeasured`);
}

/* ══════════════════════════════════════════════════════════════════════════
 * 3: BUTTONS
 * ══════════════════════════════════════════════════════════════════════════ */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const b of BUTTONS) {
    let done = false;
    /* BUTTON_ROUTES first, then every other built route: as pages move to v3
       the legacy .btn leaves the four usual routes (2026-10-22, /about/ was the
       last of them), and a button that exists anywhere must still be measured. */
    const candidates = [...BUTTON_ROUTES, ...routesOf(DIST).filter((r) => !BUTTON_ROUTES.includes(r))];
    for (const route of candidates) {
      await open(page, route);
      const sig = await tagButton(page, b.sel);
      if (!sig) continue;
      const m = await measure(page);
      if (!m.hovered) {
        preflight.push(`${b.label} on ${route} (${sig}): the pointer could not be brought onto it`);
        done = true;
        break;
      }
      /* The sweep moves the ::after, so on a sweeping primary the pseudo's own
         snapshot may differ between rest and lit. Everything else is held. */
      const flash = flashes(m.rest, m.lit, b.sweep ? new Set([...BUTTON_MAY_CHANGE, 'after']) : BUTTON_MAY_CHANGE);
      rec(b.label, 'plain colour change only', flash.length === 0,
        flash.length ? `${route} ${sig}: ${flash.join('; ')}` : `${route} ${sig}: colour only`);
      const sweep = b.sweep
        ? m.moving.filter((a) => a.kind === 'CSSTransition' && a.pseudo === '::after' && a.name === 'transform')
        : [];
      const anims = m.moving.filter((a) => !sweep.includes(a) && (a.kind !== 'CSSTransition' || !TRANSITION_OK.test(a.name)));
      rec(b.label, b.sweep ? 'colour transitions and the one sweep only' : 'no animation, colour transitions only', !anims.length,
        anims.map((a) => `${a.kind} ${a.name}${a.pseudo}`).join(', ') || 'none');
      if (b.sweep) {
        const ok = sweep.length === 1 && !sweep[0].infinite && sweep[0].dur >= SWEEP.min && sweep[0].dur <= SWEEP.max;
        rec(b.label, `one ${SWEEP.min}-${SWEEP.max}ms light sweep per hover`, ok,
          `${route} ${sig}: ` + (sweep.map((a) => `${a.name}${a.pseudo} ${a.dur}ms${a.infinite ? ' infinite' : ''}`).join(', ') || 'no sweep ran'));
      }
      done = true;
      break;
    }
    /* On NO built route at all means the legacy button is retired, which is a
       fact to report, not a broken measurement. The v3 buttons are measured
       in 3b. */
    if (!done) rec(b.label, 'legacy button retired', true, `no visible ${b.sel} on any of ${candidates.length} built routes`);
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
 * reduced motion". Since 2026-10-22 rule 3 asserts the same pass on the older
 * .btn--primary, because the owner asked for it on every primary button.
 * This asserts the one sanctioned exception as a measured property, so the
 * sweep cannot spread to a card or start looping without failing here:
 *   - on hover exactly one transform transition runs, on ::after, 350-450ms,
 *     finite, and nothing else animates
 *   - a second hover plays it once more, so it is per hover and not a loop
 *   - under prefers-reduced-motion nothing moves at all
 *   - the secondary button changes colour only
 * ══════════════════════════════════════════════════════════════════════════ */
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
    for (const l of await loops(page)) {
      if (LOOP_ALLOW.some((a) => a.loop === l)) { usedLoopAllow.add(l); continue; }
      found.push(`${route}  ${l}`);
    }
  }
  const staleLoops = LOOP_ALLOW.filter((a) => !usedLoopAllow.has(a.loop));
  rec('every route', `${LOOP_ALLOW.length} recorded loop exception(s) still running`, staleLoops.length === 0,
    staleLoops.length ? 'STALE, delete from LOOP_ALLOW: ' + staleLoops.map((a) => a.loop).join(', ') : LOOP_ALLOW.map((a) => a.loop).join(', '));
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
console.log('CALM HOVER: an edge step and the D321 lift on a card, a plain colour on a button, and nothing that loops');
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
