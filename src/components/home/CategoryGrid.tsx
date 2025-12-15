import Link from "next/link"
import { Smartphone, Shirt, Home, BookOpen, Watch } from "lucide-react"

const CATEGORIES = [
  { name: "Electronics", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { name: "Clothing", icon: Shirt, color: "bg-pink-100 text-pink-600" },
  { name: "Home", icon: Home, color: "bg-green-100 text-green-600" },
  { name: "Books", icon: BookOpen, color: "bg-amber-100 text-amber-600" },
  { name: "Accessories", icon: Watch, color: "bg-purple-100 text-purple-600" },
]

export function CategoryGrid() {
  return (
    <section className="py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.name} 
              href={`/search?q=${cat.name}`}
              className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${cat.color}`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-black">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}