'use client'

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

function PersonalSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {personal.paragraphs.map((p, i) => (
        <p key={i} style={{ color: 'rgba(240,244,255,0.65)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
          {p}
        </p>
      ))}
      <Divider />
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
