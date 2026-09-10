// Reads a Graphite theme token (defined on :root in app/globals.css) for code
// that cannot consume CSS variables directly (canvas 2D, three.js materials).
// Falls back to the literal so SSR and tests still get a sensible colour.
export function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export const GLOW_FALLBACK = '#c9ccd4'
