"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Mail, Lock, Loader2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Beams from '@/components/ui/Beams'
import MagicBento from '@/components/ui/MagicBento'

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { user, signInWithGoogle, signInWithEmail, isAuthAvailable, isLoading: isAuthLoading } = useAuth()

  useEffect(() => {
    if (user && !isAuthLoading) {
      window.location.href = '/dashboard/upload'
    }
  }, [user, isAuthLoading])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: loginError } = await signInWithEmail(email, password)
    
    if (loginError) {
      setError(loginError.message)
      setIsLoading(false)
    } else {
      window.location.href = '/dashboard/upload'
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* 3D Beams Background */}
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={3}
          beamHeight={40}
          beamNumber={30}
          lightColor="#c800ff"
          speed={2.5}
          noiseIntensity={2}
          scale={0.15}
          rotation={25}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <MagicBento 
          enableSpotlight={true}
          glowColor="200, 0, 255"
          spotlightRadius={500}
          particleCount={20}
          enableBorderGlow={true}
        >
          <div className="bg-[#060010]/90 backdrop-blur-2xl p-8 md:p-10 border border-white/5 rounded-[2.5rem]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
                <LogIn className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic">Explainify</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Visual Engine Access</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {!isAuthAvailable && (
                <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
                  <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tight">
                    Authentication Infrastructure Unavailable
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl">
                  <p className="text-[10px] text-red-500 font-black uppercase tracking-tight">{error}</p>
                </div>
              )}

              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Identity</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 rounded-2xl outline-none transition-all text-sm font-medium text-white placeholder:text-white/10"
                    placeholder="nexus@explainify.ai"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">VPU Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 rounded-2xl outline-none transition-all text-sm font-medium text-white placeholder:text-white/10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading || !isAuthAvailable}
                className="w-full py-4 bg-primary hover:bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Initialize Connection
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]">
                  <span className="bg-[#060010] px-4 text-white/30">Neural Auth Bridge</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading || !isAuthAvailable}
                className="w-full h-14 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:shadow-primary/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="animate-pulse">SYNCHRONIZING...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Google Nexus Drive</span>
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <p className="text-[10px] text-white/30 font-black tracking-widest uppercase">
                  No account?{' '}
                  <Link href="/register" className="text-primary hover:text-white transition-colors">
                    GENERATE NEW IDENTITY
                  </Link>
                </p>
              </div>
            </form>

            {/* Bottom Accent */}
            <div className="mt-8 flex justify-center gap-4">
               <div className="flex items-center gap-2 py-1.5 px-3 bg-white/5 rounded-full border border-white/5">
                  <Sparkles className="text-primary" size={10} />
                  <span className="text-[8px] font-black uppercase tracking-tighter text-white/40">Secure Node</span>
               </div>
               <div className="flex items-center gap-2 py-1.5 px-3 bg-white/5 rounded-full border border-white/5">
                  <Sparkles className="text-secondary" size={10} />
                  <span className="text-[8px] font-black uppercase tracking-tighter text-white/40">VPU Enabled</span>
               </div>
            </div>
          </div>
        </MagicBento>
      </div>
    </div>
  )
}
