import type { Metadata } from 'next'
import { Dir, Section } from '@/components/site/primitives'
import { READING } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Reading',
  description: 'What Yusuf Afifi is reading.',
  alternates: { canonical: '/reading' },
}

function Books({ books }: { books: { title: string; author: string }[] }) {
  return (
    <ul className="space-y-1.5">
      {books.map(b => (
        <li key={b.title}>
          <span className="italic">{b.title}</span>
          <span className="text-muted"> — {b.author}</span>
        </li>
      ))}
    </ul>
  )
}

export default function ReadingPage() {
  return (
    <>
      <Section>
        <Dir name="reading" as="h1" />
        <p className="mb-4 text-muted">Currently reading</p>
        <Books books={READING.current} />
      </Section>
      <Section>
        <Dir name="favorites" />
        <Books books={READING.favorites} />
      </Section>
    </>
  )
}
