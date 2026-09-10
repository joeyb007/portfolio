// ---------------------------------------------------------------------------
// Content for the Minimalistic (recruiter) doc. Projects and writing are
// composed from lib/projects.ts and lib/blog.ts; only what has no existing
// source (intro, education, experience one-liners, links) is authored here.
// ---------------------------------------------------------------------------

import { PROJECTS } from './projects'
import { getSortedPosts } from './blog'

export interface DocLink  { label: string; href: string }
export interface DocItem  { text: string; strong?: string; href?: string; logo?: string; note?: string }
export interface DocGroup { label: string; marker: '◆' | '■'; items: DocItem[] }
export interface RecruiterDoc {
  name:   string
  intro:  string      // one line: focus · location · seeking
  top:    DocItem[]   // education + current research, no group label
  groups: DocGroup[]  // "what i've been building", "previously", "writing"
  links:  DocLink[]   // resume, github, linkedin, email, x
}

/** First sentence: up to the first `.`/`!`/`?` that is followed by whitespace or end of string. */
export function firstSentence(s: string): string {
  const m = s.match(/^\s*(.*?[.!?])(?=\s|$)/s)
  return (m ? m[1] : s).trim()
}

/** "live" when deployed, else a user count if the tagline states one. */
export function deriveNote(p: { liveUrl?: string; tagline: string }): string | undefined {
  if (p.liveUrl) return 'live'
  const users = p.tagline.match(/(\d[\d,]*\+?)\s+users/i)
  return users ? `${users[1]} users` : undefined
}

const building: DocGroup = {
  label:  "what i've been building:",
  marker: '◆',
  items:  PROJECTS.map(p => ({
    strong: p.name,
    text:   firstSentence(p.tagline),
    href:   p.liveUrl ?? p.github,
    note:   deriveNote(p),
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
    strong: post.title,
    text:   '',
    href:   `/blog/${post.slug}`,
  })),
}

export const RECRUITER: RecruiterDoc = {
  name:  'Joseph Barbosa',
  intro: 'Building at the intersection of applied agentic AI, ML research, and product. Toronto. Seeking Winter 2027 internships.',
  top: [
    { logo: 'waterloo.png', strong: 'University of Waterloo',     text: 'Computer Science',        href: 'https://uwaterloo.ca', note: 'CS' },
    { logo: 'laurier.png',  strong: 'Wilfrid Laurier University', text: 'Business Administration', href: 'https://wlu.ca',       note: 'BBA' },
    { logo: 'waterloo.png', strong: 'University of Waterloo',     text: 'Research · ASR evaluation on 380h of code-switched Kazakh–Russian medical audio', note: 'now' },
  ],
  groups: [building, previously, writing],
  links: [
    { label: 'resume',   href: '/resume.pdf' },
    { label: 'github',   href: 'https://github.com/joeyb007' },
    { label: 'linkedin', href: 'https://linkedin.com/in/joseph-c-barbosa' },
    { label: 'email',    href: 'mailto:josephbarbosa416@gmail.com' },
    { label: 'x',        href: 'https://x.com/josephbarbosa00' },
  ],
}
