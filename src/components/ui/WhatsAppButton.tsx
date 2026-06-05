"use client"

import { MessageCircle } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Replace with the client's actual support number
  const phoneNumber = "923264500909"
  const message = encodeURIComponent("Hi Volts Store! I need assistance with my shopping.")
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            className="bg-zinc-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl font-bold border border-white/10 dark:bg-white dark:text-black dark:border-zinc-200"
          >
            Chat with Support
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse effect wrapper */}
      <div className="relative">
        <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20 pointer-events-none" />
        
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-green-500 via-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/20 border border-green-400 hover:shadow-emerald-500/40 transition-shadow outline-none cursor-pointer"
        >
          <MessageCircle className="h-7 w-7" />
        </motion.a>
      </div>
    </div>
  )
}
