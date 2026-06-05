"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, Send, MessageSquare, Clock, Globe } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0) // Open first one by default

  const faqs = [
    { question: "How do I track my order?", answer: "You can track your order status in real-time by visiting the 'Order Tracking' link in the footer and entering your Order ID." },
    { question: "What is your return policy?", answer: "We offer a 30-day return policy for all unused items in original packaging. Refunds are processed within 5-7 business days." },
    { question: "Do you ship internationally?", answer: "Currently, we only ship within Pakistan. We plan to expand to international markets soon." },
    { question: "Can I change my delivery address?", answer: "Yes, if your order is still 'Pending', you can contact support to update the address." }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API Call
    setTimeout(() => {
        setSuccess(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        setLoading(false)
        setTimeout(() => setSuccess(false), 5000)
    }, 1500)
  }

  // Shared classes for inputs
  const inputClass = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans overflow-hidden">
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
         <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-purple-200/40 dark:bg-purple-900/20 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        
        {/* --- HEADER --- */}
        <div className="pt-24 pb-12 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900 dark:text-white">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Support</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or need assistance? We're here to help you 24/7.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* --- LEFT: FORM CARD --- */}
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 dark:opacity-10" />
             <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-xl">
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-indigo-500" /> Send us a Message
                </h2>
                
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 flex items-center animate-in fade-in slide-in-from-top-2">
                    <span className="mr-2 text-xl">✅</span> Message sent! We'll reply shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</label>
                      <input required className={inputClass} placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</label>
                      <input required type="email" className={inputClass} placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</label>
                    <div className="relative">
                        <select className={`${inputClass} appearance-none cursor-pointer`} value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                            <option value="">Select a Topic...</option>
                            <option value="Order Issue">Order Issue</option>
                            <option value="Refund">Refund Request</option>
                            <option value="General">General Inquiry</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</label>
                    <textarea required rows={5} className={inputClass} placeholder="How can we help you?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                  </div>

                  <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
             </div>
          </div>

          {/* --- RIGHT: INFO & FAQ --- */}
          <div className="space-y-8">
            
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur border border-gray-200 dark:border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Phone Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+92 (326) 450-0909</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Available Now
                </div>
              </div>

              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur border border-gray-200 dark:border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition-colors group">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Email Us</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">support@voltsstore.com</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-purple-600 dark:text-purple-400">
                    <Clock className="w-3 h-3" /> Response time: ~2 hrs
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur border border-gray-200 dark:border-white/5 p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden bg-white/50 dark:bg-white/5">
                    <button 
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex justify-between items-center p-4 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className={`text-sm font-semibold ${openFaq === index ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}`}>
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="p-4 pt-0 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 mt-2">
                            {faq.answer}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}