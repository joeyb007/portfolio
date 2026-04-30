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
  // Ref keeps the callback stable — observers don't need to be recreated when it changes
  const onSectionChangeRef = useRef(onSectionChange)
  useEffect(() => { onSectionChangeRef.current = onSectionChange })

  const registerRef = useCallback(
    (id: SectionId) => (el: HTMLElement | null) => {
      if (el) sectionRefs.current[id] = el
      else if (process.env.NODE_ENV === 'development' && !el) {
        // Section ref was not registered — element may have mounted after observers were created
        console.warn(`[ScrollContent] ref for section "${id}" was null at registration time`)
      }
    },
    []
  )

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    CONTENT_SECTIONS.forEach((sectionId) => {
      const el = sectionRefs.current[sectionId]
      if (!el) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[ScrollContent] no element found for section "${sectionId}" — observer skipped`)
        }
        return
      }
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) onSectionChangeRef.current(sectionId) },
        { threshold: 0.4 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, []) // empty deps — stable via ref

  return (
    <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
      {/* Children must set pointer-events: auto on interactive elements */}
      {children(registerRef)}
    </div>
  )
}
