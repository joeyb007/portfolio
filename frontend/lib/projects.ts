export interface ProjectEntry {
  name:        string
  tagline:     string
  stack:       string[]
  bullets:     string[]
  github?:     string
  youtubeId?:  string
  liveUrl?:    string
  builtSoFar?: string[]
}

export const PROJECTS: ProjectEntry[] = [
  {
    name:      'Scholr',
    tagline:   'AI research assistant over 200M+ scientific papers.\n300+ users and counting.',
    stack:     ['Python', 'FastAPI', 'asyncio', 'OpenAI gpt-4o-mini', 'OpenAlex API', 'Next.js', 'NextAuth.js', 'Neon Postgres', 'SSE'],
    bullets:   [
      'Scientific knowledge is locked behind papers most people lack the time or skills to read. Scholr uses AI agents to retrieve from 200M+ publications and synthesize a fully-cited answer. You should not need a PhD to access the literature.',
    ],
    github:    'https://github.com/joeyb007/Scholr',
    liveUrl:   'https://tryscholr.com',
    youtubeId: '7cnHikLhers',
  },
  {
    name:    'PantryPal',
    tagline: 'ChatGPT kept breaking my diet with hallucinated recipes. So I fine-tuned a model that actually gets it.',
    stack:   ['Llama 3.2 3B', 'QLoRA', 'DPO', 'unsloth', 'trl', 'XGBoost', 'TF-IDF', 'FastAPI', 'HuggingFace Transformers'],
    bullets: [
      'Fine-tuned Llama 3.2 3B to stop hallucinating meals that break dietary restrictions. Used QLoRA for efficient training and DPO with XGBoost classifiers as an automated reward signal, removing the need for human preference labeling entirely.',
      'Achieved X% constraint satisfaction vs Y% (base Llama 3.2 3B) and Z% (GPT-4o) on a 500-prompt held-out benchmark across 18 dietary restriction categories',
      'Measured X pp SFT→DPO improvement delta, validating XGBoost as an effective reward signal for preference optimization',
    ],
    github: 'https://github.com/joeyb007/pantry-pal',
  },
  {
    name:    'Studeal',
    tagline: 'Students overpay for tech because no tool actively hunts deals for them. Studeal does it autonomously.',
    stack:   ['LangGraph', 'FastAPI', 'pgvector', 'OpenAI embeddings', 'Celery + Redis', 'Next.js 15', 'PostgreSQL', 'Brave Search API', 'Stripe'],
    bullets: [
      'Tell Studeal what you need and it deploys a background agent that hunts deals across the web, scores them by relevance, and sends you alerts. Includes a conversational onboarding agent, Stripe billing, email digests, and pgvector-powered semantic search.',
    ],
    github: 'https://github.com/joeyb007/Studeal',
  },
  {
    name:    'From Scratch',
    tagline: 'The best way to learn is by doing.\nClassic AI/ML, implemented from the ground up.',
    stack:   ['Python', 'NumPy', 'Backpropagation', 'OOP', 'Modular Design', 'Calculus'],
    bullets: [
      'The fastest way to learn AI is to build it yourself. No libraries, no abstractions, just fundamentals.',
    ],
    builtSoFar: [
      'Automatic differentiation engine',
    ],
    github:  'https://github.com/joeyb007/from-scratch',
  },
]
