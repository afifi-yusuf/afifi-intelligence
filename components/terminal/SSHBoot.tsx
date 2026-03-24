'use client'

import { useEffect, useState } from 'react'

const SSH_LINES = [
  { text: '$ ssh yusuf@afifi.intelligence', delay: 0, color: 'accent' },
  { text: 'The authenticity of host \'afifi.intelligence (203.0.113.42)\' can\'t be established.', delay: 600, color: 'dim' },
  { text: 'ED25519 key fingerprint is SHA256:Yf1a2i3F4i5/aI6b7u8i9l0d3e4r5s.', delay: 900, color: 'dim' },
  { text: 'Are you sure you want to continue connecting (yes/no)? yes', delay: 1300, color: 'fg' },
  { text: 'Warning: Permanently added \'afifi.intelligence\' to the list of known hosts.', delay: 1800, color: 'dim' },
  { text: 'yusuf@afifi.intelligence\'s password: ••••••••', delay: 2200, color: 'fg' },
  { text: '', delay: 2700, color: 'fg' },
  { text: 'Welcome to Afifi Intelligence v1.0.0', delay: 3000, color: 'green' },
  { text: 'Last login: Mon Jan 01 00:00:00 2025 from 0.0.0.0', delay: 3200, color: 'dim' },
  { text: '', delay: 3400, color: 'fg' },
]

const COLOR_MAP: Record<string, string> = {
  accent: 'text-terminal-accent',
  dim: 'text-terminal-dim',
  fg: 'text-terminal-fg',
  green: 'text-terminal-green',
}

interface Props {
  onComplete: () => void
}

export default function SSHBoot({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    SSH_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1)
        }, line.delay)
      )
    })

    // After all lines shown, brief pause then transition
    timers.push(
      setTimeout(() => {
        setDone(true)
        setTimeout(onComplete, 400)
      }, SSH_LINES[SSH_LINES.length - 1].delay + 600)
    )

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 bg-terminal-bg flex items-center justify-center transition-opacity duration-500 ${done ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ zIndex: 50 }}
    >
      <div className="font-mono text-[14px] leading-relaxed w-full max-w-2xl px-8">
        {SSH_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`${COLOR_MAP[line.color] || 'text-terminal-fg'} min-h-[1.4em]`}>
            {line.text || '\u00A0'}
          </div>
        ))}
        {visibleLines < SSH_LINES.length && (
          <span className="inline-block w-2 h-[1em] bg-terminal-accent animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  )
}
