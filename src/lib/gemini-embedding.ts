import { GoogleGenerativeAI } from "@google/generative-ai";
import { Embeddings } from "@langchain/core/embeddings";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export class GeminiEmbeddings extends Embeddings {
  private model;

  constructor() {
    super({});
    this.model = genAI.getGenerativeModel({ model: "embedding-001" });
  }

  async embedQuery(text: string): Promise<number[]> {
    const result = await this.model.embedContent(text);
    
    return result.embedding.values;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return await Promise.all(texts.map(text => this.embedQuery(text)));
  }
}
