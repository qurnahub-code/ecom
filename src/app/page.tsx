import Link from "next/link"
import { getFeaturedProducts } from "@/modules/products/product.service"
import { AnnouncementBar } from "@/components/layout/AnnouncementBar" // ✅ FIXED IMPORT
import { Hero } from "@/components/home/Hero"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { ProductCard } from "@/components/products/ProductCard" 
import { SuggestedFeed } from "@/components/home/SuggestedFeed"
import { Truck, ShieldCheck, Zap, Star, ArrowRight, Mail } from "lucide-react"

export default async function HomePage() {
  const rawProducts = await getFeaturedProducts()
  
  const products = rawProducts.map((product: any) => ({
    ...product,
    price: typeof product.price === 'object' ? Number(product.price) : product.price,
    costPrice: product.costPrice ? Number(product.costPrice) : 0,
  }))

  return (
    <main className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground overflow-hidden transition-colors duration-300">
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite] bg-purple-200/30 dark:bg-purple-900/20" />
         <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-[pulse_12s_ease-in-out_infinite] delay-1000 bg-blue-200/30 dark:bg-blue-900/20" />
      </div>

      <div className="relative z-10">
        
        {/* ✅ FIXED COMPONENT (This contains your marquee animation) */}
        <AnnouncementBar />

        {/* --- HERO SECTION --- */}
        <div className="relative overflow-hidden mb-12">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 blur-3xl animate-pulse scale-150 transform dark:opacity-30 dark:from-indigo-500/20" />
          <div className="relative z-10"><Hero /></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 dark:from-zinc-950 to-transparent" />
        </div>

        {/* --- FEATURES SECTION --- */}
        <section className="py-8 border-y border-gray-200 dark:border-white/5 bg-white/80 dark:bg-white/5 backdrop-blur-md">
          <div className="max-w-[2000px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
                { icon: Truck, title: "Global Shipping", desc: "150+ Countries" },
                { icon: ShieldCheck, title: "Secure Checkout", desc: "100% Protected" },
                { icon: Star, title: "Premium Quality", desc: "Verified Brands" },
                { icon: Zap, title: "24/7 Support", desc: "Instant Help" },
             ].map((feature, idx) => (
               <div key={idx} className="flex items-center gap-3 p-4 rounded-xl transition-all 
                 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200
                 dark:bg-transparent dark:border-transparent dark:hover:bg-white/5 dark:hover:border-white/10 dark:shadow-none">
                 <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-black text-white shadow-lg dark:bg-white/10 dark:text-white dark:shadow-none">
                   <feature.icon className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-xs uppercase text-black dark:text-white">{feature.title}</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{feature.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* --- CATEGORIES --- */}
        <div className="mt-12 mb-16">
            <CategoryGrid />
        </div>

        {/* --- PRODUCT GRID --- */}
        <section className="max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white tracking-tight">
                Fresh <span className="text-indigo-600 dark:text-primary">Drops</span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">New arrivals updated daily.</p>
            </div>
            <Link href="/search" className="text-sm font-semibold text-indigo-600 dark:text-primary hover:opacity-80 flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 min-[2200px]:grid-cols-8 gap-4">
            {products.map((product) => (
              <div key={product.id} className="group h-full">
                <div className="h-full rounded-xl overflow-hidden transition-all duration-300 flex flex-col
                  bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300
                  dark:bg-white/5 dark:border-white/5 dark:text-white dark:hover:shadow-black/50 dark:hover:border-white/20">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- BANNER --- */}
        <section className="relative py-24 overflow-hidden bg-gray-100 text-black dark:bg-zinc-900 dark:text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] animate-pulse bg-indigo-300/20 dark:bg-indigo-500/20"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-black dark:text-white">
              NEXT LEVEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-cyan-400">GEAR</span>
            </h2>
            <div className="flex justify-center gap-4">
               <Link href="/search?category=Electronics" className="px-8 py-3 font-bold rounded-full hover:scale-105 transition-transform shadow-lg bg-black text-white dark:bg-white dark:text-black">
                 Shop Electronics
               </Link>
            </div>
          </div>
        </section>

        {/* --- SUGGESTED FEED SECTION --- */}
        <SuggestedFeed />

        {/* --- NEWSLETTER --- */}
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="rounded-2xl p-8 md:p-12 shadow-lg dark:shadow-none bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-black text-white shadow-lg dark:bg-white/10 dark:text-white dark:shadow-none">
                <Mail className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Get Exclusive Offers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Join 50,000+ subscribers.</p>
              
              <form className="flex gap-2 max-w-sm mx-auto">
                <input type="email" placeholder="Email address" className="flex-1 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 border border-gray-300 text-black placeholder:text-gray-500 dark:bg-black/50 dark:border-white/10 dark:text-white" />
                <button className="font-medium px-4 py-2 rounded-lg text-sm hover:opacity-80 bg-black text-white dark:bg-indigo-600">Join</button>
              </form>
            </div>
        </section>

      </div>
    </main>
  )
}