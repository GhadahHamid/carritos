"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MaintenancePage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = () => {
    setLoading(true);
    fetch("/api/admin/maintenance")
      .then(res => res.json())
      .then(data => { setIssues(data); setLoading(false); });
  };

  useEffect(() => { fetchIssues(); }, []);

  // If you want a quick fix button for LBP conversion:
  const handleConvertPrice = async (id: string, currentPrice: number) => {
    const newPrice = Math.round((currentPrice / 89000) * 100) / 100;
    await fetch(`/api/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: newPrice })
    });
    fetchIssues();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E3A8A] mb-2">Inventory Maintenance</h1>
        <p className="text-gray-500">Fix prices and images. Items here are hidden from clients until fixed.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold uppercase">Product</th>
              <th className="p-4 font-bold uppercase">Issue</th>
              <th className="p-4 font-bold uppercase">Current Price</th>
              <th className="p-4 font-bold uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {issues.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                
                {/* Product Name */}
                <td className="p-4 font-bold text-[#1E3A8A] text-sm max-w-[200px] truncate">{item.name}</td>
                
                {/* Issue Badge */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.issue === "Price in LBP" ? "bg-orange-100 text-orange-700" :
                    item.issue === "No Image" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {item.issue}
                  </span>
                </td>

                {/* Current Price */}
                <td className="p-4">
                  <span className="text-sm font-bold text-[#F97316]">${item.price.toFixed(2)}</span>
                  {item.issue === "Price in LBP" && (
                    <button onClick={() => handleConvertPrice(item.id, item.price)} className="ml-3 bg-[#F97316] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-orange-600">
                      Convert to $
                    </button>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="p-4 text-right">
                  <Link href={`/admin/inventory/edit/${item.id}`} className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-900 transition">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {issues.length === 0 && !loading && (
          <div className="p-12 text-center">
            <span className="text-4xl mb-4 block">🎉</span>
            <p className="text-green-600 font-bold text-lg">All items look great! No maintenance needed.</p>
          </div>
        )}
      </div>
    </div>
  );
}