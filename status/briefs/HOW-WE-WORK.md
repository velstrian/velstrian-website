# How we work: work items, briefs, reporting and releases

For every AI (Claude, Gemini, Kiro, Claude in Chrome) and every team member. Updated 2026-10-30.
Board: http://192.168.1.63:8099/ (office network) or http://localhost:8099/ on the main machine.

## 1. The roles

- **Owner** decides scope, approves every push, every production change and every spend.
- **Driver (Claude)** plans the work, writes the briefs, reviews every result, fixes what review finds,
  keeps the board true, runs promotes.
- **Executors (Gemini, a team member with Kiro, Claude in Chrome)** do the work in a brief, nothing
  outside it, and report back.

## 2. Where everything lives

- **Work items:** the Platform tab of the board (http://192.168.1.63:8099/#platform). Each item has an
  id like `R29-PORTAL-OWN-SUPABASE-01`, a severity, a phase and a status.
- **Briefs (the instructions and prompts):** http://192.168.1.63:8099/briefs/ . Each brief names its
  work items, its executor and how to report. Open the web page version and give its link to your agent.
- **Updates from people on other machines:** the GitHub issue the brief names, in the private repo
  `velstrian/velstrian-platform`. The driver reads it and moves the board.
- **Rules:** the AI onboarding guide on the board (http://192.168.1.63:8099/#architecture/aionboarding)
  and `ENGINEERING-STANDARDS.md` in the platform repo. They bind every AI and every person.

## 3. Status words (the first word of a work item's status)

- **OPEN**: still to do. **WIP**: being worked. **ON HOLD**: parked by the owner.
- **BUILT**: done and tested, but not live yet (waiting on a promote or a push).
- **FIXED**: live, and confirmed on the live system (by the owner or by measurement).
- A work item is never FIXED while its change sits only on a branch.

## 4. The life of a work item

1. The driver measures the item (is it still true, what exactly is left) and writes a brief.
2. The brief goes on the briefs page and the work item links to it.
3. The executor works on a branch named `review/r29-<topic>` from `main`, commits only the files it
   changed (`git commit -- <paths>`), and runs only the tests that cover its change.
4. The executor reports: on the GitHub issue (team members), or in chat to the owner (Gemini, Claude
   in Chrome), who pastes the result to the driver.
5. The driver reviews. A defect found in review is fixed on the same branch before anything goes live.
6. The item becomes BUILT. When it is live and confirmed, FIXED.

## 5. Hard rules every executor follows

- **No push, deploy, migration or dashboard change unless the brief says the owner approved that exact
  act.** One approval is one push. A `review/*` branch push costs nothing (no GitHub Actions run,
  Vercel cancels the build) but still needs approval. A push to website `main` is a live website deploy.
- **Never print, paste or commit a secret.** Read keys by name only.
- **Targeted tests only** while working. Show what was collected and what passed.
- **Never weaken a test to make it pass**, no empty `catch`, no `@ts-ignore`, no hardcoded ids.
- **Design values come from the central tokens**, never a hardcoded colour, size or font.
- **Plain words** in anything a customer reads (small businesses, public and private work). No em
  dash, en dash or semicolon in user facing text.
- **Identity** on every commit: `Velstrian Tenderworks <platform@velstrian.com>`. Never a personal name.
- **Shared machine:** keep free memory above 1 GB, one heavy build or test run at a time, never stop a
  process you did not start.
- **Switch the repository back to `main` when you finish.** The board is served from the checked out
  files, so a repo left on a branch shows an old board.

## 6. Releases (how work goes live)

1. The driver merges the BUILT branches into one batch branch and runs the targeted tests on it.
2. **Staging:** `pnpm staging:promote` builds on the main machine and uploads to
   https://staging-app.velstrian.com (free). The API reaches staging only by a push the owner approves.
3. The owner and the driver check staging.
4. **Production:** `pnpm prod:promote`, only with the owner's approval naming the commit (sha), a
   verified staging record and a clean billing audit.
5. **Website:** the owner checks the site locally first, then approves the push to website `main`.
6. After live: the driver checks production and moves the items to FIXED.

## 7. Where the database work goes

- Platform database: production `gujtuecjzfiqsdnzgyvo`, staging `ipgrnwvfnumgvnxkpxsc`.
- Portal database (owner decision 2026-10-30): its own project `upxwdxhqzdsjnpsftsfb`, one database for
  portal staging and production. See brief 08.
- Database changes are applied with the Supabase tool's `execute_sql` and recorded as a migration file,
  never `db push` and never the Supabase command line tool.

## 8. Database access for AI tools (Supabase connections)

Every AI tool reaches Supabase the same way: Supabase's hosted connection at
`https://mcp.supabase.com/mcp`, signed in through the browser. No key is stored in a file.

| Connection name | Address | Organisation to choose when signing in |
|---|---|---|
| `supabase` | `https://mcp.supabase.com/mcp` | Velstrian Systems Ltd (platform production and staging) |
| `supabase-portal` | `https://mcp.supabase.com/mcp?project_ref=upxwdxhqzdsjnpsftsfb` | the portal organisation (portal project only) |

- **Claude Code:** both are in the workspace `.mcp.json`. Run `/mcp`, pick the connection, choose
  Authenticate, and in the browser pick the organisation in the table.
- **Gemini (Gemini CLI settings):** `~/.gemini/settings.json`, key `mcpServers`, each entry
  `{"httpUrl": "<address>"}`.
- **Kiro:** `~/.kiro/settings/mcp.json`, key `mcpServers`, each entry `{"url": "<address>"}`.
- **A team member's own machine:** add the same two entries to your tool's file, then sign in with
  your own Supabase account. You need to be a member of the organisation.
- One sign in reaches one organisation, so each organisation needs its own connection name. Add
  `&read_only=true` to the address when the tool only needs to read.
