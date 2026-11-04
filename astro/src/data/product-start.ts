/**
 * product-start.ts: the start button for each product, written once.
 *
 * D553 (owner 2026-11-04): Velstrian Bid and Velstrian Buy are separate
 * products for separate customers. On a page about one of them, every start
 * button names that product and carries its plan into sign up, so a supplier
 * never lands in the buyer journey or the other way round. A page about
 * neither product (home, about, the header, the command palette) keeps the
 * neutral START_LABEL and the bare SIGNUP_URL, and the app asks which product.
 *
 * Every product button reads PRODUCT_START or productStart() from here.
 * scripts/check-content-parity.js reads the labels and default plan keys from
 * this file and fails the build when a product page links to the bare sign up
 * page, or when a plan link carries the other product's label.
 *
 * Imports only app.ts and brand-names.ts, both constant files with no imports,
 * so astro.config.mjs can read it for the `start:bid` and `start:buy` links in
 * Markdown content.
 */
import { SIGNUP_URL } from './app.ts';
import { PRODUCT_NAME_BID, PRODUCT_NAME_BUY } from '../lib/brand-names.ts';

export type Product = 'bid' | 'buy';

export interface ProductStart {
  /** The product's name, from brand-names.ts. */
  name: string;
  /** The button label on every start button for this product. */
  label: string;
  /** The plan a product page starts on when no plan card was chosen. */
  planKey: string;
  /** Every sign up token for this product starts with this. */
  planPrefix: string;
}

export const PRODUCT_START: Record<Product, ProductStart> = {
  bid: { name: PRODUCT_NAME_BID, label: `Start with ${PRODUCT_NAME_BID}`, planKey: 'bid_pro', planPrefix: 'bid_' },
  buy: { name: PRODUCT_NAME_BUY, label: `Start with ${PRODUCT_NAME_BUY}`, planKey: 'buyer_pro', planPrefix: 'buyer_' },
};

/** The sign up link for one plan and billing period, or the bare sign up page. */
export function startHref(planKey?: string, annual = false): string {
  if (!planKey) return SIGNUP_URL;
  const token = annual ? `${planKey}_annual` : planKey;
  return `${SIGNUP_URL}?plan=${encodeURIComponent(token)}`;
}

/** A product's start action: its label, and a link that carries its plan. */
export function productStart(product: Product, planKey?: string, annual = false): { href: string; label: string } {
  const p = PRODUCT_START[product];
  return { href: startHref(planKey ?? p.planKey, annual), label: p.label };
}
