/**
 * faqs.ts: single source of truth for Velstrian Buy FAQs.
 *
 * Feeds the visible FAQ accordion on /buy/ and the FAQPage JSON-LD node.
 * Written for a busy buyer who is not a procurement specialist (RULE 0-U).
 *
 * Every price is read from data/pricing.ts, never typed.
 * British English only. No em dashes or en dashes.
 */
import { BUYER_PLANS, annualDiscountPct, TRIAL_DAYS } from '../../data/pricing';
import { PRODUCT_NAME_BUY } from '../../lib/brand-names';

const [BUYER_PRO, BUYER_PORTFOLIO] = BUYER_PLANS;
const proAnnual = BUYER_PRO.annual?.toLocaleString('en-GB');
const portfolioAnnual = BUYER_PORTFOLIO.annual?.toLocaleString('en-GB');

export interface FaqItem {
  question: string;
  answer: string;
}

export const BUY_FAQS: FaqItem[] = [
  {
    question: 'What is a tender?',
    answer:
      'A tender is how an organisation asks suppliers to bid for a piece of work. It sets out what is needed, asks questions, and explains how answers will be evaluated. Public authorities publish tenders openly, and private companies send them to invited suppliers.',
  },
  {
    question: 'What is an evaluation?',
    answer:
      'An evaluation is how a buyer reviews and scores the responses received from suppliers against the published criteria. Your panel of evaluators reads each bid, checks the evidence, and enters their scores and notes in one place.',
  },
  {
    question: 'What is a contract award?',
    answer:
      'An award is the formal decision to give the contract to the winning supplier. After award, you record the agreed terms and commitments so delivery can be tracked throughout the life of the contract.',
  },
  {
    question: 'Does the AI score or rank supplier bids?',
    answer:
      'No. Your evaluators set every score. The first read of each reply only finds the proof for each question you published. It does not score, rank, or recommend a mark, and every card it shows says so. The law asks you to treat every supplier the same way (the equal treatment duty in the Procurement Act 2023), so your panel scores every reply. Once scoring is done, an AI check can point out uneven scoring for your panel to look at. It never changes a number.',
  },
  {
    question: `Does ${PRODUCT_NAME_BUY} replace our e-sourcing portal?`,
    answer:
      'No. It is not a system of record and it does not run your formal competition. Formal notices and the competition audit trail stay in the portal you already use, such as Jaggaer, Atamis, In-tend, ProContract or Proactis. It sits alongside that portal. You build the social value requirement, read the responses against it, and monitor delivery after award. For smaller requests, Quick RFQ sends the request to suppliers by personal link and collects their quotes and receipts in one place.',
  },
  {
    question: 'How is social value handled on the buyer side?',
    answer:
      'You write the requirement with its scoring guide fixed in advance, so what you measure and how much each part counts are settled before replies arrive rather than argued afterwards. After award, the promises on each contract are added up against delivery by theme and rated red, amber or green: on track at 95% or above, at risk from 80%, breached below 80%. A contract with nothing promised shows as no data rather than green. Measures are aligned to National TOMs conventions (Themes, Outcomes and Measures, a UK framework for counting social value). It is not a full National TOMs implementation.',
  },
  {
    question: 'Are the quotes it shows us real, or generated?',
    answer:
      "Found, not written. Every quote is found word for word in the supplier's own reply and is left out if it cannot be found there. The first read points at the proof in the reply. It does not write a summary of what the reply might have said.",
  },
  {
    question: 'What does it cost?',
    answer:
      `Buyer Pro is £${BUYER_PRO.monthly} a month, or £${proAnnual} a year, with ${BUYER_PRO.seats} users, ${BUYER_PRO.credits.toLocaleString('en-GB')} AI credits a month and ${BUYER_PRO.guestEvaluators} guest evaluators. Buyer Portfolio is £${BUYER_PORTFOLIO.monthly} a month, or £${portfolioAnnual} a year, with ${BUYER_PORTFOLIO.seats} users, ${BUYER_PORTFOLIO.credits.toLocaleString('en-GB')} AI credits a month and ${BUYER_PORTFOLIO.guestEvaluators} guest evaluators. Annual prices are ${annualDiscountPct(BUYER_PRO)}% off twelve months. On Buyer Pro your first ${TRIAL_DAYS} days are free, and a card is needed to start. Buyer Portfolio starts paid, by card or by invoice on 30 days with a PO number.`,
  },
  {
    question: 'Can it produce our Procurement Act transparency return?',
    answer:
      'It produces an award notice return across your recorded contracts, which you review and publish. The checks it applies, including section 52 on published targets (KPIs) above an estimated value of £5m and section 71 on assessing and publishing performance, guide your team, and what you publish is your decision.',
  },
];
