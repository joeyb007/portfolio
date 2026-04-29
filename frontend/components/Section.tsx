import { forwardRef } from 'react'
import type { SectionId } from '@/lib/regionMap'

interface Props {
  sectionId: SectionId
  children: React.ReactNode
  className?: string
}

const Section = forwardRef<HTMLElement, Props>(function Section(
  { sectionId, children, className = '' },
  ref
) {
  return (
    <section
      ref={ref}
      id={sectionId}
      data-section={sectionId}
      className={`min-h-screen flex items-center ${className}`}
    >
      {children}
    </section>
  )
})

export default Section
