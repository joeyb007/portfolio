'use client'

import { useState, useEffect, useRef, forwardRef } from 'react'
import { REGION_CONFIGS, type SectionId } from '@/lib/regionMap'
import { PROJECTS } from '@/lib/projects'
import type { HologramBullet } from '@/lib/regionMap'

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*/)
  return parts.map((p, i) =>
    i % 2 === 1
      ? <span key={i} style={{ color: '#fff', fontWeight: 600, textShadow: '0 0 8px rgba(0,220,255,0.5)' }}>{p}</span>
      : p
  )
}

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
  const [displayed,    setDisplayed]   = useState(sectionId)
  const [cardVisible,  setCardVisible] = useState(true)
  const [projectIdx,   setProjectIdx]  = useState(0)
  const carouselDir    = useRef<'left' | 'right'>('right')

  useEffect(() => { setProjectIdx(0) }, [displayed])
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

    runPixelBurst(
      280,
      200,
      () => setCardVisible(false), // hide only when fully covered by pixels
      () => {
        displayedRef.current = sectionId
        setDisplayed(sectionId)

        const t = setTimeout(() => {
          runPixelBurst(
            180,
            340,
            () => setCardVisible(true), // reveal only when fully covered by pixels
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
        @keyframes slideInRight {
          from { transform: translateX(24px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-24px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes chipsTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
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
          height:        310,
          opacity:       visible ? 1 : 0,
          transition:    'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      >
        {/* Card visual */}
        <div style={{
          opacity:              cardVisible ? 1 : 0,
          transition:           'opacity 0.18s ease',
          background:           'rgba(0,200,240,0.04)',
          backdropFilter:       'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border:               '1px solid rgba(0,220,255,0.45)',
          borderRadius:         '0px',
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
            borderRadius:  '0px',
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

          <div key={displayed} style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Section | Lobe — one-line header */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1, letterSpacing: '-0.02em', textShadow: '0 0 14px rgba(0,220,255,0.9)', whiteSpace: 'nowrap' }}>
                {cfg.label}
              </p>
              <span style={{ color: 'rgba(0,220,255,0.35)', fontSize: 11, fontWeight: 300, flexShrink: 0 }}>|</span>
              <p style={{ ...mono, fontSize: 8, color: 'rgba(0,220,255,0.7)', margin: 0, lineHeight: 1, whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,200,255,0.4)' }}>
                {cfg.lobe}
              </p>
            </div>

            {/* Scientific lobe function */}
            <p style={{ ...mono, color: 'rgba(0,220,255,0.5)', fontSize: 8, lineHeight: 1.5, margin: '0 0 3px', letterSpacing: '0.06em' }}>
              {cfg.lobeFunction}
            </p>
            {/* Personal section description */}
            <p style={{ color: 'rgba(180,230,255,0.65)', fontSize: 9.5, lineHeight: 1.55, margin: '0 0 8px' }}>
              {cfg.sectionDesc}
            </p>

            <div style={{ borderTop: '1px solid rgba(0,220,255,0.15)', margin: '0 0 8px' }} />

            {displayed === 'projects' ? (
              // ── Project carousel ────────────────────────────────────────
              <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, pointerEvents: 'auto' }}>
                <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em', textShadow: '0 0 10px rgba(0,220,255,0.8)' }}>
                  {PROJECTS[projectIdx].name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                  <button
                    onClick={() => { carouselDir.current = 'left'; setProjectIdx(i => (i - 1 + PROJECTS.length) % PROJECTS.length) }}
                    style={{ ...mono, background: 'none', border: 'none', color: 'rgba(0,220,255,0.6)', cursor: 'pointer', padding: '0 2px', fontSize: 11, lineHeight: 1 }}
                  >‹</button>
                  <span style={{ ...mono, color: 'rgba(0,220,255,0.4)', fontSize: 8 }}>{projectIdx + 1}/{PROJECTS.length}</span>
                  <button
                    onClick={() => { carouselDir.current = 'right'; setProjectIdx(i => (i + 1) % PROJECTS.length) }}
                    style={{ ...mono, background: 'none', border: 'none', color: 'rgba(0,220,255,0.6)', cursor: 'pointer', padding: '0 2px', fontSize: 11, lineHeight: 1 }}
                  >›</button>
                </div>
              </div>

              {/* Sliding content — keyed so it remounts + animates on index change */}
              <div
                key={`proj-${projectIdx}`}
                style={{
                  display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
                  animation: `${carouselDir.current === 'right' ? 'slideInRight' : 'slideInLeft'} 0.22s ease`,
                  overflow: 'hidden',
                }}
              >
                {/* Tagline */}
                {PROJECTS[projectIdx].tagline && (
                  <p style={{ color: 'rgba(150,230,255,0.55)', fontSize: 9, lineHeight: 1.5, margin: '0 0 6px', fontStyle: 'italic',
                    whiteSpace: 'pre-line', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {PROJECTS[projectIdx].tagline}
                  </p>
                )}

                {/* Tech stack — scrolling chips ticker */}
                {PROJECTS[projectIdx].stack.length > 0 && (
                  <div style={{ overflow: 'hidden', margin: '0 0 6px', maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
                    <div style={{
                      display: 'flex', gap: 4, width: 'max-content',
                      animation: `chipsTicker ${PROJECTS[projectIdx].stack.length * 1.6}s linear infinite`,
                    }}>
                      {[...PROJECTS[projectIdx].stack, ...PROJECTS[projectIdx].stack].map((chip, i) => (
                        <span key={i} style={{
                          ...mono, fontSize: 7, padding: '2px 5px', whiteSpace: 'nowrap',
                          border: '1px solid rgba(0,220,255,0.25)', borderRadius: 3,
                          color: 'rgba(0,220,255,0.65)', background: 'rgba(0,220,255,0.05)',
                        }}>{chip}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description paragraph */}
                {PROJECTS[projectIdx].bullets[0] && (
                  <p style={{ color: 'rgba(200,240,255,0.78)', fontSize: 10, lineHeight: 1.6, margin: '0 0 6px',
                    whiteSpace: 'pre-line', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'hidden' as any, overflow: 'hidden',
                    textShadow: '0 0 6px rgba(0,200,255,0.25)' }}>
                    {PROJECTS[projectIdx].bullets[0]}
                  </p>
                )}

                {/* Built so far — ↳ list */}
                {PROJECTS[projectIdx].builtSoFar && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <p style={{ ...mono, color: 'rgba(0,220,255,0.55)', fontSize: 8, margin: '0 0 3px', fontStyle: 'italic' }}>
                      • built so far:
                    </p>
                    {PROJECTS[projectIdx].builtSoFar!.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 6 }}>
                        <span style={{ color: 'rgba(0,220,255,0.35)', fontSize: 9, flexShrink: 0 }}>↳</span>
                        <span style={{ color: 'rgba(200,240,255,0.85)', fontSize: 10.5, lineHeight: 1.4 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div style={{ display: 'flex', gap: 12, marginTop: 'auto', pointerEvents: 'auto', flexWrap: 'nowrap' }}>
                  {PROJECTS[projectIdx].github && (
                    <a href={PROJECTS[projectIdx].github} target="_blank" rel="noopener noreferrer"
                      style={{ ...mono, color: 'rgba(0,220,255,0.6)', fontSize: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00dcff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,220,255,0.6)')}>
                      GitHub ↗
                    </a>
                  )}
                  {PROJECTS[projectIdx].liveUrl && (
                    <a href={PROJECTS[projectIdx].liveUrl} target="_blank" rel="noopener noreferrer"
                      style={{ ...mono, color: 'rgba(0,220,255,0.6)', fontSize: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00dcff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,220,255,0.6)')}>
                      Try it live ↗
                    </a>
                  )}
                  {PROJECTS[projectIdx].youtubeId && (
                    <a href={`https://youtu.be/${PROJECTS[projectIdx].youtubeId}`} target="_blank" rel="noopener noreferrer"
                      style={{ ...mono, color: 'rgba(0,220,255,0.6)', fontSize: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00dcff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,220,255,0.6)')}>
                      Watch demo ↗
                    </a>
                  )}
                </div>
              </div>
              </>
            ) : (
              // ── Content: paragraphs + category blocks ─────────────────────
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cfg.hologramBullets.map((item: HologramBullet, i: number) =>
                  typeof item === 'string' ? (
                    <p key={i} style={{ color: 'rgba(200,240,255,0.72)', fontSize: 10.5,
                      lineHeight: 1.7, margin: 0, textShadow: '0 0 6px rgba(0,200,255,0.25)' }}>
                      {parseBold(item)}
                    </p>
                  ) : (
                    <div key={i}>
                      {item.category && (
                        <p style={{ ...mono, color: 'rgba(0,220,255,0.55)', fontSize: 8,
                          margin: '0 0 4px', fontStyle: 'italic' }}>
                          • {item.category}:
                        </p>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {item.items.map((b, j) => (
                          <div key={j} style={{ paddingLeft: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <span style={{ color: 'rgba(0,220,255,0.35)', fontSize: 9, flexShrink: 0 }}>↳</span>
                              {b.note && (
                                <span style={{ ...mono, color: 'rgba(180,230,255,0.45)', fontSize: 8, flexShrink: 0 }}>
                                  {b.note}
                                </span>
                              )}
                              {b.logo && (
                                <img src={`/logos/${b.logo}`} alt={b.text}
                                  style={{ height: 13, width: 'auto', flexShrink: 0, opacity: 0.9 }} />
                              )}
                              {b.link ? (
                                <a
                                  href={b.link}
                                  target={b.link.startsWith('mailto') ? undefined : '_blank'}
                                  rel="noopener noreferrer"
                                  download={b.link.endsWith('.pdf') ? true : undefined}
                                  style={{ color: 'rgba(0,220,255,0.8)', fontSize: 10.5, fontWeight: 600,
                                    lineHeight: 1.4, textDecoration: 'none', pointerEvents: 'auto' }}
                                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,220,255,0.8)')}
                                >
                                  {b.text} ↗
                                </a>
                              ) : (
                                <span style={{ color: 'rgba(200,240,255,0.85)', fontSize: 10.5, fontWeight: b.logo ? 600 : 400, lineHeight: 1.4 }}>
                                  {b.text}
                                </span>
                              )}
                            </div>
                            {b.desc && (
                              <p style={{ color: 'rgba(180,220,255,0.55)', fontSize: 9, lineHeight: 1.5,
                                margin: '2px 0 0 14px' }}>
                                {b.desc}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Canvas — sibling of card so pixels render over blank space during transitions */}
        <canvas
          ref={canvasRef}
          style={{
            position:      'absolute',
            inset:         0,
            width:         '100%',
            height:        310,
            pointerEvents: 'none',
            zIndex:        20,
          }}
        />
      </div>
    </>
  )
})

export default HologramCard
