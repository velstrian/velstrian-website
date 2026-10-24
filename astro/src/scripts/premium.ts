/**
 * premium.ts: the two behaviours of the premium card system
 * (R285-WEB-PREMIUM-CARDS-01, styles/premium.css).
 *
 * 1. RAIL ARROWS. Each `[data-rail]` (components/ui/Rail.astro) ships its
 *    previous and next buttons hidden. They show only once this runs AND the
 *    row actually overflows, so a reader never meets a dead button. Each
 *    press scrolls by one card, smoothly unless reduced motion is asked for,
 *    and each button is disabled at its end. Swipe, trackpad, the keyboard on
 *    the focused row and the focus scroll all work with no script.
 * 2. THE SPOTLIGHT. Under a fine pointer, with motion allowed, a soft light
 *    follows the pointer inside a card (--spot-x and --spot-y). One delegated
 *    listener, written once per frame. Never on touch.
 *
 * 3. THE NAV'S TEMPERATURE (R285-WEB-GEMINI-UIUX P1-2). A page that opens on
 *    a light band renders its header in the light scope (Nav.astro `tone`).
 *    While a dark band or a stage is under the bar, the scope comes off and
 *    the opaque bar paints the dark roles, and it goes back over a light
 *    band. Read once per frame on scroll, from the point just under the bar.
 *
 * Nothing here starts a timer or a loop, so check-autoplay sees no change.
 */

const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initRail(root: HTMLElement): void {
  const track = root.querySelector<HTMLElement>('.ea-rail__track');
  const nav = root.querySelector<HTMLElement>('.ea-rail__nav');
  const prev = root.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-rail-next]');
  if (!track || !nav || !prev || !next) return;

  let queued = false;
  const update = (): void => {
    queued = false;
    const max = track.scrollWidth - track.clientWidth;
    const overflow = max > 1;
    nav.hidden = !overflow;
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= max - 1;
    root.dataset.railEnd = String(!overflow || track.scrollLeft >= max - 1);
  };
  const queue = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  const step = (dir: number): void => {
    const card = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const by = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: dir * by, behavior: reduced() ? 'auto' : 'smooth' });
  };
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  track.addEventListener('scroll', queue, { passive: true });
  new ResizeObserver(queue).observe(track);
  update();
}

const SPOT = '.ea-card:not(.ea-card--plain, form), .ea-bento__tile';

function initSpotlight(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduced()) return;
  let target: HTMLElement | null = null;
  let x = 0;
  let y = 0;
  let queued = false;
  const paint = (): void => {
    queued = false;
    if (!target) return;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--spot-x', `${Math.round(x - r.left)}px`);
    target.style.setProperty('--spot-y', `${Math.round(y - r.top)}px`);
  };
  document.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>(SPOT) : null;
      if (!el) return;
      target = el;
      x = e.clientX;
      y = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    },
    { passive: true },
  );
}

function initNavTone(): void {
  const nav = document.getElementById('ca-nav');
  if (!nav || !nav.classList.contains('on-light')) return;
  let queued = false;
  const update = (): void => {
    queued = false;
    const y = nav.getBoundingClientRect().bottom + 1;
    const under = document.elementFromPoint(window.innerWidth / 2, y);
    // An open menu or the palette sits over the page: keep the bar as it is.
    if (!under || nav.contains(under)) return;
    const band = under.closest('.band, footer');
    nav.classList.toggle('on-light', !(band && band.matches('.band--dark, .band--stage, footer')));
  };
  const queue = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  update();
}

let started = false;

export function initPremium(): void {
  if (started) return;
  started = true;
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach(initRail);
  initSpotlight();
  initNavTone();
}
