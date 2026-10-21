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
