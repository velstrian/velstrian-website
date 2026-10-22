---
title: "Security | Velstrian"
description: "How Velstrian stores and protects your bid data: AES-256 at rest, TLS 1.3 in transit, where each layer is stored and processed, and what we send to AI providers."
heading: "Encrypted, documented, and auditable."
eyebrow: "Security & Trust"
---[System status: status.velstrian.com](https://status.velstrian.com)

How Velstrian protects your bid documents, company data, and user accounts: enterprise encryption, data stored in the EU (Ireland), and transparent AI processing boundaries.

Every layer, from disk to API, is named and auditable.

## Operational standards

The controls every Velstrian organisation inherits by default, from encryption to data residency to regulatory registration.

### AES-256 encryption at rest

Disk-level AES-256-GCM with automatic key rotation across databases, file storage, and backups.

### TLS 1.3 in transit

Forward-secret HTTPS on every request with HSTS preload and modern cipher suites only.

### GDPR compliant

Subject rights supported end to end, with lawful basis, retention and deletion documented. A Data Processing Agreement is available for customers on request, currently in draft pending legal review.

### EU data residency

Primary customer data is stored in the EU, in AWS eu-west-1 (Ireland). Our API runs in the EU and the web application runs in the UK. Full processing locations are listed under sub-processors below.

### Follows ISO/IEC 27001

We follow ISO/IEC 27001 and review every Annex A control in our own Statement of Applicability.

### ICO Registered Data Controller

Velstrian Systems Ltd is registered with the Information Commissioner's Office as a data controller.

## Security documentation

The detail behind each control, written for security and procurement teams. Jump to any topic, or contact us for an audit pack.

<aside aria-label="Security contact" class="legal-aside"> <div class="legal-aside__card"> <strong>Security Contact</strong> <p>For security disclosures or audit requests, contact our security team at <a href="mailto:contact@velstrian.com">contact@velstrian.com</a></p> </div> </aside>

## AES-256 encryption

All customer data is encrypted at rest using AES-256, and in transit using TLS 1.3. Disk encryption keys are managed and rotated by our infrastructure providers. Application credentials and API keys are rotated by us, on a documented procedure with a verification step before the old key is revoked. Database snapshots, file storage, and backups inherit the same protection.

<dl class="deflist deflist--ledger"> <dt>At rest</dt> <dd>AES-256-GCM</dd> <dt>In transit</dt> <dd>TLS 1.3, HSTS</dd> <dt>Disk key rotation</dt> <dd>Provider managed</dd> <dt>Application key rotation</dt> <dd>Documented procedure</dd> <dt>Backups</dt> <dd>Encrypted</dd> </dl>

## EU data residency

- Your account and bid data, sign in records and uploaded files are stored by Supabase in AWS eu-west-1 (Ireland), with daily backups.
- The Velstrian API and its background worker run on Railway in europe-west4 (the Netherlands).
- The web application runs on Vercel in London (lhr1).
- Error monitoring runs in the EU (Sentry, Germany) and product analytics in the EU (PostHog EU Cloud).
- Other processors operate under Standard Contractual Clauses (SCCs).
- AI is the one part that leaves the EU. We send only the text a task needs to Google Gemini and Anthropic Claude, and neither lets us choose a UK or EU location. [AI data handling](#ai-data-handling) below says where each one processes it and under what contract. The full list is below and matches our [Privacy Policy](/privacy/).

<dl class="deflist"> <dt id="sub-processors">Sub-processors</dt> <dd> <dl class="deflist deflist--ledger"> <dt>Supabase</dt> <dd>EU (Ireland), database, authentication and file storage</dd> <dt>Railway</dt> <dd>EU (Netherlands), the API and background worker</dd> <dt>Vercel</dt> <dd>UK (London), web application hosting</dd> <dt>Cloudflare</dt> <dd>Global edge, SCC, DNS, CDN and bot protection</dd> <dt>Stripe</dt> <dd>US and EU, SCC, payments</dd> <dt>PostHog</dt> <dd>EU, product analytics</dd> <dt>Sentry</dt> <dd>EU (Germany), error monitoring</dd> <dt>Brevo</dt> <dd>EU, email delivery</dd> <dt>Google Gemini</dt> <dd>Not region pinned, international transfer under contract, AI drafting</dd> <dt>Anthropic Claude</dt> <dd>Global, no UK or EU option, international transfer under contract, the buyer pre-read and answer quality checks</dd> <dt>Calendly</dt> <dd>SCC, meeting scheduling links</dd> </dl> </dd> </dl>

## GDPR compliance

- Velstrian Systems Ltd is registered as a data controller with the Information Commissioner’s Office (ICO) under the Data Protection (Charges and Information) Regulations 2018.
- A Data Processing Agreement (DPA) is available on request for customers. It is in draft pending legal review, so terms may change before signature.
- Data subject rights supported: right to erasure, data portability, restriction of processing, and access.

<dl class="deflist"> <dt>ICO contact &amp; registration</dt> <dd> <p>Registered with the Information Commissioner's Office as a data controller.</p> <p>Data requests: <a href="mailto:contact@velstrian.com">contact@velstrian.com</a></p> </dd> </dl>

## Access controls

Platform access is enforced in depth: organisation-scoped roles at the application layer, Row-Level Security at the database, and multi-factor authentication at the identity layer.

### RBAC

- Org-scoped roles: Owner, Admin, Member.
- Privileged actions audit-logged.
- Invite-only org joins.

### RLS

- Row-Level Security enforced in Postgres.
- Org isolation at query time.
- Tenant data scoped to each organisation via RLS.

### MFA

- TOTP available for every account.
- Session revocation on demand.

## ISO 27001 controls

We follow ISO/IEC 27001 and review every Annex A control in our own Statement of Applicability. OWASP practices are applied to all application development. The control set, the risk register, the statement of applicability, the internal audit and the management review are maintained as documents and are available on request.


## AI data handling

AI runs through server-side API calls from our own API only. Drafting, document reading, search and the chat assistants use Google Gemini (Gemini 2.5 Pro, Gemini 2.5 Flash and Gemini embeddings). The buyer pre-read in Velstrian Buy and our checks on the quality of drafted answers use Anthropic Claude (Claude Sonnet 4.6). Both are data sub-processors. The boundaries below describe exactly what crosses to a model provider.

<dl class="deflist"> <dt>What is sent</dt> <dd> <ul> <li>The text the active task needs: tender documents, your answers, your library, documents you upload, or what you type into a chat.</li> <li>This can contain personal data, such as a name in a CV. We do not remove it before sending.</li> <li>Server-side API calls only.</li> </ul> </dd> <dt>What is NOT sent</dt> <dd> <ul> <li>Bulk exports or full organisation datasets.</li> <li>Passwords, authentication tokens or payment details.</li> </ul> </dd> <dt>Where it is processed</dt> <dd> <ul> <li>Google Gemini: the Gemini API offers no region setting, and Google may store or cache the text in any country where it or its agents have facilities.</li> <li>Anthropic Claude: Anthropic's global service, with no UK or EU option.</li> </ul> </dd> <dt>Under what contract</dt> <dd> <ul> <li>Google Gemini: Google's Gemini API terms.</li> <li>Anthropic Claude: Anthropic's Commercial Terms with Anthropic Ireland, Limited, which include the EU Standard Contractual Clauses and the UK International Data Transfer Agreement. By default Anthropic does not train on what we send, and deletes it within 30 days, or up to 2 years if it is flagged for a usage policy breach.</li> <li>We treat both as international transfers, protected as our <a href="/privacy/">Privacy Policy</a> sets out.</li> </ul> </dd> </dl>

<dl class="deflist"> <dt>Model Usage &amp; Data Isolation</dt> <dd>Inference traffic is brokered through Velstrian-controlled service identities. Prompts include the minimum context required to satisfy the active task. Model responses are post-processed before storage to strip provider metadata.</dd> </dl>

## Vulnerability disclosure

Report security vulnerabilities responsibly to [contact@velstrian.com](mailto:contact@velstrian.com?subject=Security%20Disclosure) with the subject “Security Disclosure”. We acknowledge receipt within two business days and triage as below. These are targets we set ourselves, not a contractual service level.

On a narrow screen, this table scrolls sideways.

<div class="prose-scroll" role="region" aria-label="Table" tabindex="0"><table class="sec-table"> <thead> <tr> <th>Severity</th> <th>Examples</th> <th>Triage target</th> <th>Patch target</th> </tr> </thead> <tbody> <tr> <td><span class="chip">Critical</span></td> <td>RCE, auth bypass</td> <td>1 business day</td> <td>5 days</td> </tr> <tr> <td><span class="chip">High</span></td> <td>Privilege escalation</td> <td>2 business days</td> <td>14 days</td> </tr> <tr> <td><span class="chip">Medium</span></td> <td>CSRF, XSS</td> <td>3 business days</td> <td>30 days</td> </tr> <tr> <td><span class="chip">Low</span></td> <td>Hardening findings</td> <td>5 business days</td> <td>Best-effort</td> </tr> </tbody> </table></div>

## Uptime target

99.5<sup>%</sup>

Velstrian targets 99.5% monthly uptime, with independent public status monitoring you can check yourself.

[View status page](https://status.velstrian.com)

## Deep dives

<details class="sec-acc"> <summary> Sub-processors list </summary> <div class="sec-acc-body"> <p>The same list as above, with what each one does.</p> <ul> <li><strong>Supabase</strong> (EU, Ireland), database, authentication and file storage.</li> <li><strong>Railway</strong> (EU, Netherlands), the API and background worker.</li> <li><strong>Vercel</strong> (UK, London), web application hosting.</li> <li><strong>Cloudflare</strong> (global, SCC), DNS, CDN and DDoS protection.</li> <li><strong>Stripe</strong> (US and EU, SCC), billing and payment processing.</li> <li><strong>PostHog</strong> (EU Cloud), product analytics, event metadata.</li> <li><strong>Sentry</strong> (EU, Germany), error monitoring.</li> <li><strong>Brevo</strong> (EU), transactional email delivery.</li> <li><strong>Google Gemini</strong> (not region pinned, under Google's Gemini API terms), AI drafting, document reading, search and the chat assistants.</li> <li><strong>Anthropic Claude</strong> (global, under Anthropic's Commercial Terms with Anthropic Ireland, Limited), the buyer pre-read and answer quality checks.</li> <li><strong>Calendly</strong> (SCC), meeting scheduling links.</li> </ul> </div> </details>

<details class="sec-acc"> <summary> Severity levels in detail </summary> <div class="sec-acc-body"> <p>Our severity model follows CVSS 3.1 base scoring, adjusted for environmental impact across multi-tenant data isolation.</p> <ul> <li><strong>Critical:</strong> active exploitation paths affecting confidentiality or integrity of customer data.</li> <li><strong>High:</strong> escalation paths within an authenticated session.</li> <li><strong>Medium:</strong> targeted attacks requiring user interaction or constrained scope.</li> <li><strong>Low:</strong> defensive hardening, configuration drift, or informational findings.</li> </ul> </div> </details>

## Company & regulatory details

<dl class="deflist deflist--ledger"> <dt>ICO registration</dt> <dd>Registered Data Controller</dd> <dt>Company</dt> <dd>Velstrian Systems Ltd</dd> <dt>Registered</dt> <dd>England and Wales</dd> <dt>Data controller</dt> <dd>Velstrian Systems Ltd</dd> <dt>General Enquiries</dt> <dd><a href="mailto:contact@velstrian.com">contact@velstrian.com</a></dd> <dt>Security</dt> <dd><a href="mailto:contact@velstrian.com">contact@velstrian.com</a></dd> </dl>

<dl class="deflist"> <dt>Data request contact</dt> <dd>For erasure, portability, restriction, or access requests, email <a href="mailto:contact@velstrian.com">contact@velstrian.com</a>. We respond within statutory timeframes.</dd> </dl>

## Finished your review?

Everything above is what we can show you today. If it meets your needs, the next step is a live workspace. If you need a control you do not see here, ask us and we will tell you plainly where it stands.

[Start now](https://app.crowagent.ai/signup) [Book a 30-minute demo](https://calendly.com/crowagent-platform/30min)

ICO-registered data controller. EU data residency. AES-256 at rest, TLS 1.3 in transit. Follows ISO/IEC 27001. GDPR compliant.

[Privacy Policy](/privacy/) [Sub-processors](#sub-processors) [Status Page](https://status.velstrian.com)
