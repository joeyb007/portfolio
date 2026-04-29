export type SectionId =
  | 'about'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'blog'
  | 'personal'
  | 'chatbot'
  | 'contact'

export interface RegionConfig {
  sectionId: SectionId
  label: string
  color: string       // active highlight hex
  isChatbot?: true    // opens chat panel instead of scrolling
}

// All sections including chatbot
export const SECTIONS: SectionId[] = [
  'about', 'experience', 'skills', 'projects',
  'blog', 'personal', 'chatbot', 'contact',
]

// Sections that have a scroll-to target (excludes chatbot)
export const CONTENT_SECTIONS: SectionId[] = [
  'about', 'experience', 'skills', 'projects',
  'blog', 'personal', 'contact',
]

export const REGION_CONFIGS: Record<SectionId, RegionConfig> = {
  about:      { sectionId: 'about',      label: 'About',      color: '#60a5fa' },
  experience: { sectionId: 'experience', label: 'Experience', color: '#818cf8' },
  skills:     { sectionId: 'skills',     label: 'Skills',     color: '#34d399' },
  projects:   { sectionId: 'projects',   label: 'Projects',   color: '#f472b6' },
  blog:       { sectionId: 'blog',       label: 'Blog',       color: '#fb923c' },
  personal:   { sectionId: 'personal',   label: 'Personal',   color: '#e879f9' },
  chatbot:    { sectionId: 'chatbot',    label: 'Chat',       color: '#facc15', isChatbot: true },
  contact:    { sectionId: 'contact',    label: 'Contact',    color: '#94a3b8' },
}

/**
 * Assign a vertex to a section using normalized coordinates [-1, 1].
 * Coordinates are normalized relative to the brain's own bounding box,
 * so they work regardless of model scale or world position.
 *
 * Tune thresholds after loading your specific GLB — open the browser console
 * and log nx/ny/nz values from a few regions to calibrate.
 */
export function getSectionForPoint(nx: number, ny: number, nz: number): SectionId {
  if (ny < -0.35) return 'contact'                            // brain stem — very bottom
  if (ny < -0.05 && nz < -0.05) return 'projects'            // cerebellum — back bottom
  // chatbot (Broca's area) must be checked BEFORE skills (parietal crown)
  // because the left-front-upper region satisfies both ny > 0.05 and ny > 0.35
  if (nx < -0.25 && ny > 0.05 && nz > 0.05) return 'chatbot' // Broca's area — left front
  if (ny > 0.35) return 'skills'                              // parietal — high crown
  if (nz < -0.1 && ny > 0.05) return 'blog'                  // occipital — back mid
  if (ny > 0.1 && nz > 0.05) return 'about'                  // frontal — front upper
  if (Math.abs(ny) < 0.15) return 'personal'                 // limbic — center band
  return 'experience'                                         // temporal — remaining sides
}
