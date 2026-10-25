import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { validateSignup } from './validation.mjs';

const http = httpRouter();
const allowedOrigins = new Set(['https://www.blocktap.app', 'https://blocktap.app', 'http://localhost:3000', 'http://127.0.0.1:3000']);
const maxBytes = 8192;
const handle = httpAction(async (ctx, request) => {
  const origin = request.headers.get('Origin');
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin' };
  if (!allowedOrigins.has(origin)) return new Response(JSON.stringify({ error: 'Origin not allowed.' }), { status: 403, headers });
  headers['Access-Control-Allow-Origin'] = origin;
  headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type';
  const respond = (value, status = 200) => new Response(JSON.stringify(value), { status, headers });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return respond({ error: 'Expected JSON.' }, 415);
  if (Number(request.headers.get('Content-Length')) > maxBytes) return respond({ error: 'Request too large.' }, 413);
  let signup;
  try {
    // Bound streamed bodies as well as requests with a Content-Length header.
    const reader = request.body?.getReader();
    if (!reader) return respond({ error: 'Please complete the form.' }, 400);
    const chunks = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); return respond({ error: 'Request too large.' }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    signup = JSON.parse(new TextDecoder().decode(bytes));
    if (signup?.website) return respond({ ok: true }); // Honeypot for simple spambots.
    validateSignup(signup);
  } catch (error) {
    return respond({ error: error instanceof SyntaxError ? 'Please complete the form and try again.' : error.message }, 400);
  }
  try {
    await ctx.runMutation(internal.waitlist.join, { signup });
    return respond({ ok: true });
  } catch {
    return respond({ error: 'We couldn’t save your spot. Please try again.' }, 503);
  }
});
http.route({ path: '/waitlist', method: 'POST', handler: handle });
http.route({ path: '/waitlist', method: 'OPTIONS', handler: handle });
export default http;
