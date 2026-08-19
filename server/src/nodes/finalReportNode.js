import { model2 } from "../config/models.js";
import { finalReportSchema } from "../schemas/finalReportSchema.js";
import { finalReportTemplate } from "../prompts/finalReportPrompt.js";

const str_final_report_model = model2.withStructuredOutput(finalReportSchema);
const final_report_chain = finalReportTemplate.pipe(str_final_report_model);

export const final_report_gen = async (state) => {
  const { owner, repo, architecture_report, implementation_report, evaluation_report, filtered_files } = state;
  const final_report_model_resp = await final_report_chain.invoke({
    architecture_report: architecture_report,
    evaluation_report: evaluation_report,
    implementation_report: implementation_report,
    owner: owner,
    repo: repo
  });

  const fullReport = {
    ...final_report_model_resp,
    analyzed_files_count: filtered_files?.length || 0,
    analyzed_files: filtered_files || []
  };

  console.log('\n\n Final Report Generated✅');
  console.dir(fullReport);

  return {
    report: fullReport
  };
};
