'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useRef, useLayoutEffect, Suspense } from 'react'
import ScrollContent from '@/components/ScrollContent'
import SlidePanel from '@/components/SlidePanel'
import ChatPanel from '@/components/ChatPanel'
import SectionCard from '@/components/SectionCard'
import SectionIndicator from '@/components/SectionIndicator'
import { CONTENT_SECTIONS, type SectionId } from '@/lib/regionMap'

const BrainCanvas = dynamic(() => import('@/components/BrainCanvas'), { ssr: false })

const PANEL_TITLES: Record<SectionId, string> = {
  about:      'About',
  experience: 'Experience',
  projects:   'Projects',
  blog:       'Blog',
  personal:   'Personal',
  contact:    'Contact',
}

export default function Home() {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [panelOpen,        setPanelOpen]        = useState<SectionId | null>(null)
  const [chatOpen,         setChatOpen]         = useState(false)

  const activeSectionId = CONTENT_SECTIONS[activeSectionIdx]

  const panelOpenRef = useRef<SectionId | null>(null)
  useLayoutEffect(() => { panelOpenRef.current = panelOpen }, [panelOpen])

  const goNext = useCallback(() => {
    setActiveSectionIdx((i) => (i + 1) % CONTENT_SECTIONS.length)
  }, [])

  const goPrev = useCallback(() => {
    setActiveSectionIdx((i) => (i - 1 + CONTENT_SECTIONS.length) % CONTENT_SECTIONS.length)
  }, [])

  const goTo = useCallback((sectionId: SectionId) => {
    const idx = CONTENT_SECTIONS.indexOf(sectionId)
    if (idx >= 0) setActiveSectionIdx(idx)
  }, [])

  const handleRegionClick = useCallback((sectionId: SectionId) => {
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

      {/* Hero */}
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
          Scroll to explore.
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

      {/* Floating chat button */}
      <button
        onClick={() => setChatOpen(true)}
        style={{
          position:        'fixed',
          bottom:          '2.5vh',
          left:            '5vw',
          zIndex:          20,
          display:         'flex',
          alignItems:      'center',
          gap:             8,
          background:      'rgba(5,10,20,0.8)',
          border:          '1px solid rgba(125,216,255,0.25)',
          borderRadius:    24,
          padding:         '8px 16px',
          color:           'rgba(125,216,255,0.8)',
          fontSize:        11,
          fontFamily:      'var(--font-geist-mono), monospace',
          letterSpacing:   '0.1em',
          textTransform:   'uppercase',
          cursor:          'pointer',
          backdropFilter:  'blur(12px)',
          transition:      'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(125,216,255,0.6)'
          e.currentTarget.style.color = 'rgba(125,216,255,1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(125,216,255,0.25)'
          e.currentTarget.style.color = 'rgba(125,216,255,0.8)'
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Chat with Joseph
      </button>

      {/* Section slide panel */}
      <SlidePanel
        open={panelOpen !== null}
        onClose={closePanel}
        title={panelOpen ? PANEL_TITLES[panelOpen] : ''}
      >
        {panelOpen ? (
          <p style={{ color: 'rgba(240,244,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>
            Content for <strong style={{ color: '#f0f4ff' }}>{panelOpen}</strong> coming in Phase 2.
          </p>
        ) : null}
      </SlidePanel>

      {/* Chat slide panel */}
      <SlidePanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title="Chat with Joseph"
      >
        <ChatPanel />
      </SlidePanel>
    </>
  )
}
