import Link from 'next/link'
import { getSortedPosts, formatPostDate } from '@/lib/blog'

export const metadata = { title: 'Blog · Joseph Barbosa' }

export default function BlogIndexPage() {
  const posts = getSortedPosts()

  return (
    <>
      <h1 style={{
        color: 'var(--fg)', fontSize: 32, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.01em',
        textShadow: '0 0 14px var(--glow-soft)',
      }}>
        Blog
      </h1>
      <p style={{ color: 'var(--fg-2)', fontSize: 14, margin: '0 0 40px' }}>
        Technical and personal writing.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <article className="blog-bar" style={{ borderRadius: 8, padding: '18px 22px' }}>
              <p style={{
                fontFamily: 'var(--font-geist-mono), monospace', fontSize: 10.5,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--fg-3)', margin: '0 0 6px',
              }}>
                {formatPostDate(post.date, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h2 style={{ color: 'var(--fg)', fontSize: 19, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                {post.title}
              </h2>
              <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {post.excerpt}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </>
  )
}
