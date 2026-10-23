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
 *   - hover, focus inside the cards, a hidden tab or the block off screen:
 *     suspended, and it carries on from the same card when they end. Hover
 *     and focus on the block's own buttons never suspend it: until
 *     2026-10-23 they did, so clicking play suspended the block it had just
 *     started (measured on /bid/, "run" and card 1 for 16 seconds).
 * While it moves, the list is aria-live="off". Stopped, it is "polite".
 *
 * Geometry is read on scroll and resize, never through an observer
 * (check-motion.js rule 3). Nothing is hidden at any point: every card is in
 * the page and readable whatever the timer is doing.
 */

import { autoplay } from './autoplay';

function init(root: HTMLElement): void {
  const controls = root.querySelector<HTMLElement>('[data-fc-controls]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-fc-toggle]');
  const prev = root.querySelector<HTMLButtonElement>('[data-fc-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-fc-next]');
  const count = root.querySelector<HTMLElement>('[data-fc-n]');
  const list = root.querySelector<HTMLElement>('[data-fc-list]');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-fc-card]'));
  if (!controls || !toggle || !prev || !next || !count || !list || cards.length < 2) return;

  const last = cards.length - 1;
  let i = 0;
  let run = false;

  const paint = () => {
    count.textContent = String(i + 1);
    prev.setAttribute('aria-disabled', String(i === 0));
    next.setAttribute('aria-disabled', String(i === last));
    list.setAttribute('aria-live', run ? 'off' : 'polite');
    cards.forEach((c, k) => {
      c.toggleAttribute('data-current', k === i);
      c.removeAttribute('data-tick');
    });
    if (run) {
      /* Two frames, so the bar paints empty before it starts to fill. */
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (run) cards[i].setAttribute('data-tick', '');
      }));
    }
  };

  /* The timer, the pause button and every rule about when it may move are
     the shared device in scripts/autoplay.ts. This file only paints a card. */
  const ap = autoplay({
    root,
    controls,
    toggle,
    steps: cards.length,
    interval: Number(root.dataset.fcInterval),
    labels: { pause: 'Pause the steps', play: 'Play the steps' },
    show: (k) => {
      i = k;
    },
    paint: (state, k) => {
      i = k;
      run = state === 'run';
      root.dataset.fcPlay = state === 'held' ? 'hold' : state;
      paint();
    },
  });
  if (!ap) return;

  const go = (to: number) => {
    i = Math.max(0, Math.min(last, to));
    ap.chose(i);
    paint();
    if (root.dataset.fcLayout === 'snap') cards[i].scrollIntoView({ block: 'nearest', inline: 'start' });
  };
  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));

  root.dataset.fc = 'on';
  root.dataset.fcPlay ??= 'wait';
  cards[0].setAttribute('data-current', '');
}

export function initFlashCards(): void {
  document.querySelectorAll<HTMLElement>('[data-fc]').forEach(init);
}
