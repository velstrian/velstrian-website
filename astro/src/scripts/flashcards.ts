/**
 * flashcards.ts: the steps timer of components/ui/FlashCards.astro (owner
 * direction D305, driver decision D2, R285-WEB-IMAGERY-AND-DISCLOSURE-01 lane C).
 *
 * WHAT IT DOES. In a steps block the highlight moves from one card to the next
 * every `data-fc-interval` ms, ONCE, and rests on the last card. It never
 * loops. It starts when the block first comes into view, not on load, so a
 * reader who scrolls to it sees it from the first step.
 *
 * WHAT STOPS IT (WCAG 2.2.2, the APG carousel pattern, check-autoplay.mjs):
 *   - prefers-reduced-motion: reduce, or a window under 700px wide: it never
 *     starts, and the controls stay hidden, because a pause button that pauses
 *     nothing advertises a capability the reader then finds does nothing.
 *   - the pause button, the first control in the block. Its label says what a
 *     press will do ("Pause the steps", "Play the steps"), so it carries no
 *     aria-pressed. Play after the last step starts again from the first.
 *   - previous or next: a reader's choice, so the timer stops for good.
 *   - hover, focus inside the block, or a hidden tab: suspended, and it
 *     carries on from the same card when they end. None of those is a choice.
 * While it moves, the list is aria-live="off". Stopped, it is "polite".
 *
 * Geometry is read on scroll and resize, never through an observer
 * (check-motion.js rule 3). Nothing is hidden at any point: every card is in
 * the page and readable whatever the timer is doing.
 */

const narrow = (): boolean => matchMedia('(max-width: 699px)').matches;
const reduced = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

function init(root: HTMLElement): void {
  const controls = root.querySelector<HTMLElement>('[data-fc-controls]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-fc-toggle]');
  const prev = root.querySelector<HTMLButtonElement>('[data-fc-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-fc-next]');
  const count = root.querySelector<HTMLElement>('[data-fc-n]');
  const list = root.querySelector<HTMLElement>('[data-fc-list]');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-fc-card]'));
  if (!controls || !toggle || !prev || !next || !count || !list || cards.length < 2) return;
  if (reduced() || narrow()) return;

  const ms = Number(root.dataset.fcInterval) || 7000;
  const last = cards.length - 1;
  let i = 0;
  let stopped = false; // the reader paused, chose a card, or the run ended
  let held = false; // hover, focus or a hidden tab, which only suspend
  let timer = 0;

  const paint = () => {
    const running = !stopped && !held;
    root.dataset.fcPlay = stopped ? 'stop' : 'run';
    list.setAttribute('aria-live', running ? 'off' : 'polite');
    toggle.setAttribute('aria-label', stopped ? 'Play the steps' : 'Pause the steps');
    count.textContent = String(i + 1);
    prev.setAttribute('aria-disabled', String(i === 0));
    next.setAttribute('aria-disabled', String(i === last));
    cards.forEach((c, k) => {
      c.toggleAttribute('data-current', k === i);
      c.removeAttribute('data-tick');
    });
    if (running) {
      /* Two frames, so the bar paints empty before it starts to fill. */
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!stopped && !held) cards[i].setAttribute('data-tick', '');
      }));
    }
  };

  const clear = () => {
    clearTimeout(timer);
    timer = 0;
  };

  const arm = () => {
    clear();
    if (stopped || held) return;
    timer = window.setTimeout(() => {
      i += 1;
      if (i >= last) {
        i = last;
        stopped = true;
      }
      paint();
      arm();
    }, ms);
  };

  const go = (to: number) => {
    i = Math.max(0, Math.min(last, to));
    stopped = true;
    clear();
    paint();
    if (root.dataset.fcLayout === 'snap') cards[i].scrollIntoView({ block: 'nearest', inline: 'start' });
  };

  const hold = (on: boolean) => {
    held = on || document.hidden;
    paint();
    arm();
  };

  toggle.addEventListener('click', () => {
    if (stopped) {
      if (i === last) i = 0;
      stopped = false;
    } else {
      stopped = true;
    }
    paint();
    arm();
  });
  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));
  root.addEventListener('pointerenter', () => hold(true));
  root.addEventListener('pointerleave', () => hold(root.contains(document.activeElement)));
  root.addEventListener('focusin', () => hold(true));
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget as Node | null)) hold(root.matches(':hover'));
  });
  document.addEventListener('visibilitychange', () => hold(root.contains(document.activeElement) || root.matches(':hover')));

  root.dataset.fc = 'on';
  root.dataset.fcPlay = 'wait';
  controls.hidden = false;
  cards[0].setAttribute('data-current', '');

  /* Start once the block is in view, read on scroll and resize. */
  const seen = () => {
    const r = root.getBoundingClientRect();
    if (r.width === 0 || r.top > innerHeight * 0.75 || r.bottom < 0) return;
    removeEventListener('scroll', seen);
    removeEventListener('resize', seen);
    paint();
    arm();
  };
  addEventListener('scroll', seen, { passive: true });
  addEventListener('resize', seen, { passive: true });
  seen();
}

export function initFlashCards(): void {
  document.querySelectorAll<HTMLElement>('[data-fc]').forEach(init);
}
