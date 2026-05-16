export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'blog'
  | 'personal'
  | 'contact'

export interface RegionConfig {
  sectionId:       SectionId
  label:           string
  color:           string
  lobe:            string
  description:     string
  hologramBullets: string[]
}

export const SECTIONS: SectionId[] = [
  'about', 'experience', 'projects', 'blog', 'personal', 'contact',
]

export const CONTENT_SECTIONS: SectionId[] = [
  'about', 'experience', 'projects', 'blog', 'personal', 'contact',
]

export const REGION_CONFIGS: Record<SectionId, RegionConfig> = {
  about: {
    sectionId: 'about', label: 'About', color: '#7dd8ff',
    lobe: 'Frontal Lobe',
    description: 'The seat of identity and personality. Who I am, what drives me, and the perspective I bring.',
    hologramBullets: [
      'CS/BBA · Waterloo × Laurier',
      'Applied AI · ML Research · Product',
      'Full-stack builder',
    ],
  },
  experience: {
    sectionId: 'experience', label: 'Experience', color: '#7dd8ff',
    lobe: 'Temporal Lobe',
    description: "Memory and pattern recognition. Roles, teams, and the problems I've worked on.",
    hologramBullets: [
      'Scotiabank — SWE Intern (2026)',
      'ESGTree — ReAct NL-to-SQL, 90%+ accuracy',
      'FuturIQ — ML housing prediction pipeline',
    ],
  },
  projects: {
    sectionId: 'projects', label: 'Projects', color: '#7dd8ff',
    lobe: 'Parietal Lobe',
    description: "Spatial reasoning and problem-solving. Things I've built and shipped.",
    hologramBullets: [
      'Scholr — AI research over 200M+ papers',
      'Studeal — agentic AI for students',
      'Multi-agent · MCP · RAG',
    ],
  },
  blog: {
    sectionId: 'blog', label: 'Blog', color: '#7dd8ff',
    lobe: 'Occipital Lobe',
    description: "Processing and output. Writing on AI, ML, and whatever I'm thinking about.",
    hologramBullets: [
      'Writing on AI, ML, and systems',
      'Coming soon',
    ],
  },
  personal: {
    sectionId: 'personal', label: 'Personal', color: '#7dd8ff',
    lobe: 'Limbic System',
    description: 'Emotion and motivation. Fitness, cooking, and life outside the terminal.',
    hologramBullets: [
      'Training for a full marathon',
      'Cooking optimized for macros',
      '12+ case competitions · $3k+ won',
    ],
  },
  contact: {
    sectionId: 'contact', label: 'Contact', color: '#7dd8ff',
    lobe: 'Cerebellum',
    description: "Coordination and reach. Let's connect, collaborate, or just talk.",
    hologramBullets: [
      'josephbarbosa416@gmail.com',
      'linkedin.com/in/joseph-c-barbosa',
      'Open to Winter 2027 internships',
    ],
  },
}