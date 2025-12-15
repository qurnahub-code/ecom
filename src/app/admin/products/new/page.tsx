// src/app/admin/products/new/page.tsx
"use client" // <--- Now a Client Component to handle state

import { createProduct } from "@/modules/admin/actions"
import Link from "next/link"
import { ChevronLeft, Save, Upload, X, Image as ImageIcon } from "lucide-react"
import { useState, useRef } from "react"

export default function NewProductPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Function to handle when a user selects a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a fake URL just for previewing
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Function to trigger the hidden file input
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Function to remove the selected image
  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation() // Stop the click from triggering the file input
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Reset the actual input
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-black flex items-center gap-1 text-sm mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <form action={createProduct} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        
        {/* IMAGE UPLOAD SECTION (SMART PREVIEW) */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
           
           <div 
             onClick={triggerFileInput}
             className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer relative overflow-hidden group ${previewUrl ? 'border-indigo-500 h-64' : 'border-gray-300 hover:bg-gray-50 h-40'}`}
           >
              {/* HIDDEN INPUT */}
              <input 
                ref={fileInputRef}
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden" // We hide the ugly default input
              />

              {previewUrl ? (
                // STATE 1: Image is Selected (Show Preview)
                <div className="w-full h-full relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                    <button type="button" className="text-white flex items-center gap-2 font-medium hover:underline">
                      <Upload className="w-4 h-4" /> Change Photo
                    </button>
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                // STATE 2: No Image (Show Upload Prompt)
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="bg-gray-100 p-3 rounded-full">
                        <Upload className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-900">Click to upload image</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                </div>
              )}
           </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <input name="name" required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="e.g. Premium Leather Bag" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input name="price" required type="number" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="99.00" />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
            <input name="stock" required type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="100" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select name="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white">
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="Product details..."></textarea>
        </div>

        <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save Product
        </button>

      </form>
    </div>
  )
}