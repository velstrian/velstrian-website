import {
  TRIAL_DAYS,
  CREDIT_TOPUPS,
  OVERAGE_PENCE_LABEL,
  PLANS,
  BUYER_PLANS,
  SEAT_ADDON,
  annualDiscountPct,
  START_LABEL,
} from '../../data/pricing';

const packs = (k: 'credits' | 'price') => {
  const v = CREDIT_TOPUPS.map((t) => (k === 'price' ? `£${t.price}` : t.credits.toLocaleString('en-GB')));
  return `${v.slice(0, -1).join(', ')} or ${v[v.length - 1]}`;
};

const [STARTER, PRO, PORTFOLIO] = PLANS;
const [BUYER_PRO, BUYER_PORTFOLIO] = BUYER_PLANS;
const n = (v: number) => v.toLocaleString('en-GB');

export interface PricingFaq {
  question: string;
  answer: string;
}

export const PRICING_PAGE_FAQS: PricingFaq[] = [
  {
    question: 'Is there a free trial?',
    answer:
      `Yes. Choose a plan and select ${START_LABEL} to begin your ${TRIAL_DAYS} day trial. Your first ${TRIAL_DAYS} days are free, on Starter features for 1 user with 30 AI credits. A card is required to start, held securely by Stripe and never stored by us. Cancel within the ${TRIAL_DAYS} days and you pay nothing. There is one free trial per organisation and work email domain.`,
  },
  {
    question: 'How does the 7 day trial work?',
    answer:
      `Choose a plan and select ${START_LABEL}. Your first ${TRIAL_DAYS} days are free, on the Starter features for 1 user with 30 AI credits. A card is needed to start, held securely by Stripe and never stored by us. Cancel within the ${TRIAL_DAYS} days and nothing is charged. There is one free trial per organisation and work email domain.`,
  },
  {
    question: 'What happens when my AI credits run out?',
    answer:
      `Your monthly allowance is spent first, then any credits you have bought. After that, three options keep you going, and each one is your choice. Credit packs of ${packs('credits')} credits cost ${packs('price')} and never expire. Auto reload buys a pack for you when you run low, up to a monthly limit you set. Pay as you go is off unless you switch it on, and then bills ${OVERAGE_PENCE_LABEL} a credit up to a cap you choose. With none of these on, AI generation stops until the month resets, so you are never billed beyond your plan without agreeing to it. Everything we calculate rather than generate keeps working, and a generation that fails is not charged.`,
  },
  {
    question: 'Can I add more people?',
    answer:
      `Yes. Velstrian Bid Pro and Velstrian Buy Pro allow extra seats for £${SEAT_ADDON.monthly} a month each, or £${SEAT_ADDON.annual} a year. Velstrian Bid Portfolio includes ${PORTFOLIO.seats} users, with more available by arrangement.`,
  },
  {
    question: 'Can I switch plans mid-cycle?',
    answer:
      'Yes. You can upgrade, downgrade or cancel at any time from the billing dashboard, and changes are pro rated and applied immediately. One limit is enforced rather than advisory: if you have already used more AI credits this month than the plan you are moving down to includes, the downgrade is held until your credits reset.',
  },
  {
    question: 'Are there any hidden setup fees?',
    answer:
      `No. There are no setup, implementation or training fees on any plan. The only charges beyond your plan are ones you choose: extra user seats, a credit pack, auto reload up to a monthly limit you set, or pay as you go at ${OVERAGE_PENCE_LABEL} a credit if you switch it on.`,
  },
  {
    question: 'How do I pay?',
    answer:
      'All major credit and debit cards, through Stripe. Buyer Portfolio can also be paid by invoice on 30 days with a PO number, at the same price. Talk to us about invoice billing on any other plan.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'All major credit and debit cards, through Stripe. Buyer Portfolio can also be paid by invoice on 30 days with a PO number, at the same price. Talk to us about invoice billing on any other plan.',
  },
  {
    question: 'Is it only for public sector tenders?',
    answer:
      'No. Velstrian Bid and Velstrian Buy work for public and private sector tenders, RFPs, RFIs, PQQs and requests for quotes. Public tenders arrive from official feeds, and private documents can be uploaded directly.',
  },
  {
    question: 'How do I get access?',
    answer:
      `Choose a plan and select ${START_LABEL}. You create your account, pay by card through Stripe, and start straight away. There is nothing to request first. If you would like a walk through before you start, book a demo.`,
  },
  {
    question: 'Do you price for large organisations?',
    answer:
      `Yes. Portfolio is £${PORTFOLIO.monthly} a month, or £${n(PORTFOLIO.annual ?? 0)} a year, for ${PORTFOLIO.seats} users and ${n(PORTFOLIO.credits)} AI credits a month, and adds the Integrations package. Single sign-on via SAML 2.0 and SCIM user provisioning are included on every plan. Buy it by card and start today. Talk to us about contracts, custom terms or more than 10 users.`,
  },
  {
    question: 'How is Velstrian Buy priced?',
    answer:
      `Buyer Pro is £${BUYER_PRO.monthly} a month, or £${n(BUYER_PRO.annual ?? 0)} a year, with ${BUYER_PRO.seats} users, ${n(BUYER_PRO.credits)} AI credits a month and ${BUYER_PRO.guestEvaluators} guest evaluators. Buyer Portfolio is £${BUYER_PORTFOLIO.monthly} a month, or £${n(BUYER_PORTFOLIO.annual ?? 0)} a year, with ${BUYER_PORTFOLIO.seats} users, ${n(BUYER_PORTFOLIO.credits)} AI credits a month and ${BUYER_PORTFOLIO.guestEvaluators} guest evaluators. Annual prices are ${annualDiscountPct(BUYER_PRO)}% off twelve months. Pay by card, or pay for Buyer Portfolio by invoice on 30 days with a PO number. Talk to us if you buy through a framework.`,
  },
  {
    question: 'How are AI credits counted?',
    answer:
      `Each plan includes a monthly allowance: ${STARTER.credits} credits on Starter, ${PRO.credits} on Pro and ${n(PORTFOLIO.credits)} on Portfolio, and Velstrian Buy carries ${BUYER_PRO.credits} on Buyer Pro and ${n(BUYER_PORTFOLIO.credits)} on Buyer Portfolio. One credit is one AI generation. Reading a tender document and extracting its requirements costs 3 credits per 10 pages, rounded up, so a 10-page ITT costs 3 credits. A page is one PDF page, one PowerPoint slide, or a whole Word or text document. A spreadsheet is counted by rows rather than by sheets: 50 rows count as one page, so a 5,000-row pricing schedule on a single sheet counts as 100 pages, or 30 credits. Everything we calculate rather than generate is never charged and never capped, and a generation that fails is not charged.`,
  },
  {
    question: 'Is there a free plan?',
    answer:
      `No. Velstrian Bid is a paid product. You can run the free Tender Compliance Matrix at any time with no account, and your first ${TRIAL_DAYS} days on Velstrian Bid are free. A card is needed to start, held securely by Stripe and never stored by us.`,
  },
];
