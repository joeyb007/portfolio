'use client'

import { useEffect, useRef, useState, useId } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  // Mermaid needs literal hex; these mirror the Graphite tokens in app/globals.css.
  themeVariables: {
    background:          '#141517', // --bg
    primaryColor:        '#222327', // --surface-2
    primaryTextColor:    '#ececec', // --fg
    primaryBorderColor:  '#383a40', // --line-2
    lineColor:           '#383a40', // --line-2
    secondaryColor:      '#1b1c1f', // --surface
    tertiaryColor:       '#1b1c1f', // --surface
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
        background: 'var(--surface)', border: '1px solid var(--line)',
        display: 'flex', justifyContent: 'center',
      }}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}
