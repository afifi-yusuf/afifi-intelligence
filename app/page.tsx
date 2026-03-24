'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SSHBoot from '@/components/terminal/SSHBoot'
import Terminal from '@/components/terminal/Terminal'

function PageInner() {
  const [booted, setBooted] = useState(false)
  const [terminalKey, setTerminalKey] = useState(0)
  const searchParams = useSearchParams()

  const handleBootComplete = useCallback(() => {
    setBooted(true)
    setTerminalKey(k => k + 1)
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
      <div
        className={`min-h-dvh h-dvh transition-opacity duration-500 ${booted ? 'opacity-100' : 'opacity-0'}`}
      >
        <Terminal
          key={terminalKey}
          initialCmd={initialCmd ? `/${initialCmd}` : undefined}
          initialQ={initialQ ?? undefined}
        />
      </div>
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
