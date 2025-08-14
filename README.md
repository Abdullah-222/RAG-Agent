# AIAgent - RAG System with Gemini

A powerful Retrieval-Augmented Generation (RAG) system built with TypeScript, LangChain, and Google's Gemini AI. This project allows you to upload PDF documents and ask questions about their content using natural language.

## 🚀 Features

- **PDF Document Processing**: Automatically extracts and processes text from PDF files
- **Vector Embeddings**: Uses Google Gemini embeddings for semantic search
- **RAG Architecture**: Combines document retrieval with AI generation for accurate answers
- **Interactive CLI**: Command-line interface for asking questions about documents
- **TypeScript**: Fully typed codebase for better development experience
- **LangChain Integration**: Leverages LangChain for document processing and vector storage

## 📁 Project Structure

```
AIAgent/
├── data/                          # Document storage
│   └── ATS classic HR resume.pdf  # Example PDF document
├── src/                           # Source code
│   ├── cli.ts                     # Command-line interface
│   ├── ingest.ts                  # Document ingestion and RAG system
│   └── lib/                       # Core libraries
│       ├── gemini-agent.ts        # Gemini AI agent implementation
│       └── gemini-embedding.ts    # Gemini embeddings wrapper
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AIAgent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   ```

   **Note**: You'll need a Google AI API key. Get one from [Google AI Studio](https://makersuite.google.com/app/apikey).

## 🚀 Usage

### Interactive CLI Mode

Start the interactive command-line interface:

```bash
npm run rag
# or
npm start
```

This will:
1. Load the PDF document from `data/ATS classic HR resume.pdf`
2. Process and embed the document content
3. Start an interactive session where you can ask questions

Example interaction:
```
🤖 RAG System with Gemini Agent
================================

Initializing RAG system...
✅ RAG system ready!

You can now ask questions about the document.
Type 'quit' to exit.

❓ Your question: What are the key skills mentioned in the resume?
🔍 Searching for relevant information...
🤖 Answer: [AI-generated response based on the document content]
```

### Development Mode

For development and testing:

```bash
npm run dev
```

This runs the document ingestion process and executes example queries.

### Build the Project

Compile TypeScript to JavaScript:

```bash
npm run build
```

## 🔧 Configuration

### Document Processing

The system automatically:
- Splits documents into chunks of 1000 characters with 200 character overlap
- Creates vector embeddings using Gemini's `embedding-001` model
- Stores vectors in memory for fast retrieval

### AI Model Settings

The Gemini agent uses:
- **Model**: `gemini-1.5-flash`
- **Max Output Tokens**: 2048
- **Temperature**: 0.7
- **Retrieval**: Top 3 most relevant document chunks

## 📚 API Reference

### RAGSystem Class

The main class for interacting with the RAG system:

```typescript
import { RAGSystem } from './src/ingest';

const ragSystem = new RAGSystem();

// Initialize with a PDF document
await ragSystem.initialize("path/to/document.pdf");

// Ask a question
const answer = await ragSystem.query("What is this document about?");

// Get relevant document chunks
const chunks = await ragSystem.getRelevantChunks("question", 5);
```

### GeminiAgent Class

Direct interaction with Gemini AI:

```typescript
import { GeminiAgent } from './src/lib/gemini-agent';

const agent = new GeminiAgent();

// Generate a response with context
const response = await agent.generateResponse("question", "context");

// Chat with conversation history
const messages = [new HumanMessage("Hello")];
const chatResponse = await agent.chatWithContext(messages, "context");
```

## 🔍 How It Works

1. **Document Ingestion**: PDF files are parsed and split into manageable chunks
2. **Vector Embedding**: Each chunk is converted to a vector using Gemini embeddings
3. **Vector Storage**: Chunks are stored in a memory-based vector store
4. **Query Processing**: When you ask a question:
   - The question is embedded into a vector
   - Similar document chunks are retrieved
   - Context is provided to the Gemini AI model
   - An answer is generated based on the retrieved context

## 📋 Dependencies

- **@google/genai**: Google's Generative AI SDK
- **@google/generative-ai**: Google Generative AI package
- **@langchain/google-genai**: LangChain integration for Google AI
- **langchain**: LangChain framework for LLM applications
- **pdf-parse**: PDF text extraction
- **express**: Web framework (for potential future web interface)
- **dotenv**: Environment variable management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License

## 🆘 Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your `GOOGLE_API_KEY` is set in the `.env` file
2. **PDF Loading Error**: Check that the PDF file exists in the `data/` directory
3. **TypeScript Errors**: Run `npm run build` to check for compilation errors

### Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Verify your API key is valid
3. Ensure all dependencies are installed correctly

## 🔮 Future Enhancements

- Web interface for document upload and querying
- Support for multiple document formats (DOCX, TXT, etc.)
- Persistent vector storage (database integration)
- Conversation history and context management
- Batch processing for multiple documents
- Custom embedding models support
