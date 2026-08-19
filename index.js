import { START, END, StateGraph, Annotation, Send } from "@langchain/langgraph";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenRouter } from "@langchain/openrouter";
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

const openModel = new ChatOpenRouter({
  model:"openrouter/auto-beta"
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
  // console.log(" tree_res >", parsed_tree);

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

  // console.log('\nFilter Res > ',res);

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
};



const each_file_schema = z.object({

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

const str_each_file_model = openModel.withStructuredOutput(each_file_schema);

const each_file_template = PromptTemplate.fromTemplate(`
Analyze the following source file and produce a concise, technically accurate summary.

File path:
{file_path}

File content:
{file_content}

Focus on the file's purpose, core logic, important components, technologies used,
dependencies, and inputs/outputs. Do not explain the code line-by-line.
Return only the information required by the provided structured schema.
`);

const each_file_chain = each_file_template.pipe(str_each_file_model);
const readSelectedFile = async(state) => {
  const file = state.file;
  const get_file_contents = tools.find((tool) => tool.name === 'get_file_contents');
  const file_res = await get_file_contents.func({
    owner:state.owner,
    path:file,
    repo:state.repo
  });

  // console.log('\n File Content Response > ',file_res.at(-1).at(0));


  const model_resp = await each_file_chain.invoke({
    file_path:file_res.at(-1).at(0).resource.uri,
    file_content:file_res.at(-1).at(0).resource.text
  });

  console.log('Each File Summary Model Response >\n');
  console.dir(model_resp);

  return {
    file_contents:[
      {
        uri:file_res.at(-1).at(0).resource.uri,
        text:file_res.at(-1).at(0).resource.text,
        ...model_resp
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

// console.log('Result >',result);


// console.log('\n\n\n tool ->',tools.find((tool) => tool.name === 'get_file_contents'));
// console.log('\n\n Get Files Schema === ');
// console.dir(tools.find((tool) => tool.name === 'get_file_contents').schema, { depth: null });


// tools.map((tool) => {
//   console.log('\n\n Tool ->',tool.name);
// });
