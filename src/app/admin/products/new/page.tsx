"use client"

import { createProduct } from "@/modules/admin/actions"
import Link from "next/link"
import { 
  ChevronLeft, Save, Upload, X, Image as ImageIcon, 
  Barcode, QrCode, Tag, DollarSign, Package, Truck, Layers 
} from "lucide-react"
import { useState, useRef } from "react"

export default function NewProductPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <Link 
          href="/admin/products" 
          className="w-fit flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-muted"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Add New Product
        </h1>
        <p className="text-muted-foreground text-sm">Enter detailed specifications, tracking codes, and inventory settings.</p>
      </div>

      <form action={createProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (2/3 width) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. PRODUCT IDENTITY (SKU / Barcode) */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Barcode className="w-32 h-32 text-primary" />
             </div>
             
             <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
               <Package className="w-5 h-5 text-primary" /> Identity & Tracking
             </h2>

             <div className="space-y-6">
               {/* Name */}
               <div>
                 <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Product Name</label>
                 <input name="name" required placeholder="e.g. Wireless Noise Cancelling Headphones" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SKU */}
                  <div>
                     <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">SKU</label>
                     <div className="relative">
                       <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <input name="sku" placeholder="PROD-001" className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                     </div>
                  </div>
                  {/* Brand */}
                  <div>
                     <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Brand</label>
                     <input name="brand" placeholder="e.g. Sony" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
               </div>

               {/* Codes Container */}
               <div className="p-5 bg-muted/20 border border-border rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-foreground uppercase flex items-center gap-2 mb-2">
                    Scanning Codes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Barcode (UPC/EAN)</label>
                        <div className="relative">
                           <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                           <input name="barcode" placeholder="Scan code..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:border-primary outline-none" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">QR Code ID</label>
                        <div className="relative">
                           <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                           <input name="qrCode" placeholder="Internal ID..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:border-primary outline-none" />
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Description */}
               <div>
                 <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Description</label>
                 <textarea name="description" required rows={5} className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-y transition-all" placeholder="Detailed product description..."></textarea>
               </div>
             </div>
          </div>

          {/* 2. PRICING & INVENTORY */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
             <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
               <DollarSign className="w-5 h-5 text-primary" /> Pricing & Inventory
             </h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Selling Price */}
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Selling Price</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <input name="price" type="number" step="0.01" required className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-foreground font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="0.00" />
                   </div>
                </div>
                
                {/* Cost Price */}
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Cost Price</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <input name="costPrice" type="number" step="0.01" className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="0.00" />
                   </div>
                </div>
                
                {/* Tax Rate */}
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Tax Rate (%)</label>
                   <input name="taxRate" type="number" placeholder="0" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
             </div>

             <div className="w-full h-px bg-border my-6"></div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stock */}
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Initial Stock</label>
                   <input name="stock" type="number" required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="0" />
                </div>
                
                {/* Low Stock Alert */}
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Low Stock Alert</label>
                   <input name="minStock" type="number" defaultValue={10} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>

                {/* Unit */}
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Unit Type</label>
                   <select name="unit" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="box">Box</option>
                      <option value="ltr">Liter (ltr)</option>
                   </select>
                </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (1/3 width) --- */}
        <div className="space-y-8">
          
          {/* 3. MEDIA UPLOAD */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
             <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
               <ImageIcon className="w-5 h-5 text-primary" /> Product Image
             </h2>
             
             <div 
               onClick={triggerFileInput}
               className={`
                 relative w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all group
                 ${previewUrl ? 'border-primary bg-background' : 'border-border hover:border-primary/50 hover:bg-muted/30 bg-muted/10'}
               `}
             >
                <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />

                {previewUrl ? (
                  <div className="w-full h-full relative animate-in fade-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                       <span className="text-white text-xs font-medium">Change Image</span>
                       <button type="button" onClick={removeImage} className="bg-white/20 p-2 rounded-full text-white hover:bg-red-500 hover:text-white transition"><X size={16}/></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                    <div className="p-3 bg-background rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 border border-border mb-3">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB (PNG/JPG)</p>
                  </div>
                )}
             </div>
          </div>

          {/* 4. ORGANIZATION */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
             <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
               <Layers className="w-5 h-5 text-primary" /> Organization
             </h2>
             
             {/* Category */}
             <div>
               <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Category</label>
               <select name="category" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sports">Sports</option>
               </select>
             </div>

             {/* Supplier */}
             <div>
               <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Supplier / Vendor</label>
               <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input name="vendor" placeholder="Vendor Name..." className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
               </div>
             </div>

             {/* Tags */}
             <div>
               <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Tags</label>
               <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input name="tags" placeholder="e.g. Summer, Sale" className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
               </div>
             </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 flex flex-col gap-3">
             {/* RGB Button */}
             <button 
               type="submit" 
               className="group relative inline-flex items-center justify-center p-[2px] rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full"
             >
               <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-[spin_4s_linear_infinite]" />
               <span className="relative w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-[10px] bg-zinc-900 text-white font-bold transition-all group-hover:bg-zinc-800">
                  <Save className="w-4 h-4" /> Save Product
               </span>
             </button>
            
            <Link 
              href="/admin/products" 
              className="w-full py-3.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-center transition-colors"
            >
              Cancel
            </Link>
          </div>

        </div>
      </form>
    </div>
  )
}