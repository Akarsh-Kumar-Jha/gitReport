import { START, END, StateGraph, Annotation, Send } from "@langchain/langgraph";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import * as z from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { tool } from "@langchain/core/tools";

dotenv.config();

const client = new MultiServerMCPClient({
  github: {
    transport: "http",
    url: "https://api.githubcopilot.com/mcp/",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-MCP-Toolsets": "default,git",
      "X-MCP-Readonly": "true",
    },
  },
});

const model2 = new ChatGoogleGenerativeAI({
  model: "Gemini 3.5 Flash-Lite",
});

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
});

const state = Annotation.Root({
  input_url: Annotation(),
  owner: Annotation(),
  repo: Annotation(),
  tree: Annotation(),
  filtered_files:Annotation(),
  file_contents:Annotation({
    reducer:(current,updated) => [...current,...updated],
    default:() => []
  })
});

const tools = await client.getTools();
const model_with_tools = model.bindTools(tools);

const get_repo_tree = tools.find((tool) => tool.name === "get_repository_tree");
console.log("get_repo_tree >");
console.dir(get_repo_tree);
console.log("\nSchema >");
console.dir(get_repo_tree.schema);

const workflow = new StateGraph(state);

const get_repo_tree_node = async (state) => {
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

  const parsed_tree = JSON.parse(tree_res);
  console.log(" tree_res >", parsed_tree);

  return {
    owner: parsed_tree.owner,
    repo: parsed_tree.repo,
    tree: parsed_tree.tree,
  };
};

const filter_schema = z.object({
  filtered_files: z
    .array(z.string())
    .describe(
      "All The Important Files That need to Understand the Project.with their path",
    ),
});

const str_filter_model = model.withStructuredOutput(filter_schema);

const filter_template = PromptTemplate.fromTemplate(
  "You are an Expert Coder.I am Providing you the Tree Structure Of a Project.Kindly Analyze the structure and Give the Files that are needed to Understand its architecture, dependencies, entry points, core business logic, and code quality. Give Output in The Provided Schema.\n\n project_tree : {tree}",
);

const filter_chain = filter_template.pipe(str_filter_model);

const filter_files = async (state) => {
  const tree = state.tree;

  const res = await filter_chain.invoke({
    tree:tree
  });

  console.log('\nFilter Res > ',res);

  return {
    filtered_files:res.filtered_files
  };
};

const fanout = async(state) => {
  const filtered_files = state.filtered_files;
  console.log('----------------FanOut Starts------------------\n');
  return filtered_files.map((file) => {
    return new Send("Read_File_Node",{
        file:file,
        owner:state.owner,
        repo:state.repo
    });
  })
}

const readSelectedFile = async(state) => {
  const file = state.file;
  const get_file_contents = tools.find((tool) => tool.name === 'get_file_contents');
  const file_res = await get_file_contents.func({
    owner:state.owner,
    path:file,
    repo:state.repo
  });

  // console.log('\n File Content Response > ',file_res.at(-1).at(0));


  return {
    file_contents:[
      {
        uri:file_res.at(-1).at(0).resource.uri,
        text:file_res.at(-1).at(0).resource.text
      }
    ]
  };

};

workflow.addNode("Get_Repo_Tree_Node", get_repo_tree_node);
workflow.addNode("Filter_Files_for_report_Node", filter_files);
workflow.addNode("Read_File_Node",readSelectedFile);

workflow.addEdge(START, "Get_Repo_Tree_Node");
workflow.addEdge("Get_Repo_Tree_Node", "Filter_Files_for_report_Node");
workflow.addConditionalEdges("Filter_Files_for_report_Node",fanout);
workflow.addEdge("Read_File_Node",END);

const graph = workflow.compile();

const result = await graph.invoke({
  input_url: "https://github.com/Akarsh-Kumar-Jha/langGraph ",
});

console.log('Result >',result);


// console.log('\n\n\n tool ->',tools.find((tool) => tool.name === 'get_file_contents'));
// console.log('\n\n Get Files Schema === ');
// console.dir(tools.find((tool) => tool.name === 'get_file_contents').schema, { depth: null });


// tools.map((tool) => {
//   console.log('\n\n Tool ->',tool.name);
// });
