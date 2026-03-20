# Explainify 🚀

**Explainify** is a premium, AI-powered knowledge retrieval and learning platform designed to transform complex documents into interactive, easy-to-digest experiences. Upload your files, ask deep questions, and learn through AI-generated summaries and clean visual explanations.

🔗 **Live Demo:** [explainify-ai.onrender.com](https://explainify-ai.onrender.com)

---

## ✨ Key Features

- **📄 Document Intelligence:** Upload PDFs and extract core insights using advanced RAG (Retrieval-Augmented Generation).
- **🎬 AI Visual Explanations:** Automatically generate logic-driven visual scripts and cinematic visual flows to "see" your document's meaning.
- **💬 Deep Query Interface:** A neural-themed chat interface for asking complex questions with source-backed answers.
- **💎 Premium UI/UX:** Built with high-fidelity components like `Aurora` backgrounds, `MagicBento` layouts, `GlowCursor` interactions, and `LiquidEther` fluid simulations.
- **🔒 Secure Neural Auth:** Next-generation authentication bridge with Google Nexus integration.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router), React, Tailwind CSS
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [Three.js](https://threejs.org/)
- **Backend:** Next.js API Routes (Edge Runtime compatible)
- **Database & Vector Store:** [Supabase](https://supabase.com/) (PostgreSQL + `pgvector`)
- **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth)
- **AI Engine (LLM):** [NVIDIA NIM](https://build.nvidia.com/) — Meta Llama 3.1 70B Instruct
- **Embeddings:** NVIDIA NV-EmbedQA-E5-v5
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase Project (with `pgvector` enabled)
- Firebase Project
- NVIDIA API Key

### 1. Installation

```bash
git clone https://github.com/Kittu2007/explainify.git
cd explainify
npm install
```

### 2. Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Firebase (Client Side)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# AI Models
NVIDIA_API_KEY=your_nvidia_api_key
```

### 3. Database Setup

Execute the provided SQL migrations in your Supabase SQL Editor:
1. `supabase/migrations/001_init.sql` (Schema & Tables)
2. `supabase/migrations/002_match_chunks.sql` (Vector search function)

### 4. Run Development

```bash
npm run dev
```

Visit `http://localhost:3000` to access the neural node.

---

## 📂 Architecture & Structure

```text
src/
├── app/                  # Next.js App Router
├── components/           # UI Component Library
│   ├── ui/               # Particles, Aurora, MagicBento, etc.
│   └── shared/           # Navbar, Footer, Sidebar
├── context/              # Global State (Auth, Theme)
├── lib/                  # Core Utilities (AI, PDF, Vector)
└── views/                # Page-level View Components
```

---

## 🤝 Contribution

Current workflow centers around three primary tracks:
- `main`: Production-ready release.
- `integration`: Stable testing environment for UI/Backend sync.
- `ui-asvitha`: Experimental frontend and premium animations.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

Built with ❤️ by the **Explainify Team**.
