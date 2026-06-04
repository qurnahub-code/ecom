"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      setStatus('error')
      return
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters")
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMessage("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to reset password")
      setStatus('success')
      setTimeout(() => router.push("/login"), 3000)
    } catch (error: any) {
      setErrorMessage(error.message)
      setStatus('error')
    }
  }

  // Styles
  const inputClass = "w-full bg-background border border-input text-foreground rounded-xl pl-10 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all placeholder:text-muted-foreground"
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-rose-500 transition-colors"

  if (!token) {
    return (
      <div className="text-center text-destructive p-8 bg-destructive/10 rounded-2xl border border-destructive/20">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Invalid Link</h2>
        <p className="text-sm text-muted-foreground mt-2">This password reset link is invalid or missing.</p>
        <Link href="/forgot-password" className="mt-6 inline-block text-primary hover:underline">Request a new link</Link>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-card/50 p-8 rounded-3xl border border-emerald-500/20 shadow-xl">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Password Reset!</h2>
        <p className="text-muted-foreground mb-6">Your password has been updated successfully.</p>
        <p className="text-emerald-500 text-sm animate-pulse">Redirecting to login...</p>
      </motion.div>
    )
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-xl p-8 w-full max-w-md transition-all">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">New Password</h1>
        <p className="text-muted-foreground">Create a secure password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" /> {errorMessage}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="group space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className={iconClass} />
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
              </button>
            </div>
          </div>

          <div className="group space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <Lock className={iconClass} />
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="group relative w-full flex items-center justify-center p-[2px] rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500 animate-[spin_3s_linear_infinite]" />
          <div className="relative w-full bg-background rounded-[10px] py-3.5 flex items-center justify-center gap-2 transition-colors z-10">
            {status === 'loading' ? <Loader2 className="w-5 h-5 text-foreground animate-spin" /> : <span className="font-bold text-foreground">Update Password</span>}
          </div>
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse bg-rose-500/20 dark:bg-rose-900/30" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse delay-1000 bg-indigo-500/20 dark:bg-indigo-900/30" />
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md p-4">
        <Suspense fallback={<div className="text-foreground text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}