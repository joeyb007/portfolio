'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect, useReducer, Suspense } from 'react'
import ScrollContent from '@/components/ScrollContent'
import { CONTENT_SECTIONS, type SectionId } from '@/lib/regionMap'
import { modeReducer, initialModeState, resolveInitialMode, readSavedMode, saveMode } from '@/lib/mode'
import ChatBar from '@/components/ChatBar'
import ChatThread, { type ChatMessage } from '@/components/ChatThread'
import HologramCard from '@/components/HologramCard'
import PyramidOverlay from '@/components/PyramidOverlay'
import Hero from '@/components/Hero'
import RecruiterDoc from '@/components/RecruiterDoc'
import ModeToggle from '@/components/ModeToggle'

// If the GLB never loads, the reveal never completes; unstick the UI after this long.
const REVEAL_FALLBACK_MS = 6000

const BrainCanvas = dynamic(() => import('@/components/BrainCanvas'), { ssr: false })

export default function Home() {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [uiVisible,        setUiVisible]        = useState(false)
  const [messages,      setMessages]      = useState<ChatMessage[]>([])
  const [chatLoading,   setChatLoading]   = useState(false)
  const [lobeScreenPos, setLobeScreenPos] = useState<[number, number] | null>(null)
  const [voiceEnabled,  setVoiceEnabled]  = useState(true)
  const [speaking,      setSpeaking]      = useState(false)
  const [cardEl, setCardEl] = useState<HTMLDivElement | null>(null)
  const [chatSectionId, setChatSectionId] = useState<SectionId | null>(null)  // last lobe a chat reply pointed at
  const [modeState, dispatch] = useReducer(modeReducer, initialModeState(null, false))

  const { mode, isMobile } = modeState
  const activeSectionId = CONTENT_SECTIONS[activeSectionIdx]
  const settled   = mode === 'animated' || mode === 'minimalistic'
  // Animated pages through sections, so one is always lit. Minimalistic has no
  // card to justify a lit lobe, so only a chat reply lights one.
  const brainSection = mode === 'animated' ? activeSectionId : chatSectionId
  // In Minimalistic the thread is a panel under the brain, so the brain lifts while a conversation is open.
  const brainSide = mode !== 'minimalistic' ? 'center' : messages.length > 0 ? 'right-up' : 'right'

  const revealDone = useCallback(() => {
    dispatch({ type: 'REVEAL_DONE' })
    setUiVisible(true)
  }, [])

  // Viewport, saved mode, and ?mode= are client-only: seed after mount to avoid a hydration mismatch.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    dispatch({ type: 'INIT', saved: resolveInitialMode(window.location.search, readSavedMode(), mq.matches), isMobile: mq.matches })
    const h = (e: MediaQueryListEvent) => dispatch({ type: 'SET_MOBILE', isMobile: e.matches })
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  // Mobile mounts no canvas, so there is no reveal to wait for. Desktop gets a safety timer.
  useEffect(() => {
    if (mode !== 'revealing') return
    const t = setTimeout(revealDone, isMobile ? 0 : REVEAL_FALLBACK_MS)
    return () => clearTimeout(t)
  }, [mode, isMobile, revealDone])

  useEffect(() => { if (modeState.saved) saveMode(modeState.saved) }, [modeState.saved])


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

  const handleSend = useCallback(async (text: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setChatLoading(true)

    try {
      // Build history in the format the backend expects
      const history = messages.map(m => ({ role: m.role, content: m.content }))

      const res = await fetch(`${(process.env.NEXT_PUBLIC_BACKEND_URL ?? '').replace(/\/$/, '')}/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, history, voice: voiceEnabled }),
      })

      if (res.status === 400) {
        // Input guardrail blocked the message
        setMessages(prev => [...prev, {
          id:      crypto.randomUUID(),
          role:    'assistant',
          content: "That's a bit outside what I can speak to. Ask me about Joseph's work, projects, or background.",
          blocked: true,
        }])
        return
      }

      if (!res.ok) throw new Error(`Backend error ${res.status}`)

      const data = await res.json()

      // Navigate brain to the relevant section if one was returned
      if (data.sectionId) { goTo(data.sectionId); setChatSectionId(data.sectionId) }

      setMessages(prev => [...prev, {
        id:        crypto.randomUUID(),
        role:      'assistant',
        content:   data.reply,
        sectionId: data.sectionId ?? undefined,
        audio:     data.audio   ?? undefined,
      }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, {
        id:      crypto.randomUUID(),
        role:    'assistant',
        content: "Something went wrong on my end. Try again in a moment.",
      }])
    } finally {
      setChatLoading(false)
    }
  }, [messages, goTo, voiceEnabled])

  return (
    <>
      {!isMobile && (
        <Suspense fallback={null}>
          <BrainCanvas
            activeSection={brainSection}
            onRegionClick={goTo}
            onRevealDone={revealDone}
            isMobile={isMobile}
            speaking={speaking}
            brainSide={brainSide}
            onLobeScreenPos={(x, y) => setLobeScreenPos([x, y])}
          />
        </Suspense>
      )}

      {mode === 'animated' && <ScrollContent onNext={goNext} onPrev={goPrev} />}

      {/* All UI fades in after brain reveal completes */}
      <div style={{
        opacity:    uiVisible ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: uiVisible ? 'auto' : 'none',
      }}>

        {mode === 'animated' && <Hero isMobile={isMobile} hidden={messages.length > 0} />}

        {mode === 'minimalistic' && <RecruiterDoc opacity={1} interactive isMobile={isMobile} />}

        {mode === 'animated' && !isMobile && activeSectionId && (
          <HologramCard ref={setCardEl} sectionId={activeSectionId} visible={true} isMobile={isMobile} />
        )}

        {mode === 'animated' && !isMobile && lobeScreenPos && activeSectionId && (
          <PyramidOverlay lobe={lobeScreenPos} cardEl={cardEl} />
        )}

        {settled && (
          <>
            <ChatThread
              messages={messages}
              loading={chatLoading}
              isMobile={isMobile}
              onSpeaking={setSpeaking}
              placement={mode === 'minimalistic' ? 'panel' : 'float'}
            />
            <ChatBar
              onSend={handleSend}
              loading={chatLoading}
              voiceEnabled={voiceEnabled}
              onVoiceToggle={() => setVoiceEnabled(v => !v)}
              isMobile={isMobile}
            />
          </>
        )}

        {settled && !isMobile && (
          <ModeToggle mode={mode} onToggle={() => dispatch({ type: 'TOGGLE' })} />
        )}

      </div>
    </>
  )
}
