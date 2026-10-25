#!/usr/bin/env node
/**
 * check-app-contrast.js — text drawn inside a simulated product screen owes
 * the same contrast as text anywhere else on the page.
 *
 * ── THE REPORT THIS EXISTS FOR ──────────────────────────────────────────────
 *
 * An external audit on 2026-09-07 found 12 elements on the homepage below the
 * WCAG 2.1 AA threshold, all of them inside the reasoning-trace screen. Driving
 * the same measurement here found 17, across FOUR token families rather than
 * the one the report named. The worst was 3.17:1, carrying the sidebar group
 * names, the breadcrumb and its separators.
 *
 * ── WHY THIRTY-NINE GREEN GATES DID NOT CATCH IT ────────────────────────────
 *
 * Because none of them measures this. Three gates compute a contrast ratio —
 * check-heading-ink, check-treatments and check-disclosure — and every one does
 * it for a narrow purpose of its own: is a heading drawn at full ink, does a
 * treatment differ from its neighbour, does a summary carry an affordance.
 * There was no assertion anywhere that ordinary body text meets 4.5:1. A whole
 * class of defect had no instrument pointed at it, and a clean run said nothing
 * about it either way.
 *
 * ── WHY THE SIMULATED SCREEN IS WHERE IT BIT ────────────────────────────────
 *
 * The page is dark and this screen is LIGHT, drawn inside it. Every muted role
 * on it is therefore pale grey on near-white, which is exactly where 1.4.3 is
 * lost, and none of the page's own palette guards look at these tokens because
 * they are declared locally on the component. It is a drawing of a product, but
 * it is drawn in HTML, so it is real text and the ratio is owed in full. An
 * image of the same screen would owe nothing, which is precisely the trap: what
 * makes the screen accessible is also what makes it accountable.
 *
 * ── WHAT IS MEASURED, AND HOW EACH INSTRUMENT CAN FAIL ──────────────────────
 *
 * COLOURS ARE READ RESOLVED, FROM THE RENDERED PAGE, not from the stylesheet.
 * These values are `color-mix()` of two page tokens, so the source says nothing
 * about the colour that lands, and a custom property read back with
 * getPropertyValue returns the literal `color-mix(...)` expression rather than a
 * colour. Both computed formats have to be parsed: color-mix resolves to
 * `color(srgb 0..1)` while a plain declaration resolves to `rgb(0..255)`.
 * Treating one as the other is not hypothetical. A first pass at this
 * measurement divided the 0..1 form by 255 as well, reported black on white as
 * 1.00:1, and would have passed every element on the page.
 *
 * THE BACKGROUND IS A STACK, NOT A COLOUR. Chips and tints on this screen are
 * translucent over a card over a panel. Taking the first non-transparent
 * ancestor reports a colour nobody sees, so the layers are composited down to
 * the first opaque one.
 *
 * ONLY ELEMENTS THAT HOLD THEIR OWN TEXT. A computed colour is inherited by
 * nodes that draw nothing, and counting those inflates the sample with elements
 * that cannot fail.
 *
 * LARGE TEXT IS 3:1 AND EVERYTHING ELSE 4.5:1, per 1.4.3, with large defined as
 * 24px, or 18.66px when bold. Applying the strict figure everywhere would fail
 * headings that are conformant.
 *
 * A FLOOR, BECAUSE EVERY RULE ABOVE PASSES TRIVIALLY ON AN EMPTY SELECTOR. If
 * the screen stops rendering, or is renamed, this gate measures nothing and
 * would report a clean run. That is a failure here, never a skip.
 *
 * ── SCOPE, STATED SO NOBODY READS MORE INTO A PASS THAN IT MEANS ────────────
 *
 * This measures the SIMULATED SCREENS and nothing else. It is not a sitewide
 * contrast gate and a clean run here says nothing about the rest of the site.
 * Widening it to every route is a real option and a separate decision, because
 * it would redden whatever it finds and that is the owner's call, not a side
 * effect of fixing one component.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');

/* The simulated screens, named by the element that establishes their palette.
   A screen drawn anywhere else is added here, and the addition is the decision
   to have another one. */
const SCREENS = [
  {
    /* R285-WEB-ENTERPRISE-REDESIGN-01: the home page rebuilt on the evidenced
       answer system draws its product screens with components/evidenced/
       Frame.astro, ten of them, and some carry a light paper sheet inside the
       dark frame. Every visible one is measured, not just the first. Was
       `.h2rt__app` (home2/RefusalTrace.astro), which the new home no longer
       renders. */
    sel: '.ea-frame__window',
    route: '/',
    why: 'evidenced/Frame.astro draws the product screens, with light evidence sheets inside dark frames',
  },
];

/* What the homepage renders today, stated as a minimum. */
const FLOOR = { roles: 20 };

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.avif': 'image/avif',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.json': 'application/json',
};

if (!fs.existsSync(DIST)) {
  console.error('app-contrast: no dist/. Build first.');
  process.exit(1);
}

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
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

/* Runs in the page. Returns one row per distinct (class, ink, ground) triple. */
const MEASURE = (sel) => {
  const parse = (c) => {
    let m = c.match(/^color\(srgb\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)(?:\s*\/\s*([\d.eE+-]+))?\s*\)$/);
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    m = c.match(/^rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.%]+))?\)$/);
    if (m) {
      const a = m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]);
      return [+m[1], +m[2], +m[3], a];
    }
    return null;
  };
  const over = (f, g) => f.slice(0, 3).map((v, i) => v * f[3] + g[i] * (1 - f[3]));
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (f, g) => { const a = L(f), c = L(g); return (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05); };
  /* A FILL CAN BE A GRADIENT LAYER. .ea-frame__window paints its sheet as
     `linear-gradient(fill, fill) padding-box` under a gradient rim, so its
     computed background-color is transparent. Reading only the colour walked
     straight through the white sheet to the dark band behind the frame, and
     on 2026-10-22 reported 13 failures of ink on near black for text that a
     reader sees on white (R285-WEB-GATES-V3-01). The TOP layer of
     background-image is the paint nearest the text: when every stop in it is
     opaque it is an opaque ground, and each stop is a ground the text may sit
     on, so the worst of them is the one measured. Only a layer that COVERS
     the box is a ground: .ea-fig--found draws a 1.5px underline the same
     way, and that is a rule under the words, not paper behind them. */
  const splitTop = (v) => {
    const out = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < v.length; i++) {
      const ch = v[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 0) { out.push(v.slice(start, i).trim()); start = i + 1; }
    }
    out.push(v.slice(start).trim());
    return out;
  };
  /* Layers top down: the first that covers the box with only opaque stops. */
  const gradientGrounds = (img, size) => {
    if (!img || img.indexOf('gradient(') < 0) return null;
    const layers = splitTop(img);
    const sizes = splitTop(size || 'auto');
    for (let i = 0; i < layers.length; i++) {
      if (!/^(auto|auto auto|100% 100%|100%|cover)$/.test(sizes[i % sizes.length])) continue;
      if (layers[i].indexOf('gradient(') < 0) continue;
      const stops = [...layers[i].matchAll(/rgba?\([^)]*\)|color\(srgb[^)]*\)/g)].map((m) => parse(m[0]));
      if (!stops.length || stops.some((c) => !c || c[3] < 1)) continue;
      return stops.map((c) => c.slice(0, 3));
    }
    return null;
  };
  const bgOf = (el) => {
    const layers = [];
    let grounds = null;
    let n = el;
    while (n) {
      const cs = getComputedStyle(n);
      const c = parse(cs.backgroundColor);
      grounds = gradientGrounds(cs.backgroundImage, cs.backgroundSize);
      if (grounds) break;
      if (c && c[3] > 0) { layers.push(c); if (c[3] === 1) break; }
      n = n.parentElement;
    }
    if (!grounds) grounds = layers.length && layers[layers.length - 1][3] === 1 ? [layers.pop().slice(0, 3)] : [[255, 255, 255]];
    return grounds.map((g) => {
      let acc = g;
      for (let i = layers.length - 1; i >= 0; i--) acc = over(layers[i], acc);
      return acc;
    });
  };
  const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

  const roots = [...document.querySelectorAll(sel)];
  if (!roots.length) return { missing: true };
  const seen = new Map();
  for (const el of roots.flatMap((r) => [...r.querySelectorAll('*')])) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const fgRaw = parse(cs.color);
    if (!fgRaw) continue;
    /* The worst ground the text can sit on. */
    const [bg, fg] = bgOf(el)
      .map((g) => [g, over(fgRaw, g)])
      .sort((a, b) => ratio(a[1], a[0]) - ratio(b[1], b[0]))[0];
    const size = parseFloat(cs.fontSize);
    const weight = +cs.fontWeight || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const cr = ratio(fg, bg);
    const cls = [...el.classList].filter((c) => !/^astro-/.test(c)).join('.') || el.tagName.toLowerCase();
    const key = `${cls}|${hex(fg)}|${hex(bg)}`;
    if (seen.has(key)) { seen.get(key).n += 1; continue; }
    seen.set(key, {
      cls, fg: hex(fg), bg: hex(bg), size: Math.round(size), weight, need,
      cr: Math.round(cr * 100) / 100, pass: cr >= need, n: 1,
      sample: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
    });
  }
  return { rows: [...seen.values()].sort((a, b) => a.cr - b.cr) };
};

const violations = [];
let rolesSeen = 0;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });

console.log('\n' + '='.repeat(100));
console.log('APP CONTRAST — text inside a simulated product screen meets WCAG 2.1 AA');
console.log('='.repeat(100));
for (const s of SCREENS) console.log(`  ${s.sel}  on ${s.route}  ${s.why}`);
console.log('');

for (const s of SCREENS) {
  await page.goto(base + s.route, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const out = await page.evaluate(MEASURE, s.sel);

  if (out.missing) {
    violations.push(
      `stale — ${s.sel} matched nothing on ${s.route}. It is declared here as a simulated screen and this gate is measuring no text through it. Either the screen is gone, in which case delete the entry, or it has been renamed, in which case this gate has been blind since the rename`,
    );
    console.log(`  FAIL  ${s.sel}  matched nothing on ${s.route}`);
    continue;
  }

  rolesSeen += out.rows.length;
  const fails = out.rows.filter((r) => !r.pass);
  console.log(`  ${s.route}  ${s.sel}  ${out.rows.length} distinct text role(s), ${fails.length} below threshold`);
  for (const r of out.rows) {
    if (r.pass) continue;
    console.log(
      `    FAIL  ${String(r.cr).padStart(5)}:1 (needs ${r.need})  ${r.fg} on ${r.bg}  ${r.size}px/${r.weight}  x${r.n}  .${r.cls}  "${r.sample}"`,
    );
    violations.push(
      `${s.route}  .${r.cls} — ${r.fg} on ${r.bg} is ${r.cr}:1, and ${r.size}px/${r.weight} text needs ${r.need}:1. ${r.n} element(s), e.g. "${r.sample}". These colours are a mix of the page tokens declared on ${s.sel}, so correct the MIX there rather than the rule that uses it`,
    );
  }
  if (!fails.length) console.log(`    ok    lowest ${out.rows[0].cr}:1 on .${out.rows[0].cls}`);
}

/* ══════════════════════════════════════════════════════════════════════════
 * THE WASHES AND THE BENTO FLOODS, MEASURED IN PIXELS
 * (R285-WEB-PREMIUM-CARDS-01, spec section 9: "add the wash peaks as rendered
 * backgrounds and fail below 4.5")
 *
 * A wash and a flood are gradients that fade to transparent, so the stack
 * reading above walks straight through them to the white card and would pass
 * a flood laid under every word. The only honest ground is what the reader
 * sees, so this one READS THE PIXELS: every element that holds its own text
 * inside a washed card, a bento tile or a resource cover is recorded (its
 * colour, size and weight), the words are made transparent, the element's box
 * is photographed, and the WORST pixel under the words is the ground. A box is
 * the whole line box, so a gradient that reaches anywhere under a paragraph is
 * caught, which is stricter than the glyphs need.
 *
 * HOW IT COULD FAIL, AND THE GUARD AGAINST IT. If the words were not hidden the
 * worst pixel would be a glyph and every line would fail; if the selector
 * matched nothing every line would pass. So a floor applies, and before the
 * site is measured a SELF TEST floods one tile with full strength Iris under
 * its words and requires this measurement to fail it.
 * ══════════════════════════════════════════════════════════════════════════ */
const sharp = (await import('sharp')).default;
const WASHED = [
  { route: '/', sel: '.ea-bento__tile' },
  { route: '/bid/', sel: '.ea-bento__tile' },
  { route: '/buy/', sel: '.ea-bento__tile' },
  { route: '/pricing/', sel: '.ea-card:not(.ea-card--plain)' },
  { route: '/integrations/', sel: '.ea-card:not(.ea-card--plain)' },
  /* D424 (A-434): the resource cards dropped their type covers for art panels
     with no words on them, so the words to measure are the card's own. */
  { route: '/resources/', sel: '.ea-card:not(.ea-card--plain)' },
];
const PX_FLOOR = 40;
/* The words go transparent, and so do the element's own ::before and ::after
   (a list dot, a cover's accent bar): they are drawn beside the words, not
   under them, and photographing them would report a mark as a ground. */
const HIDE = '[data-px] { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; } [data-px]::before, [data-px]::after, [data-px]::marker { visibility: hidden !important; } [data-px-clip] { background-image: none !important; } #ca-nav, .ea-motion { visibility: hidden !important; }';

const TAG = (sel) => {
  const parse = (c) => {
    let m = c.match(/^color\(srgb\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)(?:\s*\/\s*([\d.eE+-]+))?\s*\)$/);
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    m = c.match(/^rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.%]+))?\)$/);
    if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4])];
    return null;
  };
  const out = [];
  let i = 0;
  for (const root of document.querySelectorAll(sel)) {
    for (const el of [root, ...root.querySelectorAll('*')]) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      if (el.closest('.visually-hidden, [aria-hidden="true"]:not(.tc)')) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const fg = parse(cs.color);
      if (!fg || fg[3] === 0) continue;
      el.setAttribute('data-px', String(i));
      /* A gradient label (.eyebrow) paints its ink with background-clip: text,
         so its background IS the ink. Photographing it with the words hidden
         would still show the gradient glyphs, so that background is dropped
         for the photograph and the ground behind the label is what is read. */
      if ((cs.backgroundClip || cs.webkitBackgroundClip || '').includes('text')) el.setAttribute('data-px-clip', '');
      /* The CONTENT box, inside the border and the padding: a pill's rounded
         corners and a capsule's own edge are not under its words. */
      const px = (v) => parseFloat(v) || 0;
      const inset = {
        l: px(cs.borderLeftWidth) + px(cs.paddingLeft),
        t: px(cs.borderTopWidth) + px(cs.paddingTop),
        r: px(cs.borderRightWidth) + px(cs.paddingRight),
        b: px(cs.borderBottomWidth) + px(cs.paddingBottom),
      };
      out.push({
        i: i++,
        inset,
        fg,
        size: parseFloat(cs.fontSize),
        weight: +cs.fontWeight || 400,
        cls: [...el.classList].filter((c) => !/^astro-/.test(c)).join('.') || el.tagName.toLowerCase(),
        sample: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
      });
    }
  }
  return out;
};

const lumOf = (c) => {
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
};
const ratioOf = (a, b) => { const x = lumOf(a), y = lumOf(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const hexOf = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** The worst pixel of an element's box against its own text colour. */
async function worstUnder(pg, t) {
  const loc = pg.locator(`[data-px="${t.i}"]`);
  /* A card inside a rail is brought to the rail's start first, where its snap
     point is, so it is photographed whole rather than cut by the track. */
  await loc.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'start', behavior: 'instant' })).catch(() => null);
  await pg.waitForTimeout(60);
  let png;
  /* Two attempts: a lazy screen landing above can move the element while the
     first waits for it to hold still. A second failure is reported. */
  for (let attempt = 0; attempt < 2 && !png; attempt++) {
    try {
      png = await loc.screenshot({ animations: 'disabled', timeout: 15000 });
    } catch (err) {
      if (attempt === 1) return { error: err instanceof Error ? err.message.split('\n')[0] : String(err) };
    }
  }
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const x0 = Math.min(info.width - 1, Math.round(t.inset.l));
  const y0 = Math.min(info.height - 1, Math.round(t.inset.t));
  const x1 = Math.max(x0 + 1, info.width - Math.round(t.inset.r));
  const y1 = Math.max(y0 + 1, info.height - Math.round(t.inset.b));
  let worst = Infinity;
  let at = null;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const p = y * info.width + x;
    /* A pixel the page did not paint opaque is under a fade mask (a rail's
       edge), where the words fade with it. Skipped, never counted as black. */
    if (data[p * 4 + 3] < 250) continue;
    const px = [data[p * 4], data[p * 4 + 1], data[p * 4 + 2]];
    /* Text with alpha is composited over the pixel it sits on. */
    const fg = t.fg.slice(0, 3).map((v, k) => v * t.fg[3] + px[k] * (1 - t.fg[3]));
    const cr = ratioOf(fg, px);
    if (cr < worst) { worst = cr; at = px; }
  }
  return { cr: Math.round(worst * 100) / 100, bg: at ? hexOf(at) : '?' };
}

const need = (t) => (t.size >= 24 || (t.size >= 18.66 && t.weight >= 700) ? 3 : 4.5);

/* SELF TEST: a full strength flood under the words must fail. */
{
  const pg = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await pg.goto(base + '/', { waitUntil: 'load' });
  const tagged = await pg.evaluate(TAG, '.ea-bento__tile');
  const body = tagged.find((t) => t.cls === 'p' || t.size < 18);
  if (!body) {
    violations.push('wash self test: no small text in a .ea-bento__tile on /, so the pixel measurement could not be proved');
  } else {
    await pg.addStyleTag({ content: HIDE + ' .ea-bento__tile { background-image: linear-gradient(var(--qv-iris), var(--qv-iris)) !important; }' });
    const m = await worstUnder(pg, body);
    if (m.error || !(m.cr < need(body))) {
      violations.push(`wash self test DID NOT FIRE: full strength Iris was laid under "${body.sample}" and the pixel measurement read ${m.cr ?? m.error}:1. A clean run below would mean nothing`);
      console.log(`  FAIL  self test: a full Iris flood under the words read ${m.cr ?? m.error}:1`);
    } else {
      console.log(`  ok    self test: a full Iris flood under "${body.sample}" reads ${m.cr}:1 on ${m.bg}, caught`);
    }
  }
  await pg.close();
}

let pxMeasured = 0;
for (const width of [1440, 390]) {
  const pg = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  for (const w of WASHED) {
    const res = await pg.goto(base + w.route, { waitUntil: 'load' });
    if (!res || res.status() !== 200) {
      violations.push(`wash: ${w.route} answered ${res ? res.status() : 'nothing'}, so its washed cards were not measured`);
      continue;
    }
    const tagged = await pg.evaluate(TAG, w.sel);
    if (!tagged.length) {
      violations.push(`stale: ${w.sel} matched no text on ${w.route} at ${width}. Either the treatment is gone (delete the entry) or it was renamed and this gate is blind`);
      continue;
    }
    await pg.addStyleTag({ content: HIDE });
    let worstRow = null;
    let fails = 0;
    for (const t of tagged) {
      const m = await worstUnder(pg, t);
      if (m.error) {
        violations.push(`wash: ${w.route} at ${width}, .${t.cls} "${t.sample}" could not be photographed: ${m.error}`);
        continue;
      }
      pxMeasured += 1;
      if (!worstRow || m.cr < worstRow.cr) worstRow = { ...m, t };
      if (m.cr < need(t)) {
        fails += 1;
        violations.push(`wash: ${w.route} at ${width}, .${t.cls} ${hexOf(t.fg)} on its worst pixel ${m.bg} is ${m.cr}:1, and ${Math.round(t.size)}px/${t.weight} text needs ${need(t)}:1, e.g. "${t.sample}". The wash or flood under it is past its cap (tokens.css PREMIUM CARDS)`);
      }
    }
    console.log(`  ${w.route} at ${width}  ${w.sel}  ${tagged.length} text element(s), ${fails} below threshold` +
      (worstRow ? `, worst ${worstRow.cr}:1 (.${worstRow.t.cls} on ${worstRow.bg})` : ''));
  }
  await pg.close();
}
if (pxMeasured < PX_FLOOR) {
  violations.push(`wash floor: ${pxMeasured} washed text element(s) measured, and every rule above passes trivially below ${PX_FLOOR}`);
}
console.log(`\n  ${pxMeasured} washed or flooded text element(s) measured in pixels`);

/* ══════════════════════════════════════════════════════════════════════════
 * THE FORM FIELD EDGE, WCAG 1.4.11 (R285-WEB-GEMINI-UIUX P2-12)
 *
 * A field at rest is identified by its edge alone, so the edge owes 3:1
 * against BOTH colours it separates: the field's own fill and the ground
 * outside it. Read resolved off the rendered page, translucent layers
 * composited down to the first opaque one. Self test first: the old edge
 * (--ea-rule-strong, about 1.5:1) is put back on one field and must fail.
 * ══════════════════════════════════════════════════════════════════════════ */
const FIELD_ROUTES = ['/contact/', '/faq/', '/glossary/', '/tools/tender-finder/', '/tools/tender-compliance-matrix/'];
const FIELD_SEL = 'main :is(.field__input, input[type=search], input[type=text], input[type=email], textarea, select)';
const FIELD_MEASURE = (sel) => {
  const parse = (c) => {
    let m = c.match(/^color\(srgb\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)(?:\s*\/\s*([\d.eE+-]+))?\s*\)$/);
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    m = c.match(/^rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.%]+))?\)$/);
    if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4])];
    return null;
  };
  const over = (f, g) => f.slice(0, 3).map((v, i) => v * f[3] + g[i] * (1 - f[3]));
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const ground = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] === 1) break; }
    }
    let acc = layers.length && layers[layers.length - 1][3] === 1 ? layers.pop().slice(0, 3) : [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) acc = over(layers[i], acc);
    return acc;
  };
  return [...document.querySelectorAll(sel)].filter((el) => el.getBoundingClientRect().width > 0 && getComputedStyle(el).borderTopStyle !== 'none').map((el) => {
    const cs = getComputedStyle(el);
    const outside = el.parentElement ? ground(el.parentElement) : [255, 255, 255];
    const inside = ground(el);
    const edge = parse(cs.borderTopColor) || [0, 0, 0, 0];
    const e = over(edge, outside);
    const cr = Math.min(ratio(e, outside), ratio(e, inside));
    return { cls: [...el.classList].filter((c) => !/^astro-/.test(c)).join('.') || el.tagName.toLowerCase(), cr: Math.round(cr * 100) / 100, w: parseFloat(cs.borderTopWidth) };
  });
};
{
  const pg = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await pg.goto(base + '/contact/', { waitUntil: 'load' });
  await pg.addStyleTag({ content: '.field__input { border-color: var(--ea-rule-strong) !important; }' });
  const probe = (await pg.evaluate(FIELD_MEASURE, FIELD_SEL)).filter((r) => r.cls.includes('field__input'));
  if (!probe.length || probe.every((r) => r.cr >= 3)) {
    violations.push(`field edge self test DID NOT FIRE: the old 1.5:1 edge was put back on /contact/ and ${probe.length ? `the lowest read ${Math.min(...probe.map((r) => r.cr))}:1` : 'no field was found'}`);
  } else {
    console.log(`  ok    field self test: the old edge reads ${Math.min(...probe.map((r) => r.cr))}:1 on /contact/, caught`);
  }
  let fields = 0;
  for (const width of [1440, 390]) {
    await pg.setViewportSize({ width, height: 1000 });
    for (const route of FIELD_ROUTES) {
      const res = await pg.goto(base + route, { waitUntil: 'load' });
      if (!res || res.status() !== 200) { violations.push(`field: ${route} answered ${res ? res.status() : 'nothing'}`); continue; }
      const rows = await pg.evaluate(FIELD_MEASURE, FIELD_SEL);
      fields += rows.length;
      const bad = rows.filter((r) => r.cr < 3);
      console.log(`  ${route} at ${width}  ${rows.length} field(s), lowest edge ${rows.length ? Math.min(...rows.map((r) => r.cr)) : '-'}:1`);
      for (const r of bad) violations.push(`field: ${route} at ${width}, .${r.cls} edge is ${r.cr}:1 against its fill or its ground, and a control's edge needs 3:1 (WCAG 1.4.11). The edge is --field-edge in tokens.css`);
    }
  }
  if (fields < 8) violations.push(`field floor: ${fields} field(s) measured, the rule passes trivially below 8`);
  await pg.close();
}

await browser.close();
server.close();

/* THE FLOOR. Every assertion above is satisfied by there being nothing to
   assert it on, and a selector that has quietly stopped matching is the
   quietest way to get there. */
if (rolesSeen < FLOOR.roles) {
  violations.push(
    `floor — ${rolesSeen} text role(s) measured across ${SCREENS.length} simulated screen(s), and every rule above passes trivially below that. Needs at least ${FLOOR.roles}`,
  );
}

console.log(`\n  ${rolesSeen} text role(s) measured across ${SCREENS.length} simulated screen(s)`);

if (violations.length) {
  console.error(`\napp-contrast: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error(`  - ${v}`);
  console.error('');
  process.exit(1);
}

console.log('\napp-contrast: clean\n');
