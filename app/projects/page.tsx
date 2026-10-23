import type { Metadata } from 'next'
import { A, Dir, LinkRow, Section } from '@/components/site/primitives'
import { HACKATHONS, PROJECTS } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Projects and research by Yusuf Afifi: Agency, Warply, IntelliTrade, ReadingStar, Petals, PolyWhisper, and ML for fluid dynamics, plus hackathon builds PolyBans, Grok Earth, and StarPlex.',
  alternates: { canonical: '/projects' },
}

export default function ProjectsPage() {
  return (
    <>
      <Section>
        <Dir name="projects" as="h1" />
        <ol className="space-y-9">
          {PROJECTS.map(p => (
            <li key={p.title}>
              <h2 className="text-[1.15rem] font-medium leading-snug">
                {p.title}
                <span className="font-normal text-muted"> — {p.subtitle}</span>
              </h2>
              <p className="mt-1.5 text-ink/90">{p.description}</p>
              {p.note && <p className="mt-1 italic text-muted">{p.note}</p>}
              <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <LinkRow links={p.links} />
                <span className="font-mono text-[12px] text-muted">{p.tags.join(' · ')}</span>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <Dir name="hackathons" />
        <ul className="space-y-6">
          {HACKATHONS.map(h => (
            <li key={h.title}>
              <p>
                <span className="font-medium">{h.title}</span>
                <span className="text-muted">
                  {' '}
                  — {h.event}
                  {h.result && (
                    <>
                      , <span className="text-ink">{h.result}</span>
                    </>
                  )}
                </span>
              </p>
              <p className="mt-1 text-ink/90">{h.description}</p>
              <div className="mt-1.5">
                <LinkRow links={h.links} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-muted">
          More on <A href="https://github.com/afifi-yusuf">GitHub</A>.
        </p>
      </Section>
    </>
  )
}
