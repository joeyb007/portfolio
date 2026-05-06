// ---------------------------------------------------------------------------
// Portfolio content — edit this file to update all section panels.
// Each section has a typed structure; add entries by following the pattern.
// ---------------------------------------------------------------------------

export interface ExperienceEntry {
  company:      string
  role:         string
  period:       string
  location?:    string
  logo?:        string   // path relative to /public, e.g. '/logos/acme.png'
  description?: string
  bullets:      string[]
  tags:         string[]
  caseStudy?:   string   // optional link to a writeup or case study
}

export interface ProjectEntry {
  name:        string
  description: string
  bullets?:    string[]
  tags:        string[]
  link?:       string    // live URL
  github?:     string
  videoUrl?:   string    // YouTube or Loom embed URL
}

export interface EducationEntry {
  program:  string
  period:   string
  schools:  { name: string; degree: string; logo?: string }[]
}

export interface CurrentlyItem {
  prefix:     string
  entity:     string
  suffix:     string
  href?:      string
  sectionId?: string
}

export interface AboutContent {
  paragraphs: string[]
  currently?: CurrentlyItem[]
  education?: EducationEntry
  highlights?: { label: string; value: string }[]
}

export interface PersonalContent {
  paragraphs: string[]
  interests:  { emoji: string; label: string; description: string }[]
}

export interface ContactContent {
  paragraphs: string[]
  email:      string
  links:      { label: string; href: string }[]
}

// ---------------------------------------------------------------------------
// ABOUT
// ---------------------------------------------------------------------------
export const about: AboutContent = {
  paragraphs: [
    'CS/BBA student at Waterloo and Laurier, concentrating in [[AI]] and [[strategic management]]. I work at the intersection of [[applied agentic AI]], [[ML research]], and [[product]], building systems end to end, from model to interface.',
    "I'm drawn to problems where the AI layer is load-bearing: where getting the system right is the product. Real innovation lives in building.",
  ],
  currently: [
    { prefix: 'Working at', entity: 'Scotiabank', suffix: ' as a Software Engineer Intern', sectionId: 'experience' },
    { prefix: 'Building', entity: 'Studeal', suffix: ', an agentic AI platform that helps students save money' },
    { prefix: 'Seeking', entity: 'Winter 2027 Internships', suffix: '' },
  ],
  education: {
    program: 'Double Degree',
    period:  '2025 – Present',
    schools: [
      { name: 'University of Waterloo', degree: 'Computer Science',  logo: '/logos/waterloo.png' },
      { name: 'Wilfrid Laurier University', degree: 'Business Administration', logo: '/logos/laurier.png' },
    ],
  },
  highlights: [
    { label: 'Based in',  value: 'Toronto, CA' },
    { label: 'Interests', value: 'AI, ML, Product' },
  ],
}

// ---------------------------------------------------------------------------
// EXPERIENCE
// ---------------------------------------------------------------------------
export const experience: ExperienceEntry[] = [
  {
    company:     'Scotiabank',
    role:        'Software Engineer Intern',
    period:      'May 2026 – Aug 2026',
    location:    'Toronto, Canada',
    bullets: [
      'Current Full-Stack SWE intern on the Consumer Banking Team; actively seeking Agentic-AI adjacent initiatives',
    ],
    tags: ['Java', 'SpringBoot', 'React.js'],
    logo: '/logos/Scotiabank.png'
  },
  {
    company:     'ESGTree',
    role:        'Software Engineer Intern',
    period:      'Dec 2025 – Apr 2026',
    location:    'Waterloo, Canada',
    bullets: [
      'Piloted and built a production ReAct NL-to-SQL agent over a 98-table DB for GP and CX-team use, eliminating multi-day query turnaround',
      'Implemented FAISS semantic schema retrieval and FK-aware join hints, enabling eval accuracy exceeding 90% ',
      'Engineered backend with read-only DB privileges and row-level security for GP access',
    ],
    tags: ['Python', 'Anthropic API', 'Agentic AI (ReAct)', 'SQL', 'Next.js'],
    logo: '/logos/ESGTree.png'
  },
  {
    company:     'FuturIQ',
    role:        'Software Developer',
    period:      'Jun 2024 – Jan 2025',
    location:    'Mississauga, Canada',
    bullets: [
      'Engineered a multivariate polynomial regression prediction pipeline with NumPy for real-time housing price prediction',
      'Implemented on-demand model retraining using live, location-based, dynamically scraped GTA housing data (1000+ listings)',
      'Deployed end-to-end as a production full-stack application.',
    ],
    tags: ['React', 'Flask', 'NumPy', 'Pandas', 'Selenium', 'Classical ML'],
    logo: '/logos/FuturIQ.png'
  },
]

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
export const projects: ProjectEntry[] = [
  {
    name:        'Scholr',
    description: 'AI research assistant that grounds LLM responses in scientific research',
    bullets: [
      'Aggregates results from 200M+ peer-reviewed papers',
      'Uses a multi-agent architecture to recursively generate queries, aggregate results, and expand into related subtopics',
      'Exposed both via TUI and as a callable MCP tool for Claude integration'
    ],
    tags:   ['Pydantic', 'OpenAI API', 'LLMs', 'Agentic Architecture'],
    github: 'https://github.com/joeyb007/Scholr',
  },
]

// ---------------------------------------------------------------------------
// PERSONAL
// ---------------------------------------------------------------------------
export const personal: PersonalContent = {
  paragraphs: [
    'Outside of tech, I spend a lot of time staying active and in the kitchen.',
  ],
  interests: [
    {
      emoji:       '🏋️',
      label:       'Fitness',
      description: 'Add a line about your training, sport, or routine.',
    },
    {
      emoji:       '🍳',
      label:       'Cooking',
      description: 'Add a line about what you cook or your food interests.',
    },
  ],
}

// ---------------------------------------------------------------------------
// CONTACT
// ---------------------------------------------------------------------------
export const contact: ContactContent = {
  paragraphs: [
    "I'm always open to interesting conversations — whether it's a role, a project, or just a good idea.",
  ],
  email: 'josephbarbosa416@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/joseph-c-barbosa' },
    { label: 'GitHub',   href: 'https://github.com/joeyb007' },
    { label: 'X',        href: 'https://x.com/josephbarbosa00' },
  ],
}
