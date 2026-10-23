import { autoplay } from './autoplay';

/**
 * The hero answer screen (components/evidenced/Hero.astro): a few questions in
 * one cell, one painted at a time. Previous and next work everywhere. The
 * automatic advance is scripts/autoplay.ts, so it never runs under reduced
 * motion or on a phone, and any move the reader makes stops it for good. The
 * screen's title bar names the question on show.
 */
export function initRotators(): void {
  document.querySelectorAll<HTMLElement>('[data-rot]').forEach((root) => {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-rot-item]'));
    const controls = root.querySelector<HTMLElement>('[data-rot-controls]');
    const toggle = root.querySelector<HTMLButtonElement>('[data-rot-toggle]');
    const prev = root.querySelector<HTMLButtonElement>('[data-rot-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-rot-next]');
    const n = root.querySelector<HTMLElement>('[data-rot-n]');
    if (items.length < 2 || !controls || !toggle || !prev || !next || !n) return;
    const frame = root.closest('.ea-frame');
    const title = frame?.querySelector('.ea-frame__title');
    const status = frame?.querySelector('.ea-frame__status');
    let i = 0;
    const show = (k: number) => {
      i = Math.max(0, Math.min(items.length - 1, k));
      const it = items[i];
      items.forEach((x, j) => {
        x.toggleAttribute('data-current', j === i);
        x.inert = j !== i;
        x.setAttribute('aria-hidden', String(j !== i));
      });
      n.textContent = (it.dataset.rotTitle ?? '').replace(/^Question (\d+).*/, '$1');
      if (title && it.dataset.rotTitle) title.textContent = it.dataset.rotTitle;
      if (status && it.dataset.rotStatus) status.textContent = it.dataset.rotStatus;
      prev.setAttribute('aria-disabled', String(i === 0));
      next.setAttribute('aria-disabled', String(i === items.length - 1));
    };
    root.dataset.rot = 'on';
    show(0);
    const ap = autoplay({
      root,
      controls,
      toggle,
      steps: items.length,
      labels: { pause: 'Pause the answers', play: 'Play the answers' },
      show,
    });
    controls.hidden = false;
    if (ap) toggle.hidden = false;
    const pick = (k: number) => {
      show(k);
      ap?.chose(i);
    };
    prev.addEventListener('click', () => pick(i - 1));
    next.addEventListener('click', () => pick(i + 1));
  });
}
