/* ============================================================================
   TABS: one switcher mechanism for the whole site, and one source of truth
   for which panel is showing.
   ============================================================================

   WHY THIS EXISTS. The owner, 2026-08-03, on /pricing:

     "there is issue in price page why everything is visible by deafult if
      thats the case why we need the product switcher?"

   That was accurate. The rebuilt /pricing rendered a two-pill control that
   looked like a switcher and was a pair of in-page anchor links: both audience
   sections were `display: block` at all times, so the control changed nothing
   it appeared to control. Measured on the running build before this file
   existed: `#suppliers` 1089px tall and `#buyers` 1279px tall, both visible,
   both `role: null`, zero `[role="tablist"]` and zero `[role="tabpanel"]` on
   the document.

   THE OWNER ASKED FOR THE SWITCHING BEHAVIOUR EXPLICITLY, and it is recorded in
   the legacy markup it was dropped from (`pricing.html`, the comment above
   `.ptabs`, 2026-07-29): "we must have both things as separate and must provide
   end users to switch for product for private and public suite". The price is
   shared between the two sides; the capabilities are not.

   ── WHY A SHARED MODULE RATHER THAN A SCRIPT ON /pricing ────────────────────

   The legacy site solved this once per page. `js/modules/pricing-tabs-panel.js`
   knew the id suffix `-p`, knew a hardcoded list of comparison-table ids, and
   was loaded by exactly one route; a second tabbed surface would have been a
   second copy of the same 120 lines with its own drift. The same failure the
   card recipe and the heading scale already went through on this site.

   So the contract here is data attributes, not names:

     [data-tabs]        the container. Becomes role="tablist".
     data-tabs-label    its accessible name. Carried as data rather than as
                        `aria-label` in the markup, because aria-label on a
                        generic <div> with no role names nothing; it only starts
                        meaning something once role="tablist" lands, which is
                        here.
     a[data-tab="ID"]   a tab. ID is the element id of the panel it controls,
                        and the anchor's href is `#ID`, so the control is a real
                        link before any of this runs.
     data-tab-default   optional, on one tab: the panel shown when the URL names
                        none. Falls back to the first tab.
     [data-tab-for="ID"] optional, on any element ANYWHERE on the page: a control
                        that only means something while one of the named panels
                        is showing. Space-separated for more than one. Hidden
                        whenever the selected panel is not among them.

   ── WHY [data-tab-for] IS PART OF THE SWITCHER AND NOT A PAGE SCRIPT ────────

   O-57, owner, 2026-08-04: /pricing's monthly/annual switch stays live on the
   "For buyers" tab, where buyer pricing is "Contact sales" and there is no
   monthly or annual figure for it to move. A control that cannot change
   anything is worse than a missing one, because a reader presses it and
   concludes the page is broken rather than that the choice does not exist.

   The reference build carries a `data-no-billing-toggle` attribute on its buyer
   panel that nothing anywhere reads. A hook somebody left for a behaviour that
   was never written. The behaviour is wanted now, so it is written here, once,
   in the file that already owns which panel is showing. A second script on
   /pricing watching the same state would be a second answer to the same
   question, and the two would disagree the first time either was edited.

   The attribute goes on the CONTROL rather than on the panel, so the page says
   what it means ("this switch belongs to the supplier plans") instead of
   leaving a reader to infer it from an exclusion listed on something else.

   HIDING IS REAL, NOT VISUAL. `hidden` takes the element out of the tab order
   and out of the accessibility tree, which is the whole point: an inert control
   must not be reachable by keyboard or announced. What `hidden` does NOT
   reliably do is paint, because the user agent rule behind it is a bare
   `display: none` that any author `display` declaration outranks. A call site
   that gives a marked element a `display` of its own therefore has to say what
   `[hidden]` means for it; /pricing does, beside the rule that made it
   necessary.

   Nothing in this file knows what a pricing page is. Any route that renders
   `components/ui/TabSwitcher.astro` over elements that already have ids gets
   the identical widget, including the parts nobody remembers to write twice:
   roving tabindex, Home/End, the hash, and the cross-panel anchor rescue below.

   ── PROGRESSIVE ENHANCEMENT IS THE POINT, NOT A CONCESSION ──────────────────

   The legacy page shipped `<div id="buyers-p" style="display:none" hidden>` in
   the HTML. With JavaScript off or broken, an entire priced offering was
   invisible with no way to reach it, and that is why the Astro rebuild removed
   the mechanism rather than porting it. Deleting the switcher was the wrong
   half of a correct objection.

   This keeps both halves. The server renders every panel visible and the tabs
   as ordinary in-page links, which is a page that works. This module then
   upgrades that page into a tablist. If it never runs, the reader sees exactly
   what the reader saw yesterday and every link still resolves.

   The one thing enhancement cannot do from here is avoid painting the
   un-selected panel first, because the tabs sit in a sticky bar ABOVE the
   panels and a synchronous script at that point cannot see elements the parser
   has not reached. TabSwitcher.astro handles that in three lines of inline
   bootstrap, and the reason it is written the way it is, is recorded there.

   ── STATE LIVES IN ONE PLACE ────────────────────────────────────────────────

   `aria-selected` on the tab is the state. There is no companion class, so the
   accessible state and the painted state cannot disagree; the stylesheet reads
   the same attribute assistive technology does. That is also why nothing here
   touches classList: a class would be a second source of truth for the one
   thing this file exists to own.
   ========================================================================== */

/** A tab and the panel it controls, resolved once at set-up. */
interface Pair {
  tab: HTMLAnchorElement;
  panel: HTMLElement;
}

/** The panel ids an element's `data-tab-for` names. Empty if it carries none. */
function panelsNamedBy(el: HTMLElement): string[] {
  return (el.dataset.tabFor ?? '').split(/\s+/).filter(Boolean);
}

/**
 * Upgrade every `[data-tabs]` group under `root`.
 *
 * Idempotent: a group that has already been set up is skipped, so this may be
 * called again after content is injected without doubling up its listeners.
 */
export function initTabs(root: ParentNode = document): void {
  for (const group of Array.from(root.querySelectorAll<HTMLElement>('[data-tabs]'))) {
    setUp(group);
  }
}

function setUp(group: HTMLElement): void {
  if (group.dataset.tabsReady === 'true') return;

  const pairs: Pair[] = [];
  for (const tab of Array.from(group.querySelectorAll<HTMLAnchorElement>('a[data-tab]'))) {
    const id = tab.dataset.tab;
    const panel = id ? document.getElementById(id) : null;
    if (panel) pairs.push({ tab, panel });
  }

  /*
   * Fewer than two resolved panels is not a switcher, and pretending otherwise
   * would hide content behind a control that cannot reveal it. Leave the
   * anchors alone: un-upgraded, they still navigate, which is the baseline this
   * whole file is layered on top of.
   */
  if (pairs.length < 2) return;
  group.dataset.tabsReady = 'true';

  group.setAttribute('role', 'tablist');
  const vertical = group.dataset.orientation === 'vertical';
  if (vertical) group.setAttribute('aria-orientation', 'vertical');
  const label = group.dataset.tabsLabel;
  if (label) group.setAttribute('aria-label', label);

  for (const { tab, panel } of pairs) {
    if (!tab.id) tab.id = `tab-${panel.id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    /*
     * Section.astro already points a section's `aria-labelledby` at its own
     * heading, which names the panel better than the tab does ("CrowMark for
     * Suppliers" against "For suppliers"). Only supply the tab as the label
     * where nothing has named the panel yet.
     */
    if (!panel.hasAttribute('aria-labelledby')) {
      panel.setAttribute('aria-labelledby', tab.id);
    }
  }

  /*
   * The panel-specific controls THIS group governs. Searched across the whole
   * document, because such a control is not inside the panel it belongs to
   * (/pricing's billing switch sits beside the tabs in the sticky bar, above
   * both panels), and claimed only when EVERY id it names is one of this
   * group's panels. A second switcher elsewhere on the page therefore cannot
   * reach it, and an attribute naming an id nothing renders is ignored rather
   * than silently hiding a control forever.
   */
  const controls = Array.from(document.querySelectorAll<HTMLElement>('[data-tab-for]')).filter(
    (el) => {
      const named = panelsNamedBy(el);
      return named.length > 0 && named.every((id) => pairs.some((p) => p.panel.id === id));
    },
  );

  /*
   * ── KEEP THE SELECTED TAB INSIDE THE TROUGH ────────────────────────────────
   *
   * `.tabsw` scrolls sideways once the labels outrun the width, which is the
   * homepage showcase on any phone: measured on the built page at 390 the five
   * pills are 572px inside a 306px trough, so 266px of the control is off its
   * own edge. Nothing ever scrolled it, so after two autoplay ticks the pill
   * carrying `aria-selected` was outside the visible run and a reader saw a
   * segmented control with NOTHING selected in it while the counter under it
   * read "3 of 5". The owner reported exactly that from an iPhone 16 Pro Max.
   *
   * THE STRIP IS SCROLLED, NOT THE TAB. `Element.scrollIntoView` walks every
   * scrollable ancestor, so it would drag the PAGE to the showcase on load and
   * again on every autoplay tick. Writing `scrollLeft` on the trough itself can
   * only ever move the trough.
   *
   * SMOOTH ONLY WHERE MOTION IS WELCOME, read at call time rather than cached,
   * so turning the preference on stops the easing without a reload. Under
   * `reduce` the strip still moves, it simply arrives.
   *
   * RECTS AND `clientLeft`, NOT `offsetLeft`, AND THAT WAS MEASURED RATHER THAN
   * PREFERRED. `offsetLeft` is counted from the nearest POSITIONED ancestor,
   * and the trough is `position: static`: read off the built page at 390, all
   * five tabs report their offset from `.ps__showcase` instead, so every figure
   * carried a constant 41px of the panel's own padding. The first tab clamped
   * to zero and hid it; the middle three were quietly scrolled 41px too far.
   * The difference of two rects plus `clientLeft` is the distance from the
   * trough's own padding edge whatever is positioned above it.
   *
   * THE TROUGH IS `position: relative` AS OF 2026-08-31 AND THIS FUNCTION IS
   * DELIBERATELY UNCHANGED. The gliding fill needs the trough to be the offset
   * parent, so `offsetLeft` now answers correctly and the paragraph above no
   * longer describes today's stylesheet. It is kept because the reasoning is
   * still the reasoning: this function asks where a tab is IN THE VIEWPORT, so
   * that it can decide how far to scroll the strip, and that is a question no
   * offset property answers at any time. Two nearby measurements, two different
   * questions, and the rect is the right instrument for this one either way.
   */
  const keepTabInView = (tab: HTMLElement): void => {
    const room = group.scrollWidth - group.clientWidth;
    if (room <= 0) return;
    const from = group.getBoundingClientRect().left + group.clientLeft;
    const box = tab.getBoundingClientRect();
    /* Both terms are read in the same frame, so a scroll still easing towards
       its last target cancels out of the sum rather than compounding. */
    const delta = box.left - from - (group.clientWidth - box.width) / 2;
    const left = Math.max(0, Math.min(group.scrollLeft + delta, room));
    if (Math.abs(left - group.scrollLeft) < 1) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    group.scrollTo({ left, behavior: still ? 'auto' : 'smooth' });
  };

  /*
   * ── THE CAPSULE GLIDES, 2026-08-31 ─────────────────────────────────────────
   *
   * Owner: switching stage should carry the selected capsule across the trough
   * rather than snap it. There is no React on this site, so there is no
   * `layoutId` to hand it to. What that API does is measure the target's box
   * and animate ONE element between two rects, and that is precisely what is
   * built here: `ui/TabSwitcher.astro` renders a single absolutely positioned
   * fill and this writes the selected tab's own x and width onto the group as
   * custom properties. The travel, the easing and the stillness under
   * `prefers-reduced-motion` are all declared in that stylesheet, where a
   * design value belongs.
   *
   * MEASURED, NEVER COMPUTED FROM A LABEL LENGTH OR A COUNT. The five homepage
   * pills are five different widths, the type scale is fluid, and the trough
   * scrolls: every one of those makes an arithmetic guess wrong at some
   * viewport. `offsetLeft` and `offsetWidth` are the browser's own answer.
   *
   * AND `offsetLeft` IS CORRECT HERE FOR A REASON THAT WAS NOT TRUE YESTERDAY.
   * The note on `keepTabInView` below records that this property was measured
   * and rejected, because the trough was `position: static` and every tab
   * therefore reported its offset from `.ps__showcase` with 41px of that
   * panel's padding baked in. The trough is `position: relative` as of this
   * change, precisely so it is the offset parent, so the figure is now the
   * distance from the trough's own padding edge, which is the coordinate space
   * the fill is positioned in. `keepTabInView` still uses rects and is
   * untouched: it is asking a different question, about the viewport.
   *
   * NOTHING HAPPENS WITHOUT THE ELEMENT. A call site whose markup carries no
   * `[data-tabs-glide]` gets no attribute, no listener and no observer, and its
   * selected pill keeps painting its own fill.
   */
  const glide = group.querySelector<HTMLElement>('[data-tabs-glide]');
  /* `set` before anything has moved: positioned, and not yet allowed to
     travel. The stylesheet gives the transition to `on` alone, which is what
     stops the fill sliding in from the trough's left edge on first paint. */
  if (glide) group.dataset.glide = 'set';

  /** Put the fill on one tab. Two numbers, both the browser's own. */
  const place = (tab: HTMLElement): void => {
    if (!glide) return;
    group.style.setProperty('--glide-x', `${tab.offsetLeft}px`);
    group.style.setProperty('--glide-w', `${tab.offsetWidth}px`);
  };

  /** Show one panel and mark its tab. The only place either state is written. */
  const select = (id: string, moveFocus: boolean): void => {
    for (const { tab, panel } of pairs) {
      const on = panel.id === id;
      tab.setAttribute('aria-selected', String(on));
      /* Roving tabindex: one stop in the tab order for the whole group, per the
         ARIA tabs pattern. Arrow keys move within it. */
      tab.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      if (on) {
        keepTabInView(tab);
        place(tab);
      }
      if (on && moveFocus) tab.focus();
    }
    /* `hidden` and nothing else. It is the one attribute that removes an element
       from the tab order and from the accessibility tree at the same time, so
       the control cannot be tabbed to or announced while it is inert, and no
       second state has to be kept in step with it. */
    /* NO FOCUS RESCUE HERE, AND THAT WAS MEASURED RATHER THAN ASSUMED. Hiding
       the element the caret sits in normally drops focus to <body>, so a rescue
       looked necessary. The only route that can reach it is a hash change
       arriving with focus already on the control (Back, or a pasted URL), and
       fragment navigation blurs the active element itself, after the
       `hashchange` listener has run. Focusing the newly selected tab from here
       was tried and the caret still ended on <body>: same outcome, one branch
       that never survives its own turn. A click cannot reach it either, because
       clicking a tab focuses that tab first. */
    for (const el of controls) {
      el.hidden = !panelsNamedBy(el).includes(id);
    }
    /* A panel shown without a scroll, so a product sequence inside it can
       play (evidenced.ts initSequences listens for this). */
    group.dispatchEvent(new Event('tabs:select', { bubbles: true }));
  };

  /*
   * replaceState, not a hash assignment. Writing `location.hash` pushes a
   * history entry and makes the browser jump to the element, which fights the
   * sticky bar: the panels differ in height, so a native anchor jump on every
   * tab press moved the page under the control the reader had just pressed.
   * The legacy script reached the same conclusion for the same reason.
   */
  const writeHash = (id: string): void => {
    window.history.replaceState(null, '', `#${id}`);
  };

  const panelFor = (id: string): Pair | undefined =>
    pairs.find((p) => p.panel.id === id);


  group.addEventListener('click', (event) => {
    const tab = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[data-tab]');
    if (!tab || !group.contains(tab)) return;
    /* A modified click is a request for a new tab or window. These are real
       links; let the browser honour that rather than swallowing it. */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    const id = tab.dataset.tab;
    if (!id || !panelFor(id)) return;
    event.preventDefault();
    select(id, false);
    writeHash(id);
  });

  /*
   * THE KEYBOARD HALF OF THE ARIA TABS PATTERN. Only a focused tab can send a
   * keydown here: the group holds the tabs and an aria-hidden fill and nothing
   * else. It used to also answer a synthesised arrow from the stepper buttons,
   * which stepped from the SELECTED tab rather than the focused one and so had
   * to leave focus where it was. The steppers were removed on 2026-10-17 with
   * their only caller, ProductScreens.astro, so a keydown that did not start
   * on a tab is no longer a case this handler has, and focus always follows.
   */
  group.addEventListener('keydown', (event) => {
    const current = pairs.findIndex(({ tab }) => tab === document.activeElement);
    if (current === -1) return;

    let next = current;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        /* Down only in a vertical list, Right only in a row, per the ARIA tabs
           pattern's aria-orientation. */
        if ((event.key === 'ArrowDown') !== vertical) return;
        next = (current + 1) % pairs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        if ((event.key === 'ArrowUp') !== vertical) return;
        next = (current - 1 + pairs.length) % pairs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = pairs.length - 1;
        break;
      case ' ':
        /* Space activates a role="tab". Activation is already a no-op here
           because the arrows select as they move, but without this the browser
           treats the anchor as a link and scrolls the page instead, which is
           the wrong answer to the right key. */
        event.preventDefault();
        return;
      default:
        return;
    }

    event.preventDefault();
    const id = pairs[next].panel.id;
    /* A key press moves focus with the selection, per the roving tabindex. */
    select(id, true);
    writeHash(id);
  });

  /*
   * CROSS-PANEL ANCHOR RESCUE. Any other in-page link can point at something
   * inside a panel that is not currently showing, and /pricing has one: the
   * hero's "See the plans" targets `#suppliers`. Pressed while the buyer panel
   * is up, it would scroll to a hidden element and appear to do nothing.
   *
   * Capture phase, so the panel is revealed before the browser resolves the
   * jump and the scroll lands in the right place on the first press.
   */
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.hasAttribute('data-tab')) return;
      const id = decodeURIComponent(link.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      const owner = pairs.find(({ panel }) => panel === target || panel.contains(target));
      if (!owner || !owner.panel.hidden) return;
      select(owner.panel.id, false);
    },
    true,
  );

  /* A hash arriving from anywhere else (the browser's Back button, a pasted
     URL, a link in the footer) selects the panel it names. */
  window.addEventListener('hashchange', () => {
    const hit = panelFor(decodeURIComponent(window.location.hash.slice(1)));
    if (hit) {
      select(hit.panel.id, false);
    }
  });

  const fromHash = panelFor(decodeURIComponent(window.location.hash.slice(1)));
  const fallback =
    pairs.find(({ tab }) => tab.dataset.tabDefault !== undefined) ?? pairs[0];
  select((fromHash ?? fallback).panel.id, false);

  /*
   * ── AND IT IS RE-MEASURED, BECAUSE A PILL IS NOT A FIXED WIDTH ─────────────
   *
   * `--t-body` is a clamp and the labels are set in a webfont, so a pill's
   * width changes when the viewport is dragged, when the reader enlarges their
   * text, and once more when the font finishes loading and the fallback's
   * metrics are replaced. A fill measured once is wrong after any of the three,
   * and it would be wrong SILENTLY: a capsule sitting a few pixels off the word
   * it is naming reads as a rendering fault rather than as a stale number.
   *
   * ResizeObserver rather than a resize listener, because the trough is
   * `inline-flex` and tracks its own content: it changes size when the FONT
   * lands as well as when the window does, and a window listener sees only one
   * of those. Its first callback fires straight after `observe`, which is what
   * lifts the fill out of `set` into `on` for the first time, so there is no
   * separate start-up path to keep in step with this one.
   *
   * PARKED FOR THE DURATION OF THE MOVE. A resize is not a selection, so the
   * fill must not ease towards its new box: dragging a window edge would leave
   * it perpetually chasing the pill. `set` removes the transition, the two
   * properties are written, and the next frame restores it in time for whatever
   * the reader does next.
   */
  if (glide && typeof ResizeObserver === 'function') {
    new ResizeObserver(() => {
      const hit = pairs.find(({ tab }) => tab.getAttribute('aria-selected') === 'true');
      if (!hit) return;
      group.dataset.glide = 'set';
      place(hit.tab);
      requestAnimationFrame(() => {
        group.dataset.glide = 'on';
      });
    }).observe(group);
  }

  /* The autoplay removed on 2026-10-17 (R285-P2-WEBSITE-ASTRO-GATES-RED-IN-CI-01)
     went with its only caller. The opt in timer added 2026-10-23 went the same
     way on 2026-10-24 with the home page Capabilities tabs, which the bento
     replaced (R285-WEB-PREMIUM-CARDS-01). */
}
