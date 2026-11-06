"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ReceiptItem = {
  id: string;
  barcode: string;
  name: string;
  categoryId: string;
  boxPrice: number;
  itemsPerBox: number;
  currency: "USD" | "LBP";
  costPerItemUSD: number;
  sellingPriceUSD: number;
};

export default function PurchasePage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<{id: string, name: string}[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  
  // Receipt Header State
  const [supplierId, setSupplierId] = useState("");
  const [exchangeRate, setExchangeRate] = useState("89000");
  const [hasTva, setHasTva] = useState(false);
  const [profitMargin, setProfitMargin] = useState("30");

  // Current Item Input State
  const [currentItem, setCurrentItem] = useState<Partial<ReceiptItem>>({
    barcode: "", name: "", categoryId: "", boxPrice: 0, itemsPerBox: 1, currency: "USD"
  });

  // Receipt Items State
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/suppliers").then(res => res.json()).then(data => setSuppliers(data)).catch(() => setSuppliers([]));
    fetch("/api/categories").then(res => res.json()).then(data => setCategories(data)).catch(() => setCategories([]));
  }, []);

  // --- MATH CALCULATOR ---
  const calculatePrices = (item: Partial<ReceiptItem>) => {
    let cost = item.boxPrice || 0;
    let qty = item.itemsPerBox || 1;
    let rate = parseFloat(exchangeRate) || 1;

    const costPerItem = cost / qty;
    
    let marginMultiplier = 1 + (parseFloat(profitMargin) / 100);
    let sellingPrice = costPerItem * marginMultiplier;

    if (hasTva) sellingPrice = sellingPrice * 1.11;

    let finalCostUSD = costPerItem;
    let finalSellingUSD = sellingPrice;

    if (item.currency === "LBP") {
      finalCostUSD = costPerItem / rate;
      finalSellingUSD = sellingPrice / rate;
    }

    return { finalCostUSD, finalSellingUSD };
  };

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.categoryId || !currentItem.boxPrice) {
      alert("Please fill in name, category, and price.");
      return;
    }
    const { finalCostUSD, finalSellingUSD } = calculatePrices(currentItem);
    
    const newItem: ReceiptItem = {
      id: Math.random().toString(36).substr(2, 9),
      barcode: currentItem.barcode || "",
      name: currentItem.name!,
      categoryId: currentItem.categoryId!,
      boxPrice: currentItem.boxPrice!,
      itemsPerBox: currentItem.itemsPerBox || 1,
      currency: currentItem.currency as "USD" | "LBP",
      costPerItemUSD: finalCostUSD,
      sellingPriceUSD: finalSellingUSD,
    };

    setReceiptItems([...receiptItems, newItem]);
    setCurrentItem({ barcode: "", name: "", categoryId: "", boxPrice: 0, itemsPerBox: 1, currency: currentItem.currency });
  };

  const removeItem = (id: string) => {
    setReceiptItems(receiptItems.filter(item => item.id !== id));
  };

  // --- EDIT ITEM IN TABLE ---
  const updateItemInTable = (id: string, field: keyof ReceiptItem, value: number) => {
    setReceiptItems(receiptItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSaveReceipt = async () => {
    if (!supplierId || receiptItems.length === 0) {
      alert("Select a supplier and add at least one item.");
      return;
    }
    setLoading(true);

    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId,
        exchangeRate: parseFloat(exchangeRate),
        items: receiptItems,
      }),
    });

    if (res.ok) {
      alert("Receipt Saved! Inventory updated.");
      router.push("/admin/inventory");
      router.refresh();
    } else {
      alert("Error saving receipt.");
    }
    setLoading(false);
  };

  const totalCostUSD = receiptItems.reduce((sum, item) => sum + (item.costPerItemUSD * item.itemsPerBox), 0);
  const totalCostLBP = totalCostUSD * (parseFloat(exchangeRate) || 1);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E3A8A]">Supplier Receipt</h1>
        <p className="text-gray-500 mt-1">Scan items, set margins, and add them to inventory.</p>
      </div>

      <div className="space-y-6">
        
        {/* Global Receipt Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Supplier</label>
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-[#F97316]">
              <option value="">Select Supplier...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Exchange Rate (LBP)</label>
            <input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-[#F97316]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Global Profit Margin (%)</label>
            <input type="number" value={profitMargin} onChange={(e) => setProfitMargin(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-[#F97316]" />
          </div>
          <div className="flex items-center mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hasTva} onChange={(e) => setHasTva(e.target.checked)} className="w-5 h-5 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]" />
              <span className="text-sm font-bold text-gray-900">Add TVA (11%)</span>
            </label>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#1E3A8A] border-b pb-2 mb-4">Add Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-900 mb-1">Product Name</label>
              <input type="text" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Doritos" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Barcode</label>
              <input type="text" value={currentItem.barcode} onChange={e => setCurrentItem({...currentItem, barcode: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Scan..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Category</label>
              <select value={currentItem.categoryId} onChange={e => setCurrentItem({...currentItem, categoryId: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Box Price</label>
              <div className="flex">
                <select value={currentItem.currency} onChange={e => setCurrentItem({...currentItem, currency: e.target.value as "USD"|"LBP"})} className="border border-r-0 rounded-l-lg px-2 bg-gray-50 text-xs font-bold">
                  <option value="USD">$</option>
                  <option value="LBP">L.L</option>
                </select>
                <input type="number" value={currentItem.boxPrice} onChange={e => setCurrentItem({...currentItem, boxPrice: parseFloat(e.target.value)})} className="w-full border rounded-r-lg px-3 py-2 text-sm" placeholder="0.00" />
              </div>
            </div>
            <div className="flex gap-2">
               <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-900 mb-1">Items/Box</label>
                  <input type="number" value={currentItem.itemsPerBox} onChange={e => setCurrentItem({...currentItem, itemsPerBox: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" />
               </div>
               <button onClick={handleAddItem} className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-900 transition h-[38px]">
                 Add
               </button>
            </div>
          </div>
        </div>

        {/* Receipt Table (Now Editable!) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs border-b border-gray-200">
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Cost / Item ($)</th>
                <th className="p-4 font-bold">Selling Price ($)</th>
                <th className="p-4 font-bold">Qty (Items)</th>
                <th className="p-4 font-bold">Total Cost ($)</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {receiptItems.map((item, idx) => {
                const costLBP = item.costPerItemUSD * (parseFloat(exchangeRate) || 1);
                const sellLBP = item.sellingPriceUSD * (parseFloat(exchangeRate) || 1);
                return (
                  <tr key={item.id}>
                    <td className="p-4">
                      <p className="font-bold text-[#1E3A8A] text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.barcode}</p>
                    </td>
                    <td className="p-4">
                      <input 
                        type="number" step="0.01"
                        value={item.costPerItemUSD} 
                        onChange={(e) => updateItemInTable(item.id, "costPerItemUSD", parseFloat(e.target.value))}
                        className="w-20 border rounded px-2 py-1 text-sm font-bold text-gray-800 mb-1" 
                      />
                      <p className="text-[10px] text-gray-500">{costLBP.toLocaleString()} L.L</p>
                    </td>
                    <td className="p-4">
                      <input 
                        type="number" step="0.01"
                        value={item.sellingPriceUSD} 
                        onChange={(e) => updateItemInTable(item.id, "sellingPriceUSD", parseFloat(e.target.value))}
                        className="w-20 border rounded px-2 py-1 text-sm font-bold text-[#F97316] mb-1" 
                      />
                      <p className="text-[10px] text-gray-500">{sellLBP.toLocaleString()} L.L</p>
                    </td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        value={item.itemsPerBox} 
                        onChange={(e) => updateItemInTable(item.id, "itemsPerBox", parseInt(e.target.value))}
                        className="w-16 border rounded px-2 py-1 text-sm font-medium" 
                      />
                    </td>
                    <td className="p-4 text-sm font-bold">${(item.costPerItemUSD * item.itemsPerBox).toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 px-3 py-1.5 rounded">Remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {receiptItems.length === 0 && <p className="p-8 text-center text-gray-500">No items added yet. Scan or type above to add.</p>}
        </div>

        {/* Totals & Save */}
        <div className="bg-[#FFF4EC] border border-[#F97316]/30 p-6 rounded-2xl flex items-center justify-between">
          <div>
             <p className="text-sm font-bold text-gray-600">Total Cost (USD)</p>
             <p className="text-3xl font-extrabold text-[#1E3A8A]">${totalCostUSD.toFixed(2)}</p>
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-gray-600">Total Cost (LBP)</p>
             <p className="text-2xl font-extrabold text-[#F97316]">{totalCostLBP.toLocaleString()} L.L</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSaveReceipt} disabled={loading} className="bg-[#1E3A8A] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition shadow-lg disabled:bg-gray-400">
             {loading ? "Saving..." : "Save Receipt & Update Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}