'use client'

import { useRef, useMemo } from 'react'
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

function extractRegionBuckets(scene: THREE.Object3D): RegionBucket[] {
  const allVerts: THREE.Vector3[] = []

  scene.updateMatrixWorld(true)
  scene.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return
    const mesh = obj as THREE.Mesh
    const pos = mesh.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i))
      v.applyMatrix4(mesh.matrixWorld)
      allVerts.push(v)
    }
  })

  // Subsample to MAX_POINTS
  const step = allVerts.length > MAX_POINTS ? Math.ceil(allVerts.length / MAX_POINTS) : 1
  const sampled = allVerts.filter((_, i) => i % step === 0)

  // Normalize to [-1, 1] using bounding box
  const box = new THREE.Box3()
  sampled.forEach((v) => box.expandByPoint(v))
  const center = new THREE.Vector3()
  box.getCenter(center)
  const size = new THREE.Vector3()
  box.getSize(size)
  const range = Math.max(size.x, size.y, size.z) / 2 || 1

  const rawBuckets: Record<SectionId, number[]> = Object.fromEntries(
    SECTIONS.map((s) => [s, []])
  ) as Record<SectionId, number[]>

  sampled.forEach((v) => {
    const nx = (v.x - center.x) / range
    const ny = (v.y - center.y) / range
    const nz = (v.z - center.z) / range
    const section = getSectionForPoint(nx, ny, nz)
    rawBuckets[section].push(v.x, v.y, v.z)
  })

  return SECTIONS.map((sectionId) => ({
    sectionId,
    positions: new Float32Array(rawBuckets[sectionId]),
  }))
}

interface Props {
  activeSection: SectionId | null
  onRegionClick: (sectionId: SectionId) => void
  isMobile: boolean
}

export default function BrainPointCloud({ activeSection, onRegionClick, isMobile }: Props) {
  const { scene } = useGLTF('/brain.glb')
  const glowTexture = useMemo(() => createGlowTexture(), [])

  const regionBuckets = useMemo(() => extractRegionBuckets(scene), [scene])

  // Ghost mesh — clone with near-transparent material
  const ghostScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        ;(obj as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.04,
          depthWrite: false,
        })
      }
    })
    return clone
  }, [scene])

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

  // Per-region materials (mutated in useFrame)
  const materials = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((sectionId) => [
          sectionId,
          new THREE.PointsMaterial({
            size: 0.013,
            map: glowTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            color: new THREE.Color('#c8dcff'),
            opacity: 0.6,
          }),
        ])
      ) as Record<SectionId, THREE.PointsMaterial>,
    [glowTexture]
  )

  useFrame((_, delta) => {
    SECTIONS.forEach((sectionId) => {
      const mat = materials[sectionId]
      const isActive = sectionId === activeSection
      const isChatbotActive = sectionId === 'chatbot' && activeSection === 'chatbot'

      const targetOpacity = isActive ? 1.0 : 0.45
      const targetSize = isActive ? 0.022 : 0.012
      const targetColor = isActive
        ? new THREE.Color(REGION_CONFIGS[sectionId].color)
        : new THREE.Color('#c8dcff')

      const speed = isChatbotActive ? 8 : 4 // faster pulse for chatbot

      mat.opacity += (targetOpacity - mat.opacity) * Math.min(1, delta * speed)
      mat.size += (targetSize - mat.size) * Math.min(1, delta * speed)
      mat.color.lerp(targetColor, Math.min(1, delta * speed))
    })
  })

  return (
    <group>
      <primitive object={ghostScene} />
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
