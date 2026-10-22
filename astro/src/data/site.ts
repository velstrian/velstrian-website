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
 * contact surface in this file uses `hello@velstrian.com`, matching the
 * footer, contact page and every other page's structured data.
 */

import {
  PLATFORM_NAME,
  PLATFORM_SHORT_NAME,
  LEGAL_ENTITY_NAME,
  HELLO_EMAIL,
  COMPANY_NUMBER,
  SITE_ORIGIN,
  STATUS_URL,
} from '../lib/brand-names';

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
export const OG_VERSION = '20261022';

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
  email: HELLO_EMAIL,

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
    description:
      'Velstrian serves both sides of a procurement, public sector and private. Suppliers answer tenders, RFPs, PQQs and SQs from bids already written. Buyers publish requirements and find the evidence.',
    email: HELLO_EMAIL,
    identifier: { '@type': 'PropertyValue', name: 'Companies House', value: COMPANY_NUMBER },
    address: { '@type': 'PostalAddress', addressCountry: 'GB' },
    sameAs: [
      'https://www.youtube.com/@VELSTRIAN-UK',
      'https://x.com/VelstrianLtd',
      'https://www.linkedin.com/company/-velstrian/',
      'https://www.instagram.com/velstrian/',
      'https://medium.com/@velstrian-systems-ltd',
    ],
  },
} as const;
