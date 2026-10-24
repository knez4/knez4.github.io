/**
 * Client for the portfolio chat, a Cloudflare Worker (source in /chat) that answers
 * questions about Veljko from a fixed knowledge base on Workers AI.
 */
export const CHAT_URL = 'https://veljko-chat.knez4.workers.dev';
export const MAX_QUESTION = 300;

export type ChatTurn = { q: string; a: string };
export type ChatError = 'quota' | 'rate' | 'network';

/**
 * Anything that does not look like SQL or a terminal command is a question for the
 * chat. Destructive SQL stays in the terminal so it can be refused with its joke.
 */
export function isTerminalInput(raw: string): boolean {
  const q = raw.trim().toLowerCase();
  return (
    q.startsWith('\\') ||
    /^(select|with|show|table|drop|delete|truncate|update|insert|alter|create|grant)\b/.test(q) ||
    /^(help|clear|shoot)$/.test(q.replace(/;+$/, ''))
  );
}

export async function askChat(q: string, history: ChatTurn[], lang: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(CHAT_URL, {
      method: 'POST',
      // text/plain keeps this a "simple" cross-origin request: no preflight round trip.
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ q: q.slice(0, MAX_QUESTION), history: history.slice(-2), lang }),
    });
  } catch {
    throw 'network' satisfies ChatError;
  }
  if (res.status === 429) throw 'rate' satisfies ChatError;
  const data = (await res.json().catch(() => ({}))) as { answer?: string; error?: string };
  if (res.ok && data.answer) return data.answer;
  throw (data.error === 'quota' ? 'quota' : 'network') satisfies ChatError;
}
