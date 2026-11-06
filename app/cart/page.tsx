"use client";

import { useCart } from "@/lib/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, total } = useCart();

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16 pt-8">
      <div className="max-w-[1000px] mx-auto px-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[28px] font-extrabold text-[#1E3A8A]">Your Cart</h1>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-[#F97316] flex items-center gap-1 transition">
            &larr; Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-12 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <p className="text-gray-500 text-lg mb-6 font-medium">Your cart is currently empty.</p>
            <Link href="/" className="bg-[#F97316] text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Side: Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-[1.2rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-2xl">🛍️</span>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-[16px] font-bold text-[#1E3A8A] mb-1">{item.name}</h3>
                    <p className="text-sm text-[#F97316] font-bold mb-2">${item.price.toFixed(2)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => increaseQuantity(item.id)}
                        className="w-7 h-7 bg-[#FFF4EC] rounded-full flex items-center justify-center text-[#F97316] hover:bg-orange-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-[18px] font-extrabold text-[#1E3A8A]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[12px] text-red-500 hover:text-red-700 font-bold mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100 sticky top-24">
                <h2 className="text-[20px] font-bold text-[#1E3A8A] mb-4 border-b border-gray-100 pb-4">Order Summary</h2>
                
                <div className="flex justify-between mb-2 text-gray-600 font-medium text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-gray-600 font-medium text-sm">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between mb-6 border-t border-gray-100 pt-4">
                  <span className="text-lg font-bold text-[#1E3A8A]">Total</span>
                  <span className="text-[22px] font-extrabold text-[#F97316]">${total.toFixed(2)}</span>
                </div>
                
                <Link 
                  href="/checkout"
                  className="w-full bg-[#F97316] text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 flex justify-center items-center"
                >
                  Proceed to Checkout
                </Link>
                <button 
                  onClick={clearCart}
                  className="w-full mt-3 py-2 text-sm font-bold text-gray-400 hover:text-red-500 transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}