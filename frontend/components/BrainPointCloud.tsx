'use client'

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import {
  getSectionForPoint,
  REGION_CONFIGS,
  SECTIONS,
  type SectionId,
} from '@/lib/regionMap'

const MAX_POINTS = 15_000
const TARGET_RADIUS = 1.3  // world-unit radius brain fills at camera z=4.2, fov=35

function createGlowTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(180,210,255,0.7)')
  g.addColorStop(1, 'rgba(100,160,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

interface RegionBucket {
  sectionId: SectionId
  positions: Float32Array
}

interface ExtractionResult {
  buckets: RegionBucket[]
  groupPosition: [number, number, number]  // -scale*center, centers rotation pivot
  groupScale: number                        // TARGET_RADIUS / range
}

const _targetColor = new THREE.Color()
const _idleColor = new THREE.Color('#4a7fbf')   // visible mid-blue on light bg

function extractRegionBuckets(scene: THREE.Object3D): ExtractionResult {
  // Count total vertices first (cheap — no allocation) so we can stride during collection
  let totalVerts = 0
  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) totalVerts += (obj as THREE.Mesh).geometry.attributes.position.count
  })

  const step = totalVerts > MAX_POINTS ? Math.ceil(totalVerts / MAX_POINTS) : 1
  const sampled: THREE.Vector3[] = []
  const _v = new THREE.Vector3()
  let globalIdx = 0

  scene.updateMatrixWorld(true)
  scene.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return
    const mesh = obj as THREE.Mesh
    const pos = mesh.geometry.attributes.position
    for (let i = 0; i < pos.count; i++, globalIdx++) {
      if (globalIdx % step !== 0) continue          // skip — subsample during traversal
      _v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(mesh.matrixWorld)
      sampled.push(_v.clone())
    }
  })

  // Normalize to [-1, 1] using bounding box
  const box = new THREE.Box3()
  sampled.forEach((v) => box.expandByPoint(v))
  const center = new THREE.Vector3()
  box.getCenter(center)
  const size = new THREE.Vector3()
  box.getSize(size)
  const range = Math.max(size.x, size.y, size.z) / 2 || 1

  const rawBuckets = Object.fromEntries(
    SECTIONS.map((s) => [s, [] as number[]])
  ) as Record<SectionId, number[]>

  sampled.forEach((v) => {
    const nx = (v.x - center.x) / range
    const ny = (v.y - center.y) / range
    const nz = (v.z - center.z) / range
    const section = getSectionForPoint(nx, ny, nz)
    rawBuckets[section].push(v.x, v.y, v.z)
  })

  const s = TARGET_RADIUS / range

  return {
    buckets: SECTIONS.map((sectionId) => ({
      sectionId,
      positions: new Float32Array(rawBuckets[sectionId]),
    })),
    // T(P)*S*v = P + s*v = s*v - s*center = s*(v-center) ✓
    groupPosition: [-s * center.x, -s * center.y, -s * center.z],
    groupScale: s,
  }
}

interface Props {
  activeSection: SectionId | null
  onRegionClick: (sectionId: SectionId) => void
  isMobile: boolean
}

export default function BrainPointCloud({ activeSection, onRegionClick, isMobile }: Props) {
  const { scene } = useGLTF('/brain.glb')
  const glowTexture = useMemo(() => createGlowTexture(), [])

  // Debug: log bounding box so we can tune camera/scale
  useMemo(() => {
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    console.log('[Brain] center:', center, 'size:', size, 'groupScale will be:', (1.3 / (Math.max(size.x, size.y, size.z) / 2)).toFixed(3))
  }, [scene])

  const { buckets: regionBuckets, groupPosition, groupScale } = useMemo(
    () => extractRegionBuckets(scene),
    [scene]
  )

  // Ghost mesh — clone with near-transparent material
  const ghostScene = useMemo(() => {
    const clone = scene.clone(true)
    // scene.clone(true) shares geometry buffers — materials are replaced, geometry is read-only so sharing is safe
    const ghostMaterials: THREE.MeshBasicMaterial[] = []
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.04,
          depthWrite: false,
        })
        ;(obj as THREE.Mesh).material = mat
        ghostMaterials.push(mat)
      }
    })
    return { clone, ghostMaterials }
  }, [scene])

  useEffect(() => {
    return () => {
      ghostScene.ghostMaterials.forEach((m) => m.dispose())
    }
  }, [ghostScene])

  // Per-region geometries (stable references, not recreated on render)
  const geometries = useMemo(
    () =>
      Object.fromEntries(
        regionBuckets.map(({ sectionId, positions }) => {
          const geo = new THREE.BufferGeometry()
          geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
          return [sectionId, geo]
        })
      ) as Record<SectionId, THREE.BufferGeometry>,
    [regionBuckets]
  )

  // PointsMaterial.size is projection-space, not model-space — groupScale does not affect it.
  // At camera z≈4.2: gl_PointSize = size * (0.5 * canvasHeight / 4.2)
  // size=0.05 → ~10px per dot on a 900px canvas; tune up/down to taste.
  const baseSize   = 0.05
  const activeSize = 0.08

  // Per-region materials (mutated in useFrame)
  const materials = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((sectionId) => [
          sectionId,
          new THREE.PointsMaterial({
            size: baseSize,
            map: glowTexture,
            transparent: true,
            blending: THREE.NormalBlending,
            depthWrite: false,
            sizeAttenuation: true,
            alphaTest: 0.01,
            color: new THREE.Color('#4a7fbf'),
            opacity: 0.85,
          }),
        ])
      ) as Record<SectionId, THREE.PointsMaterial>,
    [glowTexture]
  )

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose())
      Object.values(materials).forEach((m) => m.dispose())
      glowTexture.dispose()
    }
  }, [geometries, materials, glowTexture])

  useFrame((_, delta) => {
    SECTIONS.forEach((sectionId) => {
      const mat = materials[sectionId]
      const isActive = sectionId === activeSection
      const isChatbotActive = isActive && sectionId === 'chatbot'

      const targetOpacity = isActive ? 1.0 : 0.75
      const targetSize = isActive ? activeSize : baseSize
      const targetColor = isActive
        ? _targetColor.set(REGION_CONFIGS[sectionId].color)
        : _idleColor

      const speed = isChatbotActive ? 8 : 4 // faster pulse for chatbot

      mat.opacity += (targetOpacity - mat.opacity) * Math.min(1, delta * speed)
      mat.size += (targetSize - mat.size) * Math.min(1, delta * speed)
      mat.color.lerp(targetColor, Math.min(1, delta * speed))
    })
  })

  return (
    <group position={groupPosition} scale={groupScale}>
      <primitive object={ghostScene.clone} />
      {SECTIONS.map((sectionId) => {
        const geo = geometries[sectionId]
        if (!geo || geo.attributes.position.count === 0) return null
        return (
          <points
            key={sectionId}
            geometry={geo}
            material={materials[sectionId]}
            onClick={() => { if (!isMobile) onRegionClick(sectionId) }}
            onPointerOver={() => { if (!isMobile) document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { document.body.style.cursor = 'auto' }}
          />
        )
      })}
    </group>
  )
}

useGLTF.preload('/brain.glb')
