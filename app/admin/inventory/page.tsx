"use client";

import { useState, useEffect } from "react";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState("10");

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  // Update Price/Stock Inline
  const handleUpdate = async (id: string, field: string, value: string) => {
    await fetch(`/api/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: parseFloat(value) }),
    });
    fetchProducts();
  };

  // Apply Global Percentage
  const applyGlobalMarkup = async () => {
    if (!confirm(`Increase all selling prices by ${percent}%?`)) return;
    await fetch("/api/inventory/markup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ percent: parseFloat(percent) }),
    });
    fetchProducts();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E3A8A]">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Edit prices, stock, and manage products.</p>
        </div>
        
        {/* Global Markup Tool */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-end gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Add % to all prices</label>
            <input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className="w-24 border rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={applyGlobalMarkup} className="bg-[#F97316] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition">
            Apply
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs border-b border-gray-200">
              <th className="p-4 font-bold">Product</th>
              <th className="p-4 font-bold">Barcode</th>
              <th className="p-4 font-bold">Cost ($)</th>
              <th className="p-4 font-bold">Price ($)</th>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold text-[#1E3A8A] text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category?.name}</p>
                </td>
                <td className="p-4 text-xs font-mono text-gray-500">{product.barcode || "N/A"}</td>
                <td className="p-4 text-sm font-bold text-gray-500">${(product.costPrice || 0).toFixed(2)}</td>
                <td className="p-4">
                  <input 
                    type="number" 
                    defaultValue={product.price} 
                    onBlur={(e) => handleUpdate(product.id, "price", e.target.value)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm font-bold text-[#F97316] focus:outline-none" 
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    defaultValue={product.stock} 
                    onBlur={(e) => handleUpdate(product.id, "stock", e.target.value)}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none" 
                  />
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-8 text-center text-gray-500">Loading inventory...</p>}
        {!loading && products.length === 0 && <p className="p-8 text-center text-gray-500">No products found. Add items via Supplier Receipt.</p>}
      </div>
    </div>
  );
}