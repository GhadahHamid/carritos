"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [imageType, setImageType] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [base64Image, setBase64Image] = useState("");

  // Fetch categories for the dropdown
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setBase64Image(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    // If using upload, pass the base64 string. If URL, pass the URL.
    const finalImage = imageType === "url" ? imageUrl : base64Image;

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string),
        stock: parseInt(formData.get("stock") as string),
        categoryId: formData.get("categoryId"),
        imageUrl: finalImage,
      }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      alert("Error adding product");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E3A8A]">Add New Product</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to add an item to your store.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Product Name</label>
            <input type="text" name="name" required placeholder="e.g. Oreo Cookies" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
            <select name="categoryId" required className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition cursor-pointer">
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
          <textarea name="description" rows={3} placeholder="Short product description..." className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition resize-none"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Price ($)</label>
            <input type="number" name="price" step="0.01" required placeholder="2.50" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Stock Quantity</label>
            <input type="number" name="stock" required placeholder="50" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" />
          </div>
        </div>

        {/* Image Section */}
        <div className="border-t border-gray-100 pt-6">
          <label className="block text-sm font-bold text-gray-900 mb-4">Product Image</label>
          
          <div className="flex gap-4 mb-4">
            <button type="button" onClick={() => setImageType("url")} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${imageType === "url" ? "bg-[#1E3A8A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              From Internet (URL)
            </button>
            <button type="button" onClick={() => setImageType("upload")} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${imageType === "upload" ? "bg-[#1E3A8A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              From Desktop (Upload)
            </button>
          </div>

          {imageType === "url" ? (
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316]" />
          ) : (
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-[#1E3A8A] hover:file:bg-blue-100 transition cursor-pointer" />
          )}

          {/* Image Preview */}
          {(imageUrl || base64Image) && (
            <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50 flex justify-center">
              <img src={imageType === "url" ? imageUrl : base64Image} alt="Preview" className="h-32 object-contain mix-blend-multiply" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" disabled={loading} className="bg-[#F97316] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 disabled:bg-gray-400">
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}