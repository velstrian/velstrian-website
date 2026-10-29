/**
 * [R29-LOCAL-RENAME] The ONE place in this repository that knows what the sibling repositories are
 * called on disk.
 *
 * The local folders move from `crowagent-*` to `velstrian-*` (owner decision D301, run by
 * `scripts/rename-to-velstrian.ps1` at the workspace root with every session closed). Until every
 * checkout has moved, a script that reads `../<sibling>` must find either name. The new name is
 * tried first, the old one second, and when neither exists the new name is returned so the
 * caller's own "not found" message points at where the folder should be.
 *
 * CommonJS on purpose, so the CommonJS status scripts can `require` it and the ESM astro scripts
 * can `import` it. The platform keeps the same rule in `scripts/lib/sibling-repo.mjs`.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

/** Folder names each sibling may have, the new name first. */
const SIBLING_NAMES = Object.freeze({
  platform: Object.freeze(['velstrian-platform', 'crowagent-platform']),
  website: Object.freeze(['velstrian-website', 'crowagent-website']),
  branding: Object.freeze(['velstrian-branding', 'crowagent-branding']),
});

/** This repository's root, wherever it is checked out. */
const WEBSITE_ROOT = path.resolve(__dirname, '..', '..');

/**
 * The absolute path of sibling `key` beside `repoRoot`: the first candidate name that exists,
 * otherwise the new name.
 *
 * @param {'platform' | 'website' | 'branding'} key
 * @param {string} [repoRoot] the repository the sibling sits beside, this one by default
 * @returns {string}
 */
function siblingRepo(key, repoRoot = WEBSITE_ROOT) {
  const names = SIBLING_NAMES[key];
  if (!names) throw new Error(`siblingRepo: unknown sibling "${key}", expected one of ${Object.keys(SIBLING_NAMES).join(', ')}`);
  const parent = path.dirname(path.resolve(repoRoot));
  for (const name of names) {
    const at = path.join(parent, name);
    if (fs.existsSync(at)) return at;
  }
  return path.join(parent, names[0]);
}

module.exports = { SIBLING_NAMES, WEBSITE_ROOT, siblingRepo };
