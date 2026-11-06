"use client";

import { useState, useEffect } from "react";

export default function ManageCategories() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories on load
  const fetchCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setName("");
      fetchCategories(); // Refresh the list
    } else {
      alert("Failed to add category (it might already exist).");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E3A8A]">Manage Categories</h1>
        <p className="text-gray-500 mt-1">Create sections for your shop (e.g., Snacks, Drinks, Cleaning).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Add Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#1E3A8A] mb-4">Add Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cleaning Products"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F97316] text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 disabled:bg-gray-400"
              >
                {loading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: List of Categories */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Link (Slug)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-[#1E3A8A]">{cat.name}</td>
                    <td className="p-4 text-sm text-gray-500">/category/{cat.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {categories.length === 0 && (
              <p className="p-8 text-center text-gray-500">No categories yet. Add one on the left.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}