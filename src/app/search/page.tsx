'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchProducts } from '@/app/actions'; 
import { ProductCard } from '@/components/products/ProductCard'; // [NEW] Use the shared card
import { 
  Search, Camera, Image as ImageIcon, SlidersHorizontal, 
  X, Star, Grid, List, HelpCircle, QrCode, RefreshCcw, 
  Loader2
} from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  
  const [activeSort, setActiveSort] = useState('Best Match'); 
  const [activeTab, setActiveTab] = useState('price'); 
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid'); // Typed for component

  // Camera States
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync Query
  useEffect(() => { setQuery(searchParams.get('q') || ''); }, [searchParams]);

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let sortParam = activeSort === 'Price' ? 'Price Low-High' : activeSort;
        const data = await searchProducts({ query, minPrice: priceRange[0], maxPrice: priceRange[1], sort: sortParam });
        setProducts(minRating ? data.filter((p: any) => p.rating >= minRating) : data);
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    }
    const t = setTimeout(fetchData, 500);
    return () => clearTimeout(t);
  }, [query, priceRange, minRating, activeSort]);

  // --- CAMERA HANDLERS (Simplified for brevity) ---
  const startCamera = async () => { /* ... same as before ... */ };
  const stopCamera = () => { /* ... same as before ... */ };
  const toggleImageSearch = () => { setIsImageSearchOpen(!isImageSearchOpen); };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... same as before ... */ };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${query}`); }} className="relative flex items-center mb-4">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-14 text-sm outline-none focus:ring-2 focus:ring-black/5" />
            <button type="button" onClick={() => setIsImageSearchOpen(true)} className="absolute right-3 p-2 bg-white rounded-full text-gray-500 hover:text-indigo-600"><Camera size={18} /></button>
          </form>
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
             <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
               {['Best Match', 'Newest', 'Price'].map(s => <button key={s} onClick={() => setActiveSort(s)} className={`px-4 py-1.5 text-xs font-semibold rounded-md ${activeSort === s ? 'bg-white shadow text-black' : 'text-gray-500'}`}>{s}</button>)}
             </div>
             <div className="flex gap-2 w-full sm:w-auto justify-end">
               <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-full text-xs font-bold"><SlidersHorizontal size={14}/> Filters</button>
             </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {isLoading ? <div className="flex justify-center py-32"><Loader2 className="animate-spin text-gray-400 w-10 h-10"/></div> : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500"><b>{products.length}</b> results</p>
              <div className="hidden sm:flex bg-white border rounded-lg p-1">
                 <button onClick={() => setLayout('grid')} className={`p-1.5 rounded ${layout === 'grid' ? 'bg-gray-100 text-black' : 'text-gray-400'}`}><Grid size={18}/></button>
                 <button onClick={() => setLayout('list')} className={`p-1.5 rounded ${layout === 'list' ? 'bg-gray-100 text-black' : 'text-gray-400'}`}><List size={18}/></button>
              </div>
            </div>
            
            {products.length === 0 ? (
                <div className="text-center py-32 text-gray-400">No products found.</div>
            ) : (
                // Responsive Grid: 1 col mobile, 2 col sm, 3 col md, 4 col lg
                <div className={`grid gap-4 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                  {products.map((product) => (
                    // [UPDATED] Using the reusable card
                    <ProductCard key={product.id} product={product} layout={layout} />
                  ))}
                </div>
            )}
          </>
        )}
      </div>

      {/* Filter Modal & Image Search Overlay (Existing Code) */}
      {isFilterOpen && (
         <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => setIsFilterOpen(false)}>
            <div className="bg-white w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between mb-4"><h2 className="font-bold">Filters</h2><button onClick={() => setIsFilterOpen(false)}><X/></button></div>
               {/* Simplified Filter Content */}
               <div className="space-y-4">
                  <div><p className="text-sm font-bold mb-2">Price Range</p><div className="flex gap-2"><input type="number" className="border p-2 w-1/2 rounded" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} /><input type="number" className="border p-2 w-1/2 rounded" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} /></div></div>
                  <button onClick={() => setIsFilterOpen(false)} className="w-full bg-black text-white py-3 rounded-lg font-bold">Apply</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}