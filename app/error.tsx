'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Dir, Section } from '@/components/site/primitives'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[yusufafifi.com] uncaught:', error)
  }, [error])

  return (
    <Section>
      <Dir name="error" as="h1" />
      <p>Something broke while rendering this page.</p>
      {error.digest && <p className="mt-2 font-mono text-[12px] text-muted">ref: {error.digest}</p>}
      <p className="mt-4">
        <button type="button" onClick={() => reset()} className="prose-link cursor-pointer">
          Try again
        </button>{' '}
        or{' '}
        <Link href="/" className="prose-link">
          go home
        </Link>
        .
      </p>
    </Section>
  )
}
