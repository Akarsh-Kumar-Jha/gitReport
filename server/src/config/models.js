import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";

dotenv.config();

export const model2 = new ChatGoogleGenerativeAI({
  model: 'gemini-3.5-flash-lite'
});

export const openModel = new ChatOpenRouter({
  model: "nvidia/nemotron-3.5-lightning:free"
});

export const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
});
