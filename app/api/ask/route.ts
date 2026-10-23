import Groq from 'groq-sdk'
import { ASK_SYSTEM_PROMPT } from '@/lib/ask-prompt'

export const maxDuration = 30

const DEFAULT_MODEL = 'qwen/qwen3.8-27b'
const MAX_MESSAGE_CHARS = 2000
const MAX_TURNS = 8
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 10 * 60 * 1000

const ALLOWED_ORIGINS = new Set([
  'https://yusufafifi.com',
  'https://www.yusufafifi.com',
])

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  if (ALLOWED_ORIGINS.has(origin)) return true
  if (origin.startsWith('http://localhost:')) return true
  if (origin.startsWith('http://127.0.0.1:')) return true
  if (origin.endsWith('.vercel.app')) return true
  return false
}

// Best-effort per-IP limit. State lives per serverless instance, so this caps
// bursts from one client rather than enforcing a global quota.
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return false
}

function jsonError(code: string, message: string, status: number) {
  return new Response(JSON.stringify({ error: message, code }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

type Turn = { role: 'user' | 'assistant'; content: string }

function parseMessages(body: unknown): Turn[] | null {
  const raw = (body as { messages?: unknown })?.messages
  if (!Array.isArray(raw) || raw.length === 0) return null
  const turns: Turn[] = []
  for (const m of raw.slice(-MAX_TURNS)) {
    const role = (m as Turn)?.role
    const content = (m as Turn)?.content
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    turns.push({ role, content: content.trim().slice(0, MAX_MESSAGE_CHARS) })
  }
  if (turns[turns.length - 1].role !== 'user' || !turns[turns.length - 1].content) return null
  return turns
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req.headers.get('origin'))) {
    return jsonError('FORBIDDEN_ORIGIN', 'This endpoint is only callable from yusufafifi.com.', 403)
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return jsonError('RATE_LIMITED', "That's a lot of questions. Try again in a few minutes, or just email me.", 429)
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey?.trim()) {
    console.error('[ask route] Missing GROQ_API_KEY')
    return jsonError('SERVER_MISCONFIG', 'The chat is not configured right now.', 500)
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return jsonError('BAD_JSON', 'Invalid JSON body.', 400)
  }

  const messages = parseMessages(payload)
  if (!messages) {
    return jsonError('BAD_MESSAGES', 'Expected a non-empty conversation ending with a question.', 400)
  }

  try {
    const groq = new Groq({ apiKey })
    const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL

    const stream = await groq.chat.completions.create(
      {
        model,
        messages: [{ role: 'system', content: ASK_SYSTEM_PROMPT }, ...messages],
        max_tokens: 800,
        temperature: 0.5,
        stream: true,
      },
      { signal: req.signal }
    )

    const encoder = new TextEncoder()

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const piece = chunk.choices[0]?.delta?.content ?? ''
            if (piece) controller.enqueue(encoder.encode(piece))
          }
          controller.close()
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            try {
              controller.close()
            } catch {
              /* closed */
            }
            return
          }
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    if (error instanceof Groq.APIError && error.status === 429) {
      return jsonError('UPSTREAM_BUSY', "Lots of questions right now. Try again in a minute, or just email me.", 429)
    }
    console.error('[ask route] Error:', error)
    return jsonError('UPSTREAM_ERROR', "Couldn't reach the model right now. Try again later, or email me.", 502)
  }
}
