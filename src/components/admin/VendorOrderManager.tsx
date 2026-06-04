"use client"

import { useState } from "react"
import { 
  Printer, ChevronDown, CheckSquare, Square, 
  Plus, UserPlus, MapPin, Phone, X, Save, Package, 
  Globe, CreditCard, User, FileText, Mail
} from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  stock: number
  vendor: string
  price: number
  barcode: string | null
  isLowStock: boolean
  suggestedOrder: number
}

interface VendorOrderManagerProps {
  initialData: Record<string, Product[]>
}

export default function VendorOrderManager({ initialData }: VendorOrderManagerProps) {
  // State for Selection & Ordering
  const [selectedVendor, setSelectedVendor] = useState<string>(Object.keys(initialData)[0] || "")
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({})
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  
  // State for Modals
  const [isPOModalOpen, setIsPOModalOpen] = useState(false)
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false)

  // State for "New Vendor" (Local Session)
  const [customVendors, setCustomVendors] = useState<string[]>([])
  
  // EXPANDED Vendor Form State
  const [newVendorForm, setNewVendorForm] = useState({ 
    name: "", 
    contactPerson: "",
    email: "", 
    phone: "", 
    address: "", 
    city: "",
    taxId: "",
    paymentTerms: "Net 30"
  })
  
  // State for Vendor Details (For Invoice)
  const [vendorDetails, setVendorDetails] = useState({
    address: "123 Market Street, Trading Zone",
    phone: "+92 300 1234567",
    email: "contact@vendor.com",
    taxId: "STRN-0000000",
    contactPerson: "Manager Name"
  })

  // --- ACTIONS ---

  const toggleProduct = (id: string, suggestedQty: number) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(id)) {
      newSelected.delete(id)
      const newQtys = { ...orderQuantities }
      delete newQtys[id]
      setOrderQuantities(newQtys)
    } else {
      newSelected.add(id)
      setOrderQuantities(prev => ({ ...prev, [id]: suggestedQty || 10 }))
    }
    setSelectedProducts(newSelected)
  }

  const updateQty = (id: string, qty: number) => {
    setOrderQuantities(prev => ({ ...prev, [id]: qty }))
  }

  const calculateTotal = () => {
    let total = 0
    selectedProducts.forEach(id => {
      const product = initialData[selectedVendor]?.find(p => p.id === id)
      const qty = orderQuantities[id] || 0
      if (product) total += product.price * qty
    })
    return total
  }

  // Handle Add Vendor (Detailed)
  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVendorForm.name) return

    // Add to local list
    setCustomVendors([...customVendors, newVendorForm.name])
    
    // Select this new vendor
    setSelectedVendor(newVendorForm.name)
    
    // Update invoice details automatically with detailed info
    setVendorDetails({
      address: `${newVendorForm.address}, ${newVendorForm.city}` || "Address Pending...",
      phone: newVendorForm.phone || "Phone Pending...",
      email: newVendorForm.email || "",
      taxId: newVendorForm.taxId || "N/A",
      contactPerson: newVendorForm.contactPerson || "N/A"
    })

    // Reset and Close
    setNewVendorForm({ 
      name: "", contactPerson: "", email: "", phone: "", 
      address: "", city: "", taxId: "", paymentTerms: "Net 30" 
    })
    setIsAddVendorModalOpen(false)
  }

  const currentProducts = initialData[selectedVendor] || []
  const allVendors = [...Object.keys(initialData), ...customVendors]

  return (
    <div className="space-y-6">
      
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        
        {/* Vendor Selector */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select 
              value={selectedVendor} 
              onChange={(e) => {
                setSelectedVendor(e.target.value)
                setSelectedProducts(new Set()) 
                setOrderQuantities({})
              }}
              className="appearance-none bg-background border border-border hover:border-primary rounded-lg pl-4 pr-10 py-2.5 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all min-w-[200px] cursor-pointer"
            >
              {allVendors.length === 0 && <option>No Vendors Found</option>}
              {allVendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* RGB ADD VENDOR BUTTON */}
          <button 
            onClick={() => setIsAddVendorModalOpen(true)}
            className="group relative inline-flex items-center justify-center p-[2px] rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.05] active:scale-[0.95]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-[spin_4s_linear_infinite]" />
            <span className="relative flex items-center gap-2 px-4 py-2 rounded-[10px] bg-zinc-900 text-white font-bold text-sm transition-all group-hover:bg-zinc-800">
               <UserPlus className="w-4 h-4" /> Add Vendor
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
           <div className="hidden sm:block px-4 py-2 bg-muted/50 rounded-lg border border-border text-sm font-mono">
              Est. Cost: <span className="font-bold text-foreground">${calculateTotal().toLocaleString()}</span>
           </div>
           <button 
             onClick={() => setIsPOModalOpen(true)}
             disabled={selectedProducts.size === 0}
             className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
           >
             <Printer className="w-4 h-4" /> Generate PO
           </button>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm min-h-[300px]">
        {currentProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
             <div className="p-4 bg-muted/50 rounded-full mb-4">
                <Package className="w-10 h-10 text-muted-foreground/50" />
             </div>
             <h3 className="text-lg font-semibold text-foreground">No products found for {selectedVendor}</h3>
             <p className="text-muted-foreground max-w-sm mt-1 mb-6">
               This vendor has no inventory items listed yet. Add products to generate a purchase order.
             </p>
             <Link 
               href="/admin/products/new" 
               className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition shadow-sm"
             >
               + Add Product for {selectedVendor}
             </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-semibold border-b border-border">
                <tr>
                  <th className="px-6 py-4 w-12">Select</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Unit Cost</th>
                  <th className="px-6 py-4 w-32">Order Qty</th>
                  <th className="px-6 py-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentProducts.map(product => {
                  const isSelected = selectedProducts.has(product.id)
                  const qty = orderQuantities[product.id] || 0
                  
                  return (
                    <tr key={product.id} className={`group transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleProduct(product.id, product.suggestedOrder)}
                          className={`text-muted-foreground hover:text-primary transition-colors ${isSelected ? 'text-primary' : ''}`}
                        >
                          {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">SKU: {product.id.slice(0,6).toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                          product.isLowStock 
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        }`}>
                          {product.stock} Units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">${product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                         <input 
                           type="number" 
                           disabled={!isSelected}
                           value={isSelected ? qty : ''}
                           placeholder={product.suggestedOrder.toString()}
                           onChange={(e) => updateQty(product.id, parseInt(e.target.value) || 0)}
                           className="w-24 bg-background border border-border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:bg-muted"
                         />
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        ${isSelected ? (product.price * qty).toLocaleString() : '0'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- EXPANDED ADD VENDOR MODAL --- */}
      {isAddVendorModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
           <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border p-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                 <div>
                    <h2 className="text-2xl font-bold text-foreground">Register New Vendor</h2>
                    <p className="text-sm text-muted-foreground">Add supply partner details for procurement.</p>
                 </div>
                 <button onClick={() => setIsAddVendorModalOpen(false)} className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition"><X className="w-6 h-6"/></button>
              </div>
              
              <form onSubmit={handleAddVendor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* 1. Basic Info */}
                 <div className="md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><User className="w-3 h-3"/> Company Name</label>
                    <input 
                      required
                      value={newVendorForm.name}
                      onChange={(e) => setNewVendorForm({...newVendorForm, name: e.target.value})}
                      placeholder="e.g. Global Tech Supplies Ltd."
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                 </div>

                 {/* 2. Contact Person */}
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><UserPlus className="w-3 h-3"/> Contact Person</label>
                    <input 
                      value={newVendorForm.contactPerson}
                      onChange={(e) => setNewVendorForm({...newVendorForm, contactPerson: e.target.value})}
                      placeholder="Manager Name"
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                 </div>

                 {/* 3. Tax ID */}
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><FileText className="w-3 h-3"/> Tax ID / NTN</label>
                    <input 
                      value={newVendorForm.taxId}
                      onChange={(e) => setNewVendorForm({...newVendorForm, taxId: e.target.value})}
                      placeholder="STRN-0000..."
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm"
                    />
                 </div>

                 {/* 4. Contact Details */}
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><Phone className="w-3 h-3"/> Phone Number</label>
                    <input 
                      value={newVendorForm.phone}
                      onChange={(e) => setNewVendorForm({...newVendorForm, phone: e.target.value})}
                      placeholder="+1 234 567 890"
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><Mail className="w-3 h-3"/> Email Address</label>
                    <input 
                      value={newVendorForm.email}
                      onChange={(e) => setNewVendorForm({...newVendorForm, email: e.target.value})}
                      placeholder="orders@vendor.com"
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                 </div>

                 {/* 5. Address */}
                 <div className="md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><MapPin className="w-3 h-3"/> Street Address</label>
                    <input 
                      value={newVendorForm.address}
                      onChange={(e) => setNewVendorForm({...newVendorForm, address: e.target.value})}
                      placeholder="123 Industrial Estate, Warehouse 4..."
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                 </div>

                 {/* 6. City & Terms */}
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><Globe className="w-3 h-3"/> City / Country</label>
                    <input 
                      value={newVendorForm.city}
                      onChange={(e) => setNewVendorForm({...newVendorForm, city: e.target.value})}
                      placeholder="Lahore, Pakistan"
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2"><CreditCard className="w-3 h-3"/> Payment Terms</label>
                    <select 
                      value={newVendorForm.paymentTerms}
                      onChange={(e) => setNewVendorForm({...newVendorForm, paymentTerms: e.target.value})}
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option>Net 30</option>
                      <option>Net 60</option>
                      <option>Due on Receipt</option>
                      <option>Advance Payment</option>
                    </select>
                 </div>

                 <div className="md:col-span-2 pt-6">
                   <button 
                     type="submit" 
                     className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-lg"
                   >
                     <Save className="w-5 h-5" /> Register Vendor & Start Order
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* --- INVOICE GENERATION MODAL (PRINT VIEW) --- */}
      {isPOModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white text-black w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-in zoom-in-95">
            <div className="sticky top-0 bg-zinc-100 border-b border-zinc-200 p-4 flex justify-between items-center print:hidden">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Printer className="w-5 h-5" /> Print Preview
              </h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-800">Print / Save PDF</button>
                <button onClick={() => setIsPOModalOpen(false)} className="bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-300">Close</button>
              </div>
            </div>

            <div className="p-12 print:p-0" id="invoice">
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight mb-2">PURCHASE ORDER</h1>
                  <p className="text-zinc-500 font-medium">PO #{Date.now().toString().slice(-6)}</p>
                  <p className="text-zinc-500 text-sm mt-1">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-xl mb-1">My Company Inc.</h3>
                  <p className="text-sm text-zinc-500">123 Business Road</p>
                  <p className="text-sm text-zinc-500">Lahore, Pakistan</p>
                </div>
              </div>

              {/* Vendor & Ship To */}
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Vendor Details</h4>
                  <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    <h3 className="font-bold text-lg text-black mb-1">{selectedVendor}</h3>
                    <div className="space-y-1 text-sm text-zinc-600">
                      <p><strong>Attn:</strong> {vendorDetails.contactPerson}</p>
                      <p>{vendorDetails.address}</p>
                      <p>Phone: {vendorDetails.phone}</p>
                      <p>Email: {vendorDetails.email}</p>
                      <p className="mt-2 text-xs text-zinc-400 font-mono">Tax ID: {vendorDetails.taxId}</p>
                    </div>
                  </div>
                </div>
                <div>
                   {/* Standard Ship To Block */}
                   <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Ship To</h4>
                   <div className="text-sm text-zinc-600 leading-relaxed">
                    <p className="font-bold text-black">Main Warehouse</p>
                    <p>45 Industrial Estate</p>
                    <p>Lahore, 54000</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left mb-8">
                <thead className="border-b-2 border-black">
                  <tr>
                    <th className="py-3 font-bold text-xs uppercase">Item</th>
                    <th className="py-3 font-bold text-xs uppercase text-center">Qty</th>
                    <th className="py-3 font-bold text-xs uppercase text-right">Unit Price</th>
                    <th className="py-3 font-bold text-xs uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {Array.from(selectedProducts).map(id => {
                    const product = currentProducts.find(p => p.id === id)
                    if (!product) return null
                    const qty = orderQuantities[id] || 0
                    return (
                      <tr key={id}>
                        <td className="py-4">
                          <p className="font-bold text-sm">{product.name}</p>
                          <p className="text-xs text-zinc-500">SKU: {product.id.slice(0,6)}</p>
                        </td>
                        <td className="py-4 text-center font-mono text-sm">{qty}</td>
                        <td className="py-4 text-right font-mono text-sm">${product.price.toLocaleString()}</td>
                        <td className="py-4 text-right font-bold font-mono text-sm">${(product.price * qty).toLocaleString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              
              <div className="flex justify-end border-t border-black pt-6">
                 <div className="flex justify-between w-64 pt-4">
                     <span className="text-lg font-bold">Total:</span>
                     <span className="text-lg font-bold bg-yellow-300 px-2">${calculateTotal().toLocaleString()}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #invoice, #invoice * { visibility: visible; }
          #invoice { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
        }
      `}</style>

    </div>
  )
}