import Groq from 'groq-sdk'
import { YUSUF_SYSTEM_PROMPT } from '@/lib/commands'

export const maxDuration = 30

const DEFAULT_MODEL = 'openai/gpt-oss-20b'
const MAX_QUESTION_CHARS = 2000

function jsonError(code: string, message: string, status: number) {
  return new Response(JSON.stringify({ error: message, code }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey?.trim()) {
    console.error('[ask route] Missing GROQ_API_KEY')
    return jsonError('SERVER_MISCONFIG', 'GROQ_API_KEY is not configured.', 500)
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return jsonError('BAD_JSON', 'Invalid JSON body.', 400)
  }

  const question =
    typeof (payload as { question?: unknown })?.question === 'string'
      ? (payload as { question: string }).question.trim()
      : ''

  if (!question) {
    return jsonError('EMPTY_QUESTION', 'Question is required.', 400)
  }

  if (question.length > MAX_QUESTION_CHARS) {
    return jsonError(
      'QUESTION_TOO_LONG',
      `Question too long (max ${MAX_QUESTION_CHARS} characters).`,
      413
    )
  }

  try {
    const groq = new Groq({ apiKey })
    const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL

    const stream = await groq.chat.completions.create(
      {
        model,
        messages: [
          { role: 'system', content: YUSUF_SYSTEM_PROMPT },
          { role: 'user', content: question },
        ],
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
    console.error('[ask route] Error:', error)
    return jsonError(
      'UPSTREAM_ERROR',
      "Couldn't reach the AI right now. Try a /command instead, or come back later.",
      502
    )
  }
}
