import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

const AuthContext = createContext(null)

// Lazily load the Firebase auth module and app instance.
// Stored as a module-level promise so it's only imported once.
let firebaseAuthPromise = null

function loadFirebaseAuth() {
  if (!firebaseAuthPromise) {
    firebaseAuthPromise = Promise.all([
      import('firebase/auth'),
      import('../firebase/config'),
    ]).then(([authModule, configModule]) => ({
      auth: configModule.auth,
      createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
      signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
      signOut: authModule.signOut,
      updateProfile: authModule.updateProfile,
      onAuthStateChanged: authModule.onAuthStateChanged,
      GoogleAuthProvider: authModule.GoogleAuthProvider,
      signInWithPopup: authModule.signInWithPopup,
      setPersistence: authModule.setPersistence,
      browserLocalPersistence: authModule.browserLocalPersistence,
    }))
  }
  return firebaseAuthPromise
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const fbRef = useRef(null)

  // Initialize Firebase Auth listener after dynamic import resolves
  useEffect(() => {
    let unsubscribe = () => {}

    loadFirebaseAuth().then((fb) => {
      fbRef.current = fb
      unsubscribe = fb.onAuthStateChanged(fb.auth, (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      })
    })

    return () => unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    const fb = await loadFirebaseAuth()
    await fb.setPersistence(fb.auth, fb.browserLocalPersistence)
    const result = await fb.signInWithEmailAndPassword(fb.auth, email, password)
    setUser(result.user)
    return result
  }, [])

  const register = useCallback(async (email, password, displayName) => {
    const fb = await loadFirebaseAuth()
    await fb.setPersistence(fb.auth, fb.browserLocalPersistence)
    const result = await fb.createUserWithEmailAndPassword(fb.auth, email, password)
    if (result.user) {
      await fb.updateProfile(result.user, { displayName })
      setUser({ ...result.user, displayName })
    }
    return result
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const fb = await loadFirebaseAuth()
    await fb.setPersistence(fb.auth, fb.browserLocalPersistence)
    const provider = new fb.GoogleAuthProvider()
    const result = await fb.signInWithPopup(fb.auth, provider)
    setUser(result.user)
    return result
  }, [])

  const logout = useCallback(async () => {
    const fb = await loadFirebaseAuth()
    await fb.signOut(fb.auth)
    setUser(null)
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
