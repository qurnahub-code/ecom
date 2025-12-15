// src/app/page.tsx
import Link from "next/link"
import { getFeaturedProducts } from "@/modules/products/product.service"
import { TickerBar } from "@/components/layout/TickerBar"
import { Hero } from "@/components/home/Hero"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { ProductCard } from "@/components/products/ProductCard" // Import

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <main className="min-h-screen bg-gray-50">
      <TickerBar />
      <Hero />
      <CategoryGrid />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
            <p className="text-gray-500 mt-2">Handpicked items just for you.</p>
          </div>
          <Link href="/search" className="text-indigo-600 font-semibold hover:underline">
            View all products →
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}