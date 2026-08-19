import { PromptTemplate } from "@langchain/core/prompts";

export const implementationPrompt = `
You are a senior software engineer analyzing a software repository.

You will receive structured summaries of important source files from the
same repository.

Your task is to explain HOW the project is implemented.

The repository can be ANY type of software and can use ANY programming
language, framework, library, or architecture.

Focus on the actual implementation rather than repeating the architecture
description.

Analyze:

1. TECHNOLOGIES
   - Identify the most important languages, frameworks, libraries,
     databases, APIs, tools, or external services.
   - Explain the purpose of each.
   - Do not list every minor dependency.

2. IMPORTANT COMPONENTS
   - Identify the most important implementation components.
   - Explain their responsibilities.
   - Include relevant file paths.

3. IMPLEMENTATION DETAILS
   - Identify important implementation techniques or decisions.
   - Examples:
     - state management
     - validation
     - asynchronous processing
     - API integration
     - database interaction
     - authentication
     - caching
     - error handling
     - concurrency
     - workflow orchestration
   - Mention these ONLY when supported by the provided information.

4. DATA FLOW
   - Explain how important data moves through the implementation.
   - Keep this as a short ordered sequence.

IMPORTANT RULES:
- Base the analysis ONLY on the provided file summaries.
- Do not invent implementation details.
- Do not assume a specific project type.
- Do not repeat the architecture analysis unnecessarily.
- Do not list every file.
- Focus on implementation details that would help another developer
  understand or maintain the project.
- Keep the output medium-detail and technically specific.

PROJECT FILE SUMMARIES:

{combined_response}
`;

export const imple_template = PromptTemplate.fromTemplate(implementationPrompt);
