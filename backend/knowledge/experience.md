# Work Experience

## University of Waterloo — Undergraduate Research Assistant (Aug 2026 – Present)
**Waterloo, ON**

I'm currently doing research on ASR (automatic speech recognition) for clinical documentation. I evaluate ASR models on a 380-hour corpus of code-switched Kazakh–Russian medical transcripts, analyzing how transcription errors emerge when speakers switch languages mid-sentence, and using those error patterns to improve the robustness of AI-assisted clinical documentation models.

## Scotiabank — Software Engineering Intern (May 2026 – Aug 2026)
**Consumer Banking Engineering, Toronto**

Full-stack software engineer on the Consumer Banking Engineering production platform, working with React, Spring Boot, and Docker. I built Flowpilot, a VLM-powered ReAct QA agent that automates live UI testing by grounding its actions in what it sees on screen, cutting manual QA time across the platform's services. It was the first AI-powered testing initiative of its kind on the team.

## ESGTree — Software Engineering Intern (Dec 2025 – Apr 2026)
**Waterloo, ON**

I pioneered a production NL-to-SQL agent over a 98-table MySQL database. The agent uses a custom ReAct loop built on the Anthropic Messages API, with FAISS schema retrieval and foreign-key-aware join hints to handle complex multi-table queries. I designed an evaluation suite of 77 user queries drawn from production logs, achieving 90.9% accuracy. Ablation studies showed self-correction contributed +13.0pp and retrieval contributed +7.8pp to accuracy.

I also engineered the backend with read-only database privileges, regex SQL validation, and prompt-level constraints. Multi-tenant isolation was enforced via JWT. I reduced post-query latency by delegating narrative summarization and chart spec generation to Claude Haiku.

I extended the agent with Docker-sandboxed Python execution (using Claude Opus for code generation, with pandas, scipy, and sklearn pre-loaded), enabling trend projection and statistical analysis beyond raw SQL. The system used a 4-model cost/latency tier: Sonnet for reasoning, Opus for code generation, Haiku for planning, summarization, and chart specs.

## FuturIQ — Software Development Intern (Jun 2024 – Dec 2024)
**Brampton, ON**

I owned an end-to-end production ML platform for real estate price prediction. I built a full-stack web application using Flask, PostgreSQL, and JavaScript, integrated with an automated ML pipeline that scraped 1000+ live GTA housing listings via Selenium. The pipeline trained models on dynamically collected market subsets and served predictions through the application backend.

I implemented a full ML training and evaluation pipeline using train-test split, cross-validation, and RMSE. I compared linear and polynomial regression models and deployed a regularized polynomial model that improved generalization on unseen data.

## Summary

I've completed 3 internships across AI, full-stack, and product, and I'm currently doing ASR research at the University of Waterloo. Each role involved building something new rather than maintaining existing systems — I gravitate toward greenfield work and owning initiatives end-to-end.
