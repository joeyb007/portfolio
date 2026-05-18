'use client'

interface Props {
  lobe:   [number, number]
  cardEl: HTMLDivElement | null
}

// Renders a hologram projector cone from the active lobe to the card's left edge.
export default function PyramidOverlay({ lobe, cardEl }: Props) {
  if (!cardEl) return null

  const rect = cardEl.getBoundingClientRect()

  // Cone: apex at lobe, base spans the full left edge of the card
  const ax = lobe[0]
  const ay = lobe[1]
  const bx = rect.left
  const bt = rect.top
  const bb = rect.bottom
  const bMid = (bt + bb) / 2

  // Distance from lobe to card mid-left (for gradient radius)
  const dist = Math.hypot(bx - ax, bMid - ay)

  const gradId  = 'coneGrad'
  const glowId  = 'lineGlow'
  const pts     = `${ax},${ay} ${bx},${bt} ${bx},${bb}`

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
      <defs>
        {/* Cone fill: ambient glow matching the card's 70px outer shadow */}
        <radialGradient
          id={gradId}
          cx={ax} cy={ay} r={dist}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#00dcff" stopOpacity={0.12} />
          <stop offset="50%"  stopColor="#00dcff" stopOpacity={0.04} />
          <stop offset="100%" stopColor="#00dcff" stopOpacity={0}    />
        </radialGradient>

        {/*
          Two-layer glow: tight pass (stdDeviation 3) mirrors the card's 14px
          tight glow; wide pass (stdDeviation 10) mirrors the 36px ambient glow.
        */}
        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3"  in="SourceGraphic" result="tight" />
          <feGaussianBlur stdDeviation="10" in="SourceGraphic" result="wide"  />
          <feMerge>
            <feMergeNode in="wide"         />
            <feMergeNode in="tight"        />
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Edge line gradients: lobe end matches card's 0.55 tight glow, card end fades */}
        <linearGradient id="edgeGradTop" x1={ax} y1={ay} x2={bx} y2={bt} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#00dcff" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#00dcff" stopOpacity={0.12} />
        </linearGradient>
        <linearGradient id="edgeGradBot" x1={ax} y1={ay} x2={bx} y2={bb} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#00dcff" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#00dcff" stopOpacity={0.12} />
        </linearGradient>
      </defs>

      {/* Cone fill */}
      <polygon points={pts} fill={`url(#${gradId})`} />

      {/* Edge lines with glow */}
      <line
        x1={ax} y1={ay} x2={bx} y2={bt}
        stroke="url(#edgeGradTop)" strokeWidth={1}
        filter={`url(#${glowId})`}
      />
      <line
        x1={ax} y1={ay} x2={bx} y2={bb}
        stroke="url(#edgeGradBot)" strokeWidth={1}
        filter={`url(#${glowId})`}
      />

      {/* Dot at the lobe apex — brightness matches the card's 14px tight glow */}
      <circle
        cx={ax} cy={ay} r={2.5}
        fill="#00dcff" fillOpacity={0.9}
        filter={`url(#${glowId})`}
      />
    </svg>
  )
}
