import { PromptTemplate } from "@langchain/core/prompts";

export const evaluationPrompt = `
You are a senior software engineer reviewing a software repository.

You will receive structured summaries of important files from the same
repository.

Your task is to evaluate the repository and identify the most useful,
actionable findings for a developer.

The repository may be ANY type of software and may use ANY programming
language, framework, or architecture.

Evaluate ONLY what can reasonably be inferred from the provided information.

Analyze:

1. STRENGTHS
   - Identify the strongest aspects of the implementation.
   - Focus on things such as:
     - organization
     - modularity
     - maintainability
     - separation of concerns
     - reusability
     - reliability
     - appropriate technology choices
   - Only mention strengths supported by the evidence.

2. ISSUES
   - Identify the most important technical problems or weaknesses.
   - Prioritize issues that could affect:
     - maintainability
     - reliability
     - security
     - performance
     - scalability
     - code quality
     - architecture
   - Every significant issue MUST include file-path evidence.

3. RECOMMENDATIONS
   - Give practical actions to address the identified issues.
   - Prioritize them as high, medium, or low.
   - Do not provide generic advice.
   - Recommendations must be connected to actual observations.

4. OVERALL ASSESSMENT
   - Give a concise professional assessment of the repository.
   - Mention the overall quality and the most important improvement area.

IMPORTANT RULES:

- Base the evaluation ONLY on the provided file summaries.
- Do NOT invent vulnerabilities.
- Do NOT claim something is insecure simply because a security
  configuration was not visible.
- Do NOT claim a dependency is vulnerable unless the provided evidence
  actually establishes that.
- Distinguish confirmed observations from potential risks.
- Missing information is NOT evidence of a problem.
- Do NOT criticize the project merely because something was not shown.
- Avoid generic software-development advice.
- Do not repeat the same issue in multiple sections.
- Focus on the 3–7 most important findings.
- Every issue should include concrete file-path evidence when possible.
- Keep the output medium-detail and actionable.

PROJECT FILE SUMMARIES:

{combined_response}
`;

export const eval_template = PromptTemplate.fromTemplate(evaluationPrompt);
