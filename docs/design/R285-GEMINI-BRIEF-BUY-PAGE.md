# Gemini build brief: the Velstrian Buy page (/buy/) on design system v3

Row R285-WEB-ENTERPRISE-REDESIGN-01, strategy 0.7 step (2). Written 2026-10-22 by the platform driver (Claude). Gemini builds, the driver checks every line before anything is committed.

## The job, in one sentence

Rebuild `astro/src/pages/buy.astro` on design system v3 so it reads like the new home page (http://localhost:8093/), told to a busy buyer who has to buy a service and compare the replies fairly, and who is not a procurement specialist.

## Read these first, in this order

1. `docs/design/R285-DESIGN-STRATEGY-2026-10-21.md`: section 0 (0.1 to 0.7), then 0.8 (design system v3). Section 0 overrides sections 2 to 6 where they differ.
2. `astro/src/pages/index.astro` and every component under `astro/src/components/evidenced/`. These are the building blocks. Use them; do not build a parallel set.
3. The current `astro/src/pages/buy.astro`. It is the SOURCE OF FACTS for what Velstrian Buy does. Keep every capability it describes (RULE 0-U: simplicity is never a scope cut). Rewrite how it is said, not what is true.
4. `astro/src/lib/brand-names.ts` for every product and company name. Never type a name by hand.

## The storyline (one idea per band, one primary action per screen)

| # | The buyer wonders | Band |
|---|---|---|
| 1 | What is this, is it for me? | Hero, light band: one plain sentence (public AND private buyers, for example councils, schools, housing associations and private companies buying a service), Start button plus See how it works, one reassurance line, a product view on a Stage beneath |
| 2 | What does it do for me? | Capabilities in everyday words, each beside a product view: write a clear request, collect the replies in one place, read every reply side by side, see what each supplier can back up, record your decision and why |
| 3 | Can I trust it? | The one slow moment: the AI reads and summarises, it never sets a mark. People score. Shown, not explained (reuse the Sequence or Refusal pattern) |
| 4 | How hard is it to start? | Three steps (Steps component) |
| 5 | Is my data safe, what does it cost? | The trust strip as the home page has it, and the Buy starting price taken from the existing pricing source, never typed |
| 6 | Words I do not know | A short FAQ that explains the terms a newcomer meets (tender, evaluation, award) |
| 7 | What now? | Close band (Close component) |

Expert detail (Procurement Act duties, PPN 026, record keeping) goes lower down, explained in a few words the first time it appears.

## Hard rules (each one has failed before)

- **Files you may change:** `astro/src/pages/buy.astro`, and NEW files under `astro/src/components/buy/` only. Do NOT edit anything under `src/components/evidenced/`, `src/components/nav/`, `src/components/ui/`, `src/layouts/`, or `src/styles/`. The driver is editing those right now. If you need something a shared component cannot do, write it down under "Needs from the driver" in your report. Do not work around it.
- **No hardcoded design values.** Every colour, size, radius, shadow and duration comes from a token in `src/styles/tokens.css` (`--ea-*`, `--btn-*`, `--v3-*`, `--stage-*`, `--elev-*`, `--space-*`, `--t-*`). No hex, no rgb(), no px font sizes in your styles.
- **Buttons:** only `evidenced/Action.astro`. Primary is the brand gradient, secondary is white. Do not restyle them.
- **No red, no pink red, no orange anywhere** (D256).
- **Words:** British English. No em dashes or en dashes in user facing text (use a comma or a full stop). Plain words a first time buyer from a 10 person firm understands in one read. Positive wording, no defensive disclaimers (D255), but never claim a certificate we do not hold.
- **Never invent a fact.** No customer names, logos, quotes, testimonials, review scores, user counts, percentages or time savings. If the current page or the brand library does not state it, it does not go in. No "#1", no "trusted by".
- **Imagery:** product views are HTML recreations of the real Buy screens, using `AppWindow`, `Frame` and `Stage`, with a visible "Example data" caption. No stock photos, no AI people.
- **Identity:** never write a personal name or a personal email anywhere. Platform identity is `Velstrian Tenderworks`, `platform@velstrian.com`.
- **Git: do NOT commit, do NOT push, do NOT create branches.** Leave your changes in the working tree. The driver reviews and commits them.
- **This machine is shared with the owner.** Before a build, check free RAM (`Get-CimInstance Win32_OperatingSystem`, FreePhysicalMemory). If it is under 1 GB, or another `astro build` is already running, wait. Never kill a process you did not start.

## How to check your work before you report

1. The dev server is already running on http://localhost:8093 (do not start a second one). Open http://localhost:8093/buy/ and confirm it returns 200 and shows your page, not a 404 page.
2. Look at it at 1440 px and at 390 px wide. No horizontal scroll at 390. Nothing overlaps.
3. From `astro/`, run `node node_modules/astro/bin/astro.mjs build` once (NOT `npm run build`, that is the full gate suite the driver runs). It must finish with no errors.
4. Do not run the full gate suite. The driver runs it.

## Report back (paste this filled in)

- Files changed and created, each with one line on what it is.
- The storyline, band by band, with the headline you wrote for each.
- Every fact you used and the line of the old `buy.astro` (or file) it came from.
- What you simplified, in plain words (RULE 0-U).
- Needs from the driver (shared component or token changes you did not make).
- Build result (last 5 lines of output).
