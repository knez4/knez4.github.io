import { ageOn, system } from './knowledge';

/**
 * The portfolio chat: one POST endpoint that answers questions about Veljko.
 *
 * Built to spend as few tokens as possible on Workers AI's free allocation:
 *  - one small, fast model with "thinking" switched off (thinking tokens are billed);
 *  - the knowledge base is the same prefix on every request, and one shared session
 *    id routes requests to the same model instance, so that prefix is served from
 *    the prompt cache at half price;
 *  - short answers (capped output), at most two earlier turns of history, and
 *    questions capped at 300 characters;
 *  - identical first questions ("Ko je Veljko?") are answered from the edge cache
 *    for a day without calling the model at all;
 *  - a per-visitor rate limit so one person cannot use up the day's allowance.
 */

export interface Env {
  AI: Ai;
  LIMITER: RateLimit;
}

const MODEL = '@cf/google/gemma-4-26b-a4b-it';
const MAX_Q = 300;
const MAX_HISTORY = 2;
const MAX_OUT = 220;

const ORIGINS = new Set([
  'https://knez4.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
]);

type Turn = { q: string; a: string };
type Body = { q?: unknown; history?: unknown; lang?: unknown };

const SR_WORDS = new Set(
  'je da li sta šta ko koji koja koje koliko kako gde gdje kada zasto zašto mi me mu ga on ona njegov njegova sajt sajta moze može mozes možeš ima nema za sa od u na i ili ne zna radi radis radiš veljko veljku veljkom posao praksa cena kosta košta napravi napraviti treba hocu hoću zelim želim'.split(' '),
);
const EN_WORDS = new Set(
  'the what is does do he his him about tell me who how can could you and are a an of in for with work works build website available internship price cost where which'.split(' '),
);

/**
 * The model leans toward Serbian because most of its instructions mention it, so the
 * reply language is decided here: Serbian letters or more Serbian words than English
 * ones mean Serbian; a tie goes to the language the site is shown in.
 */
function languageOf(q: string, siteLang: unknown): 'sr' | 'en' {
  if (/[čćžšđ]/i.test(q)) return 'sr';
  let sr = 0;
  let en = 0;
  for (const w of q.toLowerCase().split(/[^\p{L}]+/u)) {
    if (SR_WORDS.has(w)) sr++;
    if (EN_WORDS.has(w)) en++;
  }
  if (sr !== en) return sr > en ? 'sr' : 'en';
  return siteLang === 'en' ? 'en' : 'sr';
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = req.headers.get('Origin') ?? '';
    const cors = corsHeaders(origin);

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ error: 'method' }, 405, cors);
    // Browsers always send Origin on a cross-site POST; anything else is not the site.
    if (!ORIGINS.has(origin)) return json({ error: 'origin' }, 403, cors);

    const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { success } = await env.LIMITER.limit({ key: ip });
    if (!success) return json({ error: 'rate' }, 429, cors);

    let body: Body;
    try {
      body = (await req.json()) as Body;
    } catch {
      return json({ error: 'bad' }, 400, cors);
    }
    const q = clean(body.q);
    if (q.length < 2 || q.length > MAX_Q) return json({ error: 'length' }, 400, cors);
    const history = parseHistory(body.history);

    // Only a conversation's first question is cacheable: later ones depend on what came before.
    const cache = caches.default;
    const key = history.length === 0 ? cacheKey(`${languageOf(q, body.lang)} ${q}`) : null;
    if (key) {
      const hit = await cache.match(key);
      if (hit) return json({ answer: ((await hit.json()) as { answer: string }).answer, cached: true }, 200, cors);
    }

    const messages = [
      { role: 'system', content: system(ageOn(new Date())) },
      ...history.flatMap((t) => [
        { role: 'user', content: t.q },
        { role: 'assistant', content: t.a },
      ]),
      // The language note goes after the question, past the cached prefix, so it costs a few tokens only.
      { role: 'user', content: `${q}\n\n(${languageOf(q, body.lang) === 'en' ? 'Answer in English.' : 'Odgovori na srpskom, latinicom.'})` },
    ];

    let answer: string;
    try {
      const out = (await env.AI.run(
        MODEL as Parameters<Ai['run']>[0],
        {
          messages,
          max_tokens: MAX_OUT,
          temperature: 0.2,
          chat_template_kwargs: { enable_thinking: false },
        } as never,
        // Same id for every visitor: the prefix that repeats is the knowledge base, not the chat.
        { extraHeaders: { 'x-session-affinity': 'veljko-portfolio-kb' } },
      )) as AiOutput;
      // Token counts land in the Worker's logs, which is how the daily cost is watched.
      console.log('usage', JSON.stringify(out.usage ?? null));
      answer = tidy(readText(out), readFinish(out));
    } catch (err) {
      const msg = String(err);
      // 4006 is Workers AI's "daily free allocation used up".
      const quota = /4006|quota|allocation|neurons/i.test(msg);
      console.error('ai error', msg);
      return json({ error: quota ? 'quota' : 'ai' }, 503, cors);
    }
    if (!answer) return json({ error: 'ai' }, 503, cors);

    if (key) {
      ctx.waitUntil(
        cache.put(key, new Response(JSON.stringify({ answer }), { headers: { 'Cache-Control': 'public, max-age=86400' } })),
      );
    }
    return json({ answer }, 200, cors);
  },
} satisfies ExportedHandler<Env>;

type AiOutput = {
  response?: string;
  choices?: { message?: { content?: string | null }; finish_reason?: string }[];
  usage?: unknown;
};

function readText(out: AiOutput): string {
  return out.choices?.[0]?.message?.content ?? out.response ?? '';
}

function readFinish(out: AiOutput): string | undefined {
  return out.choices?.[0]?.finish_reason;
}

/** Strip whitespace and control characters, collapse runs of spaces. */
function clean(v: unknown): string {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseHistory(v: unknown): Turn[] {
  if (!Array.isArray(v)) return [];
  return v
    .slice(-MAX_HISTORY)
    .map((t) => ({ q: clean((t as Turn)?.q).slice(0, MAX_Q), a: clean((t as Turn)?.a).slice(0, 600) }))
    .filter((t) => t.q && t.a);
}

/** Questions that differ only in case, punctuation or diacritics share one cache entry. */
function cacheKey(q: string): Request {
  const norm = q
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'dj')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  return new Request(`https://chat-cache.internal/v2/${encodeURIComponent(norm)}`);
}

/**
 * The terminal prints plain text, so markdown is removed. If the model ran out of
 * room mid-sentence, the answer is cut back to its last full sentence.
 */
function tidy(text: string, finish?: string): string {
  let t = text
    .replace(/<\/?think>/g, '')
    .replace(/\*\*|__|`/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (finish === 'length') {
    const end = Math.max(t.lastIndexOf('. '), t.lastIndexOf('! '), t.lastIndexOf('? '));
    if (end > 40) t = t.slice(0, end + 1);
  }
  return t;
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': ORIGINS.has(origin) ? origin : 'https://knez4.github.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
