"use client"

import { useState } from "react"
import { Upload, Send, CheckCircle, X } from "lucide-react"

interface ApplicationFormProps {
  jobTitle: string
}

export function ApplicationForm({ jobTitle }: ApplicationFormProps) {
  const [isOpen, setIsOpen] = useState(false) // Controls the Modal
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API delay (Replace with real server action later)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      // Close modal after success message
      setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false) // Reset for future use
      }, 3000)
    }, 1500)
  }

  // 1. The "Success" View inside Modal
  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-2xl p-8 text-center max-w-md w-full shadow-2xl">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Application Sent!</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Good luck! We'll review your application for <strong className="text-indigo-600 dark:text-indigo-400">{jobTitle}</strong>.
          </p>
          <button 
            onClick={() => setIsOpen(false)} 
            className="mt-6 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline"
          >
            Close Window
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 2. THE TRIGGER: Side Panel Widget */}
      <div className="p-6 text-center">
        {/* We rely on the parent container for the background/border to keep it clean */}
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all
            bg-black text-white 
            dark:bg-white dark:text-black"
        >
          Apply Now
        </button>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-3">
          Takes less than 2 minutes.
        </p>
      </div>

      {/* 3. THE MODAL: Only appears when isOpen is true */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          {/* Modal Container */}
          <div className="w-full max-w-lg h-auto max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col rounded-2xl
            bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center sticky top-0 z-10 
              bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Apply for Role</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{jobTitle}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 rounded-full transition-colors
                  hover:bg-gray-100 text-gray-500 
                  dark:hover:bg-white/10 dark:text-gray-400"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            {/* Modal Body (The Form) */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">First Name</label>
                  <input required placeholder="Jane" className="w-full p-2.5 rounded-lg border outline-none transition-all
                    bg-white border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent
                    dark:bg-zinc-800 dark:border-white/10 dark:text-white dark:focus:ring-white dark:placeholder-zinc-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Last Name</label>
                  <input required placeholder="Doe" className="w-full p-2.5 rounded-lg border outline-none transition-all
                    bg-white border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent
                    dark:bg-zinc-800 dark:border-white/10 dark:text-white dark:focus:ring-white dark:placeholder-zinc-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email Address</label>
                <input required type="email" placeholder="jane@example.com" className="w-full p-2.5 rounded-lg border outline-none transition-all
                  bg-white border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent
                  dark:bg-zinc-800 dark:border-white/10 dark:text-white dark:focus:ring-white dark:placeholder-zinc-500" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Resume / CV</label>
                <div className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer group transition-colors
                  border-gray-300 hover:bg-gray-50 hover:border-gray-400
                  dark:border-white/10 dark:hover:bg-white/5 dark:hover:border-white/30">
                  <Upload className="w-6 h-6 mx-auto mb-2 transition-colors
                    text-gray-400 group-hover:text-black
                    dark:text-zinc-500 dark:group-hover:text-white" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload (PDF, Max 5MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Cover Letter</label>
                <textarea placeholder="Briefly tell us about yourself..." className="w-full p-3 rounded-lg border outline-none h-24 resize-none transition-all
                  bg-white border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent
                  dark:bg-zinc-800 dark:border-white/10 dark:text-white dark:focus:ring-white dark:placeholder-zinc-500"></textarea>
              </div>

              <div className="pt-2">
                <button 
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-bold transition flex justify-center items-center gap-2 disabled:opacity-70
                    bg-black text-white hover:bg-gray-800
                    dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500"
                >
                  {loading ? "Submitting..." : <>Submit Application <Send className="w-4 h-4" /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}