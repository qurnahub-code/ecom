import { Zap } from "lucide-react"

export function AnnouncementBar() {
  return (
    <div className="w-full bg-[#3b0764] text-white overflow-hidden py-2 z-50 relative border-b border-white/10">
      {/* 1. w-[200%]: Double width to hold duplicate content 
         2. flex: Side-by-side layout
         3. animate-marquee: The custom animation defined in globals.css
      */}
      <div className="flex w-[200%] animate-marquee whitespace-nowrap hover:paused group">
        
        {/* --- Copy 1 --- */}
        <div className="flex w-1/2 justify-around items-center px-4">
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 
            Flash Sale: Get 20% off all electronics
          </span>
          <span className="text-xs font-bold tracking-widest uppercase opacity-80 hidden sm:inline-block">
            Free Shipping on orders over $200
          </span>
          <span className="text-xs font-bold tracking-widest uppercase opacity-80 hidden md:inline-block">
            New Arrivals in Stock
          </span>
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            Shop Now & Save 
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </span>
        </div>

        {/* --- Copy 2 (Duplicate for seamless loop) --- */}
        <div className="flex w-1/2 justify-around items-center px-4">
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 
            Flash Sale: Get 20% off all electronics
          </span>
          <span className="text-xs font-bold tracking-widest uppercase opacity-80 hidden sm:inline-block">
            Free Shipping on orders over $200
          </span>
          <span className="text-xs font-bold tracking-widest uppercase opacity-80 hidden md:inline-block">
            New Arrivals in Stock
          </span>
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            Shop Now & Save 
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </span>
        </div>

      </div>
    </div>
  )
}