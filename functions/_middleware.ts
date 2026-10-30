/**
 * Cloudflare Pages Function middleware for content negotiation.
 *
 * When request carries Accept: text/markdown, serves the Markdown twin:
 *   /           -> /index.md
 *   /pricing    -> /pricing.md
 *   /about/     -> /about.md
 * Returns Content-Type: text/markdown; charset=utf-8 and Vary: Accept.
 *
 * For HTML responses, passes through to static assets and ensures Vary: Accept
 * and Link: </path.md>; rel="alternate"; type="text/markdown" are set.
 */

interface PagesFunctionContext {
  request: Request;
  env: {
    ASSETS: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    };
  };
  next: () => Promise<Response>;
}

export async function onRequest(context: PagesFunctionContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const accept = request.headers.get('Accept') || '';
  const pathname = url.pathname;
  const isHead = request.method === 'HEAD';
  const isGetOrHead = request.method === 'GET' || isHead;

  function getTwinPath(p: string): string {
    const clean = p.replace(/\/$/, '');
    if (!clean || clean === '') return '/index.md';
    return `${clean}.md`;
  }

  // Content negotiation: client requests text/markdown
  if (isGetOrHead && accept.includes('text/markdown')) {
    const twinPath = getTwinPath(pathname);
    const twinUrl = new URL(twinPath, url.origin);
    const twinRes = await env.ASSETS.fetch(new Request(twinUrl.toString(), request));

    if (twinRes.ok) {
      const headers = new Headers(twinRes.headers);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      headers.set('Vary', 'Accept');
      return new Response(isHead ? null : twinRes.body, {
        status: 200,
        statusText: 'OK',
        headers,
      });
    }
  }

  // Handle requests without Accept: text/markdown (browsers)
  // If clean route without trailing slash, serve the index HTML directly
  let response: Response;
  const isCleanRoute = !pathname.includes('.') && !pathname.endsWith('/');
  if (isCleanRoute && isGetOrHead) {
    const slashedUrl = new URL(`${pathname}/`, url.origin);
    const candidate = await env.ASSETS.fetch(new Request(slashedUrl.toString(), request));
    if (candidate.ok) {
      response = candidate;
    } else {
      response = await context.next();
    }
  } else {
    response = await context.next();
  }

  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('text/html')) {
    const headers = new Headers(response.headers);
    headers.set('Vary', 'Accept');
    const twinPath = getTwinPath(pathname);
    const altLink = `<${twinPath}>; rel="alternate"; type="text/markdown"`;
    const existingLink = headers.get('Link');
    if (!existingLink) {
      headers.set('Link', altLink);
    } else if (!existingLink.includes(altLink)) {
      headers.set('Link', `${existingLink}, ${altLink}`);
    }
    return new Response(isHead ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
}
