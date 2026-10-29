/**
 * pricing.ts: the numbers on /pricing, in one place.
 *
 * EVERY FIGURE BELOW IS DERIVED FROM THE PLATFORM, NOT AUTHORED HERE. The
 * defect this file exists to prevent is recorded in the platform itself
 * (`credit-allowances.ts` header): "the same per-tier number was restated in the
 * Stripe catalogue copy, the marketing site, PLAN_LIMITS, and a downgrade guard,
 * and they disagreed." The marketing site was one of the four that disagreed.
 *
 * Sources, so a future reader can re-check rather than trust:
 *
 *   seats    LOCKED BY OWNER DECISION 2026-08-09,
 *            crowagent-platform/docs/decisions/PRICING-LOCK-2026-08.md
 *            free 1 · trial14 1 · starter 1 · pro 5 · portfolio 10.
 *            Portfolio is NO LONGER unlimited: `null` meant one subscription
 *            could host a 200-person consultancy. It is 10 included, more by
 *            arrangement.
 *            The canonical declaration is moving to
 *            crowagent-platform/packages/pricing/catalogue.ts; the older
 *            seat-limits.ts is being deleted as a competing declaration.
 *            THIS CITATION WAS STALE AND SAID 3 / 10 / unlimited, which is the
 *            precise figure this whole lock exists to correct.
 *
 *   credits  crowagent-platform/web/src/shared/lib/credit-allowances.ts
 *            CREDIT_ALLOWANCES.crowmark = { free: 15, starter: 200, pro: 750,
 *            portfolio: 3000 }, per calendar month. This is the ONLY axis
 *            CrowMark is metered on, and it is the answer to OA-05.
 *
 *   prices   Stripe (live mode) and src/data/crowmark.ts. £49 and £149, NOT
 *            £99. Specs/architecture/DEPLOYMENT-AND-RELEASE.md §3.2 records
 *            "£99/mo" as a non-existent price removed from the OG card on
 *            2026-07-30. Portfolio's £549 list price was Stripe-only until owner
 *            decision D235 (2026-10-19, crowagent-platform/docs/release-2.8.4/
 *            scope/DECISION-GATES.md) published it, with Buyer Portfolio at £699.
 *
 *            THE OLD CITATION HERE WAS `pricing.html (live)`, AND IT STOPPED
 *            BEING TRUE ON 2026-08-05, when the Cloudflare Pages deploy source
 *            moved to astro/dist. The legacy root pricing.html is still in the
 *            repo and is served to nobody, so it can no longer corroborate a
 *            figure; this file is the published one.
 *
 *   annual   Exactly 10% off twelve months, never 20%. 49 x 12 = 588, less 10%
 *            = 529.20, published as £529. 149 x 12 = 1,788, less 10% = 1,609.20,
 *            published as £1,609. Both round DOWN, so the published figure is
 *            never higher than the stated discount implies.
 *
 * ── THESE NUMBERS ARE MAINTAINED BY HAND, DELIBERATELY ─────────────────────
 *
 * There used to be scripts/sync-pricing-from-stripe.ts, wired to `npm run
 * sync-pricing`, which pulled active crowagent_* Stripe prices and rewrote a
 * pricing page in place. It was RETIRED on 2026-08-05 rather than re-pointed at
 * this file, and the reason is the row directly above.
 *
 * Stripe holds an ACTIVE, LIST-PRICED Portfolio pair, crowagent_crowmark_
 * portfolio_monthly at 54900 pence and _annual at 592900, verified against live
 * mode on 2026-08-05. The Portfolio card publishes no price at all, because an
 * owner decision says it must not. So the default behaviour of any Stripe-to-page
 * sync, which is to publish what Stripe says, is precisely the one thing this
 * page must never do, and re-pointing the script would have meant building a
 * mechanism whose whole purpose is to copy prices and then bolting a
 * never-copy-this-one exception onto its most valuable tier. Three cards do not
 * justify that risk.
 *
 * D235 (2026-10-19) lifted that exception: the Portfolio pair is now published
 * at the same 54900 and 592900 pence. The second reason below still stands, so
 * the figures stay hand maintained and gated.
 *
 * The second reason is the one at the top of this file. The defect that made
 * this file necessary was the same per-tier number restated in four places until
 * they disagreed. An automated writer would be a fifth restatement, not a cure,
 * and it would be writing into a file where every figure carries an argument a
 * machine cannot re-derive: the 10%-not-20% rounding rule, the market-neutral
 * `who` strings, the credit allowances read out of the platform.
 *
 * WHAT IS THEREFORE NOT CHECKED, said plainly: nothing compares these figures
 * against Stripe. If you change a price here, open Stripe and change the
 * matching lookup_key, or the checkout will take a different amount from the one
 * the page advertised. `npm run sync-pricing` now refuses and explains.
 *
 * ── R262-WEB-08, 2026-08-09: THAT LAST PARAGRAPH IS NO LONGER THE WHOLE TRUTH ─
 *
 * `scripts/check-pricing-parity.js` now runs as a build gate. It does not talk
 * to Stripe, so the sentence above still holds for Stripe itself, but it does
 * hold this file and the BUILT PAGES against the owner's locked catalogue
 * (crowagent-platform/docs/decisions/PRICING-LOCK-2026-08.md), and it fails the
 * build on any published £ figure, seat count or credit allowance that
 * disagrees with it. Copy drift is what produced every defect recorded in this
 * header; the gate is the thing that stops the next one.
 */
import { SIGNUP_URL, START_LABEL } from './app.ts';
import { GUEST_REVIEWERS, LIVE_SOURCES } from './site-facts.ts';

export { SIGNUP_URL, START_LABEL };

/*
 * ── R285-P2-SELF-SERVE-SIGNUP-01 · D236 (2026-10-19): EVERY PLAN SAYS START NOW ─
 *
 * Sign up is self serve. Every plan button goes to the app's sign up page with
 * the plan chosen, as `?plan=<token>`, and the app carries the token through
 * onboarding into checkout (crowagent-platform web/app/(auth)/signup and
 * VALID_CHECKOUT_PLANS in app/(onboarding)/onboarding/action-types.ts). The
 * monthly token is the plan's `planKey`. The annual token is the same with
 * `_annual` appended, the shape the app already accepts for Starter and Pro.
 *
 * A-294 (2026-10-25): the Velstrian Bid tokens are `bid_<tier>`. The platform
 * renamed its product key (R285-REBRAND-11), and parsePlanToken in
 * web/src/features/billing/v2/plan-token.ts returns null for `crowmark_<tier>`,
 * so the old tokens did not carry the chosen plan through sign up.
 */
/** The sign up link for one plan and billing period, or the bare sign up page. */
/** The extra seat add on for Pro and Buyer Pro, in pounds. Source of truth:
    crowagent-platform packages/pricing/catalogue.ts SEAT_ADDON_MONTHLY_PENCE
    (4500) and the annual seat add on (£486, 45 x 10.8, D196). */
export const SEAT_ADDON = { monthly: 45, annual: 486 } as const;

/** The annual discount a plan gives, in whole percent, worked out from its own
    monthly and annual prices so the words can never drift from the numbers. */
export function annualDiscountPct(plan: { monthly?: number | null; annual?: number | null }): number {
  if (!plan.monthly || !plan.annual) return 0;
  return Math.round((1 - plan.annual / (plan.monthly * 12)) * 100);
}

export function startHref(planKey?: string, annual = false): string {
  if (!planKey) return SIGNUP_URL;
  const token = annual ? `${planKey}_annual` : planKey;
  return `${SIGNUP_URL}?plan=${encodeURIComponent(token)}`;
}

/** A quieter second action under a plan's main button. */
export interface PlanLink {
  label: string;
  href: string;
}

export interface Plan {
  name: string;
  /** Who it is for. Deliberately not sector-scoped: the market-neutral decision. */
  who: string;
  /** Monthly price in £, or null where there is no published price. */
  monthly: number | null;
  /** Annual price in £. Null wherever `monthly` is. */
  annual: number | null;
  /**
   * Included user seats. LOCKED 2026-08-09: 1 / 5 / 10.
   *
   * Declared as a NUMBER rather than left inside the prose, because the whole
   * pricing lock exists because a consolidation quietly raised Starter and Pro
   * from 1/5 to 3/10 and no gate could see it: the figure was only ever a word
   * in a sentence. It is a field now, so `scripts/check-pricing-parity.js` can
   * hold it against the lock, and the prose below is generated from it or
   * checked against it rather than typed twice.
   */
  seats: number;
  /** Included AI credits per calendar month. */
  credits: number;
  /**
   * The third line on the card, after users and credits: one short line of what
   * the plan includes. The first two lines are generated from `seats` and
   * `credits`, so neither figure is typed twice. R285-P2-ENTERPRISE-SELF-SERVE-01.
   */
  includes: string;
  /** True where more users than `seats` can be arranged. Portfolio only. */
  moreSeatsByArrangement?: boolean;
  /** The main button's label. "Start now" on every plan (D236). */
  cta: string;
  /** The sign up token the app reads from `?plan=`. See startHref(). */
  planKey: string;
  /** A quieter second action, where a plan has one. */
  secondary?: PlanLink;
  recommended?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: 'Starter',
    who: 'Small suppliers and solo consultants',
    monthly: 49,
    annual: 529,
    seats: 1,
    credits: 200,
    includes: 'Tender feed, cited drafting, social value calculation and PDF or DOCX export.',
    cta: START_LABEL,
    planKey: 'bid_starter',
  },
  {
    name: 'Pro',
    /* WAS "Public-sector contractors & bidding teams". Sector-scoped, against
       the market-neutral decision, on the plan most buyers land on. */
    who: 'Bid teams running a regular pipeline',
    monthly: 149,
    annual: 1609,
    seats: 5,
    credits: 750,
    includes: 'Everything in Starter, plus delivery tracking, monthly reports and the section 52 and 71 checks.',
    cta: START_LABEL,
    planKey: 'bid_pro',
    recommended: true,
  },
  {
    name: 'Portfolio',
    who: 'Enterprise groups and Tier 1 suppliers',
    /* D235 (2026-10-19): PUBLISHED. 54900 pence a month, annual 592900, which is
       floor(549 x 12 x 0.9) = 5,929, the same rounding as Starter and Pro. Single
       sign-on is included in Portfolio bought this way (D235 point 6). Contracts
       and custom terms stay behind talk to us, which is the secondary link.

       Bid volume is unmetered on every plan, but this plan has a cap like the
       others: 3,000 AI credits a month. Both facts are stated separately so
       neither can be mistaken for the other (OA-05). */
    monthly: 549,
    annual: 5929,
    seats: 10,
    credits: 3000,
    /* R285-WEB-CLAIMS-AUDIT-01 H10 and P3. Single sign-on is on every plan
       (D241), so it is not what Portfolio adds. The Integrations package is
       (D206, catalogue.ts integrations flag). */
    includes: 'Everything in Pro, plus the Integrations package, branded exports and a named contact.',
    moreSeatsByArrangement: true,
    cta: 'Buy Portfolio',
    planKey: 'bid_portfolio',
    secondary: {
      label: 'Talk to us about contracts',
      href: '/contact/?tier=portfolio#contact-form',
    },
  },
];

/*
 * ── R285-P2-DROP-01 · CROWMARK BUYER, THE D195 MODEL, REPRICED BY D235 ───────
 *
 * Owner decision D195, 2026-10-09 (crowagent-platform/docs/decisions/
 * D195-r285-self-service-tier-model.md): CrowMark Buyer has TWO offerings, Buyer
 * Pro and Buyer Portfolio. D195 kept Buyer Portfolio unpriced. D235 (2026-10-19)
 * published it at 69900 pence a month, annual 754900, no longer mirroring
 * CrowMark Portfolio, payable by card or by invoice on 30 days with a PO number
 * at the same price.
 *
 * THE FIGURES ARE NOT AUTHORED HERE. They are the platform catalogue's, in
 * crowagent-platform/packages/pricing/catalogue.ts (BUYER_PRODUCT_CATALOGUE):
 *
 *   buyer_pro        29900 pence a month, 5 seats, 750 credits, 10 guest evaluators
 *   buyer_portfolio  69900 pence a month, 10 seats, 3000 credits, 25 guest evaluators
 *
 * Annuals by the locked formula: floor(299 x 12 x 0.9) = 3,229 and
 * floor(699 x 12 x 0.9) = 7,549. Both are typed as numbers so
 * scripts/check-pricing-parity.js can hold them against that arithmetic. D236
 * replaced Request access with Start now on both.
 */
export interface BuyerPlan {
  name: string;
  who: string;
  /** Monthly price in £, or null where the offering is contact us only. */
  monthly: number | null;
  /** Annual price in £. Null wherever `monthly` is. */
  annual: number | null;
  seats: number;
  /** Included AI credits per calendar month. */
  credits: number;
  /** Guest evaluators a panel can invite. */
  guestEvaluators: number;
  /** The third line on the card. See Plan.includes. */
  includes: string;
  cta: string;
  planKey: string;
  secondary?: PlanLink;
}

export const BUYER_PLANS: BuyerPlan[] = [
  {
    name: 'Buyer Pro',
    who: 'Contracting authorities and private sector procurement teams',
    monthly: 299,
    annual: 3229,
    seats: 5,
    credits: 750,
    guestEvaluators: 10,
    includes: '10 guest evaluators, requirement builder, evidence locator and delivery monitoring.',
    cta: START_LABEL,
    planKey: 'buyer_pro',
  },
  {
    name: 'Buyer Portfolio',
    who: 'Large authorities, groups and multi entity buyers',
    monthly: 699,
    annual: 7549,
    seats: 10,
    credits: 3000,
    guestEvaluators: 25,
    includes: '25 guest evaluators. Pay by card, or by invoice on 30 days with a PO number.',
    cta: START_LABEL,
    planKey: 'buyer_portfolio',
    secondary: {
      label: 'Talk to us about frameworks (approved supplier lists)',
      href: '/contact/?product=buy&tier=portfolio#contact-form',
    },
  },
];

/*
 * ── R262-WEB-08 · THE TWO CHARGES A CUSTOMER COULD INCUR AND COULD NOT SEE ───
 *
 * Owner decision, PRICING-LOCK-2026-08.md section 1, verbatim:
 *
 *     Credit top-ups (PUBLIC): £10/100 · £50/500 · £100/1,000, one-time.
 *     Metered overage (PUBLIC): £0.10 per credit.
 *     Top-ups and overage are real charges a customer can incur and previously
 *     appeared on no public surface. That was a clarity gap, not a marketing
 *     choice.
 *
 * All four prices are LIVE AND CHARGEABLE in Stripe today, verified 2026-08-09:
 * `crowagent_credits_topup_100`, `_500`, `_1000` and
 * `crowagent_crowmark_overage_metered`. This site published none of them, so a
 * customer could be billed for something the pricing page never mentioned.
 *
 * THE FIGURES ARE NOT AUTHORED HERE EITHER. They derive from one platform
 * constant, `web/lib/billing/credit-pricing.ts`:
 *
 *     CREDIT_UNIT_PRICE_PENCE = 10                 -> £0.10 a credit
 *     CREDIT_TOPUP_PACK_SIZES = [100, 500, 1000]
 *     topupPricePence(n) = round(n * 10 * (1 - discount)), discount 0 by default
 *
 * so a pack costs exactly its credits at the same £0.10 unit rate: 100 -> £10,
 * 500 -> £50, 1,000 -> £100. A top-up is not cheaper per credit than overage
 * and the page must not imply that it is; what a top-up buys is the ability to
 * keep working without opting into per-credit billing.
 */
export interface CreditTopup {
  /** Credits granted by the pack. */
  credits: number;
  /** One-time price in £. */
  price: number;
}

export const CREDIT_TOPUPS: CreditTopup[] = [
  { credits: 100, price: 10 },
  { credits: 500, price: 50 },
  { credits: 1000, price: 100 },
];

/**
 * Pay-as-you-go overage, in PENCE per credit, so the rate is an integer and
 * cannot pick up a floating-point tail on its way to the page. Rendered as
 * £0.10. Mirrors CREDIT_UNIT_PRICE_PENCE on the platform.
 */
/** The free days a first CrowMark plan starts with (D236, BILL-TRIAL-002 in the
 *  platform's create-checkout route). Read by /pricing and the home page, so the
 *  number is written once. A card is collected by Stripe before it starts. */
export const TRIAL_DAYS = 7;

/** The one line said beside a START_LABEL button that has no trial line of its
 *  own nearby: what the trial is and that a card is needed, so the shorter
 *  label never hides either (R285-WEB-REVIEW-2026-10-22 item 3). */
export const TRIAL_NOTE = `Your first ${TRIAL_DAYS} days are free. A card is needed to start.`;

/** The AI credits a first plan's free trial carries (D236, the platform's
 *  create-checkout trial grant). Already published in the trial answers on
 *  /pricing/ and /faq/, now written once here so those answers read it. */
export const TRIAL_CREDITS = 30;

/** Reading a tender is charged by size: EXTRACT_CREDITS for every
 *  EXTRACT_PAGES pages, rounded up (platform CREDIT_WEIGHTS.crowmark_rfp_extract
 *  over CREDIT_BILLING_UNITS.crowmark_rfp_extract, see CREDIT_PAGES below).
 *  A spreadsheet counts SHEET_ROWS_PER_PAGE rows as one page. */
export const EXTRACT_CREDITS = 3;
export const EXTRACT_PAGES = 10;
export const SHEET_ROWS_PER_PAGE = 50;

/** Credits to read a document of `pages` pages. */
export function extractCredits(pages: number): number {
  return Math.ceil(pages / EXTRACT_PAGES) * EXTRACT_CREDITS;
}

/** "£10 for 100 credits, £50 for 500, or £100 for 1,000", from CREDIT_TOPUPS. */
export function topupSentence(): string {
  const n = (v: number) => v.toLocaleString('en-GB');
  const parts = CREDIT_TOPUPS.map((t, i) => `£${n(t.price)} for ${n(t.credits)}${i === 0 ? ' credits' : ''}`);
  return `${parts.slice(0, -1).join(', ')}, or ${parts[parts.length - 1]}`;
}

/** "1 user" or "5 users". */
export function usersLabel(seats: number): string {
  return seats === 1 ? '1 user' : `${seats.toLocaleString('en-GB')} users`;
}

export const OVERAGE_PENCE_PER_CREDIT = 10;

/** £0.10, for prose. Two decimal places always, because a rate reads as one. */
export const OVERAGE_PER_CREDIT_LABEL = `£${(OVERAGE_PENCE_PER_CREDIT / 100).toFixed(2)}`;

/** 10p, for the short Extra usage strip on /pricing. */
export const OVERAGE_PENCE_LABEL = `${OVERAGE_PENCE_PER_CREDIT}p`;

/** A cell is a tick, a cross, or a literal value. */
export type Cell = true | false | string;

export interface CompareRow {
  feature: string;
  /** Starter, Pro, Portfolio, in that order. */
  cells: [Cell, Cell, Cell];
}

/*
 * THE TOP FIVE, PLUS THE ROW THAT WAS MISSING.
 *
 * The legacy table led with "Active bids: Unlimited" on all three plans and then
 * never mentioned the axis that IS capped. That is what made OA-05 read as a
 * false claim: not that the bids row was wrong, but that the credits row did not
 * exist to give it context. Both are here now, adjacent, in that order.
 */
/*
 * ROWS ARE DERIVED FROM `PLANS`, NOT RETYPED BESIDE IT. R262-WEB-08.
 *
 * The credits row read `['200', '750', '3,000']` and the seats row read
 * `['1 user', '5 users', ...]`, three feet from the array that already holds
 * both numbers. That is the exact shape of the defect the pricing lock was
 * written to end: the same figure restated until two copies disagree. The
 * comparison table now cannot disagree with the cards, because it is not a
 * second copy.
 */
function triple(cell: (p: Plan) => Cell): [Cell, Cell, Cell] {
  const [starter, pro, portfolio] = PLANS;
  return [cell(starter), cell(pro), cell(portfolio)];
}

/** "1 user" / "5 users", and Portfolio's included-plus-more wording. */
function seatCell(p: Plan): string {
  const users = `${p.seats} user${p.seats === 1 ? '' : 's'}`;
  return p.moreSeatsByArrangement ? `${users} included, more by arrangement` : users;
}

export const COMPARE_LEAD: CompareRow[] = [
  { feature: 'Active bids', cells: ['Unlimited', 'Unlimited', 'Unlimited'] },
  { feature: 'AI credits a month', cells: triple((p) => p.credits.toLocaleString('en-GB')) },
  { feature: 'Seats (licensing)', cells: triple(seatCell) },
  /*
   * PUBLISHED FOR THE FIRST TIME, R262-WEB-08. Every row above says what a plan
   * INCLUDES; none of them said what happens after it is used up, and the answer
   * is two real charges that were live in Stripe and on no public surface. The
   * row is identical across all three plans because the offer genuinely is, and
   * a comparison table that omits a charge because it does not differentiate is
   * how the charge stayed invisible.
   */
  {
    feature: 'When the credits run out',
    cells: triple(
      () =>
        /* R285-P2-EXTRA-USAGE-SELF-SERVE-01, D234 and D235: packs, auto reload
           up to a limit the customer sets, and pay as you go only when the
           customer switches it on. Same wording as the Extra usage strip on
           /pricing and the answer in the FAQ. */
        `Packs from £${CREDIT_TOPUPS[0].price}, auto reload, or ${OVERAGE_PER_CREDIT_LABEL} a credit on pay as you go if you switch it on`,
    ),
  },
  {
    feature: `Tender feed: ${LIVE_SOURCES}`,
    cells: [true, true, true],
  },
  /* R285-WEB-CLAIMS-AUDIT-01 P5, M10, P3, M13. Guest reviewers were published
     for Velstrian Buy only, though every Bid plan carries them (catalogue.ts
     guestReviewers, through site-facts.json). Single sign-on was printed as a
     Portfolio feature, and D241 puts it on every plan. */
  {
    feature: 'Guest reviewers',
    cells: [String(GUEST_REVIEWERS.starter), String(GUEST_REVIEWERS.pro), String(GUEST_REVIEWERS.portfolio)],
  },
  { feature: 'Single sign-on (SAML 2.0) with SCIM provisioning, and passkeys', cells: [true, true, true] },
  { feature: 'Grounded AI drafting with an AI-use note (PPN 017 guidance)', cells: [true, true, true] },
  { feature: 'Deterministic social value calculation', cells: [true, true, true] },
];

/*
 * SPLIT, DELIBERATELY. The legacy table carried one row reading "Procurement Act
 * 2023 s.52 / s.71 KPI check". Sections 52 and 71 are two duties with two
 * different verbs and two different moments, and merging them is the specific
 * error recorded as OA-26 and guarded against in src/pages/sources.astro:
 *   s.52  set at least three KPIs before the contract is entered, and publish
 *         them. Applies above £5m.
 *   s.71  assess performance against those KPIs at least every 12 months, and
 *         publish the assessment.
 * A supplier reading a feature table needs to know the product checks both, not
 * that it checks something with a slash in it.
 */
export const COMPARE_MORE: CompareRow[] = [
  { feature: 'Post-award delivery tracking and monthly reports', cells: [false, true, true] },
  {
    feature: 'Contract targets check: targets set and published (Procurement Act 2023, section 52)',
    cells: [false, true, true],
  },
  {
    feature: 'Performance review check: performance assessed and published (Procurement Act 2023, section 71)',
    cells: [false, true, true],
  },
];

export interface CreditPageRow {
  doc: string;
  unit: string;
  example: string;
}

/**
 * What counts as one page for ingestion. Unchanged from the live page, and it
 * matches the platform: CREDIT_WEIGHTS.crowmark_rfp_extract = 3 charged per
 * CREDIT_BILLING_UNITS.crowmark_rfp_extract = 10 pages, rounded up.
 */
export const CREDIT_PAGES: CreditPageRow[] = [
  { doc: 'PDF', unit: 'One page', example: '10-page tender document (ITT) = 3 credits' },
  { doc: 'PowerPoint', unit: 'One slide', example: '12-slide briefing = 6 credits' },
  { doc: 'Word or plain text', unit: 'The whole document', example: 'Response template = 3 credits' },
  {
    doc: 'Spreadsheet (Excel or CSV)',
    unit: '50 rows of a sheet, rounded up and added across sheets',
    example: '5,000-row pricing schedule = 100 pages = 30 credits',
  },
];

export interface Faq {
  question: string;
  answer: string;
}

/*
 * THE FAQ, WITH FIVE CORRECTIONS. Questions are unchanged from the live page so
 * a returning reader finds the same answers in the same order.
 *
 * ── THE FIFTH, R262-D-20, 2026-08-08 ────────────────────────────────────────
 * Owner decision, verbatim: "we must not save payment information and let
 * stripe level save this so our claim is correct we dont but stripe will
 * do." Three answers below said "no card is taken", which is false: the
 * platform's create-checkout route (web/app/api/stripe/create-checkout
 * /route.ts) sets `payment_method_collection: "always"` on every Checkout
 * Session it creates, including a trial (`trial_period_days: 14`), so Stripe
 * collects a card before access starts even though nothing is charged during
 * a trial. The accurate and stronger claim, applied consistently below: the
 * card is required, and it is Stripe that holds it, never us.
 */
/* The figures the answers below print, read from the plan data above so no
   answer types a price, an allowance or a discount (R285-WEB-ENTERPRISE-REDESIGN-01). */
const [FAQ_STARTER, FAQ_PRO, FAQ_PORTFOLIO] = PLANS;
const [FAQ_BUYER_PRO, FAQ_BUYER_PORTFOLIO] = BUYER_PLANS;
const gbp = (n: number | null) => `£${(n ?? 0).toLocaleString('en-GB')}`;
const num = (n: number) => n.toLocaleString('en-GB');
const orJoin = (a: string[]) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} or ${a[a.length - 1]}`);

export const PRICING_FAQS: Faq[] = [
  {
    question: 'Is there a free plan?',
    /* WAS "No card is required to start", next to a Request access button.
       There is no self-serve signup to start, so the sentence described a
       motion that does not exist.

       THEN WAS "every plan begins with a 14-day trial". Removed under owner
       decision A-54, 2026-08-04, and this is the more serious of the two
       defects. A published trial is a commercial commitment, and CrowMark is
       sold by scoped engagement with a demo as the CTA, so the offer was one
       nobody intended to honour. The contradiction was inside this very array:
       every plan above carries the CTA "Request access", and this answer sat
       under them promising a trial anyone could start. /roadmap had already
       dropped the same claim while /pricing kept it, so the site was publishing
       two different offers, which is the actual defect. The prices stay; only
       the trial goes.

       "SO NO CARD IS TAKEN WHEN YOU ASK" REMOVED, R262-D-20, 2026-08-08. See
       the array header. Asking is free, but the trial it names two sentences
       earlier does collect a card at Stripe checkout before it starts. */
    answer:
      `No. Velstrian Bid is a paid product. You can run the free Tender Compliance Matrix at any time with no account, and your first ${TRIAL_DAYS} days on Velstrian Bid are free. A card is needed to start, held securely by Stripe and never stored by us.`,
  },
  {
    /* WAS "How does the 14-day trial work?", answered with "full access to the
       Pro tier of your chosen product" (residue from the retired product
       switcher, when there is one product). The whole entry was replaced under
       A-54: a question that names an offer keeps the offer alive in search
       results and in the FAQPage JSON-LD this array feeds, even if the answer
       underneath denies it.

       A-174, 2026-08-05: THE QUESTION RETURNS, and the reasoning above is why
       it can. A-54's objection was to an offer nobody intended to honour, not
       to trials as such, and the owner has since asked twice for a trial WITH
       LIMITS, then asked directly why it was not back. The entry below states
       the limits rather than promising "full access", which is the difference
       between the claim A-54 removed and this one. It is deliberately the
       SEPARATE entry after "Is there a free plan?", because a free plan and a
       time-limited trial are two different things and conflating them is what
       made the original answer wrong. */
    /* NO CREDIT FIGURE IS PUBLISHED IN THIS ANSWER, and that omission is the
       load-bearing part of it. The day limit, expiry, seat cap and the
       one-trial-per-work-email-domain rule are all built and enforced
       server-side.

       THE SECOND HALF OF THIS NOTE WAS STALE AND IS CORRECTED, R262-WEB-08,
       2026-08-09. It said the generation cap was ADVISORY because
       CREDIT_ENFORCEMENT_MODE "is not set there at all", confirmed 2026-08-05.
       The platform's tracker (RELEASE-2.6.2-TRACKER.md row R262-TRIAL-V3)
       records the flip to "enforce" on Railway staging AND production on
       2026-08-08. The same row records that the variable could not be re-read
       afterwards, and it could not be read from this session either: Railway
       variable listing is credential-gated here. Recorded state: enforce. Live
       state: unverified from this repo.

       THE OMISSION STANDS REGARDLESS. "Recorded as enforced, not verified" is
       not the standard for publishing a limit, and A-80's rule is a standing
       one: the trial credit figure goes back only when the flip is verified on
       the running service. See A-80. */
    question: `How does the ${TRIAL_DAYS} day trial work?`,
    /* "A card is required to start it..." ADDED, R262-D-20, 2026-08-08. See
       the array header. This answer is literally "how it works", so the step
       where Stripe collects a card belongs in it; leaving it out was the same
       omission as the removed "no card taken" lines, just by silence rather
       than by a false sentence. */
    answer:
      `Choose a plan and select ${START_LABEL}. Your first ${TRIAL_DAYS} days are free, on the ${FAQ_STARTER.name} features for ${usersLabel(FAQ_STARTER.seats)} with ${TRIAL_CREDITS} AI credits. A card is needed to start, held securely by Stripe and never stored by us. Cancel within ${TRIAL_DAYS} days and pay nothing. There is one free trial per organisation and work email domain.`,
  },
  {
    question: 'How do I get access?',
    /* "NO CARD IS TAKEN WHEN YOU ASK" REMOVED, R262-D-20, 2026-08-08. See the
       array header. Asking (booking a demo) never took a card; setting the
       account up, the next clause in this same sentence, does, at Stripe
       checkout. The old wording let the true first half stand for the whole
       process. */
    answer:
      `Choose a plan and select ${START_LABEL}. You create your account, pay by card through Stripe, and start straight away. There is nothing to request first. If you would like a walk through before you start, book a demo.`,
  },
  {
    question: 'Are there any hidden setup fees?',
    /* THE ANSWER TO A "HIDDEN CHARGES" QUESTION HAD A HIDDEN CHARGE UNDER IT.
       R262-WEB-08. Two chargeable prices were live in Stripe on the day this
       answer said there were no charges beyond the plan: the credit top-up packs
       and the £0.10 metered overage. Neither is hidden in the sense the question
       means, because neither can happen without the customer buying it, but an
       answer that lists what is not charged and omits what can be is answering
       the question badly. Both are named here and priced in full two answers
       down. */
    answer:
      `No. There are no setup, implementation or training fees on any plan. The only charges beyond your plan are ones you choose: a credit pack, auto reload up to a monthly limit you set, or pay as you go at ${OVERAGE_PER_CREDIT_LABEL} a credit if you switch it on.`,
  },
  {
    question: 'Can I switch plans mid-cycle?',
    /* ADDED, and it is enforced rather than advisory: tier-limits.ts blocks a
       CrowMark downgrade when this month's credit usage already exceeds the
       target plan's allowance, and fails closed if it cannot read the usage. A
       customer meets that behaviour, so the page states it. */
    answer:
      'Yes. You can upgrade, downgrade or cancel at any time from the billing dashboard, and changes are pro-rated and applied immediately. One limit is enforced rather than advisory: if you have already used more AI credits this month than the plan you are moving down to includes, the downgrade is held until your credits reset.',
  },
  {
    question: 'Do you price for large organisations?',
    /* SSO CORRECTED. This said broader SAML 2.0 SSO was "on our roadmap" and
       named Microsoft Entra ID as the one identity provider available. Neither
       is true: the platform ships generic SAML 2.0 SSO with SCIM provisioning
       and domain verification (app/api/auth/sso/[org]/{login,acs,metadata},
       SsoConfigForm.tsx, ScimTokenManager.tsx, DomainVerificationManager.tsx).
       No tier is named here, because which plan includes SSO is a commercial
       packaging question the code does not answer and I will not invent. */
    answer:
      `Yes. ${FAQ_PORTFOLIO.name} is ${gbp(FAQ_PORTFOLIO.monthly)} a month, or ${gbp(FAQ_PORTFOLIO.annual)} a year, for ${usersLabel(FAQ_PORTFOLIO.seats)} and ${num(FAQ_PORTFOLIO.credits)} AI credits a month, and adds the Integrations package. Single sign-on via SAML 2.0 and SCIM user provisioning are included on every plan. Buy it by card and start today. Talk to us about contracts, custom terms or more than ${usersLabel(FAQ_PORTFOLIO.seats)}.`,
  },
  {
    question: 'How is Velstrian Buy priced?',
    /* WAS "Why is there no price for the buyer side?", answered with "a single
       self-serve number would be misleading". D195 (2026-10-09) replaced that
       position: Buyer Pro is a listed price. The question is rewritten rather
       than kept, because a question that names the old position keeps it alive in
       search results and in the FAQPage JSON-LD this array feeds. */
    answer:
      `${FAQ_BUYER_PRO.name} is ${gbp(FAQ_BUYER_PRO.monthly)} a month, or ${gbp(FAQ_BUYER_PRO.annual)} a year, with ${usersLabel(FAQ_BUYER_PRO.seats)}, ${num(FAQ_BUYER_PRO.credits)} AI credits a month and ${num(FAQ_BUYER_PRO.guestEvaluators)} guest evaluators. ${FAQ_BUYER_PORTFOLIO.name} is ${gbp(FAQ_BUYER_PORTFOLIO.monthly)} a month, or ${gbp(FAQ_BUYER_PORTFOLIO.annual)} a year, with ${usersLabel(FAQ_BUYER_PORTFOLIO.seats)}, ${num(FAQ_BUYER_PORTFOLIO.credits)} AI credits a month and ${num(FAQ_BUYER_PORTFOLIO.guestEvaluators)} guest evaluators. Annual prices are ${annualDiscountPct(FAQ_BUYER_PRO)}% off twelve months. Pay by card, or pay for ${FAQ_BUYER_PORTFOLIO.name} by invoice on 30 days with a PO number. Talk to us if you buy through a framework.`,
  },
  {
    question: 'How are AI credits counted?',
    /* The included allowances were never published anywhere on the legacy page.
       They are the first sentence now. */
    answer:
      `Each plan includes a monthly allowance: ${num(FAQ_STARTER.credits)} credits on ${FAQ_STARTER.name}, ${num(FAQ_PRO.credits)} on ${FAQ_PRO.name} and ${num(FAQ_PORTFOLIO.credits)} on ${FAQ_PORTFOLIO.name}, and Velstrian Buy carries ${num(FAQ_BUYER_PRO.credits)} on ${FAQ_BUYER_PRO.name} and ${num(FAQ_BUYER_PORTFOLIO.credits)} on ${FAQ_BUYER_PORTFOLIO.name}. One credit is one AI generation. Reading a tender document and extracting its requirements costs ${EXTRACT_CREDITS} credits per ${EXTRACT_PAGES} pages, rounded up, so a ${EXTRACT_PAGES}-page ITT costs ${extractCredits(EXTRACT_PAGES)} credits. A page is one PDF page, one PowerPoint slide, or a whole Word or text document. A spreadsheet is counted by rows rather than by sheets: ${SHEET_ROWS_PER_PAGE} rows count as one page, so a ${num(5000)}-row pricing schedule on a single sheet counts as ${num(5000 / SHEET_ROWS_PER_PAGE)} pages, or ${extractCredits(5000 / SHEET_ROWS_PER_PAGE)} credits. Everything we calculate rather than generate is never charged and never capped, and a generation that fails is not charged.`,
  },
  /*
   * ── R262-WEB-08 · THE ANSWER TO THE QUESTION THE CREDIT MODEL RAISES ───────
   *
   * The answer above publishes the allowances and then stops, which leaves the
   * one thing a metered plan makes a buyer ask unanswered: what happens when I
   * hit the number. Two real charges live behind that moment and neither had
   * ever appeared on this site.
   *
   * EVERY CLAUSE BELOW WAS READ OUT OF THE PLATFORM BEFORE IT WAS WRITTEN, and
   * the order of the sentences is the order of the code:
   *
   *   spend order   supabase/migrations/20260736000000_i1_ai_credit_ledger.sql,
   *                 the `consume_ai_credits` RPC: `v_from_included` is taken
   *                 from the monthly allowance first, `v_from_topup` is the
   *                 remainder, and only when the remainder exceeds
   *                 `topup_balance` does it RAISE `ai_credits_exhausted`.
   *   no rollover   Same migration's header: the monthly allowance resets with
   *                 the month, while `topup_balance` is CARRIED FORWARD into
   *                 the new month row. "Inventing an expiry on credits the
   *                 customer paid for would be theft" is that file's own line.
   *   refused       api/app/services/credit_accounting.py: in `enforce`,
   *                 exhaustion raises HTTP 402 AI_CREDITS_EXHAUSTED.
   *   opt-in only   Same file: the overage branch needs BOTH the platform
   *                 switch `CREDIT_OVERAGE_ENABLED` and a per-organisation
   *                 `credit_overage_settings` row with enabled=true. Without
   *                 the opt-in it falls back to the refusal
   *                 (api/tests/test_ws4b_overage.py::
   *                 test_overage_enabled_but_not_opted_in_still_402s).
   *
   * WHY "ON REQUEST" AND NOT "IN YOUR SETTINGS". The platform has a self-serve
   * button, but the branch it enables is ALSO gated by CREDIT_OVERAGE_ENABLED,
   * a platform-wide switch that defaults OFF and appears in no deploy record.
   * "Ask us and we switch it on" is true whatever that switch is set to;
   * "press the button and generation continues" would not be. The site does not
   * publish a mechanism whose live state it could not read.
   *
   * SUPERSEDED BY D234 AND D235 (2026-10-19). Overage, auto reload and one click
   * packs become self serve in R285-P2-EXTRA-USAGE-SELF-SERVE-01, and D236 holds
   * production until that work ships in one combined round. This answer states
   * the behaviour of that release, so it must not reach the live site before the
   * app does.
   */
  {
    question: 'What happens when my AI credits run out?',
    answer:
      `Your monthly allowance is spent first, then any credits you have bought. After that, three options keep you going, and each one is your choice. Credit packs of ${orJoin(CREDIT_TOPUPS.map((t) => num(t.credits)))} credits cost ${orJoin(CREDIT_TOPUPS.map((t) => gbp(t.price)))} and never expire. Auto reload buys a pack for you when you run low, up to a monthly limit you set. Pay as you go is off unless you switch it on, and then bills ${OVERAGE_PER_CREDIT_LABEL} a credit up to a cap you choose. With none of these on, AI generation stops until the month resets, so you are never billed beyond your plan without agreeing to it. The monthly allowance does not roll over. Bought credits do. Everything we calculate rather than generate keeps working, and a generation that fails is not charged.`,
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'All major credit and debit cards, through Stripe. Buyer Portfolio can also be paid by invoice on 30 days with a PO number, at the same price. Talk to us about invoice billing on any other plan.',
  },
];
