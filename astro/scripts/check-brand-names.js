#!/usr/bin/env node
/**
 * check-brand-names.js — single source of truth and brand names guard.
 * [R285-REBRAND-08 · A-294]
 *
 * Verifies:
 * 1. astro/src/lib/brand-names.ts matches crowagent-platform/packages/tokens/src/brand-names.ts
 * 2. No old brand names (CrowMark, CrowAgent, Crow Agent, old company name) appear in built HTML.
 *    (External infrastructure hosts during transition are allowed:
 *    crowagent-platform-production.up.railway.app. The old Calendly slug left this
 *    list on 2026-10-26, A-472, when the owner gave the velstrian-systems-ltd account,
 *    and a page that still names it now fails the build.
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

const KEPT_HOSTS = [];

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

  // A-472: the old Calendly account. CALENDLY_URL in src/data/app.ts is the one source.
  if (/calendly\.com\/crowagent-platform/i.test(rawContent)) {
    errors.push(`[old-calendly] ${rel}: links to calendly.com/crowagent-platform, read CALENDLY_URL from src/data/app.ts`);
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

// 3. A-475 (owner 2026-10-26): every company social profile URL is written once, in
//    SOCIAL_URLS in src/lib/brand-names.ts. A profile URL typed anywhere else under src/
//    is a second copy that can drift. Comments are blanked first, so a note that names a
//    URL is not a hit. Share intents (linkedin.com/feed, twitter.com/intent) are not
//    profiles and are not matched.
export const SOCIAL_PROFILE = /(?:linkedin\.com\/company\/|x\.com\/Velstrian|youtube\.com\/@VELSTRIAN|instagram\.com\/velstrian|medium\.com\/@velstrian)/i;
const SOCIAL_SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.astro', '.md', '.mdx', '.json']);
const SOCIAL_HOME = path.join('src', 'lib', 'brand-names.ts');

export function blankComments(text, ext) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  if (ext === '.json') return text;
  if (ext === '.md' || ext === '.mdx') return text.replace(/<!--[\s\S]*?-->/g, blank);
  return text
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:\w])\/\/[^\n]*/g, (m, p1) => p1 + blank(m.slice(p1.length)))
    .replace(/<!--[\s\S]*?-->/g, blank);
}

/** Lines of one source file's code that type a social profile URL. */
export function socialProfileLiterals(rel, text) {
  if (rel === SOCIAL_HOME) return [];
  return blankComments(text, path.extname(rel))
    .split('\n')
    .map((line, i) => ({ line: line.trim(), n: i + 1 }))
    .filter(({ line }) => SOCIAL_PROFILE.test(line))
    .map(({ line, n }) => `${rel}:${n}: ${line.slice(0, 120)}`);
}

function walkSource(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkSource(full, out);
    else if (SOCIAL_SOURCE_EXT.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

const sourceFiles = walkSource(path.join(ROOT, 'src'));
if (sourceFiles.length < 100) {
  errors.push(`[social-scan-empty] the social URL scan read only ${sourceFiles.length} files under src/, so a pass would mean nothing`);
}
const homeText = fs.readFileSync(path.join(ROOT, SOCIAL_HOME), 'utf8');
if (!/export const SOCIAL_URLS = \{[\s\S]*?linkedin: "https:\/\/www\.linkedin\.com\/company\/-velstrian\/"/.test(homeText)) {
  errors.push('[social-home] SOCIAL_URLS.linkedin is missing from src/lib/brand-names.ts (the owner confirmed https://www.linkedin.com/company/-velstrian/)');
}
for (const file of sourceFiles) {
  const rel = path.relative(ROOT, file);
  for (const hit of socialProfileLiterals(rel, fs.readFileSync(file, 'utf8'))) {
    errors.push(`[social-url-copy] ${hit} (read SOCIAL_URLS from src/lib/brand-names.ts)`);
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
