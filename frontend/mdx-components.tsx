import type { MDXComponents } from 'mdx/types'
import type { ReactElement } from 'react'
import Mermaid from '@/components/Mermaid'

function MDXImage({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure style={{ margin: '0 0 18px' }}>
      <img
        src={src}
        alt={alt ?? ''}
        style={{
          display: 'block', maxWidth: '100%', margin: '0 auto',
          borderRadius: 6, border: '1px solid rgba(0,220,255,0.18)',
          background: 'rgba(0,220,255,0.04)',
        }}
      />
      {alt ? (
        <figcaption style={{
          fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11.5,
          color: 'rgba(180,220,255,0.5)', textAlign: 'center', margin: '8px 0 0',
        }}>{alt}</figcaption>
      ) : null}
    </figure>
  )
}

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 style={{
      color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1.25,
      margin: '32px 0 12px', letterSpacing: '-0.01em',
      textShadow: '0 0 14px rgba(0,220,255,0.4)',
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1.3,
      margin: '28px 0 10px', letterSpacing: '-0.01em',
      textShadow: '0 0 10px rgba(0,220,255,0.3)',
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      color: 'rgba(220,245,255,0.95)', fontSize: 18, fontWeight: 700,
      lineHeight: 1.35, margin: '24px 0 8px',
    }}>{children}</h3>
  ),
  p: ({ children }) => {
    // MDX wraps a standalone `![]()` in a <p>; unwrap so <figure> isn't nested inside it.
    const onlyChild = Array.isArray(children) ? (children.length === 1 ? children[0] : null) : children
    if ((onlyChild as ReactElement | null)?.type === MDXImage) {
      return <>{onlyChild}</>
    }
    return (
      <p style={{
        color: 'rgba(200,230,255,0.85)', fontSize: 16, lineHeight: 1.75,
        margin: '0 0 18px',
      }}>{children}</p>
    )
  },
  strong: ({ children }) => (
    <strong style={{ color: '#fff', fontWeight: 700 }}>{children}</strong>
  ),
  a: ({ children, href }) => (
    <a href={href as string} target={href?.toString().startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer" className="mdx-link">
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul style={{ color: 'rgba(200,230,255,0.85)', fontSize: 16, lineHeight: 1.75, margin: '0 0 18px', paddingLeft: 22 }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{ color: 'rgba(200,230,255,0.85)', fontSize: 16, lineHeight: 1.75, margin: '0 0 18px', paddingLeft: 22 }}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 6 }}>{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '2px solid rgba(0,220,255,0.4)', margin: '0 0 18px', padding: '4px 0 4px 16px',
      color: 'rgba(180,220,255,0.65)', fontStyle: 'italic', fontSize: 15.5,
    }}>{children}</blockquote>
  ),
  code: ({ children }) => (
    <code style={{
      fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13.5,
      color: 'rgba(0,220,255,0.85)', background: 'rgba(0,220,255,0.08)',
      padding: '2px 5px', borderRadius: 3,
    }}>{children}</code>
  ),
  pre: ({ children }) => {
    const code = children as ReactElement<{ className?: string; children?: string }>
    const className = code?.props?.className ?? ''
    if (className.includes('language-mermaid')) {
      return <Mermaid chart={code.props.children ?? ''} />
    }
    return (
      <pre style={{
        fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13.5, lineHeight: 1.6,
        color: 'rgba(200,240,255,0.9)', background: 'rgba(0,220,255,0.05)',
        border: '1px solid rgba(0,220,255,0.2)', borderRadius: 6,
        padding: 16, overflowX: 'auto', margin: '0 0 18px',
      }}>{children}</pre>
    )
  },
  img: MDXImage,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '0 0 18px' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse', fontSize: 14.5,
        border: '1px solid rgba(0,220,255,0.18)', borderRadius: 6,
      }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: 'rgba(0,220,255,0.08)' }}>{children}</thead>
  ),
  tr: ({ children }) => (
    <tr style={{ borderBottom: '1px solid rgba(0,220,255,0.12)' }}>{children}</tr>
  ),
  th: ({ children }) => (
    <th style={{
      textAlign: 'left', padding: '10px 14px', color: '#fff', fontWeight: 700,
      fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12.5,
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '10px 14px', color: 'rgba(200,230,255,0.85)' }}>{children}</td>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid rgba(0,220,255,0.15)', margin: '32px 0' }} />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
