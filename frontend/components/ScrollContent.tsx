'use client'

import { useRef, useEffect, useCallback } from 'react'
import { CONTENT_SECTIONS, type SectionId } from '@/lib/regionMap'

interface Props {
  onSectionChange: (sectionId: SectionId) => void
  children: (
    registerRef: (id: SectionId) => (el: HTMLElement | null) => void
  ) => React.ReactNode
}

export default function ScrollContent({ onSectionChange, children }: Props) {
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLElement>>>({})

  const registerRef = useCallback(
    (id: SectionId) => (el: HTMLElement | null) => {
      if (el) sectionRefs.current[id] = el
    },
    []
  )

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    CONTENT_SECTIONS.forEach((sectionId) => {
      const el = sectionRefs.current[sectionId]
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) onSectionChange(sectionId) },
        { threshold: 0.4 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [onSectionChange])

  return (
    <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
      {children(registerRef)}
    </div>
  )
}
