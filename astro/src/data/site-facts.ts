/**
 * site-facts.ts: the sentences pages print, built from site-facts.json.
 *
 * R285-WEB-CLAIMS-AUDIT-01, D252 (7). The source list, the upload limits, the
 * fit dimension count and the guest reviewer allowances were typed into a dozen
 * files and drifted from the product in both directions (two sources named
 * where four are live, Canada called live where it is on request, six
 * dimensions where there are seven, 10MB where the limit is 25 MB). A page that
 * imports a sentence from here cannot drift on its own, and
 * scripts/check-site-facts.mjs fails the build when a page that types the fact
 * by hand gets it wrong.
 */
/* The import attribute lets plain Node load this module too: check-pricing-parity.js
   imports data/pricing.ts, which imports this file, outside Vite. */
import FACTS from './site-facts.json' with { type: 'json' };

export { FACTS };

/** "A, B, C and D". */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

const LIVE = FACTS.sources.live.map((s) => s.name);
const ON_REQUEST_SHORT = FACTS.sources.on_request.map((s) =>
  s.key === 'canadabuys' ? 'Canada' : s.key === 'sam_gov' ? 'US federal' : s.name,
);

/** "Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED" */
export const LIVE_SOURCES = listJoin(LIVE);

/** "Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED, refreshed daily" */
export const LIVE_SOURCES_DAILY = `${LIVE_SOURCES}, refreshed ${FACTS.sources.refresh}`;

/** "Canada, US federal and World Bank notices are available per organisation on request." */
export const ON_REQUEST_SENTENCE = `${listJoin(ON_REQUEST_SHORT)} notices are available per organisation on request.`;

/** "06:00 UTC" */
export const REFRESH_TIME = FACTS.sources.refresh_time;

const FORMAT_NAMES: Record<string, string> = {
  pdf: 'PDF',
  docx: 'Word',
  xlsx: 'Excel',
  csv: 'CSV',
  txt: 'text',
  zip: 'ZIP',
  pptx: 'PowerPoint',
};

/** "PDF, Word, text, Excel or CSV" for the first upload of a bid. */
export const START_FORMATS = (() => {
  const names = FACTS.upload.start_a_bid.formats.map((f) => FORMAT_NAMES[f] ?? f.toUpperCase());
  return `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}`;
})();

export const START_MAX_MB = FACTS.upload.start_a_bid.max_mb;
export const PACK_MAX_MB = FACTS.upload.tender_pack.max_mb;

/** The upload sentence used on /bid/. */
export const UPLOAD_SENTENCE =
  `Start a bid from the tender as ${START_FORMATS}, up to ${START_MAX_MB} MB a file. ` +
  `Add the rest of the pack, including ZIP archives and PowerPoint, up to ${PACK_MAX_MB} MB a file, ` +
  'or have a pack forwarded by email.';

/** "seven" */
export const FIT_COUNT_WORD = FACTS.fit_dimensions.count_word;

/** "sector, social value, capacity, geography, timeline, evidence and market" */
export const FIT_DIMENSIONS = listJoin(FACTS.fit_dimensions.dimensions.map((d) => d.name));

export const GUEST_REVIEWERS = {
  starter: FACTS.plans.bid.starter.guest_reviewers,
  pro: FACTS.plans.bid.pro.guest_reviewers,
  portfolio: FACTS.plans.bid.portfolio.guest_reviewers,
};

/** The certification statement, D252 (2). */
export const SOA_STATEMENT = FACTS.certifications.soa_statement;

export const ICO_REFERENCE = FACTS.ico.reference;

/** One sentence on where data is held and what leaves for AI drafting. */
export const DATA_HANDLING_SENTENCE =
  `Customer data is stored in the EU (${FACTS.regions.data_at_rest.provider}, ${FACTS.regions.data_at_rest.place}). ` +
  `AI drafting sends only the text needed for the task to ${listJoin(FACTS.regions.ai_processors_outside_eu)}, ` +
  'both under data processing agreements, and neither trains on it.';

/**
 * Which plans carry the Integrations package (D206), from the catalogue flags.
 * The package contents are the ones crowagent-platform
 * api/app/services/integrations_entitlement.py gates on `bid.integrations`.
 */
export const INTEGRATIONS_PLAN_LINE = (() => {
  const where = (v: string) => (Object.entries(FACTS.plans.bid) as [string, { integrations: string }][])
    .filter(([, p]) => p.integrations === v)
    .map(([k]) => k[0].toUpperCase() + k.slice(1));
  return (
    'API keys, outbound webhooks, automation rules, the REST API and the MCP server make up the Integrations package. ' +
    `It is included on ${listJoin(where('included'))}, a paid add-on on ${listJoin(where('addon'))}, and not offered on ${listJoin(where('none'))}.`
  );
})();
