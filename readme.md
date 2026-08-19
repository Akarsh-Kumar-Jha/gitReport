# RepoLens

> AI-powered GitHub repository analyzer that reads a public codebase and explains its architecture, implementation, and code quality.

<p align="center">
  <strong>Understand any codebase. In minutes.</strong>
</p>

<p align="center">
  <a href="https://repolens.akarshjha.in">Live Demo</a>
</p>

---

## Overview

**RepoLens** is an AI-powered GitHub repository analyzer that transforms a public repository into a structured technical report.

Instead of manually exploring dozens of files, RepoLens intelligently selects the most important files, analyzes them, and generates insights about:

- Architecture
- Implementation
- Code quality
- Technical findings
- Recommendations

RepoLens is designed to avoid sending an entire repository to an LLM at once. It uses a **map-reduce style analysis pipeline** with LangGraph to keep the context focused and manageable.

---

## Live Demo

🌐 **https://repolens.akarshjha.in**

Paste any **public GitHub repository URL** and run the analysis.

> Analysis may take 1–2 minutes depending on repository size and backend availability.

---

## How It Works

```text
GitHub Repository URL
          │
          ▼
  Get Repository Tree
       GitHub MCP
          │
          ▼
    Select Important
        Files
       Groq LLM
          │
          ▼
        Send()
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
  File  File  File
Analysis Analysis Analysis
    └─────┼─────┘
          ▼
       Combiner
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
  Architecture
  Implementation
  Evaluation
    └─────┼─────┘
          ▼
    Final Synthesis
       Groq + Zod
          │
          ▼
    Structured Report