# Projects

## Scholr — AI Research Assistant
**Live at tryscholr.com | 300+ users**

Scientific knowledge is locked behind papers most people lack the time or skills to read. Scholr uses AI agents to retrieve from 200M+ publications and synthesize a fully-cited answer. You should not need a PhD to access the literature.

The personal origin: my parents started going to the gym and I kept sending them research papers on training and nutrition they'd never read. I wanted them to be able to just ask a question and get a real answer.

**How it works:**
- Depth-limited recursive retrieval pipeline with parallel asyncio sub-pipelines for comparison queries
- Post-synthesis validation strips any citation not present in the retrieved paper IDs (eliminates hallucinated citations)
- Dual interface: MCP server (works in Claude Desktop and Cursor) + web app with live SSE token streaming, inline citation pills, BibTeX export, and multi-turn conversation history persisted to Postgres
- Google OAuth + email/password auth, anonymous-first onboarding flow, IP-based rate limiting on the FastAPI backend

**Stack:** Python, FastAPI, asyncio, Pydantic, OpenAI gpt-4o-mini, OpenAlex API, Next.js App Router, NextAuth.js, Neon Postgres, Railway, Vercel, SSE

---

## PantryPal — Dietary-Constrained Recipe Model
**GitHub: github.com/joeyb007/pantry-pal**

ChatGPT kept breaking my diet with hallucinated recipes that violated my dietary restrictions. So I fine-tuned a model that actually gets it.

General-purpose LLMs hallucinate recipes that violate dietary restrictions — they optimize for plausibility, not constraint satisfaction. PantryPal fine-tunes Llama 3.2 3B to stop this.

**How it works:**
- Fine-tuned Llama 3.2 3B on 8K dietary-constrained recipe examples using QLoRA SFT
- Applied DPO using 18 XGBoost classifiers as an automated reward model — eliminating the need for human preference labeling
- Evaluated on a 500-prompt held-out benchmark across 18 dietary restriction categories
- Measured SFT→DPO improvement delta, validating XGBoost as an effective reward signal for preference optimization

**Stack:** Llama 3.2 3B, QLoRA, DPO, unsloth, trl, XGBoost, TF-IDF, FastAPI, HuggingFace Transformers, OpenAI API (evals)

---

## Studeal — Deal-Hunting Agent for Secondhand Marketplaces
**GitHub: github.com/joeyb007/Studeal** · **Live: studeal.site**

Buying secondhand means weeks of open tabs and texting the one friend who knows what things are worth. Studeal replaces that friend with an agent, built for P2P marketplaces (Facebook Marketplace, Kijiji, eBay) where there are no APIs, no catalogs, and no structured feeds: the segment retail-focused agentic commerce (ACP, UCP) doesn't touch.

Tell Scout, the conversational persona, what you're after and it elicits a typed spec through casual dialogue (an LLM-driven state machine over a re-injected JSON context). A fleet of browser agents then sweeps 10 marketplaces in parallel, and you get back your best matches, what each is worth, and exactly what to offer.

**How it works:**
- Browser agents drive Chrome over CDP, reading each page as a serialized accessibility/DOM tree, so the same loop works on every marketplace with zero site-specific scrapers
- Producer-consumer split: the navigator only covers pages, snapshotting each onto a queue; parallel extractor workers with fresh context pull structured listings via overlapped chunking. Versus a single-agent ReAct baseline: 2.7× the unique listings, 2.7× faster, 40% cheaper
- Listings fuse title text with the seller's photo into 1024-d multimodal embeddings, so a "Callaway Left Hand Driver (NEW)" whose title never says "golf" still embeds as golf clubs
- Recommendations run SQL prefilter → pgvector cosine shortlist → listwise LLM ranker, all precomputed so the read path serves in ~50ms
- Ask Scout: grounded chat over any listing (even a pasted URL), with price verdicts backed by percentiles over comparable listings from the shared pool: what to offer, what's fair, when to walk away
- Deterministic code owns every agent exit (stall detection, page-dry heuristics, hard deadlines, spend caps); the model proposes actions but can never choose to run forever

**Stack:** FastAPI, Celery + Redis, PostgreSQL + pgvector, AWS Bedrock (Claude Sonnet/Haiku, Titan multimodal embeddings), CDP browser agents via Browserbase, Next.js, Stripe, Resend

---

## From Scratch — Foundational AI/ML Implementations
**GitHub: github.com/joeyb007/from-scratch**

The fastest way to learn AI is to build it yourself. No libraries, no abstractions — just fundamentals.

A collection of ground-up implementations of foundational AI and ML concepts, built to understand how things actually work at a deep level rather than just calling a library.

**Built so far:**
- Automatic differentiation engine (backpropagation from scratch)

**Concepts covered:** Backpropagation, OOP, modular design, calculus

**Stack:** Python, NumPy
