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
 * THE ONE PUBLIC MAILBOX (owner decision D280, 2026-10-22). Every general,
 * support, sales and security message goes to this address, and every page
 * reads it from here. Change it once here and the whole site follows.
 */
export const PUBLIC_EMAIL = "contact@velstrian.com";

/**
 * THE COMPANY SOCIAL PROFILES (A-475, owner 2026-10-26 confirmed the LinkedIn URL).
 * The footer icons and the Organization schema `sameAs` both read this object, so a
 * profile URL is written once. scripts/check-brand-names.js fails the build when a
 * profile URL is typed anywhere else under src/.
 */
export const SOCIAL_URLS = {
  linkedin: "https://www.linkedin.com/company/-velstrian/",
  x: "https://x.com/VelstrianLtd",
  youtube: "https://www.youtube.com/@VELSTRIAN-UK",
  instagram: "https://www.instagram.com/velstrian/",
  medium: "https://medium.com/@velstrian-systems-ltd",
} as const;

/** The LinkedIn company page, the one the owner confirmed (A-475). */
export const LINKEDIN_URL = SOCIAL_URLS.linkedin;

/**
 * THE ONE PUBLIC REPLY TIME. Its value is the text the pages say today. D286
 * ("within one business day") is ON HOLD while the owner reconfirms it
 * (2026-10-22), so no page reads this yet and no reader sees a change. When it
 * is confirmed, point contact.astro, faq.astro, partners.astro, ContactForm and
 * PartnerForm at it and set the value once here.
 */
export const REPLY_TIME = "within three to five business days";

/**
 * Published contact addresses for Velstrian, by purpose.
 * All route via Cloudflare Email Routing to the ops team.
 * A hardcoded address in page copy or scripts is a defect.
 *
 * hello, support, sales and security are the SAME mailbox under D280: the
 * keys stay so a page can say what it is writing about, and they all resolve
 * to PUBLIC_EMAIL. privacy, dpo and legal are outside D280 and unchanged.
 */
export const CONTACT_EMAILS = {
  hello: PUBLIC_EMAIL,
  support: PUBLIC_EMAIL,
  security: PUBLIC_EMAIL,
  privacy: "privacy@velstrian.com",
  dpo: "dpo@velstrian.com",
  legal: "legal@velstrian.com",
  sales: PUBLIC_EMAIL,
  contact: PUBLIC_EMAIL,
} as const;

export const HELLO_EMAIL = CONTACT_EMAILS.hello;
export const SUPPORT_EMAIL = CONTACT_EMAILS.support;
export const SECURITY_EMAIL = CONTACT_EMAILS.security;
export const PRIVACY_EMAIL = CONTACT_EMAILS.privacy;
export const DPO_EMAIL = CONTACT_EMAILS.dpo;
export const LEGAL_EMAIL = CONTACT_EMAILS.legal;
export const SALES_EMAIL = CONTACT_EMAILS.sales;
export const CONTACT_EMAIL = CONTACT_EMAILS.contact;

/** Display-name form of the public mailbox. */
export const SUPPORT_FROM = `${PLATFORM_NAME} <${HELLO_EMAIL}>`;
