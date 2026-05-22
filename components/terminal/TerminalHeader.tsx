export type TerminalStatus = 'ready' | 'streaming' | 'error'

const STATUS_LABEL: Record<TerminalStatus, string> = {
  ready: 'ready',
  streaming: 'streaming',
  error: 'error',
}

const STATUS_COLOR: Record<TerminalStatus, string> = {
  ready: 'var(--terminal-green)',
  streaming: 'var(--terminal-yellow)',
  error: 'var(--terminal-red)',
}

interface Props {
  status?: TerminalStatus
}

export default function TerminalHeader({ status = 'ready' }: Props) {
  const color = STATUS_COLOR[status]
  return (
    <header
      className="flex items-center justify-between gap-2 px-3 sm:px-4 shrink-0 border-b min-w-0"
      style={{
        height: '36px',
        background: 'var(--terminal-surface)',
        borderColor: 'var(--terminal-border)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          aria-hidden="true"
          className={status === 'streaming' ? 'animate-pulse' : ''}
          style={{
            background: color,
            boxShadow: `0 0 6px ${color}`,
            width: 8,
            height: 8,
            borderRadius: 999,
            display: 'inline-block',
            flexShrink: 0,
            transition: 'background 200ms ease, box-shadow 200ms ease',
          }}
        />
        <span className="sr-only">{STATUS_LABEL[status]}</span>
        <span className="font-mono text-[11px] sm:text-[12px] text-terminal-dim tracking-wide truncate min-w-0">
          yusuf afifi
        </span>
      </div>
      <span className="font-mono text-[10px] sm:text-[12px] text-terminal-dim shrink-0 max-[380px]:hidden">
        afifi-intelligence v1.0.0
      </span>
    </header>
  )
}
