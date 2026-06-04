"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, User, CheckCircle, Github, Chrome } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Registration failed")

      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Semantic styles
  const inputWrapperClass = "relative group"
  const inputIconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors"
  const inputClass = "w-full bg-background border border-input text-foreground rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-muted-foreground"
  const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block"

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* --- BACKGROUND ANIMATION (ADAPTIVE) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse bg-emerald-500/20 dark:bg-emerald-900/30" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse delay-1000 bg-teal-500/20 dark:bg-teal-900/30" />
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      </div>

      {/* --- CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 p-6"
      >
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-xl p-8 space-y-8 transition-all">
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Join the Empire</h1>
            <p className="text-muted-foreground">Create your account to get started.</p>
          </div>

          {success ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Account Created!</h3>
              <p className="text-muted-foreground">Redirecting to login...</p>
              <div className="w-full bg-muted h-1 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[width_2s_ease-in-out_forwards] w-0" />
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm text-center font-medium">
                   {error}
                 </motion.div>
              )}

              <div className="space-y-4">
                <div className={inputWrapperClass}>
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <User className={inputIconClass} />
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className={inputClass} />
                  </div>
                </div>

                <div className={inputWrapperClass}>
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail className={inputIconClass} />
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@company.com" className={inputClass} />
                  </div>
                </div>

                <div className={inputWrapperClass}>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className={inputIconClass} />
                    <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Min 6 characters" className={inputClass} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center p-[2px] rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-[spin_3s_linear_infinite]" />
                <div className="relative w-full bg-background rounded-[10px] py-3.5 flex items-center justify-center gap-2 transition-colors z-10">
                  {loading ? <Loader2 className="w-5 h-5 text-foreground animate-spin" /> : <span className="font-bold text-foreground">Create Account</span>}
                </div>
              </button>
            </form>
          )}

          {!success && (
            <div className="text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">Sign in</Link>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  )
}