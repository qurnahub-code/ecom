"use client"

import { Search, Clock, TrendingUp, X, Camera, Image as ImageIcon, HelpCircle, QrCode, RefreshCcw } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { getSearchSuggestions } from "@/app/actions"
import Link from "next/link"

type Suggestion = {
  id: string
  name: string
  category: string
  imageUrl: string
}

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [history, setHistory] = useState<string[]>([])
  
  // Image Search States
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const trendingTopics = ["Electronics", "Headphones", "Summer Sale", "Laptops"]

  useEffect(() => {
    const saved = localStorage.getItem("search_history")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 0) {
        const results = await getSearchSuggestions(query)
        // @ts-ignore
        setSuggestions(results)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleSearch = (term: string) => {
    if (!term.trim()) return
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem("search_history", JSON.stringify(newHistory))
    setIsOpen(false)
    setQuery(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  // --- CAMERA LOGIC FOR NAVBAR ---
  const startCamera = async () => {
    setCapturedImage(null);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    setCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleImageSearch = () => {
    if (isImageSearchOpen) {
      stopCamera();
      setIsImageSearchOpen(false);
    } else {
      setIsImageSearchOpen(true);
      startCamera();
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  return (
    <>
      <div ref={wrapperRef} className="relative hidden md:block w-full max-w-md mx-6 z-50">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full bg-gray-100 border text-gray-900 text-sm rounded-t-2xl outline-none block pl-10 pr-10 p-3 transition-all ${
              isOpen ? "rounded-b-none bg-white border-gray-200 shadow-lg ring-2 ring-black/5" : "rounded-b-2xl border-transparent focus:ring-2 focus:ring-black focus:bg-white"
            }`}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <button type="button" onClick={toggleImageSearch} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black transition">
            <Camera className="w-5 h-5" />
          </button>
        </form>

        {/* DROPDOWN (Simplified for brevity, logic matches previous) */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-x border-b border-gray-200 rounded-b-2xl shadow-xl overflow-hidden p-2">
             {/* Suggestions... */}
             {query.length === 0 ? (
               <div className="text-xs text-gray-400 font-bold px-3 py-2 uppercase">Recent Searches</div>
             ) : (
                <div onClick={() => handleSearch(query)} className="px-5 py-3 text-indigo-600 text-sm font-semibold cursor-pointer hover:bg-gray-100 flex items-center gap-2">
                  <Search className="w-4 h-4" />See all results for "{query}"
                </div>
             )}
          </div>
        )}
      </div>

      {/* --- GLOBAL IMAGE SEARCH OVERLAY (Simplified Copy) --- */}
      {isImageSearchOpen && (
         <div className="fixed inset-0 z-[100] bg-black flex flex-col">
           <div className="flex justify-between items-center p-4 text-white z-10">
              <button onClick={toggleImageSearch}><X size={24}/></button>
              <span className="font-semibold">Image Search</span>
              <div className="w-8"></div>
           </div>
           
           <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden">
              {capturedImage ? <img src={capturedImage} className="w-full h-full object-contain"/> : (
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              )}
              {!capturedImage && <div className="absolute w-64 h-64 border-2 border-white/30 rounded-lg"><div className="w-full h-0.5 bg-blue-500 animate-[scan_2s_infinite]"></div></div>}
           </div>
           
           <div className="bg-black p-8 flex justify-center gap-12">
              {capturedImage ? (
                 <button onClick={() => { setCapturedImage(null); startCamera(); }} className="text-white">Retake</button>
              ) : (
                 <button onClick={takePhoto} className="w-16 h-16 bg-white rounded-full border-4 border-gray-300"></button>
              )}
           </div>
        </div>
      )}
    </>
  )
}