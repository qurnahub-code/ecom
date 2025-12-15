// src/app/admin/products/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Trash2, Edit } from "lucide-react"
import { deleteProduct } from "@/modules/admin/actions"

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold border-b">Product Name</th>
              <th className="px-6 py-4 font-semibold border-b">Category</th>
              <th className="px-6 py-4 font-semibold border-b">Price</th>
              <th className="px-6 py-4 font-semibold border-b">Stock</th>
              <th className="px-6 py-4 font-semibold border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.stock} units
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <form action={async () => {
                    "use server"
                    await deleteProduct(product.id)
                  }}>
                    <button className="text-red-500 hover:bg-red-50 p-2 rounded-md transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}