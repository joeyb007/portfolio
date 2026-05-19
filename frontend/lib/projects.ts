export interface ProjectEntry {
  name:       string
  tagline:    string
  stack:      string[]
  bullets:    string[]
  github?:    string
  youtubeId?: string
}

export const PROJECTS: ProjectEntry[] = [
  {
    name:      'Scholr',
    tagline:   'An Agentic AI research assistant disseminating access to 200M+ scientific publications',
    stack:     ['Python', 'FastAPI', 'asyncio', 'OpenAI gpt-4o-mini', 'OpenAlex API', 'Next.js', 'NextAuth.js', 'Neon Postgres', 'SSE'],
    bullets:   [
      'Depth-limited recursive retrieval with parallel asyncio sub-pipelines; post-synthesis validation strips citations not present in retrieved paper IDs',
      'Dual interface: MCP server (Claude Desktop/Cursor) + web app with live SSE streaming, inline citation pills, BibTeX export, and Postgres-persisted conversation history',
      'Google OAuth + email/password auth, anonymous-first onboarding, and IP-based rate limiting on the FastAPI backend',
    ],
    github:    'https://github.com/joeyb007/Scholr',
    youtubeId: '7cnHikLhers', // paste YouTube video ID here (part after v=)
  },
  {
    name:    'PantryPal',
    tagline: 'LLMs hallucinate recipes that violate dietary restrictions. PantryPal fine-tunes a model that can\'t.',
    stack:   ['Llama 3.2 3B', 'QLoRA', 'DPO', 'unsloth', 'trl', 'XGBoost', 'TF-IDF', 'FastAPI', 'HuggingFace Transformers'],
    bullets: [
      'Fine-tuned Llama 3.2 3B on 8K dietary-constrained recipes via QLoRA SFT, then applied DPO using 18 XGBoost classifiers as an automated reward model — no human preference labeling required',
      'Achieved X% constraint satisfaction vs Y% (base Llama 3.2 3B) and Z% (GPT-4o) on a 500-prompt held-out benchmark across 18 dietary restriction categories',
      'Measured X pp SFT→DPO improvement delta, validating XGBoost as an effective reward signal for preference optimization',
    ],
    github: 'https://github.com/joeyb007/pantry-pal',
  },
  {
    name:    'Studeal',
    tagline: 'Canadian students overpay for tech because no tool actively hunts deals for them — Studeal does it autonomously.',
    stack:   ['LangGraph', 'FastAPI', 'pgvector', 'OpenAI embeddings', 'Celery + Redis', 'Next.js 15', 'PostgreSQL', 'Brave Search API', 'Stripe'],
    bullets: [
      'Multi-agent pipeline (LangGraph) that searches, extracts, scores, and deduplicates deals via semantic similarity — concurrent hunts across sources with semaphore-bounded asyncio parallelism',
      'Conversational agent progressively extracts user intent through natural dialogue and deploys a persistent background worker to scan the web on their behalf',
      'Full-stack with auth, Stripe billing, email digests, RAG-powered market context scoring, Sentry, rate limiting, and pgvector-indexed semantic search',
    ],
    github: 'https://github.com/joeyb007/Studeal',
  },
  {
    name:    'From Scratch',
    tagline: '',
    stack:   [],
    bullets: [],
    github:  'https://github.com/joeyb007/from-scratch',
  },
]
