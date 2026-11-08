"use client";
import { useSession } from "next-auth/react";

import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder } from "@/app/actions";
import Link from "next/link";



export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();

if (status === "loading") return <p>Loading...</p>;
if (status === "unauthenticated") {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Please sign in to checkout</h2>
      <Link href="/login" className="bg-[#F97316] text-white px-6 py-3 rounded-full font-bold">Sign In</Link>
    </div>
  );
}
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    region: "beirut",
    address: ""
  });

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all delivery details.");
      return;
    }
    
    setIsProcessing(true);
    const result = await createOrder(cart, formData);
    
    if (result.success) {
      clearCart();
      router.push(`/success?orderId=${result.orderId}`);
    } else {
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-8">
        <div className="bg-white p-10 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-[#1E3A8A] mb-4">Your cart is empty</h1>
          <button onClick={() => router.push("/")} className="bg-[#F97316] text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition w-full">
            Go to Homepage
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16 pt-8">
      <div className="max-w-[1000px] mx-auto px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-500 hover:text-[#F97316] transition">
            &larr;
          </Link>
          <h1 className="text-[28px] font-extrabold text-[#1E3A8A]">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] border border-gray-100">
              <h2 className="text-[18px] font-bold text-[#1E3A8A] mb-4">Delivery Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe" 
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" 
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 font-bold text-sm">
                      +961
                    </span>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="XX XXX XXX" 
                      className="flex-1 bg-[#F8F9FA] border border-gray-200 rounded-r-xl px-4 py-3 text-[15px] font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Delivery Region</label>
                  <select 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition cursor-pointer appearance-none"
                  >
                    <option value="beirut">Beirut (Standard Delivery Rate)</option>
                    <option value="mount-lebanon">Mount Lebanon (Adjusted Rate)</option>
                    <option value="north">North Lebanon (Adjusted Rate)</option>
                    <option value="south">South Lebanon (Adjusted Rate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Full Address</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Street, Building, Floor..." 
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] border border-gray-100">
              <h2 className="text-[18px] font-bold text-[#1E3A8A] mb-4">Payment Method</h2>
              <div className="bg-[#FFF4EC] border border-[#F97316]/30 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1E3A8A]">Cash on Delivery (Test Mode)</p>
                  <p className="text-xs text-gray-500 mt-1">Whish Pay integration will be added here later.</p>
                </div>
                <div className="w-6 h-6 bg-[#F97316] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] border border-gray-100 sticky top-24">
              <h2 className="text-[20px] font-bold text-[#1E3A8A] mb-4 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium truncate pr-2">{item.quantity}x {item.name}</span>
                    <span className="font-bold text-[#1E3A8A]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mb-6 border-t border-gray-100 pt-4">
                <span className="text-lg font-bold text-[#1E3A8A]">Total</span>
                <span className="text-[22px] font-extrabold text-[#F97316]">${total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-xl font-bold transition shadow-lg flex justify-center items-center ${
                  isProcessing ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#F97316] text-white hover:bg-orange-600 shadow-orange-500/30"
                }`}
              >
                {isProcessing ? "Processing..." : `Place Order`}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}