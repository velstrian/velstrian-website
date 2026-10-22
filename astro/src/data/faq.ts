/**
 * faq.ts: every question on /faq, as data.
 *
 * WHY THIS IS DATA AND NOT MARKUP. The legacy page hand-wrote the accordions in
 * HTML and hand-wrote a separate FAQPage JSON-LD block beside them. They drifted,
 * exactly as two hand-maintained copies of the same thing always do:
 *
 *   visible Q&A pairs ................... 14
 *   questions in the JSON-LD ............  9
 *   visible but MISSING from JSON-LD ....  5
 *   present in both but answer differs ..  1
 *   order differs between the two ....... yes (positions 6 and 7 swapped)
 *
 * So 36% of the page was invisible to structured-data consumers, and the entire
 * Security category (the most trust-critical block on the page) was absent
 * from it. That is a real SEO defect and it was nobody's mistake in particular;
 * it is what having two sources guarantees over time.
 *
 * The page renders the accordions from this array AND generates the FAQPage
 * block from this same array. They cannot drift again without someone deleting
 * one of the two call sites.
 *
 * ANSWERS ARE VERBATIM from the live page. Several make claims I have flagged
 * rather than edited, because rewriting published marketing copy is the owner's
 * call, not mine. See OWNER-ACTIONS.md (OA-12).
 */

import { SIGNUP_URL } from './app';
import {
  PLANS,
  TRIAL_DAYS,
  TRIAL_CREDITS,
  EXTRACT_CREDITS,
  EXTRACT_PAGES,
  SHEET_ROWS_PER_PAGE,
  extractCredits,
  topupSentence,
  usersLabel,
  annualDiscountPct,
  OVERAGE_PER_CREDIT_LABEL,
} from './pricing';
import { PPN026 } from './duty';
import { FACTS, CERTIFICATION_STATEMENT, ICO_REFERENCE, listJoin } from './site-facts';
import { LEGAL_ENTITY_NAME } from '../lib/brand-names';

/* Every price, allowance, discount and fact the answers below print is read
   from data/pricing.ts, data/duty.ts and data/site-facts.ts, never typed
   (R285-WEB-ENTERPRISE-REDESIGN-01, 2026-10-22). */
const STARTER = PLANS[0];
const ANNUAL_PCT = annualDiscountPct(STARTER);
const TRIAL_SCOPE = `${STARTER.name} features for ${usersLabel(STARTER.seats)} with ${TRIAL_CREDITS} AI credits`;
const num = (n: number) => n.toLocaleString('en-GB');
const SHEET_EXAMPLE_ROWS = 5000;
const SHEET_EXAMPLE_PAGES = SHEET_EXAMPLE_ROWS / SHEET_ROWS_PER_PAGE;

export interface FaqEntry {
  question: string;
  /** Plain text. Any link is expressed via `link` so the JSON-LD stays clean. */
  answer: string;
  /** Optional in-answer link, rendered after the answer text. */
  link?: { label: string; href: string };
}

export interface FaqCategory {
  id: string;
  label: string;
  heading: string;
  standfirst: string;
  entries: FaqEntry[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'faq-general',
    label: 'General',
    heading: 'General',
    standfirst: 'Foundation, signup, and getting started.',
    entries: [
      {
        // "UK suppliers" -> "suppliers", 2026-08-04. Same OA-33/A-50 change as
        // site.ts and footer.ts, and this answer contradicted itself: it opened
        // by scoping the product to one market and closed with "Both work in the
        // public sector and the private sector." It also feeds /faq's FAQPage
        // node, so the market scoping was in the structured data twice.
        question: 'What is Velstrian?',
        answer:
          'Velstrian helps suppliers find the work, draft answers cited to the rules, the tender and their own bids, and evidence delivery after award. Its platform drafts every answer from your own submitted bids and checks the figures in code rather than generating them. It serves both sides of a procurement. Velstrian Bid answers tenders, RFPs, RFIs, PQQs and SQs from bids you have already written. Velstrian Buy builds and publishes requirements, then locates the evidence for each one across the responses received. It never scores, because the evaluation panel scores. Both work in the public sector and the private sector.',
      },
      // ── A-54, 2026-08-04: THE 14-DAY TRIAL IS GONE FROM THIS FILE ──────────
      // Both entries below asserted a published 14-day free trial with no card
      // required. Owner decision A-54 removed it: CrowMark is sold by scoped
      // engagement with "Book a demo" as the CTA, so a published trial was a
      // commercial commitment nobody intended to honour. The first of the two
      // even carried a "Request access" link beside a sentence saying no card
      // was required to start, which is two different motions in one answer.
      // Publishing two offers is the defect; the trial was the wrong one to
      // keep. This file is the single source for the visible accordions
      // AND the FAQPage JSON-LD (see the header), so a trial left in one entry
      // here would have been published twice, in prose and in structured data.
      // The prices are untouched: only the trial goes.
      {
        // "NO CARD IS TAKEN WHEN YOU ASK" REMOVED, R262-D-20, 2026-08-08. Owner
        // decision, verbatim: "we must not save payment information and let
        // stripe level save this so our claim is correct we dont but stripe
        // will do." Creating the account runs a Stripe Checkout Session
        // (web/app/api/stripe/create-checkout/route.ts sets
        // `payment_method_collection: "always"` on every one, trial included),
        // so a card IS collected before sign-in even though asking itself is
        // free. Same fix applied to the near-identical answer two entries
        // below and to /pricing's FAQ, so the three do not drift back apart.
        question: 'How do I sign up?',
        answer:
          // D236 (2026-10-19): sign up is self serve. The answer above this
          // line described the request step that D236 removed.
          'Choose a plan on the pricing page and select Start now. You create your account, pay by card through Stripe, and can start scoring bids or preparing your evidence straight away. The card is held securely by Stripe and never stored by us.',
        link: { label: 'Start now', href: SIGNUP_URL },
      },
      {
        // The question itself is replaced, not just its answer. A question that
        // names an offer keeps the offer alive in a search result and in the
        // JSON-LD even when the answer beneath it says no.
        // STALE OFFER REMOVED 2026-08-05 (O-25). This answer closed by naming
        // "the PPN 002 social value calculator" as always free. That tool was
        // deleted on owner instruction on 2026-08-04 and both its routes now
        // 301 to /glossary/ppn-002, so the sentence advertised a page that
        // returns a redirect. It was published TWICE per render, in the prose
        // and again in the FAQPage JSON-LD, because both are generated from
        // this one string, so the dead offer was also being fed to search
        // engines as structured data. check-facts.js has no rule for the
        // calculator and could not have caught it.
        //
        // The site's one free tool is the tender compliance matrix, so the
        // sentence is re-pointed rather than dropped: the reader's question
        // ("can I try something before I pay?") has a true answer, and it is
        // the same claim /tools already makes for that tool in its own eyebrow
        // ("Free, no account") and its page body ("there is no sign-up").
        // "NO CARD IS TAKEN WHEN YOU ASK" REMOVED, R262-D-20, 2026-08-08. See
        // the note on "How do I sign up?" above; same route, same fix.
        question: 'Can I try Velstrian Bid before I subscribe?',
        answer:
          `Yes. Your first ${TRIAL_DAYS} days on Velstrian Bid are free, on the ${TRIAL_SCOPE}. A card is needed to start, held securely by Stripe and never stored by us. If you would rather see it first, book a demo. The tender compliance matrix is always free with no account needed.`,
      },
    ],
  },
  {
    id: 'faq-products',
    label: 'Products',
    heading: 'Products',
    standfirst: 'How Velstrian Bid finds tenders, drafts answers and scores social value.',
    entries: [
      {
        question: 'What is PPN 026?',
        answer:
          'PPN 026 (Procurement Policy Note 026) is the next edition of the UK government Social Value Model, published on GOV.UK on 5 August 2026. It applies to central government procurements commenced on or after 1 January 2027, at 1 million pounds inc VAT or above. The date that decides which edition applies is when the procurement was commenced, not when the proposal was written, so a bid drafted today is most likely scored under this one.',
      },
      {
        question: `What is the ${PPN026.fig} minimum?`,
        answer:
          'The buyer publishes the social value weighting in its own tender documents, and many local authorities and NHS trusts set a higher one than central government requires. Velstrian Bid lets you model the weighting your buyer published, calculates the social-value total in code, and drafts the narrative with a PPN 017 AI-transparency disclosure for you to approve.',
      },
      {
        question: 'How is social value scored?',
        answer:
          'Velstrian Bid calculates it deterministically in code, using unit-aware arithmetic over a curated library of social value measures aligned to National TOMs conventions. It is not a full National TOMs implementation. The language model never computes the figure: any generated prose containing a £ or % that the computed figures do not support is rejected rather than shown.',
      },
      {
        question: 'Is Velstrian Bid ready to use?',
        answer:
          'Velstrian Bid is live and in daily use, with more being added. Tender discovery from Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED, document ingestion, grounded answer drafting, deterministic social value calculation, delivery tracking and Procurement Act 2023 s.52 and s.71 KPI checks all work today. See the Velstrian Bid page for what each stage covers.',
        link: { label: 'Velstrian Bid page', href: '/bid/' },
      },
    ],
  },
  {
    id: 'faq-pricing',
    label: 'Pricing',
    heading: 'Pricing',
    standfirst: 'Plans, billing, and subscription management.',
    entries: [
      {
        question: 'What plans are available?',
        // A-54: "All paid plans include a 14-day free trial" removed. The
        // published prices and the 10% annual discount are unchanged.
        // A-174, 2026-08-05: the TRIAL returns as its own entry below rather
        // than as a clause on this one. A-54 was right that a trial bundled
        // into the plans answer published two motions at once; it is a
        // separate offer with its own limits and it reads as one.
        answer:
          `Velstrian Bid's plans are ${listJoin(PLANS.map((p) => p.name))}, each with a published price. Sign up and start today by card, and annual billing saves ${ANNUAL_PCT}%.`,
        link: { label: 'See current pricing', href: '/pricing/' },
      },
      {
        // ── A-174, OWNER INSTRUCTION 2026-08-05: "why free trial 14 days is
        // not yet back?" ──────────────────────────────────────────────────
        //
        // RESTORED AGAINST THE FRAME TERMS ALREADY SETS, rather than as a new
        // promise. terms.md section 2 already reads: "An evaluation trial may
        // be granted on request. Where one is granted it is time limited and
        // usage limited, and its limits are stated to you when access is
        // given." That clause was never removed by A-54, only the marketing
        // claim was. This entry makes those limits public instead of leaving
        // them to be "stated when access is given", which is what the owner
        // asked for twice: a trial WITH limits.
        //
        // WHY IT IS BY REQUEST AND NOT SELF-SERVE. There is no self-serve
        // signup anywhere on this platform, so a trial that claimed one would
        // contradict every other answer on this page. This is the same motion
        // as every other route in: ask, and we set it up.
        //
        // ── NO CREDIT NUMBER IS PUBLISHED HERE, DELIBERATELY ───────────────
        //
        // This is the single most important constraint on this answer and it
        // comes from A-80's deep dive. Every limit named below is BUILT AND
        // ENFORCED server-side and was verified as such: the day limit, expiry
        // revocation, the seat cap and one-trial-per-work-email-domain.
        //
        // THE GENERATION CAP WAS NOT, AND THAT HALF OF THIS NOTE IS NOW STALE.
        // It read: "CONFIRMED AGAINST LIVE PRODUCTION 2026-08-05: the variable
        // is not set on the Railway service at all, so it falls through to
        // observe and no cap is enforced today." That was true when written and
        // is NOT true now, and a stale record beside a rule is how the rule gets
        // broken by someone who trusts it.
        //
        // CORRECTED R262-WEB-08, 2026-08-09. credit_accounting.py still DEFAULTS
        // CREDIT_ENFORCEMENT_MODE to "observe", but the platform's own tracker
        // (RELEASE-2.6.2-TRACKER.md, row R262-TRIAL-V3) records the flip to
        // "enforce" on Railway STAGING AND PRODUCTION on 2026-08-08, with
        // production returning /healthz 200 on the deploy carrying it. That same
        // row also records that the Railway variable could not be re-read to
        // confirm it, and this session could not read it either: the variable
        // listing is credential-gated in this environment. So the recorded state
        // is enforce and the live state is unverified from here.
        //
        // THE RULE BELOW IS UNCHANGED AND DOES NOT DEPEND ON ANY OF THAT. No
        // trial credit figure is published. A-54's defect was a number on the
        // site that nothing behind it honours, and "probably enforced, could not
        // check" is not the standard for publishing a limit. It goes back only
        // when the flip is verified on the running service, not when a document
        // says it happened.
        //
        // "A CARD IS REQUIRED TO START IT..." ADDED, R262-D-20, 2026-08-08.
        // Owner decision, verbatim: "we must not save payment information and
        // let stripe level save this so our claim is correct we dont but
        // stripe will do." This answer named every other trial limit but was
        // silent on the card, and this is the page's primary trial explainer,
        // so the omission was the most visible instance of the defect even
        // though this exact sentence never claimed "no card". The platform's
        // create-checkout route sets `payment_method_collection: "always"` on
        // the Checkout Session that grants the trial, so Stripe collects a
        // card before it starts.
        question: 'Is there a free trial?',
        answer:
          // D236 (2026-10-19): the trial is no longer requested. A first
          // CrowMark plan starts with 14 free days at Starter, as the
          // platform's create-checkout route provisions it (BILL-TRIAL-002).
          `Yes. Your first ${TRIAL_DAYS} days are free, on the ${TRIAL_SCOPE}, so delivery tracking, monthly social value reports and the section 52 and section 71 checks are not part of it. A card is needed to start, held securely by Stripe and never stored by us. Cancel within the ${TRIAL_DAYS} days and nothing is charged. There is one free trial per organisation and work email domain.`,
        link: { label: 'Start now', href: SIGNUP_URL },
      },
      {
        question: 'Can I cancel anytime?',
        answer:
          'Yes. You can cancel your subscription at any time from Settings > Billing in the platform. Your access continues until the end of the current billing period. Your data is preserved, so if you resubscribe later, everything will still be there.',
      },
      {
        question: 'How are AI credits counted?',
        answer:
          `One credit is one AI generation, such as a drafted tender answer or a rewritten method statement. Your plan includes a monthly allowance of them. Reading a tender document and extracting its requirements is charged by size, at ${EXTRACT_CREDITS} credits per ${EXTRACT_PAGES} pages, rounded up, so a ${EXTRACT_PAGES}-page invitation to tender costs ${extractCredits(EXTRACT_PAGES)} credits. A page means one PDF page, one PowerPoint slide, or a whole Word or plain text document. Everything Velstrian Bid calculates rather than generates, including social value arithmetic, scoring and exports, is free and unlimited on every paid plan, and a generation that fails is never charged.`,
      },
      {
        // ── R262-WEB-08, 2026-08-09 ────────────────────────────────────────
        //
        // The answer above describes a metered model and never says what
        // happens when the meter runs out, and behind that silence sat two
        // real charges: the credit top-up packs and the £0.10 metered overage,
        // both LIVE AND CHARGEABLE in Stripe (crowagent_credits_topup_100/500/
        // 1000, crowagent_crowmark_overage_metered, verified 2026-08-09) and
        // published on no page of this site. Owner decision
        // PRICING-LOCK-2026-08.md section 1 makes both PUBLIC and calls their
        // absence "a clarity gap, not a marketing choice".
        //
        // Every clause is sourced in astro/src/data/pricing.ts's matching FAQ,
        // which carries the file-by-file citations so they are written once:
        // the spend order and the non-expiry of top-ups from the ledger
        // migration, the refusal from credit_accounting.py, and the fact that
        // overage needs BOTH a platform switch and a per-organisation opt-in
        // before it can bill anyone.
        question: 'What happens when my AI credits run out?',
        answer:
          `Your monthly allowance is spent first, then any top-up credits you have bought. When both are gone, AI generation is refused for the rest of the calendar month rather than continuing and billing you for it. A credit top-up is a one-off purchase that never expires: ${topupSentence()}. Pay-as-you-go overage is switched on for your organisation on request, and each further credit is then billed at ${OVERAGE_PER_CREDIT_LABEL} on your next invoice. Overage stays off unless you ask for it, so you are never billed beyond your plan without agreeing to it first. The monthly allowance resets at the start of each calendar month and does not roll over. Purchased top-up credits do.`,
        link: { label: 'See the credit prices', href: '/pricing/#ai-credits' },
      },
      {
        question: 'How is a spreadsheet counted when I upload one?',
        answer:
          `By rows, not by sheets. ${num(SHEET_ROWS_PER_PAGE)} rows of a sheet count as one page, rounded up and added together across every sheet in the file. A pricing schedule of ${num(SHEET_EXAMPLE_ROWS)} rows on a single Excel sheet therefore counts as ${num(SHEET_EXAMPLE_PAGES)} pages, which is ${extractCredits(SHEET_EXAMPLE_PAGES)} credits, rather than as a single page. We count it this way because a 5,000-row schedule holds roughly 17 times the text of a 10-page PDF and the AI work scales with how much text there is to read. CSV files are counted exactly like Excel files, and we only count the rows we actually read.`,
      },
      {
        question: 'How do billing periods work?',
        // A-54: "After your 14-day trial, you will be prompted to choose a
        // plan" removed. The sentence that followed it began "If you don't
        // subscribe", which only made sense as the end of a trial, so it is
        // restated as what happens when a subscription lapses instead.
        answer:
          `Subscriptions are billed monthly or annually (${ANNUAL_PCT}% discount). Your billing period starts from the date you subscribe and renews on the same date until you cancel. If a subscription lapses, your data is preserved but you won't be able to create new records or contracts.`,
      },
    ],
  },
  {
    id: 'faq-security',
    label: 'Security',
    heading: 'Security',
    standfirst: 'Data integrity, encryption, and privacy standards.',
    entries: [
      {
        question: 'What data do you use?',
        answer:
          "Social value is computed in code with unit-aware arithmetic over Velstrian's curated measure catalogue.",
      },
      {
        question: 'Is my data secure?',
        answer:
          `Yes. We use Supabase (PostgreSQL) with Row Level Security on all tables. All data is encrypted in transit (TLS) and at rest. We are protected by Cloudflare (DDoS, Bot Fight Mode, SSL Full Strict). Authentication uses Supabase Auth with optional TOTP MFA. ${LEGAL_ENTITY_NAME} is registered with the ICO as a data controller, reference ${ICO_REFERENCE}. ${CERTIFICATION_STATEMENT} A data processing agreement is available on request. Customer data is stored in the EU (${FACTS.regions.data_at_rest.place}).`,
        link: { label: 'See our Security page for full details', href: '/security/' },
      },
    ],
  },
];

/** Flattened, in document order: the single source for the FAQPage JSON-LD. */
export const FAQ_ALL: FaqEntry[] = FAQ_CATEGORIES.flatMap((c) => c.entries);
