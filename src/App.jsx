import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DocumentProvider } from './context/DocumentContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import UploadPage from './pages/UploadPage'
import ChatInterface from './pages/ChatInterface'
import ResultsDashboard from './pages/ResultsDashboard'
import VideoLearning from './pages/VideoLearning'

export default function App() {
  return (
    <Router>
      <DocumentProvider>
        <div className="flex flex-col min-h-screen bg-gray-950">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/results" element={<ResultsDashboard />} />
              <Route path="/video" element={<VideoLearning />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </DocumentProvider>
    </Router>
  )
}
