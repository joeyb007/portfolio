import Link from 'next/link'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight:  '100vh',
      background: '#0a0e14',
      padding:    '48px 24px 96px',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Link href="/" style={{
          display:       'inline-block',
          marginBottom:  32,
          fontFamily:    'var(--font-geist-mono), monospace',
          fontSize:      11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:         'rgba(0,220,255,0.6)',
          textDecoration: 'none',
        }}>
          ← josephbarbosa.com
        </Link>
        {children}
      </div>
    </div>
  )
}
