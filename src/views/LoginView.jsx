"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Mail, Lock, Loader2, Sparkles, ChevronRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
<<<<<<< HEAD
import { useEffect } from 'react'
=======
>>>>>>> main

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
<<<<<<< HEAD
  const { user, signInWithGoogle, signInWithEmail, isAuthAvailable, isLoading: isAuthLoading } = useAuth()

  // Permanent fix for redirection: listen to global auth state
  useEffect(() => {
    if (user && !isAuthLoading) {
      router.push('/dashboard/upload')
    }
  }, [user, isAuthLoading, router])
=======
  const { signInWithGoogle, signInWithEmail, isAuthAvailable } = useAuth()
>>>>>>> main

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { user, error: loginError } = await signInWithEmail(email, password)
    
    if (loginError) {
      setError(loginError.message)
      setIsLoading(false)
    } else {
      router.push('/dashboard/upload')
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError(null)
    const { error: googleError } = await signInWithGoogle()
    if (googleError) {
      setError(googleError.message)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-light px-4 py-20 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="p-10 pt-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
              <LogIn className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-dark mb-2 tracking-tight uppercase">Welcome Back</h1>
            <p className="text-gray-500 text-sm font-medium">Continue your visual learning journey with Explainify.</p>
          </div>

          <form onSubmit={handleLogin} className="px-10 pb-10 space-y-5">
            {!isAuthAvailable && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
                <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">
                  Auth not initialized. Please verify your environment variables.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="text-[10px] text-red-700 font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || !isAuthAvailable}
              className="w-full py-4 bg-dark hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sign In
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-black tracking-widest">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading || !isAuthAvailable}
<<<<<<< HEAD
              className="w-full h-14 bg-white border border-gray-100 hover:border-gray-200 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
=======
              className="w-full py-4 bg-white border border-gray-100 hover:border-gray-200 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
>>>>>>> main
            >
              {isGoogleLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                <>
<<<<<<< HEAD
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
=======
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
>>>>>>> main
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary hover:underline underline-offset-4">
                  JOIN NOW
                </Link>
              </p>
            </div>
          </form>

          {/* Bottom Accent */}
          <div className="bg-gray-50 p-6 flex justify-center gap-4 border-t border-gray-100">
             <div className="flex items-center gap-2 py-1 px-3 bg-white rounded-full border border-gray-200 shadow-sm">
                <Sparkles className="text-primary" size={12} />
                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">Free Account</span>
             </div>
             <div className="flex items-center gap-2 py-1 px-3 bg-white rounded-full border border-gray-200 shadow-sm">
                <Sparkles className="text-secondary" size={12} />
                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">Unlimited Clips</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
