/**
 * roadmap.ts: the phases, the AI notes and the prioritisation method behind
 * /roadmap.
 *
 * ── THE ONE RULE THIS FILE ENCODES ──────────────────────────────────────────
 *
 * OA-13: Phase 3 carried the date pill "Q4 2026" directly above the sentence
 * "Early research, not yet committed engineering". A reader takes the date and
 * ignores the caveat, and the date is what gets quoted back.
 *
 * So `date` is OPTIONAL and `status` is NOT. A phase gets a quarter only when
 * that quarter is a commitment somebody will stand behind; everything else
 * prints its status in words and no date at all. The type makes the honest case
 * the easy one: you have to go out of your way to put a date on research.
 *
 * STATUS IS RENDERED AS TEXT, NEVER AS COLOUR OR OPACITY ALONE. Same rule as
 * the timeline in src/pages/about.astro. A reader who cannot see the dimming,
 * or who is reading the printed page, must still be able to tell a shipped
 * thing from a planned one. WCAG 1.4.1.
 */

export type PhaseStatus = 'live' | 'progress' | 'research';

/** The words a reader sees. Never abbreviated to a colour. */
export const STATUS_LABEL: Record<PhaseStatus, string> = {
  live: 'Live now',
  progress: 'In progress',
  research: 'Researching, not committed',
};

export interface RoadmapItem {
  title: string;
  body: string;
  href?: string;
}

export interface Phase {
  /** "Phase 1", "Later". The name of the band, not its timing. */
  name: string;
  status: PhaseStatus;
  /**
   * A quarter, ONLY where it is committed. Leave undefined for anything that is
   * not, and the page prints "No committed date" instead of a number nobody
   * agreed to. See the note at the top of this file.
   */
  date?: string;
  lead: string;
  items: RoadmapItem[];
}

export const PHASES: Phase[] = [
  {
    name: 'Phase 1',
    status: 'live',
    date: 'Q2 2026',
    /*
     * BODIES REFRESHED 2026-09-08 against what is DEPLOYED, not against what is
     * committed. The owner reported this page as not updated while a great deal
     * had shipped, and they were right: these two paragraphs described Velstrian Bid
     * as it stood months earlier and named none of the bid workspace that went
     * live with R2.7.1 on 24 August, nor the supplier relationship management
     * suite that went live with R2.8.1 on 3 September. Every capability named
     * below resolves to a route on the platform's origin/main, which is the tip
     * Vercel reports READY in production.
     */
    lead: 'Available now: tools to find public and private contracts, draft answers from your past bids, and manage contract delivery.',
    items: [
      {
        title: 'Velstrian Bid',
        body: 'Find contracts across Find a Tender, Contracts Finder, Public Contracts Scotland and EU TED refreshed daily, including advance notices and framework expiry dates. Upload full tender packs for an instant brief. Draft answers grounded in your previous bids and answer library, with version history, diff comparison, and track changes. Set review checkpoints, starting with a bid or no-bid decision. Calculate social value scores in code, record post-award delivery evidence, and run key performance indicator (KPI) checks under Procurement Act 2023 sections 52 and 71.',
        href: '/bid/',
      },
      {
        title: 'Velstrian Buy',
        body:
          'Publish tender requirements with clear scoring rules, then automatically find and compare evidence across every supplier submission. Velstrian Buy organises the responses so your panel can score them easily. After award, track supplier delivery with scorecards, regular review meetings, risk alerts, corrective actions, and a value tracking workspace.',
        href: '/buy/',
      },
      /* R285-WEB-CLAIMS-AUDIT-01, D252 (5): the AI Compliance Advisor is a
         released feature. It sat in Phase 3 as "Tender reasoning copilot",
         researching and uncommitted, while the product shipped it
         (api/app/routers/advisor.py). Described only by what that code does. */
      {
        title: 'AI Compliance Advisor',
        body: 'Ask procurement or social value questions in everyday language. The Advisor answers from official regulations and, with your consent, your own bids and commitments. Every citation links to official guidance, and any number or percentage not verified in your files or the brief is flagged for you to check.',
        href: '/bid/#features',
      },
    ],
  },
  {
    /*
     * DELIVERED, AND THE BAND KEEPS ITS QUARTER BECAUSE IT MET IT. This band
     * read `status: 'progress'` against `date: 'Q3 2026'` until 2026-09-08,
     * when both of its items were checked against the platform's own release
     * record rather than against memory. Both had shipped.
     *
     * Passkeys landed in Release 2.6 as WS-8, verified live in a browser on
     * 2026-07-26: enrolment, sign in on app.crowagent.ai, credential
     * management in settings, and an RP ID set to the parent domain so one
     * passkey works across the app and the portal. The `auth.passkeys` flag
     * that gated it has since been dropped, so it is on for every account.
     *
     * THE BODY BELOW DESCRIBES A SECOND FACTOR AND NOT A PASSWORDLESS LOGIN,
     * deliberately. Signing in with a passkey INSTEAD of a password is a
     * different thing, it is not shipped, and this page must not imply it.
     */
    name: 'Phase 2',
    status: 'live',
    date: 'Q3 2026',
    lead: 'Delivered security updates: faster biometric sign in and deeper document-grounded answers.',
    items: [
      {
        title: 'Passkeys (fingerprint and face sign in)',
        body: 'Use Windows Hello or Touch ID instead of typing a two-factor code to sign in to your Velstrian Bid account. One passkey covers the app and customer portal, and you can view or remove saved devices in settings at any time.',
      },
      {
        title: 'Deeper grounded drafting from buyer documents',
        /* R285-WEB-CLAIMS-AUDIT-01 R4: the AI buyer priority extractor is off in
           production, so the priorities come from documents the bidder attaches. */
        body: 'Velstrian Bid reads buyer priorities from the tender and strategy documents you upload alongside your company evidence. It suggests social value answers citing the exact passages used, so you can review, edit, and approve every sentence before submission.',
      },
    ],
  },
  {
    /*
     * NO DATE, AND THAT IS THE OA-13 FIX. This band used to read "Q4 2026"
     * above a lead that calls the same work uncommitted. The two statements
     * cannot both stand, and the one that had to go is the one a prospect would
     * quote back.
     */
    name: 'Phase 3',
    status: 'research',
    lead: 'Early research into automated alerts for new procurement regulations.',
    items: [
      {
        title: 'Live procurement regulatory updates',
        body: 'A live feed for changes to UK public procurement rules. Important updates to Procurement Policy Note (PPN) 026 and the Procurement Act 2023 will alert you directly in your Velstrian Bid dashboard, showing what changed and what actions your bids need.',
      },
    ],
  },
  {
    /*
     * THE "2027" PILL IS GONE. It sat above "on the radar beyond the next
     * twelve months", which is a horizon rather than a plan, and a year printed
     * next to an item reads as a delivery year however it is hedged. The band
     * is called "Later" and the lead says what later means; that is the timing,
     * and it is the only timing anyone can stand behind for this work.
     */
    name: 'Later',
    status: 'research',
    lead: 'Longer-term research planned beyond the next twelve months.',
    items: [
      {
        /*
         * NARROWED, AND THE HALF THAT SHIPPED IS NAMED AS SHIPPED. This item
         * read "Broader SSO (SAML 2.0 / OIDC)" and its body claimed "Microsoft
         * Entra ID SSO is available now on Portfolio". Both halves were wrong
         * in opposite directions:
         *
         *   web/app/api/auth/sso/_lib/saml-config.ts is a PROVIDER-AGNOSTIC
         *   SAML 2.0 Service Provider, shipped, with SCIM 2.0 at
         *   web/app/api/scim/v2/** and DNS domain verification. So SAML 2.0 is
         *   not a 2027 item, and /pricing already publishes it as available,
         *   which left two pages of this site contradicting each other.
         *
         *   No plan is named, because which plan includes single sign-on is a
         *   commercial packaging question the repo cannot answer. pricing.astro
         *   states it with no tier attached for the same reason.
         *
         * OIDC genuinely is not built. That is the part that stays here.
         */
        title: 'Enterprise single sign on: OpenID Connect (OIDC)',
        body: 'Single sign on using SAML 2.0, automated user provisioning (SCIM), and custom domain verification are live today for all major identity providers. This adds OpenID Connect (OIDC) as an additional standard for organisations that use it for team logins.',
      },
    ],
  },
];

/** The four "Live today" notes about how the AI is built. */
export const AI_LIVE: { heading: string; body: string; link?: { label: string; href: string } }[] = [
  {
    heading: 'Deterministic engine, then narrative',
    body: 'The calculations come from precise code, not an AI guess. Social value scoring and Procurement Act 2023 key performance indicator (KPI) checks under sections 52 and 71 are calculated by code first. The language model only drafts clear sentences explaining those verified figures, and never invents a number.',
  },
  {
    heading: 'Two models, two jobs',
    body: 'Customer-facing drafting in Velstrian Bid runs on Google Gemini. In-depth reasoning and analysis tasks run on Anthropic Claude. Both are data sub-processors that handle task text under secure contract outside the EU. The full list is on the',
    link: { label: 'privacy page', href: '/privacy/' },
  },
  {
    heading: 'Grounded in the source law',
    body: 'Velstrian Bid checks the real legislation behind each tender: Procurement Policy Note (PPN) 026, the updated Social Value Model applying to central government procurements from 1 January 2027 at 1 million pounds including VAT or above, and the Procurement Act 2023 for delivery performance checks. Drafts cite the exact clause so every claim is verifiable.',
  },
  {
    heading: 'A human signs every output',
    body: 'Under UK data protection law (Article 22 UK GDPR), Velstrian never makes automated decisions with legal effect. AI drafts are suggestions. You review, edit, and approve every word before anything goes into a bid, report, or customer submission. The system proposes, and your team decides.',
  },
];

/** Where the AI work is heading. Status in words, and a date only where committed. */
export const AI_NEXT: { status: PhaseStatus; heading: string; body: string }[] = [
  {
    /*
     * MOVED TO `live` 2026-09-08, AND IT HAD TO MOVE OR THE PAGE CONTRADICTED
     * ITSELF. This entry and the Phase 2 item of the same name are the same
     * piece of work rendered twice on one page. When Phase 2 became delivered,
     * a second block still reading "we are extending" with an indicative Q3
     * date left /roadmap publishing two different answers about one feature.
     * Whichever way that resolves, it cannot stay split.
     */
    status: 'live',
    heading: 'Deeper grounded drafting from buyer documents',
    body: 'Shipped. Velstrian Bid drafts answers using your past bids and approved answer library. It also reads buyer priorities from attached strategy documents and tender packs to suggest social value answers, citing the exact source text for your approval.',
  },
  {
    /* R285-WEB-CLAIMS-AUDIT-01, D252 (5). Was "Tender reasoning copilot",
       research stage. Released as the AI Compliance Advisor. */
    status: 'live',
    heading: 'AI Compliance Advisor',
    body: 'Shipped. Ask procurement and social value questions in plain words. The Advisor answers from official regulations and, with your permission, from your past bids. Every citation is matched to official guidance, and any unverified figure is flagged for you to check.',
  },
  {
    status: 'research',
    heading: 'Live procurement regulatory updates',
    body: 'A live feed for changes to UK public procurement rules. Key updates to PPN 026 and the Procurement Act 2023 will appear in your Velstrian Bid dashboard with a clear summary of what changed and what it means for your bids. In research.',
  },
];

/** How we decide what to ship next. */
export const METHOD: { n: string; heading: string; body: string }[] = [
  {
    n: '01',
    heading: 'Regulatory deadlines',
    body: 'Official legislation with fixed dates (such as PPN 026 applying from 1 January 2027 and Procurement Act 2023 commencement) is prioritised first.',
  },
  {
    n: '02',
    heading: 'Customer demand',
    body: 'When the same need comes up repeatedly from bidding teams, it moves up our plan. We prioritised post-award delivery evidence because Procurement Act 2023 KPI checks were the most requested capability beside our social value work.',
  },
  {
    n: '03',
    heading: 'Connecting the bid lifecycle',
    body: 'Post-award delivery evidence sits directly beside bid drafting because the same team that wins a contract must prove delivery performance under Procurement Act 2023 sections 52 and 71.',
  },
  {
    n: '04',
    heading: 'Verifiable accuracy over guesswork',
    body: 'Velstrian focuses on grounded, regulation-cited accuracy rather than adding generic writing tools that make up answers.',
  },
];

/** What we will not build. Scope discipline, stated rather than implied. */
export const WONT_BUILD: { heading: string; body: string }[] = [
  {
    heading: 'Regulations outside procurement',
    body: 'Rules like Extended Producer Responsibility (EPR) or Packaging Tax are important, but fall outside the bidding and procurement work Velstrian focuses on.',
  },
  {
    heading: 'Unverified AI text generation',
    body: 'Every AI feature in Velstrian is anchored to verified code, past documents, and official regulations. AI drafts words on top of verified data and never invents figures.',
  },
];
