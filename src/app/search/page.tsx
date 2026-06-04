import { Metadata } from "next"
import Link from "next/link"
import { Search, Filter, ArrowLeft, ArrowRight, SlidersHorizontal, X } from "lucide-react"
import { ProductCard } from "@/components/products/ProductCard"

export const metadata: Metadata = {
  title: "Search Products | Majestic Inc.",
  description: "Explore our premium collection.",
}

// Types
interface Product {
  id: string
  name: string
  description: string
  price: number | string
  images: { url: string }[]
  category: string
  rating?: number
}

interface SearchResponse {
  data: Product[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Fetch Logic
async function getProducts(searchParams: any): Promise<SearchResponse> {
  const params = new URLSearchParams()
  if (searchParams?.q) params.set("q", searchParams.q as string)
  if (searchParams?.category) params.set("category", searchParams.category as string)
  if (searchParams?.minPrice) params.set("minPrice", searchParams.minPrice as string)
  if (searchParams?.maxPrice) params.set("maxPrice", searchParams.maxPrice as string)
  if (searchParams?.sort) params.set("sort", searchParams.sort as string)
  if (searchParams?.page) params.set("page", searchParams.page as string)

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/search?${params.toString()}`, { cache: "no-store" })

  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function SearchPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  let response: SearchResponse
  
  try {
    response = await getProducts(searchParams)
  } catch (error) {
    console.error("Search Error:", error)
    response = { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } }
  }

  const { data: products, meta } = response
  const currentCategory = (searchParams.category as string) || "All"
  const currentSort = (searchParams.sort as string) || "newest"
  const currentQ = (searchParams.q as string) || ""

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans">
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
         <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-purple-200/40 dark:bg-purple-900/20 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* --- MOBILE SEARCH BAR (Visible on small screens) --- */}
        <div className="lg:hidden mb-6">
           <form action="/search" className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                name="q"
                defaultValue={currentQ}
                placeholder="Search specifically..."
                className="w-full bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-md"
              />
           </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* --- SIDEBAR FILTERS --- */}
          <aside className="hidden lg:block space-y-8 sticky top-24 h-fit p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-500" /> Filters
                </h3>
                {(currentCategory !== 'All' || currentQ) && (
                   <Link href="/search" className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-bold">
                      <X className="w-3 h-3" /> Clear
                   </Link>
                )}
             </div>

             {/* Categories */}
             <div className="space-y-3">
               <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</p>
               <div className="flex flex-col gap-1">
                 {['All', 'Electronics', 'Fashion', 'Home', 'Accessories'].map((cat) => (
                   <Link 
                     key={cat}
                     href={`/search?q=${currentQ}&category=${cat === 'All' ? '' : cat}`}
                     className={`text-sm px-3 py-2 rounded-lg transition-all flex justify-between items-center ${
                       (cat === 'All' && !searchParams.category) || currentCategory === cat
                         ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20" 
                         : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                     }`}
                   >
                     {cat}
                     {/* You could add counts here if available from API */}
                   </Link>
                 ))}
               </div>
             </div>

             {/* Price Range */}
             <div className="space-y-3">
               <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Price</p>
               <div className="grid grid-cols-2 gap-2">
                  <Link href={`/search?q=${currentQ}&maxPrice=50`} className="text-xs border border-gray-200 dark:border-white/10 rounded-lg p-2 text-center hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white dark:bg-zinc-800">Under $50</Link>
                  <Link href={`/search?q=${currentQ}&minPrice=50&maxPrice=100`} className="text-xs border border-gray-200 dark:border-white/10 rounded-lg p-2 text-center hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white dark:bg-zinc-800">$50 - $100</Link>
                  <Link href={`/search?q=${currentQ}&minPrice=100&maxPrice=500`} className="text-xs border border-gray-200 dark:border-white/10 rounded-lg p-2 text-center hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white dark:bg-zinc-800">$100 - $500</Link>
                  <Link href={`/search?q=${currentQ}&minPrice=500`} className="text-xs border border-gray-200 dark:border-white/10 rounded-lg p-2 text-center hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white dark:bg-zinc-800">$500+</Link>
               </div>
             </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 Showing <span className="font-bold text-gray-900 dark:text-white">{products.length}</span> results
                 {currentQ && <span> for "<span className="text-indigo-500">{currentQ}</span>"</span>}
               </p>

               <div className="flex items-center gap-3">
                 <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                 <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <Link href={`/search?q=${currentQ}&sort=newest`} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${currentSort === 'newest' ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>Newest</Link>
                    <Link href={`/search?q=${currentQ}&sort=price_asc`} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${currentSort === 'price_asc' ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>Price ↑</Link>
                    <Link href={`/search?q=${currentQ}&sort=price_desc`} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${currentSort === 'price_desc' ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>Price ↓</Link>
                 </div>
               </div>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="h-full">
                     <ProductCard 
                       product={{
                         ...product,
                         price: Number(product.price) 
                       }} 
                       layout="grid"
                     />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-2">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No products found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">We couldn't find anything matching your search. Try different keywords or check your spelling.</p>
                <Link href="/search" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                   Clear Filters
                </Link>
              </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 pt-10 border-t border-gray-200 dark:border-white/5">
                <Link 
                  href={`/search?q=${currentQ}&page=${meta.page - 1}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${meta.page <= 1 ? 'pointer-events-none opacity-50 text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white'}`}
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </Link>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                   Page <span className="text-indigo-600 dark:text-indigo-400">{meta.page}</span> of {meta.totalPages}
                </span>
                <Link 
                  href={`/search?q=${currentQ}&page=${meta.page + 1}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${meta.page >= meta.totalPages ? 'pointer-events-none opacity-50 text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white'}`}
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}