'use client'

import { useEffect, useRef, useState, useId } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    background:        '#0a0e14',
    primaryColor:       'rgba(0,220,255,0.12)',
    primaryTextColor:    '#fff',
    primaryBorderColor:  'rgba(0,220,255,0.5)',
    lineColor:           'rgba(0,220,255,0.5)',
    secondaryColor:      'rgba(0,220,255,0.06)',
    tertiaryColor:       'rgba(0,220,255,0.04)',
    fontFamily:          'var(--font-geist-mono), monospace',
  },
})

export default function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '-')
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    mermaid.render(`mermaid-${id}`, chart).then(({ svg }) => setSvg(svg))
  }, [chart, id])

  return (
    <div
      ref={containerRef}
      style={{
        margin: '0 0 18px', padding: 16, borderRadius: 6, overflowX: 'auto',
        background: 'rgba(0,220,255,0.04)', border: '1px solid rgba(0,220,255,0.18)',
        display: 'flex', justifyContent: 'center',
      }}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}
