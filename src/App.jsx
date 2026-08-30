import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ChatbotProvider } from './context/ChatbotContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { AppErrorBoundary } from './components/ui/AppErrorBoundary'

// ----- Lazy-loaded pages (code-split into separate chunks) -----
const Home = lazy(() => import('./pages/Home'))
const Categories = lazy(() => import('./pages/Categories'))
const Favourites = lazy(() => import('./pages/Favourites'))
const Login = lazy(() => import('./pages/Login'))
const MovieDetail = lazy(() => import('./pages/MovieDetail'))
const ButtonDemoPage = lazy(() => import('./pages/ButtonDemoPage'))

// ----- Lazy-loaded chatbot (not needed on initial paint) -----
const ChatbotButton = lazy(() =>
  import('./components/chatbot/ChatbotButton').then((m) => ({ default: m.ChatbotButton }))
)
const ChatPanel = lazy(() =>
  import('./components/chatbot/ChatPanel').then((m) => ({ default: m.ChatPanel }))
)

// Lightweight page-level loading fallback
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinema-red border-t-transparent" />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Suspense fallback={<PageFallback />}>
                <Home />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/categories"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Suspense fallback={<PageFallback />}>
                <Categories />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/favourites"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Suspense fallback={<PageFallback />}>
                <Favourites />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/demo"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Suspense fallback={<PageFallback />}>
                <ButtonDemoPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/movie/:imdbID"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Suspense fallback={<PageFallback />}>
                <MovieDetail />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Suspense fallback={<PageFallback />}>
                <Login />
              </Suspense>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <ChatbotProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-cinema-black text-white">
              <Navbar />
              <AppErrorBoundary fallbackTitle="This page failed to load">
                <AnimatedRoutes />
              </AppErrorBoundary>
              <Footer />
              <Suspense fallback={null}>
                <ChatbotButton />
              </Suspense>
              <AppErrorBoundary fallbackTitle="CineBot hit an error">
                <Suspense fallback={null}>
                  <ChatPanel />
                </Suspense>
              </AppErrorBoundary>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#111827',
                    color: '#f8fafc',
                    border: '1px solid #1d4ed8',
                  },
                }}
              />
            </div>
          </BrowserRouter>
        </ChatbotProvider>
      </AuthProvider>
    </AppErrorBoundary>
  )
}

// ✅ src/App.jsx complete
