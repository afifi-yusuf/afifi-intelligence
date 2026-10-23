'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Turn = { role: 'user' | 'assistant'; content: string; error?: boolean }

const SUGGESTIONS = [
  'What are you working on right now?',
  'What did you build at Amazon?',
  'How does Warply work?',
  'Tell me about your NeurIPS paper.',
]

export default function AskClient() {
  const searchParams = useSearchParams()
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const didRunInitial = useRef(false)

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim()
      if (!q || busy) return

      const history = [...turns.filter(t => !t.error), { role: 'user' as const, content: q }]
      setTurns([...turns, { role: 'user', content: q }, { role: 'assistant', content: '' }])
      setInput('')
      setBusy(true)

      const controller = new AbortController()
      abortRef.current = controller

      const setAnswer = (content: string, error = false) =>
        setTurns(prev => [...prev.slice(0, -1), { role: 'assistant', content, error }])

      try {
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          let msg = 'Something went wrong. Try again in a moment.'
          try {
            const data = (await res.json()) as { error?: string }
            if (data?.error) msg = data.error
          } catch {
            /* not JSON */
          }
          setAnswer(msg, true)
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let text = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          text += decoder.decode(value, { stream: true })
          setAnswer(text)
        }
        if (!text.trim()) setAnswer('No answer came back. Try rephrasing the question.', true)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setAnswer("Couldn't reach the server. Check your connection and try again.", true)
      } finally {
        setBusy(false)
        abortRef.current = null
      }
    },
    [busy, turns]
  )

  // Deep link from the home page box: /ask?q=...
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !didRunInitial.current) {
      didRunInitial.current = true
      // Drop ?q= so a refresh doesn't re-ask the question
      window.history.replaceState(null, '', '/ask')
      ask(q)
    }
  }, [searchParams, ask])

  const reset = () => {
    abortRef.current?.abort()
    setTurns([])
    setBusy(false)
    inputRef.current?.focus()
  }

  return (
    <div className="mt-8">
      {turns.length === 0 ? (
        <ul className="flex flex-wrap gap-x-3 gap-y-2 font-mono text-[12.5px]">
          {SUGGESTIONS.map(s => (
            <li key={s}>
              <button
                type="button"
                onClick={() => ask(s)}
                className="text-left text-muted hover:text-ink transition-colors cursor-pointer"
              >
                <span>[</span>
                <span className="text-link underline decoration-1 underline-offset-[0.18em] decoration-link/35">{s}</span>
                <span>]</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="space-y-6" aria-live="polite">
          {turns.map((t, i) =>
            t.role === 'user' ? (
              <li key={i} className="border-l-2 border-gold pl-3 font-medium">
                {t.content}
              </li>
            ) : (
              <li
                key={i}
                className={`whitespace-pre-wrap ${t.error ? 'text-muted italic' : 'text-ink/90'}`}
              >
                {t.content || <span className="font-mono text-[13px] text-muted">thinking…</span>}
              </li>
            )
          )}
        </ol>
      )}

      <form
        className="mt-8 flex items-end gap-3 border-b border-rule focus-within:border-muted transition-colors"
        onSubmit={e => {
          e.preventDefault()
          ask(input)
        }}
      >
        <label htmlFor="ask-input" className="sr-only">
          Your question
        </label>
        <textarea
          id="ask-input"
          ref={inputRef}
          rows={1}
          value={input}
          maxLength={2000}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              ask(input)
            }
          }}
          placeholder={turns.length ? 'Ask a follow-up…' : 'Ask me something…'}
          className="flex-1 min-w-0 resize-none bg-transparent py-2 outline-none placeholder:text-muted [field-sizing:content] max-h-40"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="shrink-0 pb-2.5 font-mono text-[13px] text-link disabled:text-muted disabled:cursor-default cursor-pointer"
        >
          {busy ? '…' : 'ask ↵'}
        </button>
      </form>

      {turns.length > 0 && (
        <button
          type="button"
          onClick={reset}
          className="mt-3 font-mono text-[12px] text-muted hover:text-ink transition-colors cursor-pointer"
        >
          clear
        </button>
      )}
    </div>
  )
}
