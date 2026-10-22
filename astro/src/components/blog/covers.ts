/**
 * covers.ts: what a type led cover says and how it is drawn (owner decision
 * D283, R285-WEB-TRANSFORMATION-WT-D, 2026-10-22).
 *
 * Replaces heroes.ts, which mapped every post to a stock photograph. The owner
 * said the stock photographs and the AI renders "looked cheap", and D283 put a
 * cover drawn from the design system in their place: the post's own words set
 * large, a category label, and one small motif that differs by category.
 *
 * The data lives in covers.json so that scripts/generate-og-images.js (plain
 * CommonJS) reads the same file and the social card cannot drift from the page.
 * That script repeats the twenty lines of resolution below, and they are kept
 * deliberately simple so the two copies are easy to compare.
 *
 * A post with no entry still gets a cover: the title becomes the line and the
 * category picks the family, so a new post can never ship with a hole.
 */
import COVERS from './covers.json';

type Ground = { bg: string; ink: string; sub: string; accent: string };
type Family = { ground: string; motif: string };

const GROUNDS = COVERS.grounds as Record<string, Ground>;
const FAMILIES = COVERS.families as Record<string, Family>;
const CATEGORIES = COVERS.categories as Record<string, string>;
const POSTS = COVERS.posts as Record<string, string>;
const MOTIFS = COVERS.motifs as Record<string, string>;

export interface Cover {
  /** The words set large on the cover. */
  line: string;
  /** The small label above it: the category, or the kind of resource. */
  kind: string;
  /** The family key, written to data-family so a test can see the variation. */
  family: string;
  /** The inline style that binds --tc-* to the --cover-* role tokens. */
  style: string;
  /** The motif as SVG children for a 0 0 100 100 viewBox. */
  motif: string;
}

export function familyForCategory(category: string): string {
  return CATEGORIES[category] ?? COVERS.defaultFamily;
}

export function buildCover(input: { line: string; kind: string; family: string }): Cover {
  const family = FAMILIES[input.family];
  if (!family) throw new Error(`TypeCover: no family "${input.family}" in components/blog/covers.json`);
  const ground = GROUNDS[family.ground];
  if (!ground) throw new Error(`TypeCover: family "${input.family}" names a ground "${family.ground}" that covers.json does not define`);
  const motif = MOTIFS[family.motif];
  if (!motif) throw new Error(`TypeCover: family "${input.family}" names a motif "${family.motif}" that covers.json does not define`);
  return {
    line: input.line,
    kind: input.kind,
    family: input.family,
    style: `--tc-bg: var(--${ground.bg}); --tc-ink: var(--${ground.ink}); --tc-sub: var(--${ground.sub}); --tc-accent: var(--${ground.accent})`,
    motif,
  };
}

/** The cover for a blog post, from its slug, title and category. */
export function coverForPost(slug: string, title: string, category: string): Cover {
  return buildCover({ line: POSTS[slug] ?? title, kind: category, family: familyForCategory(category) });
}
