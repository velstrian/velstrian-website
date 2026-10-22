/**
 * price-tokens.ts: our own prices inside Markdown, resolved from data/pricing.ts.
 *
 * R285-WEB-ENTERPRISE-REDESIGN-01, 2026-10-22. The comparison Markdown typed
 * "£49/month", "£149 per month", "£549" and "£529" in its frontmatter and body,
 * so a price change meant hunting through prose. A price of OURS is now written
 * as a token naming the plan and the period:
 *
 *   {{bid.starter.monthly}}   {{bid.pro.monthly}}   {{bid.portfolio.monthly}}
 *   {{bid.starter.annual}}    {{bid.pro.annual}}    {{bid.portfolio.annual}}
 *
 * and resolved here to "£49" and so on, from PLANS. A competitor's price is a
 * sourced third party fact and stays typed with its citation.
 *
 * An unknown token, or a plan without a published price, FAILS THE BUILD
 * rather than printing a token or an empty price to a reader.
 */
import { PLANS } from '../data/pricing';

const TOKEN = /\{\{\s*([a-z]+)\.([a-z]+)\.([a-z]+)\s*\}\}/g;

function priceFor(product: string, plan: string, period: string, where: string): string {
  if (product !== 'bid') throw new Error(`price-tokens: unknown product "${product}" in ${where}`);
  const found = PLANS.find((p) => p.name.toLowerCase() === plan);
  if (!found) throw new Error(`price-tokens: unknown plan "${plan}" in ${where}`);
  if (period !== 'monthly' && period !== 'annual') {
    throw new Error(`price-tokens: unknown period "${period}" in ${where}`);
  }
  const value = found[period];
  if (value == null) throw new Error(`price-tokens: ${found.name} has no published ${period} price, in ${where}`);
  return `£${value.toLocaleString('en-GB')}`;
}

/** Resolve every price token in one string. */
export function resolvePriceTokens(text: string, where: string): string {
  const out = text.replace(TOKEN, (_m, product: string, plan: string, period: string) => priceFor(product, plan, period, where));
  const left = out.match(/\{\{[^}]*\}\}/);
  if (left) throw new Error(`price-tokens: unresolved token ${left[0]} in ${where}`);
  return out;
}

/** Resolve every price token in every string of a value (frontmatter). */
export function resolvePriceTokensDeep<T>(value: T, where: string): T {
  if (typeof value === 'string') return resolvePriceTokens(value, where) as T;
  if (Array.isArray(value)) return value.map((v) => resolvePriceTokensDeep(v, where)) as T;
  if (value instanceof Date) return value;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolvePriceTokensDeep(v, where);
    return out as T;
  }
  return value;
}
