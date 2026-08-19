import { START, END, StateGraph } from "@langchain/langgraph";
import { state } from "../state/repoState.js";
import { createGetRepoTreeNode, filter_files, fanout } from "../nodes/repoTreeNodes.js";
import { createReadFileNode } from "../nodes/readFileNode.js";
import { combine } from "../nodes/combinerNode.js";
import { architecture_gen, implementation_technical_gen, evaluator } from "../nodes/reportNodes.js";
import { final_report_gen } from "../nodes/finalReportNode.js";

export const createWorkflow = (tools) => {
  const workflow = new StateGraph(state);

  const get_repo_tree_node = createGetRepoTreeNode(tools);
  const read_file_node = createReadFileNode(tools);

  workflow.addNode("Get_Repo_Tree_Node", get_repo_tree_node);
  workflow.addNode("Filter_Files_for_report_Node", filter_files);
  workflow.addNode("Read_File_Node", read_file_node);
  workflow.addNode("Combiner_Node", combine);
  workflow.addNode("Architecture_Report_Node", architecture_gen);
  workflow.addNode("Implementation_Technical_Node", implementation_technical_gen);
  workflow.addNode("Evaluation_Node", evaluator);
  workflow.addNode("Final_Report_Node", final_report_gen);

  workflow.addEdge(START, "Get_Repo_Tree_Node");
  workflow.addEdge("Get_Repo_Tree_Node", "Filter_Files_for_report_Node");
  workflow.addConditionalEdges("Filter_Files_for_report_Node", fanout);
  workflow.addEdge("Read_File_Node", "Combiner_Node");
  workflow.addEdge("Combiner_Node", "Architecture_Report_Node");
  workflow.addEdge("Combiner_Node", "Implementation_Technical_Node");
  workflow.addEdge("Combiner_Node", "Evaluation_Node");
  workflow.addEdge("Architecture_Report_Node", "Final_Report_Node");
  workflow.addEdge("Implementation_Technical_Node", "Final_Report_Node");
  workflow.addEdge("Evaluation_Node", "Final_Report_Node");
  workflow.addEdge("Final_Report_Node", END);

  return workflow.compile();
};
