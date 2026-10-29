/**
 * [R29-SCOPE, owner 2026-10-29: "website also follow same release version as platform"]
 * The current release, for the website board. It is the PLATFORM's: the highest
 * RELEASE-<version>-TRACKER.md in the platform repository, compared by numeric
 * segment so 2.8.10 sorts above 2.8.9. Same rule build-platform-board.js applies
 * in discoverRelease(), so the Website tab and the Platform tab name one release.
 *
 * Throws when no tracker is found. A new item must never be stamped with a
 * guessed release, because a wrong stamp files it under the wrong tab view.
 */
'use strict';

const fs = require('node:fs');
const { siblingRepo } = require('../scripts/lib/sibling-repo.cjs');

const cmpVersion = (a, b) => {
  const A = a.split('.').map(Number);
  const B = b.split('.').map(Number);
  for (let i = 0; i < Math.max(A.length, B.length); i++) {
    const d = (A[i] || 0) - (B[i] || 0);
    if (d) return d;
  }
  return 0;
};

/** @returns {string} the current release as the board writes it, for example "R2.9" */
function currentRelease(platformDir = siblingRepo('platform')) {
  const versions = fs
    .readdirSync(platformDir)
    .map((f) => /^RELEASE-([\d.]+)-TRACKER\.md$/.exec(f))
    .filter(Boolean)
    .map((m) => m[1])
    .sort((a, b) => cmpVersion(b, a));
  if (!versions.length) throw new Error(`no RELEASE-*-TRACKER.md found in ${platformDir}`);
  return `R${versions[0]}`;
}

module.exports = { currentRelease, cmpVersion };
