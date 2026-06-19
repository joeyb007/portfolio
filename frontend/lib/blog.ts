export interface BlogPost {
  slug:    string
  title:   string
  date:    string   // ISO date, e.g. '2026-06-18'
  excerpt: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug:    'removing-the-h-from-rlhf',
    title:   'Removing the H from RLHF',
    date:    '2026-06-19',
    excerpt: 'Swapping human raters for a cheap XGBoost classifier in a preference-optimization pipeline — and what that trade actually costs you.',
  },
]

export function getSortedPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))
}

// `new Date('YYYY-MM-DD')` parses as UTC midnight, which rolls back a day
// in any timezone behind UTC once formatted locally — parse as local time instead.
export function formatPostDate(date: string, opts: Intl.DateTimeFormatOptions): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', opts)
}
