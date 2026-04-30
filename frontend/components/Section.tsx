import { forwardRef } from 'react'
import type { SectionId } from '@/lib/regionMap'

interface Props {
  sectionId: SectionId
  children: React.ReactNode
  style?: React.CSSProperties
}

const Section = forwardRef<HTMLElement, Props>(function Section(
  { sectionId, children, style },
  ref
) {
  return (
    <section
      ref={ref}
      id={sectionId}
      data-section={sectionId}
      className="section"
      style={style}
    >
      {children}
    </section>
  )
})

export default Section
