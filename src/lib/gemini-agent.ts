// gemini-agent.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export class GeminiAgent {
  private model;
  private chatModel;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.chatModel = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      maxOutputTokens: 2048,
      temperature: 0.7,
    });
  }

  async generateResponse(prompt: string, context?: string): Promise<string> {
    let fullPrompt = prompt;
    
    if (context) {
      fullPrompt = `Context: ${context}\n\nQuestion: ${prompt}\n\nPlease answer based on the provided context.`;
    }

    const result = await this.model.generateContent(fullPrompt);
    return result.response.text();
  }

  async chatWithContext(messages: Array<HumanMessage | AIMessage>, context?: string): Promise<string> {
    let systemPrompt = "";
    if (context) {
      systemPrompt = `You are a helpful assistant. Use the following context to answer questions: ${context}`;
    }

    const response = await this.chatModel.invoke([
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages
    ]);

    return response.content as string;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await embeddingModel.embedContent(text);
    console.log(result);
    return result.embedding.values;
  }
} 