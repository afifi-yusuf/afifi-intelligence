import Image from 'next/image'
import Link from 'next/link'
import { A, Dir, LinkRow, Section } from '@/components/site/primitives'
import Publications from '@/components/site/Publications'
import { INTERESTS, NOW, PROFILE, PROJECTS } from '@/lib/content'

export const metadata = {
  alternates: { canonical: '/' },
}

const SELECTED = ['Agency', 'Warply', 'ReadingStar']

export default function AboutPage() {
  const selected = PROJECTS.filter(p => SELECTED.includes(p.title))

  return (
    <>
      <Section>
        <div className="flex flex-col-reverse gap-8 sm:flex-row sm:items-start sm:gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-[2.1rem] leading-tight font-medium tracking-tight">{PROFILE.name}</h1>
            <p className="mt-1 font-mono text-[13px] text-muted">{PROFILE.tagline}</p>

            <div className="mt-6 space-y-4">
              <p>
                I&apos;m an MEng student in EECS at <A href="https://eecs.berkeley.edu">UC Berkeley</A>. I
                do research in the{' '}
                <A href="https://sky.cs.berkeley.edu">Sky Computing Lab</A>{' '}
                on agent efficiency for production workloads, advised by{' '}
                <A href="https://people.eecs.berkeley.edu/~akcheung/">Alvin Cheung</A>, and I&apos;m a
                research fellow at{' '}
                <A href="https://futureprinciple.com">Principle</A>, where I work on RL post-training
                in prediction market environments.
              </p>
              <p>
                My work focuses on{' '}
                <A href="https://arxiv.org/abs/2610.01955">RL post-training</A>, programmable and
                efficient <A href="https://github.com/agency-project/agency">agent execution</A>, and
                optimizing <A href="https://warply.ai">model serving</A>, all toward continual
                learning.
              </p>
              <p>
                Before Berkeley I studied Computer Science with a minor in Applied Mathematics at{' '}
                <A href="https://www.ucl.ac.uk">UCL</A> (First Class), and worked at Amazon Prime Video
                and Angel Lane Partners.
              </p>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px]">
              <li>
                <A href={`mailto:${PROFILE.email}`}>email</A>
              </li>
              {PROFILE.links.map(l => (
                <li key={l.href}>
                  <A href={l.href}>{l.label.toLowerCase()}</A>
                </li>
              ))}
              <li>
                <Link href="/cv" className="prose-link">
                  cv
                </Link>
              </li>
            </ul>

            {/* Plain GET form: works without JS, /ask picks up ?q= and answers it */}
            <form
              action="/ask"
              className="mt-7 flex items-end gap-3 border-b border-rule focus-within:border-muted transition-colors"
            >
              <label htmlFor="home-ask" className="sr-only">
                Ask an AI version of me
              </label>
              <input
                id="home-ask"
                name="q"
                required
                maxLength={2000}
                autoComplete="off"
                placeholder="Ask an AI version of me something…"
                className="flex-1 min-w-0 bg-transparent py-1.5 outline-none placeholder:text-muted"
              />
              <button type="submit" className="shrink-0 pb-2 font-mono text-[13px] text-link cursor-pointer">
                ask ↵
              </button>
            </form>
          </div>

          <Image
            src="/yusuf.jpg"
            alt="Yusuf Afifi in front of the Golden Gate Bridge"
            width={600}
            height={800}
            priority
            className="w-36 sm:w-44 h-auto rounded-[3px] shrink-0 border border-rule"
          />
        </div>
      </Section>

      <Section>
        <Dir name="now" />
        <dl className="space-y-3">
          {NOW.map(item => (
            <div key={item.title} className="grid sm:grid-cols-[9rem_1fr] gap-x-4">
              <dt className="font-medium">
                {item.href ? <A href={item.href}>{item.title}</A> : item.title}
              </dt>
              <dd className="text-ink/85">{item.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-muted">
          Also thinking about: <span className="italic">{INTERESTS.join(', ')}</span>.
        </p>
      </Section>

      <Section>
        <Dir name="publications" />
        <Publications />
      </Section>

      <Section>
        <Dir name="selected-projects">
          <Link href="/projects" className="hover:text-ink transition-colors">
            all projects →
          </Link>
        </Dir>
        <ul className="space-y-6">
          {selected.map(p => (
            <li key={p.title}>
              <p>
                <span className="font-medium">{p.title}</span>
                <span className="text-muted"> — {p.subtitle}</span>
              </p>
              <div className="mt-1">
                <LinkRow links={p.links} />
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
