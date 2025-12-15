"use client"
import { useState } from "react"
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
      body: JSON.stringify({ email }),
    })

    if (res.ok) setStatus('success')
    else setStatus('error')
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-gray-600 mb-6">We have sent a password reset link to <b>{email}</b>.</p>
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded text-xs text-left mb-6 font-mono">
            [DEV MODE]: Check your server terminal/console for the reset link!
          </div>
          <Link href="/login" className="text-indigo-600 font-bold hover:underline">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <Link href="/login" className="flex items-center gap-1 text-gray-500 text-sm mb-6 hover:text-black"><ArrowLeft size={16}/> Back</Link>
        <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
        <p className="text-gray-500 mb-6">Enter your email to reset your password.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
          <button disabled={status === 'loading'} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50">
            {status === 'loading' ? <Loader2 className="animate-spin mx-auto"/> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  )
}