'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useRef, useLayoutEffect, Suspense } from 'react'
import ScrollContent from '@/components/ScrollContent'
import SlidePanel from '@/components/SlidePanel'
import ChatPanel from '@/components/ChatPanel'
import SectionCard from '@/components/SectionCard'
import SectionIndicator from '@/components/SectionIndicator'
import { CONTENT_SECTIONS, type SectionId } from '@/lib/regionMap'
import SectionContent from '@/components/SectionContent'

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
  const [uiVisible,        setUiVisible]        = useState(false)

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
          onRevealDone={() => setUiVisible(true)}
        />
      </Suspense>

      <ScrollContent onNext={goNext} onPrev={goPrev} />

      {/* All UI fades in after brain reveal completes */}
      <div style={{
        opacity:    uiVisible ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: uiVisible ? 'auto' : 'none',
      }}>

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
        <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>
          Scroll to explore.
        </p>

        {/* Social links */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', pointerEvents: 'auto' }}>
          {[
            {
              href:     'https://github.com/joeyb007',
              label:    'GitHub',
              download: false,
              icon:     <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
            },
            {
              href:     'https://linkedin.com/in/joseph-c-barbosa',
              label:    'LinkedIn',
              download: false,
              icon:     <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
            },
            {
              href:     'https://x.com/josephbarbosa00',
              label:    'X',
              download: false,
              icon:     <path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
            },
            {
              href:     'mailto:josephbarbosa416@gmail.com',
              label:    'Email',
              download: false,
              icon:     <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
            },
            {
              href:     '/resume.pdf',
              label:    'Resume',
              download: false,
              icon:     <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /><line x1="8" y1="9" x2="11" y2="9" /></>,
            },
          ].map(({ href, label, download, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') || download ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              download={download ? 'Joseph_Barbosa_Resume.pdf' : undefined}
              style={{
                color:      'rgba(240,244,255,0.35)',
                transition: 'color 0.2s',
                lineHeight: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(125,216,255,0.9)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,244,255,0.35)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
            </a>
          ))}
        </div>
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
        {panelOpen === 'blog' ? (
          <div>
            <p style={{ color: 'rgba(240,244,255,0.6)', fontSize: 14, lineHeight: 1.7, margin: '0 0 12px' }}>
              Writing on AI, ML systems, and whatever I&apos;m currently building or thinking about.
            </p>
            <p style={{
              display: 'inline-block',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(125,216,255,0.5)',
              border: '1px solid rgba(125,216,255,0.2)',
              borderRadius: 4,
              padding: '4px 10px',
            }}>
              Coming Soon
            </p>
          </div>
        ) : panelOpen ? (
          <SectionContent sectionId={panelOpen} onSectionOpen={setPanelOpen} />
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

      </div> {/* end fade-in wrapper */}
    </>
  )
}
