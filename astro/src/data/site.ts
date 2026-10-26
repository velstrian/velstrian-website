/**
 * site.ts: global identity/SEO constants for the Astro rebuild.
 *
 * Values are taken from `migration/data/site.ts` and
 * `migration/data/structured-data.ts` (prepared by an earlier extraction
 * pass over the live legacy site), cross-checked against the live
 * `index.html` JSON-LD block. See `migration/CONTENT-MODEL.md` for the full
 * writeup of inconsistencies found across the legacy tree.
 *
 * IMPORTANT: identity correction (2026-08-01): the legacy `index.html`'s
 * own static Organization JSON-LD carried a `contactPoint` of
 * `crowagent.platform@gmail.com` / "Crow Agent". That is a cross-project
 * copy/paste defect (those are the `crowagent-platform` repo's identity
 * strings, not this website's) and is NOT carried forward here. Every
 * contact surface in this file uses PUBLIC_EMAIL from lib/brand-names.ts, the
 * one public mailbox (owner decision D280, 2026-10-22), matching the footer,
 * contact page and every other page's structured data.
 */

import {
  PLATFORM_NAME,
  PLATFORM_SHORT_NAME,
  LEGAL_ENTITY_NAME,
  PUBLIC_EMAIL,
  COMPANY_NUMBER,
  SITE_ORIGIN,
  STATUS_URL,
  PRODUCT_NAME_BID,
  PRODUCT_NAME_BUY,
  SOCIAL_URLS,
} from '../lib/brand-names';

/*
 * WHAT VELSTRIAN IS, IN PLAIN WORDS (R285-WEB-REVIEW-2026-10-22 item 4, RULE
 * 0-U). The home description, the footer line on every route, the Organization
 * node and the default social card all said "tenders, RFPs, PQQs and SQs", four
 * terms a small firm writing its first bid does not know. They now say what the
 * products do, for whom, public and private, naming Velstrian Bid and Velstrian
 * Buy. Written once here so the four surfaces cannot drift apart again (the
 * alignment A-50 and A-112 kept by hand).
 */
/** The home page meta description, at most 155 characters. */
export const HOME_DESCRIPTION = `${PRODUCT_NAME_BID} helps small firms find public and private contracts and write bids from their own documents. ${PRODUCT_NAME_BUY} helps buyers compare replies.`;

/** The longer version: the footer line on every route and the Organization node. */
export const SITE_SUMMARY = `${PLATFORM_SHORT_NAME} makes bidding simple for small and mid size firms, for public and private work. ${PRODUCT_NAME_BID} finds contracts that suit you and drafts your answers from your own documents. ${PRODUCT_NAME_BUY} helps buyers set out what they need and compare the replies.`;

/** The line under the product names on the default social card
 *  (scripts/generate-og-images.js reads it from this file), at most 140 characters. */
export const OG_CARD_LINE = `Find public and private contracts and write bids from your own documents. Buyers compare the replies in one place.`;

/**
 * THE SOCIAL CARD VERSION, written once (R285-WEB-REVIEW-2026-10-22 item 5).
 * Every card under /Assets/og/ and /Assets/og-image.png is redrawn by
 * scripts/generate-og-images.js, and a share preview service caches a card by
 * its full URL, so a redrawn card reaches LinkedIn, X and Slack only when the
 * query changes. The query used to be typed as ?v=20260730 on eleven lines and
 * was never bumped when the cards were redrawn on 2026-10-22 (182bc4c2), so
 * every share kept the old CrowAgent card. Bump this one value whenever the
 * generator runs. ogImageUrl() puts it on every card URL, so no page and no
 * frontmatter carries its own.
 */
// [D315 R285-REBRAND-05] Bumped: the cards were redrawn on 2026-10-23 in Quantum V and Manrope.
export const OG_VERSION = '20261023';

/** A card URL, absolute, with the current OG_VERSION and any older one removed.
 *  A URL that is not one of our own /Assets/ images is returned as it is. */
export function ogImageUrl(image: string): string {
  const url = new URL(image, SITE_ORIGIN);
  if (url.origin === new URL(SITE_ORIGIN).origin && url.pathname.startsWith('/Assets/')) {
    url.searchParams.set('v', OG_VERSION);
  }
  return url.href;
}

export const SITE = {
  name: PLATFORM_SHORT_NAME,
  platformName: PLATFORM_NAME,
  legalName: LEGAL_ENTITY_NAME,
  origin: SITE_ORIGIN,
  status: STATUS_URL,
  statusUrl: STATUS_URL,
  defaultOgImage: ogImageUrl('/Assets/og-image.png'),
  twitter: '@VelstrianLtd',
  email: PUBLIC_EMAIL,

  /**
   * The Organization JSON-LD node, emitted on every page by Seo.astro as
   * the first entry in the @graph.
   */
  organizationSchema: {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: PLATFORM_NAME,
    legalName: LEGAL_ENTITY_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: ogImageUrl('/Assets/og-image.png'),
    description: SITE_SUMMARY,
    email: PUBLIC_EMAIL,
    identifier: { '@type': 'PropertyValue', name: 'Companies House', value: COMPANY_NUMBER },
    address: { '@type': 'PostalAddress', addressCountry: 'GB' },
    // A-475: the profiles are written once, in SOCIAL_URLS. Order kept as before.
    sameAs: [
      SOCIAL_URLS.youtube,
      SOCIAL_URLS.x,
      SOCIAL_URLS.linkedin,
      SOCIAL_URLS.instagram,
      SOCIAL_URLS.medium,
    ],
  },
} as const;
