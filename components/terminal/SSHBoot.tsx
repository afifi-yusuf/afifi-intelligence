'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import TerminalHeader from './TerminalHeader'

// Block-pixel font: each letter is a 5-wide x 7-tall grid
// 1 = filled, 0 = empty
const BLOCK_FONT: Record<string, number[][]> = {
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  F: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  G: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  C: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
}

const LINE1 = ['A', 'F', 'I', 'F', 'I']
const LINE2 = ['I', 'N', 'T', 'E', 'L', 'L', 'I', 'G', 'E', 'N', 'C', 'E']

const CELL_DEFAULT = 10
const GAP = 2
const LETTER_GAP_DEFAULT = 8

/** Claude Code–style stepped depth: parallel offset “echo” layers down-right */
const DEPTH_LAYERS = 4
const DEPTH_STEP = 2.25

const GREEN = '#7ee787'
const GREEN_SOFT = 'rgba(126, 231, 135, 0.22)'
const GREEN_LINE = 'rgba(126, 231, 135, 0.45)'

function BlockLetter({
  char,
  visible,
  cellSize,
}: {
  char: string
  visible: boolean
  cellSize: number
}) {
  const grid = BLOCK_FONT[char]
  if (!grid) return null

  const rows = grid.length
  const cols = grid[0].length
  const depthPad = DEPTH_LAYERS * DEPTH_STEP
  const innerW = cols * (cellSize + GAP) - GAP
  const innerH = rows * (cellSize + GAP) - GAP
  const width = innerW + depthPad
  const height = innerH + depthPad

  const cells: { x: number; y: number }[] = []
  for (let ri = 0; ri < rows; ri++) {
    for (let ci = 0; ci < cols; ci++) {
      if (grid[ri][ci]) {
        cells.push({
          x: ci * (cellSize + GAP),
          y: ri * (cellSize + GAP),
        })
      }
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="shrink-0 overflow-visible"
      style={{ transition: 'opacity 0.4s ease', opacity: visible ? 1 : 0 }}
    >
      <title>{char}</title>
      {cells.map(({ x, y }, idx) => (
        <g key={idx}>
          {Array.from({ length: DEPTH_LAYERS }, (_, layer) => {
            const d = DEPTH_LAYERS - layer
            const ox = d * DEPTH_STEP
            const oy = d * DEPTH_STEP
            const alpha = 0.05 + layer * 0.045
            return (
              <rect
                key={`depth-${layer}`}
                x={x + ox}
                y={y + oy}
                width={cellSize}
                height={cellSize}
                rx={0.5}
                fill={`rgba(126, 231, 135, ${alpha})`}
                stroke={GREEN_LINE}
                strokeWidth={0.35}
                strokeOpacity={0.35}
              />
            )
          })}
          <rect
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            rx={0.5}
            fill={GREEN}
            stroke={GREEN_SOFT}
            strokeWidth={0.5}
          />
        </g>
      ))}
    </svg>
  )
}

function BlockWord({
  chars,
  visibleCount,
  cellSize,
  letterGap,
}: {
  chars: string[]
  visibleCount: number
  cellSize: number
  letterGap: number
}) {
  return (
    <div className="flex flex-wrap items-end max-w-full" style={{ gap: `${letterGap}px` }}>
      {chars.map((ch, i) => (
        <BlockLetter key={`${ch}-${i}`} char={ch} visible={i < visibleCount} cellSize={cellSize} />
      ))}
    </div>
  )
}

/** Typing / line pacing — slightly slow for readability */
const SSH_CHAR_MS = 32
const SSH_BEFORE_TYPE_MS = 220
const SSH_AFTER_CMD_MS = 480
const SSH_LINE_STAGGER_MS = 580
const SSH_FIRST_LINE_DELAY_MS = 400
const SSH_FINAL_PAUSE_MS = 1100

/** Plays after Enter — fake SSH session, then handoff to main terminal */
const SSH_SCRIPT: { className: string; text: string }[] = [
  { className: 'text-terminal-fg', text: '$ ssh yusuf@afifi.dev' },
  { className: 'text-terminal-dim', text: 'Connecting to afifi.dev port 22 ...' },
  {
    className: 'text-terminal-dim',
    text: 'Remote protocol version 2.0, remote software version OpenSSH_9.2',
  },
  { className: 'text-terminal-dim', text: 'Authenticated to afifi.dev.' },
  { className: 'text-terminal-green', text: 'Welcome to Afifi Intelligence — session opened.' },
  {
    className: 'text-terminal-dim',
    text: 'Inference: groq-lpu · model gpt-oss-20b — /ask & free-text.',
  },
]

interface Props {
  onComplete: () => void
}

export default function SSHBoot({ onComplete }: Props) {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const q = window.matchMedia('(max-width: 640px)')
    const sync = () => setCompact(q.matches)
    sync()
    q.addEventListener('change', sync)
    return () => q.removeEventListener('change', sync)
  }, [])

  const cellSize = compact ? 5.5 : CELL_DEFAULT
  const letterGap = compact ? 4 : LETTER_GAP_DEFAULT

  const [showBanner, setShowBanner] = useState(false)
  const [line1Visible, setLine1Visible] = useState(0)
  const [line2Visible, setLine2Visible] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [waitingForEnter, setWaitingForEnter] = useState(false)
  const [fading, setFading] = useState(false)

  const [phase, setPhase] = useState<'splash' | 'ssh'>('splash')
  const [sshLines, setSshLines] = useState<string[]>([])
  const [sshPartial, setSshPartial] = useState('')

  const sshTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const exitStartedRef = useRef(false)
  /** Prevents double Enter on splash before phase flips to ssh (stale listener) */
  const splashHandoffRef = useRef(false)

  const clearSshTimers = useCallback(() => {
    sshTimersRef.current.forEach(clearTimeout)
    sshTimersRef.current = []
  }, [])

  const runExit = useCallback(() => {
    if (exitStartedRef.current) return
    exitStartedRef.current = true
    clearSshTimers()
    setFading(true)
    const id = setTimeout(() => onComplete(), 600)
    sshTimersRef.current.push(id)
  }, [clearSshTimers, onComplete])

  const pushSshTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    sshTimersRef.current.push(id)
  }, [])

  const startSshSequence = useCallback(() => {
    clearSshTimers()
    setPhase('ssh')
    setSshLines([])
    setSshPartial('')

    const fullCmd = SSH_SCRIPT[0].text
    let i = 0
    const typeNext = () => {
      i += 1
      setSshPartial(fullCmd.slice(0, i))
      if (i < fullCmd.length) {
        const id = setTimeout(typeNext, SSH_CHAR_MS)
        sshTimersRef.current.push(id)
      } else {
        pushSshTimer(() => {
          setSshLines([fullCmd])
          setSshPartial('')
          for (let j = 1; j < SSH_SCRIPT.length; j++) {
            const lineText = SSH_SCRIPT[j].text
            pushSshTimer(() => {
              setSshLines(prev => [...prev, lineText])
            }, SSH_FIRST_LINE_DELAY_MS + (j - 1) * SSH_LINE_STAGGER_MS)
          }
          const pauseAfter =
            SSH_FIRST_LINE_DELAY_MS +
            (SSH_SCRIPT.length - 1) * SSH_LINE_STAGGER_MS +
            SSH_FINAL_PAUSE_MS
          pushSshTimer(runExit, pauseAfter)
        }, SSH_AFTER_CMD_MS)
      }
    }

    pushSshTimer(typeNext, SSH_BEFORE_TYPE_MS)
  }, [clearSshTimers, pushSshTimer, runExit])

  const skipSsh = useCallback(() => {
    if (phase !== 'ssh') return
    clearSshTimers()
    setSshLines(SSH_SCRIPT.map(l => l.text))
    setSshPartial('')
    pushSshTimer(runExit, 220)
  }, [phase, clearSshTimers, pushSshTimer, runExit])

  const finishSplash = useCallback(() => {
    if (phase !== 'splash' || !waitingForEnter) return
    if (splashHandoffRef.current) return
    splashHandoffRef.current = true
    startSshSequence()
  }, [phase, waitingForEnter, startSshSequence])

  useEffect(() => {
    return () => clearSshTimers()
  }, [clearSshTimers])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setShowBanner(true), 200))

    LINE1.forEach((_, i) => {
      timers.push(setTimeout(() => setLine1Visible(i + 1), 500 + i * 80))
    })

    const line2Start = 500 + LINE1.length * 80 + 100
    LINE2.forEach((_, i) => {
      timers.push(setTimeout(() => setLine2Visible(i + 1), line2Start + i * 55))
    })

    const loginStart = line2Start + LINE2.length * 55 + 250
    timers.push(setTimeout(() => setShowLogin(true), loginStart))
    timers.push(setTimeout(() => setWaitingForEnter(true), loginStart + 200))

    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      if (phase === 'splash') finishSplash()
      else skipSsh()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, finishSplash, skipSsh])

  const handleRootClick = useCallback(() => {
    if (phase === 'splash') finishSplash()
    else skipSsh()
  }, [phase, finishSplash, skipSsh])

  return (
    <div
      className="terminal-text fixed inset-0 flex flex-col pt-[env(safe-area-inset-top)] bg-black"
      style={{
        zIndex: 50,
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
      onClick={handleRootClick}
    >
      <TerminalHeader />

      <div className="flex flex-col flex-1 px-3 py-5 sm:px-8 sm:py-8 min-h-0 overflow-x-auto text-terminal-fg justify-start">
        {phase === 'splash' && (
          <>
            <p
              className="font-mono text-[11px] sm:text-[12px] text-terminal-dim italic mb-6 sm:mb-10 leading-relaxed max-w-prose"
              style={{
                opacity: showBanner ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            >
              <span className="text-terminal-green not-italic">*</span> Afifi Intelligence — research preview
            </p>

            <div
              className="flex flex-col items-start select-none"
              style={{ gap: compact ? '10px' : '16px' }}
            >
              <BlockWord
                chars={LINE1}
                visibleCount={line1Visible}
                cellSize={cellSize}
                letterGap={letterGap}
              />
              <BlockWord
                chars={LINE2}
                visibleCount={line2Visible}
                cellSize={cellSize}
                letterGap={letterGap}
              />
            </div>

            <div
              className="font-mono text-[12px] sm:text-[13px] mt-auto pt-8 sm:pt-10 pb-[env(safe-area-inset-bottom)]"
              style={{
                color: GREEN,
                opacity: showLogin ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            >
              {waitingForEnter ? (
                <>
                  <span>{'> '}</span>
                  <span>Press </span>
                  <strong>Enter</strong>
                  <span> to connect</span>
                  <span
                    className="inline-block w-2 h-[1em] align-middle ml-1"
                    style={{
                      background: GREEN,
                      animation: 'cursor-blink 1s step-end infinite',
                    }}
                  />
                </>
              ) : (
                <span>Authenticating...</span>
              )}
            </div>
          </>
        )}

        {phase === 'ssh' && (
          <div className="font-mono text-[12px] sm:text-[13px] leading-relaxed space-y-2.5 pb-[env(safe-area-inset-bottom)] break-words">
            {sshLines.map((text, idx) => (
              <div key={`${idx}-${text.slice(0, 12)}`} className={SSH_SCRIPT[idx].className}>
                {text}
              </div>
            ))}
            {sshPartial ? (
              <div className={SSH_SCRIPT[0].className}>
                {sshPartial}
                <span
                  className="inline-block w-[6px] h-[1.1em] align-[-0.12em] ml-0.5"
                  style={{
                    background: GREEN,
                    animation: 'cursor-blink 1s step-end infinite',
                  }}
                />
              </div>
            ) : null}
            <p className="text-terminal-dim text-[11px] pt-4">Click or Enter to skip</p>
          </div>
        )}
      </div>
    </div>
  )
}
