/**
 * app.ts: where the Velstrian app lives, written once.
 *
 * The app keeps its own host through the Velstrian rebrand. People sign in and
 * sign up there, so the header, the plan buttons on /pricing and every Start
 * now link read these two constants rather than typing the host again.
 *
 * Kept in its own file with no imports, because the command palette script is
 * inlined into every page and carries a byte budget: importing SITE there would
 * have pulled the whole identity object into each document.
 *
 * D236 (2026-10-19): sign up is self serve, so SIGNUP_URL is the destination of
 * every Start now button. A plan is chosen with `?plan=<token>`, built by
 * startHref() in data/pricing.ts.
 */
export const APP_ORIGIN = 'https://app.crowagent.ai';

export const SIGNUP_URL = `${APP_ORIGIN}/signup`;

/**
 * THE ONE LABEL for every button that goes to SIGNUP_URL (owner review
 * 2026-10-22, R285-WEB-REVIEW-2026-10-22 item 3). The hero, Start in three
 * steps and the closing band said "Start 7 day trial" while the header and
 * every plan card said "Start now", one action under two names.
 *
 * "Start now" because it is TRUE ON EVERY BUTTON, which "Start 7 day trial"
 * is not: Buyer Portfolio is set up on invoice with no trial, and the platform
 * grants one trial per organisation and work email domain (BILL-01), so a
 * returning firm starts paid. D236 (2026-10-19) also chose "Start now" for
 * every plan in the app, so the site and the app now say the same thing. The
 * trial is still said plainly beside the button, with the card it needs.
 * Every page reads this constant, scripts/check-content-parity.js fails the
 * build on a signup link with any other label.
 */
export const START_LABEL = 'Start now';

/**
 * The platform API, which the website calls straight from the browser for the
 * partner enquiry and the free tender finder. It is the Railway host the
 * platform's own frontend uses, already allowed in `connect-src` and
 * `form-action` in `_headers` and guarded by check-csp-required-origins.js. The
 * API's production CORS list takes every marketing host on both domains from
 * `packages/server-infra/src/public-hosts.mjs` in crowagent-platform, so no
 * proxy is needed. Written once here (R285-WEB-FREE-TENDER-FINDER-01), it was
 * typed into PartnerForm.astro before.
 */
// [R285-REBRAND-INFRA-01] D299 (owner 2026-10-23): the API has its own custom domain, the
// same value as PRIMARY_API_ORIGIN in the platform's packages/server-infra/src/public-hosts.mjs.
// TRANSITION: the Railway generated host still serves until the cutover is verified, so
// `_headers` and check-csp-required-origins.js keep it allowed beside this one. Remove those
// legacy entries after the cutover.
export const API_ORIGIN = 'https://api.velstrian.com';

/**
 * The 30 minute walkthrough booking page. Typed into three page files before
 * (HomeConversion.astro, about.astro, bid.astro). The evidenced answer pages
 * read it from here, and the older pages move to it as they adopt the system.
 */
export const WALKTHROUGH_URL = 'https://calendly.com/crowagent-platform/30min';
