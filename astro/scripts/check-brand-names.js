#!/usr/bin/env node
/**
 * check-brand-names.js — single source of truth and brand names guard.
 * [R285-REBRAND-08 · A-294]
 *
 * Verifies:
 * 1. astro/src/lib/brand-names.ts matches crowagent-platform/packages/tokens/src/brand-names.ts
 * 2. No old brand names (CrowMark, CrowAgent, Crow Agent, old company name) appear in built HTML.
 *    (External infrastructure hosts during transition are allowed:
 *    calendly.com/crowagent-platform, crowagent-platform-production.up.railway.app.
 *    app.crowagent.ai left this list on 2026-10-25, A-294, when APP_ORIGIN moved to
 *    app.velstrian.com, so a page that names the old app host fails the build).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const WEBSITE_LIB = path.join(ROOT, 'src', 'lib', 'brand-names.ts');
const PLATFORM_TOKENS = path.resolve(ROOT, '..', '..', 'crowagent-platform', 'packages', 'tokens', 'src', 'brand-names.ts');

let errors = [];

// 1. Check brand-names.ts source agreement with platform tokens if platform repo is present
if (fs.existsSync(PLATFORM_TOKENS) && fs.existsSync(WEBSITE_LIB)) {
  const websiteContent = fs.readFileSync(WEBSITE_LIB, 'utf8');
  const platformContent = fs.readFileSync(PLATFORM_TOKENS, 'utf8');

  const extractConstants = (src) => {
    const map = {};
    const re = /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*(?:`([^`]*)`|"([^"]*)"|'([^']*)')/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      map[m[1]] = m[2] ?? m[3] ?? m[4];
    }
    return map;
  };

  const webConsts = extractConstants(websiteContent);
  const platConsts = extractConstants(platformContent);

  const keysToCheck = [
    'PLATFORM_NAME',
    'PLATFORM_SHORT_NAME',
    'PRODUCT_NAME_BID',
    'PRODUCT_NAME_BUY',
    'LEGAL_ENTITY_NAME',
    'COMPANY_NUMBER',
    'ICO_NUMBER',
    'REGISTERED_OFFICE',
  ];

  for (const k of keysToCheck) {
    if (webConsts[k] !== platConsts[k]) {
      errors.push(`brand-names drift: ${k} in website is "${webConsts[k]}", platform tokens has "${platConsts[k]}"`);
    }
  }
}

// 2. Check built HTML in dist/ for forbidden old brand names
function getHtmlFiles(dir) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) res = res.concat(getHtmlFiles(full));
    else if (ent.name.endsWith('.html')) res.push(full);
  }
  return res;
}

const KEPT_HOSTS = [
  'portal.crowagent.ai',
  'calendly.com/crowagent-platform',
  'crowagent-platform-production.up.railway.app',
];

const ROOT_TEXT_FILES = [
  'robots.txt',
  'llms.txt',
  'llms-full.txt',
  '.well-known/security.txt',
];

function checkContent(rel, rawContent) {
  let content = rawContent;

  // Mask allowed transitional external app/infrastructure hosts
  for (const h of KEPT_HOSTS) {
    content = content.split(h).join('__KEPT_HOST__');
  }

  // Check for CrowMark
  const crowmarkMatches = content.match(/\bCrowMark\b/g);
  if (crowmarkMatches) {
    errors.push(`[old-product-name] ${rel}: found ${crowmarkMatches.length} occurrence(s) of "CrowMark"`);
  }

  // Check for CrowAgent / Crow Agent
  const crowagentMatches = content.match(/\bCrow\s?Agent\b/g);
  if (crowagentMatches) {
    errors.push(`[old-brand-name] ${rel}: found ${crowagentMatches.length} occurrence(s) of "CrowAgent"`);
  }

  // Check for old email addresses @crowagent.ai
  const emailMatches = content.match(/[a-z0-9._%+-]+@crowagent\.ai\b/gi);
  if (emailMatches) {
    errors.push(`[old-email] ${rel}: found old email "${emailMatches.join(', ')}"`);
  }

  // Check for self references to crowagent.ai (any unmasked crowagent.ai)
  const selfRefMatches = content.match(/(?:https?:\/\/)?(?:www\.)?crowagent\.ai[^\s"'<>)]*/gi);
  if (selfRefMatches) {
    errors.push(`[self-reference] ${rel}: found self-reference "${selfRefMatches.join(', ')}" to crowagent.ai`);
  }

  // Check for old company name
  const legalMatches = content.match(/(?:CROWAGENT\s+LTD|Crow[Aa]gent\s+(?:Ltd|Limited)|VELSTRIAN\s+SYSTEMS\s+LIMITED)\b/g);
  if (legalMatches) {
    errors.push(`[wrong-legal-name] ${rel}: found "${legalMatches.join(', ')}" (must be "Velstrian Systems Ltd")`);
  }
}

if (fs.existsSync(DIST)) {
  const htmlFiles = getHtmlFiles(DIST);
  for (const file of htmlFiles) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    checkContent(rel, content);
  }

  for (const textFile of ROOT_TEXT_FILES) {
    const fullPath = path.join(DIST, textFile);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      checkContent(textFile, content);
    }
  }
}

if (errors.length > 0) {
  console.error(`FAIL — check-brand-names: ${errors.length} violation(s) found:\n`);
  for (const err of errors.slice(0, 30)) {
    console.error(`  - ${err}`);
  }
  if (errors.length > 30) {
    console.error(`  ... and ${errors.length - 30} more`);
  }
  process.exit(1);
} else {
  console.log('PASS — check-brand-names: brand names match tokens and 0 old brand occurrences found in built HTML.');
  process.exit(0);
}
