import Groq from 'groq-sdk'
import { YUSUF_SYSTEM_PROMPT } from '@/lib/commands'

export const maxDuration = 30

const DEFAULT_MODEL = 'openai/gpt-oss-20b'

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey?.trim()) {
    console.error('[ask route] Missing GROQ_API_KEY')
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY is not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { question } = await req.json()

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Question is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const groq = new Groq({ apiKey })
    const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL

    const stream = await groq.chat.completions.create(
      {
        model,
        messages: [
          { role: 'system', content: YUSUF_SYSTEM_PROMPT },
          { role: 'user', content: question.trim() },
        ],
        max_tokens: 500,
        temperature: 0.7,
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
      },
    })
  } catch (error) {
    console.error('[ask route] Error:', error)
    return new Response(
      JSON.stringify({
        error: "Couldn't reach the AI right now. Try a /command instead, or come back later.",
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
