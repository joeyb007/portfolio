'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import {
  getSectionForPoint,
  REGION_CONFIGS,
  SECTIONS,
  type SectionId,
} from '@/lib/regionMap'
import { holoVertex, holoFragment } from '@/lib/holoShader'
import BrainLabels from './BrainLabels'

const MAX_POINTS    = 15_000
const TARGET_RADIUS = 1.3
const BASE_SIZE     = 0.03
const ACTIVE_SIZE   = 0.05

const _targetColor = new THREE.Color()
const _idleColor   = new THREE.Color('#dff0ff')

function createGlowTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0,    'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(180,230,255,0.7)')
  g.addColorStop(1,    'rgba(100,200,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

interface RegionBucket {
  sectionId: SectionId
  positions: Float32Array
}

interface ExtractionResult {
  buckets:       RegionBucket[]
  centroids:     Partial<Record<SectionId, THREE.Vector3>>
  groupPosition: [number, number, number]
  groupScale:    number
}

function extractRegionBuckets(scene: THREE.Object3D): ExtractionResult {
  let totalVerts = 0
  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh)
      totalVerts += (obj as THREE.Mesh).geometry.attributes.position.count
  })

  const step = totalVerts > MAX_POINTS ? Math.ceil(totalVerts / MAX_POINTS) : 1
  const sampled: THREE.Vector3[] = []
  const _v = new THREE.Vector3()
  let globalIdx = 0

  scene.updateMatrixWorld(true)
  scene.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return
    const mesh = obj as THREE.Mesh
    const pos  = mesh.geometry.attributes.position
    for (let i = 0; i < pos.count; i++, globalIdx++) {
      if (globalIdx % step !== 0) continue
      _v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(mesh.matrixWorld)
      sampled.push(_v.clone())
    }
  })

  const box = new THREE.Box3()
  sampled.forEach((v) => box.expandByPoint(v))
  const center = new THREE.Vector3()
  box.getCenter(center)
  const size = new THREE.Vector3()
  box.getSize(size)
  const range = Math.max(size.x, size.y, size.z) / 2 || 1
  const s = TARGET_RADIUS / range

  const rawBuckets = Object.fromEntries(
    SECTIONS.map((id) => [id, [] as number[]])
  ) as Record<SectionId, number[]>

  const centroidSums = Object.fromEntries(
    SECTIONS.map((id) => [id, new THREE.Vector3()])
  ) as Record<SectionId, THREE.Vector3>
  const centroidCounts = Object.fromEntries(
    SECTIONS.map((id) => [id, 0])
  ) as Record<SectionId, number>

  sampled.forEach((v) => {
    const nx = (v.x - center.x) / range
    const ny = (v.y - center.y) / range
    const nz = (v.z - center.z) / range
    const section = getSectionForPoint(nx, ny, nz)
    rawBuckets[section].push(v.x, v.y, v.z)
    centroidSums[section].add(v)
    centroidCounts[section]++
  })

  const centroids: Partial<Record<SectionId, THREE.Vector3>> = {}
  SECTIONS.forEach((id) => {
    if (centroidCounts[id] > 0) {
      centroids[id] = centroidSums[id].divideScalar(centroidCounts[id])
    }
  })

  return {
    buckets: SECTIONS.map((sectionId) => ({
      sectionId,
      positions: new Float32Array(rawBuckets[sectionId]),
    })),
    centroids,
    groupPosition: [-s * center.x, -s * center.y, -s * center.z],
    groupScale:    s,
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
  const { scene }       = useGLTF('/brain.glb')
  const glowTexture     = useMemo(() => createGlowTexture(), [])
  const groupRef        = useRef<THREE.Group>(null)
  const revealRef       = useRef(0)
  const revealDoneRef   = useRef(false)
  const onRevealDoneRef = useRef(onRevealDone)
  useEffect(() => { onRevealDoneRef.current = onRevealDone })

  const { buckets: regionBuckets, centroids, groupPosition, groupScale } = useMemo(
    () => extractRegionBuckets(scene),
    [scene]
  )

  const ghostScene = useMemo(() => {
    const clone = scene.clone(true)
    const holoMaterials: THREE.ShaderMaterial[] = []
    clone.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return
      const mat = new THREE.ShaderMaterial({
        vertexShader:   holoVertex,
        fragmentShader: holoFragment,
        transparent:    true,
        depthWrite:     false,
        side:           THREE.DoubleSide,
        blending:       THREE.AdditiveBlending,
        uniforms: {
          uColor:  { value: new THREE.Color('#4ecfff') },
          uTime:   { value: 0 },
          uReveal: { value: 0 },
        },
      })
      ;(obj as THREE.Mesh).material = mat
      holoMaterials.push(mat)
    })
    return { clone, holoMaterials }
  }, [scene])

  useEffect(() => {
    return () => { ghostScene.holoMaterials.forEach((m) => m.dispose()) }
  }, [ghostScene])

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

  const materials = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((sectionId) => [
          sectionId,
          new THREE.PointsMaterial({
            size:            BASE_SIZE,
            map:             glowTexture,
            transparent:     true,
            blending:        THREE.AdditiveBlending,
            depthWrite:      false,
            sizeAttenuation: true,
            alphaTest:       0.01,
            color:           new THREE.Color('#dff0ff'),
            opacity:         0.5,
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

  useFrame((state, delta) => {
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
      groupRef.current.rotation.y += delta * (4.0 * (1 - ease))

      if (p >= 1) {
        revealDoneRef.current = true
        groupRef.current.position.set(...groupPosition)
        groupRef.current.scale.setScalar(groupScale)
        onRevealDoneRef.current()
      }
    }

    const elapsed = state.clock.elapsedTime
    ghostScene.holoMaterials.forEach((mat) => {
      mat.uniforms.uTime.value   = elapsed
      mat.uniforms.uReveal.value = revealRef.current
    })

    SECTIONS.forEach((sectionId) => {
      const mat       = materials[sectionId]
      const isActive  = sectionId === activeSection
      const isChatbot = isActive && sectionId === 'chatbot'
      const speed     = isChatbot ? 8 : 4

      mat.opacity += ((isActive ? 0.9 : 0.5) - mat.opacity) * Math.min(1, delta * speed)
      mat.size    += ((isActive ? ACTIVE_SIZE : BASE_SIZE) - mat.size) * Math.min(1, delta * speed)
      mat.color.lerp(
        isActive ? _targetColor.set(REGION_CONFIGS[sectionId].color) : _idleColor,
        Math.min(1, delta * speed)
      )
    })
  })

  return (
    <group
      ref={groupRef}
      position={[groupPosition[0], groupPosition[1] - 2.5, groupPosition[2]] as [number, number, number]}
      scale={groupScale * 0.01}
    >
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
