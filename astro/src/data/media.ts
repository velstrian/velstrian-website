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
