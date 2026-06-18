<div align="center">
  <img src="frontend/public/jb.png" alt="JB logo" width="120" />

  # josephbarbosa.com

  An interactive 3D portfolio — a brain you can talk to.

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
  [![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-9-black?logo=three.js)](https://docs.pmnd.rs/react-three-fiber)
  [![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
  [![Claude](https://img.shields.io/badge/Claude-Anthropic-D97757?logo=anthropic&logoColor=white)](https://www.anthropic.com)
  [![ElevenLabs](https://img.shields.io/badge/ElevenLabs-voice-black)](https://elevenlabs.io)

  **[josephbarbosa.com →](https://josephbarbosa.com)**
</div>

---

## What this is

A 3D point-cloud brain rendered in the browser that you can scroll through, click on, and chat with. Each lobe maps to a section of my background — projects, experience, education — and a RAG-style AI assistant answers questions about me in a natural, spoken voice.

- **Talk to it.** Ask about my work, projects, or background and get a real (Claude-generated, ElevenLabs-spoken) answer.
- **Click a lobe.** Brain regions highlight and a holographic card projects out with the relevant content.
- **Scroll to explore.** Sections are paginated and tied to brain region highlights.

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | Next.js (App Router), TypeScript, React Three Fiber, Three.js, `drei` |
| Backend | Python, FastAPI |
| AI | Anthropic Claude (Haiku guardrails + Sonnet generation) |
| Voice | ElevenLabs TTS |
| Hosting | Vercel (frontend) · Railway (backend) · Cloudflare (DNS) |

## Architecture

```
frontend/   Next.js app — 3D brain, chat UI, hologram cards
  app/            routes, layout, global styles
  components/     BrainCanvas, ChatBar, ChatThread, HologramCard, ...
  lib/             region/content mapping, shaders, API client

backend/    FastAPI service
  main.py          chat endpoint, guardrails, TTS pipeline
  knowledge/       source-of-truth content the assistant draws from
```

The frontend sends chat messages to the backend, which runs an input guardrail (Haiku), generates a grounded reply (Sonnet) using a small knowledge base, optionally synthesizes speech (ElevenLabs), and returns the reply plus a `sectionId` so the brain can highlight the relevant lobe.

## Running locally

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# add ANTHROPIC_API_KEY and ELEVENLABS_API_KEY to a .env file
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
# set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 in .env.local
npm run dev
```

## Deployment

- Frontend deploys to Vercel on push.
- Backend deploys to Railway via the included `Procfile`.
- DNS is managed through Cloudflare, pointing the custom domain at Vercel.

---

<div align="center">
  <sub>Built by <a href="https://josephbarbosa.com">Joseph Barbosa</a></sub>
</div>
