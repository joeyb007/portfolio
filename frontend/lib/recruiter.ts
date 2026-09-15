// ---------------------------------------------------------------------------
// Content for the Minimalistic (recruiter) doc. Projects and writing are
// composed from lib/projects.ts and lib/blog.ts; only what has no existing
// source (the pitch paragraph, experience one-liners, links) is authored here.
// ---------------------------------------------------------------------------

import { PROJECTS } from './projects'
import { getSortedPosts } from './blog'

export interface DocLink   { label: string; href: string }
export interface DocEntity { strong: string; href?: string; logo?: string; download?: boolean; arrow?: boolean }   // bold underlined noun; emblem, file download, trailing arrow icon are optional
export interface DocItem   extends Partial<DocEntity> { text: string; note?: string; links?: DocLink[] }   // links: trailing mono links, e.g. github · site
export interface DocGroup  { label: string; marker: '◆' | '■'; items: DocItem[] }
export type PitchSegment = string | DocEntity
export interface RecruiterDoc {
  pitch:  PitchSegment[]   // one paragraph: who I am, where I study, what I'm after
  groups: DocGroup[]       // currently, previously, projects, writing
  links:  DocLink[]        // resume, github, linkedin, email, x
}

/** First sentence: up to the first `.`/`!`/`?` that is followed by whitespace or end of string. */
export function firstSentence(s: string): string {
  const m = s.match(/^\s*([\s\S]*?[.!?])(?=\s|$)/)
  return (m ? m[1] : s).trim()
}

const currently: DocGroup = {
  label:  'currently:',
  marker: '◆',
  items: [
    { logo: 'waterloo.png', strong: 'University of Waterloo', href: 'https://uwaterloo.ca',
      text: 'Undergraduate Research Assistant · multi-agent LLM systems for healthcare data sensemaking and clinical question decomposition' },
    { logo: 'laurier.png',  strong: 'Laurier Case Team', href: 'https://wlu.ca',
      text: 'Delegate on the digital strategy and international case teams, with over $3k in competition winnings' },
  ],
}

const projects: DocGroup = {
  label:  'projects:',
  marker: '■',
  items:  PROJECTS.map(p => ({
    strong: p.name,
    text:   p.blurb ?? firstSentence(p.tagline),
    href:   p.liveUrl ?? p.github,
    links:  [
      ...(p.github  ? [{ label: 'github', href: p.github  }] : []),
      ...(p.liveUrl ? [{ label: 'site',   href: p.liveUrl }] : []),
    ],
  })),
}

const previously: DocGroup = {
  label:  'previously:',
  marker: '■',
  items: [
    { logo: 'Scotiabank.png', strong: 'Scotiabank', text: 'SWE Intern · Flowpilot, a VLM ReAct agent for live UI testing' },
    { logo: 'ESGTree.png',    strong: 'ESGTree',    text: 'SWE Intern · NL-to-SQL ReAct agent over 98 tables, 90%+ eval accuracy' },
    { logo: 'FuturIQ.png',    strong: 'FuturIQ',    text: 'Software Developer · live GTA housing price model over 1000+ listings' },
  ],
}

const writing: DocGroup = {
  label:  'writing:',
  marker: '■',
  items:  getSortedPosts().map(post => ({
    strong: post.short ?? post.title,
    text:   '',
    href:   `/blog/${post.slug}`,
  })),
}

export const RECRUITER: RecruiterDoc = {
  pitch: [
    "Hey! I'm ", { strong: 'Joseph Barbosa' },
    ', a CS (AI) and BBA double-degree student at ',
    { strong: 'Waterloo', logo: 'waterloo.png', href: 'https://uwaterloo.ca' }, ' and ',
    { strong: 'Laurier',  logo: 'laurier.png',  href: 'https://wlu.ca' },
    '. I build at the intersection of applied agentic AI, ML research, and product, and I\'m looking for Winter 2027 internships. ',
    { strong: 'Resume', href: '/resume.pdf', download: true, arrow: true },
  ],
  groups: [currently, previously, projects, writing],
  links: [
    { label: 'resume',   href: '/resume.pdf' },
    { label: 'github',   href: 'https://github.com/joeyb007' },
    { label: 'linkedin', href: 'https://linkedin.com/in/joseph-c-barbosa' },
    { label: 'email',    href: 'mailto:josephbarbosa416@gmail.com' },
    { label: 'x',        href: 'https://x.com/josephbarbosa00' },
  ],
}
