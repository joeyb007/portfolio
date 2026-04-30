'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useRef, useEffect } from 'react'
import ScrollContent from '@/components/ScrollContent'
import Section from '@/components/Section'
import SlidePanel from '@/components/SlidePanel'
import ChatPanel from '@/components/ChatPanel'
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

const card: React.CSSProperties = {
  pointerEvents: 'auto',
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: 12,
  padding: '28px 36px',
  maxWidth: 460,
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono)',
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#64748b',
  marginBottom: 8,
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)
  const [panelOpen, setPanelOpen] = useState<SectionId | null>(null)

  const panelOpenRef = useRef<SectionId | null>(null)

  const handleSectionChange = useCallback((sectionId: SectionId) => {
    // Don't shift brain highlight while a panel is open
    if (panelOpenRef.current === null) setActiveSection(sectionId)
  }, [])

  const handleRegionClick = useCallback((sectionId: SectionId) => {
    setActiveSection(sectionId)
    const cfg = REGION_CONFIGS[sectionId]
    if (cfg.isChatbot) {
      setPanelOpen('chatbot')
      return
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    // Defer panel open until after SlidePanel's 350ms transition settles
    setTimeout(() => setPanelOpen(sectionId), 400)
  }, [])

  const closePanel = useCallback(() => setPanelOpen(null), [])

  useEffect(() => {
    panelOpenRef.current = panelOpen
  }, [panelOpen])

  return (
    <>
      <BrainCanvas activeSection={activeSection} onRegionClick={handleRegionClick} />

      <ScrollContent onSectionChange={handleSectionChange}>
        {(registerRef) => (
          <>
            {/* Hero */}
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '0 5vw 10vh',
                pointerEvents: 'none',
              }}
            >
              <div style={card}>
                <p style={mono}>AI Engineer · MLE</p>
                <h1
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 700,
                    margin: '0 0 12px',
                    lineHeight: 1.1,
                    color: '#1e293b',
                  }}
                >
                  Joseph Barbosa
                </h1>
                <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  Building intelligent systems. Explore my brain to navigate.
                </p>
              </div>
            </div>

            {/* Content sections */}
            {CONTENT_SECTIONS.map((id) => (
              <Section
                key={id}
                sectionId={id}
                ref={registerRef(id)}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '0 5vw',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{ ...card, cursor: 'pointer' }}
                    onClick={() => handleRegionClick(id)}
                  >
                    <p style={mono}>{REGION_CONFIGS[id].label}</p>
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        margin: '0 0 8px',
                        color: '#1e293b',
                      }}
                    >
                      {PANEL_TITLES[id]}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                      Click to open →
                    </p>
                  </div>
                </div>
              </Section>
            ))}
          </>
        )}
      </ScrollContent>

      <SlidePanel
        open={panelOpen !== null}
        onClose={closePanel}
        title={panelOpen ? PANEL_TITLES[panelOpen] : ''}
      >
        {panelOpen === 'chatbot' ? (
          <ChatPanel />
        ) : panelOpen ? (
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>
            Content for <strong>{panelOpen}</strong> coming in Phase 2.
          </p>
        ) : null}
      </SlidePanel>
    </>
  )
}
