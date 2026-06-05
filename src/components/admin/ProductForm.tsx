"use client"

import { useState, useRef } from "react"
import { createProduct, updateProductDetails } from "@/app/actions/admin"
import Link from "next/link"
import { 
  ChevronLeft, Save, Upload, X, Image as ImageIcon, 
  Barcode, QrCode, Tag, DollarSign, Package, Truck, Layers,
  ChevronDown, ChevronUp, UserPlus, MapPin, Phone, Mail, FileText, Globe, User
} from "lucide-react"

interface ProductFormProps {
  initialData?: any
}

export function ProductForm({ initialData }: ProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditing = !!initialData
  
  // Toggle State for Organization Section (Open by default)
  const [showOrgSection, setShowOrgSection] = useState(true)
  
  // Vendor Modal State
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false)
  
  // Form State for Vendor Input (Auto-fill)
  const [vendorName, setVendorName] = useState(initialData?.vendor || "")

  // New Vendor Form State
  const [newVendorForm, setNewVendorForm] = useState({ 
    name: "", contactPerson: "", email: "", phone: "", 
    address: "", city: "", taxId: "", paymentTerms: "Net 30" 
  })

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Handle Vendor Registration from Modal
  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVendorForm.name) return

    // 1. Auto-fill the main Product Form "Vendor" field
    setVendorName(newVendorForm.name)

    // 2. In a real app with a separate Vendor table, you would POST this data here.
    // For now, we simulate success and close the modal.
    // console.log("New Vendor Details Registered:", newVendorForm)

    setIsVendorModalOpen(false)
    
    // Reset form
    setNewVendorForm({ 
      name: "", contactPerson: "", email: "", phone: "", 
      address: "", city: "", taxId: "", paymentTerms: "Net 30" 
    })
  }

  // Determine Action
  const handleSubmit = isEditing ? updateProductDetails : createProduct

  return (
    <div className="max-w-5xl mx-auto pb-24">
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <Link 
          href="/admin/products" 
          className="w-fit flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-muted"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {isEditing ? `Edit: ${initialData.name}` : "Add New Product"}
        </h1>
      </div>

      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isEditing && <input type="hidden" name="id" value={initialData.id} />}
        
        {/* --- LEFT COLUMN (2/3) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. IDENTITY CARD */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Package className="w-32 h-32 text-primary" />
             </div>
             <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
               <Package className="w-5 h-5 text-primary" /> Identity & Tracking
             </h2>
             <div className="space-y-6">
               <div>
                 <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Product Name</label>
                 <input name="name" defaultValue={initialData?.name} required placeholder="e.g. Wireless Headphones" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">SKU</label>
                     <div className="relative">
                       <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <input name="sku" defaultValue={initialData?.sku} placeholder="PROD-001" className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Brand</label>
                     <input name="brand" defaultValue={initialData?.brand} placeholder="e.g. Sony" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Barcode</label>
                      <div className="relative">
                         <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                         <input name="barcode" defaultValue={initialData?.barcode} placeholder="Scan code..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:border-primary outline-none" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">QR Code ID</label>
                      <div className="relative">
                         <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                         <input name="qrCode" defaultValue={initialData?.qrCode} placeholder="Internal ID..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground font-mono text-sm focus:border-primary outline-none" />
                      </div>
                   </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Description</label>
                 <textarea name="description" defaultValue={initialData?.description} rows={4} className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-y" placeholder="Product details..."></textarea>
               </div>
             </div>
          </div>

          {/* 2. PRICING & INVENTORY */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
             <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
               <DollarSign className="w-5 h-5 text-primary" /> Pricing & Inventory
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Selling Price</label>
                   <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rs.</span>
                       <input name="price" defaultValue={initialData?.price} type="number" step="0.01" required className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Cost Price</label>
                   <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rs.</span>
                       <input name="costPrice" defaultValue={initialData?.costPrice} type="number" step="0.01" className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Tax Rate (%)</label>
                   <input name="taxRate" defaultValue={initialData?.taxRate !== null && initialData?.taxRate !== undefined ? initialData.taxRate : ""} type="number" placeholder="0" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
             </div>
             
             <div className="w-full h-px bg-border my-6"></div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Stock</label>
                   <input name="stock" defaultValue={initialData?.stock} type="number" required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Low Stock Alert</label>
                   <input name="minStock" defaultValue={initialData?.minStock !== null && initialData?.minStock !== undefined ? initialData.minStock : 10} type="number" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Unit Type</label>
                   <select name="unit" defaultValue={initialData?.unit || "pcs"} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="box">Box</option>
                      <option value="ltr">Liter (ltr)</option>
                   </select>
                </div>
             </div>
          </div>

          {/* 3. AFFILIATE / DROP-SHIPPING DETAILS */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
             <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
               <Globe className="w-5 h-5 text-primary" /> Affiliate / Drop-Shipping
             </h2>
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <input 
                     type="checkbox" 
                     id="isAffiliate" 
                     name="isAffiliate" 
                     defaultChecked={initialData?.isAffiliate}
                     className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                   />
                   <label htmlFor="isAffiliate" className="text-sm font-bold text-foreground cursor-pointer select-none">
                     This is an Affiliate / Drop-shipped Product
                   </label>
                </div>
                <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Supplier / Affiliate Link</label>
                   <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        name="affiliateLink" 
                        defaultValue={initialData?.affiliateLink || ""} 
                        type="url" 
                        placeholder="https://amazon.com/dp/B0..." 
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                      />
                   </div>
                   <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">
                     Provide the link to the product on the supplier's website for easy order fulfillment.
                   </p>
                </div>
             </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN (1/3) --- */}
        <div className="space-y-6">
          
          {/* 3. MEDIA UPLOAD */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
             <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
               <ImageIcon className="w-5 h-5 text-primary" /> Image
             </h2>
             <div 
               onClick={triggerFileInput}
               className={`relative w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all group ${previewUrl ? 'border-primary bg-background' : 'border-border hover:border-primary/50 bg-muted/10'}`}
             >
                <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Click to upload</p>
                  </div>
                )}
             </div>
          </div>

          {/* 4. COLLAPSIBLE ORGANIZATION SECTION */}
          <div className="border border-border rounded-2xl bg-card overflow-hidden transition-all duration-300">
             
             {/* Toggle Button */}
             <button 
               type="button"
               onClick={() => setShowOrgSection(!showOrgSection)}
               className="w-full flex items-center justify-between p-5 bg-card hover:bg-muted/30 transition-colors"
             >
               <div className="flex items-center gap-2 text-foreground font-bold">
                 <Layers className="w-5 h-5 text-primary" /> 
                 Organization
               </div>
               {showOrgSection ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
             </button>

             {/* Collapsible Content */}
             {showOrgSection && (
               <div className="p-6 pt-0 space-y-6 border-t border-border animate-in slide-in-from-top-2">
                 <div className="pt-4">
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Category</label>
                    <select name="category" defaultValue={initialData?.category} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                       <option value="Audio">Audio</option>
                       <option value="Keyboards">Keyboards</option>
                       <option value="Mice">Mice</option>
                       <option value="Monitors">Monitors</option>
                       <option value="Accessories">Accessories</option>
                    </select>
                 </div>

                 {/* Country of Origin */}
                 <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Country of Origin</label>
                   <select name="origin" defaultValue={initialData?.origin || "Local"} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                      <option value="Local">Local</option>
                      <option value="Imported">Imported</option>
                   </select>
                 </div>

                 {/* Expiry Date */}
                 <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Expiry Date</label>
                   <input 
                     name="expiryDate" 
                     type="date" 
                     defaultValue={initialData?.expiryDate || ""} 
                     className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                   />
                 </div>

                 {/* Vendor Field with Add Button */}
                 <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Supplier / Vendor</label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          name="vendor" 
                          value={vendorName}
                          onChange={(e) => setVendorName(e.target.value)}
                          placeholder="Search or add vendor..." 
                          className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                        />
                     </div>
                     <button 
                       type="button" 
                       onClick={() => setIsVendorModalOpen(true)}
                       className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition"
                       title="Register New Vendor Details"
                     >
                       <UserPlus className="w-5 h-5" />
                     </button>
                   </div>
                   <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">
                     Click <span className="font-bold text-primary">+</span> to register detailed vendor info (Tax ID, Address).
                   </p>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Tags</label>
                   <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input name="tags" defaultValue={initialData?.tags} placeholder="Summer, Sale" className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                   </div>
                 </div>
               </div>
             )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
             <button 
               type="submit" 
               className="group relative inline-flex items-center justify-center p-[2px] rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full"
             >
               <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-[spin_4s_linear_infinite]" />
               <span className="relative w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-[10px] bg-zinc-900 text-white font-bold transition-all group-hover:bg-zinc-800">
                  <Save className="w-4 h-4" /> {isEditing ? "Save Changes" : "Create Product"}
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

      {/* --- ADD VENDOR MODAL --- */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
           <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border p-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                 <div>
                    <h2 className="text-2xl font-bold text-foreground">Register New Vendor</h2>
                    <p className="text-sm text-muted-foreground">Add details to auto-fill future POs.</p>
                 </div>
                 <button type="button" onClick={() => setIsVendorModalOpen(false)} className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition"><X className="w-6 h-6"/></button>
              </div>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><User className="w-3 h-3"/> Company Name</label>
                    <input required value={newVendorForm.name} onChange={(e) => setNewVendorForm({...newVendorForm, name: e.target.value})} placeholder="Global Tech Supplies" className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><UserPlus className="w-3 h-3"/> Contact Person</label>
                    <input value={newVendorForm.contactPerson} onChange={(e) => setNewVendorForm({...newVendorForm, contactPerson: e.target.value})} placeholder="Manager Name" className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><FileText className="w-3 h-3"/> Tax ID / NTN</label>
                    <input value={newVendorForm.taxId} onChange={(e) => setNewVendorForm({...newVendorForm, taxId: e.target.value})} placeholder="STRN-000..." className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><Phone className="w-3 h-3"/> Phone</label>
                    <input value={newVendorForm.phone} onChange={(e) => setNewVendorForm({...newVendorForm, phone: e.target.value})} placeholder="+1 234..." className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><Mail className="w-3 h-3"/> Email</label>
                    <input value={newVendorForm.email} onChange={(e) => setNewVendorForm({...newVendorForm, email: e.target.value})} placeholder="info@vendor.com" className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                 </div>
                 <div className="md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><MapPin className="w-3 h-3"/> Address</label>
                    <input value={newVendorForm.address} onChange={(e) => setNewVendorForm({...newVendorForm, address: e.target.value})} placeholder="Warehouse Address..." className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                 </div>
                 
                 <div className="md:col-span-2 pt-4">
                   <button 
                     type="button" 
                     onClick={handleSaveVendor}
                     className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                   >
                     <Save className="w-5 h-5" /> Confirm & Use Vendor
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  )
}