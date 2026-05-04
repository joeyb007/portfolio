'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SECTIONS, type SectionId } from '@/lib/regionMap'
import BrainLabels from './BrainLabels'

const TARGET_RADIUS = 1.3
const BASE_SIZE     = 0.04
const ACTIVE_SIZE   = 0.06

// Transfer "excess red" into the blue channel so red regions become blue,
// while blues, whites, and grays are unchanged — preserves all original structure.
function remapRedToBlue(r: number, g: number, b: number, out: Float32Array, i: number) {
  const redness = Math.max(0, r - b)
  out[i]     = r - redness
  out[i + 1] = g
  out[i + 2] = Math.min(1, b + redness)
}


interface PointsEntry {
  geometry:  THREE.BufferGeometry
  sectionId: SectionId
  centroid:  THREE.Vector3
}

interface SetupResult {
  entries:       PointsEntry[]
  groupPosition: [number, number, number]
  groupScale:    number
  centroids:     Partial<Record<SectionId, THREE.Vector3>>
}

// Assign a single vertex to a brain lobe based on its normalised XY position.
// XY is the camera-facing plane (X = horizontal, Y = vertical in viewport).
// Divides the brain into 6 distinct spatial regions:
//
//         ┌──────────────────┐
//         │   PERSONAL       │  ny > 0.38  (parietal crown)
//         ├─────────┬────────┤
//         │  BLOG   │ ABOUT  │  ny 0..0.38 (occipital / frontal)
//         ├─────────┼────────┤
//         │PROJECTS │EXPERIE.│  ny -0.3..0 (temporal post / ant)
//         ├──────────────────┤
//         │    CONTACT       │  ny < -0.3  (cerebellum)
//         └──────────────────┘
//
function lobeForVertex(nx: number, ny: number): SectionId {
  if (ny >  0.38) return 'personal'    // parietal crown
  if (ny < -0.30) return 'contact'     // cerebellum / lower
  if (ny >= 0) return nx >= 0 ? 'about'      : 'blog'        // frontal / occipital
  return              nx >= 0 ? 'experience' : 'projects'    // temporal ant / post
}

function buildBlueBrain(scene: THREE.Object3D): SetupResult {
  scene.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(scene)
  const center = new THREE.Vector3()
  box.getCenter(center)
  const sz = new THREE.Vector3()
  box.getSize(sz)
  const range = Math.max(sz.x, sz.y, sz.z) / 2 || 1
  const s = TARGET_RADIUS / range

  // Per-lobe accumulators — built per vertex, not per slice object
  const posAcc  = Object.fromEntries(SECTIONS.map(id => [id, [] as number[]])) as Record<SectionId, number[]>
  const colAcc  = Object.fromEntries(SECTIONS.map(id => [id, [] as number[]])) as Record<SectionId, number[]>
  const cSums   = Object.fromEntries(SECTIONS.map(id => [id, new THREE.Vector3()])) as Record<SectionId, THREE.Vector3>
  const cCounts = Object.fromEntries(SECTIONS.map(id => [id, 0])) as Record<SectionId, number>

  const _v  = new THREE.Vector3()
  const _cr = new Float32Array(3)

  scene.traverse((obj) => {
    if (!(obj as THREE.Points).isPoints) return
    const pts   = obj as THREE.Points
    const pos   = pts.geometry.attributes.position
    const col   = pts.geometry.attributes.color as THREE.BufferAttribute | undefined
    const count = pos.count

    let matR = 0.5, matG = 0.5, matB = 0.9
    const rawMat = Array.isArray(pts.material) ? pts.material[0] : pts.material
    if (rawMat && (rawMat as THREE.PointsMaterial).color) {
      const mc = (rawMat as THREE.PointsMaterial).color
      matR = mc.r; matG = mc.g; matB = mc.b
    }

    const step = count > 30_000 ? Math.ceil(count / 30_000) : 1

    for (let i = 0; i < count; i += step) {
      _v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(pts.matrixWorld)

      const nx = (_v.x - center.x) / range
      const ny = (_v.y - center.y) / range
      const id = lobeForVertex(nx, ny)

      posAcc[id].push(_v.x, _v.y, _v.z)

      if (col) remapRedToBlue(col.getX(i), col.getY(i), col.getZ(i), _cr, 0)
      else      remapRedToBlue(matR, matG, matB, _cr, 0)
      colAcc[id].push(_cr[0], _cr[1], _cr[2])

      cSums[id].add(_v)
      cCounts[id]++
    }
  })

  const entries: PointsEntry[] = SECTIONS.map(sectionId => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posAcc[sectionId]), 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(colAcc[sectionId]), 3))
    const centroid = cCounts[sectionId] > 0
      ? cSums[sectionId].clone().divideScalar(cCounts[sectionId])
      : center.clone()
    return { geometry: geo, sectionId, centroid }
  })

  const centroids: Partial<Record<SectionId, THREE.Vector3>> = {}
  SECTIONS.forEach(id => {
    if (cCounts[id] > 0) centroids[id] = cSums[id].clone().divideScalar(cCounts[id])
  })

  return {
    entries,
    groupPosition: [-s * center.x, -s * center.y, -s * center.z],
    groupScale:    s,
    centroids,
  }
}

interface Props {
  activeSection: SectionId | null
  onRegionClick: (sectionId: SectionId) => void
  isMobile:      boolean
  onRevealDone:  () => void
}

export default function BrainPointCloud({
  activeSection,
  onRegionClick,
  isMobile,
  onRevealDone,
}: Props) {
  const { scene } = useGLTF('/brain.glb')
  const groupRef  = useRef<THREE.Group>(null)
  const revealRef       = useRef(0)
  const revealDoneRef   = useRef(false)
  const onRevealDoneRef = useRef(onRevealDone)
  useEffect(() => { onRevealDoneRef.current = onRevealDone })

  const { entries, groupPosition, groupScale, centroids } = useMemo(
    () => buildBlueBrain(scene),
    [scene]
  )

  // Base layer — solid NormalBlending, vertex colors. Inactive sections are
  // dimmed via material.color multiplier so the active region stands out.
  const baseMaterials = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((sectionId) => [
          sectionId,
          new THREE.PointsMaterial({
            size:            BASE_SIZE,
            vertexColors:    true,
            transparent:     false,
            blending:        THREE.NormalBlending,
            depthWrite:      true,
            sizeAttenuation: true,
          }),
        ])
      ) as Record<SectionId, THREE.PointsMaterial>,
    []
  )

  // Glow layer — same geometry, AdditiveBlending, single uniform color.
  // Opacity goes 0 → 0.7 only on the active section, giving a consistent
  // highlight colour regardless of which region is selected.
  const glowMaterials = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((sectionId) => [
          sectionId,
          new THREE.PointsMaterial({
            size:            ACTIVE_SIZE * 1.4,
            color:           new THREE.Color('#7dd8ff'),
            transparent:     true,
            opacity:         0,
            blending:        THREE.AdditiveBlending,
            depthWrite:      false,
            sizeAttenuation: true,
          }),
        ])
      ) as Record<SectionId, THREE.PointsMaterial>,
    []
  )

  useEffect(() => {
    return () => {
      entries.forEach((e) => e.geometry.dispose())
      Object.values(baseMaterials).forEach((m) => m.dispose())
      Object.values(glowMaterials).forEach((m) => m.dispose())
    }
  }, [entries, baseMaterials, glowMaterials])

  useFrame((_, delta) => {
    if (!revealDoneRef.current && groupRef.current) {
      revealRef.current = Math.min(1, revealRef.current + delta / 2.5)
      const p      = revealRef.current
      const ease   = 1 - Math.pow(1 - p, 3)
      const scaleT = Math.min(1, p / 0.6)
      const scaleE = 1 - Math.pow(1 - scaleT, 3)

      groupRef.current.position.set(
        groupPosition[0],
        groupPosition[1] - 2.5 * (1 - ease),
        groupPosition[2]
      )
      groupRef.current.scale.setScalar(groupScale * (0.01 + 0.99 * scaleE))

      if (p >= 1) {
        revealDoneRef.current = true
        groupRef.current.position.set(...groupPosition)
        groupRef.current.scale.setScalar(groupScale)
        onRevealDoneRef.current()
      }
    }

    const speed = 4
    SECTIONS.forEach((sectionId) => {
      const isActive   = sectionId === activeSection
      const base       = baseMaterials[sectionId]
      const glow       = glowMaterials[sectionId]
      const targetDim  = isActive ? 1.0 : 0.45

      // Dim/brighten the base layer
      base.color.r += (targetDim - base.color.r) * Math.min(1, delta * speed)
      base.color.g += (targetDim - base.color.g) * Math.min(1, delta * speed)
      base.color.b += (targetDim - base.color.b) * Math.min(1, delta * speed)

      // Fade glow in/out
      glow.opacity += ((isActive ? 0.6 : 0) - glow.opacity) * Math.min(1, delta * speed)
    })
  })

  return (
    <group ref={groupRef}>
      {entries.map((entry, i) => (
        <group key={i}>
          <points geometry={entry.geometry} material={baseMaterials[entry.sectionId]} />
          <points geometry={entry.geometry} material={glowMaterials[entry.sectionId]} />
        </group>
      ))}
      <BrainLabels
        centroids={centroids}
        activeSection={activeSection}
        onRegionClick={onRegionClick}
        isMobile={isMobile}
      />
    </group>
  )
}

useGLTF.preload('/brain.glb')
