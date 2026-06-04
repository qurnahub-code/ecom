"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Clock, TrendingUp } from "lucide-react"

export function SmartSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // 1. Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem("search_history")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  // 2. Click Outside to Close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 3. Fetch Suggestions (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        try {
          const res = await fetch(`/api/search/suggestions?q=${query}`)
          if (res.ok) {
            const data = await res.json()
            setSuggestions(data)
          }
        } catch (error) {
          console.error("Failed to fetch suggestions")
        }
      } else {
        setSuggestions([])
      }
    }, 300) // Wait 300ms after typing stops
    return () => clearTimeout(delayDebounceFn)
  }, [query])

  // 4. Handle Search Execution
  const handleSearch = (term: string) => {
    if (!term.trim()) return
    
    // Save to History (Avoid duplicates, keep last 5)
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem("search_history", JSON.stringify(newHistory))

    setIsOpen(false)
    setQuery(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  const removeHistory = (e: React.MouseEvent, term: string) => {
    e.stopPropagation()
    const newHistory = history.filter(h => h !== term)
    setHistory(newHistory)
    localStorage.setItem("search_history", JSON.stringify(newHistory))
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md z-50">
      
      {/* INPUT FIELD */}
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
          placeholder="Search specifically..."
          className="w-full bg-gray-100 dark:bg-zinc-800/80 border border-transparent dark:border-white/10 rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-black transition-all text-black dark:text-white placeholder:text-gray-500 shadow-sm"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500" />
        
        {/* Clear Button */}
        {query && (
          <button 
            onClick={() => { setQuery(""); setSuggestions([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-400"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          
          {/* SECTION A: SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-white/5">Suggestions</p>
              {suggestions.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleSearch(item.name)}
                  className="px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer flex items-center gap-3 border-b border-gray-50 dark:border-white/5 last:border-0"
                >
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                    <p className="text-[10px] text-gray-400">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION B: HISTORY */}
          {history.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-white/5">Recent Searches</p>
              {history.map((term) => (
                <div 
                  key={term} 
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{term}</span>
                  </div>
                  <button 
                    onClick={(e) => removeHistory(e, term)}
                    className="p-1 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from history"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {suggestions.length === 0 && history.length === 0 && query && (
             <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
               Press Enter to search for <span className="font-bold">"{query}"</span>
             </div>
          )}
        </div>
      )}
    </div>
  )
}