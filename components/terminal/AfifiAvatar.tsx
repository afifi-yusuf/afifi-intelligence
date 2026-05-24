'use client'

/**
 * AfifiAvatar — a tiny pixel-art mascot for the welcome dashboard.
 *
 * 12x12 sprite, rendered as SVG rects. Eyes blink subtly every few seconds.
 * Uses CSS vars so it picks up the terminal palette automatically.
 *
 * Legend:
 *   X = body  (terminal-green)
 *   1 = eye   (terminal-bg cutout, blinks)
 *   2 = mouth (terminal-bg cutout, static)
 *   . = transparent
 */

const SPRITE = [
  '. . . X X X X X X . . .',
  '. . X X X X X X X X . .',
  '. X X X X X X X X X X .',
  'X X X X X X X X X X X X',
  'X X 1 1 X X X X 1 1 X X',
  'X X 1 1 X X X X 1 1 X X',
  'X X X X X X X X X X X X',
  'X X X X X 2 2 X X X X X',
  'X X X X X X X X X X X X',
  '. X X X X X X X X X X .',
  '. . X X X X X X X X . .',
  '. . . X X . . X X . . .',
]

interface Props {
  size?: number
  className?: string
}

export default function AfifiAvatar({ size = 72, className }: Props) {
  const rows = SPRITE.map(r => r.split(/\s+/).filter(Boolean))
  const numRows = rows.length
  const numCols = rows[0].length
  const cell = size / numRows
  const w = cell * numCols
  const h = cell * numRows

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="afifi-intelligence mascot"
      className={`afifi-avatar ${className ?? ''}`.trim()}
      style={{ shapeRendering: 'crispEdges', display: 'block' }}
    >
      <style>
        {`
          @keyframes afifi-blink {
            0%, 91%, 100% { opacity: 1; }
            92%, 99%      { opacity: 0; }
          }
          @keyframes afifi-idle {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-2px); }
          }
          .afifi-avatar {
            animation: afifi-idle 2.6s ease-in-out infinite;
            transform-box: fill-box;
            will-change: transform;
          }
          @media (prefers-reduced-motion: reduce) {
            .afifi-eye,
            .afifi-avatar { animation: none !important; }
          }
        `}
      </style>
      {rows.flatMap((row, ri) =>
        row.map((c, ci) => {
          if (c === '.') return null
          const isEye = c === '1'
          const isMouth = c === '2'
          const fill =
            isEye || isMouth
              ? 'var(--terminal-bg)'
              : 'var(--terminal-green)'
          return (
            <rect
              key={`${ri}-${ci}`}
              x={ci * cell}
              y={ri * cell}
              width={cell + 0.5}
              height={cell + 0.5}
              fill={fill}
              className={isEye ? 'afifi-eye' : undefined}
              style={
                isEye
                  ? { animation: 'afifi-blink 4.2s infinite' }
                  : undefined
              }
            />
          )
        })
      )}
    </svg>
  )
}
