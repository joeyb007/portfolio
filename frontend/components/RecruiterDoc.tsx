'use client'

import type { CSSProperties } from 'react'
import { RECRUITER, type DocItem, type DocGroup } from '@/lib/recruiter'

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

function Strong({ item }: { item: DocItem }) {
  if (!item.strong) return null
  if (!item.href) return <span style={strongStyle}>{item.strong}</span>
  return (
    <a
      href={item.href}
      target={isExternal(item.href) ? '_blank' : undefined}
      rel={isExternal(item.href) ? 'noopener noreferrer' : undefined}
      style={strongStyle}
      onMouseEnter={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'var(--line-2)')}
    >
      {item.strong}
    </a>
  )
}

function Item({ item, glyph, glyphColor, indent }: {
  item: DocItem; glyph: string; glyphColor: string; indent: number
}) {
  return (
    <li style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingLeft: indent, margin: '5px 0' }}>
      <span style={{ ...mono, color: glyphColor, fontSize: 10, flexShrink: 0, lineHeight: 1.6 }}>{glyph}</span>
      <span style={{ color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
        {item.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/logos/${item.logo}`}
            alt=""
            aria-hidden
            style={{ width: 12, height: 12, borderRadius: 3, objectFit: 'cover',
              verticalAlign: '-1px', marginRight: 6, display: 'inline-block' }}
          />
        )}
        <Strong item={item} />
        {item.strong && item.text && ' '}
        {item.text && <span>{item.strong ? `· ${item.text}` : item.text}</span>}
        {item.note && (
          <span style={{ ...mono, color: 'var(--fg-3)', fontSize: 9.5, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginLeft: 8 }}>
            {item.note}
          </span>
        )}
      </span>
    </li>
  )
}

function Group({ group }: { group: DocGroup }) {
  return (
    <li style={{ margin: '14px 0 0' }}>
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

export default function RecruiterDoc({ opacity, interactive, isMobile }: Props) {
  const outer: CSSProperties = isMobile
    ? { position: 'static', width: '100%', padding: '56px 20px 140px' }
    : { position: 'fixed', left: '5vw', top: 0, bottom: 0, width: '58vw', overflowY: 'auto', padding: '10vh 0 18vh', zIndex: 5 }

  return (
    <section
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
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ ...sans, margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--fg)', lineHeight: 1.3 }}>
          {RECRUITER.name}
        </h1>
        <p style={{ margin: '6px 0 18px', fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>
          {RECRUITER.intro}
        </p>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {RECRUITER.top.map((item, i) => (
            <Item key={i} item={item} glyph="◆" glyphColor="var(--fg-3)" indent={0} />
          ))}
          {RECRUITER.groups.map(group => <Group key={group.label} group={group} />)}
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
    </section>
  )
}
