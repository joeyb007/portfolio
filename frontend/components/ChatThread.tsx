'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

export interface ChatMessage {
  id:         string
  role:       'user' | 'assistant'
  content:    string
  sectionId?: string
  audio?:     string   // base64 mp3
  blocked?:   boolean
}

interface Props {
  messages:    ChatMessage[]
  loading:     boolean
  isMobile?:   boolean
  onSpeaking?: (speaking: boolean) => void
}

// ── Audio waveform player ─────────────────────────────────────────────────────

interface AudioPlayerProps {
  audio:      string
  autoPlay:   boolean
  onSpeaking: (s: boolean) => void
}

function AudioPlayer({ audio, autoPlay, onSpeaking }: AudioPlayerProps) {
  const audioRef        = useRef<HTMLAudioElement>(null)
  const hasAutoPlayed   = useRef(false)
  const [playing, setPlaying] = useState(false)

  // Build blob URL synchronously via useMemo; revoke on unmount
  const url = useMemo(() => {
    const bytes = atob(audio)
    const arr   = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
    const blob = new Blob([arr], { type: 'audio/mpeg' })
    return URL.createObjectURL(blob)
  }, [audio])

  useEffect(() => () => URL.revokeObjectURL(url), [url])

  // Autoplay once when url is ready
  useEffect(() => {
    if (!url || !autoPlay || hasAutoPlayed.current) return
    hasAutoPlayed.current = true
    const el = audioRef.current
    if (el) el.play().catch(() => {})
  }, [url, autoPlay])

  const onPlay  = useCallback(() => { setPlaying(true);  onSpeaking(true)  }, [onSpeaking])
  const onPause = useCallback(() => { setPlaying(false); onSpeaking(false) }, [onSpeaking])
  const onEnded = useCallback(() => { setPlaying(false); onSpeaking(false) }, [onSpeaking])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) { el.pause() } else { el.play().catch(() => {}) }
  }

  const bars = useMemo(() =>
    Array.from({ length: 28 }, (_, i) =>
      0.25 + Math.abs(Math.sin(i * 1.9 + (audio.length % 10))) * 0.75
    ), [audio])

  return (
    <div style={{ marginBottom: 8 }}>
      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(var(--min-scale)); }
          50%       { transform: scaleY(1); }
        }
      `}</style>
      <audio
        ref={audioRef}
        src={url}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      />
      <div
        onClick={toggle}
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}
      >
        {/* Play / pause */}
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          border: '1px solid rgba(0,220,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: 'rgba(0,220,255,0.8)', fontSize: 9,
        }}>
          {playing ? '■' : '▶'}
        </div>

        {/* Waveform bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 22 }}>
          {bars.map((h, i) => {
            const minScale = (0.15 + h * 0.2).toFixed(2)
            const duration = `${(0.5 + (i % 5) * 0.08).toFixed(2)}s`
            const delay    = `${((i % 4) * 0.06).toFixed(2)}s`
            return (
              <div key={i} style={{ width: 2.5, height: '100%', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width:           '100%',
                  height:          `${Math.round(h * 100)}%`,
                  background:      playing
                    ? `rgba(0,220,255,${(0.4 + h * 0.5).toFixed(2)})`
                    : `rgba(0,220,255,${(0.15 + h * 0.15).toFixed(2)})`,
                  borderRadius:    2,
                  transformOrigin: 'center',
                  transition:      'background 0.2s',
                  ['--min-scale' as string]: minScale,
                  animation: playing
                    ? `barPulse ${duration} ease-in-out ${delay} infinite`
                    : 'none',
                }} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Typewriter reveal ─────────────────────────────────────────────────────────

function TypewriterText({ text, isNew, onDone }: { text: string; isNew: boolean; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState(isNew ? '' : text)
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone })

  useEffect(() => {
    if (!isNew) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        onDoneRef.current?.()
      }
    }, 18)
    return () => clearInterval(id)
  }, [text, isNew])

  return <>{displayed}</>
}

// ── Chat thread ───────────────────────────────────────────────────────────────

export default function ChatThread({ messages, loading, isMobile, onSpeaking }: Props) {
  const bottomRef      = useRef<HTMLDivElement>(null)
  const handleSpeaking = useCallback((s: boolean) => onSpeaking?.(s), [onSpeaking])
  const [seenIds,      setSeenIds]      = useState<Set<string>>(new Set())
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Scan line: mark new assistant messages as seen after 2s
  useEffect(() => {
    const newIds = messages
      .filter(m => m.role === 'assistant' && !seenIds.has(m.id))
      .map(m => m.id)
    if (newIds.length > 0) {
      setTimeout(() => {
        setSeenIds(prev => new Set([...prev, ...newIds]))
      }, 2000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  if (messages.length === 0 && !loading) return null

  const latestAudioId = [...messages]
    .reverse()
    .find(m => m.role === 'assistant' && m.audio)?.id ?? ''

  const latestAssistantId = [...messages]
    .reverse()
    .find(m => m.role === 'assistant')?.id ?? ''

  return (
    <>
      <style>{`
        @keyframes scanLine {
          0%   { transform: scaleX(0); opacity: 1; }
          70%  { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes thinkPulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1;   }
        }
      `}</style>
      <div style={{
        position:      'fixed',
        bottom:        isMobile ? 76 : 72,
        left:          isMobile ? '2vw' : '5vw',
        zIndex:        39,
        width:         isMobile ? '96vw' : 'min(420px, 90vw)',
        maxHeight:     isMobile ? '35vh' : '40vh',
        overflowY:     'auto',
        display:       'flex',
        flexDirection: 'column',
        gap:           10,
        padding:       '12px 0',
      }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf:      m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth:       '85%',
              padding:        '10px 14px',
              borderRadius:   m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
              background:     m.role === 'user'
                ? 'rgba(125,216,255,0.12)'
                : m.blocked ? 'rgba(255,100,100,0.06)' : 'rgba(5,10,20,0.75)',
              border:         m.role === 'user'
                ? '1px solid rgba(125,216,255,0.3)'
                : m.blocked ? '1px solid rgba(255,100,100,0.15)' : '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              color:          m.role === 'user' ? 'rgba(125,216,255,0.95)' : 'rgba(240,244,255,0.8)',
              fontSize:       13,
              lineHeight:     1.6,
              position:       'relative',
            }}
          >
            {/* Scan line on new assistant messages */}
            {m.role === 'assistant' && m.id === latestAssistantId && !seenIds.has(m.id) && (
              <div style={{
                position:        'absolute',
                top: 0, left: 0, right: 0,
                height:          '100%',
                background:      'linear-gradient(to right, transparent, rgba(0,220,255,0.08), transparent)',
                transformOrigin: 'left',
                animation:       'scanLine 0.6s ease forwards',
                pointerEvents:   'none',
                zIndex:          1,
              }} />
            )}
            {m.audio && (
              <AudioPlayer
                audio={m.audio}
                autoPlay={m.id === latestAudioId}
                onSpeaking={handleSpeaking}
              />
            )}
            {m.role === 'assistant' && m.id === latestAssistantId && !completedIds.has(m.id)
              ? <TypewriterText
                  text={m.content}
                  isNew={true}
                  onDone={() => setCompletedIds(prev => new Set([...prev, m.id]))}
                />
              : m.content
            }
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf:   'flex-start',
            display:     'flex',
            alignItems:  'center',
            gap:         6,
            padding:     '8px 12px',
            background:  'rgba(5,10,20,0.6)',
            border:      '1px solid rgba(0,220,255,0.12)',
            backdropFilter: 'blur(12px)',
            borderRadius: '4px 16px 16px 16px',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width:       6, height: 6,
                borderRadius:'50%',
                background:  'rgba(0,220,255,0.7)',
                animation:   `thinkPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </>
  )
}
