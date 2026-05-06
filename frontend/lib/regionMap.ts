export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'blog'
  | 'personal'
  | 'contact'

export interface RegionConfig {
  sectionId:   SectionId
  label:       string
  color:       string
  lobe:        string
  description: string
}

export const SECTIONS: SectionId[] = [
  'about', 'experience', 'projects', 'blog', 'personal', 'contact',
]

export const CONTENT_SECTIONS: SectionId[] = [
  'about', 'experience', 'projects', 'blog', 'personal', 'contact',
]

export const REGION_CONFIGS: Record<SectionId, RegionConfig> = {
  about:      {
    sectionId: 'about',      label: 'About',      color: '#7dd8ff',
    lobe: 'Frontal Lobe',
    description: 'The seat of identity and personality. Who I am, what drives me, and the perspective I bring.',
  },
  experience: {
    sectionId: 'experience', label: 'Experience', color: '#7dd8ff',
    lobe: 'Temporal Lobe',
    description: 'Memory and pattern recognition. Roles, teams, and the problems I\'ve worked on.',
  },
  projects:   {
    sectionId: 'projects',   label: 'Projects',   color: '#7dd8ff',
    lobe: 'Parietal Lobe',
    description: 'Spatial reasoning and problem-solving. Things I\'ve built and shipped.',
  },
  blog:       {
    sectionId: 'blog',       label: 'Blog',       color: '#7dd8ff',
    lobe: 'Occipital Lobe',
    description: 'Processing and output. Writing on AI, ML, and whatever I\'m thinking about.',
  },
  personal:   {
    sectionId: 'personal',   label: 'Personal',   color: '#7dd8ff',
    lobe: 'Limbic System',
    description: 'Emotion and motivation. Fitness, cooking, and life outside the terminal.',
  },
  contact:    {
    sectionId: 'contact',    label: 'Contact',    color: '#7dd8ff',
    lobe: 'Cerebellum',
    description: 'Coordination and reach. Let\'s connect, collaborate, or just talk.',
  },
}