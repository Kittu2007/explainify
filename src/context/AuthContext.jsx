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

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
<<<<<<< HEAD
        // Sync session cookie in background
        firebaseUser.getIdToken().then(idToken => {
          fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          }).catch(e => console.error("Session sync failed", e));
        }).catch(e => console.error("Token retrieval failed", e));
=======
        // Set session cookie for middleware
        try {
          const idToken = await firebaseUser.getIdToken()
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          })
        } catch (e) { console.error("Session update failed", e) }
>>>>>>> main
      } else {
        setUser(null)
        // Clear session cookie in background
        fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: null }),
        }).catch(() => {});
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
