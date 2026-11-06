import { prisma } from "@/lib/db";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/components/AddToCartButton";

async function AllProductsList() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  if (products.length === 0) {
    return <p className="text-gray-500 text-center">No products available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-[1.2rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden">
          
          <div className="h-48 bg-[#F8F9FA] w-full flex items-center justify-center relative p-4">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
               <span className="text-5xl">🛍️</span>
            )}
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category.name}</p>
            <h3 className="text-[17px] font-bold text-[#1E3A8A] leading-tight mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-[13px] text-gray-500 line-clamp-2 mb-4 flex-grow">
              {product.description || "Fresh and high quality."}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[20px] font-extrabold text-[#1E3A8A]">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <AddToCartButton product={{ id: product.id, name: product.name, price: product.price }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16 pt-8">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold text-[#1E3A8A]">All Products</h1>
          <div className="w-12 h-1 bg-[#F97316] mt-2 rounded-full"></div>
        </div>
        
        <Suspense fallback={<p className="text-gray-500 animate-pulse">Loading products...</p>}>
          <AllProductsList />
        </Suspense>
      </div>
    </main>
  );
}