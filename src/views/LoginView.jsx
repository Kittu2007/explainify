"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { LogIn, Mail, Lock, Loader2, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push('/upload')
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-light px-4 py-20 relative overflow-hidden">
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
            <h1 className="text-3xl font-black text-dark mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 text-sm font-medium">Continue your visual learning journey with Explainify.</p>
          </div>

          <form onSubmit={handleLogin} className="px-10 pb-10 space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="text-xs text-red-700 font-bold">{error}</p>
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
              disabled={isLoading}
              className="w-full py-4 bg-dark hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70"
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

            <div className="pt-4 text-center">
              <p className="text-xs text-gray-400 font-medium tracking-wide">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">
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
