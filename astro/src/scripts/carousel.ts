/**
 * carousel.ts: the paged product carousel, ProductCarousel.astro and the
 * /walkthrough/ Walkthrough.astro. Moved out of evidenced.ts on 2026-10-23
 * (R285-WEB-AUTOPLAY-01) so the pages with no carousel stop downloading it
 * on every route, and so its automatic advance, scripts/autoplay.ts, reaches
 * only the pages that move.
 */
import { autoplay } from './autoplay';

const PASSIVE = { passive: true };

function attrs(el: Element, a: Record<string, string | number>): void {
  for (const k in a) el.setAttribute(k, String(a[k]));
}

/**
 * The product carousel (components/evidenced/ProductCarousel.astro). Turns the
 * scroll strip into a paged control: arrows, a counter, the arrow keys while
 * focus is inside, and a horizontal swipe. A carousel rendered with
 * `autoplay` also moves once through on its own, through scripts/autoplay.ts,
 * and any move the reader makes stops that for good.
 */
export function initCarousels(): void {
  document.querySelectorAll<HTMLElement>('[data-car]').forEach((root) => {
    /* Two components on one page may both load this. Set up once. */
    if (root.dataset.car === 'on') return;
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
    /* The walkthrough's step names (components/evidenced/Walkthrough.astro). */
    const steps = root.querySelectorAll<HTMLElement>('[data-car-step]');
    const paint = () => {
      root.style.setProperty('--car-i', String(i));
      fit();
      n.textContent = String(i + 1);
      slides.forEach((s, k) => {
        s.setAttribute('aria-hidden', String(k !== i));
        s.inert = k !== i;
      });
      steps.forEach((s, k) => (k === i ? s.setAttribute('aria-current', 'step') : s.removeAttribute('aria-current')));
      prev.setAttribute('aria-disabled', String(i === 0));
      next.setAttribute('aria-disabled', String(i === slides.length - 1));
    };
    /* A screen slides in only once its picture is decoded, never half drawn.
       A picture that fails to decode still shows, with its alt text. */
    const ready = (s?: HTMLElement): Promise<unknown> =>
      Promise.all(
        Array.from(s?.querySelectorAll('img') ?? [], (img) => {
          img.loading = 'eager';
          return img.decode().catch((e: unknown) => console.warn('carousel: a screen did not decode', img.currentSrc, e));
        }),
      );
    let want = 0;
    const go = (to: number) => {
      want = Math.max(0, Math.min(slides.length - 1, to));
      const t = want;
      ready(slides[t]).then(() => {
        if (t !== want) return;
        i = t;
        paint();
        ready(slides[i + 1]);
      });
    };
    viewport.scrollLeft = 0;
    root.dataset.car = 'on';
    controls.hidden = false;
    const toggle = root.querySelector<HTMLButtonElement>('[data-car-toggle]');
    const ap = toggle
      ? autoplay({
          root,
          controls,
          toggle,
          steps: slides.length,
          labels: { pause: 'Pause the screens', play: 'Play the screens' },
          show: go,
        })
      : null;
    if (toggle && ap) toggle.hidden = false;
    /* Every move the reader makes is a choice, so the timer stops for good. */
    const pick = (to: number) => {
      go(to);
      ap?.chose(want);
    };
    slides.forEach((s, k) => attrs(s, { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${k + 1} of ${slides.length}` }));
    paint();
    /* The next screen is fetched once the visitor reaches for the carousel,
       never on page load, so it is ready before Next is pressed. */
    const warm = () => ready(slides[want + 1]);
    root.addEventListener('pointerenter', warm, { once: true });
    root.addEventListener('focusin', warm, { once: true });
    root.querySelectorAll<HTMLElement>('[data-car-to]').forEach((b) =>
      b.addEventListener('click', () => {
        pick(Number(b.dataset.carTo));
        /* A button inside a slide is about to go inert, so focus stays in the carousel. */
        if (track.contains(b)) viewport.focus();
      }),
    );
    /* A slide changes height when the column resizes or a lazy capture lands. */
    const watch = new ResizeObserver(fit);
    slides.forEach((s) => {
      if (s.firstElementChild) watch.observe(s.firstElementChild);
    });
    prev.addEventListener('click', () => pick(want - 1));
    next.addEventListener('click', () => pick(want + 1));
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        pick(want - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        pick(want + 1);
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
      PASSIVE,
    );
    viewport.addEventListener(
      'pointerup',
      (e) => {
        if (x0 === null) return;
        const dx = e.clientX - x0;
        const dy = e.clientY - y0;
        x0 = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) pick(want + (dx < 0 ? 1 : -1));
      },
      PASSIVE,
    );
    viewport.addEventListener(
      'pointercancel',
      () => {
        x0 = null;
      },
      PASSIVE,
    );
  });
}
