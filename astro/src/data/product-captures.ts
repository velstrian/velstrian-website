/**
 * product-captures.ts: which product frame shows a real capture.
 *
 * R285-WEB-ENTERPRISE-REDESIGN-01. Every product frame on a page built from the
 * evidenced answer system names one key below. While the value is `null` the
 * frame renders its HTML recreation of the real screen and a visible
 * "Example data" caption, so a recreation is never mistaken for a customer
 * screenshot. When the capture lane (R285-WEB-PRODUCT-SCREENSHOTS-01) lands a
 * file in Assets/product-captures/, changing the one entry here swaps the frame
 * to the image, and the caption changes to say what the capture shows.
 *
 * A capture comes from staging and a neutral demo organisation, never from a
 * customer, and its caption still says so.
 */
import real from './product-captures.real.json';
import screens from './product-screens.json';

export interface Capture {
  /** Served path, for example /Assets/product-captures/bid-answer-1440.webp */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** What the capture shows, printed under the frame. */
  caption: string;
  /** A tighter crop served below 600px, where the full crop's words would be too
   *  small to read. Same screen, same caption. */
  narrow?: { src: string; width: number; height: number };
  /**
   * The part of the capture to show, in the same CSS pixels as `width` and
   * `height`, for a capture too wide to read whole (owner review 2026-10-22,
   * R285-WEB-REVIEW-2026-10-22 item 2: the feed card drew its words a few
   * pixels tall at 732px and was cut mid line on a phone). `wide` serves 600px
   * and up, `phone` below it. Both crop the ONE file at `src`, so a recapture
   * from staging swaps that file and nothing else, as long as the card keeps
   * its layout. Each region ends where whole words end, never mid line.
   */
  view?: { wide: CropView; phone: CropView };
  /**
   * Where the picture comes from. Absent or 'real' is a real capture from the
   * demo account on staging. 'figma' is a product design with example data
   * (R285-WEB-FIGMA-SCREENS-01), served only for a slot with no real capture,
   * and its frame prints "Example data. Product design." before the page's own
   * caption so it is never read as a real screen.
   */
  source?: 'real' | 'figma';
}

/** A region of a capture: left, top, width and height in CSS pixels. */
export interface CropView {
  x: number;
  y: number;
  w: number;
  h: number;
}

/*
 * The real staging captures (R285-WEB-PRODUCT-SCREENSHOTS-01, commit 74de8702,
 * Assets/product-captures/manifest.json): neutral demo organisation Northfield
 * Facilities Services Ltd on staging, an invented tender, invented evidence,
 * never a customer. Each is CROPPED to its clearest panel into
 * Assets/product-captures/web/ at 2x, as WebP. Width and height are the CSS size
 * (half the pixels).
 *
 * Deliberately NOT used, and why (driver brief 2026-10-21):
 *   bid-answer-with-sources.png as citations. A product defect
 *     (R285-BID-ANSWER-SOURCES-01) makes its source chip cite the tender, not
 *     the library, so the crop below stops above that chip and the caption says
 *     only that the answer was drafted from the library. The hero keeps the
 *     HTML answer with sources.
 *   bid-decide-bid-no-bid-fit.png. It shows a low fit because the demo
 *     organisation has no track record. Decide stays an HTML recreation.
 *   bid-review-sign-off.png. It paints a red "requirements covered" pill and a
 *     "Fail" state, and the site carries no red (D256). Check stays HTML until
 *     the app moves its problem states to purple and it is re-captured.
 *   bid-find-mobile.png and bid-answer-mobile.png. The feed shot names a
 *     public body by a word the site never prints, and the answer shot shows
 *     the tender citation defect. The desktop crops serve every width.
 */
/*
 * R285-WEB-REAL-SCREENSHOTS-01 (2026-10-22): the four hand cropped DARK captures
 * above were replaced by LIGHT captures from the harness, written to the same
 * file names, so their hand entries (FIND_FEED, ANSWER_LIST, ANSWER_LIBRARY,
 * REFUSAL_REAL) were removed rather than left describing a picture that is no
 * longer in the file. Their slots now read product-captures.real.json. The
 * reasons above for leaving decide, check and the mobile shots out still hold,
 * and the harness enforces them (it refuses a weak fit, a retired brand word and
 * any word the site never prints).
 */

/*
 * R285-WEB-REAL-SCREENSHOTS-01. The capture harness
 * (crowagent-platform/web/e2e/product-captures/website.spec.ts) signs in to
 * STAGING as the demo organisation, captures each slot in the light theme at
 * 2x, writes the WebP into Assets/product-captures/web/ and records the slot,
 * its size, its crop regions, alt and caption in product-captures.real.json.
 * An entry there wins over the hand entry below, so a recapture is a harness
 * run and nothing else. A slot with no entry anywhere keeps its drawn
 * recreation and its "Example data" caption, so nothing is deleted before a
 * real screen exists for it.
 */
interface RealFile {
  entries: Record<string, Capture>;
}
const REAL: Record<string, Capture> = (real as RealFile).entries;

const HAND: Record<string, Capture | null> = {
  'home-hero-answer': null,
  'home-who-small': null,
  'home-who-team': null,
  'home-who-buyer': null,
  'home-cap-find': null,
  'home-cap-decide': null,
  'home-cap-answer': null,
  'home-cap-check': null,
  'home-cap-deliver': null,
  'home-refusal-check': null,
  /* The bento tiles (components/evidenced/CapsBento.astro). Their own keys,
     because /walkthrough/ shows home-cap-decide and home-cap-deliver full
     width, and a tile about 320 wide needs a tighter crop to stay readable
     (R285-WEB-BENTO-CROP-01). */
  'home-tile-decide': null,
  'home-tile-deliver': null,
  /* The product carousel, components/evidenced/Screens.astro. */
  'home-car-board': null,
  'home-car-answer': null,
  'home-car-refusal': null,
  'home-car-deliver': null,
  /* /contact/ "What you will see on the call": the call opens where most
     people start, the morning feed. */
  'contact-call-find': null,
  /* components/evidenced/ProductScreen.astro: the one screen on /compare/,
     the comparisons, /sectors/, the sector pages and /partners/. These
     replaced Figma drawings that carried the old brand inside the picture. */
  'screen-find': null,
  'screen-answer-list': null,
  'screen-answer-library': null,
  'screen-evidence': null,
  'screen-buyer-requirement': null,
  'screen-buyer-delivery': null,
  'screen-insights': null,
  'screen-action-centre': null,
  /* Slots on /about/, /bid/ and /buy/ that read a key with no entry until
     this row registered them. Listed so the inventory and the harness name
     the same set of slots. */
  'about-hero': null,
  'bid-hero': null,
  'bid-decide': null,
  'bid-check': null,
  'bid-deliver': null,
  'buy-hero': null,
  'buy-boundary-gate': null,
  'buy-cap-request': null,
  'buy-cap-collect': null,
  'buy-cap-compare': null,
  'buy-cap-evidence': null,
  'buy-cap-decision': null,
};

/*
 * R285-WEB-REAL-SCREENSHOTS-01 (2026-10-23): a slot the harness cannot capture
 * from staging today shows the closest Figma design instead of a drawn HTML
 * recreation. REAL always wins: a slot listed here that later gains a real
 * capture shows the capture, with no edit here. The reason each slot has no
 * real capture yet is in docs/design/R285-REAL-SCREENSHOTS-PLAN.md. Only a slot
 * that would otherwise show a drawn mock up is listed: a slot whose frame holds a
 * live or animated block (the home hero citations, the refusal checks) keeps it
 * (driver decision 2026-10-23, check-autoplay and check-app-contrast). The served
 * WebP files are written by scripts/build-product-screens.mjs from the PNG
 * masters listed in product-screens.json.
 */
const FIGMA_FOR_SLOT: Record<string, string> = {
  'about-hero': 'screen-response-answer',
  'home-who-small': 'panel-feed',
  'screen-buyer-delivery': 'screen-supplier-promises',
  'buy-cap-collect': 'panel-submissions',
  'buy-cap-compare': 'panel-whole-life-costs',
  'buy-cap-evidence': 'screen-buyer-evaluation',
  'buy-cap-decision': 'panel-after-award',
};

interface ScreenItem {
  slug: string;
  kind: 'screen' | 'panel';
  width: number;
  height: number;
  alt: string;
}
const ITEMS: ScreenItem[] = (screens as { items: ScreenItem[] }).items;

function figma(slug: string): Capture {
  const item = ITEMS.find((i) => `${i.kind}-${i.slug}` === slug);
  if (!item) throw new Error(`product-screens.json has no Figma item "${slug}"`);
  // A panel is exported at 2x (1200 by 900 for a 600 by 450 panel), a screen at 1x.
  const scale = item.kind === 'panel' ? 2 : 1;
  return {
    src: `/Assets/product-screens/web/${item.kind}-${item.slug}.webp`,
    width: item.width / scale,
    height: item.height / scale,
    alt: item.alt,
    caption: '',
    source: 'figma',
  };
}
const FIGMA: Record<string, Capture> = Object.fromEntries(
  Object.entries(FIGMA_FOR_SLOT).map(([key, slug]) => [key, figma(slug)]),
);

/** Every slot key: a real capture where one exists, then a Figma design, otherwise null. */
export const CAPTURES: Record<string, Capture | null> = Object.fromEntries(
  Object.keys({ ...HAND, ...REAL }).map((key) => [key, REAL[key] ?? FIGMA[key] ?? HAND[key] ?? null]),
);
