import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

const friendlyErrors = {
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 8 characters.',
  'auth/network-request-failed': 'Connection error. Check your internet.',
  'auth/configuration-not-found': 'Authentication is not enabled for this project. Enable Email/Password in Firebase Console.',
}

export default function Login() {
  const { user, login, register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.title = mode === 'login' ? 'Sign In — CineVault' : 'Register — CineVault'
  }, [mode])

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user])

  const validateField = (name, value) => {
    if (name === 'email') {
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Enter a valid email address.'
      }
    }

    if (name === 'password') {
      if (!value || value.length < 8) {
        return 'Password must be at least 8 characters.'
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formState.password) {
        return 'Passwords must match.'
      }
    }

    if (name === 'displayName') {
      if (!value || value.trim().length < 2) {
        return 'Name must be at least 2 characters.'
      }
    }

    return ''
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    const fields = mode === 'login' ? ['email', 'password'] : ['displayName', 'email', 'password', 'confirmPassword']

    for (const field of fields) {
      const error = validateField(field, formState[field])
      if (error) {
        nextErrors[field] = error
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        await login(formState.email, formState.password)
        toast.success('Signed in successfully')
      } else {
        await register(formState.email, formState.password, formState.displayName)
        toast.success('Account created')
      }
      navigate(from, { replace: true })
    } catch (error) {
      const message = friendlyErrors[error?.code] || error?.message || 'Unable to sign in. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formState.email) {
      toast.error('Enter your email to reset password.')
      return
    }

    try {
      await sendPasswordResetEmail(auth, formState.email)
      toast.success('Password reset email sent.')
    } catch (error) {
      const message = friendlyErrors[error.code] || 'Could not send reset email.'
      toast.error(message)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Signed in successfully')
      navigate(from, { replace: true })
    } catch (error) {
      const message = friendlyErrors[error?.code] || error?.message || 'Google sign in failed.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-cinema-black px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 rounded-3xl border border-white/10 bg-[#0b111f]/90 p-6 shadow-cinema sm:p-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cinema-red/20 via-transparent to-cinema-blue/10 p-6 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.15),transparent)]" />
          <div className="relative space-y-4">
            <h1 className="text-4xl font-semibold text-white">Welcome back to CineVault</h1>
            <p className="max-w-md text-cinema-muted">
              Search, save, and explore your favorite cinema classics with secure auth and a cinematic experience.
            </p>
            <div className="grid gap-4 pt-6">
              <div className="rounded-3xl bg-[#111827]/80 p-4 shadow-inner">
                <p className="text-sm text-cinema-blue">Featured</p>
                <p className="mt-2 text-lg font-semibold">Classic poster collage</p>
              </div>
              <div className="rounded-3xl bg-[#111827]/80 p-4 shadow-inner">
                <p className="text-sm text-cinema-muted">Security</p>
                <p className="mt-2 text-lg font-semibold">Firebase Auth protected watchlist</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-cinema-dark/90 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
              <p className="text-sm text-cinema-muted">
                {mode === 'login' ? 'Access your watchlist' : 'Start saving your favorite movies'}
              </p>
            </div>
            <div className="flex gap-2 rounded-full bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-cinema-red text-white' : 'text-cinema-muted hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === 'register' ? 'bg-cinema-red text-white' : 'text-cinema-muted hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {mode === 'login' ? (
            <LoginForm
              formState={formState}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onForgotPassword={handleForgotPassword}
              onGoogleSignIn={handleGoogle}
              loading={loading}
            />
          ) : (
            <RegisterForm
              formState={formState}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </main>
  )
}

// ✅ src/pages/Login.jsx complete
