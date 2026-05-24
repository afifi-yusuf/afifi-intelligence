'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import AfifiAvatar from './AfifiAvatar'

const CURRENT_LINES = [
  {
    label: 'engineering',
    text: 'systems & ai — gpu kernels, inference, disaggregated serving on accelerators.',
  },
  {
    label: 'research',
    text: 'rl scaling, rlvr — agi-complete world models.',
  },
  {
    label: 'also',
    text: 'agentic systems, rl environments, browser/desktop agents.',
  },
] as const

interface TryItem {
  label: string
  command: string
  hint?: string
}

const TRY: TryItem[] = [
  { label: '/about', command: '/about', hint: 'who I am' },
  { label: '/projects', command: '/projects', hint: 'selected work' },
  { label: '/ask <q>', command: '/ask', hint: 'ai-powered q&a' },
  { label: '/skills', command: '/skills', hint: 'switch ai persona' },
]

/** Lab commands rendered as a single row of chips. */
const LAB: TryItem[] = [
  { label: '/gpu', command: '/gpu' },
  { label: '/nvtop', command: '/nvtop' },
  { label: '/rollout', command: '/rollout' },
]

interface Props {
  onCommandClick: (cmd: string) => void
}

export default function WelcomeBlock({ onCommandClick }: Props) {
  const [returning, setReturning] = useState(false)

  useEffect(() => {
    try {
      const key = 'afifi:visits'
      const n = parseInt(localStorage.getItem(key) ?? '0', 10) || 0
      if (n > 0) setReturning(true)
      localStorage.setItem(key, String(n + 1))
    } catch {
      /* localStorage blocked — silent */
    }
  }, [])

  return (
    <div className="font-mono">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Panel title="afifi-intelligence v1.0.0">
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-3 sm:gap-4">
              <AfifiAvatar size={72} className="shrink-0" />
              <div className="text-[12px] sm:text-[13px] leading-relaxed min-w-0">
                <div className="text-terminal-green truncate">yusuf afifi</div>
                <div className="text-terminal-dim truncate">cs · swe/ai engineering</div>
                <div className="text-terminal-dim mt-1.5 truncate">groq · gpt-oss-20b</div>
                <div className="text-terminal-dim truncate">london · ucl</div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Current">
          <ul className="text-[12px] sm:text-[13px] leading-snug space-y-2.5">
            {CURRENT_LINES.map(({ label, text }) => (
              <li key={label}>
                <div className="text-terminal-green">{label}</div>
                <div className="text-terminal-fg break-words mt-0.5">{text}</div>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2 text-[12px] sm:text-[13px] text-terminal-dim italic opacity-80 pl-1">
            ...{' '}
            <button
              type="button"
              onClick={() => onCommandClick('/now')}
              className="text-terminal-accent underline hover:text-terminal-link transition-colors cursor-pointer not-italic"
            >
              /now
            </button>{' '}
            for more
          </div>
        </Panel>

        <Panel
          title={
            <>
              GPU · 8x H100{' '}
              <span className="text-terminal-dim">(demo)</span>
            </>
          }
        >
          <MiniGpuPanel onCommandClick={onCommandClick} />
        </Panel>

        <Panel title="Try">
          <ul className="text-[12px] sm:text-[13px] leading-snug space-y-1">
            {TRY.map((t, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <button
                  type="button"
                  onClick={() => onCommandClick(t.command)}
                  aria-label={`Run command ${t.command}`}
                  className="text-terminal-accent underline hover:text-terminal-link transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent focus-visible:ring-offset-1 focus-visible:ring-offset-terminal-bg rounded-sm"
                >
                  {t.label}
                </button>
                {t.hint && <span className="text-terminal-dim">{t.hint}</span>}
              </li>
            ))}
            <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {LAB.map((t, i) => (
                  <span key={i} className="flex items-baseline">
                    <button
                      type="button"
                      onClick={() => onCommandClick(t.command)}
                      aria-label={`Run command ${t.command}`}
                      className="text-terminal-accent underline hover:text-terminal-link transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent focus-visible:ring-offset-1 focus-visible:ring-offset-terminal-bg rounded-sm"
                    >
                      {t.label}
                    </button>
                    {i < LAB.length - 1 && (
                      <span className="text-terminal-dim ml-2" aria-hidden="true">·</span>
                    )}
                  </span>
                ))}
              </span>
              <span className="text-terminal-dim">lab demos</span>
            </li>
          </ul>
          <div className="mt-auto pt-2 text-[12px] sm:text-[13px] text-terminal-dim italic opacity-80 pl-1">
            ...{' '}
            <button
              type="button"
              onClick={() => onCommandClick('/help')}
              className="text-terminal-accent underline hover:text-terminal-link transition-colors cursor-pointer not-italic"
            >
              /help
            </button>{' '}
            for everything
          </div>
        </Panel>
      </div>

      <div className="mt-3 sm:mt-4 text-[12px] sm:text-[13px] text-terminal-dim flex items-baseline gap-2 flex-wrap">
        <span className="text-terminal-accent" aria-hidden="true">{'>'}</span>
        <span>
          {returning ? 'welcome back.' : 'welcome.'} type a command or just ask anything.
        </span>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div
      className="relative rounded-md p-3 sm:p-4 min-w-0 h-full flex flex-col"
      style={{ border: '1px dashed var(--terminal-dim)' }}
    >
      <span
        className="absolute -top-2 left-3 px-1.5 text-[10px] sm:text-[11px] font-mono text-terminal-green"
        style={{ background: 'var(--terminal-bg)' }}
      >
        {title}
      </span>
      {children}
    </div>
  )
}

const MINI_GPU_COUNT = 4
const MINI_GPU_BASE = [78, 91, 64, 72]

function MiniGpuPanel({ onCommandClick }: { onCommandClick: (cmd: string) => void }) {
  const [utils, setUtils] = useState<number[]>(MINI_GPU_BASE)
  const reduceMotionRef = useRef(false)

  useEffect(() => {
    try {
      reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* ignore */
    }
    if (reduceMotionRef.current) return

    const id = window.setInterval(() => {
      setUtils(prev =>
        prev.map((u, i) => {
          const delta = (Math.random() - 0.5) * 14
          const target = MINI_GPU_BASE[i] + (Math.random() - 0.5) * 18
          const next = u + delta * 0.6 + (target - u) * 0.25
          return Math.max(28, Math.min(98, next))
        })
      )
    }, 1100)
    return () => window.clearInterval(id)
  }, [])

  const avg = Math.round(utils.reduce((a, b) => a + b, 0) / utils.length)

  return (
    <>
      <ul className="text-[12px] sm:text-[13px] leading-snug space-y-1.5">
        {utils.map((u, i) => (
          <li key={i} className="flex items-center gap-2 sm:gap-3">
            <span
              className="text-terminal-dim shrink-0 tabular-nums"
              style={{ width: '2.6em' }}
            >
              gpu{i}
            </span>
            <div
              className="flex-1 h-1.5 rounded-sm overflow-hidden min-w-0"
              style={{ background: 'var(--terminal-surface)' }}
              role="presentation"
            >
              <div
                className="h-full"
                style={{
                  width: `${u}%`,
                  background: 'var(--terminal-green)',
                  transition: reduceMotionRef.current
                    ? 'none'
                    : 'width 1000ms ease-out',
                }}
              />
            </div>
            <span
              className="text-terminal-fg shrink-0 tabular-nums text-right"
              style={{ width: '2.8em' }}
            >
              {Math.round(u)}%
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-2 flex items-center justify-between gap-2 text-[11px] sm:text-[12px] text-terminal-dim">
        <span className="tabular-nums">
          avg <span className="text-terminal-fg">{avg}%</span> · 4 of 8
        </span>
        <span className="italic opacity-80">
          ...{' '}
          <button
            type="button"
            onClick={() => onCommandClick('/nvtop')}
            className="text-terminal-accent underline hover:text-terminal-link transition-colors cursor-pointer not-italic"
          >
            /nvtop
          </button>{' '}
          for all 8
        </span>
      </div>
    </>
  )
}
