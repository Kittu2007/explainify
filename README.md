# Explainify

AI-Powered Knowledge Retrieval & Learning Platform — upload documents, ask questions, generate summaries, and learn through AI-generated video explanations.

🔗 **Live:** [explainify-ai.onrender.com](https://explainify-ai.onrender.com)

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** Supabase PostgreSQL + pgvector
- **AI LLM:** NVIDIA API — Meta Llama 3.1 70B Instruct
- **Embeddings:** NVIDIA NV-EmbedQA-E5-v5 (1024-dim)
- **Deployment:** Render

## API Endpoints

| Method | Endpoint             | Description                                  |
|--------|----------------------|----------------------------------------------|
| POST   | `/api/upload`        | Upload PDF, extract text, generate embeddings |
| POST   | `/api/query`         | Ask questions with RAG retrieval             |
| POST   | `/api/summarize`     | Generate document summary                   |
| POST   | `/api/video-explain` | Generate video explanation script            |
| GET    | `/api/health`        | Health check                                 |

## Setup

### Prerequisites

- Node.js 18+
- Supabase project with pgvector enabled
- NVIDIA API key ([build.nvidia.com](https://build.nvidia.com))

### 1. Clone & Install

```bash
git clone https://github.com/Kittu2007/explainify.git
cd explainify
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NVIDIA_API_KEY=your-nvidia-api-key
```

### 3. Database Setup

Run the SQL migrations in your Supabase SQL Editor:

1. `supabase/migrations/001_init.sql` — Creates tables and indexes
2. `supabase/migrations/002_match_chunks.sql` — Creates vector search function

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts        # PDF upload + processing
│   │   ├── query/route.ts         # RAG question answering
│   │   ├── summarize/route.ts     # Document summarization
│   │   ├── video-explain/route.ts # Video script generation
│   │   └── health/route.ts        # Health check
│   ├── layout.tsx
│   └── page.tsx
└── lib/
    ├── ai.ts           # LLM functions (RAG, summarize, video)
    ├── chunker.ts       # Text chunking with overlap
    ├── embeddings.ts    # NVIDIA embedding generation
    ├── pdf.ts           # PDF text extraction
    └── supabase.ts      # Supabase client
```

## Git Workflow

- `main` — protected production branch
- `backend-kittu` — backend development
- `ui-asvitha` — UI development

```bash
git checkout -b backend-kittu
git commit -m "feat: add document upload"
git push origin backend-kittu
```

## License

MIT