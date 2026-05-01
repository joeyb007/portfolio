'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import {
  getSectionForPoint,
  SECTIONS,
  type SectionId,
} from '@/lib/regionMap'
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
}

interface SetupResult {
  entries:       PointsEntry[]
  groupPosition: [number, number, number]
  groupScale:    number
  centroids:     Partial<Record<SectionId, THREE.Vector3>>
}

function buildBlueBrain(scene: THREE.Object3D): SetupResult {
  scene.updateMatrixWorld(true)

  // Bounding box for centering — use setFromObject (fast, no manual traversal)
  const box = new THREE.Box3().setFromObject(scene)
  const center = new THREE.Vector3()
  box.getCenter(center)
  const sz = new THREE.Vector3()
  box.getSize(sz)
  const range = Math.max(sz.x, sz.y, sz.z) / 2 || 1
  const s = TARGET_RADIUS / range

  const centroidSums   = Object.fromEntries(SECTIONS.map((id) => [id, new THREE.Vector3()])) as Record<SectionId, THREE.Vector3>
  const centroidCounts = Object.fromEntries(SECTIONS.map((id) => [id, 0]))                   as Record<SectionId, number>

  const entries: PointsEntry[] = []
  const _v = new THREE.Vector3()

  scene.traverse((obj) => {
    if (!(obj as THREE.Points).isPoints) return
    const pts  = obj as THREE.Points
    const pos  = pts.geometry.attributes.position
    const col  = pts.geometry.attributes.color as THREE.BufferAttribute | undefined
    const count = pos.count

    // Fall back to the object's own material color if no vertex colors
    let matR = 0.5, matG = 0.5, matB = 0.9
    const rawMat = Array.isArray(pts.material) ? pts.material[0] : pts.material
    if (rawMat && (rawMat as THREE.PointsMaterial).color) {
      const mc = (rawMat as THREE.PointsMaterial).color
      matR = mc.r; matG = mc.g; matB = mc.b
    }

    // Subsample if the object is very large (> 30 k verts) to keep useMemo fast
    const step   = count > 30_000 ? Math.ceil(count / 30_000) : 1
    const kept   = Math.ceil(count / step)
    const wPos   = new Float32Array(kept * 3)
    const wColor = new Float32Array(kept * 3)
    const centroid = new THREE.Vector3()
    let wi = 0

    for (let i = 0; i < count; i += step) {
      _v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(pts.matrixWorld)
      wPos[wi * 3]     = _v.x
      wPos[wi * 3 + 1] = _v.y
      wPos[wi * 3 + 2] = _v.z
      centroid.add(_v)

      if (col) {
        remapRedToBlue(col.getX(i), col.getY(i), col.getZ(i), wColor, wi * 3)
      } else {
        remapRedToBlue(matR, matG, matB, wColor, wi * 3)
      }
      wi++
    }
    centroid.divideScalar(wi)

    const nx = (centroid.x - center.x) / range
    const ny = (centroid.y - center.y) / range
    const nz = (centroid.z - center.z) / range
    const sectionId = getSectionForPoint(nx, ny, nz)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(wPos.slice(0, wi * 3), 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(wColor.slice(0, wi * 3), 3))

    entries.push({ geometry: geo, sectionId })
    centroidSums[sectionId].add(centroid)
    centroidCounts[sectionId]++
  })

  const centroids: Partial<Record<SectionId, THREE.Vector3>> = {}
  SECTIONS.forEach((id) => {
    if (centroidCounts[id] > 0)
      centroids[id] = centroidSums[id].divideScalar(centroidCounts[id])
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

  const materials = useMemo(
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

  useEffect(() => {
    return () => {
      entries.forEach((e) => e.geometry.dispose())
      Object.values(materials).forEach((m) => m.dispose())
    }
  }, [entries, materials])

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

    SECTIONS.forEach((sectionId) => {
      const mat      = materials[sectionId]
      const isActive = sectionId === activeSection
      mat.opacity += ((isActive ? 1.0 : 0.65) - mat.opacity) * Math.min(1, delta * 5)
      mat.size    += ((isActive ? ACTIVE_SIZE : BASE_SIZE) - mat.size)    * Math.min(1, delta * 5)
    })
  })

  return (
    <group ref={groupRef}>
      {entries.map((entry, i) => (
        <points
          key={i}
          geometry={entry.geometry}
          material={materials[entry.sectionId]}
        />
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
