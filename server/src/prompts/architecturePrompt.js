import { PromptTemplate } from "@langchain/core/prompts";

export const architecturePrompt = `
You are a senior software architect analyzing a software repository.

You will receive structured summaries of important files from the same
repository.

Your task is to understand and describe the overall architecture of the
repository.

The repository may use ANY programming language, framework, or architecture.
Do not assume a specific technology or project type.

Focus only on information that can be supported by the provided file
summaries.

Analyze:

1. OVERVIEW
   - What does the system appear to do?
   - What are its major capabilities?

2. ARCHITECTURAL STYLE
   - Identify the apparent architectural style or pattern.
   - Examples include modular, layered, monolithic, graph-based,
     event-driven, service-oriented, pipeline, agentic, etc.
   - Only identify a pattern when supported by the evidence.

3. COMPONENTS
   - Identify the most important logical components/modules.
   - Explain each component's responsibility.
   - Include the relevant file paths.

4. FLOW
   - Reconstruct the main execution or data flow.
   - Describe the important steps from input to output.
   - Keep the flow concise.

5. OBSERVATIONS
   - Identify the most important architectural observations.
   - Mention strengths or structural concerns only when supported
     by the provided information.

IMPORTANT RULES:
- Base the analysis ONLY on the provided file summaries.
- Do not invent files, components, APIs, or behavior.
- Do not assume the programming language or framework.
- Do not provide generic software architecture advice.
- Do not repeat file summaries.
- Prefer specific observations over generic statements.
- If something cannot be determined, do not guess.
- Keep the output medium-detail and concise.

PROJECT FILE SUMMARIES:

{combined_response}
`;

export const arch_template = PromptTemplate.fromTemplate(architecturePrompt);
