import { PromptTemplate } from "@langchain/core/prompts";

export const each_file_template = PromptTemplate.fromTemplate(`
Analyze the following source file and produce a concise, technically accurate summary.

File path:
{file_path}

File content:
{file_content}

Focus on the file's purpose, core logic, important components, technologies used,
dependencies, and inputs/outputs. Do not explain the code line-by-line.
Return only the information required by the provided structured schema.
`);
