/**
 * icons.ts: the one line icon family of design system version 3.
 *
 * R285-WEB-ENTERPRISE-REDESIGN-01, strategy section 0.8. Drawn for this site on
 * a 24 unit grid, one stroke family: 1.75 units, round caps and joins, no fill.
 * Written here rather than taken from a library, so there is no licence to carry
 * and no glyph the site does not use. components/evidenced/Icon.astro is the
 * only renderer, and it paints with currentColor, so an icon takes the colour
 * of the role it sits in and never names one.
 *
 * Each entry is the inner SVG markup: paths, circles, rects and lines only.
 */
export const ICONS = {
  /* A magnifier over a page: contracts found for you. */
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4 20 20"/><path d="M8 10.5h5M10.5 8v5"/>',
  /* Three sliders: the factors a contract is matched on. */
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  /* An arrow into a tray: upload or forward a tender. */
  upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  /* A shield with a tick: your data is looked after. */
  shield: '<path d="M12 3 5 6v5.5c0 4.2 3 7.7 7 9.5 4-1.8 7-5.3 7-9.5V6l-7-3Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  /* A globe: where the data lives. */
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5Z"/>',
  /* A document with lines: your own files. */
  document: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  /* A pen on a line: write the answers. */
  pen: '<path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  /* Two speech marks: a colleague checks it. */
  chat: '<path d="M5 18.5V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8l-3 2.5Z"/><path d="M9 9.5h6M9 12.5h3.5"/>',
  /* A list with ticks: what you promised. */
  checklist: '<path d="m4 7 1.6 1.6L8.5 5.7M4 14l1.6 1.6 2.9-2.9"/><path d="M12 7h8M12 14h8M12 20h8"/>',
  /* A tick in a circle: done. */
  done: '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.6-4.9"/>',
  /* A circle with a bar: held back, needs your proof (purple, D256). */
  held: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5M12 16.2v.3"/>',
  /* A play mark: the tour video. */
  play: '<circle cx="12" cy="12" r="8.5"/><path d="M10.2 8.8v6.4l5-3.2-5-3.2Z"/>',
  /* Arrows for the carousel. */
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  /* A lock: encryption. */
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  /* Two bars and a bare play mark: the hero aurora's pause button (D293). */
  pause: '<path d="M9 6v12M15 6v12"/>',
  resume: '<path d="M8 5.5v13l10.5-6.5L8 5.5Z"/>',
} as const;

export type IconName = keyof typeof ICONS;
