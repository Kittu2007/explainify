"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth'

const AuthContext = createContext({
  user: null,
  isLoading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Set session cookie for middleware
        const idToken = await firebaseUser.getIdToken()
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
      } else {
        setUser(null)
        // Clear session cookie
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: null }),
        })
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    setIsLoading(true)
    await firebaseSignOut(auth)
    window.location.href = '/login'
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      return { user: result.user }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut, signInWithGoogle }}>
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
