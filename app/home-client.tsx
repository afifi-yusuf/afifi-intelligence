'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SSHBoot from '@/components/terminal/SSHBoot'
import Terminal from '@/components/terminal/Terminal'

export function HomeSuspenseFallback() {
  return (
    <div
      className="min-h-dvh h-dvh bg-terminal-bg"
      style={{ background: 'var(--terminal-bg, #0a0a0a)' }}
      aria-busy="true"
      aria-label="Loading"
    />
  )
}

/** Uses useSearchParams — must be under <Suspense> (see app/page.tsx). */
export default function HomePage() {
  const [booted, setBooted] = useState(false)
  const searchParams = useSearchParams()

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  const handleReplayBoot = useCallback(() => {
    setBooted(false)
  }, [])

  // Skip the boot intro for:
  //   1. returning visitors (shared `afifi:visits` key with WelcomeBlock)
  //   2. prefers-reduced-motion users
  //   3. deep links into the terminal (?cmd=... or ?q=...)
  useEffect(() => {
    try {
      const visits =
        parseInt(localStorage.getItem('afifi:visits') ?? '0', 10) || 0
      if (visits > 0) {
        setBooted(true)
        return
      }
    } catch {
      /* localStorage blocked — fall through */
    }

    if (searchParams.get('cmd') || searchParams.get('q')) {
      setBooted(true)
      return
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setBooted(true)
    }
  }, [searchParams])

  const initialCmd = searchParams.get('cmd')
  const initialQ = searchParams.get('q')

  return (
    <>
      {!booted && <SSHBoot onComplete={handleBootComplete} />}
      {/* Mount terminal only after boot so the hidden input is not focused while
          Enter-to-skip is handled on the overlay (otherwise key events hit /clear, etc.) */}
      {booted && (
        // No animate-in/fade-in: globals.css forces animation-duration:0 under
        // prefers-reduced-motion (common on phones), which leaves opacity at 0.
        <div className="min-h-dvh h-dvh">
          <Terminal
            initialCmd={initialCmd ? `/${initialCmd}` : undefined}
            initialQ={initialQ ?? undefined}
            onReplayBoot={handleReplayBoot}
          />
        </div>
      )}
    </>
  )
}
