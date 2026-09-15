'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { RECRUITER, type DocEntity, type DocItem, type DocGroup } from '@/lib/recruiter'

interface Props {
  opacity:     number
  interactive: boolean
  isMobile:    boolean
}

const sans: CSSProperties = { fontFamily: 'var(--font-geist-sans), sans-serif' }
const mono: CSSProperties = { fontFamily: 'var(--font-geist-mono), monospace' }

const strongStyle: CSSProperties = {
  color:          'var(--fg)',
  fontWeight:     600,
  borderBottom:   '1px solid var(--line-2)',
  textDecoration: 'none',
  paddingBottom:  1,
}

const isExternal = (href: string) => /^https?:/.test(href)

// Inline arrow instead of the ↗ character, which iOS renders as an emoji.
function Arrow({ size = 11 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: '-1px', marginLeft: 4 }}
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="8 7 17 7 17 16" />
    </svg>
  )
}

function Strong({ item }: { item: Partial<DocEntity> }) {
  if (!item.strong) return null
  if (!item.href) return <span style={strongStyle}>{item.strong}</span>
  return (
    <a
      href={item.href}
      target={isExternal(item.href) ? '_blank' : undefined}
      rel={isExternal(item.href) ? 'noopener noreferrer' : undefined}
      download={item.download ? 'Joseph_Barbosa_Resume.pdf' : undefined}
      style={strongStyle}
      onMouseEnter={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'var(--line-2)')}
    >
      {item.strong}{item.arrow && <Arrow size={12} />}
    </a>
  )
}

function Emblem({ logo }: { logo: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/${logo}`}
      alt=""
      aria-hidden
      style={{ width: 12, height: 12, borderRadius: 3, objectFit: 'cover',
        verticalAlign: '-1px', marginRight: 5, display: 'inline-block' }}
    />
  )
}

function Pitch() {
  return (
    <p style={{ margin: '0 0 6px', fontSize: 15, lineHeight: 1.7, color: 'var(--fg-2)' }}>
      {RECRUITER.pitch.map((seg, i) =>
        typeof seg === 'string'
          ? <span key={i}>{seg}</span>
          : <span key={i} style={{ whiteSpace: 'nowrap' }}>{seg.logo && <Emblem logo={seg.logo} />}<Strong item={seg} /></span>
      )}
    </p>
  )
}

function Item({ item, glyph, glyphColor, indent }: {
  item: DocItem; glyph: string; glyphColor: string; indent: number
}) {
  return (
    <li style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingLeft: indent, margin: '5px 0' }}>
      <span style={{ ...mono, color: glyphColor, fontSize: 10, flexShrink: 0, lineHeight: 1.6 }}>{glyph}</span>
      <span style={{ color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
        {item.logo && <Emblem logo={item.logo} />}
        <Strong item={item} />
        {item.strong && item.text && ' '}
        {item.text && <span>{item.strong ? `· ${item.text}` : item.text}</span>}
        {item.note && (
          <span style={{ ...mono, color: 'var(--fg-3)', fontSize: 9.5, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginLeft: 8 }}>
            {item.note}
          </span>
        )}
        {item.links && item.links.length > 0 && (
          // The whole group is one unbreakable unit, so it wraps to the next
          // line as a block instead of splitting an arrow from its label.
          <span style={{ whiteSpace: 'nowrap', marginLeft: 8 }}>
            {item.links.map((l, i) => (
              <span key={l.label}>
                {i > 0 && <span style={{ color: 'var(--fg-4)', margin: '0 6px' }}>·</span>}
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...mono, color: 'var(--fg-3)', fontSize: 9.5, letterSpacing: '0.08em',
                    textTransform: 'uppercase', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}
                >
                  {l.label}<Arrow size={10} />
                </a>
              </span>
            ))}
          </span>
        )}
      </span>
    </li>
  )
}

function Group({ group, reveal }: { group: DocGroup; reveal: boolean }) {
  return (
    <li className={reveal ? 'doc-reveal' : undefined} style={{ margin: '14px 0 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ ...mono, color: 'var(--fg-3)', fontSize: 10, lineHeight: 1.6 }}>{group.marker}</span>
        <span style={{ color: 'var(--fg-3)', fontStyle: 'italic', fontSize: 13.5, lineHeight: 1.6 }}>{group.label}</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {group.items.map((item, i) => (
          <Item key={i} item={item} glyph="↳" glyphColor="var(--fg-4)" indent={18} />
        ))}
      </ul>
    </li>
  )
}

// Mobile scroll cues: a one-time chevron that leaves after the first scroll,
// and groups that rise into place as they enter the viewport.
function useMobileScrollCues(isMobile: boolean, root: React.RefObject<HTMLElement | null>) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isMobile) return
    const onScroll = () => { if (window.scrollY > 40) setScrolled(true) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  useEffect(() => {
    if (!isMobile || !root.current) return
    const els = root.current.querySelectorAll('.doc-reveal')
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }, { rootMargin: '0px 0px -12% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [isMobile, root])

  return scrolled
}

export default function RecruiterDoc({ opacity, interactive, isMobile }: Props) {
  const rootRef  = useRef<HTMLElement | null>(null)
  const scrolled = useMobileScrollCues(isMobile, rootRef)
  // Desktop: the doc owns the left half of the viewport and the brain the right
  // half. Content is centred in its half both ways; `margin: auto` on the inner
  // block centres when it fits and degrades to a normal scroll when it doesn't.
  const outer: CSSProperties = isMobile
    ? { position: 'relative', zIndex: 5, width: '100%', padding: '56px 20px 140px' }   // above the fixed backdrop canvas
    : { position: 'fixed', left: 0, top: 0, bottom: 0, width: '50vw', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '6vh 5vw 110px', zIndex: 5 }
  const inner: CSSProperties = isMobile
    ? { maxWidth: 560 }
    : { maxWidth: 560, width: '100%', margin: 'auto 0' }

  return (
    <section
      ref={rootRef}
      aria-label="Summary"
      style={{
        ...sans, ...outer,
        opacity,
        transition:    'opacity 0.6s ease',
        pointerEvents: interactive ? 'auto' : 'none',
        boxSizing:     'border-box',
        color:         'var(--fg-2)',
      }}
    >
      <div style={inner}>
        <Pitch />

        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {RECRUITER.groups.map(group => <Group key={group.label} group={group} reveal={isMobile} />)}
        </ul>

        <nav aria-label="Links" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', marginTop: 28 }}>
          {RECRUITER.links.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={isExternal(link.href) ? '_blank' : undefined}
              rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}
              download={link.href.endsWith('.pdf') ? true : undefined}
              style={{ ...mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--fg-3)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {isMobile && (
        <>
          {/* Doc fades into the chat bar so the cut-off reads as "more below". */}
          <div aria-hidden style={{
            position: 'fixed', left: 0, right: 0, bottom: 60, height: 96, zIndex: 6, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, transparent, var(--bg))',
          }} />
          <div aria-hidden className="doc-chevron" style={{
            position: 'fixed', left: 0, right: 0, bottom: 74, zIndex: 7, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            opacity: scrolled ? 0 : 1, transition: 'opacity 0.5s ease',
          }}>
            <span style={{ ...mono, fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-4)' }}>scroll to turn</span>
            <span style={{ color: 'var(--fg-3)', fontSize: 16, lineHeight: 1 }}>⌄</span>
          </div>
        </>
      )}
    </section>
  )
}
