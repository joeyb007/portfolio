'use client'

interface Props {
  isMobile: boolean
  hidden:   boolean   // fades out once a conversation starts
}

// Hero block for Animated mode: kicker, name, social links, CS webring.
export default function Hero({ isMobile, hidden }: Props) {
  return (
    <>
      <div
        style={{
          position:      'fixed',
          left:          '5vw',
          bottom:        isMobile ? '14vh' : '10vh',
          zIndex:        10,
          maxWidth:      isMobile ? '90vw' : 360,
          opacity:       hidden ? 0 : 1,
          transition:    'opacity 0.6s ease',
          pointerEvents: hidden ? 'none' : 'auto',
        }}
      >
        <p style={{
          fontFamily:    'var(--font-geist-mono), monospace',
          fontSize:      10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'var(--fg-3)',
          margin:        '0 0 8px',
        }}>
          Builder · MLE · AI Engineer
        </p>
        <h1 style={{
          fontSize:   'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 700,
          color:      'var(--fg)',
          margin:     '0 0 8px',
          lineHeight: 1.1,
        }}>
          Joseph Barbosa
        </h1>
        <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>
          Scroll to explore.
        </p>

        {/* Social links */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', pointerEvents: 'auto' }}>
          {[
            {
              href:     'https://github.com/joeyb007',
              label:    'GitHub',
              download: false,
              icon:     <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
            },
            {
              href:     'https://linkedin.com/in/joseph-c-barbosa',
              label:    'LinkedIn',
              download: false,
              icon:     <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
            },
            {
              href:     'https://x.com/josephbarbosa00',
              label:    'X',
              download: false,
              icon:     <path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
            },
            {
              href:     'mailto:josephbarbosa416@gmail.com',
              label:    'Email',
              download: false,
              icon:     <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
            },
            {
              href:     '/resume.pdf',
              label:    'Resume',
              download: true,
              icon:     <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /><line x1="8" y1="9" x2="11" y2="9" /></>,
            },
          ].map(({ href, label, download, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') || download ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              download={download ? 'Joseph_Barbosa_Resume.pdf' : undefined}
              style={{
                color:      'var(--fg-4)',
                transition: 'color 0.2s',
                lineHeight: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-4)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
            </a>
          ))}

          {/* Waterloo CS Webring — requires joining via PR to github.com/JusGu/uwatering first */}
          <div style={{ width: 1, height: 16, background: 'var(--line)' }} />
          <a
            href="https://cs.uwatering.com/#https://josephbarbosa.com?nav=prev"
            aria-label="Previous in CS Webring"
            style={{ color: 'var(--fg-4)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-4)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </a>
          <a
            href="https://cs.uwatering.com/#https://josephbarbosa.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CS Webring"
            style={{ color: 'var(--fg-4)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-4)')}
          >
            <img src="https://cs.uwatering.com/icon.white.svg" alt="CS Webring" style={{ width: 16, height: 16, display: 'block' }} />
          </a>
          <a
            href="https://cs.uwatering.com/#https://josephbarbosa.com?nav=next"
            aria-label="Next in CS Webring"
            style={{ color: 'var(--fg-4)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-4)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>

    </>
  )
}
