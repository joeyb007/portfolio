'use client'

import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { REGION_CONFIGS, SECTIONS, type SectionId } from '@/lib/regionMap'

// LABEL_PUSH: scalar multiplier on centroid position to push label outside brain surface.
// centroid is in local (pre-group-scale) space — multiply by 1.4 pushes ~40% further from origin.
const LABEL_PUSH = 1.4

interface Props {
  centroids: Partial<Record<SectionId, THREE.Vector3>>
  activeSection: SectionId | null
  onRegionClick: (sectionId: SectionId) => void
  isMobile: boolean
}

export default function BrainLabels({ centroids, activeSection, onRegionClick, isMobile }: Props) {
  if (isMobile) return null

  return (
    <>
      {SECTIONS.map((sectionId) => {
        const centroid = centroids[sectionId]
        if (!centroid || centroid.length() === 0) return null

        const cfg = REGION_CONFIGS[sectionId]
        const isActive = sectionId === activeSection
        const color = isActive ? cfg.color : '#a0c8f0'

        // Push label outward from origin along centroid direction
        const labelPos = centroid.clone().multiplyScalar(LABEL_PUSH)
        const labelVec: [number, number, number] = [labelPos.x, labelPos.y, labelPos.z]

        return (
          <group key={sectionId}>
            {/* Label text — no connecting line (it would pass through the brain) */}
            <Html
              position={labelVec}
              center={false}
              style={{ pointerEvents: 'auto' }}
            >
              <div
                onClick={() => onRegionClick(sectionId)}
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: color,
                  opacity: isActive ? 1.0 : 0.55,
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s, opacity 0.3s',
                  padding: '2px 4px',
                }}
              >
                {cfg.label}
              </div>
            </Html>
          </group>
        )
      })}
    </>
  )
}
