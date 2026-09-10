'use client'

import { useEffect, useRef, useState } from 'react'
import type { SavedMode } from '@/lib/mode'

interface Props {
  mode:     SavedMode
  onToggle: () => void
}

const SCAN_MS = 480   // keep in sync with the mode-scan keyframes in globals.css

// Corner chip showing the current mode. When `mode` changes, a scanline sweeps
// down the chip, wiping the old word out and the new one in (the same scan the
// brain uses to reveal itself). Both words share one grid cell so the chip is
// always as wide as the longer one and never reflows.
export default function ModeToggle({ mode, onToggle }: Props) {
  const [shown, setShown] = useState<SavedMode>(mode)   // word currently on screen
  const scanning = mode !== shown                        // a swap is in flight until the timer lands
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!scanning) return
    timer.current = setTimeout(() => setShown(mode), SCAN_MS)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [mode, scanning])

  const other: SavedMode = shown === 'minimalistic' ? 'animated' : 'minimalistic'

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={scanning}
      aria-pressed={mode === 'minimalistic'}
      aria-label={`Switch to ${other} mode`}
      title={`Switch to ${other} mode`}
      className="mode-chip"
      style={{
        position:      'fixed',
        top:           20,
        right:         24,
        zIndex:        30,
        display:       'grid',
        fontFamily:    'var(--font-geist-mono), monospace',
        fontSize:      10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color:         'var(--fg)',
        background:    'color-mix(in srgb, var(--surface) 90%, transparent)',
        border:        '1px solid var(--line-2)',
        borderRadius:  4,
        padding:       '9px 14px',
        cursor:        scanning ? 'default' : 'pointer',
        lineHeight:    1,
        whiteSpace:    'nowrap',
        overflow:      'hidden',
        textAlign:     'center',
      }}
    >
      {/* current word: wiped out top→bottom while scanning */}
      <span
        aria-hidden
        style={{ gridArea: '1 / 1', animation: scanning ? `mode-scan-out ${SCAN_MS}ms linear forwards` : undefined }}
      >
        {shown}
      </span>
      {/* incoming word: wiped in top→bottom while scanning, hidden otherwise */}
      <span
        aria-hidden
        style={{ gridArea: '1 / 1', clipPath: 'inset(0 0 100% 0)', animation: scanning ? `mode-scan-in ${SCAN_MS}ms linear forwards` : undefined }}
      >
        {other}
      </span>
      {/* the scanline itself */}
      <span
        aria-hidden
        style={{
          position:   'absolute',
          left:       0,
          right:      0,
          top:        -2,
          height:     1,
          background: 'var(--fg)',
          boxShadow:  '0 0 6px var(--glow)',
          opacity:    0,
          animation:  scanning ? `mode-scan-line ${SCAN_MS}ms linear forwards` : undefined,
        }}
      />
    </button>
  )
}
