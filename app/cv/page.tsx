import type { Metadata } from 'next'
import Link from 'next/link'
import { A, Dir, Section } from '@/components/site/primitives'
import Publications from '@/components/site/Publications'
import { EDUCATION, EXPERIENCE, PROFILE, SKILLS } from '@/lib/content'
import { RESUME_PDF_DOWNLOAD, RESUME_PDF_HREF } from '@/lib/resume'

export const metadata: Metadata = {
  title: 'CV',
  description:
    'CV of Yusuf Afifi: MEng EECS at UC Berkeley, research fellow at Principle, previously Amazon Prime Video and Angel Lane Partners.',
  alternates: { canonical: '/cv' },
}

export default function CvPage() {
  return (
    <>
      <Section>
        <Dir name="cv" as="h1">
          <a href={RESUME_PDF_HREF} download={RESUME_PDF_DOWNLOAD} className="prose-link">
            download pdf ↓
          </a>
        </Dir>
        <dl className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-1">
          <dt className="font-mono text-[13px] text-muted pt-[0.2rem]">email</dt>
          <dd>
            <A href={`mailto:${PROFILE.email}`}>{PROFILE.email}</A>
            <span className="text-muted"> · </span>
            <A href={`mailto:${PROFILE.berkeleyEmail}`}>{PROFILE.berkeleyEmail}</A>
          </dd>
          {PROFILE.links.map(l => (
            <div key={l.href} className="contents">
              <dt className="font-mono text-[13px] text-muted pt-[0.2rem]">{l.label.toLowerCase()}</dt>
              <dd className="min-w-0 break-words">
                <A href={l.href}>{l.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}</A>
              </dd>
            </div>
          ))}
          <dt className="font-mono text-[13px] text-muted pt-[0.2rem]">based in</dt>
          <dd>{PROFILE.location}</dd>
        </dl>
      </Section>

      <Section>
        <Dir name="publications" />
        <Publications summaries={false} />
      </Section>

      <Section>
        <Dir name="experience">
          <Link href="/experience" className="hover:text-ink transition-colors">
            details →
          </Link>
        </Dir>
        <ul className="space-y-2">
          {EXPERIENCE.map(r => (
            <li key={r.org} className="grid sm:grid-cols-[9rem_1fr] gap-x-6">
              <span className="font-mono text-[12.5px] text-muted sm:pt-[0.3rem]">{r.dates}</span>
              <span>
                {r.title}, <span className="font-medium">{r.org}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Dir name="education" />
        <ul className="space-y-2">
          {EDUCATION.map(s => (
            <li key={s.name} className="grid sm:grid-cols-[9rem_1fr] gap-x-6">
              <span className="font-mono text-[12.5px] text-muted sm:pt-[0.3rem]">{s.dates}</span>
              <span>
                <span className="font-medium">{s.name}</span>
                <span className="text-muted"> — {s.degree}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Dir name="skills" />
        <dl className="space-y-2">
          {SKILLS.map(s => (
            <div key={s.label} className="grid sm:grid-cols-[9rem_1fr] gap-x-6">
              <dt className="font-mono text-[12.5px] text-muted sm:pt-[0.3rem]">{s.label}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  )
}
