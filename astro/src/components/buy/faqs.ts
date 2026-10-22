/**
 * faqs.ts: single source of truth for Velstrian Buy FAQs.
 *
 * Feeds the visible FAQ accordion on /buy/ and the FAQPage JSON-LD node.
 * Written for a busy buyer who is not a procurement specialist (RULE 0-U).
 *
 * Every price is read from data/pricing.ts, never typed.
 * British English only. No em dashes or en dashes.
 */
import { BUYER_PLANS, annualDiscountPct } from '../../data/pricing';
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
      'No. Scores are evaluator set. The evaluation pre-read is a reading aid that locates evidence in a response against each published criterion. It does not score, rank, or recommend a mark, and every criterion card carries an advisory label. Under the Procurement Act 2023 equal treatment duty, the panel evaluates and scores every response. There is also an AI consistency check on completed evaluations, which is advisory and never changes a number.',
  },
  {
    question: `Does ${PRODUCT_NAME_BUY} replace our e-sourcing portal?`,
    answer:
      'No. It is not a system of record and it does not run your formal competition. Formal notices and the competition audit trail stay in the portal you already use, such as Jaggaer, Atamis, In-tend, ProContract or Proactis. It sits alongside that portal. You build the social value requirement, read the responses against it, and monitor delivery after award. For smaller requests, Quick RFQ sends the request to suppliers by personal link and collects their quotes and receipts in one place.',
  },
  {
    question: 'How is social value handled on the buyer side?',
    answer:
      'You build a requirement pack with a deterministic rubric, so the weighting and the measures are fixed before responses arrive rather than argued afterwards. After award, commitments on each contract roll up against delivery by National TOMs theme and are RAG rated: on track at 95% or above, at risk from 80%, breached below 80%. An authority with nothing committed shows as no data rather than green. Measures are aligned to National TOMs conventions. It is not a full National TOMs implementation.',
  },
  {
    question: 'Are the quotes it shows us real, or generated?',
    answer:
      "Located, not generated. Every quote is found verbatim in the supplier's own submitted text and is dropped if it cannot be located there. The pre-read points at evidence in the response. It does not write a summary of what the response might have said.",
  },
  {
    question: 'What does it cost?',
    answer:
      `Buyer Pro is £${BUYER_PRO.monthly} a month, or £${proAnnual} a year, with ${BUYER_PRO.seats} users, ${BUYER_PRO.credits.toLocaleString('en-GB')} AI credits a month and ${BUYER_PRO.guestEvaluators} guest evaluators. Buyer Portfolio is £${BUYER_PORTFOLIO.monthly} a month, or £${portfolioAnnual} a year, with ${BUYER_PORTFOLIO.seats} users, ${BUYER_PORTFOLIO.credits.toLocaleString('en-GB')} AI credits a month and ${BUYER_PORTFOLIO.guestEvaluators} guest evaluators. Annual prices are ${annualDiscountPct(BUYER_PRO)}% off twelve months. Pay by card, or pay for Buyer Portfolio by invoice on 30 days with a PO number.`,
  },
  {
    question: 'Can it produce our Procurement Act transparency return?',
    answer:
      'It produces an award notice return across your recorded contracts, which you review and publish. The statutory checks it applies, including section 52 on published KPIs above an estimated value of £5m and section 71 on assessing and publishing performance, are advisory and are not legal advice.',
  },
];
