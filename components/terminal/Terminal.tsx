'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from 'react'
import { runCommand, WELCOME_SEGMENTS, COMMAND_NAMES, OutputBlock, OutputSegment } from '@/lib/commands'
import OutputRenderer from './OutputRenderer'

const MAX_QUESTIONS = 20
const MOBILE_CHIPS = ['/about', '/projects', '/skills', '/journey', '/contact', '/experience']

function generateId() {
  return Math.random().toString(36).slice(2)
}

interface TerminalProps {
  initialCmd?: string
  initialQ?: string
}

export default function Terminal({ initialCmd, initialQ }: TerminalProps) {
  const [blocks, setBlocks] = useState<OutputBlock[]>([
    { kind: 'output', segments: WELCOME_SEGMENTS, id: 'welcome' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isStreaming, setIsStreaming] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionIndex, setSuggestionIndex] = useState(-1)
  const [statusHint, setStatusHint] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const streamingIdRef = useRef<string | null>(null)
  const didRunInitialRef = useRef(false)
  const executeInputRef = useRef<(input: string) => void>(() => {})

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [blocks, scrollToBottom])

  // Deep-link: run initial command/question after mount
  useEffect(() => {
    if (didRunInitialRef.current) return
    if (initialCmd || initialQ) {
      didRunInitialRef.current = true
      const target = initialCmd || (initialQ ? initialQ : '')
      if (target) {
        setTimeout(() => executeInputRef.current(target), 300)
      }
    }
  }, [initialCmd, initialQ])

  // Focus input on click anywhere in terminal
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  // Update autocomplete suggestions
  useEffect(() => {
    if (input.startsWith('/') && input.length > 1) {
      const partial = input.slice(1).toLowerCase()
      const matches = COMMAND_NAMES.filter(c => c.startsWith(partial))
      setSuggestions(matches)
      setSuggestionIndex(-1)
    } else {
      setSuggestions([])
      setSuggestionIndex(-1)
    }
  }, [input])

  const pushOutput = useCallback((segments: OutputSegment[]) => {
    setBlocks(prev => [...prev, { kind: 'output', segments, id: generateId() }])
  }, [])

  const pushUserInput = useCallback((text: string) => {
    setBlocks(prev => [...prev, { kind: 'user', text, id: generateId() }])
  }, [])

  const handleCommandClick = useCallback((cmd: string) => {
    setInput('')
    executeInput(cmd)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const executeInput = useCallback(
    async (rawInput: string) => {
      const trimmed = rawInput.trim()
      if (!trimmed) return

      setStatusHint(false)
      pushUserInput(trimmed)
      setHistory(h => [trimmed, ...h.slice(0, 99)])
      setHistoryIndex(-1)
      setInput('')
      setSuggestions([])

      // /clear
      if (trimmed === '/clear' || trimmed === '/clear ') {
        setBlocks([])
        return
      }

      // Slash command
      if (trimmed.startsWith('/') && !trimmed.startsWith('/ask ')) {
        const result = runCommand(trimmed)
        if (result !== null) {
          pushOutput(result)
          return
        }
        // /ask <question> — fall through to streaming
      }

      // Free-text or /ask
      const question = trimmed.startsWith('/ask ')
        ? trimmed.slice(5).trim()
        : trimmed.startsWith('/ask')
        ? ''
        : trimmed

      if (!question) {
        pushOutput([{ type: 'error', text: 'Usage: /ask <your question>' }])
        return
      }

      if (questionCount >= MAX_QUESTIONS) {
        pushOutput([
          {
            type: 'text',
            text: "You've been curious — I appreciate that. For longer conversations, reach out directly:",
          },
          { type: 'blank' },
          { type: 'link', text: 'yusuf@yusufafifi.com', href: 'mailto:yusuf@yusufafifi.com' },
        ])
        return
      }

      setQuestionCount(q => q + 1)
      setIsStreaming(true)

      const thinkingId = generateId()
      setBlocks(prev => [...prev, { kind: 'thinking', id: thinkingId }])

      const streamId = generateId()
      streamingIdRef.current = streamId

      try {
        abortRef.current = new AbortController()
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) {
          throw new Error('API error')
        }

        // Remove thinking block, add streaming block
        setBlocks(prev => [
          ...prev.filter(b => b.id !== thinkingId),
          { kind: 'streaming', text: '', id: streamId },
        ])

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          accumulated += chunk
          const currentText = accumulated
          setBlocks(prev =>
            prev.map(b =>
              b.id === streamId && b.kind === 'streaming'
                ? { ...b, text: currentText }
                : b
            )
          )
          scrollToBottom()
        }

        setBlocks(prev =>
          prev.map(b =>
            b.id === streamId && b.kind === 'streaming'
              ? { ...b, done: true }
              : b
          )
        )
      } catch (err: unknown) {
        setBlocks(prev => prev.filter(b => b.id !== thinkingId && b.id !== streamId))
        if (err instanceof Error && err.name === 'AbortError') {
          setBlocks(prev =>
            prev.map(b =>
              b.id === streamId && b.kind === 'streaming'
                ? { ...b, text: b.kind === 'streaming' ? b.text + ' [interrupted]' : '[interrupted]', done: true }
                : b
            )
          )
        } else {
          pushOutput([
            {
              type: 'error',
              text: "Couldn't reach the AI right now. Try a /command instead, or come back later.",
            },
          ])
        }
      } finally {
        setIsStreaming(false)
        streamingIdRef.current = null
        abortRef.current = null
      }
    },
    [pushOutput, pushUserInput, questionCount, scrollToBottom]
  )

  // Keep ref in sync so deep-link effect can call latest version
  useEffect(() => {
    executeInputRef.current = executeInput
  }, [executeInput])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      // Submit
      if (e.key === 'Enter') {
        e.preventDefault()
        if (suggestions.length > 0 && suggestionIndex >= 0) {
          setInput('/' + suggestions[suggestionIndex])
          setSuggestions([])
          setSuggestionIndex(-1)
          return
        }
        if (isStreaming) return
        executeInput(input)
        return
      }

      // Cancel stream
      if (e.key === 'Escape') {
        if (isStreaming && abortRef.current) {
          abortRef.current.abort()
        }
        setSuggestions([])
        setSuggestionIndex(-1)
        return
      }

      // Tab completion
      if (e.key === 'Tab') {
        e.preventDefault()
        if (suggestions.length === 0) return
        if (suggestions.length === 1) {
          setInput('/' + suggestions[0])
          setSuggestions([])
          return
        }
        const next = (suggestionIndex + 1) % suggestions.length
        setSuggestionIndex(next)
        setInput('/' + suggestions[next])
        return
      }

      // History navigation
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (history.length === 0) return
        const newIndex = Math.min(historyIndex + 1, history.length - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (historyIndex <= 0) {
          setHistoryIndex(-1)
          setInput('')
          return
        }
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
        return
      }

      // Ctrl+L to clear
      if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault()
        setBlocks([])
        return
      }

      // Ctrl+C to cancel stream
      if (e.key === 'c' && e.ctrlKey) {
        if (isStreaming && abortRef.current) {
          abortRef.current.abort()
        }
        return
      }
    },
    [executeInput, history, historyIndex, input, isStreaming, suggestions, suggestionIndex]
  )

  return (
    <div
      className="flex flex-col h-screen bg-terminal-bg overflow-hidden terminal-selection"
      onClick={focusInput}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 shrink-0 border-b"
        style={{
          height: '36px',
          background: 'var(--terminal-surface)',
          borderColor: 'var(--terminal-border)',
        }}
      >
        <span className="font-mono text-[12px] text-terminal-dim tracking-wide">
          yusuf afifi
        </span>
        <span className="font-mono text-[12px] text-terminal-dim">
          afifi-intelligence v1.0.0
        </span>
      </header>

      {/* Terminal body */}
      <main
        ref={outputRef}
        className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth terminal-scrollbar"
        aria-live="polite"
        aria-label="Terminal output"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {blocks.map(block => {
            if (block.kind === 'user') {
              return (
                <div key={block.id} className="flex items-start gap-2">
                  <span className="text-terminal-accent font-mono text-[14px] shrink-0 mt-0.5">{'>'}</span>
                  <span className="font-mono text-[14px] text-terminal-fg">{block.text}</span>
                </div>
              )
            }
            if (block.kind === 'output') {
              return (
                <div key={block.id} className="pl-4 border-l-2 border-transparent">
                  <OutputRenderer
                    segments={block.segments}
                    onCommandClick={handleCommandClick}
                  />
                </div>
              )
            }
            if (block.kind === 'thinking') {
              return (
                <div key={block.id} className="pl-4">
                  <ThinkingIndicator />
                </div>
              )
            }
            if (block.kind === 'streaming') {
              return (
                <div key={block.id} className="pl-4">
                  <StreamingText text={block.text} done={block.done} />
                </div>
              )
            }
            if (block.kind === 'system') {
              return (
                <div key={block.id} className="pl-4">
                  <span className="font-mono text-[13px] text-terminal-dim italic">{block.text}</span>
                </div>
              )
            }
            return null
          })}
        </div>
        {/* Bottom padding so last output isn't flush with input */}
        <div className="h-4" />
      </main>

      {/* Mobile command chips */}
      <div
        className="md:hidden flex gap-2 overflow-x-auto px-4 py-2 shrink-0 border-t"
        style={{ borderColor: 'var(--terminal-border)', background: 'var(--terminal-bg)' }}
      >
        {MOBILE_CHIPS.map(chip => (
          <button
            key={chip}
            onClick={(e) => {
              e.stopPropagation()
              executeInput(chip)
            }}
            className="shrink-0 px-3 py-1.5 rounded font-mono text-[12px] text-terminal-accent border transition-colors hover:bg-terminal-surface min-h-[36px]"
            style={{ borderColor: 'var(--terminal-border)' }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div
        className="shrink-0 border-t"
        style={{ borderColor: 'var(--terminal-border)' }}
      >
        {/* Autocomplete suggestions */}
        {suggestions.length > 1 && (
          <div
            className="px-6 py-2 flex gap-3 flex-wrap border-b"
            style={{ borderColor: 'var(--terminal-border)', background: 'var(--terminal-surface)' }}
          >
            {suggestions.map((s, i) => (
              <span
                key={s}
                className={`font-mono text-[12px] transition-colors cursor-pointer ${
                  i === suggestionIndex ? 'text-terminal-accent' : 'text-terminal-dim'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setInput('/' + s)
                  setSuggestions([])
                  inputRef.current?.focus()
                }}
              >
                /{s}
              </span>
            ))}
          </div>
        )}

        <div
          className="flex items-center gap-3 px-6 py-3 bg-terminal-bg"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-mono text-[14px] text-terminal-accent shrink-0">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal input"
            placeholder={isStreaming ? '' : undefined}
            className="flex-1 bg-transparent border-none outline-none font-mono text-[14px] text-terminal-fg caret-terminal-accent placeholder:text-terminal-dim"
            style={{ caretColor: 'var(--terminal-accent)' }}
          />
          {isStreaming && (
            <span className="font-mono text-[12px] text-terminal-dim animate-pulse shrink-0">
              streaming...
            </span>
          )}
        </div>
      </div>

      {/* Status bar */}
      <footer
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          height: '24px',
          background: 'var(--terminal-surface)',
          borderTop: '1px solid var(--terminal-border)',
        }}
      >
        <span className="font-mono text-[11px] text-terminal-dim">
          {isStreaming ? 'streaming — esc to interrupt' : 'ready'}
        </span>
        {statusHint && (
          <span className="font-mono text-[11px] text-terminal-dim">
            type /help for commands
          </span>
        )}
      </footer>
    </div>
  )
}

function ThinkingIndicator() {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '.' : d + '.'))
    }, 400)
    return () => clearInterval(interval)
  }, [])
  return (
    <span className="font-mono text-[14px] text-terminal-dim italic">
      thinking{dots}
    </span>
  )
}

function StreamingText({ text, done }: { text: string; done?: boolean }) {
  return (
    <div className="font-mono text-[14px] text-terminal-fg leading-relaxed whitespace-pre-wrap">
      {text}
      {!done && (
        <span
          className="inline-block w-[8px] h-[1em] bg-terminal-accent align-middle ml-0.5 animate-pulse"
          style={{ animationDuration: '1s' }}
        />
      )}
    </div>
  )
}
