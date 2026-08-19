import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getTools } from "./src/config/mcpClient.js";
import { createWorkflow } from "./src/graph/workflow.js";
import { createReportRouter } from "./src/routes/reportRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log("Initializing MCP Tools and compiling LangGraph workflow...");
const tools = await getTools();
const graph = createWorkflow(tools);
console.log("Workflow compiled successfully.");

app.use(createReportRouter(graph));

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`   - Health Check:    GET  http://localhost:${PORT}/health`);
  console.log(`   - Generate Report: POST http://localhost:${PORT}/api/report`);
});
