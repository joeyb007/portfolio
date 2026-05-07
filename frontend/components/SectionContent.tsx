'use client'

import { useState, useEffect, useRef } from 'react'
import type { SectionId } from '@/lib/regionMap'
import { about, experience, projects, personal, contact } from '@/lib/content'

function renderRichText(text: string): React.ReactNode {
  const parts = text.split(/(\[\[.*?\]\])/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[\[(.*?)\]\]$/)
    if (match) {
      return (
        <span key={i} style={{ color: 'rgba(125,216,255,0.95)', fontWeight: 500 }}>
          {match[1]}
        </span>
      )
    }
    return part
  })
}

const mono: React.CSSProperties = {
  fontFamily:    'var(--font-geist-mono), monospace',
  fontSize:      10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      ...mono,
      color:        'rgba(125,216,255,0.6)',
      border:       '1px solid rgba(125,216,255,0.18)',
      borderRadius: 4,
      padding:      '2px 8px',
      display:      'inline-block',
    }}>
      {label}
    </span>
  )
}

function Bullet({ text }: { text: string }) {
  return (
    <li style={{
      color:      'rgba(240,244,255,0.65)',
      fontSize:   13,
      lineHeight: 1.7,
      paddingLeft: 4,
    }}>
      {text}
    </li>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '20px 0' }} />
}

// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ ...mono, color: 'rgba(125,216,255,0.5)', margin: '0 0 10px' }}>
      {children}
    </p>
  )
}

function AboutSection({ onSectionOpen }: { onSectionOpen?: (id: SectionId) => void }) {
  const [left, right] = about.education?.schools ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Bio */}
      {about.paragraphs.map((p, i) => (
        <p key={i} style={{ color: 'rgba(240,244,255,0.65)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
          {renderRichText(p)}
        </p>
      ))}

      {/* Currently */}
      {about.currently && (
        <>
          <Divider />
          <div>
            <SectionHeading>Currently</SectionHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {about.currently.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ color: 'rgba(240,244,255,0.65)', fontSize: 13, lineHeight: 1.7 }}>
                    {item.prefix}{' '}
                  </span>
                  {item.sectionId ? (
                    <button
                      onClick={() => onSectionOpen?.(item.sectionId as SectionId)}
                      style={{
                        color: 'rgba(125,216,255,0.95)', fontWeight: 500,
                        background: 'none', border: 'none', padding: 0,
                        cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                      }}
                    >
                      {item.entity}
                    </button>
                  ) : item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'rgba(125,216,255,0.95)', fontWeight: 500, textDecoration: 'none' }}>
                      {item.entity}
                    </a>
                  ) : (
                    <span style={{ color: 'rgba(125,216,255,0.95)', fontWeight: 500 }}>{item.entity}</span>
                  )}
                  <span style={{ color: 'rgba(240,244,255,0.65)', fontSize: 13, lineHeight: 1.7 }}>
                    {item.suffix}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Education */}
      {about.education && (
        <>
          <Divider />
          <div>
            <SectionHeading>Education</SectionHeading>
            <div style={{
              background:   'rgba(125,216,255,0.04)',
              border:       '1px solid rgba(125,216,255,0.1)',
              borderRadius: 10,
              padding:      '14px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ ...mono, color: 'rgba(125,216,255,0.6)' }}>{about.education.program}</span>
                <span style={{ ...mono, color: 'rgba(240,244,255,0.3)' }}>{about.education.period}</span>
              </div>

              {/* logo | name+degree × name+degree | logo */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                {/* Left school */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  {left?.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={left.logo} alt={left.name} style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
                  )}
                  <div>
                    <p style={{ color: '#f0f4ff', fontSize: 12, fontWeight: 600, margin: '0 0 1px', lineHeight: 1.3 }}>{left?.name}</p>
                    <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: 11, margin: 0 }}>{left?.degree}</p>
                  </div>
                </div>

                <span style={{ color: 'rgba(240,244,255,0.2)', fontSize: 14, flexShrink: 0 }}>×</span>

                {/* Right school */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#f0f4ff', fontSize: 12, fontWeight: 600, margin: '0 0 1px', lineHeight: 1.3 }}>{right?.name}</p>
                    <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: 11, margin: 0 }}>{right?.degree}</p>
                  </div>
                  {right?.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={right.logo} alt={right.name} style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* At a glance */}
      {about.highlights && (
        <>
          <Divider />
          <div>
            <SectionHeading>At a Glance</SectionHeading>
            <div style={{ display: 'flex', gap: 24 }}>
              {about.highlights.map(({ label, value }) => (
                <div key={label}>
                  <p style={{ ...mono, color: 'rgba(125,216,255,0.5)', margin: '0 0 4px' }}>{label}</p>
                  <p style={{ color: '#f0f4ff', fontSize: 13, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ExperienceSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {experience.map((entry, i) => (
        <div key={i}>
          {i > 0 && <Divider />}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {entry.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.logo}
                  alt={entry.company}
                  style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 4, flexShrink: 0 }}
                />
              )}
              <div>
                <p style={{ color: '#f0f4ff', fontSize: 15, fontWeight: 600, margin: '0 0 2px' }}>
                  {entry.role}
                </p>
                <p style={{ ...mono, color: 'rgba(125,216,255,0.7)', margin: 0 }}>
                  {entry.company}{entry.location ? ` · ${entry.location}` : ''}
                </p>
              </div>
            </div>
            <p style={{ ...mono, color: 'rgba(240,244,255,0.35)', margin: 0, whiteSpace: 'nowrap' }}>
              {entry.period}
            </p>
          </div>
          {entry.description && (
            <p style={{ color: 'rgba(240,244,255,0.55)', fontSize: 13, lineHeight: 1.7, margin: '8px 0' }}>
              {entry.description}
            </p>
          )}
          {entry.bullets.length > 0 && (
            <ul style={{ margin: '10px 0 12px', padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {entry.bullets.map((b, j) => <Bullet key={j} text={b} />)}
            </ul>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            {entry.tags.map(t => <Tag key={t} label={t} />)}
            {entry.caseStudy && (
              <a href={entry.caseStudy} target="_blank" rel="noopener noreferrer"
                style={{ ...mono, color: 'rgba(125,216,255,0.6)', textDecoration: 'none', marginLeft: 4 }}>
                Case study ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {projects.map((entry, i) => (
        <div key={i}>
          {i > 0 && <Divider />}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 12 }}>
            <p style={{ color: '#f0f4ff', fontSize: 15, fontWeight: 600, margin: 0 }}>
              {entry.name}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {entry.link && (
                <a href={entry.link} target="_blank" rel="noopener noreferrer" style={{ ...mono, color: 'rgba(125,216,255,0.6)', textDecoration: 'none' }}>
                  Live ↗
                </a>
              )}
              {entry.github && (
                <a href={entry.github} target="_blank" rel="noopener noreferrer" style={{ ...mono, color: 'rgba(125,216,255,0.6)', textDecoration: 'none' }}>
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
          <p style={{ color: 'rgba(240,244,255,0.55)', fontSize: 13, lineHeight: 1.7, margin: '0 0 10px' }}>
            {entry.description}
          </p>
          {entry.bullets && entry.bullets.length > 0 && (
            <ul style={{ margin: '0 0 12px', padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {entry.bullets.map((b, j) => <Bullet key={j} text={b} />)}
            </ul>
          )}
          {entry.videoUrl && (
            <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9' }}>
              <iframe
                src={entry.videoUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            {entry.tags.map(t => <Tag key={t} label={t} />)}
            {entry.link && (
              <a href={entry.link} target="_blank" rel="noopener noreferrer"
                style={{ ...mono, color: 'rgba(125,216,255,0.6)', textDecoration: 'none', marginLeft: 4 }}>
                Live ↗
              </a>
            )}
            {entry.github && (
              <a href={entry.github} target="_blank" rel="noopener noreferrer"
                style={{ ...mono, color: 'rgba(125,216,255,0.6)', textDecoration: 'none' }}>
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

interface SpotifyTrack {
  isPlaying: boolean
  title?:    string
  artist?:   string
  albumArt?: string
  songUrl?:  string
}

function SlidingCarousel({ photos }: { photos: { src: string; caption?: string }[] }) {
  const stripRef = useRef<HTMLDivElement>(null)
  const countRef = useRef(0)
  const extended = [...photos, photos[0]]
  const total    = extended.length

  useEffect(() => {
    if (photos.length < 2) return
    const strip = stripRef.current
    if (!strip) return

    strip.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)'

    const id = setInterval(() => {
      countRef.current += 1
      const n = countRef.current
      strip.style.transform = `translateX(-${(n / total) * 100}%)`

      if (n === photos.length) {
        setTimeout(() => {
          strip.style.transition = 'none'
          strip.style.transform  = 'translateX(0)'
          countRef.current = 0
          requestAnimationFrame(() => requestAnimationFrame(() => {
            strip.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)'
          }))
        }, 650)
      }
    }, 3000)

    return () => clearInterval(id)
  }, [photos.length, total])

  if (photos.length === 0) return null

  return (
    <div style={{ width: '100%', height: 220, borderRadius: 10, overflow: 'hidden' }}>
      <div
        ref={stripRef}
        style={{ display: 'flex', width: `${total * 100}%`, height: '100%', transform: 'translateX(0)' }}
      >
        {extended.map(({ src, caption }, i) => (
          <div key={i} style={{ position: 'relative', width: `${100 / total}%`, height: '100%', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {caption && (
              <div style={{
                position:   'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.45)',
                padding:    '6px 10px',
              }}>
                <p style={{ color: '#f0f4ff', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SpotifyWidget() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/spotify')
        setTrack(await res.json())
      } catch { /* silent fail */ }
    }
    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <a
      href={track?.songUrl ?? 'https://open.spotify.com'}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          10,
        background:   'rgba(125,216,255,0.04)',
        border:       '1px solid rgba(125,216,255,0.1)',
        borderRadius: 8,
        padding:      '10px 12px',
        textDecoration: 'none',
      }}
    >
      {track?.albumArt ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={track.albumArt} alt="album art" style={{ width: 36, height: 36, borderRadius: 4, flexShrink: 0 }} />
      ) : (
        <div style={{ width: 36, height: 36, borderRadius: 4, background: 'rgba(125,216,255,0.08)', flexShrink: 0 }} />
      )}
      <div style={{ minWidth: 0 }}>
        <p style={{ ...mono, color: 'rgba(125,216,255,0.5)', margin: '0 0 3px' }}>
          {track?.isPlaying ? '▶ Now Playing' : 'Last Played'}
        </p>
        <p style={{ color: '#f0f4ff', fontSize: 12, fontWeight: 600, margin: '0 0 1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track?.title ?? '—'}
        </p>
        <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: 11, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track?.artist ?? '—'}
        </p>
      </div>
      <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    </a>
  )
}

function PodcastShelf({ podcasts }: { podcasts: { name: string; href: string; cover: string }[] }) {
  return (
    <div>
      <SectionHeading>Podcasts</SectionHeading>
      <div style={{ display: 'flex', gap: 10 }}>
        {podcasts.map(({ name, href, cover }) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8, display: 'block' }} />
            <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: 10, margin: '5px 0 0', textAlign: 'center', lineHeight: 1.3 }}>{name}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

function PersonalSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {personal.paragraphs.map((p, i) => (
        <p key={i} style={{ color: 'rgba(240,244,255,0.65)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
          {p}
        </p>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {personal.interests.map(({ emoji, label, description }) => (
          <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
            <div>
              <p style={{ color: '#f0f4ff', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
              <p style={{ color: 'rgba(240,244,255,0.55)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{description}</p>
            </div>
          </div>
        ))}
      </div>

      {personal.onMind && (
        <>
          <Divider />
          <div>
            <SectionHeading>On My Mind</SectionHeading>
            <div style={{
              background:   'rgba(125,216,255,0.03)',
              border:       '1px solid rgba(125,216,255,0.08)',
              borderLeft:   '2px solid rgba(125,216,255,0.35)',
              borderRadius: '0 8px 8px 0',
              padding:      '12px 16px',
            }}>
              <p style={{ color: 'rgba(240,244,255,0.75)', fontSize: 13, lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
                {personal.onMind}
              </p>
            </div>
          </div>
        </>
      )}

      {(personal.photos?.length || personal.podcasts?.length) ? (
        <>
          <Divider />
          <div style={{ display: 'flex', gap: 16 }}>
            {personal.photos && personal.photos.length > 0 && (
              <div style={{ width: 'calc(50% - 8px)', flexShrink: 0 }}>
                <SlidingCarousel photos={personal.photos} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <SectionHeading>Listening</SectionHeading>
                <SpotifyWidget />
              </div>
              {personal.podcasts && personal.podcasts.length > 0 && (
                <PodcastShelf podcasts={personal.podcasts} />
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

function ContactSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {contact.paragraphs.map((p, i) => (
        <p key={i} style={{ color: 'rgba(240,244,255,0.65)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
          {p}
        </p>
      ))}
      <Divider />
      <a
        href={`mailto:${contact.email}`}
        style={{ color: '#7dd8ff', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}
      >
        {contact.email}
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
        {contact.links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...mono, color: 'rgba(125,216,255,0.6)', textDecoration: 'none' }}
          >
            {label} ↗
          </a>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export — plug into SlidePanel
// ---------------------------------------------------------------------------
export default function SectionContent({ sectionId, onSectionOpen }: { sectionId: SectionId; onSectionOpen?: (id: SectionId) => void }) {
  switch (sectionId) {
    case 'about':      return <AboutSection onSectionOpen={onSectionOpen} />
    case 'experience': return <ExperienceSection />
    case 'projects':   return <ProjectsSection />
    case 'personal':   return <PersonalSection />
    case 'contact':    return <ContactSection />
    default:           return null
  }
}
