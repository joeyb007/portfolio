'use client'

import { useEffect, useRef } from 'react'
import { REGION_CONFIGS, CONTENT_SECTIONS, type SectionId } from '@/lib/regionMap'

const PANEL_TITLES: Record<SectionId, string> = {
  about:      'About',
  experience: 'Experience',
  skills:     'Skills',
  projects:   'Projects',
  blog:       'Blog',
  personal:   'Personal',
  chatbot:    'Chat with Joseph',
  contact:    'Contact',
}

interface Props {
  activeSectionId: SectionId
  onOpen: (sectionId: SectionId) => void
}

export default function SectionCard({ activeSectionId, onOpen }: Props) {
  const prevRef = useRef<SectionId | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    if (prevRef.current === activeSectionId) return

    // Slide in from right on section change
    cardRef.current.style.transition = 'none'
    cardRef.current.style.opacity    = '0'
    cardRef.current.style.transform  = 'translateX(40px)'
    // Force reflow then animate in
    void cardRef.current.offsetHeight
    cardRef.current.style.transition = 'opacity 0.35s ease, transform 0.35s ease'
    cardRef.current.style.opacity    = '1'
    cardRef.current.style.transform  = 'translateX(0)'

    prevRef.current = activeSectionId
  }, [activeSectionId])

  const cfg   = REGION_CONFIGS[activeSectionId]
  const title = PANEL_TITLES[activeSectionId]

  return (
    <div
      ref={cardRef}
      onClick={() => onOpen(activeSectionId)}
      style={{
        position:             'fixed',
        right:                '5vw',
        top:                  '50%',
        transform:            'translateY(-50%)',
        zIndex:               10,
        width:                'min(380px, 42vw)',
        background:           'rgba(5, 10, 20, 0.75)',
        backdropFilter:       'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border:               '1px solid rgba(255,255,255,0.08)',
        borderLeft:           `2px solid ${cfg.color}`,
        borderRadius:         12,
        padding:              '28px 32px',
        cursor:               'pointer',
        pointerEvents:        'auto',
      }}
    >
      <p style={{
        fontFamily:    'var(--font-geist-mono), monospace',
        fontSize:      10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color:         cfg.color,
        margin:        '0 0 10px',
      }}>
        {cfg.label}
      </p>
      <h2 style={{
        fontSize:   22,
        fontWeight: 600,
        color:      '#f0f4ff',
        margin:     '0 0 8px',
        lineHeight: 1.2,
      }}>
        {title}
      </h2>
      <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: 12, margin: 0 }}>
        Click to open →
      </p>
    </div>
  )
}
