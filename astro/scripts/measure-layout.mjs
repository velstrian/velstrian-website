/**
 * measure-layout.mjs: a LOCAL measurement of the v3 layout system.
 *
 * R285-WEB-ENTERPRISE-REDESIGN-01, owner 2026-10-22: "screens under the cards
 * are in different sizes ... you must measure the sizes of cards, identical
 * spacing, overlap and all the other pages layout like top 1% ultra premium".
 *
 * NOT A GATE. It is not wired into run-gates.mjs, package.json or CI, and must
 * not be without the owner's approval (RULE 0-G). It reports numbers, it does
 * not pass or fail anything.
 *
 * For each route at 1440 and 390 it reports:
 *   screens   every product screen on a stage, width and height, by layout
 *   rows      every card grid, each row's card widths, heights and tops, and
 *             whether the row is ragged (heights or tops differ by more than 1px)
 *   rhythm    each band's padding and the gap between consecutive bands
 *   overlap   text boxes that collide with another text box or with a floating
 *             card, the header over the hero and over an anchor target, and
 *             horizontal overflow
 *   type      the font sizes actually used per role, and how many lines each
 *             big value wraps to
 *   contrast  with --contrast: the hero's moving light paused at ten points of
 *             its loop, the words made transparent, and the rendered pixels
 *             behind every line of the headline, lead and note sampled. The
 *             lowest ratio per element is reported (AA needs 4.5:1).
 *
 * Measured with motion REDUCED so every reveal and sequence is at its final
 * frame and nothing is mid transform.
 *
 * Usage, from astro/:
 *   node scripts/measure-layout.mjs [--base http://localhost:8093] [--out file.json]
 *                                   [--routes /,/bid/,/buy/]
 */

import fs from 'node:fs';
import { chromium } from 'playwright';

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : dflt;
};
const BASE = arg('--base', 'http://localhost:8093');
const OUT = arg('--out', null);
const ROUTES = arg('--routes', '/,/bid/,/buy/').split(',');
const CONTRAST = process.argv.includes('--contrast');
const WIDTHS = [1440, 390];

/* Card grids: a container whose children are peers that should share one row
   height. Generic, so a future page's grid is measured without editing this. */
const CARD_GRID = [
  '.ea-facts__cols', '.ea-steps__list', '.ea-plans__grid', '.ea-cards',
  '[class*="-cards"]', '[class*="-onward"]', '.buy-bands', '.buy-scope',
  '.ea-detail__grid', '.ea-grid',
];

const PROBE = (cardSel) => {
  const r2 = (n) => Math.round(n * 10) / 10;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r2(r.left), y: r2(r.top + scrollY), w: r2(r.width), h: r2(r.height) };
  };
  const name = (el) => {
    const c = [...el.classList].filter((k) => !/^astro-/.test(k)).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (c ? '.' + c : '') + (el.id ? '#' + el.id : '');
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) <= 0.01) return false;
    if (el.closest('[hidden],[inert],[aria-hidden="true"]')) return false;
    /* the body of a closed <details> keeps a box but paints nothing */
    const d = el.closest('details:not([open])');
    return !(d && !el.closest('summary') && el !== d);
  };

  /* screens */
  const screens = [...document.querySelectorAll('main .ea-stage')].filter(visible).map((st) => {
    const layout = (st.className.match(/ea-stage--(hero|panel|centre)/) || [])[1] || 'other';
    const win = st.querySelector('.ea-stage__screen .ea-frame__window, .ea-stage__screen .ea-app__window, .ea-stage__screen > *');
    const sec = st.closest('section');
    const body = win ? win.querySelector('.ea-frame__body, .ea-app__page, img') : null;
    return {
      layout,
      section: sec ? name(sec) : '?',
      stage: box(st),
      screen: win ? box(win) : null,
      clipped: body ? body.scrollHeight > body.clientHeight + 1 || body.scrollWidth > body.clientWidth + 1 : false,
    };
  });

  /* card rows */
  const rows = [];
  const seen = new Set();
  for (const sel of cardSel) {
    for (const g of document.querySelectorAll(`main ${sel}`)) {
      if (seen.has(g) || !visible(g)) continue;
      seen.add(g);
      const kids = [...g.children].filter(visible);
      if (kids.length < 2) continue;
      const groups = [];
      for (const k of kids) {
        /* a cell that wraps one card is measured by the card it shows */
        const b = box(k.matches('.ea-card') ? k : k.querySelector(':scope > .ea-card') || k);
        const row = groups.find((gr) => Math.abs(gr.top - b.y) < 24 || (b.y < gr.top + gr.minH - 4 && b.y + b.h > gr.top + 4));
        if (row) { row.cards.push(b); row.minH = Math.min(row.minH, b.h); } else groups.push({ top: b.y, minH: b.h, cards: [b] });
      }
      groups.forEach((gr, i) => {
        if (gr.cards.length < 2) return;
        const hs = gr.cards.map((c) => c.h);
        const ts = gr.cards.map((c) => c.y);
        const dh = r2(Math.max(...hs) - Math.min(...hs));
        const dt = r2(Math.max(...ts) - Math.min(...ts));
        rows.push({ grid: name(g), section: name(g.closest('section') || g), row: i + 1, n: gr.cards.length,
          widths: gr.cards.map((c) => c.w), heights: hs, dh, dt, ragged: dh > 1 || dt > 1 });
      });
    }
  }

  /* buttons in plan cards: one baseline? */
  /* plan buttons on one baseline, per visual row of cards */
  const planButtons = [...document.querySelectorAll('main .ea-plans__grid')].filter(visible).map((g) => {
    const cards = [...g.children].filter(visible);
    const byRow = new Map();
    for (const c of cards) {
      const t = Math.round(c.getBoundingClientRect().top);
      const b = c.querySelector('.ea-btn, .btn');
      if (!b) continue;
      const k = [...byRow.keys()].find((x) => Math.abs(x - t) < 4) ?? t;
      (byRow.get(k) || byRow.set(k, []).get(k)).push(r2(b.getBoundingClientRect().top));
    }
    const spreads = [...byRow.values()].filter((v) => v.length > 1).map((v) => r2(Math.max(...v) - Math.min(...v)));
    return { grid: name(g), section: name(g.closest('section')), rows: byRow.size, spread: spreads.length ? Math.max(...spreads) : null };
  });

  /* rhythm */
  const secs = [...document.querySelectorAll('main > section, main > div > section')].filter(visible);
  const rhythm = secs.map((s, i) => {
    const cs = getComputedStyle(s);
    const b = box(s);
    const next = secs[i + 1];
    return { section: name(s), band: s.dataset.band || '-', y: b.y, h: b.h,
      padTop: parseFloat(cs.paddingTop), padBottom: parseFloat(cs.paddingBottom),
      gapToNext: next ? r2(box(next).y - (b.y + b.h)) : null };
  });

  /* overlap: text leaves */
  const leaves = [...document.querySelectorAll('main *')].filter((el) => {
    if (!visible(el)) return false;
    if (el.closest('svg')) return false;
    return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
  });
  /* the boxes the WORDS occupy, from the text nodes, not the element box: a
     full width paragraph is mostly empty space and is no collision. */
  const glyphs = new Map();
  const rects = (el) => {
    if (glyphs.has(el)) return glyphs.get(el);
    const out = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const q of r.getClientRects()) if (q.width > 0.5 && q.height > 0.5) out.push(q);
    }
    glyphs.set(el, out);
    return out;
  };
  const rect = (el) => el.getBoundingClientRect();
  const anyHit = (as, bs) => as.some((a) => bs.some((b) => hit(a, b)));
  const hit = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
  const collisions = [];
  for (let i = 0; i < leaves.length; i++) {
    const a = leaves[i];
    const ra = rect(a);
    for (let j = i + 1; j < leaves.length; j++) {
      const b = leaves[j];
      if (a.contains(b) || b.contains(a)) continue;
      const rb = rect(b);
      if (!hit(ra, rb)) continue;
      if (!anyHit(rects(a), rects(b))) continue;
      collisions.push(`${name(a)} "${a.textContent.trim().slice(0, 30)}" x ${name(b)} "${b.textContent.trim().slice(0, 30)}"`);
    }
  }
  /* floating cards over the screen's words */
  const floats = [];
  document.querySelectorAll('main .ea-stage').forEach((st) => {
    const f = st.querySelector('.ea-stage__float');
    const scr = st.querySelector('.ea-stage__screen');
    if (!f || !scr || !visible(f)) return;
    const rf = rect(f);
    const covered = leaves.filter((l) => scr.contains(l) && rects(l).some((q) => hit(q, rf)));
    if (covered.length) floats.push(`${name(st.closest('section'))}: float covers ${covered.length} text box(es): ` + covered.slice(0, 4).map((l) => `"${l.textContent.trim().slice(0, 24)}"`).join(', '));
  });

  /* horizontal overflow */
  const vw = document.documentElement.clientWidth;
  const clips = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true;
    }
    return false;
  };
  const over = [...document.querySelectorAll('main *')].filter((el) => visible(el) && rect(el).right > vw + 1 && !clips(el)).slice(0, 8).map((el) => `${name(el)} right ${r2(rect(el).right)}`);

  /* type */
  const roles = {
    h1: 'main h1', h2: 'main h2', h3: 'main h3', h4: 'main h4',
    'facts value': 'main .ea-facts__value', 'plan amount': 'main .ea-plan__amount, main [class*="plan__amount"], main [class*="price__amount"]',
    'band value': 'main [class*="__val"]', 'stat': 'main [class*="stat"]',
  };
  const type = {};
  for (const [role, sel] of Object.entries(roles)) {
    const els = [...document.querySelectorAll(sel)].filter(visible);
    if (!els.length) continue;
    type[role] = {};
    for (const el of els) {
      const cs = getComputedStyle(el);
      const fs = cs.fontSize;
      const lh = parseFloat(cs.lineHeight) || parseFloat(fs) * 1.2;
      const lines = Math.round(el.getBoundingClientRect().height / lh);
      const k = fs;
      (type[role][k] ||= []).push(lines > 1 ? `${el.textContent.trim().slice(0, 22)} [${lines} lines]` : el.textContent.trim().slice(0, 22));
    }
  }
  /* any other big type the roles above miss: 28px or more, not a heading */
  const bigOther = [...document.querySelectorAll('main *')].filter((el) => visible(el) && !/^H[1-4]$/.test(el.tagName) &&
    parseFloat(getComputedStyle(el).fontSize) >= 28 && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).map((el) => {
    const cs = getComputedStyle(el);
    const lines = Math.round(el.getBoundingClientRect().height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2));
    return `${name(el)} ${cs.fontSize} "${el.textContent.trim().slice(0, 24)}"${lines > 1 ? ` [${lines} lines]` : ''}`;
  });

  return { screens, rows, planButtons, rhythm, collisions: collisions.slice(0, 40), collisionCount: collisions.length, floats,
    overflow: { scrollWidth: document.documentElement.scrollWidth, vw, elements: over }, type, bigOther };
};

const browser = await chromium.launch();
const report = {};
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const landed = new URL(page.url()).pathname;
    if (!res || res.status() !== 200 || landed.replace(/\/$/, '') !== route.replace(/\/$/, '')) {
      report[`${route}@${w}`] = { error: `status ${res && res.status()} landed ${landed}` };
      continue;
    }
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(PROBE, CARD_GRID);
    /* header over the hero, and over an anchor target */
    m.header = await page.evaluate(() => {
      const h = document.querySelector('header');
      const t = document.querySelector('main h1');
      if (!h || !t) return null;
      const hb = h.getBoundingClientRect().bottom;
      const out = { headerBottom: Math.round(hb), h1Top: Math.round(t.getBoundingClientRect().top), coversH1: hb > t.getBoundingClientRect().top };
      const a = document.querySelector('#what-it-does');
      if (a) {
        a.scrollIntoView();
        const sh = document.querySelector('header').getBoundingClientRect();
        const head = a.querySelector('h2') || a;
        out.anchorHeadingTop = Math.round(head.getBoundingClientRect().top);
        out.anchorHeaderBottom = Math.round(sh.bottom);
        out.coversAnchor = sh.bottom > head.getBoundingClientRect().top;
        window.scrollTo(0, 0);
      }
      return out;
    });
    report[`${route}@${w}`] = m;
  }
  await ctx.close();
}
/* The hero's words against the moving light, sampled from rendered pixels. */
const HERO_TEXT = '.ea-hero .ea-hero__title, .ea-hero .ea-hero__lead, .ea-hero .ea-hero__note';
const FRAMES = [0, 0.125, 0.25, 0.33, 0.42, 0.5, 0.58, 0.66, 0.75, 0.875];
const lum = (r, g, b) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
if (CONTRAST) {
  for (const w of WIDTHS) {
    for (const route of ROUTES) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 1000 }, reducedMotion: 'no-preference' });
      const page = await ctx.newPage();
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const info = await page.evaluate((sel) => {
        const a = document.getAnimations().find((x) => x.effect && x.effect.getTiming().iterations === Infinity && x.effect.target && x.effect.target.closest('.ea-hero'));
        return { dur: a ? a.effect.getTiming().duration : null, name: a ? a.animationName : null,
          colors: [...document.querySelectorAll(sel)].map((e) => ({ el: e.className.split(' ').find((c) => c.startsWith('ea-hero__')), color: getComputedStyle(e).color })) };
      }, HERO_TEXT);
      const key = `${route}@${w}`;
      report[key].contrast = { loop: info.name, worst: {} };
      if (!info.dur) { report[key].contrast.loop = 'NONE RUNNING'; await ctx.close(); continue; }
      await page.addStyleTag({ content: `${HERO_TEXT} { color: transparent !important; }` });
      for (const f of FRAMES) {
        await page.evaluate((t) => {
          const a = document.getAnimations().find((x) => x.effect && x.effect.getTiming().iterations === Infinity && x.effect.target && x.effect.target.closest('.ea-hero'));
          a.pause();
          a.currentTime = t;
        }, f * info.dur);
        await page.waitForTimeout(80);
        const boxes = await page.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => {
          const out = [];
          const rg = document.createRange();
          for (const n of e.childNodes) {
            if (n.nodeType !== 3) continue;
            rg.selectNodeContents(n);
            for (const q of rg.getClientRects()) out.push([q.left, q.top, q.width, q.height]);
          }
          return out;
        }), HERO_TEXT);
        const png = await page.screenshot();
        const px = await page.evaluate(async ({ b64, boxes }) => {
          const img = new Image();
          img.src = 'data:image/png;base64,' + b64;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const g = c.getContext('2d');
          g.drawImage(img, 0, 0);
          return boxes.map((bx) => {
            const all = [];
            for (const [x, y, bw, bh] of bx) {
              const d = g.getImageData(Math.max(0, Math.floor(x)), Math.max(0, Math.floor(y)), Math.max(1, Math.ceil(bw)), Math.max(1, Math.ceil(bh))).data;
              for (let i = 0; i < d.length; i += 12) all.push([d[i], d[i + 1], d[i + 2]]);
            }
            return all;
          });
        }, { b64: png.toString('base64'), boxes });
        info.colors.forEach((e, i) => {
          const m = e.color.match(/[\d.]+/g).map(Number);
          const lt = lum(m[0], m[1], m[2]);
          let min = 99;
          for (const [r, g, b] of px[i]) min = Math.min(min, ratio(lt, lum(r, g, b)));
          const cur = report[key].contrast.worst[e.el];
          if (!cur || min < cur.min) report[key].contrast.worst[e.el] = { min: Math.round(min * 100) / 100, at: f };
        });
      }
      await ctx.close();
    }
  }
}
await browser.close();

if (OUT) fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

/* the summary */
for (const [key, m] of Object.entries(report)) {
  console.log(`\n══ ${key}`);
  if (m.error) { console.log('  ERROR', m.error); continue; }
  console.log('  screens:');
  for (const s of m.screens) console.log(`    ${s.layout.padEnd(6)} ${s.section.padEnd(34)} screen ${s.screen ? `${s.screen.w} x ${s.screen.h}` : 'none'}${s.clipped ? '  CLIPPED' : ''}`);
  const ragged = m.rows.filter((r) => r.ragged);
  console.log(`  card rows: ${m.rows.length}, ragged ${ragged.length}`);
  for (const r of ragged) console.log(`    RAGGED ${r.grid} (${r.section}) row ${r.row}: h ${r.heights.join('/')} dh ${r.dh} dt ${r.dt}`);
  for (const p of m.planButtons) console.log(`  plan buttons ${p.section}: ${p.rows} row(s), button top spread ${p.spread === null ? 'n/a (one card per row)' : p.spread + 'px'}`);
  console.log('  rhythm (band padTop/padBottom, gap):');
  for (const r of m.rhythm) console.log(`    ${r.section.padEnd(40)} ${r.band.padEnd(9)} ${r.padTop}/${r.padBottom}  gap ${r.gapToNext}`);
  console.log(`  text collisions: ${m.collisionCount}`);
  for (const c of m.collisions.slice(0, 10)) console.log(`    ${c}`);
  for (const f of m.floats) console.log(`  FLOAT ${f}`);
  console.log(`  overflow: scrollWidth ${m.overflow.scrollWidth} vs ${m.overflow.vw}${m.overflow.elements.length ? ' ' + m.overflow.elements.join('; ') : ''}`);
  if (m.header) console.log(`  header: bottom ${m.header.headerBottom}, h1 top ${m.header.h1Top}${m.header.coversH1 ? ' COVERS H1' : ''}${m.header.anchorHeadingTop !== undefined ? `, anchor heading ${m.header.anchorHeadingTop} vs header ${m.header.anchorHeaderBottom}${m.header.coversAnchor ? ' COVERS ANCHOR' : ''}` : ''}`);
  console.log('  type:');
  for (const [role, sizes] of Object.entries(m.type)) console.log(`    ${role.padEnd(12)} ${Object.entries(sizes).map(([s, l]) => `${s} x${l.length}${l.some((x) => x.includes('lines]')) ? ' (' + l.filter((x) => x.includes('lines]')).join('; ') + ')' : ''}`).join(' | ')}`);
  if (m.bigOther.length) console.log(`    other >=28px: ${m.bigOther.slice(0, 8).join(' | ')}`);
  if (m.contrast) console.log(`  hero contrast (${m.contrast.loop}, ${FRAMES.length} frames): ` +
    Object.entries(m.contrast.worst).map(([k, v]) => `${k} ${v.min}:1 at t=${v.at}${v.min < 4.5 ? ' BELOW AA' : ''}`).join(', '));
}
