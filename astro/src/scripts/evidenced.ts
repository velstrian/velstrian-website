/**
 * evidenced.ts: the two behaviours of the evidenced answer system.
 *
 * R285-WEB-ENTERPRISE-REDESIGN-01, strategy section 5.
 *
 *   initCitations  draws each citation line from a numbered marker in an answer
 *                  to the passage it cites. Orthogonal, rounded corners, a
 *                  terminal dot. Measured from the live layout and redrawn on
 *                  resize, so it is exact at every width. Side by side it runs
 *                  through the gap between the panes. Stacked on a phone it
 *                  runs down the reserved right gutter and enters the source
 *                  from its right edge.
 *   initRefusal    arms the refusal moment and plays it once, when the block
 *                  reaches 60 percent of the window height.
 *   initReveal     version 3 section entrance, once, below the fold only.
 *   initSequences  version 3 product sequences on stages, once.
 *   initCarousels  version 3 product carousel, no autoplay.
 *   initTour       the tour video dialog, when data/media.ts has a source.
 *
 * Both are enhancements over complete markup. Without this file the markers
 * are numbered links to their sources and the refusal block shows its
 * finished state. The tabs on the home page are components/ui/TabSwitcher.astro
 * with scripts/tabs.ts, the site's one switcher.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

interface Line {
  path: SVGPathElement;
  dot: SVGCircleElement;
}

function firstRect(el: Element): DOMRect {
  const rects = el.getClientRects();
  return rects.length > 0 ? rects[0] : el.getBoundingClientRect();
}

/** One rounded orthogonal route: out along y1, down the rail, in along y2. */
function route(x1: number, y1: number, rail: number, y2: number, x2: number): string {
  const dy = y2 - y1;
  if (Math.abs(dy) < 1) return `M${x1} ${y1} H${x2}`;
  const r = Math.min(8, Math.abs(dy) / 2, Math.abs(rail - x1), Math.abs(x2 - rail));
  const sy = Math.sign(dy);
  const sx1 = Math.sign(rail - x1) || 1;
  const sx2 = Math.sign(x2 - rail) || 1;
  return (
    `M${x1} ${y1} H${rail - sx1 * r} Q${rail} ${y1} ${rail} ${y1 + sy * r} ` +
    `V${y2 - sy * r} Q${rail} ${y2} ${rail + sx2 * r} ${y2} H${x2}`
  );
}

function drawRoot(root: HTMLElement, lines: Map<string, Line>): void {
  const svg = root.querySelector<SVGSVGElement>('svg[data-cite-svg]');
  if (!svg) return;
  const box = root.getBoundingClientRect();
  if (box.width === 0) return;
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  svg.setAttribute('width', String(box.width));
  svg.setAttribute('height', String(box.height));

  const pane = root.querySelector('[data-cite-pane]');
  const paneBox = pane ? pane.getBoundingClientRect() : box;
  const markers = Array.from(root.querySelectorAll<HTMLElement>('[data-cite-from]'));

  markers.forEach((from, i) => {
    const id = from.dataset.citeFrom ?? '';
    const to = root.querySelector<HTMLElement>(`[data-cite-to="${id}"]`);
    if (!to) return;
    const sheet = to.closest('[data-cite-sheet]') ?? to;
    const a = from.getBoundingClientRect();
    const t = firstRect(to);
    const s = sheet.getBoundingClientRect();

    const x1 = a.right - box.left + 3;
    const y1 = a.top + a.height / 2 - box.top;
    const y2 = t.top + t.height / 2 - box.top;
    const sideBySide = s.left >= paneBox.right - 1;

    let rail: number;
    let x2: number;
    if (sideBySide) {
      const gapLeft = paneBox.right - box.left;
      const gapRight = s.left - box.left;
      rail = gapLeft + (gapRight - gapLeft) * (0.4 + 0.2 * i);
      x2 = gapRight;
    } else {
      rail = box.width - 8 - 10 * i;
      x2 = s.right - box.left;
    }

    let line = lines.get(id);
    if (!line) {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('class', 'ea-cite-line');
      path.setAttribute('pathLength', '1');
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('class', 'ea-cite-dot');
      dot.setAttribute('r', '3.5');
      svg.append(path, dot);
      line = { path, dot };
      lines.set(id, line);
    }
    line.path.setAttribute('d', route(x1, y1, rail, y2, x2));
    line.dot.setAttribute('cx', String(x2));
    line.dot.setAttribute('cy', String(y2));
  });
  root.dataset.citeDrawn = 'on';
}

export function initCitations(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-cite-root]'));
  if (roots.length === 0) return;
  const state = new Map<HTMLElement, Map<string, Line>>();
  const redraw = (root: HTMLElement) => {
    let lines = state.get(root);
    if (!lines) {
      lines = new Map();
      state.set(root, lines);
    }
    drawRoot(root, lines);
  };
  const all = () => roots.forEach(redraw);
  const ro = new ResizeObserver(() => all());
  roots.forEach((r) => ro.observe(r));
  /* A late web font changes line breaks, so the marker moves. Redraw on it. */
  document.fonts.ready.then(all, all);
  all();
}

/**
 * One passive scroll and resize reader, throttled to a frame. Geometry, not an
 * intersection observer: check-motion.js rule 3 keeps observers out of src/
 * because an observer that never fires is how sections were once left hidden.
 * Nothing here hides content, and the reader runs once on load as well.
 */
function onGeometry(fn: () => boolean | void): void {
  let queued = false;
  let done = false;
  const tick = () => {
    queued = false;
    if (!done && fn() === true) {
      done = true;
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    }
  };
  const schedule = () => {
    if (queued || done) return;
    queued = true;
    requestAnimationFrame(tick);
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  schedule();
}

const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initRefusal(): void {
  const block = document.querySelector<HTMLElement>('[data-refusal]');
  if (!block) return;
  if (reduced()) return;
  /* Only a block that starts below the fold is armed. One already on screen
     stays as the finished frame, so nothing a reader is looking at resets. */
  if (block.getBoundingClientRect().top < innerHeight) return;

  block.dataset.play = 'armed';
  onGeometry(() => {
    const r = block.getBoundingClientRect();
    if (r.top > innerHeight * 0.6 || r.bottom < 0) return false;
    requestAnimationFrame(() => {
      block.dataset.play = 'run';
    });
    return true;
  });
}


/**
 * Section entrance (version 3, check-motion.js rule 5). Every [data-reveal]
 * item that starts BELOW the fold is armed (opacity 0, a 24px drop, in
 * styles/evidenced.css) and set to `in` the first time its top passes 85
 * percent of the window height, inside the part of the window a reader is
 * looking at (it was 92 percent, the bottom strip, R285-WEB-SCROLL-MOTION-01).
 * Items in one band stagger 80ms apart in
 * document order. An item already on screen at load is never armed, nothing
 * is armed under reduced motion, and with no script nothing is ever hidden.
 */
export function initReveal(): void {
  if (reduced()) return;
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const vh = innerHeight;
  const armed = items.filter((el) => el.getBoundingClientRect().top > vh);
  if (armed.length === 0) return;
  const perBand = new Map<Element, number>();
  armed.forEach((el) => {
    const band = el.closest('[data-band]') ?? document.body;
    const i = perBand.get(band) ?? 0;
    perBand.set(band, i + 1);
    el.style.setProperty('--reveal-i', String(Math.min(i, 6)));
    el.dataset.reveal = 'armed';
  });
  /* A print or a save as PDF shows everything. */
  addEventListener(
    'beforeprint',
    () => armed.forEach((el) => (el.dataset.reveal = 'in')),
    { once: true },
  );
  const pending = new Set(armed);
  onGeometry(() => {
    const line = innerHeight * 0.85;
    pending.forEach((el) => {
      if (el.getBoundingClientRect().top < line) {
        el.dataset.reveal = 'in';
        pending.delete(el);
      }
    });
    return pending.size === 0;
  });
}

/**
 * Product sequences (components/evidenced/Sequence.astro). A card marked
 * `load` plays as soon as the page is up. A card marked `view` is armed only
 * when it starts below the fold or inside a hidden tab panel, and plays the
 * first time it is in view and laid out. A tab switch counts as a geometry
 * change, so a sequence in a newly shown panel plays then.
 */
export function initSequences(): void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.ea-seq[data-seq]'));
  if (cards.length === 0) return;
  if (reduced()) {
    cards.forEach((c) => (c.dataset.seqState = 'done'));
    return;
  }
  const run = (c: HTMLElement) => {
    c.dataset.seqState = 'run';
  };
  const pending = new Set<HTMLElement>();
  cards.forEach((c) => {
    if (c.dataset.seq === 'load') {
      requestAnimationFrame(() => requestAnimationFrame(() => run(c)));
      return;
    }
    const r = c.getBoundingClientRect();
    if (r.width === 0 || r.top > innerHeight) {
      c.dataset.seqState = 'armed';
      pending.add(c);
    }
  });
  if (pending.size === 0) return;
  const check = (): boolean => {
    const line = innerHeight * 0.85;
    pending.forEach((c) => {
      const r = c.getBoundingClientRect();
      if (r.width > 0 && r.top < line && r.bottom > 0) {
        requestAnimationFrame(() => run(c));
        pending.delete(c);
      }
    });
    return pending.size === 0;
  };
  onGeometry(check);
  /* A tab switch changes what is laid out without a scroll. */
  document.addEventListener('click', () => requestAnimationFrame(() => check()));
  document.addEventListener('keyup', () => requestAnimationFrame(() => check()));
}

/**
 * The product carousel (components/evidenced/ProductCarousel.astro). Turns the
 * scroll strip into a paged control: arrows, a counter, the arrow keys while
 * focus is inside, and a horizontal swipe. No autoplay, ever.
 */
export function initCarousels(): void {
  document.querySelectorAll<HTMLElement>('[data-car]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-car-track]');
    const viewport = root.querySelector<HTMLElement>('[data-car-viewport]');
    const controls = root.querySelector<HTMLElement>('[data-car-controls]');
    const prev = root.querySelector<HTMLButtonElement>('[data-car-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-car-next]');
    const n = root.querySelector<HTMLElement>('[data-car-n]');
    if (!track || !viewport || !controls || !prev || !next || !n) return;
    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length < 2) return;
    let i = 0;
    /* ADAPTIVE HEIGHT (R285-WEB-REVIEW-2026-10-22 item 7). The track used to
       take the TALLEST slide's height and centre the rest, so at 1440 the
       "Your bids" screen (493px) sat in a 715px viewport with about 170px of
       empty stage above and below it, and at 375 the library capture (169px)
       had 268px each side. The viewport now takes the shown slide's height, so
       every screen has exactly the stage padding around it at every width. */
    const fit = () => {
      const shown = slides[i]?.firstElementChild as HTMLElement | null;
      if (shown) root.style.setProperty('--car-h', `${shown.getBoundingClientRect().height}px`);
    };
    const go = (to: number) => {
      i = Math.max(0, Math.min(slides.length - 1, to));
      root.style.setProperty('--car-i', String(i));
      fit();
      n.textContent = String(i + 1);
      slides.forEach((s, k) => {
        s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        s.inert = k !== i;
      });
      prev.setAttribute('aria-disabled', i === 0 ? 'true' : 'false');
      next.setAttribute('aria-disabled', i === slides.length - 1 ? 'true' : 'false');
    };
    viewport.scrollLeft = 0;
    root.dataset.car = 'on';
    controls.hidden = false;
    slides.forEach((s, k) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', `${k + 1} of ${slides.length}`);
    });
    go(0);
    /* A slide changes height when the column resizes or a lazy capture lands. */
    const watch = new ResizeObserver(fit);
    slides.forEach((s) => {
      if (s.firstElementChild) watch.observe(s.firstElementChild);
    });
    prev.addEventListener('click', () => go(i - 1));
    next.addEventListener('click', () => go(i + 1));
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        go(i - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        go(i + 1);
        e.preventDefault();
      }
    });
    let x0: number | null = null;
    let y0 = 0;
    viewport.addEventListener(
      'pointerdown',
      (e) => {
        x0 = e.clientX;
        y0 = e.clientY;
      },
      { passive: true },
    );
    viewport.addEventListener(
      'pointerup',
      (e) => {
        if (x0 === null) return;
        const dx = e.clientX - x0;
        const dy = e.clientY - y0;
        x0 = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1));
      },
      { passive: true },
    );
    viewport.addEventListener(
      'pointercancel',
      () => {
        x0 = null;
      },
      { passive: true },
    );
  });
}

/**
 * The tour dialog (components/evidenced/TourDialog.astro). Opens the native
 * dialog, never starts the video, and pauses it on close.
 */
export function initTour(): void {
  const dialog = document.querySelector<HTMLDialogElement>('dialog[data-tour]');
  const open = document.querySelector<HTMLElement>('[data-tour-open]');
  if (!dialog || !open) return;
  const video = dialog.querySelector('video');
  open.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', () => {
    if (video) video.pause();
    open.focus();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}

export function initEvidenced(): void {
  initReveal();
  initSequences();
  initCarousels();
  initTour();
  initCitations();
  initRefusal();
}
