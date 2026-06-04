"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, Github, Chrome } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError("Invalid credentials.")
      setLoading(false)
    } else {
      router.refresh()
      router.push("/admin/dashboard")
    }
  }

  // Semantic classes for reuse
  const inputWrapperClass = "relative group"
  const inputIconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors"
  const inputClass = "w-full bg-background border border-input text-foreground rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
  const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block"

  return (
    // Use bg-background to adapt to theme
    <div className="flex min-h-screen w-full items-center justify-center bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* --- BACKGROUND ANIMATION (ADAPTED FOR THEMES) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
         {/* Blobs are softer in light mode, deeper in dark mode */}
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse bg-purple-500/30 dark:bg-purple-600/20" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse delay-1000 bg-blue-500/30 dark:bg-blue-600/20" />
         {/* Grid opacity adjusts */}
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 dark:opacity-20"></div>
      </div>

      {/* --- CENTERED CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 p-6"
      >
        {/* Card uses bg-card with opacity for glass effect over the blobs */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-xl p-8 space-y-8 transition-all">
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Enter your credentials to access the empire.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm text-center font-medium">
                 {error}
               </motion.div>
            )}

            <div className="space-y-4">
              <div className={inputWrapperClass}>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className={inputIconClass} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={inputClass} />
                </div>
              </div>

              <div className={inputWrapperClass}>
                <div className="flex justify-between items-center mb-1">
                  <label className={labelClass}>Password</label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className={inputIconClass} />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center p-[2px] rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {/* RGB border animation remains */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[spin_3s_linear_infinite]" />
              {/* Button inner adapts to theme */}
              <div className="relative w-full bg-background rounded-[10px] py-3.5 flex items-center justify-center gap-2 transition-colors z-10">
                {loading ? <Loader2 className="w-5 h-5 text-foreground animate-spin" /> : <span className="font-bold text-foreground">Sign In</span>}
              </div>
            </button>
          </form>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground rounded-full">Or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 bg-background border border-input hover:bg-accent hover:text-accent-foreground py-2.5 rounded-xl transition-all text-sm font-medium"><Github className="w-4 h-4"/> GitHub</button>
               <button className="flex items-center justify-center gap-2 bg-background border border-input hover:bg-accent hover:text-accent-foreground py-2.5 rounded-xl transition-all text-sm font-medium"><Chrome className="w-4 h-4"/> Google</button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account? <Link href="/signup" className="font-semibold text-primary hover:underline transition-colors">Create one</Link>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  )
}