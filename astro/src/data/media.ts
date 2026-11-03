/**
 * media.ts: the promo video, written in one place.
 *
 * R285-WEB-ENTERPRISE-REDESIGN-01, strategy section 0.8 "Imagery and media".
 * The three promo drafts were judged too slow and are being re-cut from the
 * real product captures. When the re-cut lands, set `src` (and `poster`) here
 * and every "Watch the tour" button on the site appears, opening
 * components/evidenced/TourDialog.astro. While `src` is null the button and the
 * dialog are not rendered at all, so a reader never meets a control that plays
 * nothing.
 *
 * The player never autoplays and never starts with sound: it opens on the
 * poster and the reader presses play (check-autoplay.mjs).
 */
export interface TourVideo {
  /** Served path of the mp4 or webm, for example /Assets/video/tour-90.mp4 */
  src: string | null;
  /** Poster frame shown before play. */
  poster: string | null;
  /** Visible button label and the dialog's accessible name. */
  label: string;
  /** Captions track, WebVTT, when there is one. */
  captions: string | null;
}

/*
 * R285-WEB-PROMO-VIDEOS-01 (2026-10-23): V1 "Velstrian Bid in 60 seconds", a real
 * recording of the staging demo organisation, voiced and captioned word for word.
 * Built by crowagent-platform/scripts/media (videos.json, build_videos.py), which
 * writes these three files, so a re-cut or a new logo is a rebuild and nothing
 * here changes. The cut runs just under a minute, so the label says one minute.
 */
export const TOUR_VIDEO: TourVideo = {
  src: '/Assets/video/velstrian-bid-in-60-seconds.mp4',
  poster: '/Assets/video/velstrian-bid-in-60-seconds-poster.webp',
  label: 'Watch the one minute tour',
  captions: '/Assets/video/velstrian-bid-in-60-seconds.vtt',
};

/*
 * R29-CONTENT-KIRO-CREW-01 / A-506. The product video series: two voiced
 * walkthroughs (supplier and buyer) and eight voiced feature shorts, recorded
 * from the real staging product by the Kiro crew, voice over plus a music bed,
 * captions burned to WebVTT word for word from the narration. The source cuts
 * live in marketing/content-2026-11/videos/clips/voiced-v2/ and the web cuts
 * served here are re-encoded to 720p (longs) and 720x1280 (shorts) so the
 * videoTotal budget holds. Every file carries an audio stream (checked with
 * ffmpeg volumedetect, mean -18 dB), a poster and a .vtt caption track. The
 * players never autoplay and never start with sound (check-autoplay.mjs).
 *
 * This is the ONE place the web video set is named (RULE 0-C). The "See it in
 * action" page, the /bid/ and /buy/ product pages and the help centre all read
 * from here, so a re-cut or a new file is a change in one place.
 */
export interface JourneyVideo {
  /** Stable id, also the asset basename under /Assets/videos/ (repo root, copied by copy-assets.js; A-516: a /assets/ path is rewritten to /Assets/ by _redirects and 404s on the case-sensitive host). */
  id: string;
  /** Which journey it belongs to. */
  product: 'bid' | 'buy';
  /** 'walkthrough' for the long journey video, 'short' for a feature cut. */
  kind: 'walkthrough' | 'short';
  /** Visible title and the player's accessible name. */
  title: string;
  /** One plain sentence of what the viewer sees, for the page and the summary. */
  summary: string;
  /** Served mp4 path. */
  src: string;
  /** Poster frame shown before play (WebP). */
  poster: string;
  /** WebVTT captions track. */
  captions: string;
  /** Portrait (vertical phone cut) or landscape. */
  orientation: 'landscape' | 'portrait';
}

/** One video record, with the served paths filled in from the id. */
function jv(v: Omit<JourneyVideo, 'src' | 'poster' | 'captions'>): JourneyVideo {
  return {
    ...v,
    src: `/Assets/videos/${v.id}.mp4`,
    poster: `/Assets/videos/${v.id}-poster.webp`,
    captions: `/Assets/videos/${v.id}.vtt`,
  };
}

/** The ten voiced videos, in the order they tell each journey. */
export const JOURNEY_VIDEOS: JourneyVideo[] = [
  jv({
    id: 'supplier-long',
    product: 'bid',
    kind: 'walkthrough',
    title: 'Win more work with Velstrian Bid',
    summary:
      'The full supplier journey, from finding a tender to a reviewed, exported answer, for public and private work.',
    orientation: 'landscape',
  }),
  jv({
    id: 'buyer-long',
    product: 'buy',
    kind: 'walkthrough',
    title: 'Run a fair, simple procurement with Velstrian Buy',
    summary:
      'The full buyer journey, from setting out what you need to recording the award, kept fair and easy to follow.',
    orientation: 'landscape',
  }),
  jv({
    id: 'v-find',
    product: 'bid',
    kind: 'short',
    title: 'Find the right tenders',
    summary: 'Search public and private opportunities and see which ones suit you.',
    orientation: 'portrait',
  }),
  jv({
    id: 'v-draft',
    product: 'bid',
    kind: 'short',
    title: 'Draft an answer from your own evidence',
    summary: 'Turn your own documents into a first draft that points at the source each line came from.',
    orientation: 'portrait',
  }),
  jv({
    id: 'v-answer-library',
    product: 'bid',
    kind: 'short',
    title: 'Reuse your best answers',
    summary: 'Keep your strongest answers in one place and reuse them on the next bid.',
    orientation: 'portrait',
  }),
  jv({
    id: 'v-social-value',
    product: 'bid',
    kind: 'short',
    title: 'Add your social value answer',
    summary: 'Build a social value answer against what the buyer asked for under PPN 026.',
    orientation: 'portrait',
  }),
  jv({
    id: 'v-review-export',
    product: 'bid',
    kind: 'short',
    title: 'Review and export the submission',
    summary: 'Check every answer has an owner, then export the submission ready to send.',
    orientation: 'portrait',
  }),
  jv({
    id: 'v-requirement',
    product: 'buy',
    kind: 'short',
    title: 'Build a requirement',
    summary: 'Set out what you need in plain words and get the tender pack ready to publish.',
    orientation: 'portrait',
  }),
  jv({
    id: 'v-evaluate',
    product: 'buy',
    kind: 'short',
    title: 'Run an evaluation',
    summary: 'Score the replies against the criteria you published, with the maths done in code.',
    orientation: 'portrait',
  }),
  jv({
    id: 'v-award-manage',
    product: 'buy',
    kind: 'short',
    title: 'Record the award and manage the contract',
    summary: 'Record who won and why, then keep the contract and its value on track afterwards.',
    orientation: 'portrait',
  }),
];

/** The long walkthrough for a journey, or null if none. */
export function walkthroughFor(product: 'bid' | 'buy'): JourneyVideo | null {
  return JOURNEY_VIDEOS.find((v) => v.product === product && v.kind === 'walkthrough') ?? null;
}

/** The feature shorts for a journey, in order. */
export function shortsFor(product: 'bid' | 'buy'): JourneyVideo[] {
  return JOURNEY_VIDEOS.filter((v) => v.product === product && v.kind === 'short');
}
