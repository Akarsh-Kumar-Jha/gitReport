import { Annotation } from "@langchain/langgraph";

export const state = Annotation.Root({
  input_url: Annotation(),
  owner: Annotation(),
  repo: Annotation(),
  tree: Annotation(),
  filtered_files: Annotation(),
  file_contents: Annotation({
    reducer: (current, updated) => [...current, ...updated],
    default: () => []
  }),
  combined_response: Annotation(),
  architecture_report: Annotation(),
  implementation_report: Annotation(),
  evaluation_report: Annotation(),
  report: Annotation(),
});
