import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E3A8A] text-white flex flex-col shadow-xl z-10 sticky top-0 h-screen">
        <div className="p-6 border-b border-blue-800">
          <Link href="/" className="text-2xl font-extrabold text-white">
            Carritos<span className="text-[#F97316]">.</span>
          </Link>
          <p className="text-[10px] text-blue-200 mt-1 uppercase tracking-wider font-bold">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-blue-800 font-medium text-sm text-blue-100 transition">
            Dashboard
          </Link>
          <Link href="/admin/purchases" className="block px-4 py-3 rounded-lg hover:bg-blue-800 font-medium text-sm text-blue-100 transition">
            Supplier Receipts (Add Stock)
          </Link>
          <Link href="/admin/suppliers" className="block px-4 py-3 rounded-lg hover:bg-blue-800 font-medium text-sm text-blue-100 transition">
            Suppliers & Receipts
          </Link>
          <Link href="/admin/purchases" className="block px-4 py-3 rounded-lg hover:bg-blue-800 font-medium text-sm text-blue-100 transition">
            Add New Receipt
          </Link>
          <Link href="/admin/inventory" className="block px-4 py-3 rounded-lg hover:bg-blue-800 font-medium text-sm text-blue-100 transition">
            Manage Inventory
          </Link>
          <Link href="/admin/categories" className="block px-4 py-3 rounded-lg hover:bg-blue-800 font-medium text-sm text-blue-100 transition">
            Manage Categories
          </Link>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <Link href="/" className="block text-center px-4 py-2 rounded-lg bg-white text-[#1E3A8A] font-bold text-sm hover:bg-gray-100 transition">
            View Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}