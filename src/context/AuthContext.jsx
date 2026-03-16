"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, isAuthAvailable } from '@/lib/firebase'
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp
} from 'firebase/auth'

const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthAvailable: false,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async (email, password) => {},
  signUpWithEmail: async (email, password) => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const syncSession = async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken()
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
      } else {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: null }),
        })
      }
    } catch (e) {
      console.error("Session sync failed", e)
    }
  }

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Background sync for auto-login/refresh
        syncSession(firebaseUser)
      } else {
        setUser(null)
        syncSession(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    if (!auth) return
    setIsLoading(true)
    try {
      await firebaseSignOut(auth)
    } finally {
      window.location.href = '/login'
    }
  }

  const signInWithGoogle = async () => {
    if (!auth) {
      return { error: { message: "Auth not initialized. Check your environment variables." } }
    }
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      // Blocking sync: wait for cookie before returning to view
      await syncSession(result.user)
      return { user: result.user }
    } catch (error) {
      return { error }
    }
  }

  const signInWithEmail = async (email, password) => {
    if (!auth) {
      return { error: { message: "Auth not initialized. Check your environment variables." } }
    }
    try {
      const result = await firebaseSignIn(auth, email, password)
      // Blocking sync: wait for cookie
      await syncSession(result.user)
      return { user: result.user }
    } catch (error) {
      return { error }
    }
  }

  const signUpWithEmail = async (email, password) => {
    if (!auth) {
      return { error: { message: "Auth not initialized. Check your environment variables." } }
    }
    try {
      const result = await firebaseSignUp(auth, email, password)
      // Blocking sync: wait for cookie
      await syncSession(result.user)
      return { user: result.user }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthAvailable,
      signOut, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
