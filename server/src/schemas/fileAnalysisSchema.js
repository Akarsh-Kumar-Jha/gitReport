import * as z from "zod";

export const each_file_schema = z.object({
  file_path: z
    .string()
    .describe(
      "The relative path of the file inside the repository. Convert the provided repository URI into a clean relative path. Example: 'repo://Akarsh-Kumar-Jha/langGraph/sha/43e1e5702213cc6442c994bbb1572060380c9914/contents/part1/mcp.md' should become 'langGraph/part1/mcp.md'."
    ),

  file_summary: z
    .string()
    .describe(
      "Give a concise but technically meaningful summary of the file. Explain what the file is intended to do, the problem or purpose it addresses, its main functionalities, the core logic and execution flow, and how its important components work together. Mention important libraries, frameworks, APIs, tools, integrations, algorithms, state management, or design patterns when they are relevant. Do not provide a line-by-line explanation or unnecessary implementation details."
    ),

  technologies: z
    .array(z.string())
    .describe(
      "List the important programming languages, libraries, frameworks, APIs, tools, and external services directly used in this file. Include only technologies that are actually relevant to the file."
    ),

  key_components: z
    .array(z.string())
    .describe(
      "List the important functions, classes, modules, or other major components in the file. For each component, briefly state its responsibility or purpose."
    ),

  dependencies: z
    .array(z.string())
    .describe(
      "List the important dependencies of this file, including external packages, internal modules/files, APIs, services, or other components it relies on. Include only meaningful dependencies."
    ),

  inputs_and_outputs: z
    .string()
    .describe(
      "Describe the important inputs consumed by this file and the outputs, side effects, or results it produces. Mention important data passed between functions, modules, APIs, or external services when relevant."
    )
});
