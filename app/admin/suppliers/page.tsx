"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Supplier = { id: string; name: string };
type Receipt = { id: string; totalCost: number; exchangeRate: number; createdAt: string };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Add Supplier State
  const [newSupplierName, setNewSupplierName] = useState("");

  // Fetch suppliers on load
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await fetch("/api/suppliers");
    const data = await res.json();
    setSuppliers(data);
  };

  // Fetch receipts when a supplier is clicked
  const handleSelectSupplier = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setLoading(true);
    const res = await fetch(`/api/suppliers/${supplier.id}/receipts`);
    const data = await res.json();
    setReceipts(data);
    setLoading(false);
  };

  // Add a new supplier
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName) return;
    
    await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSupplierName }),
    });
    
    setNewSupplierName("");
    fetchSuppliers();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E3A8A]">Suppliers & Receipts</h1>
          <p className="text-gray-500 mt-1">Manage suppliers and view their purchase history.</p>
        </div>
        <Link href="/admin/purchases" className="bg-[#F97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30">
          + Add New Receipt
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Supplier List & Add Form */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Add Supplier Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#1E3A8A] mb-4">Add Supplier</h2>
            <form onSubmit={handleAddSupplier} className="flex gap-2">
              <input
                type="text"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                placeholder="Supplier Name"
                required
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F97316]"
              />
              <button type="submit" className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-900 transition">
                Add
              </button>
            </form>
          </div>

          {/* Supplier List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-bold text-[#1E3A8A]">Your Suppliers</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {suppliers.map((sup) => (
                <button
                  key={sup.id}
                  onClick={() => handleSelectSupplier(sup)}
                  className={`w-full text-left p-4 hover:bg-orange-50 transition ${selectedSupplier?.id === sup.id ? "bg-[#FFF4EC] border-l-4 border-[#F97316]" : ""}`}
                >
                  <p className="font-bold text-gray-800">{sup.name}</p>
                </button>
              ))}
              {suppliers.length === 0 && <p className="p-4 text-sm text-gray-500">No suppliers yet. Add one above.</p>}
            </div>
          </div>
        </div>

        {/* Right Side: Receipt History */}
        <div className="md:col-span-2">
          {selectedSupplier ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-[#1E3A8A] text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{selectedSupplier.name} - Receipts</h2>
                  <p className="text-blue-200 text-sm mt-1">Total Historical Spent: ${receipts.reduce((sum, r) => sum + r.totalCost, 0).toFixed(2)}</p>
                </div>
              </div>
              
              {loading ? (
                <p className="p-8 text-center text-gray-500">Loading receipts...</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs border-b border-gray-200">
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Exchange Rate</th>
                      <th className="p-4 font-bold">Total Paid (USD)</th>
                      <th className="p-4 font-bold">Total Paid (LBP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {receipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-sm font-medium">
                          {new Date(receipt.createdAt).toLocaleDateString()} at {new Date(receipt.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-sm text-gray-500">{receipt.exchangeRate.toLocaleString()} L.L</td>
                        <td className="p-4 text-sm font-bold text-[#1E3A8A]">${receipt.totalCost.toFixed(2)}</td>
                        <td className="p-4 text-sm font-bold text-[#F97316]">{(receipt.totalCost * receipt.exchangeRate).toLocaleString()} L.L</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {receipts.length === 0 && !loading && (
                <p className="p-8 text-center text-gray-500">No receipts found for this supplier.</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="text-lg font-medium">Select a supplier on the left</p>
              <p className="text-sm mt-1">Click on a supplier to view their receipt history.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}