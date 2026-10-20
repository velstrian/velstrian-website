/**
 * brand-names.ts — single source of truth for platform, product and legal names.
 * [R285-REBRAND-VELSTRIAN-01 · D1, D238, D239, D243]
 *
 * Holds the brand names exactly as in crowagent-platform/packages/tokens/src/brand-names.ts.
 * Changing a brand name is an edit here and nowhere else.
 */

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

/** Default contact / support email published on the website. */
export const SUPPORT_EMAIL = "hello@velstrian.com";

/** Display-name form of SUPPORT_EMAIL. */
export const SUPPORT_FROM = `${PLATFORM_NAME} <${SUPPORT_EMAIL}>`;
