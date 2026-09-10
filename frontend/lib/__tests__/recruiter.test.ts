import { RECRUITER, firstSentence, deriveNote } from '../recruiter'
import { PROJECTS } from '../projects'
import { BLOG_POSTS } from '../blog'

const allText = (): string => JSON.stringify(RECRUITER)

describe('RECRUITER completeness', () => {
  it('mentions every project by name, as a strong link', () => {
    const building = RECRUITER.groups[2]
    expect(building.label).toBe('projects:')
    expect(building.marker).toBe('■')
    for (const p of PROJECTS) {
      const item = building.items.find(i => i.strong === p.name)
      expect(item).toBeDefined()
      expect(item!.href).toBe(p.liveUrl ?? p.github)
      expect(item!.text.length).toBeGreaterThan(0)
      expect(item!.text).not.toContain('\n')
      expect(allText()).toContain(p.name)
    }
    expect(building.items).toHaveLength(PROJECTS.length)
  })

  it('mentions every blog post (short title when set), linking to /blog/<slug>', () => {
    const writing = RECRUITER.groups[3]
    expect(writing.label).toBe('writing:')
    expect(writing.marker).toBe('■')
    for (const post of BLOG_POSTS) {
      const item = writing.items.find(i => i.href === `/blog/${post.slug}`)
      expect(item).toBeDefined()
      expect(item!.strong).toBe(post.short ?? post.title)
    }
    expect(writing.items).toHaveLength(BLOG_POSTS.length)
  })

  it('orders writing newest first', () => {
    const titles = RECRUITER.groups[3].items.map(i => i.strong)
    const sorted = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).map(p => p.short ?? p.title)
    expect(titles).toEqual(sorted)
  })

  it('has the authored pitch / currently / previously / links', () => {
    const entities = RECRUITER.pitch.filter((s): s is Exclude<typeof s, string> => typeof s !== 'string')
    expect(entities.map(e => e.strong)).toEqual(['Joseph Barbosa', 'Waterloo', 'Laurier'])
    expect(entities.map(e => e.logo)).toEqual([undefined, 'waterloo.png', 'laurier.png'])
    expect(RECRUITER.pitch.join('')).toContain('Winter 2027')
    const now = RECRUITER.groups[0]
    expect(now.label).toBe('currently:')
    expect(now.marker).toBe('◆')
    expect(now.items[0].strong).toBe('University of Waterloo')
    expect(RECRUITER.groups.map(g => g.label)).toEqual(['currently:', 'previously:', 'projects:', 'writing:'])
    const prev = RECRUITER.groups[1]
    expect(prev.label).toBe('previously:')
    expect(prev.marker).toBe('■')
    expect(prev.items.map(i => i.strong)).toEqual(['Scotiabank', 'ESGTree', 'FuturIQ'])
    expect(prev.items.map(i => i.logo)).toEqual(['Scotiabank.png', 'ESGTree.png', 'FuturIQ.png'])
    expect(RECRUITER.links.map(l => l.label)).toEqual(['resume', 'github', 'linkedin', 'email', 'x'])
    expect(RECRUITER.links[0].href).toBe('/resume.pdf')
  })

  it('only references logos that exist in /public/logos', () => {
    const known = ['waterloo.png', 'laurier.png', 'Scotiabank.png', 'ESGTree.png', 'FuturIQ.png']
    const used = [...RECRUITER.pitch.filter(s => typeof s !== 'string'), ...RECRUITER.groups.flatMap(g => g.items)]
      .map(i => (i as { logo?: string }).logo).filter((l): l is string => !!l)
    for (const l of used) expect(known).toContain(l)
  })
})

describe('firstSentence', () => {
  it('cuts at the first terminator followed by whitespace or end', () => {
    expect(firstSentence('One. Two.')).toBe('One.')
    expect(firstSentence('Over 200M+ papers.\n300+ users.')).toBe('Over 200M+ papers.')
    expect(firstSentence('No terminator here')).toBe('No terminator here')
    expect(firstSentence('  padded!  rest')).toBe('padded!')
    expect(firstSentence('v1.5 ships today. Really.')).toBe('v1.5 ships today.')
  })
})

describe('deriveNote', () => {
  it('prefers live, then a users count from the tagline', () => {
    expect(deriveNote({ liveUrl: 'https://x', tagline: '300+ users' })).toBe('live')
    expect(deriveNote({ tagline: 'Foo.\n300+ users and counting.' })).toBe('300+ users')
    expect(deriveNote({ tagline: '1,200 users' })).toBe('1,200 users')
    expect(deriveNote({ tagline: 'nothing here' })).toBeUndefined()
  })
  it('gives Scholr a users note and Studeal a live note', () => {
    const items = RECRUITER.groups[2].items
    expect(items.find(i => i.strong === 'Scholr')!.note).toBe('300+ users')
    expect(items.find(i => i.strong === 'Studeal')!.note).toBe('live')
  })
})
