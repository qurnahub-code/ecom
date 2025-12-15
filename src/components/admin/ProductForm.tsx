"use client"

import { useState, useRef } from "react"
import { Save, Upload, X, ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createProduct, updateProduct } from "@/modules/admin/actions"

interface ProductFormProps {
  initialData?: any // If present, we are in EDIT mode
}

export function ProductForm({ initialData }: ProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditMode = !!initialData

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-black flex items-center gap-1 text-sm mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? `Edit: ${initialData.name}` : "Add New Product"}
        </h1>
      </div>

      <form 
        action={isEditMode ? updateProduct : createProduct} 
        onSubmit={() => setIsSubmitting(true)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {isEditMode && <input type="hidden" name="id" value={initialData.id} />}

        {/* LEFT COL: Image */}
        <div className="lg:col-span-1">
          <div 
             onClick={() => fileInputRef.current?.click()}
             className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition relative overflow-hidden bg-white ${previewUrl ? 'border-indigo-500 h-80' : 'border-gray-300 h-64 hover:bg-gray-50'}`}
           >
              <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
              
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                    <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4"/> Change Image</p>
                  </div>
                </>
              ) : (
                <div className="text-gray-400">
                    <Upload className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm font-medium">Upload Image</p>
                </div>
              )}
           </div>
        </div>

        {/* RIGHT COL: Details */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
              <input name="name" defaultValue={initialData?.name} required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
              <input name="price" type="number" step="0.01" defaultValue={initialData ? Number(initialData.price) : ''} required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
              <input name="stock" type="number" defaultValue={initialData?.stock} required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <select name="category" defaultValue={initialData?.category} className="w-full border p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black">
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
                <option value="Books">Books</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vendor</label>
              <input name="vendor" defaultValue={initialData?.vendor} placeholder="Vendor Name" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Barcode / UID</label>
              <input name="barcode" defaultValue={initialData?.barcode} placeholder="Scan or type barcode..." className="w-full border p-2 rounded-lg font-mono text-sm" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea name="description" rows={4} defaultValue={initialData?.description} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEditMode ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}