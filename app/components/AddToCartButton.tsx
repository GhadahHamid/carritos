"use client";

import { useCart } from "@/lib/CartContext";
import { useState } from "react";

export function AddToCartButton({ product }: { product: { id: string, name: string, price: number } }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // Add the product 'quantity' times
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    // Show the "Added" success state briefly
    setAdded(true);
    setQuantity(1); // Reset quantity back to 1
    setTimeout(() => setAdded(false), 1500); 
  };

  if (added) {
    return (
      <button 
        className="w-full bg-green-500 text-white py-2 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        Added to Cart
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-auto w-full">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-100">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white rounded-md shadow-sm font-bold"
        >
          -
        </button>
        <span className="text-sm font-bold text-gray-800">{quantity}</span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white rounded-md shadow-sm font-bold"
        >
          +
        </button>
      </div>

      {/* Add Button */}
      <button 
        onClick={handleAdd}
        className="w-full bg-[#F97316] text-white py-2 rounded-lg text-[13px] font-bold hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        Add to Cart
      </button>
    </div>
  );
}