import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import dotenv from "dotenv";

dotenv.config();

export const client = new MultiServerMCPClient({
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

export const getTools = async () => {
  return await client.getTools();
};
