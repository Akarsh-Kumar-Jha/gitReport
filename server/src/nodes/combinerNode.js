export const combine = async (state) => {
  console.log("\n========== COMBINER START ==========");
  console.log("Number of files:", state.file_contents?.length);

  const file_contents = state.file_contents;

  const combined_resp = file_contents.map((file) => ({
    path: file.file_path,
    summary: file.file_summary,
    technologies_used: file.technologies,
    key_components: file.key_components,
    dependencies: file.dependencies,
    inputs_and_outputs: file.inputs_and_outputs
  }));

  console.log("========== COMBINER END ==========");

  return {
    combined_response: combined_resp
  };
};
