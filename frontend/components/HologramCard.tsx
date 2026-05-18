'use client'

import { useState, useEffect, useRef, forwardRef } from 'react'
import { REGION_CONFIGS, type SectionId } from '@/lib/regionMap'

interface Props {
  sectionId: SectionId
  visible:   boolean
}

const mono: React.CSSProperties = {
  fontFamily:    'var(--font-geist-mono), monospace',
  fontSize:      9,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

function Corner({ top, right, bottom, left }: { top?: number; right?: number; bottom?: number; left?: number }) {
  return (
    <div style={{
      position:     'absolute',
      top, right, bottom, left,
      width:        10,
      height:       10,
      borderTop:    top    != null ? '1px solid rgba(0,220,255,0.7)' : undefined,
      borderBottom: bottom != null ? '1px solid rgba(0,220,255,0.7)' : undefined,
      borderLeft:   left   != null ? '1px solid rgba(0,220,255,0.7)' : undefined,
      borderRight:  right  != null ? '1px solid rgba(0,220,255,0.7)' : undefined,
      pointerEvents: 'none',
    }} />
  )
}

const HologramCard = forwardRef<HTMLDivElement, Props>(function HologramCard(
  { sectionId, visible },
  ref,
) {
  const [displayed,   setDisplayed]   = useState(sectionId)
  const [cardVisible, setCardVisible] = useState(true)
  const displayedRef = useRef(sectionId)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number | null>(null)
  const timersRef    = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTransition = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    const canvas = canvasRef.current
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  const runPixelBurst = (
    riseDuration: number,
    fallDuration: number,
    onPeak?: () => void,
    onDone?: () => void,
  ) => {
    const canvas = canvasRef.current
    if (!canvas) { onPeak?.(); onDone?.(); return }

    const w = canvas.offsetWidth  || 252
    const h = canvas.offsetHeight || 300
    canvas.width  = w
    canvas.height = h

    const ctx = canvas.getContext('2d')
    if (!ctx) { onPeak?.(); onDone?.(); return }

    const ps    = 4
    const cols  = Math.ceil(w / ps)
    const rows  = Math.ceil(h / ps)
    const total = cols * rows

    const order = Array.from({ length: total }, (_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }

    const draw = (active: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < active; i++) {
        const idx   = order[i]
        const col   = idx % cols
        const row   = Math.floor(idx / cols)
        const alpha = (0.25 + Math.random() * 0.6).toFixed(2)
        ctx.fillStyle = `rgba(0,220,255,${alpha})`
        ctx.fillRect(col * ps, row * ps, ps - 1, ps - 1)
      }
    }

    const t0 = performance.now()
    const rise = (now: number) => {
      const t = Math.min((now - t0) / riseDuration, 1)
      draw(Math.floor(t * total))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(rise)
      } else {
        onPeak?.()
        const t1 = performance.now()
        const fall = (now2: number) => {
          const t2 = Math.min((now2 - t1) / fallDuration, 1)
          draw(Math.floor((1 - t2) * total))
          if (t2 < 1) {
            rafRef.current = requestAnimationFrame(fall)
          } else {
            ctx.clearRect(0, 0, w, h)
            onDone?.()
          }
        }
        rafRef.current = requestAnimationFrame(fall)
      }
    }
    rafRef.current = requestAnimationFrame(rise)
  }

  useEffect(() => {
    if (displayedRef.current === sectionId) return
    clearTransition()

    setCardVisible(false)
    runPixelBurst(
      260,
      180,
      () => setCardVisible(false),
      () => {
        displayedRef.current = sectionId
        setDisplayed(sectionId)

        const t = setTimeout(() => {
          setCardVisible(true)
          runPixelBurst(
            160,
            320,
            undefined,
            undefined,
          )
        }, 40)
        timersRef.current.push(t)
      },
    )

    return clearTransition
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId])

  const cfg = REGION_CONFIGS[displayed]

  return (
    <>
      <style>{`
        @keyframes holoFloat {
          0%, 100% { transform: translateY(-50%) perspective(400px) rotateY(-4deg) translateY(0px); }
          50%       { transform: translateY(-50%) perspective(400px) rotateY(-4deg) translateY(-16px); }
        }
        @keyframes scanSweep {
          0%   { transform: translateY(320px); opacity: 0; }
          4%   { opacity: 1; }
          46%  { opacity: 1; }
          50%  { transform: translateY(-70px); opacity: 0; }
          100% { transform: translateY(-70px); opacity: 0; }
        }
      `}</style>

      <div
        ref={ref}
        style={{
          position:      'fixed',
          right:         '5vw',
          top:           '50%',
          animation:     'holoFloat 5s ease-in-out infinite',
          zIndex:        15,
          width:         252,
          height:        300,
          opacity:       visible ? 1 : 0,
          transition:    'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      >
        {/* Card visual */}
        <div style={{
          opacity:              cardVisible ? 1 : 0,
          transition:           'opacity 0.14s ease',
          background:           'rgba(0,200,240,0.04)',
          backdropFilter:       'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border:               '1px solid rgba(0,220,255,0.45)',
          borderRadius:         '10px',
          padding:              '16px',
          height:               '100%',
          boxSizing:            'border-box',
          boxShadow: [
            '0 0 0 1px rgba(0,220,255,0.12)',
            '0 0 14px rgba(0,220,255,0.55)',
            '0 0 36px rgba(0,220,255,0.2)',
            '0 0 70px rgba(0,220,255,0.08)',
            'inset 0 0 24px rgba(0,220,255,0.05)',
          ].join(', '),
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Static scan lines */}
          <div style={{
            position:      'absolute',
            inset:         0,
            background:    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,220,255,0.025) 3px, rgba(0,220,255,0.025) 6px)',
            borderRadius:  'inherit',
            pointerEvents: 'none',
            zIndex:        0,
          }} />

          {/* Sweeping scan line */}
          <div style={{
            position:      'absolute',
            left:          0,
            right:         0,
            height:        64,
            background:    'linear-gradient(to bottom, transparent, rgba(0,220,255,0.05) 30%, rgba(0,220,255,0.11) 50%, rgba(0,220,255,0.05) 70%, transparent)',
            animation:     'scanSweep 7s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex:        3,
          }} />

          <Corner top={5}    left={5} />
          <Corner top={5}    right={5} />
          <Corner bottom={5} left={5} />
          <Corner bottom={5} right={5} />

          <div key={displayed} style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ ...mono, color: 'rgba(0,220,255,0.7)', margin: '0 0 3px', textShadow: '0 0 8px rgba(0,200,255,0.5)' }}>
              ◆ {cfg.lobe}
            </p>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.1, letterSpacing: '-0.01em', textShadow: '0 0 12px rgba(0,220,255,0.9)' }}>
              {cfg.label}
            </p>
            <p style={{ color: 'rgba(150,230,255,0.55)', fontSize: 10, lineHeight: 1.6, margin: '0 0 10px', fontStyle: 'italic' }}>
              {cfg.description}
            </p>

            <div style={{ borderTop: '1px solid rgba(0,220,255,0.15)', margin: '0 0 10px' }} />

            <ul style={{ margin: '0 0 12px', padding: '0 0 0 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {cfg.hologramBullets.map((b, i) => (
                <li key={i} style={{ color: 'rgba(200,240,255,0.85)', fontSize: 11, lineHeight: 1.5, textShadow: '0 0 6px rgba(0,200,255,0.3)' }}>
                  {b}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(0,220,255,0.3), transparent)' }} />
              <p style={{ ...mono, color: 'rgba(0,220,255,0.5)', margin: 0, fontSize: 8 }}>ask me →</p>
            </div>
          </div>
        </div>

        {/* Canvas — sibling of card so pixels render over blank space during transitions */}
        <canvas
          ref={canvasRef}
          style={{
            position:      'absolute',
            inset:         0,
            width:         '100%',
            height:        '100%',
            pointerEvents: 'none',
            zIndex:        20,
          }}
        />
      </div>
    </>
  )
})

export default HologramCard
