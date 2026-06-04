"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (res.ok) setStatus('success')
    else setStatus('error')
  }

  // Semantic styles
  const inputClass = "w-full bg-background border border-input text-foreground rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-muted-foreground"

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse bg-amber-500/20 dark:bg-amber-900/30" />
         <div className="absolute bottom-[-10%] right-[20%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse delay-700 bg-orange-500/20 dark:bg-orange-900/30" />
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 p-6"
      >
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-xl p-8 space-y-6 transition-all">
          
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>

          {status === 'success' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Mail className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Check your inbox</h2>
                <p className="text-muted-foreground">We sent a reset link to <span className="text-foreground font-medium">{email}</span>.</p>
              </div>
              <div className="bg-muted border border-border p-4 rounded-xl text-xs text-muted-foreground text-left">
                <p><strong>Can't find it?</strong> Check your spam folder or ensure the email is correct.</p>
              </div>
              <Link href="/login" className="block w-full py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-bold transition-colors text-center">
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
                <p className="text-muted-foreground">Enter your email to recover your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm text-center">User not found or error occurred.</div>
                )}
                
                <div className="group space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" className={inputClass} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group relative w-full flex items-center justify-center p-[2px] rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-[spin_3s_linear_infinite]" />
                  <div className="relative w-full bg-background rounded-[10px] py-3.5 flex items-center justify-center gap-2 transition-colors z-10">
                    {status === 'loading' ? <Loader2 className="w-5 h-5 text-foreground animate-spin" /> : <span className="font-bold text-foreground">Send Reset Link</span>}
                  </div>
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}