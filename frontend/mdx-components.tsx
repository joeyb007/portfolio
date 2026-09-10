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
          borderRadius: 6, border: '1px solid var(--line)',
          background: 'var(--surface)',
        }}
      />
      {alt ? (
        <figcaption style={{
          fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11.5,
          color: 'var(--fg-3)', textAlign: 'center', margin: '8px 0 0',
        }}>{alt}</figcaption>
      ) : null}
    </figure>
  )
}

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 style={{
      color: 'var(--fg)', fontSize: 28, fontWeight: 700, lineHeight: 1.25,
      margin: '32px 0 12px', letterSpacing: '-0.01em',
      textShadow: '0 0 14px var(--glow-soft)',
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      color: 'var(--fg)', fontSize: 22, fontWeight: 700, lineHeight: 1.3,
      margin: '28px 0 10px', letterSpacing: '-0.01em',
      textShadow: '0 0 10px var(--glow-soft)',
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      color: 'var(--fg)', fontSize: 18, fontWeight: 700,
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
        color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.75,
        margin: '0 0 18px',
      }}>{children}</p>
    )
  },
  strong: ({ children }) => (
    <strong style={{ color: 'var(--fg)', fontWeight: 700 }}>{children}</strong>
  ),
  a: ({ children, href }) => (
    <a href={href as string} target={href?.toString().startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer" className="mdx-link">
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.75, margin: '0 0 18px', paddingLeft: 22 }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.75, margin: '0 0 18px', paddingLeft: 22 }}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 6 }}>{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '2px solid var(--line-2)', margin: '0 0 18px', padding: '4px 0 4px 16px',
      color: 'var(--fg-2)', fontStyle: 'italic', fontSize: 15.5,
    }}>{children}</blockquote>
  ),
  code: ({ children }) => (
    <code style={{
      fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13.5,
      color: 'var(--accent)', background: 'var(--surface-2)',
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
        color: 'var(--fg)', background: 'var(--surface)',
        border: '1px solid var(--line)', borderRadius: 6,
        padding: 16, overflowX: 'auto', margin: '0 0 18px',
      }}>{children}</pre>
    )
  },
  img: MDXImage,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '0 0 18px' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse', fontSize: 14.5,
        border: '1px solid var(--line)', borderRadius: 6,
      }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: 'var(--surface-2)' }}>{children}</thead>
  ),
  tr: ({ children }) => (
    <tr style={{ borderBottom: '1px solid var(--line)' }}>{children}</tr>
  ),
  th: ({ children }) => (
    <th style={{
      textAlign: 'left', padding: '10px 14px', color: 'var(--fg)', fontWeight: 700,
      fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12.5,
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '10px 14px', color: 'var(--fg-2)' }}>{children}</td>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '32px 0' }} />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
