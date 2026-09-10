'use client'

import type { SavedMode } from '@/lib/mode'

interface Props {
  mode:     SavedMode
  onToggle: () => void
}

export default function ModeToggle({ mode, onToggle }: Props) {
  const other: SavedMode = mode === 'minimalistic' ? 'animated' : 'minimalistic'
  const word = (m: SavedMode) => (
    <span style={{ color: mode === m ? 'var(--fg)' : 'var(--fg-3)', transition: 'color 0.2s ease' }}>{m}</span>
  )

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={mode === 'minimalistic'}
      aria-label={`Switch to ${other} mode`}
      title={`Switch to ${other} mode`}
      style={{
        position:      'fixed',
        top:           20,
        right:         24,
        zIndex:        30,
        fontFamily:    'var(--font-geist-mono), monospace',
        fontSize:      10,
        letterSpacing: '0.12em',
        color:         'var(--fg-3)',
        background:    'color-mix(in srgb, var(--surface) 80%, transparent)',
        border:        '1px solid var(--line-2)',
        borderRadius:  999,
        padding:       '6px 12px',
        cursor:        'pointer',
        lineHeight:    1,
        whiteSpace:    'nowrap',
      }}
    >
      <span aria-hidden style={{ marginRight: 6 }}>◐</span>
      {word('minimalistic')}
      <span style={{ margin: '0 6px' }}>·</span>
      {word('animated')}
    </button>
  )
}
