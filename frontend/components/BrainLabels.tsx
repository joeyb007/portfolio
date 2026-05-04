'use client'

import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { REGION_CONFIGS, SECTIONS, type SectionId } from '@/lib/regionMap'

// How far outside the brain surface to push each label, in GLTF world units.
// Brain range ≈ 0.146, so 0.07 pushes the label roughly halfway beyond the surface.
const PUSH_DIST = 0.07

interface Props {
  centroids:   Partial<Record<SectionId, THREE.Vector3>>
  brainCenter: THREE.Vector3
  activeSection: SectionId | null
  onRegionClick: (sectionId: SectionId) => void
  isMobile: boolean
}

export default function BrainLabels({ centroids, brainCenter, activeSection, onRegionClick, isMobile }: Props) {
  if (isMobile) return null

  return (
    <>
      {SECTIONS.map((sectionId) => {
        const centroid = centroids[sectionId]
        if (!centroid) return null

        const cfg      = REGION_CONFIGS[sectionId]
        const isActive = sectionId === activeSection
        const color    = isActive ? cfg.color : '#a0c8f0'

        // Push label outward from the brain's bbox centre along the lobe's centroid direction
        const dir      = centroid.clone().sub(brainCenter).normalize()
        const labelPos = centroid.clone().add(dir.multiplyScalar(PUSH_DIST))
        const pos: [number, number, number] = [labelPos.x, labelPos.y, labelPos.z]

        return (
          <group key={sectionId}>
            <Html position={pos} center={false} style={{ pointerEvents: 'auto' }}>
              <div
                onClick={() => onRegionClick(sectionId)}
                style={{
                  fontFamily:    'var(--font-geist-mono), monospace',
                  fontSize:      10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color,
                  opacity:       isActive ? 1.0 : 0.55,
                  cursor:        'pointer',
                  userSelect:    'none',
                  whiteSpace:    'nowrap',
                  transition:    'color 0.3s, opacity 0.3s',
                  padding:       '2px 4px',
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
