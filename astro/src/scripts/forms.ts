/**
 * forms.ts — shared form validation, submission, and query handling engine.
 * Consolidates ContactForm, NewsletterForm, and PartnerForm.
 */

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;
const clean = (s: string) => s.trim().replace(/[\r\n]+/g, '');
const val = (id: string) => clean($<HTMLInputElement | HTMLTextAreaElement>(id)?.value ?? '');

const setErr = (el: HTMLElement | null, err: HTMLElement | null | undefined, show: boolean) => {
  err && (err.hidden = !show);
  el?.setAttribute('aria-invalid', String(show));
};

const setStatus = (box: HTMLElement, st: string, msg: string) => {
  box.className = `form__status form__status--${st}` + (box.matches('.nl__status') ? ' nl__status' : '');
  box.querySelector<HTMLElement>('.form__status-text')!.textContent = msg;
  box.hidden = false;
};

const setBusy = (btn: HTMLButtonElement, b: boolean) => {
  btn.disabled = b;
  b ? btn.setAttribute('aria-busy', 'true') : btn.removeAttribute('aria-busy');
};

const isValid = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
  const v = clean(el.value);
  return el.type === 'checkbox'
    ? (el as HTMLInputElement).checked
    : el.type === 'email'
      ? EMAIL_RE.test(v)
      : v.length >= (el.id === 'cp-msg' ? 20 : 1);
};

const MSG: Record<string, [string, string, string]> = {
  c: ['Sending your message...', "Message received. We'll be in touch within three to five business days.", 'Message sent'],
  p: ['Sending your enquiry...', "Enquiry received. We'll be in touch within 2 business days.", 'Enquiry sent'],
  n: ['Adding your address...', 'Thanks. You are on the list.', 'Subscribed'],
};

async function send(
  form: HTMLFormElement,
  btn: HTMLButtonElement,
  st: HTMLElement,
  body: Record<string, unknown>,
  svc: string,
  onReset?: () => void,
) {
  const [busy, ok, done] = MSG[svc[0]];
  const idle = btn.textContent ?? 'Submit';
  setBusy(btn, true);
  btn.textContent = 'Sending...';
  setStatus(st, 'busy', busy);
  body.turnstile_token = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value ?? null;

  try {
    const r = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok) throw r.status;
    form.reset();
    onReset?.();
    setStatus(st, 'ok', ok);
    btn.removeAttribute('aria-busy');
    btn.textContent = done;
    return r;
  } catch (err) {
    const isNl = svc[0] === 'n';
    console.error(
      JSON.stringify({
        level: 'error',
        service: svc,
        endpoint: form.action,
        error: String(err),
      }),
    );
    setStatus(
      st,
      'bad',
      `Something went wrong. Please ${isNl ? 'try again, or email' : 'email'} ${form.dataset.contactEmail || 'contact@velstrian.com'}${isNl ? '.' : ' directly.'}`,
    );
    setBusy(btn, false);
    btn.textContent = idle;
    return null;
  }
}

function wire(
  form: HTMLFormElement | null,
  svc: string,
  getBody: (f: HTMLFormElement) => Record<string, unknown>,
  afterOk?: (r: Response, btn: HTMLButtonElement, st: HTMLElement) => Promise<void>,
) {
  if (!form) return;
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const st = form.querySelector<HTMLElement>('.form__status');
  if (!btn || !st) return;

  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]')].map(
    (el) => ({ el, err: el.id ? $(`${el.id}-err`) : form.querySelector<HTMLElement>('.nl__err') }),
  );

  for (const { el, err } of fields) {
    el.onblur = () => setErr(el, err, !isValid(el));
    el.oninput = el.onchange = () => isValid(el) && setErr(el, err, false);
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (form.querySelector<HTMLInputElement>('[name="website"]')?.value) return;

    let bad: HTMLElement | null = null;
    for (const { el, err } of fields) {
      const ok = isValid(el);
      setErr(el, err, !ok);
      bad ||= ok ? null : el;
    }
    if (bad) return (bad.focus(), (btn.disabled = false));

    const r = await send(form, btn, st, getBody(form), svc, () => fields.forEach(({ el, err }) => setErr(el, err, false)));
    if (r && afterOk) await afterOk(r, btn, st);
  };
}

function initContact(): void {
  const form = $('contactPageForm') as HTMLFormElement | null;
  if (!form) return;
  const sel = $('cp-type') as HTMLSelectElement | null;
  const msg = $('cp-msg') as HTMLTextAreaElement | null;
  if (sel) {
    const p = new URLSearchParams(location.search);
    const set = (v: string) => {
      if ([...sel.options].some((o) => o.value === v)) {
        sel.value = v;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        return 1;
      }
    };
    const g = (k: string) => (p.get(k) || '').toLowerCase();
    const enq = g('enquiry'), prod = g('product'), tier = g('tier');
    const r = enq || (prod === 'bid' ? 'ppn002-bid' : prod === 'buy' ? 'buyer-side' : /^(port|enter)/.test(prod + tier) ? 'enterprise' : '');
    if (r && set(r) && msg && !msg.value) {
      msg.value =
        r === 'limited-access'
          ? 'I would like help getting started with Velstrian Bid.\n\nOrganisation:\nWhat we need Velstrian Bid for:\n'
          : enq
            ? ''
            : `I would like to talk to sales about ${r === 'buyer-side' ? 'Velstrian Buy' : r === 'enterprise' ? 'the Portfolio plan' : 'Velstrian Bid'}${tier ? ` (${tier} tier)` : ''}.\n\n`;
    }
  }

  wire(form, 'contact-form', () => ({
    name: val('cp-name'),
    email: val('cp-email'),
    organisation: val('cp-org'),
    enquiry_type: sel?.value ?? '',
    message: val('cp-msg'),
  }));
}

function initPartner(): void {
  wire($('partnerForm') as HTMLFormElement, 'partner-form', (f) => {
    const d: Record<string, unknown> = {
      consent_text: f.querySelector('.consent span')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      consented_at: new Date().toISOString(),
    };
    new FormData(f).forEach((v, k) => /^(web|gdpr)/.test(k) || (d[k] = (typeof v === 'string' && v.trim()) || null));
    return d;
  });
}

function initNewsletter(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-newsletter]').forEach((form) => {
    wire(
      form,
      'newsletter-form',
      (f) => ({
        email: clean(f.querySelector<HTMLInputElement>('input[type="email"]')!.value),
        source: f.dataset.source,
      }),
      async (r, btn, st) => {
        if ((await r.json().catch(() => 0)).subscribed === false) {
          setStatus(st, 'warn', 'Thanks. We have your address and will add you to the list shortly.');
          btn.textContent = 'Received';
        }
      },
    );
  });
}

$('contactPageForm') && initContact();
$('partnerForm') && initPartner();
document.querySelector('form[data-newsletter]') && initNewsletter();
