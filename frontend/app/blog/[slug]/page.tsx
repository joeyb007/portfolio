import { notFound } from 'next/navigation'
import { BLOG_POSTS, formatPostDate } from '@/lib/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  return { title: post ? `${post.title} · Joseph Barbosa` : 'Blog · Joseph Barbosa' }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const { default: Post } = await import(`@/content/blog/${slug}.mdx`)

  return (
    <article>
      <p style={{
        fontFamily: 'var(--font-geist-mono), monospace', fontSize: 10.5,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'rgba(0,220,255,0.5)', margin: '0 0 10px',
      }}>
        {formatPostDate(post.date, { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <h1 style={{
        color: '#fff', fontSize: 30, fontWeight: 700, margin: '0 0 28px', lineHeight: 1.25,
        letterSpacing: '-0.01em', textShadow: '0 0 14px rgba(0,220,255,0.4)',
      }}>
        {post.title}
      </h1>
      <Post />
    </article>
  )
}
