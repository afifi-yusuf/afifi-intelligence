import { ImageResponse } from 'next/og'

export const alt = 'Yusuf Afifi — MEng EECS, UC Berkeley · Sky Computing Lab'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PAPER = '#fbfaf6'
const INK = '#1d1c1a'
const MUTED = '#6e6a62'
const RULE = '#e6e2d9'
const GOLD = '#c99a2e'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: PAPER,
          color: INK,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 96px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', gap: 28, fontSize: 26, color: MUTED, fontFamily: 'monospace' }}>
          {['about', 'projects', 'experience', 'reading', 'cv'].map(d => (
            <span key={d} style={{ display: 'flex' }}>
              <span style={{ color: GOLD }}>/</span>
              {d}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 112, lineHeight: 1.05, letterSpacing: '-0.02em' }}>Yusuf Afifi</div>
          <div style={{ fontSize: 38, color: MUTED, marginTop: 20 }}>
            MEng EECS, UC Berkeley · Sky Computing Lab
          </div>
          <div style={{ fontSize: 38, color: MUTED, marginTop: 6 }}>
            RL post-training · agent execution · model serving
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            borderTop: `2px solid ${RULE}`,
            paddingTop: 24,
            fontSize: 26,
            color: MUTED,
            fontFamily: 'monospace',
          }}
        >
          yusufafifi.com
        </div>
      </div>
    ),
    size
  )
}
