import { prisma } from "@/lib/prisma"
import { CareersList } from "@/components/careers/CareersList"
import { Sparkles, ArrowDown } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CareersPage() {
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    // FORCE BACKGROUND: Added !bg-gray-50 to force override any global dark setting
    <main className="relative min-h-screen !bg-gray-50 dark:!bg-zinc-950 text-foreground transition-colors duration-300 overflow-hidden font-sans">
      
      {/* --- ANIMATED BACKGROUND LAYER --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
         {/* Texture: Dark in Dark Mode, Light in Light Mode */}
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         
         {/* Blobs: Adjusted colors to be visible on white background */}
         <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite] 
           bg-indigo-300/30 dark:bg-indigo-900/20 mix-blend-multiply dark:mix-blend-screen" 
         />
         
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-[pulse_12s_ease-in-out_infinite] delay-1000 
           bg-purple-300/30 dark:bg-purple-900/20 mix-blend-multiply dark:mix-blend-screen" 
         />
      </div>

      <div className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 text-center px-4">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 shadow-sm
              bg-white border-gray-200 text-indigo-600
              dark:bg-white/5 dark:border-white/10 dark:text-indigo-400">
              <Sparkles className="w-3 h-3" />
              We are Hiring
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white">
              JOIN OUR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-cyan-400">
                MISSION
              </span>
            </h1>
            
            {/* FORCE TEXT COLOR: Explicitly set text-gray-600 for light mode visibility */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
              We’re building the future of commerce. Browse our open positions below and find your next challenge.
            </p>

            <div className="pt-8 animate-bounce opacity-50">
               <ArrowDown className="w-6 h-6 mx-auto text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </section>

        {/* --- JOBS LIST --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="relative rounded-3xl p-6 md:p-12 border shadow-xl backdrop-blur-sm transition-all
            bg-white/80 border-gray-200
            dark:bg-white/5 dark:border-white/5 dark:shadow-none">
             
             <CareersList initialJobs={jobs} />

          </div>
        </section>

      </div>
    </main>
  )
}