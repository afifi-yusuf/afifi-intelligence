import { ImageResponse } from 'next/og'

export const alt = 'Yusuf Afifi — CS · SWE/AI engineering'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#0a0a0a'
const FG = '#e6e6e6'
const DIM = '#7d8590'
const GREEN = '#7ee787'
const SURFACE = '#141414'
const BORDER = 'rgba(255,255,255,0.06)'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: BG,
          color: FG,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 36px',
            background: SURFACE,
            borderBottom: `1px solid ${BORDER}`,
            color: DIM,
            fontSize: 22,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: GREEN, fontSize: 16 }}>●</span>
            <span>yusuf afifi</span>
          </div>
          <span style={{ fontSize: 18 }}>afifi-intelligence v1.0.0</span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 80px',
          }}
        >
          <div
            style={{
              color: GREEN,
              fontSize: 104,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            yusuf afifi
          </div>
          <div
            style={{
              color: DIM,
              fontSize: 34,
              marginTop: 12,
              letterSpacing: '-0.01em',
            }}
          >
            cs · swe/ai engineering
          </div>

          <div
            style={{
              marginTop: 64,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontSize: 36,
            }}
          >
            <span style={{ color: GREEN }}>{'>'}</span>
            <span style={{ color: FG }}>/about</span>
            <span
              style={{
                background: GREEN,
                width: 16,
                height: 38,
                marginLeft: 4,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 36px',
            background: SURFACE,
            borderTop: `1px solid ${BORDER}`,
            color: DIM,
            fontSize: 20,
          }}
        >
          <span>yusufafifi.com</span>
          <span>type a command or ask me anything</span>
        </div>
      </div>
    ),
    size
  )
}
