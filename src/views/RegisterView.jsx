"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Mail, Lock, Loader2, Sparkles, ChevronRight, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

export default function RegisterView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { user, signInWithGoogle, signUpWithEmail, isAuthAvailable, isLoading: isAuthLoading } = useAuth()

  // Permanent fix for redirection: listen to global auth state
  useEffect(() => {
    if (user && !isAuthLoading) {
      window.location.href = '/dashboard/upload'
    }
  }, [user, isAuthLoading])

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { user, error: regError } = await signUpWithEmail(email, password)
    
    if (regError) {
      setError(regError.message)
      setIsLoading(false)
    } else {
      window.location.href = '/dashboard/upload'
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError(null)
    try {
      const { user, error: googleError } = await signInWithGoogle()
      if (googleError) {
        setError(googleError.message)
        setIsGoogleLoading(false)
      } else if (user) {
        window.location.href = '/dashboard/upload'
      }
    } catch (err) {
      setError(err.message)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-light px-4 py-20 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="p-10 pt-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl -rotate-3 text-white">
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-black text-dark mb-2 tracking-tight uppercase">Create Account</h1>
            <p className="text-gray-500 text-sm font-medium">Start generating interactive graphical explanations today.</p>
          </div>

          <form onSubmit={handleRegister} className="px-10 pb-10 space-y-5">
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

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl text-left">
                <p className="text-[10px] text-green-800 font-black uppercase tracking-widest mb-1 leading-none">Success!</p>
                <p className="text-xs text-green-700 font-medium">Your account has been created. You can now login.</p>
                <Link href="/login" className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest text-green-600 hover:underline">
                  Go to Login
                </Link>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success || !isAuthAvailable}
              className="w-full py-4 bg-dark hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-secondary/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Join Explainify
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-black tracking-widest">Or join with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading || success || !isAuthAvailable}
              className="w-full h-14 bg-white border border-gray-100 hover:border-gray-200 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Join with Google</span>
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">
                Already have an account?{' '}
                <Link href="/login" className="text-secondary hover:underline underline-offset-4">
                  SIGN IN
                </Link>
              </p>
            </div>
          </form>

          {/* Bottom Accent */}
          <div className="bg-gray-50 p-6 flex justify-center gap-4 border-t border-gray-100">
             <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400">Secure</div>
                <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400">Private</div>
                <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400">Scalable</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
