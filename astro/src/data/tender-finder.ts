/**
 * tender-finder.ts: the free tender finder's limits and filter choices, written once.
 *
 * R285-WEB-FREE-TENDER-FINDER-01, D253. The page at /tools/tender-finder/ searches
 * the UK and EU notices the platform already ingests, through
 * `POST /api/v1/bid/free/tenders/search`. Every number and every filter value
 * below is the API's own, read from crowagent-platform on 2026-10-21:
 *
 *   api/app/services/free_tender_finder.py   RECENT_DAYS, MAX_PAGE_SIZE,
 *                                            MAX_PAGES, MAX_KEYWORD_CHARS,
 *                                            MAX_CLOSES_WITHIN_DAYS, VALUE_BANDS
 *   api/app/routers/bid_free_tender_finder.py Region, ValueBand, Source, and the
 *                                            10 an hour, 50 a day throttle
 *
 * A filter value the API does not know is a 422, so a value typed here that
 * drifts from the API turns into an error a visitor sees. Change both together.
 */

export const TENDER_SEARCH_PATH = '/api/v1/bid/free/tenders/search';

/** Notices published in the last this many days. */
export const RECENT_DAYS = 30;
export const PAGE_SIZE = 20;
export const MAX_PAGES = 5;
export const MAX_KEYWORD_CHARS = 100;
export const HOURLY_LIMIT = 10;
export const DAILY_LIMIT = 50;

export const REGIONS = [
  { value: 'england', label: 'England' },
  { value: 'scotland', label: 'Scotland' },
  { value: 'wales', label: 'Wales' },
  { value: 'northern_ireland', label: 'Northern Ireland' },
  { value: 'uk_wide', label: 'UK wide' },
];

export const VALUE_BANDS = [
  { value: 'under_100k', label: 'Under £100,000' },
  { value: '100k_to_1m', label: '£100,000 to £1 million' },
  { value: '1m_to_10m', label: '£1 million to £10 million' },
  { value: 'over_10m', label: 'Over £10 million' },
];

/** Days until closing. The API accepts 1 to 90. */
export const CLOSING_WINDOWS = [7, 14, 30, 60, 90];

/**
 * TED countries a visitor can narrow to: the EU member states and the EEA and
 * Swiss buyers TED also publishes. ISO 3166-1 alpha 2, which is what the API's
 * `market` column holds (`bid_market_map.market_from_country`). Names are
 * produced at build time by Intl.DisplayNames, so none is typed here.
 */
export const EU_COUNTRY_CODES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'IS', 'LI', 'NO', 'CH',
];

/** The two licence statements, by the source keys the API returns. */
export const UK_SOURCE_KEYS = ['fts', 'contracts_finder', 'public_contracts_scotland'];
export const OGL_URL = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/';
export const TED_LEGAL_URL = 'https://ted.europa.eu/en/legal-notice';
