import { PROFILE } from '@/lib/content'

/** Section heading styled as a directory: "/projects". */
export function Dir({
  name,
  as: Tag = 'h2',
  children,
}: {
  name: string
  as?: 'h1' | 'h2'
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-5">
      <Tag className="font-mono text-[14px] font-medium tracking-tight text-ink">
        <span className="text-gold">/</span>
        {name}
      </Tag>
      {children && <div className="font-mono text-[12px] text-muted">{children}</div>}
    </div>
  )
}

export function Section({ children }: { children: React.ReactNode }) {
  return <section className="mt-14 first:mt-0">{children}</section>
}

export function A({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`prose-link ${className ?? ''}`}
    >
      {children}
    </a>
  )
}

/** Small monospace bracketed links, publication-list style: [code] [site]. */
export function LinkRow({ links }: { links: { label: string; href: string }[] }) {
  if (links.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12.5px]">
      {links.map(l => (
        <li key={l.href}>
          <span className="text-muted">[</span>
          <A href={l.href}>{l.label}</A>
          <span className="text-muted">]</span>
        </li>
      ))}
    </ul>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-20 pt-5 border-t border-rule font-mono text-[12px] text-muted flex flex-wrap justify-between gap-2">
      <span>{PROFILE.location}</span>
      <a href={`mailto:${PROFILE.email}`} className="hover:text-ink transition-colors">
        {PROFILE.email}
      </a>
    </footer>
  )
}
