"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!token) return
    setStatus('loading')

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    })

    if (res.ok) {
      router.push("/login?message=Password updated successfully!")
    } else {
      setStatus('error')
    }
  }

  if (!token) return <div className="text-center p-10 text-red-500">Invalid or missing token.</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Set New Password</h1>
        {status === 'error' && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">Token expired or invalid.</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="New Password" 
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none pr-10" 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button disabled={status === 'loading'} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50">
            {status === 'loading' ? <Loader2 className="animate-spin mx-auto"/> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ResetForm />
    </Suspense>
  )
}