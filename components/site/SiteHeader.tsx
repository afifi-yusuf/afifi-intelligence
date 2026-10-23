'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/experience', label: 'experience' },
  { href: '/reading', label: 'reading' },
  { href: '/cv', label: 'cv' },
  { href: '/ask', label: 'ask' },
]

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between pb-5 border-b border-rule">
      <Link href="/" className="text-[1.15rem] font-medium tracking-tight text-ink hover:text-link transition-colors">
        Yusuf Afifi
      </Link>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px]">
          {NAV.map(item => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={
                    active
                      ? 'text-ink underline decoration-gold decoration-2 underline-offset-[6px]'
                      : 'text-muted hover:text-ink transition-colors'
                  }
                >
                  /{item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
