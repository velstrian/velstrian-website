/**
 * help-centre.ts: the public help centre, typed.
 *
 * D461 and D462 (2026-10-26): the help centre lives at velstrian.com/help and
 * its words come from ONE source, crowagent-platform/web/lib/help-articles.ts.
 * help-centre.generated.json is written from that file by
 * scripts/generate-help-centre.mjs and checked for drift on every build. Never
 * edit the JSON by hand: change the platform article and run the script.
 */
import data from './help-centre.generated.json';

export interface HelpArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  product: 'platform' | 'bid' | 'buy' | 'both';
  readingTime: string;
  html: string;
}

/** One approved how-to video, from APPROVED_HELP_VIDEOS in the platform. */
export interface HelpVideo {
  id: string;
  title: string;
  product: 'bid' | 'buy';
  audience: 'supplier' | 'buyer';
  durationSeconds: number;
  src: string;
  captions: string;
  poster: string;
  helpSlug: string | null;
  approvedOn: string;
  approvedBy: string;
}

export interface HelpCategory {
  name: string;
  description: string;
}

/** support@ mailbox, from SUPPORT_EMAIL in the platform's @velstrian/tokens. */
export const SUPPORT_EMAIL: string = data.supportEmail;

/** The full knowledge base, hosted by Tawk.to on our own subdomain. Written once
 *  here so /help and any later page link the same address. */
export const HELP_KB_URL = 'https://velstrian.tawk.help';

export const HELP_CATEGORIES: HelpCategory[] = data.categories;
export const HELP_ARTICLES: HelpArticle[] = data.articles as HelpArticle[];
export const HELP_VIDEOS: HelpVideo[] = data.videos as HelpVideo[];

/** "2 min 0 s" or "51 s", the same wording the app's player uses. */
export function videoDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} min ${s} s` : `${s} s`;
}

/** Category name to a URL fragment, for the jump links on /help. */
export function categoryId(name: string): string {
  return `help-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

/** The articles of one category, in the platform's own order. */
export function articlesIn(category: string): HelpArticle[] {
  return HELP_ARTICLES.filter((a) => a.category === category);
}

/**
 * Tables in an article scroll inside their own region on a phone rather than
 * pushing the page sideways, the same recipe as the legal pages.
 */
export function articleHtml(article: HelpArticle): string {
  return article.html
    .replace(/<table>/g, `<div class="prose-scroll" role="region" tabindex="0" aria-label="Table in ${article.title.replace(/"/g, '&quot;')}"><table>`)
    .replace(/<\/table>/g, '</table></div>');
}
