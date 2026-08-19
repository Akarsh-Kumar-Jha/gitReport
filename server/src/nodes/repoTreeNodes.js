import { Send } from "@langchain/langgraph";
import { model2 } from "../config/models.js";
import { filter_schema } from "../schemas/filterSchema.js";
import { filter_template } from "../prompts/filterPrompt.js";

const str_filter_model = model2.withStructuredOutput(filter_schema);
const filter_chain = filter_template.pipe(str_filter_model);

export const createGetRepoTreeNode = (tools) => {
  const get_repo_tree = tools.find((tool) => tool.name === "get_repository_tree");

  return async (state) => {
    //https://github.com/Akarsh-Kumar-Jha/langGraph
    const url = state.input_url.trim();
    const owner = url.split("//").at(-1).split("/").at(1);
    console.log(owner, "\n");
    const repo = url.split("//").at(-1).split("/").at(-1);
    console.log(repo, "\n");

    const tree_res = await get_repo_tree.invoke({
      owner: owner,
      repo: repo,
      recursive: true,
    });

    console.log('\n\nTree Response >\n');
    console.dir(JSON.parse(tree_res));

    const parsed_tree = JSON.parse(tree_res);

    return {
      owner: parsed_tree.owner,
      repo: parsed_tree.repo,
      tree: parsed_tree.tree,
    };
  };
};

export const filter_files = async (state) => {
  const tree = state.tree;

  const res = await filter_chain.invoke({
    tree: tree
  });

  console.log('\n\nFilter Model Response >\n');
  console.dir(res);

  return {
    filtered_files: res.filtered_files
  };
};

export const fanout = async (state) => {
  const filtered_files = state.filtered_files;
  console.log('\n\nFiltered files count:', state.filtered_files.length);
  console.log('\n\n----------------FanOut Starts------------------\n');
  return filtered_files.map((file) => {
    return new Send("Read_File_Node", {
      file: file,
      owner: state.owner,
      repo: state.repo
    });
  });
};
