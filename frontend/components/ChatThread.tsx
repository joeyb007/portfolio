'use client'

import { useEffect, useRef } from 'react'

export interface ChatMessage {
  id:         string
  role:       'user' | 'assistant'
  content:    string
  sectionId?: string
}

interface Props {
  messages:  ChatMessage[]
  loading:   boolean
  isMobile?: boolean
}

export default function ChatThread({ messages, loading, isMobile }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) return null

  return (
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
            borderRadius:   m.role === 'user'
              ? '16px 16px 4px 16px'
              : '4px 16px 16px 16px',
            background:     m.role === 'user'
              ? 'rgba(125,216,255,0.12)'
              : 'rgba(5,10,20,0.75)',
            border:         m.role === 'user'
              ? '1px solid rgba(125,216,255,0.3)'
              : '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            color:          m.role === 'user'
              ? 'rgba(125,216,255,0.95)'
              : 'rgba(240,244,255,0.8)',
            fontSize:       13,
            lineHeight:     1.6,
          }}
        >
          {m.content}
        </div>
      ))}
      {loading && (
        <div style={{
          alignSelf:     'flex-start',
          color:         'rgba(125,216,255,0.5)',
          fontSize:      11,
          fontFamily:    'var(--font-geist-mono), monospace',
          letterSpacing: '0.1em',
          padding:       '4px 0',
        }}>
          thinking...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
