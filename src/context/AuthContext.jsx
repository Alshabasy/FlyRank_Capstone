import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { auth } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const persistSession = async () => {
    await setPersistence(auth, browserLocalPersistence)
  }

  const login = async (email, password) => {
    await persistSession()
    const result = await signInWithEmailAndPassword(auth, email, password)
    setUser(result.user)
    return result
  }

  const register = async (email, password, displayName) => {
    await persistSession()
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (result.user) {
      await updateProfile(result.user, { displayName })
      setUser({ ...result.user, displayName })
    }
    return result
  }

  const loginWithGoogle = async () => {
    await persistSession()
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    setUser(result.user)
    return result
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// ✅ src/context/AuthContext.jsx complete
