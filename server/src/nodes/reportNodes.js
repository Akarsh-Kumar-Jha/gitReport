import { model2 } from "../config/models.js";
import { architectureSchema } from "../schemas/architectureSchema.js";
import { arch_template } from "../prompts/architecturePrompt.js";
import { implementationSchema } from "../schemas/implementationSchema.js";
import { imple_template } from "../prompts/implementationPrompt.js";
import { evaluationSchema } from "../schemas/evaluationSchema.js";
import { eval_template } from "../prompts/evaluationPrompt.js";

const str_arch_model = model2.withStructuredOutput(architectureSchema);
const arch_chain = arch_template.pipe(str_arch_model);

export const architecture_gen = async (state) => {
  const combined_response = state.combined_response;

  const arch_model_resp = await arch_chain.invoke({
    combined_response: combined_response
  });

  console.log('\n\narch_model_resp >');
  console.dir(arch_model_resp);

  return {
    architecture_report: arch_model_resp
  };
};

const str_imple_model = model2.withStructuredOutput(implementationSchema);
const imple_chain = imple_template.pipe(str_imple_model);

export const implementation_technical_gen = async (state) => {
  const combined_response = state.combined_response;

  const imple_model_resp = await imple_chain.invoke({
    combined_response: combined_response
  });

  console.log('\n\n Implementation & Technical Details Report >');
  console.dir(imple_model_resp);

  return {
    implementation_report: imple_model_resp
  };
};

const str_eval_model = model2.withStructuredOutput(evaluationSchema);
const eval_chain = eval_template.pipe(str_eval_model);

export const evaluator = async (state) => {
  const combined_response = state.combined_response;

  const eval_model_resp = await eval_chain.invoke({
    combined_response: combined_response
  });

  console.log('\n\n Evaluation Model Report >');
  console.dir(eval_model_resp);

  return {
    evaluation_report: eval_model_resp
  };
};
