'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SSHBoot from '@/components/terminal/SSHBoot'
import Terminal from '@/components/terminal/Terminal'

function PageInner() {
  const [booted, setBooted] = useState(false)
  const searchParams = useSearchParams()

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  // Respect prefers-reduced-motion — skip boot animation
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setBooted(true)
    }
  }, [])

  const initialCmd = searchParams.get('cmd')
  const initialQ = searchParams.get('q')

  return (
    <>
      {!booted && <SSHBoot onComplete={handleBootComplete} />}
      {/* Mount terminal only after boot so the hidden input is not focused while
          Enter-to-skip is handled on the overlay (otherwise key events hit /clear, etc.) */}
      {booted && (
        <div className="min-h-dvh h-dvh animate-in fade-in-0 duration-500">
          <Terminal
            initialCmd={initialCmd ? `/${initialCmd}` : undefined}
            initialQ={initialQ ?? undefined}
          />
        </div>
      )}
    </>
  )
}

export default function Page() {
  return (
    <Suspense>
      <PageInner />
    </Suspense>
  )
}
