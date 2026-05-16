'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SECTIONS, type SectionId } from '@/lib/regionMap'

const TARGET_RADIUS = 1.3
const BASE_SIZE     = 0.04
const ACTIVE_SIZE   = 0.06

// Bottom-to-top scan order (0 = first to appear, 1 = last)
const REVEAL_ORDER: Record<string, number> = {
  contact:    0.00,   // cerebellum — lowest
  projects:   0.15,   // temporal posterior
  experience: 0.30,   // temporal anterior
  blog:       0.45,   // occipital
  about:      0.60,   // frontal
  personal:   0.80,   // parietal crown — highest
}

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
  centroids:     Record<SectionId, [number, number, number]>
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

  const posAcc = Object.fromEntries(SECTIONS.map(id => [id, [] as number[]])) as Record<SectionId, number[]>
  const colAcc = Object.fromEntries(SECTIONS.map(id => [id, [] as number[]])) as Record<SectionId, number[]>

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
    }
  })

  // Compute scene-space centroid for each lobe.
  // posAcc values are in the source model's world space.
  // The group applies: scene_pos = groupPosition + groupScale * posAcc_pos
  // Therefore: centroid_scene = s * (mean(posAcc[id]) - center)
  const centroids = {} as Record<SectionId, [number, number, number]>
  SECTIONS.forEach(id => {
    const pos = posAcc[id]
    if (pos.length === 0) { centroids[id] = [0, 0, 0]; return }
    const n = pos.length / 3
    let x = 0, y = 0, z = 0
    for (let i = 0; i < pos.length; i += 3) { x += pos[i]; y += pos[i + 1]; z += pos[i + 2] }
    centroids[id] = [
      -s * center.x + s * (x / n),
      -s * center.y + s * (y / n),
      -s * center.z + s * (z / n),
    ]
  })

  const entries: PointsEntry[] = SECTIONS.map(sectionId => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posAcc[sectionId]), 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(colAcc[sectionId]), 3))
    return { geometry: geo, sectionId }
  })

  const groupPosition: [number, number, number] = [-s * center.x, -s * center.y, -s * center.z]
  const groupScale = s

  return { entries, groupPosition, groupScale, centroids }
}

interface Props {
  activeSection:    SectionId | null
  onRegionClick:    (sectionId: SectionId) => void
  isMobile:         boolean
  onRevealDone:     () => void
  onCentroidsReady: (centroids: Record<SectionId, [number, number, number]>) => void
}

export default function BrainPointCloud({
  activeSection,
  onRegionClick,
  isMobile,
  onRevealDone,
  onCentroidsReady,
}: Props) {
  const { scene } = useGLTF('/brain.glb')
  const groupRef  = useRef<THREE.Group>(null)
  const revealRef       = useRef(0)
  const revealDoneRef   = useRef(false)
  const onRevealDoneRef = useRef(onRevealDone)
  useEffect(() => { onRevealDoneRef.current = onRevealDone })
  const onCentroidsReadyRef = useRef(onCentroidsReady)
  useEffect(() => { onCentroidsReadyRef.current = onCentroidsReady })

  const { entries, groupPosition, groupScale, centroids } = useMemo(
    () => buildBlueBrain(scene),
    [scene]
  )
  useEffect(() => { onCentroidsReadyRef.current(centroids) }, [centroids])

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
            transparent:     true,   // needed so opacity animates during reveal
            opacity:         0,      // starts invisible, scanned in during reveal
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

  useFrame((state, delta) => {
    if (!revealDoneRef.current && groupRef.current) {
      // Place at final position immediately — only the scanline animates
      groupRef.current.position.set(...groupPosition)
      groupRef.current.scale.setScalar(groupScale)

      revealRef.current = Math.min(1, revealRef.current + delta / 2.5)
      const p = revealRef.current

      // Hologram scanline — each section materialises bottom-to-top with flicker
      const elapsed = state.clock.elapsedTime
      SECTIONS.forEach((sectionId) => {
        const order        = REVEAL_ORDER[sectionId] ?? 0
        // section starts appearing when p crosses its order threshold
        const sectionP     = Math.max(0, Math.min(1, (p - order * 0.6) / 0.4))
        const base         = baseMaterials[sectionId]
        const glow         = glowMaterials[sectionId]

        base.opacity = sectionP

        // Flicker glow as each section scans in, then fade out
        const flicker  = sectionP > 0 && sectionP < 1
          ? Math.abs(Math.sin(elapsed * 22 + order * 8)) * 0.8
          : 0
        glow.opacity   = flicker * sectionP
        // reset color multiplier for reveal (no dim/bright yet)
        base.color.setScalar(1)
      })

      if (p >= 1) {
        revealDoneRef.current = true
        groupRef.current.position.set(...groupPosition)
        groupRef.current.scale.setScalar(groupScale)
        SECTIONS.forEach(id => {
          baseMaterials[id].opacity = 1
          glowMaterials[id].opacity = 0
        })
        onRevealDoneRef.current()
      }
      return  // skip normal highlight logic during reveal
    }

    const speed = 4
    SECTIONS.forEach((sectionId) => {
      const isActive  = sectionId === activeSection
      const base      = baseMaterials[sectionId]
      const glow      = glowMaterials[sectionId]
      const targetDim = isActive ? 1.0 : 0.45

      base.color.r += (targetDim - base.color.r) * Math.min(1, delta * speed)
      base.color.g += (targetDim - base.color.g) * Math.min(1, delta * speed)
      base.color.b += (targetDim - base.color.b) * Math.min(1, delta * speed)

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
    </group>
  )
}

useGLTF.preload('/brain.glb')
