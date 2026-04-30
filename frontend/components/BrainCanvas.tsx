'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BrainPointCloud from './BrainPointCloud'
import ProjectorBeam from './ProjectorBeam'
import type { SectionId } from '@/lib/regionMap'

interface Props {
  activeSection: SectionId | null
  onRegionClick: (sectionId: SectionId) => void
}

export default function BrainCanvas({ activeSection, onRegionClick }: Props) {
  // isMobile starts false — must be loaded with ssr: false to avoid hydration mismatch
  const [isMobile,   setIsMobile]   = useState(false)
  const [revealDone, setRevealDone] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleRevealDone = () => setRevealDone(true)

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
        <ambientLight intensity={0.3} />

        <ProjectorBeam />

        <BrainPointCloud
          activeSection={activeSection}
          onRegionClick={onRegionClick}
          isMobile={isMobile}
          onRevealDone={handleRevealDone}
        />

        <OrbitControls
          enabled={revealDone}
          enablePan={false}
          enableZoom={!isMobile}
          autoRotate={revealDone}
          autoRotateSpeed={0.3}
          minDistance={1.5}
          maxDistance={6}
        />
      </Canvas>
    </div>
  )
}
