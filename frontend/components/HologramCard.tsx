'use client'

import { useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { REGION_CONFIGS, type SectionId } from '@/lib/regionMap'

// Shared 3D position used by both this card and the beam endpoint in BrainCanvas.
// Both must reference the same point so the beam always visually connects.
export const CARD_WORLD_POSITION: [number, number, number] = [1.7, 0, 0]

interface Props {
  sectionId: SectionId
  visible:   boolean
}

const mono: React.CSSProperties = {
  fontFamily:    'var(--font-geist-mono), monospace',
  fontSize:      9,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

function Corner({ top, right, bottom, left }: { top?: number; right?: number; bottom?: number; left?: number }) {
  return (
    <div style={{
      position:    'absolute',
      top, right, bottom, left,
      width:       10,
      height:      10,
      borderTop:    top    != null ? '1px solid rgba(0,220,255,0.7)' : undefined,
      borderBottom: bottom != null ? '1px solid rgba(0,220,255,0.7)' : undefined,
      borderLeft:   left   != null ? '1px solid rgba(0,220,255,0.7)' : undefined,
      borderRight:  right  != null ? '1px solid rgba(0,220,255,0.7)' : undefined,
      pointerEvents: 'none',
    }} />
  )
}

export default function HologramCard({ sectionId, visible }: Props) {
  const [displayed,      setDisplayed]      = useState(sectionId)
  const [contentOpacity, setContentOpacity] = useState(1)

  useEffect(() => {
    if (displayed === sectionId) return
    setContentOpacity(0)
    const t = setTimeout(() => { setDisplayed(sectionId); setContentOpacity(1) }, 180)
    return () => clearTimeout(t)
  }, [sectionId, displayed])

  const cfg = REGION_CONFIGS[displayed]

  return (
    <Html
      position={CARD_WORLD_POSITION}
      center
      style={{ pointerEvents: 'none' }}
      zIndexRange={[10, 11]}
    >
      <div style={{
        width:      250,
        opacity:    visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        transform:  'perspective(400px) rotateY(-4deg)',
      }}>
        <div style={{
          background:           'rgba(0,200,240,0.04)',
          backdropFilter:       'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border:               '1px solid rgba(0,220,255,0.45)',
          borderRadius:         '10px',
          padding:              '16px',
          boxShadow: [
            '0 0 0 1px rgba(0,220,255,0.12)',
            '0 0 14px rgba(0,220,255,0.55)',
            '0 0 36px rgba(0,220,255,0.2)',
            '0 0 70px rgba(0,220,255,0.08)',
            'inset 0 0 24px rgba(0,220,255,0.05)',
          ].join(', '),
          position:   'relative',
          overflow:   'hidden',
        }}>
          {/* Scan lines */}
          <div style={{
            position:      'absolute',
            inset:         0,
            background:    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,220,255,0.025) 3px, rgba(0,220,255,0.025) 6px)',
            borderRadius:  'inherit',
            pointerEvents: 'none',
          }} />

          {/* Corner reticles */}
          <Corner top={5}    left={5} />
          <Corner top={5}    right={5} />
          <Corner bottom={5} left={5} />
          <Corner bottom={5} right={5} />

          {/* Content — cross-fades on section change */}
          <div style={{ opacity: contentOpacity, transition: 'opacity 0.18s ease' }}>
            <p style={{
              ...mono,
              color:      'rgba(0,220,255,0.7)',
              margin:     '0 0 3px',
              textShadow: '0 0 8px rgba(0,200,255,0.5)',
            }}>
              ◆ {cfg.lobe}
            </p>
            <p style={{
              color:        '#fff',
              fontSize:     15,
              fontWeight:   700,
              margin:       '0 0 6px',
              lineHeight:   1.1,
              letterSpacing: '-0.01em',
              textShadow:   '0 0 12px rgba(0,220,255,0.9)',
            }}>
              {cfg.label}
            </p>
            <p style={{
              color:      'rgba(150,230,255,0.55)',
              fontSize:   10,
              lineHeight: 1.6,
              margin:     '0 0 10px',
              fontStyle:  'italic',
            }}>
              {cfg.description}
            </p>

            <div style={{ borderTop: '1px solid rgba(0,220,255,0.15)', margin: '0 0 10px' }} />

            <ul style={{ margin: '0 0 12px', padding: '0 0 0 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {cfg.hologramBullets.map((b, i) => (
                <li key={i} style={{
                  color:      'rgba(200,240,255,0.85)',
                  fontSize:   11,
                  lineHeight: 1.5,
                  textShadow: '0 0 6px rgba(0,200,255,0.3)',
                }}>
                  {b}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(0,220,255,0.3), transparent)' }} />
              <p style={{ ...mono, color: 'rgba(0,220,255,0.5)', margin: 0, fontSize: 8 }}>ask me →</p>
            </div>
          </div>
        </div>
      </div>
    </Html>
  )
}
