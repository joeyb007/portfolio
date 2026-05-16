'use client'

import { Html } from '@react-three/drei'
import { REGION_CONFIGS, type SectionId } from '@/lib/regionMap'

interface Props {
  sectionId: SectionId
  position:  [number, number, number]
  visible:   boolean
}

const mono: React.CSSProperties = {
  fontFamily:    'var(--font-geist-mono), monospace',
  fontSize:      9,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

export default function HologramCard({ sectionId, position, visible }: Props) {
  const cfg = REGION_CONFIGS[sectionId]

  // Offset toward camera so card floats in front of the brain
  const pos: [number, number, number] = [position[0], position[1], position[2] + 0.5]

  return (
    <Html
      position={pos}
      center
      style={{ pointerEvents: 'none', opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
      zIndexRange={[10, 11]}
    >
      <div style={{
        width:          220,
        background:     'rgba(5,10,20,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border:         '1px solid rgba(125,216,255,0.18)',
        borderLeft:     '2px solid rgba(125,216,255,0.55)',
        borderRadius:   '0 8px 8px 0',
        padding:        '12px 14px',
        boxShadow:      '0 0 24px rgba(125,216,255,0.1)',
      }}>
        <p style={{ ...mono, color: 'rgba(125,216,255,0.5)', margin: '0 0 4px' }}>
          {cfg.lobe}
        </p>
        <p style={{ color: '#f0f4ff', fontSize: 14, fontWeight: 600, margin: '0 0 10px', lineHeight: 1.2 }}>
          {cfg.label}
        </p>
        <ul style={{ margin: '0 0 10px', padding: '0 0 0 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {cfg.hologramBullets.map((b, i) => (
            <li key={i} style={{ color: 'rgba(240,244,255,0.6)', fontSize: 11, lineHeight: 1.6 }}>
              {b}
            </li>
          ))}
        </ul>
        <p style={{ ...mono, color: 'rgba(125,216,255,0.4)', margin: 0 }}>
          ask me →
        </p>
      </div>
    </Html>
  )
}
