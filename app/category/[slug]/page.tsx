import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/components/AddToCartButton";
import Image from "next/image";

async function ProductsList({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { products: true },
  });

  if (!category) notFound();

  return (
    <div>
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E3A8A] capitalize">{category.name}</h1>
        <p className="text-gray-500 mt-2">{category.products.length} items available</p>
      </div>
      
      {/* Product Grid */}
      {category.products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No products in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {category.products.map((product) => (
            <div key={product.id} className="bg-white rounded-[1.2rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden">
              
            {/* Product Image - Made shorter on mobile so it fits the card */}
            <div className="h-32 md:h-40 bg-[#F8F9FA] w-full flex items-center justify-center relative p-2 md:p-4">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              ) : (
                 <span className="text-4xl">🛍️</span>
              )}
            </div>

            {/* Product Details */}
            <div className="p-3 md:p-4 flex flex-col flex-grow">
              <h3 className="text-[13px] md:text-[16px] font-bold text-[#1E3A8A] leading-tight mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-[10px] md:text-[12px] text-gray-500 line-clamp-2 mb-2 md:mb-3 flex-grow">
                {product.description || "Fresh and high quality."}
              </p>
              
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <span className="text-[16px] md:text-[18px] font-extrabold text-[#1E3A8A]">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <AddToCartButton product={{ id: product.id, name: product.name, price: product.price }} />
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 py-4 mb-8">
        <div className="max-w-[1400px] mx-auto px-8">
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-[#F97316] flex items-center gap-1 transition">
            &larr; Back to Categories
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8">
        <Suspense fallback={<p className="text-gray-500 animate-pulse">Loading products...</p>}>
          <ProductsList params={params} />
        </Suspense>
      </div>
    </main>
  );
}