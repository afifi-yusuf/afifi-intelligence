import Link from 'next/link'
import { Dir, Section } from '@/components/site/primitives'

export const metadata = {
  title: 'Not found',
}

export default function NotFound() {
  return (
    <Section>
      <Dir name="404" as="h1" />
      <p>There&apos;s nothing at this path.</p>
      <p className="mt-4">
        <Link href="/" className="prose-link">
          Go to the home page
        </Link>
        .
      </p>
    </Section>
  )
}
