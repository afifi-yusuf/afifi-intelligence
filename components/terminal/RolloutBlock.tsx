'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const TOTAL_STEPS = 24
const STEP_MS = 110
const SPARK_WIDTH = 22
const SPARK_BLOCKS = '▁▂▃▄▅▆▇█'

interface Step {
  step: number
  price: number
  action: 'hold' | 'buy' | 'sell'
  reward: number
  pos: number
  pnl: number
}

function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function generateEpisode(seed: number): Step[] {
  const rng = makeRng(seed)
  const steps: Step[] = []
  let price = 100
  let pos = 0
  let entry = 0
  let realized = 0
  let prevReturn = 0

  for (let i = 0; i < TOTAL_STEPS; i++) {
    const ret = i === 0 ? 0 : (rng() - 0.47) * 0.012
    if (i > 0) price = price * (1 + ret)

    let action: 'hold' | 'buy' | 'sell' = 'hold'
    const momentum = prevReturn + ret
    if (pos === 0 && momentum > 0.002 && rng() > 0.45) {
      action = 'buy'
      pos = 1
      entry = price
    } else if (pos === 1) {
      const unrealized = (price - entry) / entry
      const exit = unrealized > 0.012 || ret < -0.004
      if (exit && rng() > 0.35) {
        action = 'sell'
        realized += price - entry
        pos = 0
        entry = 0
      }
    }

    const reward = pos === 1 && i > 0 ? entry * ret : 0
    const pnl = pos === 1 ? realized + (price - entry) : realized

    steps.push({ step: i, price, action, reward, pos, pnl })
    prevReturn = ret
  }
  return steps
}

function pad(s: string | number, n: number, left = false) {
  const str = String(s)
  if (str.length >= n) return str
  return left ? str + ' '.repeat(n - str.length) : ' '.repeat(n - str.length) + str
}

function signed(n: number, d: number) {
  return (n >= 0 ? '+' : '') + n.toFixed(d)
}

function sparkline(prices: number[]) {
  if (prices.length === 0) return ' '.repeat(SPARK_WIDTH)
  const slice = prices.slice(-SPARK_WIDTH)
  const min = Math.min(...slice)
  const max = Math.max(...slice)
  const range = max - min || 1
  const chars = slice
    .map(p => SPARK_BLOCKS[Math.min(7, Math.floor(((p - min) / range) * 7.9999))])
    .join('')
  return ' '.repeat(Math.max(0, SPARK_WIDTH - chars.length)) + chars
}

function actionColor(a: Step['action']) {
  if (a === 'buy') return 'var(--terminal-green)'
  if (a === 'sell') return 'var(--terminal-red)'
  return 'var(--terminal-dim)'
}

function rewardColor(r: number) {
  if (r > 0) return 'var(--terminal-green)'
  if (r < 0) return 'var(--terminal-red)'
  return 'var(--terminal-dim)'
}

function pnlColor(p: number) {
  if (p > 0) return 'var(--terminal-green)'
  if (p < 0) return 'var(--terminal-red)'
  return 'var(--terminal-fg)'
}

export default function RolloutBlock() {
  const seed = useMemo(() => (Date.now() & 0xffff) | 1, [])
  const traj = useMemo(() => generateEpisode(seed), [seed])
  const [visible, setVisible] = useState(1)
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(TOTAL_STEPS)
      setDone(true)
      return
    }
    const id = setInterval(() => {
      setVisible(v => {
        if (v >= TOTAL_STEPS) {
          clearInterval(id)
          setDone(true)
          return v
        }
        return v + 1
      })
      rootRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
    }, STEP_MS)
    return () => clearInterval(id)
  }, [])

  const shown = traj.slice(0, visible)
  const final = traj[traj.length - 1]
  const holds = traj.filter(s => s.action === 'hold').length
  const buys = traj.filter(s => s.action === 'buy').length
  const sells = traj.filter(s => s.action === 'sell').length

  return (
    <div
      ref={rootRef}
      className="font-mono text-[11px] sm:text-[12.5px] leading-snug text-terminal-fg overflow-x-auto terminal-scrollbar"
    >
      <div className="text-terminal-green">
        env <span className="text-terminal-fg">market-v0</span>
        <span className="text-terminal-dim">
          {' · agent ppo-mlp(Δ-features) · seed '}
          {seed}
          {' · γ 0.99 · λ-GAE 0.95'}
        </span>
      </div>
      <div className="text-terminal-dim mb-2">
        episode 1 / 1 · horizon {TOTAL_STEPS}
      </div>

      <div className="whitespace-pre mb-2">
        <span className="text-terminal-dim">price{' '.repeat(SPARK_WIDTH - 4)}</span>
        {'\n'}
        <span style={{ color: 'var(--terminal-accent)' }}>
          {sparkline(shown.map(s => s.price))}
        </span>
        <span className="text-terminal-dim">
          {`  ${shown.length > 0 ? shown[shown.length - 1].price.toFixed(2) : '—'}`}
        </span>
      </div>

      <div className="whitespace-pre text-terminal-dim">
        {'step    price  action   reward  pos      pnl'}
      </div>

      <div>
        {shown.map(s => (
          <div key={s.step} className="whitespace-pre">
            <span className="text-terminal-dim">{pad(s.step, 4)}</span>
            <span className="text-terminal-fg">{'  '}</span>
            <span className="text-terminal-fg">{pad(s.price.toFixed(2), 7)}</span>
            <span>{'  '}</span>
            <span style={{ color: actionColor(s.action) }}>{pad(s.action, 6, true)}</span>
            <span>{'  '}</span>
            <span style={{ color: rewardColor(s.reward) }}>
              {pad(signed(s.reward, 2), 7)}
            </span>
            <span>{'  '}</span>
            <span className="text-terminal-dim">{pad(s.pos, 3)}</span>
            <span>{'  '}</span>
            <span style={{ color: pnlColor(s.pnl) }}>{pad(signed(s.pnl, 2), 7)}</span>
          </div>
        ))}
        {!done && (
          <span
            aria-hidden="true"
            className="inline-block w-[8px] h-[1em] bg-terminal-accent align-middle ml-0.5 animate-pulse"
            style={{ animationDuration: '1s' }}
          />
        )}
      </div>

      {done && (
        <>
          <div className="mt-3 text-terminal-fg">
            return{' '}
            <span style={{ color: pnlColor(final.pnl) }}>{signed(final.pnl, 2)}</span>
            <span className="text-terminal-dim">
              {` · ${holds} holds · ${buys} buys · ${sells} sells`}
            </span>
          </div>
          <div className="text-terminal-dim opacity-80 italic mt-1">
            synthetic rollout · the real dissertation work is{' '}
            <span className="text-terminal-accent">/now</span>
          </div>
        </>
      )}
    </div>
  )
}
