'use client'

import { CONTENT_SECTIONS, REGION_CONFIGS, type SectionId } from '@/lib/regionMap'

interface Props {
  activeSectionId: SectionId
  onDotClick: (sectionId: SectionId) => void
}

export default function SectionIndicator({ activeSectionId, onDotClick }: Props) {
  const activeIdx = CONTENT_SECTIONS.indexOf(activeSectionId)

  return (
    <div style={{
      position:      'fixed',
      bottom:        28,
      right:         '5vw',
      zIndex:        10,
      display:       'flex',
      gap:           8,
      alignItems:    'center',
      pointerEvents: 'auto',
    }}>
      {CONTENT_SECTIONS.map((sectionId, i) => {
        const isActive = i === activeIdx
        return (
          <button
            key={sectionId}
            onClick={() => onDotClick(sectionId)}
            title={REGION_CONFIGS[sectionId].label}
            style={{
              width:        isActive ? 20 : 6,
              height:       6,
              borderRadius: 3,
              border:       'none',
              background:   isActive ? REGION_CONFIGS[sectionId].color : 'rgba(255,255,255,0.25)',
              cursor:       'pointer',
              padding:      0,
              transition:   'width 0.3s ease, background 0.3s ease',
            }}
          />
        )
      })}
    </div>
  )
}
