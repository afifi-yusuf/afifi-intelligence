import type { Metadata } from 'next'
import { A, Dir, Section } from '@/components/site/primitives'
import { EDUCATION, EXPERIENCE, TEACHING } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Work, education, and teaching: Principle, Amazon Prime Video, Angel Lane Partners, UC Berkeley, UCL.',
  alternates: { canonical: '/experience' },
}

function Row({ dates, children }: { dates: string; children: React.ReactNode }) {
  return (
    <li className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-0.5">
      <span className="font-mono text-[12.5px] text-muted sm:pt-[0.3rem]">{dates}</span>
      <div>{children}</div>
    </li>
  )
}

export default function ExperiencePage() {
  return (
    <>
      <Section>
        <Dir name="experience" as="h1" />
        <ul className="space-y-7">
          {EXPERIENCE.map(r => (
            <Row key={r.org} dates={r.dates}>
              <h2 className="font-medium leading-snug">
                {r.title}, {r.href ? <A href={r.href}>{r.org}</A> : r.org}
              </h2>
              <p className="text-muted text-[0.95rem]">{r.place}</p>
              <p className="mt-1.5 text-ink/90">{r.description}</p>
            </Row>
          ))}
        </ul>
      </Section>

      <Section>
        <Dir name="education" />
        <ul className="space-y-6">
          {EDUCATION.map(s => (
            <Row key={s.name} dates={s.dates}>
              <h3 className="font-medium leading-snug">{s.name}</h3>
              <p className="text-ink/90">{s.degree}</p>
              {s.detail && <p className="text-muted">{s.detail}</p>}
            </Row>
          ))}
        </ul>
      </Section>

      <Section>
        <Dir name="teaching" />
        <p>
          Teaching assistant at UCL for{' '}
          {TEACHING.map((t, i) => (
            <span key={t.code}>
              {i > 0 && (i === TEACHING.length - 1 ? ', and ' : ', ')}
              <span className="font-mono text-[14px]">{t.code}</span> ({t.name})
            </span>
          ))}
          .
        </p>
      </Section>
    </>
  )
}
