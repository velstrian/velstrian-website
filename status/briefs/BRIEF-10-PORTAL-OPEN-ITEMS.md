# Gemini brief 10: finish the open portal work items

Driver: Claude (reviews your work). Executor: Gemini. Date 2026-10-31. Release R2.9.

Owner instruction 2026-10-31: every portal work item is yours, EXCEPT the portal database move
`R29-PORTAL-OWN-SUPABASE-01`, which stays with Kiro (team member) and is coordinated in
http://192.168.1.63:8099/channels/kiro-portal-db.md. Do not touch that work or project
`upxwdxhqzdsjnpsftsfb`.

Read each row in `velstrian-platform/RELEASE-2.9-TRACKER.md` before you start it.

## Where you work

- Platform worktree `C:\w\vp`, branch `review/r29-batch2`. Do not switch branches. Other lanes
  commit there too, so commit ONLY your own paths with `git commit -- <paths>`.
- Production code is `git show origin/main:<path>`. Batch 2 (today's portal fixes) is on
  `review/r29-batch2` only and is NOT deployed yet.
- Portal code: `apps/portal`. Portal AI eval harness: `api/tests/ai_golden/portal_deep_live.py`,
  `api/tests/ai_golden/deep_test_cases/portal_cases.json`, `api/tests/golden/`.

## Your items, in order

1. **R29-PORTAL-AI-LIVE-DEFECTS-01, what is left** (fixes already in `90d0bda7d`):
   - `portal_agents_tests_run_repro` passes 2 of 20: the model's NPV and IRR drift between two runs.
     The product compares figures that should be arithmetic. Compute `npv`, `payback_years`, `irr`
     and `roi` in code from the inputs (a small pure function with unit tests against known worked
     examples), and let the model only explain them. Then the repro compares computed values.
   - Case or scorer defects, fix them fairly and say why in the commit (never tune a case to a
     result you have seen): HLT-03 pins a score of 48 and reads "30" from the field name
     `loginsLast30d`; BRD-01 and AGN-01 flag heading and list numbers as invented figures.
   - Evidence: `docs/release-2.9/portal-live-2026-10-31/` and `docs/release-2.9/d507/portal-agents-tests/`.
2. **R29-PORTAL-PROD-FEATURES-FAILING-01** (P0 parent): its five children are built in batch 2
   (`78f0e80bc`, `fcdfff1d2`, `c484907bd`, `3a2ed732b`) except the env row. Write the close
   criteria into the row as a checklist that can only be ticked on staging after the batch 2 promote:
   Integrations page shows the current key fingerprint and every stored credential reads
   `current_key` or `legacy_readable`; the Stripe console opens in the right mode; rollback works
   with a project key; pricing redeploy targets `velstrian-platform-web`.
3. **R29-PORTAL-PROD-MISSING-CONFIG-ENV-VARS-01**: only `VERCEL_TOKEN` on the portal STAGING
   environment is missing. That is an owner action; write the exact click path into the row.
4. **Batch 2 portal staging walk (prepare now, run after the owner promotes batch 2 to staging)**:
   write a Playwright walk under `web/e2e/r285-staging-walk/` (Playwright resolves only from
   `velstrian-platform/web`) for `staging-portal.velstrian.com` covering item 2's checklist plus the
   passkey sign in Turnstile check (`5a36f84d5`) and the founders activity feed. The staging portal
   sits behind Cloudflare Access and Vercel SSO: see the memory notes on the two auth gates and the
   service token in `velstrian-platform/.env.cf-access` (load inside a script, never print).

## Hard limits

- **No push, no deploy, no promote, no production write**, no Vercel, Railway or Supabase setting
  change, no Stripe write. Paid AI calls only on STAGING and only with a cap the owner approved:
  the portal live run approval is GBP 3 with GBP 1.85 spent, so at most GBP 1.15 more, worst case
  stated before each run, spend read from the staging `ai_calls` ledger.
- **Secrets.** Never print, paste or commit a key, token or env value.
- **RULE 0-V.** Name what you measured and how it could have failed. A grep is a hint, confirm at
  the call site.
- **RULE 0-T.** Targeted tests only, one invocation per package, red prove every fix on HEAD.
- **RULE 0-L.** Keep free RAM above 1.5 GB before any test or browser run. One browser at a time.
  Never kill a process you did not start.
- Identity `Velstrian Tenderworks <platform@velstrian.com>`. Commit messages
  `fix(portal-ai): <ROW-ID> <what>` or `test(e2e): <ROW-ID> <what>`. No em dash, en dash or
  semicolon in prose. Never "council" as a product name. PPN 026 only.

## Report

Write `gemini-briefs/BRIEF-10-REPORT.md`: per item, the sha, files with lines, tests with collected
and passed counts, red proofs, spend from the ledger, and anything left with the exact next action.
Update each row you touched in `velstrian-platform/RELEASE-2.9-TRACKER.md` (main checkout, commit by
pathspec) and rebuild the board: `node status/build-platform-board.js` from `velstrian-website`, then
`node scripts/assign-phases.mjs ../velstrian-website/status/platform.json` from `velstrian-platform`,
then the board again.
