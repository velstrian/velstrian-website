/**
 * The /bid/ questions, in the words a first time bidder uses (RULE 0-U).
 *
 * ONE LIST FOR TWO READERS. BidFaq.astro renders it and pages/bid.astro builds
 * the FAQPage JSON-LD from it, so the marked up answers are always the ones on
 * the page (check-faq-parity.js).
 *
 * Every fact is restated from data/crowmark.ts FAQS (the published answers on
 * the previous /bid/ page) and data/site-facts.ts, never typed fresh: the
 * sources come from LIVE_SOURCES_DAILY and ON_REQUEST_SENTENCE, the file types
 * and sizes from START_FORMATS, START_MAX_MB and PACK_MAX_MB, and the PPN 026
 * and section 52 wording is the published wording, simplified around it.
 */
import { LIVE_SOURCES_DAILY, ON_REQUEST_SENTENCE, START_FORMATS, START_MAX_MB, PACK_MAX_MB } from '../../data/site-facts';
import { PRODUCT_NAME_BID, PRODUCT_NAME_BUY } from '../../lib/brand-names';
import { CREDIT_TOPUPS, OVERAGE_PER_CREDIT_LABEL } from '../../data/pricing';

const [FIRST_TOPUP] = CREDIT_TOPUPS;

export interface BidFaq {
  question: string;
  answer: string;
}

export const BID_FAQS: BidFaq[] = [
  {
    question: 'What is a tender?',
    answer:
      'A tender is how an organisation asks businesses to bid for a piece of work. It explains what they need, asks you questions, and says how the answers will be scored. Public bodies have to advertise most of theirs, and private companies send them too.',
  },
  {
    question: 'What do ITT, RFP, RFQ, PQQ and SQ mean?',
    answer:
      'They are names for the same idea. An invitation to tender (ITT) or a request for proposal (RFP) is a full set of questions to answer. A request for quote (RFQ) is a shorter request for a price. A pre qualification questionnaire (PQQ) or selection questionnaire (SQ) asks standard questions about your business, such as insurance and accreditations, before the main bid. You can work on all of them here.',
  },
  {
    question: 'I have never written a bid. Do I need a bid writer?',
    answer: `No. ${PRODUCT_NAME_BID} is made for businesses that write their own bids, with no bid writer or bid team. It drafts each answer from your own documents, shows where every claim came from, and you read, change and approve it.`,
  },
  {
    question: 'Where do the contracts come from?',
    answer: `Public contracts come from ${LIVE_SOURCES_DAILY}, and the source is named on every notice. ${ON_REQUEST_SENTENCE} For private work, upload the tender or request you were sent.`,
  },
  {
    question: 'Can the AI invent a number in my bid?',
    answer:
      'No. Every £ and % in a drafted answer has to match a figure from your own data before the draft is shown to you. If it does not, the draft is rejected. Social value totals are worked out in code, never by the AI, and an answer cannot be approved until its figures and sources have been checked.',
  },
  {
    question: 'Is AI use disclosed to the buyer?',
    answer: `Yes. Every AI drafted answer carries a PPN 017 note, the government guidance on telling a buyer that AI helped, and a person has to approve the answer before it goes to the buyer. ${PRODUCT_NAME_BID} does not send anything to a buyer portal on your behalf.`,
  },
  {
    question: 'What is social value, and what is PPN 026?',
    answer:
      'Social value is the extra good your business does in the local area, such as jobs, training or cutting waste, and many public contracts score it. PPN 026, the next edition of the Social Value Model, applies to central government procurements commenced on or after 1 January 2027 at 1 million pounds inc VAT or above. The buyer publishes the weighting, and it is a weighting, not a score. Totals are worked out in code from a curated library of measures.',
  },
  {
    question: 'Does the fit score tell me whether I will win?',
    answer:
      'No. It shows how well a contract suits your business and the reason behind each part, and suggests whether to go for it, look again or pass. The same inputs always give the same result. It is a reading of the tender, not a prediction of the award, and you make the decision.',
  },
  {
    question: 'Can it read a scanned tender document?',
    answer: `${PRODUCT_NAME_BID} reads text. A bid starts from ${START_FORMATS} files up to ${START_MAX_MB} MB, and the rest of the pack, including ZIP archives and PowerPoint, can be added up to ${PACK_MAX_MB} MB a file. A scanned PDF with no text in it is flagged as needing OCR rather than guessed at.`,
  },
  {
    question: 'What happens after I win a public contract?',
    answer:
      `The promises in your bid become a checklist with dates. Under the Procurement Act 2023, section 52 expects at least three published key performance indicators on contracts above an estimated £5m, and section 71 expects performance against them to be assessed and published. ${PRODUCT_NAME_BID} checks both and rates the yearly summary red, amber or green. The check is advisory and never blocks you.`,
  },
  {
    question: 'What is an AI credit?',
    answer: `Drafting and checking answers uses AI credits. Every plan includes a monthly allowance, shown beside its price. If you need more, top ups start at £${FIRST_TOPUP.price} for ${FIRST_TOPUP.credits} credits and never expire, or we can switch on pay as you go at ${OVERAGE_PER_CREDIT_LABEL} a credit. Until you ask for it, the plan price is the most you can be charged.`,
  },
  {
    question: 'I buy services. Is there something for me?',
    answer: `Yes. ${PRODUCT_NAME_BUY} helps you ask for what you need, collect the replies and see the proof behind each one. Your own team does the scoring, never the AI.`,
  },
  {
    question: 'Is everything on this page available today?',
    answer:
      `Yes. This page describes what ${PRODUCT_NAME_BID} does now. Anything still being built is on the roadmap. To see it on the kind of work you bid for, start a trial or book a call.`,
  },
];
