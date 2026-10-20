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
 * contact surface in this file uses `hello@crowagent.ai`, matching the
 * footer, contact page and every other page's structured data.
 */

import {
  PLATFORM_NAME,
  PLATFORM_SHORT_NAME,
  LEGAL_ENTITY_NAME,
  SUPPORT_EMAIL,
  COMPANY_NUMBER,
} from '../lib/brand-names';

export const SITE = {
  name: PLATFORM_SHORT_NAME,
  platformName: PLATFORM_NAME,
  legalName: LEGAL_ENTITY_NAME,
  origin: 'https://velstrian.com',
  defaultOgImage: 'https://velstrian.com/Assets/og-image.png?v=20260730',
  twitter: '@VelstrianLtd',
  email: SUPPORT_EMAIL,

  /**
   * The Organization JSON-LD node, emitted on every page by Seo.astro as
   * the first entry in the @graph.
   */
  organizationSchema: {
    '@type': 'Organization',
    '@id': 'https://velstrian.com/#organization',
    name: PLATFORM_NAME,
    legalName: LEGAL_ENTITY_NAME,
    url: 'https://velstrian.com/',
    logo: 'https://velstrian.com/Assets/og-image.png?v=20260730',
    description:
      'Velstrian serves both sides of a procurement, public sector and private. Suppliers answer tenders, RFPs, PQQs and SQs from bids already written. Buyers publish requirements and find the evidence.',
    email: SUPPORT_EMAIL,
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
