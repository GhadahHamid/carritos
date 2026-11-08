"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      fetch(`/api/inventory/${p.id}`)
        .then(res => res.json())
        .then(data => setProduct(data));
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          price: parseFloat(formData.get("price") as string),
          stock: parseInt(formData.get("stock") as string),
          imageUrl: formData.get("imageUrl"),
          barcode: formData.get("barcode"),
          needsMaintenance: false, // <--- ADD THIS LINE
        }),
      });
    
    router.push("/admin/inventory");
    router.refresh();
  };

  if (!product) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold text-[#1E3A8A] mb-8">Edit Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
          <input type="text" name="name" defaultValue={product.name} className="w-full border rounded-lg px-4 py-2 text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
          <textarea name="description" defaultValue={product.description} rows={3} className="w-full border rounded-lg px-4 py-2 text-gray-900"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
            <input type="number" step="0.01" name="price" defaultValue={product.price} className="w-full border rounded-lg px-4 py-2 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
            <input type="number" name="stock" defaultValue={product.stock} className="w-full border rounded-lg px-4 py-2 text-gray-900" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Barcode</label>
          <input type="text" name="barcode" defaultValue={product.barcode} className="w-full border rounded-lg px-4 py-2 text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
          <input type="text" name="imageUrl" defaultValue={product.imageUrl} className="w-full border rounded-lg px-4 py-2 text-gray-900" />
        </div>
        
        <div className="pt-4 border-t flex justify-end">
          <button type="submit" disabled={loading} className="bg-[#F97316] text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}