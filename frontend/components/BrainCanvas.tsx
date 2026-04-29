'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BrainPointCloud from './BrainPointCloud'
import type { SectionId } from '@/lib/regionMap'

interface Props {
  activeSection: SectionId | null
  onRegionClick: (sectionId: SectionId) => void
}

export default function BrainCanvas({ activeSection, onRegionClick }: Props) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        opacity: isMobile ? 0.3 : 1,
        pointerEvents: isMobile ? 'none' : 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.3, 4.2], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <ambientLight intensity={0.5} />
        <BrainPointCloud
          activeSection={activeSection}
          onRegionClick={onRegionClick}
          isMobile={isMobile}
        />
        <OrbitControls
          enablePan={false}
          enableZoom={!isMobile}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={2.5}
          maxDistance={7}
        />
      </Canvas>
    </div>
  )
}
