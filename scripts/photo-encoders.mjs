/**
 * photo-encoders.mjs: the encoder settings every photograph on the site uses.
 *
 * Moved here on 2026-10-23 (R285-WEB-IMAGERY-AND-DISCLOSURE-01, lane D) out of
 * build-blog-photos.mjs, so the blog heroes and the people photographs
 * (build-people-photos.mjs) cannot drift apart. The values and the reasons for
 * them are unchanged, see the note in build-blog-photos.mjs.
 */

/** JPEG fallback, the value blog/PHOTO-CREDITS.md recorded. */
export const JPEG = { quality: 82, mozjpeg: true };

/** WebP at the full size master. */
export const WEBP_MASTER = { quality: 82, effort: 6 };

/** WebP at every smaller rung. */
export const WEBP_RUNG = { quality: 76, effort: 6 };

/** AVIF at every size. q60 effort 6 was measured against q72 on photography. */
export const AVIF = { quality: 60, effort: 6 };
