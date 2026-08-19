import { openModel } from "../config/models.js";
import { each_file_schema } from "../schemas/fileAnalysisSchema.js";
import { each_file_template } from "../prompts/fileAnalysisPrompt.js";

const str_each_file_model = openModel.withStructuredOutput(each_file_schema);
const each_file_chain = each_file_template.pipe(str_each_file_model);

export const createReadFileNode = (tools) => {
  const get_file_contents = tools.find((tool) => tool.name === 'get_file_contents');

  return async (state) => {
    const file = state.file;
    const file_res = await get_file_contents.func({
      owner: state.owner,
      path: file,
      repo: state.repo
    });

    const model_resp = await each_file_chain.invoke({
      file_path: file_res.at(-1).at(0).resource.uri,
      file_content: file_res.at(-1).at(0).resource.text
    });

    console.log('Each File Summary Model Response >\n');
    console.dir(model_resp);

    return {
      file_contents: [
        {
          uri: file_res.at(-1).at(0).resource.uri,
          text: file_res.at(-1).at(0).resource.text,
          ...model_resp
        }
      ]
    };
  };
};
