import { streamText } from 'ai'
import { YUSUF_SYSTEM_PROMPT } from '@/lib/commands'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { question } = await req.json()

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Question is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: YUSUF_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question.trim() }],
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('[ask route] Error:', error)
    return new Response(
      JSON.stringify({ error: "Couldn't reach the AI right now. Try a /command instead, or come back later." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
