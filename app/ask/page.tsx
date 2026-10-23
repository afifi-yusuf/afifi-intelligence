import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Dir, Section } from '@/components/site/primitives'
import AskClient from './ask-client'

export const metadata: Metadata = {
  title: 'Ask',
  description: 'Ask an AI version of Yusuf Afifi about his work, research, and background.',
  alternates: { canonical: '/ask' },
}

export default function AskPage() {
  return (
    <Section>
      <Dir name="ask" as="h1" />
      <p>
        An AI version of me that answers from what&apos;s on this site. It can get things wrong, so
        check the{' '}
        <Link href="/cv" className="prose-link">
          CV
        </Link>{' '}
        for anything that matters. Questions aren&apos;t stored.
      </p>
      {/* useSearchParams (for ?q=) must sit under Suspense */}
      <Suspense>
        <AskClient />
      </Suspense>
    </Section>
  )
}
