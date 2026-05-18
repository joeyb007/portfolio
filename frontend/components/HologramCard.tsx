'use client'

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

// Fixed screen positions for each lobe's signage card.
// Layout: Blog/Projects on left, About/Experience on right,
// Personal top-center, Contact bottom-right (above ChatBar).
const CARD_POSITIONS: Record<SectionId, React.CSSProperties> = {
  about:      { right: '1.5vw', top:    '15%' },
  experience: { right: '1.5vw', top:    '58%' },
  blog:       { left:  '1.5vw', top:    '15%' },
  projects:   { left:  '1.5vw', top:    '58%' },
  personal:   { left:  '50%',   top:    '2%',   transform: 'translateX(-50%)' },
  contact:    { right: '1.5vw', bottom: '80px' },
}

export default function HologramCard({ sectionId, visible }: Props) {
  const cfg = REGION_CONFIGS[sectionId]

  return (
    <div style={{
      position:             'fixed',
      ...CARD_POSITIONS[sectionId],
      zIndex:               15,
      width:                230,
      background:           'rgba(2,6,16,0.92)',
      backdropFilter:       'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border:               '1px solid rgba(125,216,255,0.2)',
      borderLeft:           '2px solid rgba(125,216,255,0.65)',
      borderRadius:         '0 8px 8px 0',
      padding:              '14px 16px',
      boxShadow:            '0 0 24px rgba(125,216,255,0.12), 0 0 60px rgba(125,216,255,0.04)',
      opacity:              visible ? 1 : 0,
      transition:           'opacity 0.4s ease',
      pointerEvents:        'none',
      overflow:             'hidden',
    }}>
      {/* Scan line overlay */}
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(125,216,255,0.014) 2px, rgba(125,216,255,0.014) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Lobe name */}
      <p style={{ ...mono, color: 'rgba(125,216,255,0.55)', margin: '0 0 2px' }}>
        ◆ {cfg.lobe}
      </p>

      {/* Section title */}
      <p style={{ color: '#e8f4ff', fontSize: 15, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
        {cfg.label}
      </p>

      {/* Brain metaphor description */}
      <p style={{ color: 'rgba(125,216,255,0.42)', fontSize: 10, lineHeight: 1.6, margin: '0 0 10px', fontStyle: 'italic' }}>
        {cfg.description}
      </p>

      <div style={{ borderTop: '1px solid rgba(125,216,255,0.1)', margin: '0 0 10px' }} />

      {/* Content bullets */}
      <ul style={{ margin: '0 0 12px', padding: '0 0 0 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {cfg.hologramBullets.map((b, i) => (
          <li key={i} style={{ color: 'rgba(240,244,255,0.7)', fontSize: 11, lineHeight: 1.5 }}>
            {b}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(125,216,255,0.2), transparent)' }} />
        <p style={{ ...mono, color: 'rgba(125,216,255,0.45)', margin: 0, fontSize: 8 }}>ask me →</p>
      </div>
    </div>
  )
}
