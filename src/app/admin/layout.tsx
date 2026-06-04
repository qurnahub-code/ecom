import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminNav from "@/components/admin/AdminNav" // [NEW] Import the component

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Protect Admin Routes
  if (session?.user?.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:block flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
        </div>
        
        {/* [NEW] Replaced static links with the dynamic component */}
        <AdminNav />
        
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}