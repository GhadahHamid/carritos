"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export function Header() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-[#0A2647] sticky top-0 z-50 shadow-md">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <img src="/logo.png" alt="Carritos Mini Market" className="h-12 md:h-16 object-contain" />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-semibold text-white text-[15px]">
          <Link href="/" className="hover:text-[#F97316] transition-colors pb-1">Home</Link>
          <Link href="/categories" className="hover:text-[#F97316] transition-colors pb-1">Categories</Link>
          <Link href="/contact" className="hover:text-[#F97316] transition-colors pb-1">Contact Us</Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-[400px] relative">
          <input 
            type="text" 
            placeholder="Search for products..." 
            className="w-full bg-white text-gray-800 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 shrink-0">
          
          {/* AUTH LOGIC HERE */}
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-white text-sm font-bold hidden md:block">
                Hi, {session.user?.name?.split(' ')[0] || "User"}
              </span>
              <button 
                onClick={() => signOut()} 
                className="text-white hover:text-[#F97316] transition text-sm font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-white hover:text-[#F97316] transition flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-bold hidden md:block">Login</span>
            </Link>
          )}
          
          {/* Cart Icon */}
          <Link href="/cart" className="relative text-[#F97316] hover:text-orange-400 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0A2647]">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}