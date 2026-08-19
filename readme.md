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

<img width="1536" height="1024" alt="ChatGPT Image Aug 20, 2026, 12_05_31 AM" src="https://github.com/user-attachments/assets/2a84ee2f-f21c-498a-bf6d-23cc394bcb02" />
