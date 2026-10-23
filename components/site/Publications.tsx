import { PROFILE, PUBLICATIONS } from '@/lib/content'
import { A, LinkRow } from './primitives'

/** Paper list in the usual academic format: title, authors (me underlined), venue, links. */
export default function Publications({ summaries = true }: { summaries?: boolean }) {
  return (
    <ol className="space-y-7">
      {PUBLICATIONS.map(p => (
        <li key={p.title}>
          <h3 className="font-medium leading-snug">
            <A href={p.links[0].href} className="!text-ink hover:!text-link">
              {p.title}
            </A>
          </h3>
          <p className="mt-0.5 text-[0.95rem]">
            {p.authors.map((name, i) => (
              <span key={name}>
                {i > 0 && ', '}
                {name === PROFILE.name ? (
                  <span className="underline decoration-gold decoration-2 underline-offset-[3px]">{name}</span>
                ) : (
                  <span className="text-muted">{name}</span>
                )}
              </span>
            ))}
          </p>
          <p className="italic text-[0.95rem]">{p.venue}</p>
          {summaries && <p className="mt-1.5 text-ink/85">{p.summary}</p>}
          {summaries && p.note && <p className="mt-1 text-muted text-[0.95rem]">{p.note}</p>}
          <div className="mt-2">
            <LinkRow links={p.links} />
          </div>
        </li>
      ))}
    </ol>
  )
}
