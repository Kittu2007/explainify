# Contributing to Explainify Frontend

Thank you for your interest in contributing to Explainify! This guide will help you get started.

## 🎯 Getting Started

1. **Clone and Setup**
   ```bash
   git clone https://github.com/Kittu2007/explainify.git
   cd explainify
   git checkout ui-asvitha
   npm install
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## 📝 Code Standards

### Naming Conventions

**Files & Folders:**
- Components: PascalCase (e.g., `UserProfile.jsx`)
- Pages: PascalCase (e.g., `LandingPage.jsx`)
- Utilities: camelCase (e.g., `fileValidator.js`)
- Folders: lowercase (e.g., `components/`, `pages/`)

**Variables & Functions:**
```jsx
// ✅ Good
const handleSubmit = () => {}
const isLoading = false
const MAX_FILE_SIZE = 50

// ❌ Avoid
const handlesubmit = () => {}
const is_loading = false
const maxfilesize = 50
```

### Component Structure

```jsx
import { useState, useEffect } from 'react'
import { Icon } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'
import ComponentName from '../components/ComponentName'
import './ComponentName.css'

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null)
  const { contextValue } = useDocument()

  useEffect(() => {
    // Side effects here
  }, [dependencies])

  const handleAction = () => {
    // Handler logic
  }

  return (
    <div className="container">
      {/* JSX here */}
    </div>
  )
}
```

### Styling Guidelines

**Use Tailwind CSS classes:**
```jsx
// ✅ Good
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
  Click me
</button>

// ❌ Avoid custom CSS when Tailwind is available
<button style={{ padding: '8px 16px', backgroundColor: '#6366f1' }}>
  Click me
</button>
```

## 🔄 Git Workflow

1. **Keep branch updated**
   ```bash
   git pull origin ui-asvitha
   ```

2. **Commit regularly with descriptive messages**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: fix bug description"
   git commit -m "refactor: improve component structure"
   git commit -m "docs: update documentation"
   ```

3. **Push to feature branch**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Describe changes clearly
   - Link related issues
   - Include before/after screenshots if UI changes

### Commit Message Format

```
feat: add new user profile component
fix: correct chat message scrolling issue
refactor: simplify document upload logic
docs: update installation guide
test: add chat interface tests
style: format code with prettier
```

## 🧪 Testing

Before submitting a PR:

1. **Test in Development**
   ```bash
   npm run dev
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Lint Code**
   ```bash
   npm run lint
   ```

4. **Manual Testing Checklist**
   - ✅ Component renders correctly
   - ✅ Responsive on mobile/tablet/desktop
   - ✅ Navigation works
   - ✅ Forms submit properly
   - ✅ No console errors

## 📱 Responsive Design Testing

Test your components at these breakpoints:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full screen)

Use browser DevTools for responsive testing.

## 🎨 Component Examples

### Creating a New Component

```jsx
// src/components/MyComponent.jsx
import { ChevronRight } from 'lucide-react'

export default function MyComponent({ title, onAction }) {
  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <button
        onClick={onAction}
        className="btn-primary flex items-center space-x-2"
      >
        <span>Action</span>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
```

### Using Context

```jsx
import { useDocument } from '../context/DocumentContext'

export default function MyPage() {
  const { document, messages, addMessage } = useDocument()

  const handleMessage = (text) => {
    addMessage('user', text)
  }

  return (
    <div>
      {document && <p>{document.name}</p>}
    </div>
  )
}
```

## 🐛 Debugging

### React DevTools
- Install React DevTools browser extension
- Inspect component hierarchy
- Check props and state values

### Console Logging
```jsx
// Use for debugging
console.log('Debug info:', variable)
console.error('Error occurred:', error)
console.warn('Warning:', message)
```

### Performance
- Use React DevTools Profiler
- Check for unnecessary re-renders
- Optimize with `useMemo()` and `useCallback()`

## 📚 Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS Classes](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [React Router Guide](https://reactrouter.com)

## 🎯 Code Review Process

1. **Self Review**
   - Check your own code first
   - Verify logic and edge cases

2. **Peer Review**
   - At least one approval required
   - Address feedback promptly

3. **Final Check**
   - All tests pass
   - No console errors
   - Code is properly formatted

## ⚠️ Common Mistakes to Avoid

1. **Missing dependencies in useEffect**
   ```jsx
   // ❌ Bad
   useEffect(() => {
     setData(value)
   }) // No dependency array

   // ✅ Good
   useEffect(() => {
     setData(value)
   }, [value])
   ```

2. **Component prop drilling**
   ```jsx
   // ✅ Use context instead
   const { value } = useDocument()
   ```

3. **Hardcoded values**
   ```jsx
   // ❌ Bad
   const maxSize = 50000000
   
   // ✅ Good
   const MAX_FILE_SIZE = 50 * 1024 * 1024
   ```

4. **Unhandled promises**
   ```jsx
   // ❌ Bad
   api.call()
   
   // ✅ Good
   try {
     await api.call()
   } catch (error) {
     console.error('Error:', error)
   }
   ```

## 🚀 Deployment

Before deployment:
1. Ensure all tests pass
2. Code is merged to `ui-asvitha`
3. Build is successful: `npm run build`
4. No console errors in production build

## 📞 Getting Help

- **Issues:** Check GitHub Issues for known problems
- **Documentation:** See SETUP.md for detailed guide
- **Team:** Reach out to team members for questions

## 🎓 Learning Resources

- Watch React tutorials
- Read Tailwind documentation
- Study existing components
- Practice with small features first

---

**Thank you for contributing to Explainify!** 🚀

For more details, check [SETUP.md](./SETUP.md)
