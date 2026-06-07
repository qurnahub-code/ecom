"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck, Truck, Zap, CreditCard, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

// Product Card definition for interactive workspace grid
interface ProductWorkspaceItem {
  id: string
  name: string
  category: string
  tag: string
  specs: { label: string; value: string }[]
  color: "purple" | "blue"
  positionClass: string // Positioning for large screens
  floatingDelay: number
  floatingDuration: number
  renderSvg: () => React.JSX.Element
}

export function Hero() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const floatingProducts: ProductWorkspaceItem[] = [
    {
      id: "monitor",
      name: "Volts Horizon 49\"",
      category: "Ultrawide Monitor",
      tag: "QD-OLED • 240Hz",
      color: "blue",
      positionClass: "lg:absolute lg:top-[-10px] lg:left-[10%] lg:w-[310px] lg:z-30",
      floatingDelay: 0,
      floatingDuration: 7,
      specs: [
        { label: "Resolution", value: "5120 x 1440" },
        { label: "Curve Radius", value: "1000R" },
        { label: "Response Time", value: "0.03ms GtG" },
        { label: "Color Gamut", value: "99% DCI-P3" }
      ],
      renderSvg: () => (
        <svg viewBox="0 0 160 80" className="w-full h-24 text-brand-blue mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 Q80 15 150 20 L145 60 Q80 55 15 60 Z" fill="url(#screenGrad)" />
          <path d="M10 20 Q80 15 150 20 L145 60 Q80 55 15 60 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M80 58 L80 72 M65 72 L95 72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 35 L70 35 M30 43 L55 43 M90 35 L130 35 M90 43 L110 43" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <defs>
            <linearGradient id="screenGrad" x1="80" y1="18" x2="80" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B0B12" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: "keyboard",
      name: "Volts Cyberkey Pro",
      category: "Mechanical Keyboard",
      tag: "Hot-swap • Gateron Brown",
      color: "purple",
      positionClass: "lg:absolute lg:bottom-[20px] lg:left-[5%] lg:w-[280px] lg:z-40",
      floatingDelay: 1.2,
      floatingDuration: 6.2,
      specs: [
        { label: "Layout", value: "75% ANSI layout" },
        { label: "Keycaps", value: "Double-shot PBT" },
        { label: "Mounting", value: "Gasket Mounted" },
        { label: "Connectivity", value: "Tri-Mode Wireless" }
      ],
      renderSvg: () => (
        <svg viewBox="0 0 160 60" className="w-full h-16 text-brand-purple mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="10" width="150" height="40" rx="6" fill="#18181B" stroke="currentColor" strokeWidth="1.5" />
          <rect x="12" y="16" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="28" y="16" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="44" y="16" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="60" y="16" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="76" y="16" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="92" y="16" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="108" y="16" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="124" y="16" width="24" height="8" rx="2" fill="#8B5CF6" stroke="currentColor" />
          <rect x="12" y="28" width="18" height="8" rx="2" fill="#38BDF8" stroke="currentColor" />
          <rect x="34" y="28" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="50" y="28" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="66" y="28" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="82" y="28" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="98" y="28" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="114" y="28" width="34" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="12" y="40" width="12" height="6" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="28" y="40" width="12" height="6" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="44" y="40" width="68" height="6" rx="2" fill="#8B5CF6" fillOpacity="0.8" stroke="currentColor" />
          <rect x="116" y="40" width="12" height="6" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
          <rect x="132" y="40" width="16" height="6" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
        </svg>
      )
    },
    {
      id: "headphones",
      name: "Volts Audio Onyx",
      category: "Studio Headphones",
      tag: "Planar Magnetic • ANC",
      color: "purple",
      positionClass: "lg:absolute lg:top-[80px] lg:right-[5%] lg:w-[260px] lg:z-20",
      floatingDelay: 0.6,
      floatingDuration: 5.6,
      specs: [
        { label: "Driver Type", value: "90mm Planar Magnetic" },
        { label: "Frequency", value: "10Hz - 50kHz" },
        { label: "Impedance", value: "32 Ohms" },
        { label: "Battery Life", value: "Up to 48 Hours" }
      ],
      renderSvg: () => (
        <svg viewBox="0 0 100 100" className="w-full h-20 text-brand-purple mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50 C20 15, 80 15, 80 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M25 45 C25 22, 75 22, 75 45" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="12" y="45" width="14" height="28" rx="7" fill="#18181B" stroke="currentColor" strokeWidth="2" />
          <rect x="6" y="52" width="6" height="14" rx="2" fill="currentColor" />
          <rect x="74" y="45" width="14" height="28" rx="7" fill="#18181B" stroke="currentColor" strokeWidth="2" />
          <rect x="88" y="52" width="6" height="14" rx="2" fill="currentColor" />
          <circle cx="19" cy="59" r="3" fill="#8B5CF6" />
          <circle cx="81" cy="59" r="3" fill="#8B5CF6" />
        </svg>
      )
    },
    {
      id: "lamp",
      name: "Volts GlowBar",
      category: "Desk Lamp",
      tag: "Screenbar • Auto-Dim",
      color: "blue",
      positionClass: "lg:absolute lg:top-[-40px] lg:right-[35%] lg:w-[220px] lg:z-10",
      floatingDelay: 1.8,
      floatingDuration: 6.8,
      specs: [
        { label: "Light Source", value: "Asymmetrical LED" },
        { label: "CRI", value: "Ra > 95" },
        { label: "Brightness", value: "Stepless Dimming" },
        { label: "Temp Range", value: "2700K - 6500K" }
      ],
      renderSvg: () => (
        <svg viewBox="0 0 120 70" className="w-full h-20 text-brand-blue mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="10" width="60" height="6" rx="3" fill="#18181B" stroke="currentColor" strokeWidth="1.5" />
          <path d="M60 16 L60 30 M52 30 L68 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 16 L15 65 L105 65 L95 16 Z" fill="url(#lampGlow)" opacity="0.3" />
          <defs>
            <linearGradient id="lampGlow" x1="60" y1="16" x2="60" y2="65" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: "mouse",
      name: "Volts Swift-X",
      category: "Wireless Mouse",
      tag: "26K DPI • 63g Honeycomb",
      color: "blue",
      positionClass: "lg:absolute lg:bottom-[40px] lg:right-[15%] lg:w-[220px] lg:z-50",
      floatingDelay: 2.2,
      floatingDuration: 5.2,
      specs: [
        { label: "Sensor", value: "PixArt PAW3395" },
        { label: "Polling Rate", value: "4000Hz Wireless" },
        { label: "Switches", value: "80M Optical Click" },
        { label: "Weight", value: "63g Ergonomic" }
      ],
      renderSvg: () => (
        <svg viewBox="0 0 80 100" className="w-full h-20 text-brand-blue mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 10 C25 10, 20 35, 20 65 C20 85, 30 90, 40 90 C50 90, 60 85, 60 65 C60 35, 55 10, 40 10 Z" fill="#18181B" stroke="currentColor" strokeWidth="2" />
          <path d="M40 10 L40 45" stroke="currentColor" strokeWidth="1.5" />
          <rect x="38" y="20" width="4" height="12" rx="2" fill="#38BDF8" />
          <path d="M19 45 Q22 55 19 65 M61 45 Q58 55 61 65" stroke="currentColor" strokeWidth="1" />
          <path d="M25 80 Q40 85 55 80" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  ]

  return (
    <div className="relative min-h-[750px] lg:h-[800px] bg-brand-midnight text-white overflow-hidden flex items-center">
      
      {/* Background Gradients & Mesh Networks (Nebula Effect) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Technical Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20" />
        
        {/* Glowing Mesh Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] bg-brand-purple/20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] bg-brand-blue/20 animate-pulse delay-2000" />
        <div className="absolute top-[30%] left-[40%] w-[45%] h-[45%] rounded-full blur-[160px] bg-indigo-600/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: Copy and Trust bar */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            
            {/* Premium Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-heading font-black uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ⚡ Premium Workspace Essentials
            </motion.div>

            {/* Headline with Workspace Highlight */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.1] mb-6 text-white"
            >
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-indigo-400 to-brand-blue drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                Workspace
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg leading-relaxed font-sans"
            >
              Discover premium mechanical keyboards, monitors, audio gear, and studio accessories designed for creators, professionals, and gamers.
            </motion.p>

            {/* Trust Bar Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-y-3.5 gap-x-6 mb-10 max-w-md border-t border-white/5 pt-6"
            >
              {[
                { label: "100% Authentic Products", icon: ShieldCheck },
                { label: "Fast Nationwide Shipping", icon: Truck },
                { label: "Secure Payments", icon: CreditCard },
                { label: "24/7 Premium Support", icon: Zap }
              ].map((trust, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <trust.icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-300 font-sans">
                    {trust.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Call to Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/products" 
                className="group px-8 py-4 bg-gradient-to-r from-brand-purple to-indigo-600 text-white rounded-full font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:from-brand-purple/90 hover:to-indigo-600/90 transition-all duration-300 shadow-[0_4px_25px_rgba(139,92,246,0.35)] hover:shadow-[0_6px_30px_rgba(139,92,246,0.5)] transform hover:-translate-y-0.5"
              >
                Shop Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                href="/products" 
                className="px-8 py-4 bg-brand-darkgray/60 text-white border border-white/10 rounded-full font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center hover:bg-brand-darkgray hover:border-brand-blue/40 transition-all duration-300 backdrop-blur-md"
              >
                Explore Setup Kit
              </Link>
            </motion.div>

          </div>

          {/* RIGHT SIDE: Interactive Floating Product Canvas */}
          <div className="lg:col-span-6 relative w-full min-h-[450px] lg:h-[600px] flex items-center justify-center">
            
            {/* Interactive Grid Area */}
            <div className="w-full h-full relative grid grid-cols-1 sm:grid-cols-2 lg:block gap-6">
              
              {floatingProducts.map((product) => {
                const isHovered = hoveredCard === product.id
                const isColorPurple = product.color === "purple"

                return (
                  <motion.div
                    key={product.id}
                    className={`${product.positionClass} relative`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      y: [0, -12, 0]
                    }}
                    transition={{
                      opacity: { duration: 0.8, delay: product.floatingDelay * 0.3 },
                      scale: { duration: 0.8, delay: product.floatingDelay * 0.3 },
                      y: {
                        duration: product.floatingDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: product.floatingDelay
                      }
                    }}
                  >
                    {/* Inner 3D Tilt Card */}
                    <div 
                      onMouseEnter={() => setHoveredCard(product.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`relative overflow-hidden cursor-pointer rounded-2xl p-4 bg-brand-darkgray/65 border transition-all duration-500 backdrop-blur-lg shadow-2xl flex flex-col
                        ${isHovered 
                          ? isColorPurple 
                            ? "border-brand-purple/70 shadow-[0_0_35px_rgba(139,92,246,0.3)] scale-[1.03] -translate-y-1" 
                            : "border-brand-blue/70 shadow-[0_0_35px_rgba(56,189,248,0.3)] scale-[1.03] -translate-y-1"
                          : "border-white/10 hover:border-white/20"
                        }
                      `}
                      style={{
                        transform: isHovered 
                          ? "perspective(1000px) rotateX(4deg) rotateY(-4deg)" 
                          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                      }}
                    >
                      {/* Technical Grid Overlay when Hovered */}
                      <div className={`absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : ""}`} />

                      {/* Header */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-heading font-black tracking-widest text-gray-500 uppercase">
                          {product.category}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isColorPurple ? "bg-brand-purple animate-pulse" : "bg-brand-blue animate-pulse"}`} />
                      </div>

                      {/* SVG Illustration of gear */}
                      <div className="flex items-center justify-center p-2 rounded-xl bg-black/40 border border-white/5 mb-3 transition-colors duration-300">
                        {product.renderSvg()}
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <h3 className="font-heading font-bold text-sm text-white">{product.name}</h3>
                        <p className="text-xs text-gray-400 font-sans">{product.tag}</p>
                      </div>

                      {/* Technical Specs Expansion Overlay */}
                      <div className={`mt-3 pt-3 border-t border-white/5 space-y-1.5 text-[10px] font-sans overflow-hidden transition-all duration-300
                        ${isHovered ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
                      `}>
                        <div className="grid grid-cols-2 gap-2">
                          {product.specs.map((spec, sIdx) => (
                            <div key={sIdx} className="flex flex-col border-l border-white/10 pl-1.5">
                              <span className="text-[8px] uppercase tracking-wider text-gray-500">{spec.label}</span>
                              <span className="font-medium text-gray-300 truncate">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )
              })}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}