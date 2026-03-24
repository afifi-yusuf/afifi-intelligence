'use client'

import { OutputSegment } from '@/lib/commands'

interface OutputRendererProps {
  segments: OutputSegment[]
  onCommandClick?: (cmd: string) => void
}

function RenderSegment({
  seg,
  onCommandClick,
}: {
  seg: OutputSegment
  onCommandClick?: (cmd: string) => void
}) {
  switch (seg.type) {
    case 'header':
      return (
        <span className="text-terminal-green font-bold">
          {seg.text}
        </span>
      )
    case 'text':
      return <span className="text-terminal-fg">{seg.text}</span>
    case 'dim':
      return <span className="text-terminal-dim">{seg.text}</span>
    case 'accent':
      return <span className="text-terminal-accent">{seg.text}</span>
    case 'green':
      return <span className="text-terminal-green">{seg.text}</span>
    case 'link':
      return (
        <a
          href={seg.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-link underline hover:text-terminal-green transition-colors cursor-pointer"
        >
          {seg.text}
        </a>
      )
    case 'command-link':
      return (
        <button
          onClick={() => onCommandClick?.(seg.command)}
          className="text-terminal-accent underline hover:text-terminal-link transition-colors cursor-pointer bg-transparent border-none p-0 font-mono text-[13px] sm:text-[14px] leading-relaxed"
        >
          {seg.text}
        </button>
      )
    case 'tag':
      return <span className="text-terminal-tag opacity-90">{seg.text}</span>
    case 'blank':
      return <span className="block h-[1.2em]" />
    case 'divider':
      return (
        <span className="block text-terminal-dim">
          {'—'.repeat(40)}
        </span>
      )
    case 'error':
      return (
        <span className="text-terminal-red">
          <span className="opacity-70">error: </span>
          {seg.text}
        </span>
      )
    case 'line':
      return (
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {seg.segments.map((s, i) => (
            <span key={i} className="whitespace-pre-wrap break-words min-w-0">
              <RenderSegment seg={s} onCommandClick={onCommandClick} />
            </span>
          ))}
        </span>
      )
    default:
      return null
  }
}

export default function OutputRenderer({ segments, onCommandClick }: OutputRendererProps) {
  return (
    <div className="font-mono text-[13px] sm:text-[14px] leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === 'blank') {
          return <div key={i} className="h-[1.4em]" />
        }
        if (seg.type === 'divider') {
          return (
            <div key={i} className="text-terminal-dim my-1">
              {'—'.repeat(40)}
            </div>
          )
        }
        return (
          <div key={i} className="min-h-[1.4em]">
            <RenderSegment seg={seg} onCommandClick={onCommandClick} />
          </div>
        )
      })}
    </div>
  )
}
