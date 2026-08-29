import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ChatbotProvider } from './context/ChatbotContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Favourites from './pages/Favourites'
import Login from './pages/Login'
import MovieDetail from './pages/MovieDetail'
import { ChatbotButton } from './components/chatbot/ChatbotButton'
import { ChatPanel } from './components/chatbot/ChatPanel'
import { AppErrorBoundary } from './components/ui/AppErrorBoundary'

import ButtonDemoPage from './pages/ButtonDemoPage'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/categories"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Categories />
            </motion.div>
          }
        />
        <Route
          path="/favourites"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Favourites />
            </motion.div>
          }
        />
        <Route
          path="/demo"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <ButtonDemoPage />
            </motion.div>
          }
        />
        <Route
          path="/movie/:imdbID"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <MovieDetail />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Login />
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
              <ChatbotButton />
              <AppErrorBoundary fallbackTitle="CineBot hit an error">
                <ChatPanel />
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
