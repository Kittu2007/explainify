# Explainify Frontend Setup Guide

This is the React frontend for the Explainify project - an AI-powered document learning platform.

## 📋 Project Structure

```
explainify/
├── src/
│   ├── components/          # Reusable components (Navbar, Footer)
│   ├── pages/              # Page components (Landing, Upload, Chat, Results, Video)
│   ├── context/            # React Context for state management
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Entry point
│   └── index.css            # Tailwind styles
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies and scripts
└── .gitignore             # Git ignore rules
```

## 🛠️ Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Git configured

## 📦 Installation

1. **Navigate to the project directory:**
   ```bash
   cd c:\Users\techie\.antigravity\explainify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` (optional, for custom configuration):**
   ```bash
   cp .env.example .env.local
   ```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📱 Pages Overview

### 1. **Landing Page** (`/`)
- Hero section with call-to-action
- Features showcase
- How it works flow
- Community engagement section

### 2. **Upload Page** (`/upload`)
- Drag-and-drop file upload
- File type validation (PDF, Word, Text)
- Document preview before processing
- Security information

### 3. **AI Chat Interface** (`/chat`)
- Real-time conversation with AI
- Message history
- Quick suggestion buttons
- Document reference display
- Auto-scroll to latest messages

### 4. **Results Dashboard** (`/results`)
- Document summary
- Key takeaways
- Concept extraction and analysis
- Reading time and complexity metrics
- Export options (PDF, Share)
- Links to video learning

### 5. **Video Learning** (`/video`)
- AI-generated learning videos playlist
- Video player with controls
- Topics covered per video
- Progress tracking
- Learning tips

## 🎨 Design System

### Colors
- **Primary:** `#6366f1` (Indigo)
- **Secondary:** `#8b5cf6` (Violet)
- **Accent:** `#ec4899` (Pink)
- **Dark:** `#1f2937` (Dark Gray)
- **Light:** `#f9fafb` (Light Gray)

### Components
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-outline` - Outline button style
- `.card` - Reusable card component
- `.input-field` - Form input styling
- `.section-title` - Section heading style

## 🔄 State Management

The app uses React Context API (`DocumentContext`) to manage:
- Uploaded document data
- Chat messages
- Results and analytics
- Loading states

Access state using the `useDocument()` hook:

```jsx
import { useDocument } from '../context/DocumentContext'

function MyComponent() {
  const { document, messages, uploadDocument } = useDocument()
  // ...
}
```

## 🌐 Integration Points

The frontend is currently using simulated API calls. To integrate with the backend:

1. Update `src/pages/UploadPage.jsx` - Replace file upload simulation with backend API call
2. Update `src/pages/ChatInterface.jsx` - Connect to real AI API
3. Update `src/pages/ResultsDashboard.jsx` - Fetch real analysis results
4. Update `src/pages/VideoLearning.jsx` - Connect to video generation API

Example API integration:
```jsx
const response = await axios.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All components use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)

## 🔐 Security Notes

- File size validation is implemented on frontend
- File type validation filters unsupported formats
- All user data is stored in React Context (temporary)
- Implement backend authentication before production

## 🚢 Production Build

Build for deployment:

```bash
npm run build
```

This generates optimized files in the `dist/` directory.

## 📝 Git Workflow

As per the PRD, use the `ui-asvitha` branch:

```bash
git checkout ui-asvitha
git add .
git commit -m "feat: update UI"
git push origin ui-asvitha
```

Never push to `main` branch.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5173 already in use | Change port in `vite.config.js` |
| Styles not loading | Restart dev server |
| Components not rendering | Check React Router setup in `App.jsx` |
| Context not working | Verify `DocumentProvider` wraps entire app |

## 📚 Dependencies

- **react** - UI library
- **react-dom** - React DOM bindings
- **react-router-dom** - Client-side routing
- **tailwindcss** - Utility-first CSS framework
- **lucide-react** - Icon library
- **axios** - HTTP client (for backend integration)
- **vite** - Build tool and dev server

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

## 🤝 Development Tips

1. **Component Reusability:** Create small, focused components
2. **State Management:** Use Context API for app-wide state
3. **Styling:** Use Tailwind utility classes, avoid custom CSS when possible
4. **Performance:** Use `useEffect` cleanup functions, optimize re-renders
5. **Accessibility:** Use semantic HTML, ARIA labels, keyboard navigation

## 📞 Support

For issues or questions, refer to the project's GitHub repository or check the PRD for team contacts.

---

**Last Updated:** March 15, 2026
**Branch:** ui-asvitha
