"use client"

import Link from "next/link"
import { Smartphone, Shirt, Home, BookOpen, Watch, Glasses, ShoppingBag } from "lucide-react"

// Configuration with Adaptive Colors (Light vs Dark)
const CATEGORIES = [
  { 
    name: "Electronics", 
    icon: Smartphone, 
    href: "/search?category=Electronics",
    color: "text-blue-600 dark:text-blue-400", 
    bg: "bg-blue-100 dark:bg-blue-500/20" 
  },
  { 
    name: "Clothing", 
    icon: Shirt, 
    href: "/search?category=Clothing", // specific category filter
    color: "text-pink-600 dark:text-pink-400", 
    bg: "bg-pink-100 dark:bg-pink-500/20" 
  },
  { 
    name: "Home", 
    icon: Home, 
    href: "/search?category=Home",
    color: "text-green-600 dark:text-green-400", 
    bg: "bg-green-100 dark:bg-green-500/20" 
  },
  { 
    name: "Books", 
    icon: BookOpen, 
    href: "/search?category=Books",
    color: "text-amber-600 dark:text-amber-400", 
    bg: "bg-amber-100 dark:bg-amber-500/20" 
  },
  { 
    name: "Accessories", 
    icon: Watch, 
    href: "/search?category=Accessories",
    color: "text-purple-600 dark:text-purple-400", 
    bg: "bg-purple-100 dark:bg-purple-500/20" 
  },
]

export function CategoryGrid() {
  return (
    <section className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-100 dark:border-white/5">
      
      {/* HEADER: Matches your 'Fresh Drops' style */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black dark:text-white tracking-tight">
          Shop by Category <span className="text-indigo-600 dark:text-primary"></span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.name} 
            href={cat.href}
            className="group flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300
              /* LIGHT MODE: White Card, Subtle Border, Shadow */
              bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-300
              /* DARK MODE: Translucent Glass, Subtle Border */
              dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 dark:hover:border-white/20"
          >
            {/* Icon Circle */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${cat.bg} ${cat.color}`}>
              <cat.icon className="w-7 h-7" />
            </div>

            {/* Label */}
            <span className="font-bold text-gray-700 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}