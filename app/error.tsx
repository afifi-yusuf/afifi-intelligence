'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import TerminalHeader from '@/components/terminal/TerminalHeader'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[afifi-intelligence] uncaught:', error)
  }, [error])

  return (
    <div className="terminal-text flex flex-col min-h-dvh h-dvh bg-terminal-bg text-terminal-fg pt-[env(safe-area-inset-top)] terminal-selection">
      <TerminalHeader />

      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 font-mono text-[13px] sm:text-[14px] leading-snug">
        <div className="flex items-start gap-2 mb-3">
          <span className="text-terminal-accent shrink-0">{'>'}</span>
          <span className="text-terminal-fg">render --recover</span>
        </div>

        <div role="alert" className="text-terminal-red mb-2">
          <span className="opacity-70">error: </span>
          something broke while rendering this page
        </div>

        {error.digest ? (
          <div className="text-terminal-dim mb-3 break-all">
            ref: <span className="text-terminal-dim opacity-80">{error.digest}</span>
          </div>
        ) : null}

        <div className="text-terminal-dim mb-4">
          You can retry, or head back to the main terminal.
        </div>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-terminal-accent">→</span>
          <button
            type="button"
            onClick={() => reset()}
            className="text-terminal-accent underline hover:text-terminal-link transition-colors bg-transparent border-none p-0 font-mono cursor-pointer"
          >
            retry
          </button>
          <span className="text-terminal-dim">or</span>
          <Link
            href="/"
            className="text-terminal-link underline hover:text-terminal-green transition-colors"
          >
            return home
          </Link>
        </div>
      </main>

      <footer
        className="shrink-0 px-4 py-2 font-mono text-[11px] text-terminal-dim"
        style={{
          background: 'var(--terminal-surface)',
          borderTop: '1px solid var(--terminal-border)',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        }}
      >
        runtime · render error
      </footer>
    </div>
  )
}
