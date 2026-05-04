export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'blog'
  | 'personal'
  | 'contact'

export interface RegionConfig {
  sectionId: SectionId
  label: string
  color: string
}

export const SECTIONS: SectionId[] = [
  'about', 'experience', 'projects', 'blog', 'personal', 'contact',
]

export const CONTENT_SECTIONS: SectionId[] = [
  'about', 'experience', 'projects', 'blog', 'personal', 'contact',
]

export const REGION_CONFIGS: Record<SectionId, RegionConfig> = {
  about:      { sectionId: 'about',      label: 'About',      color: '#7dd8ff' },
  experience: { sectionId: 'experience', label: 'Experience', color: '#7dd8ff' },
  projects:   { sectionId: 'projects',   label: 'Projects',   color: '#7dd8ff' },
  blog:       { sectionId: 'blog',       label: 'Blog',       color: '#7dd8ff' },
  personal:   { sectionId: 'personal',   label: 'Personal',   color: '#7dd8ff' },
  contact:    { sectionId: 'contact',    label: 'Contact',    color: '#7dd8ff' },
}

// Maps a normalised point [-1,1] to a brain lobe / section.
// Lobes (front→back, top→bottom): frontal, parietal, temporal, occipital, limbic, cerebellum
export function getSectionForPoint(nx: number, ny: number, nz: number): SectionId {
  if (ny < -0.3)              return 'contact'     // cerebellum — lower back
  if (nz < -0.15 && ny > 0)  return 'blog'        // occipital   — back upper
  if (ny > 0.3)               return 'personal'    // parietal    — crown
  if (nz > 0.1 && ny > 0)    return 'about'       // frontal     — front upper
  if (Math.abs(ny) < 0.2)    return 'experience'  // temporal    — mid band
  return 'projects'                                // remaining
}
