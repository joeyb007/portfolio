'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Props {
  onNext: () => void
  onPrev: () => void
  children?: React.ReactNode
}

// Replaces the IntersectionObserver model with a wheel/keyboard/swipe
// event handler that fires onNext / onPrev, debounced at 600ms.
export default function ScrollContent({ onNext, onPrev, children }: Props) {
  const cooldownRef = useRef(false)
  const touchStartY = useRef(0)
  const onNextRef   = useRef(onNext)
  const onPrevRef   = useRef(onPrev)

  useEffect(() => { onNextRef.current = onNext })
  useEffect(() => { onPrevRef.current = onPrev })

  const trigger = useCallback((direction: 'next' | 'prev') => {
    if (cooldownRef.current) return
    cooldownRef.current = true
    setTimeout(() => { cooldownRef.current = false }, 600)
    if (direction === 'next') onNextRef.current()
    else onPrevRef.current()
  }, [])

  useEffect(() => {
    const insideScrollable = (target: EventTarget | null): boolean => {
      let node = target as HTMLElement | null
      while (node && node !== document.body) {
        const ov = window.getComputedStyle(node).overflowY
        if ((ov === 'auto' || ov === 'scroll') && node.scrollHeight > node.clientHeight) return true
        node = node.parentElement
      }
      return false
    }

    const onWheel = (e: WheelEvent) => {
      if (insideScrollable(e.target)) return
      e.preventDefault()
      if (Math.abs(e.deltaY) < 10) return
      trigger(e.deltaY > 0 ? 'next' : 'prev')
    }

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); trigger('next') }
      if (['ArrowUp',   'PageUp'  ].includes(e.key)) { e.preventDefault(); trigger('prev') }
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(delta) < 40) return
      trigger(delta > 0 ? 'next' : 'prev')
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('keydown',    onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('keydown',    onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [trigger])

  return <>{children}</>
}
