/**
 * nav.ts: the primary navigation link tree, as typed data.
 *
 * ONE TREE, NOT TWO. Until 2026-08-04 this file held the desktop mega-menu and
 * the mobile accordion as two separate lists, and they had already drifted: the
 * mobile panel said "Free PPN 002 calculator" pointing at the calculator route
 * while the desktop panel said "PPN 002 Social Value Calculator" pointing at
 * /tools/. Same two destinations, two labels, two hrefs, and nothing in the
 * build could see the difference because both resolved. That drift was
 * inherited from js/nav-inject.js and preserved here verbatim on the grounds
 * that hrefs must not be "corrected", which was the right instinct for a URL
 * and the wrong one for a duplicate. A URL is a promise to the outside world.
 * A second copy of the menu is not; it is just a second place to forget.
 *
 * THE CALCULATOR IS GONE FROM THIS TREE, 2026-08-04, owner instruction: "remove
 * PPN 002 calculator page completly also with redirects", because it was not
 * earning its place. Two rows went with it, the tool and its methodology, and
 * neither was replaced by a dead link: the free-tool slot is the Tender
 * Compliance Matrix, and the explanatory slot is /glossary/ppn-002, which is
 * where both removed URLs now 301. A-24 in status/issues.json is closed by the
 * same instruction.
 *
 * So `menus` below is the ONLY list of dropdown links. Nav.astro renders the
 * desktop mega-menu and the mobile accordions from it, and a menu item added
 * here appears in both or in neither. There is no mobile block any more.
 *
 * ── A-510, OWNER HEADER REWORK 2026-11-02 ───────────────────────────────────
 *
 * The owner said the header was wrong: See it in action, the Help centre and
 * Sectors were missing, and Blog, FAQ and About sat loose as top links. The
 * header is now FIVE groups and nothing sits loose:
 *
 *   Products ▾     Velstrian Bid · Velstrian Buy · See it in action · Compare · Integrations
 *   Who it's for ▾ All sectors · Construction · Facilities · Education · Highways
 *   Pricing        (the one flat top link, kept exactly as it was)
 *   Resources ▾    Learn (Help centre, Blog, Glossary, PPN 026) · Free tools
 *                  (Tender Finder, Compliance Matrix, all tools) · Support (FAQ, Contact)
 *   Company ▾      About us · Trust and security (/security/) · Partners · Roadmap · Contact
 *
 * Products and Pricing were kept exactly as the owner asked. Every href is
 * checked against src/pages: there is no /trust/ page, so Trust and security
 * points at /security/, the legal page that states the controls. The footer
 * (data/footer.ts) and the command palette (lib/search-index.ts reads NAV and
 * FOOTER) follow the same groups.
 *
 * ── SUPERSEDED STRUCTURE (2026-08-04), kept for the history ──────────────────
 *
 * "Products" was doing three jobs at once: actual products, free tools, and
 * explanatory content. The free tools are lead-generation assets and they were
 * buried under a menu nobody opens looking for a calculator. They now have
 * their own "Resources" menu, and Blog stays top level.
 *
 *   Products    Velstrian Bid · Velstrian Buy · Compare Velstrian
 *   Resources   Tender Compliance Matrix · Free tools hub · PPN 002 explained ·
 *               Glossary
 *   Top level   Pricing · Blog · FAQ · About
 *
 * PRICING CAME OUT OF THE DROPDOWN. It was in both places (a top-level nav
 * item AND a Products row), so the header offered the same destination twice,
 * a couple of centimetres apart. The top-level item is the one that stays.
 *
 * ── OTHER STRUCTURAL DECISIONS CARRIED FORWARD ──────────────────────────────
 *
 *   - "How it works" is intentionally NOT a nav link (founder directive).
 *   - "Sectors" is deliberately NOT a top nav link (footer-only).
 *   - /resources, the hub page, is reachable from the footer rather than from
 *     the Resources menu: the menu lists the four destinations the owner named,
 *     and a hub whose own job is to link onward to three of them would be a
 *     fifth row that goes nowhere new. It IS in `activeRoutes` below, so a
 *     reader who arrives there from the footer sees the Resources trigger lit.
 *
 * ── HREFS ARE IN CANONICAL FORM, NO TRAILING SLASH ──────────────────────────
 *
 * Seo.astro emits `https://crowagent.ai/tools`, and the footer links
 * `/tools/tender-compliance-matrix`. The old nav mixed `/tools/` and `/tools`
 * between its two copies of the same link. One form now, and it is the one the
 * canonical tag declares.
 */
import { SITE } from './site';
import { APP_ORIGIN, SIGNUP_URL, START_LABEL } from './app';
import { PRODUCT_NAME_BID, PRODUCT_NAME_BUY } from '../lib/brand-names';
import type { IconName } from './icons';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavMenuItem extends NavLink {
  description: string;
  /** Maps to the token-based accent colour used on the row's icon. */
  accent: 'mark' | 'teal';
  /** Which glyph from the one line family (data/icons.ts) NavDropdown.astro
   *  draws for this row. R285-WEB-GEMINI-UIUX P2-2: the rows mixed filled dots
   *  with stroked glyphs at a 2 stroke, three icon languages in one panel. */
  icon: IconName;
}

export interface NavMenuColumn {
  label: string;
  items: NavMenuItem[];
}

export interface NavMenu {
  /**
   * Stable slug. It generates the trigger and panel element ids that wire up
   * aria-controls, so it must be unique across `menus` and must contain nothing
   * that is illegal in an id.
   */
  id: string;
  label: string;
  /**
   * Route PREFIXES that light this trigger up. Matched with startsWith, so
   * '/crowmark' also covers '/crowmark-buyers'.
   */
  activeRoutes: string[];
  columns: NavMenuColumn[];
}

const PRODUCTS: NavMenu = {
  id: 'products',
  label: 'Products',
  activeRoutes: ['/bid', '/buy', '/compare', '/see-it-in-action', '/integrations'],
  columns: [
    {
      label: 'Bid and tender software',
      items: [
        {
          label: PRODUCT_NAME_BID,
          href: '/bid/',
          description: 'Find contracts and answer them from your own documents',
          accent: 'mark',
          icon: 'pen',
        },
        {
          label: PRODUCT_NAME_BUY,
          href: '/buy/',
          description: 'Set out what you need and compare the replies you get',
          accent: 'teal',
          icon: 'checklist',
        },
        {
          label: 'See it in action',
          href: '/see-it-in-action/',
          description: 'Short voiced walkthroughs of both products',
          accent: 'mark',
          icon: 'play',
        },
        {
          label: `Compare ${PRODUCT_NAME_BID}`,
          href: '/compare/',
          description: 'How it stacks up against other bid tools',
          accent: 'teal',
          icon: 'compare',
        },
        {
          label: 'Integrations',
          href: '/integrations/',
          description: 'Connect the tools you already use',
          accent: 'teal',
          icon: 'sliders',
        },
      ],
    },
  ],
};

/**
 * Who it's for (A-510, owner header rework 2026-11-02). Sectors were footer only
 * before, and the owner asked for them in the header. Every row resolves to a
 * real page: the hub and the four sector pages that ship under /sectors/
 * (construction, education, facilities, highways). Public and private work are
 * named here in plain words rather than as a sixth link, because the site has no
 * one page for each and the sector pages and /bid/ already cover both. If a
 * dedicated public or private landing page is built later it joins this column.
 */
const WHO_ITS_FOR: NavMenu = {
  id: 'who-its-for',
  label: "Who it's for",
  activeRoutes: ['/sectors'],
  columns: [
    {
      label: 'Public and private work',
      items: [
        {
          label: 'All sectors',
          href: '/sectors/',
          description: 'Who Velstrian is for, public and private buyers',
          accent: 'mark',
          icon: 'globe',
        },
        {
          label: 'Construction',
          href: '/sectors/construction/',
          description: 'Works tenders, frameworks and social value',
          accent: 'teal',
          icon: 'held',
        },
        {
          label: 'Facilities management',
          href: '/sectors/facilities/',
          description: 'Cleaning, catering and maintenance contracts',
          accent: 'teal',
          icon: 'checklist',
        },
        {
          label: 'Technology and IT',
          href: '/sectors/technology-it/',
          description: 'Security and data-protection answers that hold up',
          accent: 'teal',
          icon: 'sliders',
        },
        {
          label: 'Professional services',
          href: '/sectors/professional-services/',
          description: 'Consultancy bids built from your method and team',
          accent: 'teal',
          icon: 'pen',
        },
      ],
    },
    {
      label: 'More sectors',
      items: [
        {
          label: 'Healthcare',
          href: '/sectors/healthcare/',
          description: 'NHS and care tenders, quality and safeguarding',
          accent: 'teal',
          icon: 'shield',
        },
        {
          label: 'Education',
          href: '/sectors/education/',
          description: 'Schools, colleges and university bids',
          accent: 'teal',
          icon: 'book',
        },
        {
          label: 'Transport and highways',
          href: '/sectors/highways/',
          description: 'Road, rail and infrastructure work',
          accent: 'teal',
          icon: 'right',
        },
        {
          label: 'Charities',
          href: '/sectors/charities/',
          description: 'Contracts and grant funded work for the VCSE',
          accent: 'teal',
          icon: 'done',
        },
      ],
    },
  ],
};

/**
 * Resources. The rows are in the order the owner listed them on 2026-08-04, and
 * that order is left exactly as given rather than resequenced into what reads
 * like a more natural flow (calculator, then its methodology, then the hub).
 *
 * ONLY TOOLS THAT STILL SHIP ARE LISTED. Four were withdrawn on 2026-07-28
 * (Cyber Essentials Readiness, Late Payment Calculator, CSRD Applicability
 * Checker, VSME Materiality Light), and /tools carries three cards, not six. A
 * nav is the last place a retired tool should be advertised from.
 *
 * THE TENDER COMPLIANCE MATRIX WAS ADDED 2026-08-04, DIRECTLY UNDER THE
 * CALCULATOR RATHER THAN AT THE END. The owner's order is preserved above and
 * the note above says so; this is not a resequencing of it. The two free TOOLS
 * now sit together and the hub, the methodology and the glossary follow, which
 * is the same grouping the owner's own list already had, with a second member
 * in its first group.
 *
 * It sits INSIDE the retained tender and procurement field, per the standing
 * rule in crowagent-website/CLAUDE.md (O-30). The trade mark filing carries an
 * explicit exclusion covering risk, so nothing here may read as a risk checker,
 * a readiness check or an audit, and no conceded field returns without a
 * written sign-off.
 */
const RESOURCES: NavMenu = {
  id: 'resources',
  label: 'Resources',
  activeRoutes: ['/tools', '/glossary', '/resources', '/help', '/blog', '/faq'],
  columns: [
    {
      label: 'Learn',
      items: [
        {
          label: 'Help centre',
          href: '/help/',
          description: 'Step by step guides for every task',
          accent: 'mark',
          icon: 'book',
        },
        {
          label: 'Blog',
          href: '/blog/',
          description: 'Plain guides to bidding and procurement',
          accent: 'teal',
          icon: 'document',
        },
        {
          label: 'Procurement glossary',
          href: '/glossary/',
          description: 'UK bidding terms in plain English',
          accent: 'teal',
          icon: 'book',
        },
        {
          label: 'PPN 026 explained',
          href: '/glossary/ppn-026/',
          description: 'The Social Value Model, and the dates',
          accent: 'teal',
          icon: 'document',
        },
      ],
    },
    {
      label: 'Free tools',
      items: [
        {
          label: 'Tender Finder',
          href: '/tools/tender-finder/',
          description: 'Search open UK and EU tenders, free',
          accent: 'mark',
          icon: 'search',
        },
        {
          label: 'Tender Compliance Matrix',
          href: '/tools/tender-compliance-matrix/',
          description: 'Read back the requirements a tender states',
          accent: 'teal',
          icon: 'table',
        },
        {
          label: 'All free tools',
          href: '/tools/',
          description: 'No account, no email gate',
          accent: 'teal',
          icon: 'right',
        },
      ],
    },
    {
      label: 'Support',
      items: [
        {
          label: 'FAQ',
          href: '/faq/',
          description: 'Quick answers to common questions',
          accent: 'mark',
          icon: 'chat',
        },
        {
          label: 'Contact us',
          href: '/contact/',
          description: 'Talk to a person, no bots',
          accent: 'teal',
          icon: 'chat',
        },
      ],
    },
  ],
};

/**
 * Company (A-510). About, the trust and security statement (the /security/
 * legal page), partners, the roadmap and contact. Every href resolves: there is
 * no /trust/ page, so "Trust and security" points at /security/, the legal page
 * that states the controls in plain words.
 */
const COMPANY: NavMenu = {
  id: 'company',
  label: 'Company',
  activeRoutes: ['/about', '/security', '/partners', '/roadmap', '/contact'],
  columns: [
    {
      label: 'About Velstrian',
      items: [
        {
          label: 'About us',
          href: '/about/',
          description: 'Who we are and why we built this',
          accent: 'mark',
          icon: 'done',
        },
        {
          label: 'Trust and security',
          href: '/security/',
          description: 'How we keep your data safe, in plain words',
          accent: 'teal',
          icon: 'shield',
        },
        {
          label: 'Partners',
          href: '/partners/',
          description: 'Work with us as a partner or reseller',
          accent: 'teal',
          icon: 'globe',
        },
        {
          label: 'Roadmap',
          href: '/roadmap/',
          description: 'What is live now and what is coming next',
          accent: 'teal',
          icon: 'right',
        },
        {
          label: 'Contact us',
          href: '/contact/',
          description: 'Talk to a person, no bots',
          accent: 'teal',
          icon: 'chat',
        },
      ],
    },
  ],
};

export const NAV = {
  logo: {
    href: '/',
    ariaLabel: `${SITE.name}, home`,
  },

  /** Every dropdown, desktop and mobile, in nav order. */
  menus: [PRODUCTS, WHO_ITS_FOR, RESOURCES, COMPANY] as NavMenu[],

  /** Flat top-level links, rendered after the dropdowns. Pricing stays exactly
   *  as it was (A-510): a single top-level link, not a dropdown. Blog, FAQ and
   *  About moved into the Resources and Company menus, so the header is five
   *  groups (Products, Who it's for, Pricing, Resources, Company) and nothing
   *  sits loose. */
  topLinks: [
    { label: 'Pricing', href: '/pricing/' },
  ] as NavLink[],

  actions: {
    signIn: {
      label: 'Sign in',
      href: `${APP_ORIGIN}/login`,
    } as NavLink,
    /* D236 (2026-10-19): sign up is self serve, so the header CTA goes
       straight to the app's sign up page rather than to a request form. */
    cta: {
      label: START_LABEL,
      href: SIGNUP_URL,
    } as NavLink,
  },
};
