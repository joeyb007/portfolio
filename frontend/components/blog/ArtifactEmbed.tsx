'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { STUDEAL_ARTIFACTS, type StudealArtifactName } from './studealArtifacts'

// Maps the artifacts' theme hooks (--ink/--muted/--accent) onto the site palette.
const themeVars = {
  '--ink': 'rgba(225,245,255,0.92)',
  '--muted': 'rgba(160,205,235,0.55)',
  '--accent': '#00dcff',
} as CSSProperties

export default function ArtifactEmbed({ name }: { name: StudealArtifactName }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host || host.dataset.activated) return
    host.dataset.activated = 'true'
    // Scripts inserted via dangerouslySetInnerHTML are inert; recreate them so they run.
    host.querySelectorAll('script').forEach((inert) => {
      const script = document.createElement('script')
      script.textContent = inert.textContent
      inert.replaceWith(script)
    })
  }, [])

  return (
    <div
      ref={ref}
      style={themeVars}
      dangerouslySetInnerHTML={{ __html: STUDEAL_ARTIFACTS[name] }}
    />
  )
}
