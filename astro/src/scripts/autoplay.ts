/**
 * autoplay.ts: the site's ONE automatic advance, shared by every block that
 * moves on its own (R285-WEB-AUTOPLAY-01, owner report 2026-10-23).
 *
 * WHO USES IT. The home hero answer screen (rotator.ts initRotators), the
 * product screens carousel (carousel.ts initCarousels, ProductCarousel with
 * `autoplay`), the "what it does" capability tabs (tabs.ts, TabSwitcher with
 * `autoplay`) and the FlashCards steps blocks (flashcards.ts). Each supplies
 * how to show step `i`. The timing, the pause button and every rule below live
 * here once, so the four cannot drift apart.
 *
 * WHY IT EXISTS. Owner, 2026-10-23: "screens are not automatically switching
 * into the sections, tried play and pause button as well". Measured on :8093
 * at 1440: the hero, the carousel and the capability tabs had no timer at all,
 * and on /bid/ the steps block showed "run" after its play button was clicked
 * and then sat on card 1 for 16 seconds against a 7 second interval. The cause
 * was in flashcards.ts: focus inside the block suspended it, and clicking the
 * play button puts focus on the play button, so play suspended itself. Here
 * hover and focus on the block's OWN CONTROLS never hold it, which is the APG
 * carousel pattern: pressing play is an explicit request to move.
 *
 * THE RULES (WCAG 2.2.2, the APG carousel pattern, D305 driver decision D2):
 *   - It plays ONCE through and rests on the last step. It never loops. Play
 *     after the last step starts again from the first.
 *   - It starts when the block first reaches the window, so the reader sees
 *     step 1, and it holds while the block is off screen.
 *   - Under prefers-reduced-motion, and on a window under 700px wide, it never
 *     starts and its pause button stays hidden: a pause that pauses nothing
 *     advertises a capability that is not there.
 *   - The pause button stops it, and its label says what a press will do.
 *   - Hover or focus on the content, or a hidden tab, only HOLD it, and it
 *     carries on from the same step when they end. None of those is a choice.
 *   - A reader's own choice (previous, next, a tab, a swipe) stops it for good.
 *
 *   - ONE AT A TIME. Only one block on a page runs at once, so a reader never
 *     has two things moving in front of them (D305 driver decision D2): the
 *     one they last pressed play on, or else the one nearest the middle of
 *     the window. The others wait as `held`, and while a block the reader
 *     paused is on screen nothing else starts.
 *
 * `root.dataset.autoplay` is the state, read by check-autoplay.mjs: `wait`
 * (not yet seen), `run`, `held`, `stop`, and `data-autoplay-step` the step
 * the device believes is showing. The gate checks that against what is
 * actually painted, so a counter that moves over a frozen screen still fails. Geometry is read on scroll and resize,
 * never through an observer (check-motion.js rule 3).
 */

export type AutoplayState = 'wait' | 'run' | 'held' | 'stop';

/** Milliseconds per step when a block names none. */
export const AUTOPLAY_DWELL = 7000;

export const autoplayAllowed = (): boolean =>
  !matchMedia('(prefers-reduced-motion: reduce)').matches && !matchMedia('(max-width: 699px)').matches;

export interface AutoplayOptions {
  /** The block. Hover and focus on it hold the timer. */
  root: HTMLElement;
  /** The block's own controls. Hover and focus here never hold it. */
  controls: HTMLElement;
  toggle: HTMLButtonElement;
  steps: number;
  interval?: number;
  labels: { pause: string; play: string };
  /** Show step `i`. Called on every automatic move and on a restart. */
  show: (i: number) => void;
  /** Told the state after every change, for a block's own painting. */
  paint?: (state: AutoplayState, i: number) => void;
}

export interface Autoplay {
  /** The reader chose step `i` themselves. Stops the timer for good. */
  chose: (i: number) => void;
}

/**
 * ONE AT A TIME. Of the blocks that could move, the one the reader last
 * pressed play on moves, or failing that the one nearest the middle of the
 * window. Every other block waits as `held`.
 */
interface Block {
  /** Paused by the reader's own press, and still on screen. */
  calm: () => boolean;
  eligible: () => boolean;
  dist: () => number;
  sync: () => void;
}
const blocks = new Set<Block>();
let turn: Block | null = null;
let claimed: Block | null = null;

function decide(): void {
  turn = null;
  /* A reader who pressed pause asked for stillness, so nothing else on
     screen starts moving beside the block they paused. Measured on /bid/
     before this rule: pausing the steps let the carousel above them take the
     turn, and its height change moved the play button under the pointer. */
  let best = Infinity;
  if (claimed && claimed.eligible()) turn = claimed;
  else if (![...blocks].some((b) => b.calm())) {
    blocks.forEach((b) => {
      const d = b.eligible() ? b.dist() : Infinity;
      if (d < best) {
        best = d;
        turn = b;
      }
    });
  }
  blocks.forEach((b) => b.sync());
}

export function autoplay(o: AutoplayOptions): Autoplay | null {
  const { root, controls, toggle } = o;
  const last = o.steps - 1;
  if (last < 1 || !autoplayAllowed()) return null;
  const ms = o.interval || AUTOPLAY_DWELL;
  let i = 0;
  let seen = false;
  let stopped = false;
  let paused = false; // stopped by the pause button, not by the end of the run
  let timer = 0;
  let state: AutoplayState | '' = '';

  const away = (): boolean => {
    const r = root.getBoundingClientRect();
    return r.width === 0 || r.bottom <= 0 || r.top >= innerHeight;
  };
  const own = (el: Element | null) => Boolean(el && controls.contains(el));
  const held = (): boolean => {
    const hover = root.matches(':hover') && !controls.matches(':hover');
    const focus = root.contains(document.activeElement) && !own(document.activeElement);
    return document.hidden || away() || hover || focus;
  };

  const me: Block = {
    calm: () => paused && !away(),
    eligible: () => seen && !stopped && !held(),
    dist: () => {
      const r = root.getBoundingClientRect();
      return Math.abs(r.top + r.height / 2 - innerHeight / 2);
    },
    sync: () => {
      const next: AutoplayState = !seen ? 'wait' : stopped ? 'stop' : turn === me ? 'run' : 'held';
      if (next !== 'run') {
        clearTimeout(timer);
        timer = 0;
      } else if (!timer) {
        timer = window.setTimeout(() => {
          timer = 0;
          i += 1;
          if (i >= last) {
            i = last;
            stopped = true;
          }
          o.show(i);
          state = '';
          decide();
        }, ms);
      }
      if (next === state) return;
      state = next;
      root.dataset.autoplay = next;
      root.dataset.autoplayStep = String(i);
      toggle.setAttribute('aria-label', stopped ? o.labels.play : o.labels.pause);
      o.paint?.(next, i);
    },
  };

  let queued = false;
  const geometry = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (!seen) {
        const r = root.getBoundingClientRect();
        seen = r.width > 0 && r.top < innerHeight * 0.75 && r.bottom > 0;
      }
      decide();
    });
  };

  toggle.addEventListener('click', () => {
    if (stopped && i === last) {
      i = 0;
      o.show(0);
    }
    stopped = !stopped;
    paused = stopped;
    seen = true;
    /* Pressing play is the reader asking for THIS block to move. */
    claimed = stopped ? (claimed === me ? null : claimed) : me;
    decide();
  });
  ['pointerover', 'pointerout', 'focusin', 'focusout'].forEach((t) => root.addEventListener(t, geometry));
  ['scroll', 'resize'].forEach((t) => addEventListener(t, geometry, { passive: true }));
  document.addEventListener('visibilitychange', geometry);

  blocks.add(me);
  controls.hidden = false;
  geometry();
  return {
    chose: (k) => {
      i = Math.max(0, Math.min(last, k));
      stopped = true;
      paused = false;
      seen = true;
      if (claimed === me) claimed = null;
      decide();
    },
  };
}
