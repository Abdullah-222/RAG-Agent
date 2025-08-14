import readline from 'readline';
import { RAGSystem } from './ingest';
import * as dotenv from "dotenv";
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log("🤖 RAG System with Gemini Agent");
  console.log("================================\n");

  const ragSystem = new RAGSystem();
  
  try {
    console.log("Initializing RAG system...");
    await ragSystem.initialize("data/ATS classic HR resume.pdf");
    console.log("✅ RAG system ready!\n");

    console.log("You can now ask questions about the document.");
    console.log("Type 'quit' to exit.\n");

    const askQuestion = () => {
      rl.question('❓ Your question: ', async (question) => {
        if (question.toLowerCase() === 'quit') {
          console.log('👋 Goodbye!');
          rl.close();
          return;
        }

        try {
          console.log('\n🔍 Searching for relevant information...');
          const answer = await ragSystem.query(question);
          console.log(`\n🤖 Answer: ${answer}\n`);
        } catch (error) {
          console.error('❌ Error:', error);
        }

        askQuestion();
      });
    };

    askQuestion();

  } catch (error) {
    console.error('❌ Failed to initialize RAG system:', error);
    rl.close();
  }
}

if (require.main === module) {
  main();
} 