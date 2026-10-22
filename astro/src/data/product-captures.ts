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
const FIND_FEED: Capture = {
  src: '/Assets/product-captures/web/find-feed-card.webp',
  width: 1100,
  height: 210,
  alt: 'A live public contract in the Velstrian Bid feed: CVG close and cleaning contract 2027 to 2029, Clyde Valley Housing Association, facilities management, Scotland, published 5 days ago, relevance 55 percent, with Open in Velstrian Bid, Find on Find a Tender and Save buttons.',
  caption: 'A real screen from a demo account: one contract in the morning feed, with how relevant it is to you.',
  narrow: { src: '/Assets/product-captures/web/find-feed-card-narrow.webp', width: 515, height: 210 },
};
const ANSWER_LIST: Capture = {
  src: '/Assets/product-captures/web/answer-question-list.webp',
  width: 333,
  height: 690,
  alt: 'The list of tender questions in Velstrian Bid, each marked AI drafted, with where the draft came from, a word count against its limit, and No source found on the answers that still need proof.',
  caption: 'A real screen from a demo account: every question drafted, each one showing where it came from or that it still needs proof.',
};
const ANSWER_LIBRARY: Capture = {
  src: '/Assets/product-captures/web/answer-from-library.webp',
  width: 800,
  height: 273,
  alt: 'A drafted answer in Velstrian Bid about keeping six public buildings clean, safe and well maintained, 222 of 300 words.',
  caption: 'A real screen from a demo account: an answer drafted from your library.',
};
const REFUSAL_REAL: Capture = {
  src: '/Assets/product-captures/web/refusal-no-source.webp',
  width: 800,
  height: 462,
  alt: 'Question 6 asks for a carbon cut in tonnes. The drafted answer says no carbon reduction target is recorded and sets out how a baseline will be measured instead. Below it: drafted with AI, no source recorded.',
  caption: 'A real screen from a demo account: asked for a figure it had no proof of, it said so instead of inventing one.',
};

export const CAPTURES: Record<string, Capture | null> = {
  'home-hero-answer': null,
  'home-who-small': null,
  'home-who-team': null,
  'home-who-buyer': null,
  'home-cap-find': FIND_FEED,
  'home-cap-decide': null,
  'home-cap-answer': ANSWER_LIST,
  'home-cap-check': null,
  'home-cap-deliver': null,
  'home-refusal-check': null,
  /* The product carousel, components/evidenced/Screens.astro. */
  'home-car-board': null,
  'home-car-answer': ANSWER_LIBRARY,
  'home-car-refusal': REFUSAL_REAL,
  'home-car-deliver': null,
  /* /contact/ "What you will see on the call": the call opens where most
     people start, the morning feed. */
  'contact-call-find': FIND_FEED,
  /* components/evidenced/ProductScreen.astro: the one screen on /compare/,
     the comparisons, /sectors/, the sector pages and /partners/. These
     replaced Figma drawings that carried the old brand inside the picture. */
  'screen-find': FIND_FEED,
  'screen-answer-list': ANSWER_LIST,
  'screen-answer-library': ANSWER_LIBRARY,
  'screen-evidence': null,
  'screen-buyer-requirement': null,
  'screen-buyer-delivery': null,
  'screen-insights': null,
  'screen-action-centre': null,
};
