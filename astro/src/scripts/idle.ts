/* ============================================================================
   IDLE: run page behaviour after the first paint, one small task at a time.
   ============================================================================

   A-520, 2026-11-04. Measured on the built home page with Lighthouse mobile:
   every module script ran its set-up straight away, and the first one to read
   geometry (getBoundingClientRect, offsetWidth, scrollWidth) forced the whole
   document's first style and layout inside its own task, before the browser
   had painted anything. The hero lead paragraph, which is the largest
   contentful paint, then waited behind all of that script, and the set-up ran
   as one long task that counted in full towards total blocking time.

   Nothing here changes WHAT a behaviour does. It changes WHEN it starts:

   - afterPaint waits for the frame the browser is about to draw, then runs on
     the next task, so the first paint happens before the work does.
   - whenIdle runs when the main thread has a gap, and never later than its
     timeout, so a behaviour always starts within a fraction of a second.

   Each call is its own task, so several set-ups queued one after the other no
   longer add up to one long task.

   A tab opened in the background does not draw frames, so afterPaint also
   starts on a short timer and whichever comes first wins. Content stays
   readable throughout: every behaviour here is an enhancement over finished
   markup, the same contract motion.ts states in its own header. */

/** Run `fn` once the browser has drawn the current frame. */
export function afterPaint(fn: () => void): void {
  let queued = false;
  const go = (): void => {
    if (queued) return;
    queued = true;
    setTimeout(fn, 0);
  };
  requestAnimationFrame(go);
  setTimeout(go, 100);
}

/** Run `fn` in the next idle gap, and at the latest after `timeout` ms. */
export function whenIdle(fn: () => void, timeout = 300): void {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => fn(), { timeout });
  } else {
    afterPaint(fn);
  }
}
