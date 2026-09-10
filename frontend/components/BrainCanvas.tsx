'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import BrainPointCloud, { type BrainLayout } from './BrainPointCloud'
import type { SectionId } from '@/lib/regionMap'

export type BrainSide = 'center' | 'right'

// World-unit translation and scale per side, at the default camera
// (z = 5.5, fov 35). Module-level so the object identity is stable.
const LAYOUTS: Record<BrainSide, BrainLayout> = {
  center: { offset: [0, 0, 0],   scale: 1 },
  right:  { offset: [1.8, 0, 0], scale: 0.85 },
}

const TARGET_SPEED = 6  // matches BrainPointCloud's layout lerp so target and brain move together

// Projects the active lobe centroid to screen coordinates every frame
// and fires onScreenPos so the parent can draw the SVG pyramid overlay.
// `centroid` is in the brain group's LOCAL frame; it is transformed through
// the group's live matrixWorld so the projection tracks the layout lerp.
function LobeTracker({
  centroid,
  groupRef,
  onScreenPos,
}: {
  centroid:    [number, number, number]
  groupRef:    React.RefObject<THREE.Group | null>
  onScreenPos: (x: number, y: number) => void
}) {
  const { camera, size } = useThree()
  const vec   = useMemo(() => new THREE.Vector3(), [])
  const cbRef = useRef(onScreenPos)
  useEffect(() => { cbRef.current = onScreenPos })

  useFrame(() => {
    const group = groupRef.current
    if (!group) return
    group.updateWorldMatrix(true, false)  // group moved this frame; don't wait for render
    vec.set(...centroid).applyMatrix4(group.matrixWorld).project(camera)
    const x = (vec.x + 1) / 2 * size.width
    const y = (1 - vec.y) / 2 * size.height
    cbRef.current(x, y)
  })

  return null
}

// Renders OrbitControls, keeps the orbit target on the brain as it slides,
// and auto-levels the polar angle back to PI/2 after the user stops dragging.
// Must live inside Canvas to access useFrame.
function AutoLevelControls({
  enabled,
  targetOffset,
}: {
  enabled:      boolean
  targetOffset: [number, number, number]
}) {
  const controlsRef        = useRef<OrbitControlsImpl>(null)
  const lastInteractionRef = useRef(0)  // epoch ms of last drag end; 0 = never
  const strengthRef        = useRef(0)  // 0→1 ease-in so leveling isn't abrupt
  const targetRef          = useRef(targetOffset)
  useEffect(() => { targetRef.current = targetOffset })
  const { size } = useThree()

  useFrame((state, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const cam    = state.camera as THREE.PerspectiveCamera
    const target = controls.target as THREE.Vector3

    // 1. Glide the orbit target toward the brain's layout offset. OrbitControls
    //    keeps the camera's spherical offset, so the camera translates with it.
    const [tx, ty, tz] = targetRef.current
    if (Math.abs(target.x - tx) + Math.abs(target.y - ty) + Math.abs(target.z - tz) > 1e-4) {
      const k = Math.min(1, delta * TARGET_SPEED)
      target.x += (tx - target.x) * k
      target.y += (ty - target.y) * k
      target.z += (tz - target.z) * k
      const was = controls.autoRotate
      controls.autoRotate = false   // avoid a second auto-rotate step this frame
      controls.update()
      controls.autoRotate = was
    }

    // 2. OrbitControls always looks AT the target, which would put the brain at
    //    screen centre. Shift the projection window instead so the target lands
    //    where a world-space translation of `target.x` would have appeared with
    //    the camera still aimed at the origin: ndc = x / (dist * tan(fov/2) * aspect).
    const dist = cam.position.distanceTo(target)
    const halfW = dist * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * cam.aspect
    const ndcX = halfW > 0 ? target.x / halfW : 0
    if (Math.abs(ndcX) > 1e-4) {
      cam.setViewOffset(size.width, size.height, -ndcX * size.width / 2, 0, size.width, size.height)
    } else if (cam.view?.enabled) {
      cam.clearViewOffset()
    }

    // 3. Auto-level after the user lets go.
    if (!enabled) return

    const elapsed = Date.now() - lastInteractionRef.current
    if (elapsed < 1500) {
      strengthRef.current = 0  // reset while user is still active
      return
    }

    // Gradually ramp up leveling strength over ~0.6 s
    strengthRef.current = Math.min(1, strengthRef.current + delta * 1.6)

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
  activeSection:    SectionId | null
  onRegionClick:    (sectionId: SectionId) => void
  onRevealDone?:    () => void
  isMobile:         boolean
  speaking?:        boolean
  brainSide?:       BrainSide
  onLobeScreenPos?: (x: number, y: number) => void
}

export default function BrainCanvas({
  activeSection,
  onRegionClick,
  onRevealDone,
  isMobile,
  speaking,
  brainSide = 'center',
  onLobeScreenPos,
}: Props) {
  const [revealDone, setRevealDone] = useState(false)
  const [centroids,  setCentroids]  = useState<Record<SectionId, [number, number, number]> | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const layout   = LAYOUTS[brainSide]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0.3, isMobile ? 9 : 5.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <ambientLight intensity={0.3} />

        <BrainPointCloud
          activeSection={activeSection}
          onRegionClick={onRegionClick}
          isMobile={isMobile}
          speaking={speaking}
          layout={layout}
          groupRef={groupRef}
          onRevealDone={() => { setRevealDone(true); onRevealDone?.() }}
          onCentroidsReady={setCentroids}
        />

        {centroids && activeSection && revealDone && onLobeScreenPos && (
          <LobeTracker
            centroid={centroids[activeSection]}
            groupRef={groupRef}
            onScreenPos={onLobeScreenPos}
          />
        )}

        <AutoLevelControls enabled={revealDone && !isMobile} targetOffset={layout.offset} />
      </Canvas>
    </div>
  )
}
