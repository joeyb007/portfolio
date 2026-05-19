export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'blog'
  | 'personal'
  | 'contact'

// A single indented item inside a category block
export interface BulletItem {
  text:  string    // company/school name shown after the logo
  logo?: string    // filename inside /logos/
  note?: string    // short prefix shown before the logo, e.g. "CS + AI @"
  desc?: string    // description shown below text, e.g. role or detail
  link?: string    // makes the item a clickable link
}

// A labelled category group, e.g. { category: 'currently', items: [...] }
export interface BulletCategory {
  category: string
  items:     BulletItem[]
}

// Each entry in hologramBullets is either a plain paragraph or a category group
export type HologramBullet = string | BulletCategory

export interface RegionConfig {
  sectionId:       SectionId
  label:           string
  color:           string
  lobe:            string
  lobeFunction:    string
  sectionDesc:     string
  hologramBullets: HologramBullet[]
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
    lobe:         'Frontal Lobe',
    lobeFunction: 'The seat of identity and personality.',
    sectionDesc:  'Who I am, what drives me, and my perspective.',
    hologramBullets: [
      {
        category: 'currently',
        items: [
          { note: 'CS + AI @',  logo: 'waterloo.png', text: 'University of Waterloo'    },
          { note: 'BBA @',      logo: 'laurier.png',  text: 'Wilfrid Laurier University' },
        ],
      },
      "Exploring SWE, AI, ML, product, and design. I see myself as a jack of all trades, equipping myself for the high-agency era of AI.",
      {
        category: 'seeking',
        items: [
          { text: 'Winter 2027 internships · Jan start' },
          { text: 'Roles across SWE, AI, and product' },
          { text: 'Fast-moving, high-agency teams' },
        ],
      },
    ],
  },
  experience: {
    sectionId: 'experience', label: 'Experience', color: '#7dd8ff',
    lobe:         'Temporal Lobe',
    lobeFunction: 'Memory and pattern recognition.',
    sectionDesc:  "Roles, teams, and the problems I've worked on.",
    hologramBullets: [
      {
        category: 'currently',
        items: [
          {
            logo: 'Scotiabank.png', text: 'Scotiabank',
            desc: 'Leading an agentic QA initiative on the CBE banking platform, building an LLM agent for regression tests from code diffs in CI/CD',
          },
        ],
      },
      {
        category: 'previously',
        items: [
          {
            logo: 'ESGTree.png', text: 'ESGTree',
            desc: 'Pioneered a NL-to-SQL agent with Python codegen for data analysis and trend projection',
          },
          {
            logo: 'FuturIQ.png', text: 'FuturIQ',
            desc: 'ML platform scraping 1000+ live GTA listings; polynomial model from training to production',
          },
        ],
      },
      { category: '', items: [{ text: 'View my resume', link: '/resume.pdf' }] },
    ],
  },
  projects: {
    sectionId: 'projects', label: 'Projects', color: '#7dd8ff',
    lobe:          'Parietal Lobe',
    lobeFunction:  'Spatial reasoning and problem-solving.',
    sectionDesc:   "Things I've built and shipped.",
    hologramBullets: [
      'Scholr · AI research assistant over 200M+ papers',
      'Multi-agent: recursive queries + subtopic expansion',
      'Studeal · agentic AI platform for student savings',
      'Callable as MCP tool for Claude Code integration',
    ],
  },
  blog: {
    sectionId: 'blog', label: 'Blog', color: '#7dd8ff',
    lobe:          'Occipital Lobe',
    lobeFunction:  'Processing and output.',
    sectionDesc:   "Technical and personal writing.",
    hologramBullets: [
      'Coming soon',
    ],
  },
  personal: {
    sectionId: 'personal', label: 'Personal', color: '#7dd8ff',
    lobe:          'Limbic System',
    lobeFunction:  'Emotion and motivation.',
    sectionDesc:   'Fitness, cooking, and life outside the terminal.',
    hologramBullets: [
      {
        category: 'sport',
        items: [
          { text: 'Strength training 6x/week' },
          { text: 'Chasing a 225lb bench + full marathon' },
          { text: 'Road cyclist + amateur golfer' },
        ],
      },
      {
        category: 'outside the gym',
        items: [
          { text: 'Cook a new LLM-sourced recipe weekly, always optimizing for macros' },
          { text: '12+ case competitions · $3k+ in winnings' },
          { text: "Lenny's Podcast + Dwarkesh on repeat" },
          { text: 'Currently reading: Thinking Fast and Slow' },
        ],
      },
    ],
  },
  contact: {
    sectionId: 'contact', label: 'Contact', color: '#7dd8ff',
    lobe:          'Cerebellum',
    lobeFunction:  'Coordination and reach.',
    sectionDesc:   "Let's connect, collaborate, or just talk.",
    hologramBullets: [
      "I'm always open to new opportunities, collaborations, or just a good conversation.",
      {
        category: 'reach me',
        items: [
          { text: 'josephbarbosa416@gmail.com',        link: 'mailto:josephbarbosa416@gmail.com'              },
          { text: 'linkedin/joseph-c-barbosa',         link: 'https://linkedin.com/in/joseph-c-barbosa'       },
          { text: 'github/joeyb007',                   link: 'https://github.com/joeyb007'                    },
          { text: 'x/josephbarbosa00',                 link: 'https://x.com/josephbarbosa00'                  },
        ],
      },
      {
        category: 'availability',
        items: [
          { text: 'Open to Winter 2027 (Jan) internships' },
          { text: 'Always looking to build, learn, and grow; if there\'s an idea, I\'m interested' },
        ],
      },
    ],
  },
}
