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
      model:'gemini-3.5-flash-lite'
});

const openModel = new ChatOpenRouter({
  model:"nvidia/nemotron-3.5-lightning:free"
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
  }),
  combined_response:Annotation(),
  architecture_report:Annotation(),
  implementation_report:Annotation(),
  evaluation_report:Annotation(),
});

const tools = await client.getTools();
const model_with_tools = model.bindTools(tools);

const get_repo_tree = tools.find((tool) => tool.name === "get_repository_tree");
// console.log("get_repo_tree >");
// console.dir(get_repo_tree);
// console.log("\nSchema >");
// console.dir(get_repo_tree.schema);

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
    .max(15)
    .describe(
      "Select at most 15 files that provide the most useful understanding of the repository."
    ),
});

const str_filter_model = model.withStructuredOutput(filter_schema);

const filter_template = PromptTemplate.fromTemplate(
  `You are an Expert Coder.I am Providing you the Tree Structure Of a Project.Kindly Analyze the structure and Give the Files that are needed to Understand its architecture, dependencies, entry points, core business logic, and code quality.Select at most 15 files.

Prioritize:
- README/documentation
- project configuration
- entry points
- core modules
- business logic
- important integrations
- representative tests when useful

Do not select:
- lockfiles
- generated files
- minified files
- build artifacts
- vendor/dependency directories
Give Output in The Provided Schema.\n\n project_tree : {tree}`,
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
  console.log('\n\nFiltered files count:', state.filtered_files.length);
  console.log('\n\n----------------FanOut Starts------------------\n');
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


const combine = async (state) => {

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

const architectureSchema = z.object({
  system_overview: z.string(),
  
  architectural_style: z.string(),

  major_modules: z.array(
    z.object({
      module_name: z.string(),
      responsibility: z.string(),
      related_files: z.array(z.string()),
    })
  ),

  component_relationships: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      relationship: z.string(),
      explanation: z.string(),
    })
  ),

  end_to_end_flow: z.array(
    z.object({
      step: z.number(),
      component: z.string(),
      description: z.string(),
    })
  ),

  state_and_data_flow: z.string(),

  parallel_processing: z.array(z.string()),

  external_services: z.array(
    z.object({
      service: z.string(),
      purpose: z.string(),
      interaction: z.string(),
    })
  ),

  architecture_observations: z.array(z.string()),
});


const architecturePrompt = `
You are a senior software architect analyzing a software project.

You will receive structured summaries of multiple source files from the same
project. Each summary contains information about the file's purpose,
technologies, key components, dependencies, and inputs/outputs.

Your task is to analyze the files collectively and produce the
ARCHITECTURE AND SYSTEM DESIGN aspect of a technical report.

Do NOT simply repeat the individual file summaries.

Instead, reconstruct the architecture of the overall system from the
information provided.

Focus on:

1. Overall system purpose
   - Explain what the complete system is designed to accomplish.
   - Describe the major capabilities of the system.

2. Architectural style
   - Identify the apparent architecture/pattern.
   - For example: pipeline, graph-based workflow, modular architecture,
     agentic workflow, service-oriented design, etc.
   - Only identify patterns that are supported by the provided information.

3. Major modules
   - Group related files into logical modules.
   - Explain the responsibility of each module.
   - Identify which files belong to each module.

4. Component relationships
   - Explain how important components communicate or depend on one another.
   - Identify upstream and downstream relationships.
   - Explain tool, API, LLM, and workflow relationships.

5. End-to-end execution flow
   - Reconstruct the likely execution sequence.
   - Explain how data moves from the initial input to the final output.
   - Present this as ordered steps.

6. State and data flow
   - Explain important state objects and fields.
   - Explain how information is transformed as it moves through the system.

7. Parallelism
   - Identify components that execute independently or in parallel.
   - Explain why parallel processing is used when this can be inferred.

8. External services
   - Identify APIs, LLM providers, databases, or other external systems.
   - Explain their role in the architecture.

9. Architecture observations
   - Provide important architectural observations that would help a
     developer understand the system.

IMPORTANT:
- Base your analysis ONLY on the provided file information.
- Do not invent files, APIs, functions, or behavior.
- If something cannot be determined, say so rather than guessing.
- Avoid excessive repetition.
- Use precise technical terminology.
- Produce a coherent architectural analysis rather than disconnected notes.

INPUT FILE SUMMARIES:

{combined_response}
`;


const str_arch_model = model2.withStructuredOutput(architectureSchema);

const arch_template = PromptTemplate.fromTemplate(architecturePrompt);

const arch_chain = arch_template.pipe(str_arch_model);

const architecture_gen = async(state) => {
  const combined_response = state.combined_response;

  const arch_model_resp = await arch_chain.invoke({
    combined_response:combined_response
  });

  console.log('\n\narch_model_resp >');
  console.dir(arch_model_resp);

  return {
    architecture_report:arch_model_resp
  }

};



const implementationSchema = z.object({
  technology_stack: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      purpose: z.string(),
    })
  ),

  file_analysis: z.array(
    z.object({
      file_path: z.string(),
      purpose: z.string(),
      key_components: z.array(z.string()),
      dependencies: z.array(z.string()),
      inputs: z.string(),
      outputs: z.string(),
    })
  ),

  architecture_components: z.array(
    z.object({
      component: z.string(),
      purpose: z.string(),
      related_files: z.array(z.string()),
    })
  ),

  data_and_control_flow: z.array(
    z.object({
      step: z.number(),
      description: z.string(),
    })
  ),

  important_implementation_details: z.array(z.string()),

  overall_implementation_summary: z.string(),
});

const implementationPrompt = `
You are a senior software engineer analyzing a software project.

You will receive structured summaries of multiple source files from the
same project.

Your task is to generate the IMPLEMENTATION AND TECHNICAL DETAILS section
of a project report.

The project can be ANY type of software system. Do not assume that it is
an AI, web, backend, mobile, or any other specific type of application.
Identify the technologies, architecture, and implementation patterns only
from the provided information.

Analyze the project as a whole while preserving important file-level
details.

Focus on:

1. Technology stack
   - Identify the main technologies, frameworks, libraries, languages,
     platforms, databases, APIs, or tools mentioned in the files.
   - Group them into meaningful categories.
   - Explain the purpose of each technology.
   - Avoid listing the same technology multiple times.

2. File analysis
   For each provided file:
   - Explain its main purpose.
   - Identify its important components, functions, classes, or modules.
   - Identify its dependencies.
   - Explain its inputs and outputs.
   - Keep the explanation concise but technically meaningful.

3. Architecture components
   - Identify the major logical components of the system.
   - Explain what each component is responsible for.
   - Map components to the relevant files where possible.
   - Components may be anything appropriate to the project, such as
     services, modules, controllers, utilities, workflows, database
     layers, UI components, APIs, workers, or external integrations.

4. System flow
   - Reconstruct the main execution or data flow from the provided files.
   - Present the flow as ordered steps.
   - Explain how information moves between important components.
   - Include important transformations, processing stages, or interactions.

5. Key implementation details
   - Identify important implementation decisions and patterns.
   - Mention things such as modularity, validation, error handling,
     asynchronous processing, state management, authentication,
     database interaction, API integration, caching, or other patterns
     ONLY when supported by the provided information.
   - Do not invent implementation details.

6. Overall implementation summary
   - Give a concise summary of how the project is implemented.
   - Explain how the major parts work together.

IMPORTANT RULES:

- Base the analysis ONLY on the provided file summaries.
- Do not assume technologies or functionality that are not mentioned.
- Do not force the project into a predefined architecture.
- Do not over-focus on any particular technology.
- Do not simply copy the file summaries.
- Consolidate related information and remove unnecessary repetition.
- Preserve exact file paths, technology names, and component names when
  they are provided.
- If information is unavailable, do not guess.
- Prefer concise, specific technical descriptions over generic statements.

PROJECT FILE SUMMARIES:

{combined_response}
`;

const str_imple_model = model2.withStructuredOutput(implementationSchema);
const imple_template = PromptTemplate.fromTemplate(implementationPrompt);

const imple_chain = imple_template.pipe(str_imple_model);
const implementation_technical_gen = async(state) => {
   const combined_response = state.combined_response;

   const imple_model_resp = await imple_chain.invoke({
      combined_response:combined_response
   });

   console.log('\n\n Implementation & Technical Details Report >');
   console.dir(imple_model_resp);

   return {
      implementation_report:imple_model_resp
   }

};



const evaluationSchema = z.object({
  strengths: z.array(
    z.object({
      area: z.string(),
      observation: z.string(),
      benefit: z.string(),
    })
  ),

  limitations: z.array(
    z.object({
      area: z.string(),
      observation: z.string(),
      impact: z.string(),
    })
  ),

  risks: z.array(
    z.object({
      area: z.string(),
      risk: z.string(),
      impact: z.string(),
    })
  ),

  recommendations: z.array(
    z.object({
      priority: z.enum(["high", "medium", "low"]),
      area: z.string(),
      recommendation: z.string(),
    })
  ),

  future_improvements: z.array(
    z.object({
      area: z.string(),
      improvement: z.string(),
      benefit: z.string(),
    })
  ),

  overall_assessment: z.string(),
});

const str_eval_model = model2.withStructuredOutput(evaluationSchema);

const evaluationPrompt = `
You are a senior software engineer and technical architect evaluating a
software project.

You will receive structured summaries of multiple source files from the
same project.

Your task is to generate the EVALUATION AND RECOMMENDATIONS section of a
technical project report.

The project can be ANY type of software system. Do not assume that it is
an AI, web, backend, mobile, or any other specific type of application.

Evaluate the project based ONLY on the information provided.

Analyze the following:

1. Strengths
   - Identify the strongest aspects of the implementation and design.
   - Consider areas such as modularity, maintainability, organization,
     reusability, separation of concerns, reliability, extensibility,
     simplicity, or appropriate technology choices.
   - Explain the practical benefit of each strength.

2. Limitations
   - Identify weaknesses or limitations that can reasonably be inferred
     from the provided information.
   - Explain their possible impact.
   - Do not treat missing information as a confirmed weakness.

3. Risks
   - Identify meaningful technical or operational risks.
   - Consider areas such as dependencies, external services, data
     handling, reliability, maintainability, scalability, configuration,
     or failure handling when relevant.
   - Explain the potential impact of each risk.
   - Only identify risks supported by the available information.

4. Recommendations
   - Provide practical and actionable improvements.
   - Assign each recommendation a priority:
     high, medium, or low.
   - Recommendations should address actual observations from the project,
     not generic software-development advice.

5. Future improvements
   - Suggest realistic enhancements that could improve the project.
   - Consider maintainability, functionality, scalability, usability,
     reliability, performance, or extensibility where appropriate.
   - Keep suggestions relevant to the existing project.

6. Overall assessment
   - Give a concise professional assessment of the overall implementation.
   - Summarize the project's major strengths and the most important areas
     for improvement.

IMPORTANT RULES:

- Base the evaluation ONLY on the provided project information.
- Do not invent files, features, technologies, vulnerabilities, or
  implementation details.
- Do not assume a specific type of software project.
- Do not criticize the project merely because something is not mentioned.
- Distinguish between confirmed observations and reasonable recommendations.
- Avoid generic statements that could apply to every software project.
- Keep each observation concise and technically meaningful.
- Do not repeat the same point across multiple sections.
- Prioritize the most important findings rather than producing a very
  large list.

PROJECT FILE SUMMARIES:

{combined_response}
`;

const eval_template = PromptTemplate.fromTemplate(evaluationPrompt);

const eval_chain = eval_template.pipe(str_eval_model);

const evaluator = async(state) => {
  const combined_response = state.combined_response;

  const eval_model_resp = await eval_chain.invoke({
    combined_response:combined_response
  });

  console.log('\n\n Evaluation Model Report >');
  console.dir(eval_model_resp);

  return {
      evaluation_report:eval_model_resp
  }

}

workflow.addNode("Get_Repo_Tree_Node", get_repo_tree_node);
workflow.addNode("Filter_Files_for_report_Node", filter_files);
workflow.addNode("Read_File_Node",readSelectedFile);
workflow.addNode("Combiner_Node",combine);
workflow.addNode("Architecture_Report_Node",architecture_gen);
workflow.addNode("Implementation_Technical_Node",implementation_technical_gen); //Implementation & Technical Details
workflow.addNode("Evaluation_Node",evaluator); //Evaluation, Limitations & Recommendations

workflow.addEdge(START, "Get_Repo_Tree_Node");
workflow.addEdge("Get_Repo_Tree_Node", "Filter_Files_for_report_Node");
workflow.addConditionalEdges("Filter_Files_for_report_Node",fanout);
workflow.addEdge("Read_File_Node","Combiner_Node");
workflow.addEdge("Combiner_Node","Architecture_Report_Node");
workflow.addEdge("Combiner_Node","Implementation_Technical_Node");
workflow.addEdge("Combiner_Node","Evaluation_Node");
workflow.addEdge("Architecture_Report_Node",END);
workflow.addEdge("Implementation_Technical_Node",END);
workflow.addEdge("Evaluation_Node",END);




const graph = workflow.compile();

// const drawablegraph = await graph.getGraphAsync();
// const mermaid = drawablegraph.drawMermaid();

// console.log(mermaid);

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
