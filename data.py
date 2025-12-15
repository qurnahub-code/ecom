// Inside src/app/page.tsx

{products.map((product) => (
  // WRAP THE CARD IN A LINK
  <Link href={`/products/${product.id}`} key={product.id} className="group">
    
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
      {/* ... keep your existing card design here ... */}
    </div>

  </Link>
))}