/**
 * palette-actions.ts: the command palette's action rows (A-267).
 *
 * MOVED HERE FROM scripts/command-palette.ts ON 2026-10-22
 * (R285-WEB-HERO-BACKDROP-02, D293). They are data, the same on every page,
 * and they shipped inside the script chunk EVERY route downloads, about 0.6 KB
 * of strings a reader pays for before pressing anything. They now ship in
 * /search-index.json (pages/search-index.json.ts puts them first), the one
 * cacheable file the palette already fetches the first time it opens. Nothing
 * the reader sees changes: the palette showed nothing until that file had
 * loaded anyway, and it tells an action from a route by `kind`, as before.
 */
import { SIGNUP_URL, START_LABEL, WALKTHROUGH_URL } from './app';

export interface PaletteAction {
  title: string;
  href: string;
  section: string;
  hint?: string;
  kind: 'action';
  /** Opens in a new tab. True for the one target that is not on this origin. */
  external?: boolean;
}

/* ============================================================================
   THE ACTION LAYER (A-267, owner decision 2026-09-08, option B).
   ============================================================================

   The palette shipped as a route jumper: the index is derived from the nav,
   the footer and the content collections, so every row is a page. An action is
   a different thing. It carries INTENT into the page it lands on, so the
   reader arrives with the enquiry type already chosen and the message started
   rather than on a form they still have to configure.

   EVERY ROW HERE RESOLVES TODAY, AND EACH ONE WAS CHECKED AGAINST THE FILE
   THAT READS IT, not against a memory of it.

     - `limited-access`, `ppn002-bid`, `buyer-side` and `enterprise` are the
       literal `value` strings in ENQUIRY_OPTIONS in
       components/forms/ContactForm.astro:95-102. That matters because the
       reader in the same file only applies `?enquiry=` when the value matches
       an existing <option> (`setType` returns false otherwise), so a typo here
       would land on /contact with the select untouched and nothing to see.
     - `#contact-form` is the id on the section wrapping the form,
       pages/contact.astro:267.
     - The Calendly URL is the same constant the contact page's own "Book a
       30-minute call" button uses, pages/contact.astro:37, and that page opens
       it in a new tab, which is why `external` exists below.

   TWO ACTIONS THE EXTERNAL REVIEW ASKED FOR ARE DELIBERATELY ABSENT. There is
   no PPN 026 scoring template to export and no enterprise technical
   walkthrough to book: neither exists anywhere in this repo or on the site.
   Listing either would put a row in a palette that goes nowhere, which is the
   defect class this codebase has now fixed several times over, so they are
   raised as their own work rather than stubbed here.

   THE FREE TOOL IS NOT DUPLICATED HERE EITHER. /tools/tender-compliance-matrix/
   is already an index row titled "Tender Compliance Matrix" (verified in the
   built dist/search-index.json), so an action pointing at the same URL would
   be a second row for one destination.

   RUNNING THAT TOOL ON A SAMPLE IS NOW POSSIBLE AND IS STILL NOT LISTED, AND
   THE REASON CHANGED ON 2026-09-08. The original blocker is GONE: the tool
   reads `?sample=` and presses the matching pill on load (A-271), verified in a
   browser against three sample values plus an unknown one, so an action here
   would land on a built matrix rather than on an empty textarea.

   WHAT STOPS IT NOW IS THE PAYLOAD BUDGET, MEASURED RATHER THAN ASSUMED. This
   module ships in the chunk EVERY route downloads. That chunk measures 12,160 B
   against a 12,288 B budget, so there are 128 bytes of headroom. The action
   costs 219 bytes with a search hint, and about 125 bytes with the hint
   stripped, which would leave three bytes and make the action unfindable by the
   words a reader would actually type ("free tool", "demo", "example").

   SO IT IS AN OWNER DECISION AND NOT AN ENGINEERING ONE, filed as A-283. Adding
   it means raising a ceiling on the bytes every reader downloads, and RULE 0-G
   reserves that to the owner. Shaving the hint to three bytes of headroom would
   pass the gate while making the feature worse, which is the same defect this
   file's own budget notes refuse elsewhere in their own words. The parameter is
   built and waiting, so the action is one object whenever the answer is yes.
   ============================================================================ */
export const PALETTE_ACTIONS: PaletteAction[] = [
  {
    /* D236 (2026-10-19): sign up is self serve, so the action goes to the
       app's sign up page. "request access" stays in the hint so a reader who
       types the old words still finds it. */
    title: START_LABEL,
    href: SIGNUP_URL,
    section: 'Action',
    hint: 'request access trial sign up get started demo account onboarding',
    kind: 'action',
  },
  {
    title: 'Book a 30-minute call',
    href: WALKTHROUGH_URL,
    section: 'Action',
    hint: 'demo meeting walkthrough talk to sales schedule calendar',
    kind: 'action',
    external: true,
  },
  {
    title: 'Ask about Velstrian Bid',
    href: '/contact/?enquiry=ppn002-bid#contact-form',
    section: 'Action',
    hint: 'bid tender questionnaire social value supplier enquiry',
    kind: 'action',
  },
  {
    title: 'Ask about Velstrian Buy',
    href: '/contact/?enquiry=buyer-side#contact-form',
    section: 'Action',
    hint: 'buyer evaluation procurement authority enquiry',
    kind: 'action',
  },
  {
    title: 'Ask about Portfolio or volume pricing',
    href: '/contact/?enquiry=enterprise#contact-form',
    section: 'Action',
    hint: 'enterprise quote seats licence cost budget',
    kind: 'action',
  },
  /*
   * LAST IN THE ARRAY ON PURPOSE. `RESTING_ACTIONS` shows the first three
   * before any typing, so appending here adds a searchable action without
   * changing what the palette looks like at rest. Whether it deserves a
   * resting slot is a separate decision and not one to take by accident.
   *
   * `facilities` because it is the first pill on the page and returns a full
   * matrix, so the action lands on a result rather than on the emptiest of the
   * three samples.
   */
];
