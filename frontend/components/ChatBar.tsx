'use client'

import { useRef } from 'react'

interface Props {
  onSend:  (text: string) => void
  loading: boolean
}

export default function ChatBar({ onSend, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = () => {
    const val = inputRef.current?.value.trim()
    if (!val || loading) return
    onSend(val)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div style={{
      position:       'fixed',
      bottom:         0,
      left:           0,
      right:          0,
      zIndex:         40,
      padding:        '12px 16px',
      background:     'rgba(5,10,20,0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop:      '1px solid rgba(125,216,255,0.15)',
      display:        'flex',
      gap:            10,
      alignItems:     'center',
    }}>
      <input
        ref={inputRef}
        disabled={loading}
        placeholder={loading ? 'Thinking...' : 'Ask me anything about Joseph...'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) submit()
        }}
        style={{
          flex:         1,
          background:   'rgba(125,216,255,0.06)',
          border:       '1px solid rgba(125,216,255,0.2)',
          borderRadius: 24,
          padding:      '10px 18px',
          color:        '#f0f4ff',
          fontSize:     14,
          outline:      'none',
          fontFamily:   'inherit',
        }}
      />
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
