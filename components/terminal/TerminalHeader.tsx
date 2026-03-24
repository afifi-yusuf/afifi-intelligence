export default function TerminalHeader() {
  return (
    <header
      className="flex items-center justify-between gap-2 px-3 sm:px-4 shrink-0 border-b min-w-0"
      style={{
        height: '36px',
        background: 'var(--terminal-surface)',
        borderColor: 'var(--terminal-border)',
      }}
    >
      <span className="font-mono text-[11px] sm:text-[12px] text-terminal-dim tracking-wide truncate min-w-0">
        yusuf afifi
      </span>
      <span className="font-mono text-[10px] sm:text-[12px] text-terminal-dim shrink-0 max-[380px]:hidden">
        afifi-intelligence v1.0.0
      </span>
    </header>
  )
}
