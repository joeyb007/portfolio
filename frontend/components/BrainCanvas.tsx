'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import BrainPointCloud, { type BrainLayout } from './BrainPointCloud'
import type { SectionId } from '@/lib/regionMap'

export type BrainSide = 'center' | 'right' | 'right-up'

// Where the brain sits on screen per side. `screenX` is the brain centre in
// NDC (-1 left … +1 right) and is applied as a camera view offset, so it holds
// at any aspect ratio; the brain and the orbit target both stay at the origin.
// Module-level so the object identity is stable.
interface SideLayout { screenX: number; screenY: number; brain: BrainLayout }
const LAYOUTS: Record<BrainSide, SideLayout> = {
  center:     { screenX: 0,   screenY: 0,    brain: { scale: 1 } },
  right:      { screenX: 0.5, screenY: 0,    brain: { scale: 0.8 } },   // centred in the right half (75 % of the viewport width), mirroring the doc in the left half
  'right-up': { screenX: 0.5, screenY: 0.5,  brain: { scale: 0.52 } },  // lifted and shrunk so the chat panel fits beneath it with breathing room
}

const SHIFT_SPEED = 6  // matches BrainPointCloud's layout lerp so shift and scale move together

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

// Renders OrbitControls, slides the projection window so the brain parks at
// `screenX`, and auto-levels the polar angle back to PI/2 after the user stops
// dragging. Must live inside Canvas to access useFrame.
function AutoLevelControls({
  enabled,
  screenX,
  screenY,
}: {
  enabled: boolean
  screenX: number   // brain centre in NDC x; 0 = viewport centre, +1 = right edge
  screenY: number   // brain centre in NDC y; 0 = viewport centre, +1 = top edge
}) {
  const controlsRef        = useRef<OrbitControlsImpl>(null)
  const lastInteractionRef = useRef(0)  // epoch ms of last drag end; 0 = never
  const strengthRef        = useRef(0)  // 0→1 ease-in so leveling isn't abrupt
  const shiftRef           = useRef({ x: 0, y: 0 })  // current NDC shift, lerped toward screenX/Y
  const targetRef          = useRef({ x: screenX, y: screenY })
  useEffect(() => { targetRef.current = { x: screenX, y: screenY } })
  const { size } = useThree()

  useFrame((state, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const cam    = state.camera as THREE.PerspectiveCamera
    const target = controls.target as THREE.Vector3

    // 1. OrbitControls always looks AT its target (the origin, where the brain
    //    is), so to park the brain off-centre we shift the projection window
    //    rather than move anything in world space. A negative x offset shows a
    //    region to the left of centre, which moves the brain right. Because
    //    the shift is in the projection matrix, camera.project() stays correct
    //    for LobeTracker and pointer picking.
    const sh = shiftRef.current, k = Math.min(1, delta * SHIFT_SPEED)
    sh.x += (targetRef.current.x - sh.x) * k
    sh.y += (targetRef.current.y - sh.y) * k
    if (Math.abs(sh.x) > 1e-4 || Math.abs(sh.y) > 1e-4) {
      // A positive y offset shows a region below centre, which moves the brain up.
      cam.setViewOffset(size.width, size.height, -sh.x * size.width / 2, sh.y * size.height / 2, size.width, size.height)
    } else if (cam.view?.enabled) {
      cam.clearViewOffset()
    }

    // 2. Auto-level after the user lets go.
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

  // On phones the reveal plays full-strength, then the brain settles into a
  // faint, slowly rotating backdrop behind the doc. Pointer events are off so
  // the page scrolls normally over it.
  const backdrop = isMobile && revealDone

  return (
    <div style={{
      position:      'fixed',
      inset:         0,
      zIndex:        0,
      opacity:       backdrop ? 0.22 : 1,
      transition:    'opacity 1.4s ease',
      pointerEvents: isMobile ? 'none' : 'auto',
    }}>
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
          layout={layout.brain}
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

        <AutoLevelControls enabled={revealDone} screenX={layout.screenX} screenY={layout.screenY} />
      </Canvas>
    </div>
  )
}
