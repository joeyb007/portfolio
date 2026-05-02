'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useRef, useLayoutEffect, Suspense } from 'react'
import ScrollContent from '@/components/ScrollContent'
import SlidePanel from '@/components/SlidePanel'
import ChatPanel from '@/components/ChatPanel'
import SectionCard from '@/components/SectionCard'
import SectionIndicator from '@/components/SectionIndicator'
import { REGION_CONFIGS, CONTENT_SECTIONS, type SectionId } from '@/lib/regionMap'

// ssr: false required — Three.js uses browser APIs unavailable in Node
const BrainCanvas = dynamic(() => import('@/components/BrainCanvas'), { ssr: false })

const PANEL_TITLES: Record<SectionId, string> = {
  about:      'About',
  experience: 'Experience',
  skills:     'Skills',
  projects:   'Projects',
  blog:       'Blog',
  personal:   'Personal',
  chatbot:    'Chat with Joseph',
  contact:    'Contact',
}

export default function Home() {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [panelOpen,        setPanelOpen]        = useState<SectionId | null>(null)

  const activeSectionId = CONTENT_SECTIONS[activeSectionIdx]

  const panelOpenRef = useRef<SectionId | null>(null)
  useLayoutEffect(() => { panelOpenRef.current = panelOpen }, [panelOpen])

  const goNext = useCallback(() => {
    setActiveSectionIdx((i) => Math.min(i + 1, CONTENT_SECTIONS.length - 1))
  }, [])

  const goPrev = useCallback(() => {
    setActiveSectionIdx((i) => Math.max(i - 1, 0))
  }, [])

  const goTo = useCallback((sectionId: SectionId) => {
    const idx = CONTENT_SECTIONS.indexOf(sectionId)
    if (idx >= 0) setActiveSectionIdx(idx)
  }, [])

  const handleRegionClick = useCallback((sectionId: SectionId) => {
    const cfg = REGION_CONFIGS[sectionId]
    if (cfg.isChatbot) {
      setPanelOpen('chatbot')
      return
    }
    goTo(sectionId)
    setTimeout(() => setPanelOpen(sectionId), 400)
  }, [goTo])

  const handleCardOpen = useCallback((sectionId: SectionId) => {
    setPanelOpen(sectionId)
  }, [])

  const closePanel = useCallback(() => setPanelOpen(null), [])

  return (
    <>
      <Suspense fallback={null}>
        <BrainCanvas
          activeSection={activeSectionId}
          onRegionClick={handleRegionClick}
        />
      </Suspense>

      <ScrollContent onNext={goNext} onPrev={goPrev} />

      {/* Hero — always visible bottom-left */}
      <div
        style={{
          position:      'fixed',
          left:          '5vw',
          bottom:        '10vh',
          zIndex:        10,
          pointerEvents: 'none',
          maxWidth:      360,
        }}
      >
        <p style={{
          fontFamily:    'var(--font-geist-mono), monospace',
          fontSize:      10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'rgba(78,207,255,0.7)',
          margin:        '0 0 8px',
        }}>
          Builder · MLE · AI Engineer
        </p>
        <h1 style={{
          fontSize:   'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 700,
          color:      '#f0f4ff',
          margin:     '0 0 8px',
          lineHeight: 1.1,
        }}>
          Joseph Barbosa
        </h1>
        <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          Scroll or click a region to explore.
        </p>
      </div>

      <SectionCard
        activeSectionId={activeSectionId}
        onOpen={handleCardOpen}
      />

      <SectionIndicator
        activeSectionId={activeSectionId}
        onDotClick={goTo}
      />

      <SlidePanel
        open={panelOpen !== null}
        onClose={closePanel}
        title={panelOpen ? PANEL_TITLES[panelOpen] : ''}
      >
        {panelOpen === 'chatbot' ? (
          <ChatPanel />
        ) : panelOpen ? (
          <p style={{ color: 'rgba(240,244,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>
            Content for <strong style={{ color: '#f0f4ff' }}>{panelOpen}</strong> coming in Phase 2.
          </p>
        ) : null}
      </SlidePanel>
    </>
  )
}
