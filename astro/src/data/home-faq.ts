/**
 * home-faq.ts: homepage questions and answers, as data.
 *
 * Rendered by src/components/evidenced/Faq.astro and emitted as an FAQPage
 * structured data node on src/pages/index.astro via faqPage().
 *
 * None of these questions duplicates /faq/, which check-faq-parity validates.
 */
import { PLATFORM_SHORT_NAME, PRODUCT_NAME_BUY } from '../lib/brand-names';
import { FACTS, listJoin } from './site-facts';
import type { FaqEntry } from '../lib/schema';

const live = listJoin(FACTS.sources.live.map((s) => s.name));

export const HOME_FAQS: FaqEntry[] = [
  {
    question: 'What is a tender?',
    answer:
      'A tender is how an organisation asks businesses to bid for a piece of work. It explains what they need, asks you questions, and says how the answers will be scored. Public bodies have to advertise most of theirs, and private companies send them too.',
  },
  {
    question: 'What do ITT, RFP and RFQ mean?',
    answer:
      'They are names for the same idea. An invitation to tender (ITT) or a request for proposal (RFP) is a full set of questions to answer. A request for quote (RFQ) is a shorter request for a price. You can work on any of them here.',
  },
  {
    question: 'I have never written a bid. Is this for me?',
    answer: `Yes. ${PLATFORM_SHORT_NAME} is made for businesses that write their own bids, with no bid writer or bid team. It drafts each answer from your past answers, checks every claim against your documents, and you read, change and approve it.`,
  },
  {
    question: 'Does it cover private work as well as public?',
    answer: `Yes. Public contracts arrive every morning from ${live}. For private work, upload the tender or request you were sent.`,
  },
  {
    question: 'What is social value?',
    answer:
      'Many public contracts ask what extra good your business will do in the local area, such as jobs, training or cutting waste. That is social value, and it usually counts towards your score. On central government contracts it is scored using rules called PPN 026. The product helps you answer it from what you already do.',
  },
  {
    question: 'What happens after I win?',
    answer:
      'The promises in your bid become a checklist with dates, so you can show the customer what you have delivered. Under the Procurement Act 2023, public buyers now check how larger contracts are going against agreed targets, so it helps to have the proof ready.',
  },
  {
    question: 'What is an AI credit?',
    answer:
      'Drafting and checking answers uses AI credits. Every plan includes a monthly allowance, shown beside its price, and you can buy more if you run out.',
  },
  {
    question: 'Will it write things that are not true?',
    answer:
      'No. Every claim in an answer is checked against your own documents. If it cannot find proof for something, it tells you rather than guessing, and you decide what to do.',
  },
  {
    question: 'I buy services. Is there something for me?',
    answer: `Yes. ${PRODUCT_NAME_BUY} helps you ask for what you need, collect the replies and see the proof behind each one. Your own team does the scoring, never the AI.`,
  },
];
