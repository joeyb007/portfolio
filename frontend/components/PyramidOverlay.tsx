'use client'

interface Props {
  lobe:   [number, number]          // projected screen position of active lobe
  cardEl: HTMLDivElement | null     // the card DOM element to measure
}

// Draws a blocky pyramid from the projected lobe point to each corner of the card.
// Each "edge" of the pyramid is rendered as pixel-snapped 3×3 squares at regular
// intervals — giving a voxel/hologram-block aesthetic.
export default function PyramidOverlay({ lobe, cardEl }: Props) {
  if (!cardEl) return null

  const rect    = cardEl.getBoundingClientRect()
  const sz      = 3   // square size in px
  const spacing = 9   // distance between squares along each edge

  const corners: [number, number][] = [
    [rect.left,  rect.top],
    [rect.left,  rect.bottom],
    [rect.right, rect.top],
    [rect.right, rect.bottom],
  ]

  return (
    <svg
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        12,
        overflow:      'visible',
      }}
    >
      {corners.flatMap(([cx, cy], ci) => {
        const dx  = cx - lobe[0]
        const dy  = cy - lobe[1]
        const len = Math.hypot(dx, dy)
        const n   = Math.floor(len / spacing)

        return Array.from({ length: n }, (_, j) => {
          const t     = (j + 1) / (n + 1)             // skip the endpoints themselves
          const x     = Math.round(lobe[0] + dx * t - sz / 2)
          const y     = Math.round(lobe[1] + dy * t - sz / 2)
          const alpha = (0.06 + (1 - t) * 0.32).toFixed(2)  // brighter near lobe

          return (
            <rect
              key={`${ci}-${j}`}
              x={x} y={y}
              width={sz} height={sz}
              fill={`rgba(0,220,255,${alpha})`}
            />
          )
        })
      })}
    </svg>
  )
}
