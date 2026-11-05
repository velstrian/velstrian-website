// Brief 35 Task 2: re-run the 20 first-time-user questions against the built
// help index, using the EXACT live client-side filter (title + summary +
// category, lowercased, AND across whitespace-split words, DOM order).
// Target 20 of 20. Reads the generated JSON this build ships.
import fs from 'node:fs';
import path from 'node:path';

const j = JSON.parse(fs.readFileSync(path.resolve('src/data/help-centre.generated.json'), 'utf8'));
// Build the article list in the page's DOM order: category order, then article order within category.
const catOrder = j.categories.map((c) => c.name);
const articles = [...j.articles].sort((a, b) => {
  const ci = catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
  if (ci !== 0) return ci;
  return j.articles.indexOf(a) - j.articles.indexOf(b);
});

function liveSearch(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return articles.filter((a) => {
    const text = `${a.title} ${a.summary} ${a.category}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
}

const QUESTIONS = [
  { n: 1, q: 'sign up', want: 'Get set up when you first sign in' },
  { n: 2, q: 'free trial', want: 'Your first free tender briefing' },
  { n: 3, q: 'first bid', want: 'Quick start: set up Velstrian Tenderworks for your first tender' },
  { n: 4, q: 'upload tender', want: 'Upload, parse and organise procurement documents' },
  { n: 5, q: 'find tenders', want: 'Find and assess tenders on the Opportunities screen' },
  { n: 6, q: 'write answer', want: 'Generate, cite and edit winning bid narratives' },
  { n: 7, q: 'export', want: 'Exporting submission packs (Word, PDF, Excel Matrix, Audit ZIP)' },
  { n: 8, q: 'social value', want: 'How social value scoring & TOMs proxy calculations work' },
  { n: 9, q: 'private buyer', want: 'Bid to a private sector buyer' },
  { n: 10, q: 'answer library', want: 'Reuse your best answers with the Answer library' },
  { n: 11, q: 'invite team', want: 'Invite your team and choose what each person can do' },
  { n: 12, q: 'billing', want: 'Plans, billing and invoices' },
  { n: 13, q: 'credits', want: 'Plans, billing and invoices' },
  { n: 14, q: 'cancel', want: 'Plans, billing and invoices' },
  { n: 15, q: 'password reset', want: 'Security baselines, MFA enforcement, recovery codes & data controls' },
  { n: 16, q: 'two factor', want: 'Security baselines, MFA enforcement, recovery codes & data controls' },
  { n: 17, q: 'score bids', want: 'Score bids with a panel and agree the final marks' },
  { n: 18, q: 'requirement pack', want: 'Build a requirement, from a document or from blank' },
  { n: 19, q: 'delete data', want: 'Download a copy of your data' },
  { n: 20, q: 'contact support', want: 'How to get help, report a problem or book a call' },
];

let pass = 0;
for (const item of QUESTIONS) {
  const results = liveSearch(item.q);
  const top3 = results.slice(0, 3).map((r) => r.title);
  const hit = top3.includes(item.want);
  if (hit) pass += 1;
  console.log(`Q${item.n} [${hit ? 'PASS' : 'FAIL'}] "${item.q}" (${results.length} results) top3: ${top3.length ? top3.map((t, i) => `${i + 1}.${t}`).join(' | ') : '(none)'}`);
  if (!hit) console.log(`   want: ${item.want}`);
}
console.log(`\nPASS ${pass}/20`);
process.exit(pass === 20 ? 0 : 1);
