'use client'

import type { CSSProperties } from 'react'
import type { SavedMode } from '@/lib/mode'

interface Props {
  onPick: (m: SavedMode) => void
}

const mono: CSSProperties = { fontFamily: 'var(--font-geist-mono), monospace' }

const OPTIONS: { mode: SavedMode; label: string; caption: string; side: 'left' | 'right' }[] = [
  { mode: 'minimalistic', label: 'Minimalistic', caption: 'one page, thirty seconds', side: 'left'  },
  { mode: 'animated',     label: 'Animated',     caption: 'scroll · click · talk',    side: 'right' },
]

export default function ModeChooser({ onPick }: Props) {
  return (
    <>
      <div
        aria-hidden
        style={{ position: 'fixed', top: 0, bottom: 0, left: '50vw', width: 0,
          borderLeft: '1px dashed var(--line)', pointerEvents: 'none', zIndex: 20 }}
      />
      {OPTIONS.map(opt => (
        <div
          key={opt.mode}
          style={{
            position: 'fixed', top: 0, bottom: 0, width: '50vw',
            [opt.side]: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: '14vh',
            pointerEvents: 'none',   // the brain behind must stay draggable
            zIndex: 20,
          }}
        >
          <button
            type="button"
            onClick={() => onPick(opt.mode)}
            style={{
              ...mono,
              pointerEvents:   'auto',
              fontSize:        11,
              letterSpacing:   '0.18em',
              textTransform:   'uppercase',
              color:           'var(--fg)',
              background:      'transparent',
              border:          '1px solid var(--line-2)',
              borderRadius:    4,
              padding:         '10px 22px',
              cursor:          'pointer',
              transition:      'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {opt.label}
          </button>
          <span style={{ ...mono, marginTop: 10, fontSize: 10, letterSpacing: '0.08em', color: 'var(--fg-3)' }}>
            {opt.caption}
          </span>
        </div>
      ))}
    </>
  )
}
