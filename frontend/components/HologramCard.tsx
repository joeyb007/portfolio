'use client'

import { useState, useEffect } from 'react'
import { REGION_CONFIGS, type SectionId } from '@/lib/regionMap'

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

// Corner reticle — small bracket in each corner for the targeting-HUD aesthetic
function Corner({ top, right, bottom, left }: { top?: number; right?: number; bottom?: number; left?: number }) {
  return (
    <div style={{
      position:    'absolute',
      top,  right, bottom, left,
      width:       10,
      height:      10,
      borderTop:   top    != null ? '1px solid rgba(125,216,255,0.6)' : undefined,
      borderBottom:bottom != null ? '1px solid rgba(125,216,255,0.6)' : undefined,
      borderLeft:  left   != null ? '1px solid rgba(125,216,255,0.6)' : undefined,
      borderRight: right  != null ? '1px solid rgba(125,216,255,0.6)' : undefined,
      pointerEvents: 'none',
    }} />
  )
}

export default function HologramCard({ sectionId, visible }: Props) {
  // Cross-fade when active section changes
  const [displayed,     setDisplayed]     = useState(sectionId)
  const [contentOpacity, setContentOpacity] = useState(1)

  useEffect(() => {
    if (displayed === sectionId) return
    setContentOpacity(0)
    const t = setTimeout(() => { setDisplayed(sectionId); setContentOpacity(1) }, 180)
    return () => clearTimeout(t)
  }, [sectionId, displayed])

  const cfg = REGION_CONFIGS[displayed]

  return (
    <div style={{
      position:             'fixed',
      right:                '5vw',
      top:                  '50%',
      transform:            'translateY(-50%)',
      zIndex:               15,
      width:                252,
      background:           'rgba(2,6,18,0.93)',
      backdropFilter:       'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border:               '1px solid rgba(125,216,255,0.2)',
      borderLeft:           '2px solid rgba(125,216,255,0.65)',
      borderRadius:         '0 6px 6px 0',
      padding:              '16px 16px',
      boxShadow:            '-4px 0 16px rgba(125,216,255,0.12), 0 0 40px rgba(125,216,255,0.05)',
      opacity:              visible ? 1 : 0,
      transition:           'opacity 0.4s ease',
      pointerEvents:        'none',
      overflow:             'hidden',
    }}>
      {/* Dot matrix overlay — gives the pixelated hologram projection texture */}
      <div style={{
        position:        'absolute',
        inset:           0,
        backgroundImage: 'radial-gradient(circle, rgba(125,216,255,0.065) 1px, transparent 1px)',
        backgroundSize:  '7px 7px',
        pointerEvents:   'none',
      }} />

      {/* Scan line overlay */}
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(125,216,255,0.012) 3px, rgba(125,216,255,0.012) 6px)',
        pointerEvents: 'none',
      }} />

      {/* Corner reticles */}
      <Corner top={5}    left={5} />
      <Corner top={5}    right={5} />
      <Corner bottom={5} left={5} />
      <Corner bottom={5} right={5} />

      {/* Content — fades when section changes */}
      <div style={{ opacity: contentOpacity, transition: 'opacity 0.18s ease' }}>
        <p style={{ ...mono, color: 'rgba(125,216,255,0.55)', margin: '0 0 2px' }}>
          ◆ {cfg.lobe}
        </p>
        <p style={{ color: '#e8f4ff', fontSize: 15, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          {cfg.label}
        </p>
        <p style={{ color: 'rgba(125,216,255,0.42)', fontSize: 10, lineHeight: 1.6, margin: '0 0 10px', fontStyle: 'italic' }}>
          {cfg.description}
        </p>

        <div style={{ borderTop: '1px solid rgba(125,216,255,0.1)', margin: '0 0 10px' }} />

        <ul style={{ margin: '0 0 12px', padding: '0 0 0 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {cfg.hologramBullets.map((b, i) => (
            <li key={i} style={{ color: 'rgba(240,244,255,0.72)', fontSize: 11, lineHeight: 1.5 }}>
              {b}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(125,216,255,0.25), transparent)' }} />
          <p style={{ ...mono, color: 'rgba(125,216,255,0.45)', margin: 0, fontSize: 8 }}>ask me →</p>
        </div>
      </div>
    </div>
  )
}
