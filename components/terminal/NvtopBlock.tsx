'use client'

import { useEffect, useRef, useState } from 'react'

const BAR_WIDTH_DESKTOP = 22
const BAR_WIDTH_MOBILE = 14
const FRAMES = 12
const FRAME_MS = 480

interface GpuState {
  util: number
  mem: number
  temp: number
  power: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

const INITIAL: GpuState[] = [
  { util: 68, mem: 54.2, temp: 62, power: 315 },
  { util: 73, mem: 58.1, temp: 65, power: 342 },
  { util: 61, mem: 47.9, temp: 59, power: 287 },
  { util: 70, mem: 55.0, temp: 63, power: 320 },
  { util: 72, mem: 56.8, temp: 64, power: 335 },
  { util: 66, mem: 51.4, temp: 61, power: 308 },
  { util: 74, mem: 59.6, temp: 66, power: 348 },
  { util: 69, mem: 53.1, temp: 62, power: 312 },
]

function jitter(s: GpuState, prefersReducedMotion: boolean): GpuState {
  if (prefersReducedMotion) return s
  const r = () => Math.random() - 0.5
  return {
    util: clamp(s.util + r() * 8, 38, 96),
    mem: clamp(s.mem + r() * 0.6, 30, 78),
    temp: clamp(s.temp + r() * 2, 55, 78),
    power: clamp(s.power + r() * 35, 240, 410),
  }
}

function bar(pct: number, width: number) {
  const filled = Math.round((pct / 100) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

function utilColor(u: number) {
  if (u >= 90) return 'var(--terminal-red)'
  if (u >= 75) return 'var(--terminal-yellow)'
  return 'var(--terminal-green)'
}

function pad(s: string | number, n: number) {
  const str = String(s)
  return str.length >= n ? str : ' '.repeat(n - str.length) + str
}

export default function NvtopBlock() {
  const [gpus, setGpus] = useState<GpuState[]>(INITIAL)
  const [done, setDone] = useState(false)
  const [compact, setCompact] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mq = window.matchMedia('(max-width: 640px)')
    setCompact(mq.matches)
    const onResize = () => setCompact(mq.matches)
    mq.addEventListener('change', onResize)

    if (reduced) {
      setDone(true)
      return () => mq.removeEventListener('change', onResize)
    }

    let frame = 0
    const id = setInterval(() => {
      frame += 1
      setGpus(prev => prev.map(g => jitter(g, false)))
      rootRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
      if (frame >= FRAMES) {
        clearInterval(id)
        setDone(true)
      }
    }, FRAME_MS)
    return () => {
      clearInterval(id)
      mq.removeEventListener('change', onResize)
    }
  }, [])

  const barWidth = compact ? BAR_WIDTH_MOBILE : BAR_WIDTH_DESKTOP
  const avgUtil = gpus.reduce((a, g) => a + g.util, 0) / gpus.length

  return (
    <div
      ref={rootRef}
      className="font-mono text-[11px] sm:text-[12.5px] leading-snug text-terminal-fg overflow-x-auto terminal-scrollbar"
    >
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-terminal-green">nvtop</span>
        <span className="text-terminal-dim">
          8x NVIDIA H100 80GB · CUDA 12.6 · driver 550.54
        </span>
        {!done && (
          <span className="text-terminal-dim opacity-70">· refreshing</span>
        )}
      </div>

      <div className="space-y-0.5">
        {gpus.map((g, i) => (
          <div key={i} className="whitespace-pre">
            <span className="text-terminal-dim">{`GPU ${i}  `}</span>
            <span style={{ color: utilColor(g.util) }}>{bar(g.util, barWidth)}</span>
            <span className="text-terminal-fg">{`  ${pad(g.util.toFixed(0), 2)}%`}</span>
            <span className="text-terminal-dim">{`   ${pad(g.temp.toFixed(0), 2)} C`}</span>
            <span className="text-terminal-dim">{`   ${pad(g.power.toFixed(0), 3)}/700 W`}</span>
            <span className="text-terminal-dim">{`   ${g.mem.toFixed(1)}/80 GB`}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-terminal-dim">
        avg util{' '}
        <span style={{ color: utilColor(avgUtil) }}>{avgUtil.toFixed(0)}%</span>
        {' · '}fan auto{' · '}ecc on
      </div>

      <div className="mt-2 text-terminal-dim">PIDs</div>
      <div className="whitespace-pre">
        <span className="text-terminal-fg">{'  12847  '}</span>
        <span className="text-terminal-accent">{'vllm-serve --model gpt-oss-20b --tp 8'}</span>
        <span className="text-terminal-dim">{'     78.2 GB'}</span>
      </div>
      <div className="whitespace-pre">
        <span className="text-terminal-fg">{'  12943  '}</span>
        <span className="text-terminal-dim">{'yusuf@afifi.dev (ssh)                       0.0 GB'}</span>
      </div>

      {done && (
        <div className="mt-2 text-terminal-dim opacity-70 italic">
          snapshot · synthetic; my actual rigs are smaller
        </div>
      )}
    </div>
  )
}
