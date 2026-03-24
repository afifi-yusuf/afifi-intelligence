'use client'

import { useEffect, useState, useCallback } from 'react'

// Block-pixel font: each letter is a 5-wide x 7-tall grid
// 1 = filled, 0 = empty
const BLOCK_FONT: Record<string, number[][]> = {
  A: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  F: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  I: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  N: [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  T: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  L: [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  G: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  C: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
}

// "AFIFI" on line 1, "INTELLIGENCE" on line 2
const LINE1 = ['A','F','I','F','I']
const LINE2 = ['I','N','T','E','L','L','I','G','E','N','C','E']

const CELL_DEFAULT = 10
const GAP = 2
const LETTER_GAP_DEFAULT = 10

const GREEN = '#7ee787'
const GREEN_DIM = 'rgba(126, 231, 135, 0.14)'

function BlockLetter({ char, visible, cell }: { char: string; visible: boolean; cell: number }) {
  const grid = BLOCK_FONT[char]
  if (!grid) return null

  const rows = grid.length
  const cols = grid[0].length
  const width = cols * (cell + GAP) - GAP
  const height = rows * (cell + GAP) - GAP

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ transition: 'opacity 0.4s ease', opacity: visible ? 1 : 0 }}
    >
      {grid.map((row, ri) =>
        row.map((cell, ci) =>
          cell ? (
            <rect
              key={`${ri}-${ci}`}
              x={ci * (cell + GAP)}
              y={ri * (cell + GAP)}
              width={cell}
              height={cell}
              rx={1}
              fill={GREEN}
            />
          ) : null
        )
      )}
    </svg>
  )
}

function BlockWord({
  chars,
  visibleCount,
  cell,
  letterGap,
}: {
  chars: string[]
  visibleCount: number
  cell: number
  letterGap: number
}) {
  return (
    <div className="flex flex-wrap max-w-full" style={{ gap: `${letterGap}px` }}>
      {chars.map((ch, i) => (
        <BlockLetter key={`${ch}-${i}`} char={ch} visible={i < visibleCount} cell={cell} />
      ))}
    </div>
  )
}

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

  const cell = compact ? 6 : CELL_DEFAULT
  const letterGap = compact ? 5 : LETTER_GAP_DEFAULT

  const [showBanner, setShowBanner] = useState(false)
  const [line1Visible, setLine1Visible] = useState(0)
  const [line2Visible, setLine2Visible] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [waitingForEnter, setWaitingForEnter] = useState(false)
  const [fading, setFading] = useState(false)

  const proceed = useCallback(() => {
    if (!waitingForEnter) return
    setFading(true)
    setTimeout(onComplete, 600)
  }, [waitingForEnter, onComplete])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Banner appears
    timers.push(setTimeout(() => setShowBanner(true), 200))

    // Animate AFIFI letter-by-letter
    LINE1.forEach((_, i) => {
      timers.push(setTimeout(() => setLine1Visible(i + 1), 500 + i * 80))
    })

    // Animate INTELLIGENCE letter-by-letter after AFIFI
    const line2Start = 500 + LINE1.length * 80 + 100
    LINE2.forEach((_, i) => {
      timers.push(setTimeout(() => setLine2Visible(i + 1), line2Start + i * 55))
    })

    // Login line appears after all letters
    const loginStart = line2Start + LINE2.length * 55 + 250
    timers.push(setTimeout(() => setShowLogin(true), loginStart))
    timers.push(setTimeout(() => setWaitingForEnter(true), loginStart + 200))

    return () => timers.forEach(clearTimeout)
  }, [])

  // Keyboard: Enter or Space to continue
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') proceed()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [proceed])

  return (
    <div
      className="fixed inset-0 flex flex-col pt-[env(safe-area-inset-top)]"
      style={{
        background: '#0a0a0a',
        zIndex: 50,
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
      onClick={proceed}
    >
      {/* macOS window chrome */}
      <div
        className="flex items-center shrink-0 px-4"
        style={{ height: '40px', background: '#2a2a2a', borderBottom: '1px solid #333' }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <span
          className="absolute left-1/2 -translate-x-1/2 font-mono text-[12px]"
          style={{ color: '#6e6e6e' }}
        >
          afifi-intelligence — ssh yusuf@afifi.dev
        </span>
      </div>

      {/* Terminal body */}
      <div
        className="flex flex-col flex-1 px-4 py-4 sm:px-8 sm:py-6 min-h-0 overflow-x-auto"
        style={{ color: '#e6e6e6' }}
      >
        {/* Welcome banner */}
        <div
          className="font-mono text-[12px] sm:text-[13px] mb-4 sm:mb-8 px-3 py-2 border inline-flex flex-wrap items-center gap-x-2 gap-y-1 max-w-full"
          style={{
            borderColor: GREEN,
            color: GREEN,
            background: GREEN_DIM,
            opacity: showBanner ? 1 : 0,
            transition: 'opacity 0.5s ease',
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ color: GREEN }}>*</span>
          <span>Welcome to the </span>
          <strong>Afifi Intelligence</strong>
          <span> research preview!</span>
        </div>

        {/* Big block letters */}
        <div className="flex flex-col min-h-0" style={{ gap: compact ? '12px' : '20px', flex: 1 }}>
          <BlockWord chars={LINE1} visibleCount={line1Visible} cell={cell} letterGap={letterGap} />
          <BlockWord chars={LINE2} visibleCount={line2Visible} cell={cell} letterGap={letterGap} />
        </div>

        {/* Login line */}
        <div
          className="font-mono text-[12px] sm:text-[13px] mt-auto pb-[env(safe-area-inset-bottom)]"
          style={{
            color: GREEN,
            opacity: showLogin ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {waitingForEnter ? (
            <>
              <span>{'> '}</span>
              <span>Login successful. Press </span>
              <strong>Enter</strong>
              <span> to continue</span>
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
      </div>
    </div>
  )
}
