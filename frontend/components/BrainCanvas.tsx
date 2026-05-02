'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import BrainPointCloud from './BrainPointCloud'
import type { SectionId } from '@/lib/regionMap'

// Renders OrbitControls and auto-levels the polar angle back to PI/2 after
// the user stops dragging. Must live inside Canvas to access useFrame.
function AutoLevelControls({ enabled }: { enabled: boolean }) {
  const controlsRef        = useRef<any>(null)
  const lastInteractionRef = useRef(Date.now())
  const strengthRef        = useRef(0)  // 0→1 ease-in so leveling isn't abrupt

  useFrame((state, delta) => {
    const controls = controlsRef.current
    if (!controls || !enabled) return

    const elapsed = Date.now() - lastInteractionRef.current
    if (elapsed < 1500) {
      strengthRef.current = 0  // reset while user is still active
      return
    }

    // Gradually ramp up leveling strength over ~0.6 s
    strengthRef.current = Math.min(1, strengthRef.current + delta * 1.6)

    const cam    = state.camera
    const target = controls.target as THREE.Vector3
    const offset = new THREE.Vector3().subVectors(cam.position, target)
    const radius = offset.length()

    const currentPhi = Math.acos(THREE.MathUtils.clamp(offset.y / radius, -1, 1))
    if (Math.abs(currentPhi - Math.PI / 2) < 0.005) return

    const speed  = 1.8 * strengthRef.current
    const newPhi = THREE.MathUtils.lerp(currentPhi, Math.PI / 2, delta * speed)
    const theta  = Math.atan2(offset.x, offset.z)

    cam.position.set(
      target.x + radius * Math.sin(newPhi) * Math.sin(theta),
      target.y + radius * Math.cos(newPhi),
      target.z + radius * Math.sin(newPhi) * Math.cos(theta),
    )
    cam.lookAt(target)

    const was = controls.autoRotate
    controls.autoRotate = false
    controls.update()
    controls.autoRotate = was
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      enablePan={false}
      enableZoom={false}
      autoRotate={enabled}
      autoRotateSpeed={0.8}
      minDistance={1.5}
      maxDistance={6}
      onEnd={() => { lastInteractionRef.current = Date.now(); strengthRef.current = 0 }}
    />
  )
}

interface Props {
  activeSection: SectionId | null
  onRegionClick: (sectionId: SectionId) => void
}

export default function BrainCanvas({ activeSection, onRegionClick }: Props) {
  const [isMobile,   setIsMobile]   = useState(false)
  const [revealDone, setRevealDone] = useState(false)

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
        <ambientLight intensity={0.3} />

        <BrainPointCloud
          activeSection={activeSection}
          onRegionClick={onRegionClick}
          isMobile={isMobile}
          onRevealDone={() => setRevealDone(true)}
        />

        <AutoLevelControls enabled={revealDone} />
      </Canvas>
    </div>
  )
}
