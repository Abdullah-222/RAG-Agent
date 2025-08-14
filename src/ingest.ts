import fs from "fs";
import pdfParse from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GeminiEmbeddings } from "./lib/gemini-embedding";
import { GeminiAgent } from "./lib/gemini-agent";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
dotenv.config();

export const loadPdf = async (pdfPath: string): Promise<string> => {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfText = await pdfParse(pdfBuffer);
  console.log("PDF loaded successfully");
  return pdfText.text;
};

export const createVectorStore = async (pdfPath: string) => {
  const text = await loadPdf(pdfPath);
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.createDocuments([text]);
  const embeddings = new GeminiEmbeddings(); 
  const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
  console.log(`Vector store created with ${chunks.length} chunks`);
  //console.log(vectorStore);
  return vectorStore;
};

export class RAGSystem {
  private vectorStore: MemoryVectorStore | null = null;
  private agent: GeminiAgent;

  constructor() {
    this.agent = new GeminiAgent();
  }

  async initialize(pdfPath: string) {
    console.log("Initializing RAG system...");
    this.vectorStore = await createVectorStore(pdfPath);
    console.log("RAG system initialized successfully");
  }

  async query(question: string): Promise<string> {
    if (!this.vectorStore) {
      throw new Error("RAG system not initialized. Call initialize() first.");
    }

    const relevantDocs = await this.vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    console.log("Retrieved relevant context:", context.substring(0, 200) + "...");

    const response = await this.agent.generateResponse(question, context);
    return response;
  }

  async chat(question: string, conversationHistory: HumanMessage[] = []): Promise<string> {
    if (!this.vectorStore) {
      throw new Error("RAG system not initialized. Call initialize() first.");
    }

    const relevantDocs = await this.vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    const messages = [...conversationHistory, new HumanMessage(question)];

    const response = await this.agent.chatWithContext(messages, context);
    return response;
  }

  async getRelevantChunks(question: string, k: number = 3) {
    if (!this.vectorStore) {
      throw new Error("RAG system not initialized. Call initialize() first.");
    }

    return await this.vectorStore.similaritySearch(question, k);
  }
}

// Example usage
export const runRAGExample = async () => {
  try {
    const ragSystem = new RAGSystem();
    await ragSystem.initialize("data/ATS classic HR resume.pdf");
    //await ragSystem.initialize("data/AI_Product_Innovation.pdf");

    // Example queries
    const questions = [
      "What are the key skills mentioned in the resume?",
      "What is the candidate's work experience?",
      "What education does the candidate have?"
    ];

    for (const question of questions) {
      console.log(`\nQuestion: ${question}`);
      const answer = await ragSystem.query(question);
      console.log(`Answer: ${answer}`);
    }

  } catch (error) {
    console.error("Error running RAG example:", error);
  }
};

if (require.main === module) {
  runRAGExample();
}
