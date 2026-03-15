# Explainify - AI-Powered Document Learning Platform

Transform your documents into interactive learning experiences powered by artificial intelligence.

## 🎯 Overview

Explainify is a modern web application that helps users understand complex documents through:
- **Smart Document Upload** - Upload PDFs, Word docs, and text files
- **AI-Powered Chat** - Ask questions about your documents and get intelligent responses
- **Interactive Results Dashboard** - View AI-generated summaries and key insights
- **Video Learning** - Watch AI-generated video explanations of document content

## 🏗️ Project Structure

This repository contains the complete Explainify project:

```
explainify/
├── frontend/                    # React frontend (this directory)
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── context/            # State management
│   │   └── [Config files]
│   └── [Node dependencies]
│
└── [Backend handled by Kittu - separate deployment]
```

## ✨ Features

- **Landing Page** - Modern hero with feature showcase
- **Document Upload** - Drag & drop interface with file validation
- **AI Chat Interface** - Real-time conversation with AI assistant
- **Results Dashboard** - Comprehensive analytics and insights
- **Video Learning** - AI-generated learning video playlist
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Modern UI** - Built with React and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd explainify

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration guide
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📦 Tech Stack

**Frontend:**
- ⚛️ React 18.2
- 🎨 Tailwind CSS 3.3
- 🛣️ React Router 6.20
- 📦 Vite 5.0
- 🎯 Lucide React Icons

**Build & Dev:**
- TypeScript support ready
- ESLint configured
- Hot Module Replacement (HMR)

## 🎨 Design System

### Color Palette
- **Primary (Indigo):** #6366f1
- **Secondary (Violet):** #8b5cf6
- **Accent (Pink):** #ec4899
- **Dark:** #1f2937
- **Light:** #f9fafb

### Component Library
- Buttons (Primary, Secondary, Outline)
- Cards with hover effects
- Input fields with validation
- Responsive grids
- Modal dialogs

## 🔄 Workflow

1. User uploads a document
2. AI analyzes the content
3. User asks questions via chat
4. AI provides intelligent responses
5. View comprehensive results dashboard
6. Watch AI-generated video explanations

## 📋 Pages

| Page | Route | Purpose |
|------|-------|---------|
| Landing | `/` | Showcase features and get started |
| Upload | `/upload` | Upload documents for analysis |
| Chat | `/chat` | Interact with AI assistant |
| Results | `/results` | View analytics and insights |
| Video | `/video` | Watch learning videos |

## 🔐 Security

- File type validation on frontend
- File size restrictions
- Secure data handling with React Context
- Backend authentication (to be implemented)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Output
Production files are generated in the `dist/` directory, ready for deployment to:
- Vercel
- Netlify
- AWS S3
- GitHub Pages
- Any static hosting service

## 📝 Git Workflow

**Development Branch:** `ui-asvitha`

```bash
# Always work on ui-asvitha
git checkout ui-asvitha
git add .
git commit -m "feat: describe your changes"
git push origin ui-asvitha
```

⚠️ **Never push directly to `main` branch**

## 🔗 Integration

The frontend is ready to integrate with the backend API. Update these files when backend is ready:
- `src/pages/UploadPage.jsx` - Document upload API
- `src/pages/ChatInterface.jsx` - Chat API
- `src/pages/ResultsDashboard.jsx` - Results API
- `src/pages/VideoLearning.jsx` - Video generation API

## 👥 Team

- **Frontend:** Asvitha (UI/UX Development)
- **Backend:** Kittu (API & Database)

## 📞 Support

For questions or issues, check:
1. [SETUP.md](./SETUP.md) - Troubleshooting section
2. GitHub Issues
3. Team documentation

## 📄 License

Explainify © 2026. All rights reserved.

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)

---

**Last Updated:** March 15, 2026  
**Status:** Active Development  
**Branch:** ui-asvitha