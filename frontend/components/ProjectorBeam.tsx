'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { readToken, GLOW_FALLBACK } from '@/lib/theme'

// Renders the projector cone + base flare below the brain.
// Position y=-2.5 places it below the brain's centred origin.
export default function ProjectorBeam() {
  const glow = useMemo(() => readToken('--glow', GLOW_FALLBACK), [])
  return (
    <group position={[0, -2.5, 0]}>
      {/* Upward-pointing cone — open top (openEnded: true) */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.9, 2.0, 32, 1, true]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Flare disc at projector source */}
      <mesh>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
