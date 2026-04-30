'use client'

import { Html, Line } from '@react-three/drei'
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
        const color = isActive ? cfg.color : '#ffffff'

        // Push label outward from origin along centroid direction
        const labelPos = centroid.clone().multiplyScalar(LABEL_PUSH)
        const dotPos: [number, number, number] = [centroid.x, centroid.y, centroid.z]
        const lineEnd: [number, number, number] = [labelPos.x, labelPos.y, labelPos.z]

        return (
          <group key={sectionId}>
            {/* Surface dot */}
            <mesh position={dotPos}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isActive ? 1.0 : 0.6}
              />
            </mesh>

            {/* Connecting line */}
            <Line
              points={[dotPos, lineEnd]}
              color={color}
              lineWidth={1}
              dashed={false}
              transparent
              opacity={isActive ? 0.8 : 0.4}
            />

            {/* Label text */}
            <Html
              position={lineEnd}
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
                  opacity: isActive ? 1.0 : 0.6,
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
