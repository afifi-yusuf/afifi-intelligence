'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  KeyboardEvent,
} from 'react'
import {
  runCommand,
  WELCOME_SEGMENTS,
  COMPLETION_COMMAND_NAMES,
  OutputBlock,
  OutputSegment,
} from '@/lib/commands'
import OutputRenderer from './OutputRenderer'
import TerminalHeader from './TerminalHeader'

const MAX_QUESTIONS = 20
const MOBILE_CHIPS = ['/help', '/about', '/projects', '/skills', '/journey', '/contact', '/experience']

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
  /** Sync guard — isStreaming lags one frame; blocks double-Enter races on /api/ask */
  const streamingLockRef = useRef(false)
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

  // Slash-command completions: `/` lists all; `/pre` filters; stops at first space (first token only)
  useEffect(() => {
    if (isStreaming || !input.startsWith('/') || input.slice(1).includes(' ')) {
      setSuggestions([])
      setSuggestionIndex(-1)
      return
    }
    const typed = input.length <= 1 ? '' : input.slice(1).toLowerCase()
    const matches =
      typed === ''
        ? COMPLETION_COMMAND_NAMES
        : COMPLETION_COMMAND_NAMES.filter(c => c.startsWith(typed))
    setSuggestions(matches)
    setSuggestionIndex(-1)
  }, [input, isStreaming])

  const ghostSuffix = useMemo(() => {
    if (isStreaming || suggestions.length === 0) return ''
    if (!input.startsWith('/') || input.slice(1).includes(' ')) return ''
    const typed = input.length <= 1 ? '' : input.slice(1).toLowerCase()
    if (typed === '' && suggestions.length > 1) return ''
    const active =
      suggestionIndex >= 0 ? suggestions[suggestionIndex]! : suggestions[0]!
    if (!active.startsWith(typed)) return ''
    return active.slice(typed.length)
  }, [input, suggestions, suggestionIndex, isStreaming])

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
      setInput('')
      setSuggestions([])

      // /clear
      if (trimmed === '/clear' || trimmed === '/clear ') {
        pushUserInput(trimmed)
        setHistory(h => [trimmed, ...h.slice(0, 99)])
        setHistoryIndex(-1)
        setBlocks([])
        return
      }

      // Slash command
      if (trimmed.startsWith('/') && !trimmed.startsWith('/ask ')) {
        const result = runCommand(trimmed)
        if (result !== null) {
          pushUserInput(trimmed)
          setHistory(h => [trimmed, ...h.slice(0, 99)])
          setHistoryIndex(-1)
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
        pushUserInput(trimmed)
        setHistory(h => [trimmed, ...h.slice(0, 99)])
        setHistoryIndex(-1)
        pushOutput([{ type: 'error', text: 'Usage: /ask <your question>' }])
        return
      }

      if (questionCount >= MAX_QUESTIONS) {
        pushUserInput(trimmed)
        setHistory(h => [trimmed, ...h.slice(0, 99)])
        setHistoryIndex(-1)
        pushOutput([
          {
            type: 'text',
            text: "You've been curious — I appreciate that. For longer conversations, reach out directly:",
          },
          { type: 'blank' },
          { type: 'link', text: 'yusuf.afifi@gmail.com', href: 'mailto:yusuf.afifi@gmail.com' },
        ])
        return
      }

      if (streamingLockRef.current) {
        return
      }
      streamingLockRef.current = true

      pushUserInput(trimmed)
      setHistory(h => [trimmed, ...h.slice(0, 99)])
      setHistoryIndex(-1)
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

        if (!accumulated.trim()) {
          setBlocks(prev =>
            prev.map(b =>
              b.id === streamId && b.kind === 'streaming'
                ? {
                    ...b,
                    text: '(empty response — try again or use a /command)',
                    done: true,
                  }
                : b
            )
          )
        } else {
          setBlocks(prev =>
            prev.map(b =>
              b.id === streamId && b.kind === 'streaming'
                ? { ...b, done: true }
                : b
            )
          )
        }
      } catch (err: unknown) {
        const aborted = err instanceof Error && err.name === 'AbortError'
        setBlocks(prev => {
          const hasStream = prev.some(b => b.id === streamId && b.kind === 'streaming')
          if (aborted) {
            if (hasStream) {
              return prev.map(b =>
                b.id === streamId && b.kind === 'streaming'
                  ? {
                      ...b,
                      text: (b.text || '') + (b.text ? ' ' : '') + '[interrupted]',
                      done: true,
                    }
                  : b
              )
            }
            return prev.filter(b => b.id !== thinkingId)
          }
          return prev.filter(b => b.id !== thinkingId && b.id !== streamId)
        })
        if (!aborted) {
          pushOutput([
            {
              type: 'error',
              text: "Couldn't reach the AI right now. Try a /command instead, or come back later.",
            },
          ])
        }
      } finally {
        streamingLockRef.current = false
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
        if (e.nativeEvent.isComposing) return
        if (e.repeat) return
        if (suggestions.length > 0 && suggestionIndex >= 0) {
          setInput('/' + suggestions[suggestionIndex])
          setSuggestions([])
          setSuggestionIndex(-1)
          return
        }
        const line = (inputRef.current?.value ?? input).trim()
        if (!line) return
        if (isStreaming || streamingLockRef.current) return
        executeInput(line)
        return
      }

      // Cancel stream
      if (e.key === 'Escape') {
        if ((isStreaming || streamingLockRef.current) && abortRef.current) {
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

      // Accept inline ghost (fish/zsh-style)
      if (e.key === 'ArrowRight' && ghostSuffix) {
        e.preventDefault()
        const typed = input.length <= 1 ? '' : input.slice(1).toLowerCase()
        const active =
          suggestionIndex >= 0 ? suggestions[suggestionIndex]! : suggestions[0]!
        if (active.startsWith(typed)) {
          setInput('/' + active)
          if (suggestions.length <= 1) setSuggestions([])
        }
        return
      }

      // Cycle completions when menu is open; otherwise command history
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (suggestions.length > 0) {
          setSuggestionIndex(i =>
            i <= 0 ? suggestions.length - 1 : i - 1
          )
          return
        }
        if (history.length === 0) return
        const newIndex = Math.min(historyIndex + 1, history.length - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (suggestions.length > 0) {
          setSuggestionIndex(i =>
            i >= suggestions.length - 1 ? 0 : i + 1
          )
          return
        }
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
        if ((isStreaming || streamingLockRef.current) && abortRef.current) {
          abortRef.current.abort()
        }
        return
      }
    },
    [
      executeInput,
      ghostSuffix,
      history,
      historyIndex,
      input,
      isStreaming,
      suggestions,
      suggestionIndex,
    ]
  )

  return (
    <div
      className="terminal-text flex flex-col h-dvh min-h-0 bg-terminal-bg overflow-hidden terminal-selection pt-[env(safe-area-inset-top)]"
      onClick={focusInput}
    >
      <TerminalHeader />

      {/* Terminal body */}
      <main
        ref={outputRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-2 sm:px-4 sm:py-3 scroll-smooth terminal-scrollbar"
        aria-live="polite"
        aria-label="Terminal output"
      >
        <div className="w-full max-w-none space-y-1.5 sm:space-y-2">
          {blocks.map(block => {
            if (block.kind === 'user') {
              return (
                <div key={block.id} className="flex items-start gap-2">
                  <span className="text-terminal-accent font-mono text-[13px] sm:text-[14px] shrink-0 mt-0.5">{'>'}</span>
                  <span className="font-mono text-[13px] sm:text-[14px] text-terminal-fg break-words min-w-0">{block.text}</span>
                </div>
              )
            }
            if (block.kind === 'output') {
              return (
                <div key={block.id} className="pl-1 sm:pl-2 border-l-2 border-transparent">
                  <OutputRenderer
                    segments={block.segments}
                    onCommandClick={handleCommandClick}
                  />
                </div>
              )
            }
            if (block.kind === 'thinking') {
              return (
                <div key={block.id} className="pl-1 sm:pl-2">
                  <ThinkingIndicator />
                </div>
              )
            }
            if (block.kind === 'streaming') {
              return (
                <div key={block.id} className="pl-1 sm:pl-2">
                  <StreamingText text={block.text} done={block.done} />
                </div>
              )
            }
            if (block.kind === 'system') {
              return (
                <div key={block.id} className="pl-1 sm:pl-2">
                  <span className="font-mono text-[12px] sm:text-[13px] text-terminal-dim italic">{block.text}</span>
                </div>
              )
            }
            return null
          })}
        </div>
        {/* Bottom padding so last output isn't flush with input */}
        <div className="h-2" />
      </main>

      {/* Mobile command chips */}
      <div
        className="md:hidden flex gap-2 overflow-x-auto px-3 py-2 shrink-0 border-t"
        style={{ borderColor: 'var(--terminal-border)', background: 'var(--terminal-bg)' }}
      >
        {MOBILE_CHIPS.map(chip => (
          <button
            key={chip}
            type="button"
            disabled={isStreaming}
            onClick={(e) => {
              e.stopPropagation()
              if (isStreaming) return
              executeInput(chip)
            }}
            className="shrink-0 px-2.5 py-1.5 rounded font-mono text-[11px] text-terminal-accent border transition-colors hover:bg-terminal-surface min-h-[36px] touch-manipulation disabled:opacity-40 disabled:pointer-events-none"
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
        {/* Autocomplete — Tab / ↑↓ / click; ghost hint in input row */}
        {suggestions.length > 0 && (
          <div
            className="px-3 sm:px-4 py-1.5 flex gap-2 sm:gap-3 flex-wrap border-b max-h-[8.5rem] overflow-y-auto terminal-scrollbar"
            style={{ borderColor: 'var(--terminal-border)', background: 'var(--terminal-surface)' }}
          >
            {suggestions.map((s, i) => {
              const highlighted =
                suggestionIndex >= 0
                  ? suggestionIndex
                  : suggestions.length === 1
                    ? 0
                    : -1
              const isHi = i === highlighted
              return (
              <span
                key={s}
                role="option"
                aria-selected={isHi}
                className={`font-mono text-[12px] transition-colors cursor-pointer ${
                  isHi ? 'text-terminal-accent' : 'text-terminal-dim'
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
              )
            })}
          </div>
        )}

        <div
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-terminal-bg"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-mono text-[16px] sm:text-[14px] text-terminal-accent shrink-0">{'>'}</span>
          <div className="relative flex-1 min-w-0 min-h-[1.35em] flex items-center">
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
              aria-autocomplete={suggestions.length > 0 ? 'list' : undefined}
              aria-expanded={suggestions.length > 0}
              placeholder={isStreaming ? '' : undefined}
              className={`absolute inset-0 w-full bg-transparent border-none outline-none font-mono text-[16px] sm:text-[14px] caret-terminal-accent placeholder:text-terminal-dim ${
                ghostSuffix ? 'text-transparent' : 'text-terminal-fg'
              }`}
              style={{ caretColor: 'var(--terminal-accent)' }}
            />
            {ghostSuffix ? (
              <div
                className="pointer-events-none absolute inset-0 flex items-center font-mono text-[16px] sm:text-[14px] min-w-0 overflow-hidden whitespace-pre"
                aria-hidden
              >
                <span className="text-terminal-fg shrink-0">{input}</span>
                <span className="text-terminal-dim opacity-60 shrink-0">{ghostSuffix}</span>
              </div>
            ) : null}
          </div>
          {isStreaming && (
            <span className="font-mono text-[12px] text-terminal-dim animate-pulse shrink-0">
              streaming...
            </span>
          )}
        </div>
      </div>

      {/* Status bar */}
      <footer
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2 px-3 sm:px-4 shrink-0 py-1.5 sm:py-1 min-h-[28px] sm:min-h-[24px]"
        style={{
          background: 'var(--terminal-surface)',
          borderTop: '1px solid var(--terminal-border)',
          paddingBottom: 'max(4px, env(safe-area-inset-bottom))',
        }}
      >
        <span className="font-mono text-[10px] sm:text-[11px] text-terminal-dim truncate min-w-0">
          {isStreaming ? 'streaming — esc to interrupt' : 'ready'}
        </span>
        <div className="font-mono text-[9px] sm:text-[10px] text-terminal-dim text-left sm:text-right leading-snug sm:truncate sm:min-w-0 sm:max-w-[70%]">
          {statusHint && <span className="opacity-90">type /help for commands · </span>}
          <span className="opacity-75">/model gpt-oss-20b</span>
          <span className="opacity-50 mx-1">·</span>
          <span className="opacity-75">/inference groq-lpu</span>
        </div>
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
    <div className="font-mono text-[13px] sm:text-[14px] text-terminal-fg leading-snug whitespace-pre-wrap break-words">
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
