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
      'CS/BBA double degree · Waterloo × Laurier',
      'Concentrating in AI and strategic management',
      'Full-stack builder — model to interface',
      'Seeking Winter 2027 internships',
    ],
  },
  experience: {
    sectionId: 'experience', label: 'Experience', color: '#7dd8ff',
    lobe: 'Temporal Lobe',
    description: "Memory and pattern recognition. Roles, teams, and the problems I've worked on.",
    hologramBullets: [
      'Scotiabank · SWE Intern · Consumer Banking (2026)',
      'ESGTree · ReAct NL-to-SQL · 98 tables · 90%+ eval accuracy',
      'FuturIQ · ML housing prediction · 1000+ live GTA listings',
      '3 internships across AI, full-stack, and product',
    ],
  },
  projects: {
    sectionId: 'projects', label: 'Projects', color: '#7dd8ff',
    lobe: 'Parietal Lobe',
    description: "Spatial reasoning and problem-solving. Things I've built and shipped.",
    hologramBullets: [
      'Scholr · AI research assistant over 200M+ papers',
      'Multi-agent: recursive queries + subtopic expansion',
      'Studeal · agentic AI platform for student savings',
      'Callable as MCP tool for Claude Code integration',
    ],
  },
  blog: {
    sectionId: 'blog', label: 'Blog', color: '#7dd8ff',
    lobe: 'Occipital Lobe',
    description: "Processing and output. Writing on AI, ML, and whatever I'm thinking about.",
    hologramBullets: [
      'Writing on AI systems and agentic architectures',
      'ML research commentary and breakdowns',
      'Coming soon',
    ],
  },
  personal: {
    sectionId: 'personal', label: 'Personal', color: '#7dd8ff',
    lobe: 'Limbic System',
    description: 'Emotion and motivation. Fitness, cooking, and life outside the terminal.',
    hologramBullets: [
      'Training for a full marathon + 225lb bench',
      'Cooking optimized for macros',
      '12+ case competitions · $3k+ in winnings',
      "Dwarkesh · Lenny's · Morning Brew — always queued",
    ],
  },
  contact: {
    sectionId: 'contact', label: 'Contact', color: '#7dd8ff',
    lobe: 'Cerebellum',
    description: "Coordination and reach. Let's connect, collaborate, or just talk.",
    hologramBullets: [
      'josephbarbosa416@gmail.com',
      'linkedin.com/in/joseph-c-barbosa',
      'github.com/joeyb007',
      'Open to Winter 2027 internships · Jan start',
    ],
  },
}