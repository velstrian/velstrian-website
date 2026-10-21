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
 * The platform API, which the website calls straight from the browser for the
 * partner enquiry and the free tender finder. It is the Railway host the
 * platform's own frontend uses, already allowed in `connect-src` and
 * `form-action` in `_headers` and guarded by check-csp-required-origins.js. The
 * API's production CORS list takes every marketing host on both domains from
 * `packages/server-infra/src/public-hosts.mjs` in crowagent-platform, so no
 * proxy is needed. Written once here (R285-WEB-FREE-TENDER-FINDER-01), it was
 * typed into PartnerForm.astro before.
 */
export const API_ORIGIN = 'https://crowagent-platform-production.up.railway.app';

/**
 * The 30 minute walkthrough booking page. Typed into three page files before
 * (HomeConversion.astro, about.astro, bid.astro). The evidenced answer pages
 * read it from here, and the older pages move to it as they adopt the system.
 */
export const WALKTHROUGH_URL = 'https://calendly.com/crowagent-platform/30min';
