import { prisma } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";

async function AllCategories() {
  const categories = await prisma.category.findMany();

  const categoryImages: Record<string, string> = {
    "fresh-produce": "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=400&fit=crop",
    "bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    "dairy-eggs": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    "snacks": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
    "beverages": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop",
    "pantry-staples": "https://images.unsplash.com/photo-1584473457409-ceb3f73f6f22?w=400&h=400&fit=crop",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/category/${category.slug}`}
          className="group bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-5 group-hover:scale-105 transition-transform overflow-hidden">
            <img 
              src={categoryImages[category.slug] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"} 
              alt={category.name} 
              className="w-full h-full object-cover mix-blend-multiply" 
            />
          </div>
          <h3 className="text-[18px] font-bold text-[#1E3A8A] text-center">{category.name}</h3>
        </Link>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16 pt-8">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-10 text-center">
          <h1 className="text-[32px] font-extrabold text-[#1E3A8A] mb-2">All Categories</h1>
          <p className="text-gray-500">Browse our wide selection of products</p>
        </div>
        
        <Suspense fallback={<p className="text-gray-500 animate-pulse text-center">Loading categories...</p>}>
          <AllCategories />
        </Suspense>
      </div>
    </main>
  );
}