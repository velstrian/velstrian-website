# Velstrian website design strategy

Row R285-WEB-ENTERPRISE-REDESIGN-01. Decisions D254 and the owner's 2026-10-21 direction: "understand web design and do choreographed and build excellent design pattern throughout, and must not rush into change instead do deeper understand and do design thinking, make proper strategy and then do top 1% ultra premium design."

Status: VERSION 2, ADOPTED 2026-10-21 evening. Section 0 overrides sections 2, 3, 4 and 6 where they differ. BUILDING. It replaces the patch list in `R285-ENTERPRISE-DESIGN-BRIEF-2026-10-21.md` as the plan. The brief stays as the measurement record.

---

## 0. VERSION 2, the owner's strategic direction (2026-10-21, evening). READ THIS FIRST, IT OVERRIDES SECTIONS 2, 3, 4 AND 6 BELOW WHERE THEY DIFFER

Owner, after seeing the first build of the new home page: "langauge, wordings, statements and page looks complicated ... why do you are just focusing on public bid and tender, why cant you bit simplify the things, check this out https://www.responsive.io/ ... our target customers are not expert bidder instead lot of them will be small and mid size organisation who can create bid by themself, it must be super easy for them ... added photographs does not look great and looks cheap ... no compromise and no silent defered no silent alteration on quality". Written as RULE 0-U in the workspace and platform rules.

Version 1 designed for a sceptical professional bid manager, with Procurement Act section numbers and public sector framing. **That was the wrong customer.** Version 2 corrects it.

### 0.1 Who we are talking to

A small or mid size organisation, 5 to 200 people, that writes its own bids. Often the owner, an operations lead or an office manager does it alongside their day job. No bid team, no procurement training. They bid for **public and private** work: councils, schools, housing associations, the NHS, and private companies that send out tenders and requests for quotes. They want three things: find work that suits them, write a good answer without starting from a blank page, and not be caught out by something they cannot back up.

Velstrian Buy is for the other side: a busy person who has to buy a service and compare the replies fairly. Also not a specialist.

### 0.2 What responsive.io does that we adopt (measured 2026-10-21 through a page read)

1. **One plain sentence says what the product does and names everything it covers.** Theirs names RFPs, security questionnaires and buyer questions in one line.
2. **"Who are you" tabs.** One of their seven tabs is literally "Small Businesses". Each visitor sees one short story that is theirs.
3. **Capabilities as short, everyday statements**, one line each, each beside a product view.
4. **An FAQ that explains the terms** a newcomer will meet ("What is an RFP?").
5. What we do NOT copy: their claims rest on customer logos, review scores and "#1" badges, which we cannot use (D252), and their lower page slides into jargon ("Strategic Response Management").

### 0.3 The message, in plain words

- **What it is, in one sentence:** Velstrian helps you find contracts that suit your business and write strong bids yourself, with every answer built from your own documents.
- **Public and private, always both:** "contracts from councils, schools, the NHS and private companies".
- **The difference, in plain words:** it uses your own documents, shows you where every answer came from, and it will not make things up. If you have no proof for something, it tells you instead of inventing it. (The "refusal" of version 1 stays, said simply.)
- **No jargon above the fold.** ITT, PPN 026, the Procurement Act, social value and evaluation criteria appear further down, only where a reader needs them, each explained in a few words the first time.

### 0.4 Home page, version 2 (replaces the section 4 home table)

| # | The visitor wonders | Section | Form |
|---|---|---|---|
| 1 | What is this, is it for me? | Hero: the one sentence, two buttons ("Start free", "See how it works"), one reassurance line ("No bid team needed"), a real product screen beneath | Calm |
| 2 | Is it for someone like me? | "Who are you" tabs: I run a small business, I lead a growing team, I buy services. Each tab: two sentences and one product view | Interactive, short |
| 3 | What can it do? | Five capabilities in everyday words, tabbed beside one product screen: find contracts that suit you, decide which to go for, answer every question from your documents, get a colleague to check it, keep track of what you promised after you win | Dense but simple |
| 4 | Can I trust what it writes? | "It will not make things up": the one animated moment, an answer with its sources shown, and a sentence it refused to write because there was no proof | The one slow moment |
| 5 | How hard is it to start? | Three steps: add your documents, add a tender, answer the questions | Quick |
| 6 | Is my data safe, what does it cost? | Plain facts: where your data is kept, who processes it, the plain statement that no certificate is held, and the starting price | Quick |
| 7 | I have questions | An FAQ that explains the words a newcomer meets (what is a tender, what is social value, do I need a bid writer) | Calm |
| 8 | What now? | One sentence, Start free, Book a call | Calm |

The bid product page and the buyer page follow the same voice. Expert detail (Procurement Act duties, PPN 026, the seven fit factors and their weights) lives on those pages lower down and in the glossary, not on the home page.

### 0.5 Imagery, version 2

The eight stock photographs of commit 66e58ae0 are **withdrawn from the site** because the owner judged them cheap. They stay in the repository with their credits but no page uses them. Imagery is now:

1. **Real product screens**, the main imagery, from the staging capture lane (neutral demo organisations, approved 2026-10-21, cap 3 pounds).
2. Until those land, HTML recreations of the real screens with a visible "Example data" caption.
3. No stock photography and no AI generated people, unless an image is excellent, specific to small businesses at work, and approved by the driver against the references. Nothing ships because a slot needs filling.

### 0.6 Copy rules, version 2 (added to section 6)

- Write for someone who has never bid before. Short sentences, everyday verbs.
- Say what they get, not how the system works: "answer the questions using your own documents", not "retrieve, ground, compute, check, cite".
- One idea per section, one primary action per screen.
- Never public sector only. Name both.
- Every capability still appears, made easy to understand. Simplicity is never a scope cut.

---

### 0.7 Scope of change across the site (owner, 2026-10-21)

Owner: "lot of pages still hold true and correct content and needs only minor tweaks, major transformation is needed in home page, product pages for content storyline alignment and all the pages needs redesign for branding and new design orchestration to align e2e web design strategy".

| Pages | Content | Design |
|---|---|---|
| Home, /bid/, /buy/ | Full rewrite to the version 2 storyline (section 0.3 and 0.4) | New system, built whole |
| Every other page (pricing, about, sources, tools, glossary, blog, FAQ, legal, compare, changelog, roadmap and the rest) | Keep. Minor tweaks only: Velstrian naming, D255 positive wording, the live site trust strip, RULE 0-U plain words where a sentence is hard to read. Never rewrite correct content for its own sake | Redesigned on the same system: tokens, type, layout grid, components, header, footer, motion. One consistent experience end to end |

Order: (1) home, built and approved, which proves the system. (2) /bid/ and /buy/ storyline and design. (3) the shared shell (header, footer, page templates) moves to the system, which lifts every page at once. (4) each remaining page reviewed at 1440 and 390 and adjusted where its layout needs more than the shell. (5) old components, styles and tokens deleted, gates assert the new system only.

---

## 1. Why the current site reads as AI generated

Looked at side by side, rendered at 1440, home against Auth0 (screenshots in `audit-screenshots/r285-references/`):

| | Ours today | Auth0 |
|---|---|---|
| Section architecture | The same object nine times: a centred heading, a small uppercase mono eyebrow, and a box with a 1px border. Five stage boxes with fake bar charts in a column | A different form in every section: a lifecycle arc, three giant numerals, a sticky side menu with deep tabbed cards, photography case studies, a terminal |
| Scale | Almost everything is 14 to 17px text inside boxes. One huge bold headline, then nothing large again | Dramatic jumps: a 64px statement, 56px numerals, then dense 14px proof, then a statement again |
| Atmosphere | Flat near black from top to bottom | A colour field that moves through the page and gives each zone a temperature |
| Reality | No people, no places, no documents, mock product boxes | Real customer brands, real photographs of people and products |
| Pacing | Uniform. Every section has the same weight | Alternates calm statement and dense proof |
| Template chrome | An eyebrow above every heading, uppercase mono labels, numbered 01 to 05 markers, centred everything | Labels only where they carry information |

The cause is not colour, theme or a hover effect. It is that **the page has no design concept**, so every section defaults to the same generic card. Patching hovers and tokens cannot fix that. A concept can.

## 2. The subject, the audience and the job

**What Velstrian is.** Two products on one platform. Velstrian Bid helps UK suppliers find public and private tenders, decide which to bid, answer every question with an answer that cites the supplier's own evidence, and then deliver what they promised after award (Procurement Act 2023 s.52 and s.71 duties). Velstrian Buy helps buyers publish a requirement and read the returns against the evidence, with a human panel doing the scoring.

**Who reads the site.**
1. The bid manager or bid writer at a UK SME or mid market supplier (5 to 500 staff). Lives in tender packs, ITTs, clarification logs and deadlines. Has been burned by an answer that promised something nobody could evidence. Distrusts "AI writes your bid" tools because the output is confident and unverifiable.
2. The procurement lead in a public body or a larger buyer. Accountable for a defensible award decision. Wants to see the evidence behind every claim and never wants software to score on their behalf.
3. The finance or managing director who signs off the subscription. Wants the price, the data location and proof that this is a real company.

**The one job of the site.** Make a sceptical bid professional believe, within one scroll, that this product will not put words in their mouth that they cannot back up, and then get them to start a bid or book a walkthrough.

**The point of view (from the owner's positioning, 2026-08-01).** Every competitor sells "AI writes your bid". Velstrian's position is the opposite: **every answer is traced to your evidence, and the product refuses to write what it cannot prove.** It also runs past the submit button into delivery, and it serves both sides of the table. The design must make that point of view visible, not just state it.

## 3. The design concept: "The evidenced answer"

The visual world comes from the subject itself. A tender is a document. An answer is text. Evidence is a citation pointing from the answer to a source. The disruptive idea is the link between a claim and its proof, and the refusal when there is none.

So the signature of the site is **the citation link**: a precise line connecting a sentence in an answer to the exact passage in the supplier's evidence or the buyer's specification. It appears in three ways only:

1. In the hero, as the product itself: a real answer with its citations drawn to the source passages.
2. Once on each page, as the single orchestrated motion moment: a claim is checked, a citation draws to its source, and an unsupported figure is struck and refused.
3. As a quiet structural device in the trust section, linking each statement about the company to its source (data region, processor, statement of applicability).

Everything else on the site is quiet and disciplined so this one idea is memorable. That is where the boldness is spent.

**Two voices in the typography, because the product has two voices.** The product interface and our own copy speak in a clean sans (Inter, per D254). Quoted tender and evidence text, the words being read and cited, is set in a serif, the way a document reads. This is not decoration: it tells the reader instantly which words are the tender's and which are ours. Candidate: Source Serif 4 (SIL Open Font License, self hosted, one variable file, size to be measured before adoption).

## 4. Choreography

Auth0's arc is promise, breadth, proof, path, fit, ease, peers, learn, act. It alternates sparse statements with dense proof, and every section answers the next question a visitor would ask.

Ours follows the questions a sceptical bid professional asks, in order, with the pace alternating:

| # | The visitor asks | Section form | Pace |
|---|---|---|---|
| 1 | What is this? | **Hero.** One sentence headline, one sentence lead, two actions. Beneath it, full width, the evidenced answer: a real product capture of an answer with its citation lines drawn to the source | Calm statement, then the product |
| 2 | Is this real? | **Sources band.** The four live notice sources named in plain text, plus the facts a professional checks: seven fit dimensions, 25 MB and 100 MB uploads, single sign on on every plan. No logos we do not own | Quick, dense |
| 3 | Why is it different? | **The refusal.** One large statement on its own ("It will not write what you cannot prove" or similar, to be checked against site facts), then the single orchestrated moment: a draft figure is checked, finds no evidence and is struck | Slow, the emotional peak |
| 4 | How does it work for me? | **The bid, end to end.** A real sequence, so it is shown as one horizontal timeline, not five cards: find, decide, answer, review, deliver. Each stage has one sentence and one small capture. The sticky stage label tracks the scroll | Dense, structured |
| 5 | What about the buyer side? | **Both sides of the table.** A split composition: the supplier's answer on the left, the buyer's evaluation of the same answer on the right, joined by the same citation. One idea, one visual | Calm |
| 6 | Can I trust the company? | **The facts sheet.** A typeset table: where data lives (London, Ireland, the Netherlands), every processor, the plain statement that no certificate is held and what the Statement of Applicability covers, the status page | Dense, document like |
| 7 | What does it cost? | **Price, in the open.** The three Bid plans with seats and credits from the catalogue, link to full pricing | Quick |
| 8 | What do I do now? | **Close.** One sentence, start a bid, book a walkthrough, on the one colour field that bookends the hero | Calm |

Rhythm check: calm, dense, slow peak, dense, calm, dense, quick, calm. No two neighbouring sections share a form. No section repeats the card grid.

The same choreography runs on the product pages, with the story told from one side:

- **/bid/**: a bid manager's question order. Hero with an answer capture. "Find" (the fit score shown as the seven weighted dimensions of one real notice). "Answer" (citations). "Refuse" (the orchestrated moment). "Deliver" (obligations after award, s.52 and s.71). What is included. Price. Questions. Close. Nine sections.
- **/buy/**: a buyer's question order. Hero with the evaluation capture. "The AI reads, your panel scores" as a two column boundary statement. Publish a requirement. Read a return against the evidence. Delivery bands. Works alongside your portal. Access and price. Questions. Close. Eight sections.
- **/pricing/**: hero with the audience and billing switch, plans, comparison table, how credits work, buying by purchase order, questions. Seven sections.

## 5. Visual system

### Colour (existing tokens, one accent, no new hex values)

| Role | Token | Use |
|---|---|---|
| Canvas | `--c-bg` | the page |
| Raised | `--c-raised` | product frames, the facts sheet |
| Ink | `--c-text` | headlines and body |
| Sub | `--c-text-sub` | secondary copy |
| Muted | `--c-text-muted` | captions, table headers |
| Accent | `--c-teal-dark` and `--c-teal` (the indigo family) | links, the primary action, the citation line, verified states |
| Refusal | `--c-red` (existing) | used in exactly one place: the struck unsupported figure |

**Atmosphere, used as structure, not decoration.** One deep indigo light field, built from the accent token at very low opacity, appears in exactly two places: behind the hero product and behind the closing section. It bookends the page the way Auth0's colour does, and everything between stays flat. No other gradients, no gradient text, no violet, orchid or pink.

### Typography

| Role | Face | Size desktop / mobile | Weight | Notes |
|---|---|---|---|---|
| Statement (hero, refusal) | Inter | 64 / 40 px | 600 | tracking -0.025em, line height 1.05, max 14 words a line |
| Section headline | Inter | 40 / 30 px | 600 | tracking -0.02em |
| Lead | Inter | 20 / 18 px | 400 | max 60 characters a line |
| Body | Inter | 17 / 16 px | 400 | line height 1.6, max 70 characters |
| Quoted tender or evidence text | Source Serif 4 | 17 / 16 px | 400 | line height 1.65, only inside product moments and citations |
| Data and captions | Inter | 14 px | 500 | tabular figures for numbers |

Rules taken from the generic tells to avoid: no uppercase labels, no eyebrow above every heading (a label appears only where it carries information a reader needs), no monospace labels (mono survives only for a clause number such as "s.52(3)"), no accenting a single word in a headline, no arrow glyph appended to buttons.

### Layout

- A 12 column grid at 1280px, generous margins. **Left aligned by default.** Centred text only for the single refusal statement and the close, where a centred statement is the point.
- Sections are separated by space (112 to 144px desktop), not by boxes. A section is not a card.
- Hierarchy of containers: the product frame is the only bordered object with a shadow. The facts sheet is a typeset table with hairline rules. Cards appear only where the content really is a set of parallel items (plans), and nowhere else.

```
HERO
+--------------------------------------------------------------+
| Velstrian                    Product  Pricing  About  Sign in [Start]
|                                                              |
| Answer every tender question                                 |
| with your own evidence.                                      |
| One sentence lead that names the bid manager's real problem. |
| [Start a bid]  [See a real tender walkthrough]               |
|                                                              |
| +----------------------------------------------------------+ |
| | answer text ......... [1] ......... [2]     | source doc  | |
| |                      \_________________\____|> passage    | |
| +----------------------------------------------------------+ |
+--------------------------------------------------------------+

THE REFUSAL (centred, the one slow moment)
        It will not write what you cannot prove.
   draft: "We deliver 98% on time" -> no evidence -> struck

THE BID, END TO END (a real sequence, one timeline)
 Find ---- Decide ---- Answer ---- Review ---- Deliver
 [cap]     [cap]       [cap]       [cap]       [cap]
```

### Components

- **Primary button.** Solid accent, 8px radius, 44px tall, sentence case label that says what happens. Its hover is one considered interaction, the owner liked the light sweep: a single soft highlight passes across the button once per hover, 400ms, on the button only, never on cards, never looping, off under reduced motion. Focus has a visible 2px ring.
- **Secondary button.** Outline in the ink colour, fills to the raised surface on hover.
- **Product frame.** Flat, 12px radius, 1px raised border, one soft shadow, a slim title bar with the screen name, no fake window dots, no tilt, no stacking. Real staging captures go here. Until they land, an HTML recreation with a visible "Example data" caption.
- **Citation line.** A 1.5px accent line with a small terminal dot, drawn from a numbered marker in the answer to the highlighted passage in the source. This is the site's signature and appears nowhere as decoration.
- **Facts sheet.** A typeset table, hairline rules, figures in tabular numerals, each row with its source.
- **Cards.** Plans only. Border colour steps on hover, nothing else.

### Motion

One orchestrated moment per page, the refusal and citation sequence, triggered when it scrolls into view, played once, under two seconds, fully readable as a still frame and skipped under reduced motion. The button sweep is the only other decorative motion. Everything that answers a person's action (opening a question, switching a pricing tab) gets a short, plain transition. No scroll reveals on every section, no loops, no marquee.

### Imagery

1. **Real product captures** from staging on the new hosts, from a neutral demo organisation (R285-WEB-PRODUCT-SCREENSHOTS-01). This is the main imagery and the strongest proof.
2. **People and places, per D251.** Real photography of bid and procurement work in recognisable UK settings, used in two places at most (the both sides section and About), never as a hero filler. Source: licensed photography with a clear licence recorded per image, no AI generated people. To be chosen and approved by the owner before use.
3. No illustrations, no icon tiles, no abstract 3D.

## 6. Copy

The words are half of why the page reads as generated. Rules:

1. A headline is one plain sentence a bid manager would say out loud. "Answer every tender question with your own evidence." Not a triplet of fragments, not an abstract noun.
2. Every section names one concrete situation: the clarification deadline, the social value question under PPN 026, the KPI you promised in s.52 terms.
3. Specific beats general: name the four sources, the seven dimensions, the file limits, the regions.
4. Buttons say what happens: "Start a bid", "Book a 30 minute walkthrough", "See the plans".
5. Every number exists in `site-facts.json`. No customer counts, win rates or time saved.
6. UK English, sentence case, no em dash, no semicolons, none of the banned words.

All proposed headlines are drafts until they pass `check-facts`, `check-site-facts` and the owner's read.

## 7. Check against the generic defaults

Reviewed against the common tells of generated pages:

| Generic default | Present in this plan? |
|---|---|
| Near black canvas with one bright accent | The dark canvas is kept by owner decision. The accent is a quiet indigo used for meaning (citation, action), not a neon highlight, and the colour field is used twice as structure |
| The SaaS card kit, identical rounded cards everywhere | Removed. Cards survive only for the plans |
| Eyebrow above every heading, uppercase mono labels | Removed |
| Numbered 01 to 05 markers | Used only for the bid lifecycle, which really is a sequence, shown as a timeline |
| Big number plus small label stat strip as the hero | Not used. The hero is the product |
| Scroll reveal on every section | Not used. One orchestrated moment per page |

What makes this site its own and not anyone else's: the citation line as the signature, the two typographic voices (our sans, the document's serif), and the refusal as the emotional peak. No competitor in bid software can show a refusal, because none of them refuse.

## 8. How it gets built, and how the owner sees it

1. **Owner reads this strategy.** Any change of direction happens here, on paper, at no cost.
2. **Home page first, built whole**, as one coherent piece from this system, not edited section by section from the old page. New components live beside the old ones until the page is approved, so nothing half finished reaches another page.
3. **Owner reviews home on localhost 8093**, at desktop and phone width, with screenshots and a short note of what each section answers.
4. **Then /bid/, /buy/ and /pricing/** reuse the same components, then the remaining pages adopt the system, then the old components and styles are deleted.
5. Each step passes the full gate chain on the built site. Old gates that assert the old look are rewritten to assert the new system in the same commit, never deleted.
6. Real product captures replace the HTML frames as soon as the staging capture run is done.
7. Nothing goes live without the owner. A push to the website `main` is a production deploy.

## 9. Decided (owner, 2026-10-21, later the same day)

Owner: "why cant you help me on direction as you know all the details about platform and products, dont be conservative, use available tools if needed to design and create one", "why cant you use license free photographs and can leverage gemini ai, figma", "The document serif: you must help here", "dont assume anything, dont be conservative and dont fix any rule permanently ... keep north star top 1% ultra premium without compromise and must not go for cheap and patch design approach".

1. **Direction: this strategy is adopted** and the driver owns it end to end. Status changes from "for owner review" to BUILDING. The owner reviews the built home page, not paper.
2. **Imagery.** Free licensed photography (Unsplash licence, Pexels licence, both allow commercial use without attribution, the licence and source URL are recorded per image in `astro/src/data/image-credits.json`), plus AI generated images (Gemini, the Figma image tools) where no real photograph fits. One honesty rule only: no image is ever presented as a named customer, a testimonial or a real event at a real organisation. Atmosphere, people at work and UK places are fine from either source.
3. **Document serif: Source Serif 4**, SIL Open Font License, self hosted variable woff2, used only for quoted tender and evidence text. Its measured size is reported in the first commit that ships it.
4. **No rule is permanent.** Where an existing rule, gate or budget blocks a better design, the driver changes it in the same commit and says why. The hard limits stay because they protect the owner, not the design: no invented customers, numbers or certifications (D252), no em dashes in user facing text, Cloudflare free plan, nothing live without the owner.
5. **North star: top 1 percent ultra premium.** No patch work. Every page is built whole from the system and critiqued against the references at 1440 and 390 before the owner sees it.
