'use client'

import { useRef, useState, useEffect } from 'react'

interface Props {
  onSend:        (text: string) => void
  loading:       boolean
  voiceEnabled:  boolean
  onVoiceToggle: () => void
}

export default function ChatBar({ onSend, loading, voiceEnabled, onVoiceToggle }: Props) {
  const inputRef    = useRef<HTMLInputElement>(null)
  const [recording, setRecording] = useState(false)
  const recogRef    = useRef<any>(null)
  const [hasRecog,  setHasRecog]  = useState(false)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    setHasRecog(!!SR)
  }, [])

  const submit = () => {
    const val = inputRef.current?.value.trim()
    if (!val || loading) return
    onSend(val)
    if (inputRef.current) inputRef.current.value = ''
  }

  const toggleMic = () => {
    if (recording) {
      recogRef.current?.stop()
      return
    }

    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) return

    const recog: any = new SR()
    recog.lang              = 'en-US'
    recog.interimResults    = false
    recog.maxAlternatives   = 1

    recog.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      if (inputRef.current) inputRef.current.value = transcript
      setRecording(false)
      // Auto-submit after a brief moment so the user can see the transcript
      setTimeout(() => {
        if (inputRef.current?.value.trim()) submit()
      }, 400)
    }

    recog.onerror = () => setRecording(false)
    recog.onend   = () => setRecording(false)

    recogRef.current = recog
    recog.start()
    setRecording(true)
  }

  const btnBase: React.CSSProperties = {
    background:    'none',
    border:        '1px solid rgba(125,216,255,0.25)',
    borderRadius:  '50%',
    width:         36,
    height:        36,
    display:       'flex',
    alignItems:    'center',
    justifyContent:'center',
    cursor:        'pointer',
    flexShrink:    0,
    transition:    'border-color 0.2s, background 0.2s',
  }

  return (
    <div style={{
      position:             'fixed',
      bottom:               0,
      left:                 0,
      right:                0,
      zIndex:               40,
      padding:              '12px 16px',
      background:           'rgba(5,10,20,0.85)',
      backdropFilter:       'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop:            '1px solid rgba(125,216,255,0.15)',
      display:              'flex',
      gap:                  10,
      alignItems:           'center',
    }}>
      {/* Voice output toggle */}
      <button
        onClick={onVoiceToggle}
        title={voiceEnabled ? 'Voice on — click to mute' : 'Voice off — click to enable'}
        style={{
          ...btnBase,
          borderColor: voiceEnabled ? 'rgba(0,220,255,0.5)' : 'rgba(125,216,255,0.15)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={voiceEnabled ? 'rgba(0,220,255,0.85)' : 'rgba(125,216,255,0.3)'}
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {voiceEnabled ? (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          )}
        </svg>
      </button>

      {/* Text input */}
      <input
        ref={inputRef}
        disabled={loading}
        placeholder={recording ? 'Listening...' : loading ? 'Thinking...' : 'Ask me anything about Joseph...'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) submit()
        }}
        style={{
          flex:         1,
          background:   recording ? 'rgba(255,60,60,0.06)' : 'rgba(125,216,255,0.06)',
          border:       `1px solid ${recording ? 'rgba(255,80,80,0.35)' : 'rgba(125,216,255,0.2)'}`,
          borderRadius: 24,
          padding:      '10px 18px',
          color:        '#f0f4ff',
          fontSize:     14,
          outline:      'none',
          fontFamily:   'inherit',
          transition:   'border-color 0.2s, background 0.2s',
        }}
      />

      {/* Mic button — only shown when SpeechRecognition is available */}
      {hasRecog && (
        <button
          onClick={toggleMic}
          title={recording ? 'Stop recording' : 'Speak'}
          style={{
            ...btnBase,
            borderColor: recording ? 'rgba(255,80,80,0.6)' : 'rgba(125,216,255,0.25)',
            background:  recording ? 'rgba(255,60,60,0.12)' : 'none',
            animation:   recording ? 'micPulse 1.2s ease-in-out infinite' : 'none',
          }}
        >
          <style>{`
            @keyframes micPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(255,80,80,0.4); }
              50%       { box-shadow: 0 0 0 6px rgba(255,80,80,0); }
            }
          `}</style>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke={recording ? 'rgba(255,100,100,0.9)' : 'rgba(125,216,255,0.5)'}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8"  y1="23" x2="16" y2="23" />
          </svg>
        </button>
      )}

      {/* Send */}
      <button
        disabled={loading}
        onClick={submit}
        style={{
          background:    'rgba(125,216,255,0.12)',
          border:        '1px solid rgba(125,216,255,0.3)',
          borderRadius:  20,
          padding:       '8px 18px',
          color:         'rgba(125,216,255,0.9)',
          fontSize:      11,
          fontFamily:    'var(--font-geist-mono), monospace',
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          cursor:        loading ? 'not-allowed' : 'pointer',
          opacity:       loading ? 0.5 : 1,
        }}
      >
        Send
      </button>
    </div>
  )
}
