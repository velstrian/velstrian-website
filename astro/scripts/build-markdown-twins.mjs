/**
 * build-markdown-twins.mjs — emit a Markdown twin of every public HTML page.
 *
 * For Task 1 of R29-WEB-AGENT-READINESS-AND-CLOUDFLARE-HARDENING-01.
 * Cloudflare's Markdown for Agents switch is Pro-plan only, so we build it
 * directly in the site at build time.
 *
 * Emits:
 *   /           -> /index.md
 *   /pricing/   -> /pricing.md
 *   /about/     -> /about.md
 *   404.html    -> /404.md
 *
 * Main content only (no nav, footer, cookie banner), keeping headings,
 * links, and any JSON-LD as a fenced json block at the end.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');

/**
 * Decode common HTML entities.
 */
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&pound;/g, '£')
    .replace(/&copy;/g, '©')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, num) => String.fromCharCode(Number.parseInt(num, 10)));
}

/**
 * Convert HTML table string to Markdown table.
 */
function convertTableToMarkdown(tableHtml) {
  const rows = [];
  const trMatches = tableHtml.match(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi);
  if (!trMatches) return '';

  for (const tr of trMatches) {
    const cells = [];
    const cellMatches = tr.match(/<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/gi);
    if (cellMatches) {
      for (const cell of cellMatches) {
        const text = cell
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        cells.push(decodeEntities(text).replace(/\|/g, '\\|'));
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }
  }

  if (rows.length === 0) return '';
  const colCount = Math.max(...rows.map((r) => r.length));
  const lines = [];

  // Pad cells to column count
  const normalizedRows = rows.map((r) => {
    while (r.length < colCount) r.push('');
    return r;
  });

  // Header row
  lines.push(`| ${normalizedRows[0].join(' | ')} |`);
  // Separator
  lines.push(`| ${new Array(colCount).fill('---').join(' | ')} |`);

  // Data rows
  for (let i = 1; i < normalizedRows.length; i++) {
    lines.push(`| ${normalizedRows[i].join(' | ')} |`);
  }

  return `\n\n${lines.join('\n')}\n\n`;
}

/**
 * Convert an HTML document string to clean Markdown.
 */
export function htmlToMarkdown(html) {
  // 1. Extract JSON-LD blocks
  const jsonLdBlocks = [];
  const jsonLdRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jMatch;
  while ((jMatch = jsonLdRegex.exec(html)) !== null) {
    const raw = jMatch[1].trim();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        jsonLdBlocks.push(JSON.stringify(parsed, null, 2));
      } catch {
        jsonLdBlocks.push(raw);
      }
    }
  }

  // 2. Extract main content
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  let content = mainMatch ? mainMatch[1] : html;

  // 3. Strip non-content blocks: nav, header, footer, scripts, styles, svg
  content = content.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '');
  content = content.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '');
  content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '');
  content = content.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '');

  // 4. Preserve code blocks
  const codeBlocks = [];
  content = content.replace(/<pre\b[^>]*><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_m, code) => {
    const idx = codeBlocks.length;
    const cleanCode = decodeEntities(code.replace(/<[^>]+>/g, ''));
    codeBlocks.push(cleanCode);
    return `\n\n___CODE_BLOCK_${idx}___\n\n`;
  });

  // 5. Convert tables
  content = content.replace(/<table\b[^>]*>[\s\S]*?<\/table>/gi, (tableHtml) => {
    return convertTableToMarkdown(tableHtml);
  });

  // 6. Convert headings
  content = content.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_m, c) => `\n\n# ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);
  content = content.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_m, c) => `\n\n## ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);
  content = content.replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_m, c) => `\n\n### ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);
  content = content.replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, (_m, c) => `\n\n#### ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);
  content = content.replace(/<h5\b[^>]*>([\s\S]*?)<\/h5>/gi, (_m, c) => `\n\n##### ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);
  content = content.replace(/<h6\b[^>]*>([\s\S]*?)<\/h6>/gi, (_m, c) => `\n\n###### ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);

  // 7. Convert links: [text](href)
  content = content.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, inner) => {
    const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    return ` [${text}](${href}) `;
  });

  // 8. Convert formatting
  content = content.replace(/<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, (_m, c) => `**${c.trim()}**`);
  content = content.replace(/<(?:em|i)\b[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, (_m, c) => `*${c.trim()}*`);
  content = content.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_m, c) => `\`${c.trim()}\``);

  // 9. Convert lists
  content = content.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, c) => {
    const text = c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return `\n- ${text}`;
  });
  content = content.replace(/<\/(?:ul|ol)>/gi, '\n\n');

  // 10. Block containers and line breaks
  content = content.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_m, c) => `\n\n${c.trim()}\n\n`);
  content = content.replace(/<br\s*\/?>/gi, '\n');
  content = content.replace(/<\/(?:section|article|div|blockquote)>/gi, '\n\n');

  // 11. Strip remaining tags
  content = content.replace(/<[^>]+>/g, ' ');

  // 12. Decode entities
  content = decodeEntities(content);

  // 13. Restore code blocks
  for (let i = 0; i < codeBlocks.length; i++) {
    content = content.replace(`___CODE_BLOCK_${i}___`, `\`\`\`\n${codeBlocks[i]}\n\`\`\``);
  }

  // 14. Normalise spacing
  const lines = content.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim());
  let md = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();

  // 15. Append JSON-LD blocks at the end
  if (jsonLdBlocks.length > 0) {
    const jsonSection = jsonLdBlocks.map((j) => `\`\`\`json\n${j}\n\`\`\``).join('\n\n');
    md += `\n\n${jsonSection}`;
  }

  return md;
}

/**
 * Walk dist/ and collect all HTML files.
 */
function findHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Main build step.
 */
export function buildMarkdownTwins() {
  if (!fs.existsSync(DIST)) {
    console.error(`build-markdown-twins: dist directory not found at ${DIST}`);
    process.exit(1);
  }

  const htmlFiles = findHtmlFiles(DIST);
  let twinsWritten = 0;
  const linkHeaderRules = [];

  for (const htmlFile of htmlFiles) {
    const rel = path.relative(DIST, htmlFile).replace(/\\/g, '/');
    let twinRelPath;
    let routePath;

    if (rel === 'index.html') {
      twinRelPath = 'index.md';
      routePath = '/';
    } else if (rel === '404.html') {
      twinRelPath = '404.md';
      routePath = '/404';
    } else if (rel.endsWith('/index.html')) {
      const dirRoute = rel.slice(0, -'/index.html'.length);
      twinRelPath = `${dirRoute}.md`;
      routePath = `/${dirRoute}`;
    } else {
      twinRelPath = rel.replace(/\.html$/, '.md');
      routePath = `/${rel.replace(/\.html$/, '')}`;
    }

    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    const mdContent = htmlToMarkdown(htmlContent);

    const twinFullPath = path.join(DIST, twinRelPath);
    fs.mkdirSync(path.dirname(twinFullPath), { recursive: true });
    fs.writeFileSync(twinFullPath, mdContent, 'utf8');
    twinsWritten++;

    // Collect Link header mapping for _headers
    const twinPublicUrl = `/${twinRelPath}`;
    if (routePath === '/') {
      linkHeaderRules.push({
        path: '/',
        link: `<${twinPublicUrl}>; rel="alternate"; type="text/markdown"`,
      });
    } else {
      linkHeaderRules.push({
        path: routePath,
        link: `<${twinPublicUrl}>; rel="alternate"; type="text/markdown"`,
      });
      linkHeaderRules.push({
        path: `${routePath}/`,
        link: `<${twinPublicUrl}>; rel="alternate"; type="text/markdown"`,
      });
    }
  }

  // Update dist/_headers to add per-route Link headers
  const headersPath = path.join(DIST, '_headers');
  if (fs.existsSync(headersPath)) {
    let headersText = fs.readFileSync(headersPath, 'utf8');

    // Ensure /* catch-all carries Vary: Accept
    if (/^\/\*$/m.test(headersText) && !headersText.includes('Vary: Accept')) {
      headersText = headersText.replace(
        /^(\/\*[\s\S]*?)(^[\w\/]|\Z)/m,
        (match, block, next) => {
          if (!block.includes('Vary: Accept')) {
            return `${block.trimEnd()}\n  Vary: Accept\n\n${next}`;
          }
          return match;
        }
      );
    }

    // Append per-route Link rules
    const extraRules = linkHeaderRules
      .map((r) => `${r.path}\n  Link: ${r.link}\n  Vary: Accept`)
      .join('\n');

    const appendedHeaders = `${headersText}\n\n# ── Markdown alternate twins (auto-generated) ──\n${extraRules}\n`;
    fs.writeFileSync(headersPath, appendedHeaders, 'utf8');
  }

  console.log(`markdown-twins: emitted ${twinsWritten} .md twins from ${htmlFiles.length} HTML documents in dist/`);
  return { twinsWritten, htmlCount: htmlFiles.length };
}

// Run if called as CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildMarkdownTwins();
}
