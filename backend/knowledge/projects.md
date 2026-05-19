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

## Studeal — Agentic Deal Hunter for Students
**GitHub: github.com/joeyb007/Studeal**

Canadian students overpay for tech because no tool actively hunts deals for them. Studeal does it autonomously.

Tell Studeal what you need and it deploys a background agent that hunts deals across the web, scores them by relevance, and sends you alerts. No manual searching required.

**How it works:**
- Multi-agent pipeline (LangGraph) that searches, extracts, scores, and deduplicates deals using semantic similarity
- Concurrent hunts across sources via asyncio with semaphore-bounded parallelism
- Conversational agent that progressively extracts user intent through natural dialogue, then deploys a persistent background worker
- Full-stack: auth, Stripe billing, email digests, RAG-powered market context scoring, Sentry monitoring, rate limiting, pgvector-indexed semantic search

**Stack:** LangGraph, FastAPI, pgvector, OpenAI embeddings, Celery + Redis, Next.js 15, PostgreSQL, Brave Search API, Stripe

---

## From Scratch — Foundational AI/ML Implementations
**GitHub: github.com/joeyb007/from-scratch**

The fastest way to learn AI is to build it yourself. No libraries, no abstractions — just fundamentals.

A collection of ground-up implementations of foundational AI and ML concepts, built to understand how things actually work at a deep level rather than just calling a library.

**Built so far:**
- Automatic differentiation engine (backpropagation from scratch)

**Concepts covered:** Backpropagation, OOP, modular design, calculus

**Stack:** Python, NumPy
