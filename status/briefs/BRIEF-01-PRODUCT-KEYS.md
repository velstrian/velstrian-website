# Gemini brief 01: legacy product keys and dead product_context keys

Driver: Claude (reviews your work). Executor: Gemini. Date 2026-10-30. Release R2.9.

Rows: **R29-REG-LEGACY-PRODUCT-KEYS-REMOVE-01** and **R29-ARCH-DEAD-PRODUCT-CONTEXT-KEYS-01**
in `velstrian-platform/RELEASE-2.9-TRACKER.md`.

## Read first

1. `velstrian-platform/ENGINEERING-STANDARDS.md` (binding) and `velstrian-platform/CLAUDE.md` rules
   0-G, 0-T, 0-L, 0-V, 0-C, IDENTITY. `GEMINI.md` is partly stale (old domains, identity). Where it
   conflicts with this brief, **this brief wins for this task only**.
2. This brief replaces the "walker only, no code" role in `GEMINI.md`: **for this task the owner
   authorises code changes and LOCAL commits on a `review/*` branch.**

## Hard limits

- **No push, no deploy, no migration applied to any database, no Supabase/Stripe/Vercel/Railway
  write.** Write migration files only. The driver applies nothing until the owner approves.
- **No paid AI call, no email.** Never open or print `.env*`, keys or tokens.
- Git identity is already `Velstrian Tenderworks <platform@velstrian.com>`. Never use any personal
  name or Gmail. Commit by pathspec: `git commit -- <paths>`, never `git add .`.
- **Targeted tests only (RULE 0-T).** Never run the full suite. Free RAM must stay above 1 GB. One
  heavyweight (pytest batch, `tsc`, `next build`) at a time. Do not kill any process you did not start.
- API tests: `./.venv/Scripts/python.exe -m pytest <files>` from `api/`. Web: `pnpm vitest run <files>` from `web/`.
- Do not delete strings that guard the dead products (`crowcyber`, `crowcash`, `crowesg`,
  `crowagent_core`, `core` in `DISABLED_PRODUCTS`, and tests that assert their ABSENCE). Those are guards.

## Measured by the driver on 2026-10-30 (read only)

- Production (`gujtuecjzfiqsdnzgyvo`) `organisations.product_context` keys: `bid`, `buy` and ten dead
  keys on ONE org: `advisor, agency, analytics, carbon, contracts, marketplace, monitoring,
  regulatory_monitor, reports, workflows`.
- Staging (`ipgrnwvfnumgvnxkpxsc`): `bid` 48 orgs, `buy` 24, plus `crowagent_core, crowcash,
  crowcyber, crowesg` on one org.
- Production `regulation_monitor.products` and `product_subscriptions.product_key`: **zero** rows
  holding `crowmark` or `council`. No web code sends `X-Product: crowmark|council`.

## Task A, R29-REG-LEGACY-PRODUCT-KEYS-REMOVE-01

The one release window for `LEGACY_PRODUCT_KEYS` (`api/app/products/registry.py:105-116`) has passed.

1. Re-confirm in code (strip comments before trusting a grep) that no web, portal or worker caller
   sends or stores `crowmark`/`council` as a product key. Include `apps/portal/src`, `web/src`,
   `worker/` if present, and Supabase functions.
2. Remove `LEGACY_PRODUCT_KEYS` and `canonical_product_key`. Update every caller:
   `api/app/middleware/auth.py:14,599`, `api/app/services/regulatory_monitor.py:29,146-264`
   (use the key as stored, still intersect with `LIVE_PRODUCTS`). Fix the docstrings that describe
   the mapping.
3. Update `api/tests/test_r285_rebrand_legacy_api_paths.py` so it asserts the NEW behaviour
   (`crowmark` is no longer mapped, it is an unknown key). Do not just delete the test. Note:
   `api/app/middleware/legacy_prefix.py` rewrites old URL PATHS, which is a different thing. Leave it
   unless you prove it reads the removed map.

## Task B, R29-ARCH-DEAD-PRODUCT-CONTEXT-KEYS-01

1. Trace whether ANY of the ten dead keys (list above) can grant access or affect billing: read
   `api/app/services/entitlements.py`, `bid_access.py`, `bid_tier.py`, `buyer_tier.py`,
   `billing_grace.py`, `ai/credits.py`, `tasks/billing_cron.py`, `regulatory_monitor.py`
   (note `regulatory_monitor` and `monitoring` are key names here), `web/src` entitlement and
   seat code, and the portal `apps/portal/src/app/api/customers/**` routes. Report each key: read
   anywhere (path:line) or not.
2. Write ONE migration file `supabase/migrations/<next timestamp>_r29_drop_dead_product_context_keys.sql`
   that removes exactly those ten keys plus `crowagent_core, crowcash, crowcyber, crowesg` from
   `organisations.product_context` (`product_context - '<key>'`), idempotent, ASCII only, with a
   header comment naming both rows. Do not touch `bid` or `buy`. Do NOT apply it.
3. If any code path writes those keys (seeding, portal onboarding, provisioning), stop it writing
   them in the same change, so the migration and the code ship together.
4. Add a guard test (API pytest) that fails if the write path can emit a key outside the live set,
   and red-prove it once (show it failing before your code change, passing after).

## Verify

- Targeted pytest over every API test file that imports `registry`, `regulatory_monitor` or
  `middleware.auth`, plus your new test, in ONE invocation. Report the collected count.
- If you touched TypeScript: `pnpm tsc --noEmit` in that project and the targeted vitest files.
- `ruff`/lint on changed Python files if configured in `api/`.

## Commit and board

- Branch `review/r29-product-keys` from `main`. Commits:
  `fix(registry): R29-REG-LEGACY-PRODUCT-KEYS-REMOVE-01 remove the one release legacy product key map`
  `fix(data): R29-ARCH-DEAD-PRODUCT-CONTEXT-KEYS-01 stop writing and drop dead product_context keys`
  End each message with `Co-Authored-By: Gemini <noreply@google.com>` only if your tooling adds a
  trailer, never a personal identity.
- Set both rows to `BUILT 2026-10-30 - <sha7> on review/r29-product-keys, migration NOT applied, waits
  on owner approval for staging then production apply. Tests: <files, collected N, passed N>.` Keep
  the old text after `Was:`. Rebuild the board (guide section 7.3).

## Report back (short)

Files changed with line numbers, the per-key trace table, the test command with collected and
passed counts, the red-proof output, the two sha7s, and anything you could not do and why.
