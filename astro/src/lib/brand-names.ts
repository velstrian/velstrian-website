/**
 * brand-names.ts — single source of truth for platform, product, legal names and contacts.
 * [R285-REBRAND-VELSTRIAN-01 · D1, D238, D239, D243]
 *
 * Holds the brand names exactly as in crowagent-platform/packages/tokens/src/brand-names.ts.
 * Changing a brand name or published contact address is an edit here and nowhere else.
 */

/**
 * The website canonical origin (owner decision 2026-10-18).
 */
export const SITE_ORIGIN = "https://velstrian.com";

/**
 * The canonical host of the public marketing website.
 */
export const SITE_CANONICAL_HOST = "velstrian.com";

/**
 * Public status page URL (Better Stack).
 */
export const STATUS_URL = "https://status.velstrian.com";

/**
 * The platform name (D239), shown wherever the product family is named as a whole.
 */
export const PLATFORM_NAME = "Velstrian Tenderworks";

/**
 * The possessive of PLATFORM_NAME (owner decision 2026-10-20). The name ends in "s",
 * so it takes a bare apostrophe, never "Tenderworks's".
 */
export const PLATFORM_NAME_POSSESSIVE = `${PLATFORM_NAME}'`;

/**
 * The short name under an installed app icon and short copy references.
 */
export const PLATFORM_SHORT_NAME = "Velstrian";

/** The supplier product display name (was CrowMark). */
export const PRODUCT_NAME_BID = "Velstrian Bid";

/** The buyer product display name (was CrowMark Buyer). */
export const PRODUCT_NAME_BUY = "Velstrian Buy";

/**
 * The legal entity name EXACTLY as the Companies House register shows it today.
 * VELSTRIAN SYSTEMS LTD from 20 October 2026 (company 17076461).
 */
export const LEGAL_ENTITY_NAME = "Velstrian Systems Ltd";

/** Registered company number, unchanged by the rename. */
export const COMPANY_NUMBER = "17076461";

/** ICO registration number. */
export const ICO_NUMBER = "C1901492";

/** Registered office town and postcode. */
export const REGISTERED_OFFICE = "Reading, Berkshire RG1 6SP";

/** The legal line: the registered name, trading name and company number. */
export const LEGAL_ENTITY_LINE = `${LEGAL_ENTITY_NAME}, trading as ${PLATFORM_NAME}, company number ${COMPANY_NUMBER}`;

/**
 * Published contact addresses for Velstrian.
 * All route via Cloudflare Email Routing to the ops team.
 * A hardcoded address in page copy or scripts is a defect.
 */
export const CONTACT_EMAILS = {
  hello: "hello@velstrian.com",
  support: "support@velstrian.com",
  security: "security@velstrian.com",
  privacy: "privacy@velstrian.com",
  dpo: "dpo@velstrian.com",
  legal: "legal@velstrian.com",
  sales: "sales@velstrian.com",
  contact: "contact@velstrian.com",
} as const;

export const HELLO_EMAIL = CONTACT_EMAILS.hello;
export const SUPPORT_EMAIL = CONTACT_EMAILS.support;
export const SECURITY_EMAIL = CONTACT_EMAILS.security;
export const PRIVACY_EMAIL = CONTACT_EMAILS.privacy;
export const DPO_EMAIL = CONTACT_EMAILS.dpo;
export const LEGAL_EMAIL = CONTACT_EMAILS.legal;
export const SALES_EMAIL = CONTACT_EMAILS.sales;
export const CONTACT_EMAIL = CONTACT_EMAILS.contact;

/** Display-name form of HELLO_EMAIL. */
export const SUPPORT_FROM = `${PLATFORM_NAME} <${HELLO_EMAIL}>`;
